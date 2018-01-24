(function($) {
    H.win = {
        isSendAward:false,
        canGo:false,
        awards:'',
        init:function(){
            $("#img_lottery_bg").attr("src", lottery_bg);
            this.event();
            this.init_prize();
        },
        event:function(){
            $("#submit_btn").click(function() {
                H.win.submitAward();
            });

            $("#lottery-btn").click(function() {
                H.win.lottery();
            });
        },
        init_prize:function(){
            getResult('api/lottery/prizes','callbackLotteryPrizesHandler',true);
        },
        jsmain:function(){
            var height = $(window).height();
            if($('.main').has(".winmain")){
                $('.main').css('minHeight', height - 80);
            }else{
                $('.main').css('minHeight', height - 40);
            }
        },
        submitAward:function(){
            if(this.isSendAward)
                return;
            this.isSendAward = true;
            $("#submit_btn").attr('class', 'btned');
            var phone = $("#phone").val();
            if(phone=='' || phone.length != 11){
                alert("请输入正确的手机号码！");
                this.isSendAward = false;
                $("#submit_btn").attr('class', 'btn');
                $("#phone").focus();
                return;
            }
            $.ajax({
                type : "get",
                async : false,
                url : domain_url + "api/lottery/award",
                data:{oi:openid,ph:$("#phone").val()},
                dataType : "jsonp",
                jsonp : "callback",
                jsonpCallback : "callbackLotteryAwardHandler",
                success : function(data) {
                    console.log(data);
                    if(data.result){
                        $("#input_phone_div").addClass("none");
                        $("#phone_html").html($("#phone").val());
                        $("#phone_label").removeClass("none");
                        $("#submit_btn").addClass("none");
                        $("#goBack_btn").removeClass("none");
                    }else{
                        $("#submit_btn").attr('class', 'btn');
                        this.isSendAward = false;
                    }
                },
                error : function() {
                    $("#submit_btn").attr('class', 'btn');
                    this.isSendAward = false;
                }
            });
        },
        lottery:function(){
            if (this.canGo) {
                return;
            }
            this.canGo = true;
            $.ajax({
                type : "get",
                async : false,
                url : domain_url + "api/lottery/luck",
                data : {
                    oi : openid
                },
                dataType : "jsonp",
                jsonp : "callback",
                jsonpCallback : "callbackLotteryLuckHandler",
                success : function(data) {
                    if (data.result) {
                        // 初始化大转盘
                        var lw = new luckWheel({
                            items : H.win.awards,
                            // 回调函数
                            callback : function(i) {
                                if(data.result){
                                        if(data.pt == 1){
                                            $("#prize_name").empty().html(data.pn + "一" + data.pu);
                                            $("#input_phone_div").removeClass("none");
                                        }else if (data.pt == 2) {
                                            $("#prize_name").empty().html(data.pn);
                                            $("#integral_desc").removeClass("none");
                                            $("#submit_btn").addClass("none");
                                            $("#goBack_btn").removeClass("none");
                                        }
                                        $("#hj_box").removeClass("none");
                                        window.location.hash="anchor";
                                        $("#phone").val(data.ph);
                                        $("#phone").focus();
                                        $('.tip').append(data.tt);
                                        H.win.jsmain();
                                        var height = $('#winmain').height();
                                        $('body').css('minHeight', height + 80);
                                } else {
                                    alert("您未抽中奖品，感谢您的参与！");
                                    location.href = "index.html";
                                }
                            }
                        });
                        if (data.px >= 1) {
                            lw.run(H.win.awards[data.px - 1]);
                        }
                    } else {
                        var url = "index.html";
                        if (gefrom != null && gefrom != '') {
                            url = url + "?gefrom=" + gefrom;
                        }
                        location.href = url;
                    }
                },
                error : function() {
                    var url = "index.html";
                    if (gefrom != null && gefrom != '') {
                        url = url + "?gefrom=" + gefrom;
                    }
                    location.href = url;
                }
            });
        }
    };

    W.luckWheel = function(opt) {
        var _opt = {
            // 奖项列表
            items : [],
            // 时间长度
            duration : 7500,
            // 重复转圈次数
            repeat : 2,
            // 回调函数
            callback : function() {
            }
        };

        for ( var key in _opt) {
            this[key] = opt[key] || _opt[key];
        }

        this.run = function(v) {
            var bingos = [], index, me = this;
            for ( var i = 0, len = this.items.length; i < len; i++) {
                if (this.items[i] == v) {
                    bingos.push(i);
                }
            }

            index = bingos[(new Date()).getTime() % bingos.length];
            var amount = 360 / len, fix = amount / 5, low = index * amount + fix, top = (index + 1)
                * amount - fix, range = top - low, turnTo = low
                + (new Date()).getTime() % range;

            $("#lottery-btn").rotate({
                angle : 0,
                animateTo : turnTo + this.repeat * 360,
                duration : this.duration,
                callback : function() {
                    me.callback(index);
                }
            });
        };
    };

    var callbackLotteryLuckHandler = function(data) {
    };
    var callbackLotteryAwardHandler = function(data) {
    };

    W.callbackLotteryPrizesHandler = function(data){
        if(data.result){
            H.win.awards = data.pa;
        }
    };
})(Zepto);

$(function() {
    H.win.init();
});