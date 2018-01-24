/**
 * 老三热线--积分抽奖页
 */
(function($){
    H.jfcj = {
        ui: 0,//积分抽奖机会所扣积分值
        in: 0,//用户自身总积分
        luckyWheel: [],
        init: function(){
            this.event();
            this.self();
            this.lotteryRound();
        },
        event: function(){
            var me = H.jfcj;
            $("#back").click(function(e){
                e.preventDefault();
                toUrl('jfbk.html');
            });
            $("#btn-lottery").click(function(e) {
                e.preventDefault();
                /*if ($(this).hasClass('disabled')) {
                    return;
                }
                $(this).addClass('disabled');*/

                if(me.in < me.ui){
                    showTips('抱歉，您的积分值不够！');
                    return;
                }
                H.jfcj.drawlottery();
            });
        },
        //查询用户信息
        self: function(){
            getResult('api/lottery/integral/rank/self', {oi: openid}, 'callbackIntegralRankSelfRoundHandler', true);
        },
        lotteryRound: function(){
            getResult('api/lottery/round', {at: 3}, 'callbackLotteryRoundHandler', true);
        },
        lotteryPrizes: function(){
            getResult('api/lottery/prizes', {at: 3}, 'callbackLotteryPrizesHandler', true);
        },
        drawlottery:function(){
            var me = H.jfcj;
            var sn = new Date().getTime()+'';
            shownewLoading();
            recordUserOperate(openid, "调用积分抽奖接口", "doIntegralLottery");
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck4Integral' + dev,
                data: {
                    matk: matk,
                    sn : sn
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuck4IntegralHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                    sn = new Date().getTime()+'';
                },
                success : function(data) {
                    me.self();
                    if(data && data.result){
                        if(data.sn == sn){
                            me.lottery_point(data);
                        }
                    }
                },
                error : function() {}
            });
        },
        isShow : function($target, isShow){
            var $target = $('.' + $target);
            $target.removeClass('none');
            isShow ? $target.show() : $target.hide();
        },
        fill : function(data){
            var meDialog = H.dialog;
            if(data){
                if(data.result == true){
                    switch (data.pt){
                         case 0://谢谢参与
                            showTips("太可惜了，竟然与大奖擦肩而过");
                             setTimeout(function(){
                                 $('#btn-lottery').animate({'-webkit-transform': 'rotate(360deg)'}, 300);
                             }, 800);
                            break;
                        case 1://实物奖品
                            meDialog.swLottery.open(data);
                            break;
                        case 2://积分奖品
                            meDialog.jfLottery.open(data);
                            break;
                        case 9://外链奖品
                            meDialog.wlLottery.open(data);
                            break;
                        /*default:
                         meDialog.lottery.open(data);*/
                    }
                }
            }
        },
        lottery_point : function(data){
            // 奖项列表
            awards = H.jfcj.luckyWheel;
            // 初始化大转盘
            var lw = new luckWheel(
                {
                    items : awards,
                    // 回调函数
                    callback : function() {
                        H.jfcj.fill(data);
                    }
                });

            lw.run(data.px);
        }
    };
    W.luckWheel = function(opt) {
        var wheelRepeat = 9, durationTime = 16000;
        var _opt = {
            // 奖项列表
            items : [],
            // 时间长度
            duration : durationTime,
            // 重复转圈次数
            repeat : wheelRepeat,
            // 回调函数
            callback : function() {
            }
        };

        for ( var key in _opt) {
            this[key] = opt[key] || _opt[key];
        }

        this.run = function(v) {
            var me = this, bingos = [], len = this.items.length;
            var index = parseInt(v), amount = 360 / len, fix = amount / 5;
            var low = index * amount + fix,
                top = (index + 1) * amount - fix,
                range = top - low,
                turnTo = low + getRandomArbitrary(0, range + 1);

            $("#btn-lottery").rotate({
                angle : 0,
                animateTo : turnTo + this.repeat * 360,
                duration : this.duration,
                callback : function() {
                    me.callback(index);
                }
            });
        };
    };

    W.callbackLotteryRoundHandler = function(data){
        if(data && data.result){
            var me = H.jfcj;
            me.ui =  data.la[0].ui;
            $("#img_lottery_bg").attr("src", data.la[0].bi);
            $(".lottey-draw").removeClass("none");
            me.lotteryPrizes();
        }
    };

    W.callbackLotteryPrizesHandler = function(data){
        if(data && data.result){
            H.jfcj.luckyWheel = data.pa;
        }
    };

    W.callbackIntegralRankSelfRoundHandler = function(data) {
        if (data.result) {
            H.jfcj.in = data.in;
            $(".sum-jf").text('我的积分：'+ data.in || 0);
        }
    };

})(Zepto);
$(function(){
    H.jfcj.init();
});

