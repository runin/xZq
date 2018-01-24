/**
 * 老三热线--每日签到页
 */
(function($){
    H.mrqd = {
        $qiandao: $("#qiandao"),
        bt: '',
        currentTime: '',
        puid: '',
        init: function(){
            this.event();
            this.round_sign();
            this.pre_dom();
        },
        pre_dom: function(){
            var height = $(window).height(), width = $(window).width();
            $('body').css({
                'width': width,
                'height': height
            });
            $('.headimgurl img').attr('src',headimgurl ? (headimgurl + '/' + yao_avatar_size) : './images/avatar.png');
            $('.nikename').text(nickname ? nickname : '匿名观众');
        },
        //获取签到活动
        round_sign: function(){
            getResult('api/sign/round', {}, 'callbackSignRoundHandler', true);
        },
        //获取签到记录
        myrecord_sign: function(){
            getResult("api/sign/myrecord", {yoi:openid, bt:H.mrqd.bt },"callbackSignMyRecordHandler",true);
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        event: function(){
            var me = H.mrqd;
            $("#back").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('jfbk.html');
            });
            me.$qiandao.click(function(e) {
                e.preventDefault();
                var thisMe =  $(this);
                if(thisMe.hasClass("disabled")){
                    //showTips("抱歉！今天已经签过到了");
                }else{
                    me.btn_animate($(this));
                    $.ajax({
                        type : 'GET',
                        async : false,
                        url : domain_url + 'api/sign/signed' + dev,
                        data: {
                            yoi:openid, auid:H.mrqd.puid, wxnn:nickname, wxurl:headimgurl
                        },
                        dataType : "jsonp",
                        jsonpCallback : 'callbackSignSignedHandler',
                        timeout: 11000,
                        complete: function() {
                        },
                        success : function(data) {
                            if(data.code == 0){
                                thisMe.addClass("disabled").text("已签到");
                                var $li = $("li");
                                $.each($li, function(i,item){
                                    if($li.eq(i).attr("date") == me.currentTime){
                                        $li.eq(i).addClass("qded");
                                    }
                                });

                                if(data.signVal){
                                    $("#success label").text(data.signVal);
                                    $("#success").removeClass("none");
                                }
                            }
                        },
                        error : function(xmlHttpRequest, error) {}
                    });
                }
            })
        },
        dayNumOfMonth: function (data)
        {
            var date = new Date(),me = H.mrqd;
            var month = date.getMonth()+1,
                year = date.getFullYear();
                date = (date.getDate()<10?"0":"")+date.getDate();

            month =(month<10 ? "0"+month:month);

            var dayNum = new Date(year,month,0);

            $("#time .year").text(year + "年");
            $("#time .month").text(month + "月");
            $("#time .date").text(date + "日");

            console.log("当月多少天="+ dayNum.getDate());
            me.bt = year + "-" + month + "-01";
            me.currentTime = year + "-" + month + "-" + date;
            $.each(data.items, function(i,item){
                var serverST = item.st;
                if(new Date(me.currentTime).getTime() === new Date(serverST.split(" ")[0]).getTime()){
                    me.puid = item.uid;
                }
            });
            this.spellQdjl(dayNum.getDate(), year, month, data);
            this.myrecord_sign();
        },
        spellQdjl: function(sum, year, month, data){
            var t = simpleTpl();
            for(var i = 0; i < sum; i++){
                var date = ((i+1) < 10? "0": "")+(i+1),
                    isNone = i == 30 ? "none" : "";
                t._('<li date="'+ year + "-" + month + "-" + date +'">')
                    ._('<label class="date" data-id="'+ (i+1)+'">'+ (i+1)+'</label>');
                    if(i == 6  || i == 18){
                        t._('<hr/><hr/>');
                    }else{
                        t._('<hr class="'+ isNone +'"/>');
                    }
                t._('</li>');
            }
            $("#qdjl").append(t.toString());
            this.resize();
        },
        resize: function(){
            var width = $(window).width(),height = $(window).height();
            $('li').css({
                'width':  300/6
            });
            $('ul').css({
                'left':  (width-((300/6)*5+ 20))/2
            });
        }
    };
    W.callbackSignRoundHandler = function(data){
        var me = H.mrqd;
        if(data.code == 0){
            me.dayNumOfMonth(data);
        }
    };
    W.callbackSignMyRecordHandler = function(data){
        var me = H.mrqd;
        if(data.code == 0){
            var $li = $('li'),
                flag = true;
            if(data.items.length){
                $.each(data.items, function(i,item){
                    var serverST = item.t;
                    $.each($li, function(j,jtem){
                        if(new Date($li.eq(j).attr('date')).getTime() === new Date(serverST.split(" ")[0]).getTime()){
                            $li.eq(j).addClass("qded");
                        }
                        if(flag){
                            if(me.currentTime === serverST.split(" ")[0]){
                                me.$qiandao.addClass("disabled").text("已签到");
                            }else{
                                me.$qiandao.removeClass("disabled");
                            }
                            flag = false;
                        }

                    });
                });
            }else{
                me.$qiandao.removeClass("disabled");
            }
        }
    };
})(Zepto);
$(function(){
    H.mrqd.init();
});