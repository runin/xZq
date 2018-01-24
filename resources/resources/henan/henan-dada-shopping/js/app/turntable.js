;(function($){
    H.turntable = {
        ui: 0,//积分抽奖机会所扣积分值
        in: 0,//用户自身总积分
        luckyWheel: [],
        init: function(){
            this.event();
            this.self();
            this.lotteryRound();
        },
        event: function(){
            var me = H.turntable;
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
                H.turntable.drawlottery();
            });
        },
        //查询用户信息
        self: function(){
            getResult('api/lottery/integral/rank/self', {oi: openid}, 'callbackIntegralRankSelfRoundHandler', true);
        },
        //查询业务的抽奖活动 at=3 --积分抽奖
        lotteryRound: function(){
            getResult('api/lottery/round', {at: 3}, 'callbackLotteryRoundHandler', true);
        },
        //查询当前抽奖活动奖品
        lotteryPrizes: function(){
            getResult('api/lottery/prizes', {at: 3}, 'callbackLotteryPrizesHandler', true);
        },
        drawlottery:function(){
            var me = H.turntable;
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
                complete: function(data) {
                    hidenewLoading();
                    sn = new Date().getTime()+'';
                    $(".sum-jf").text('你有 '+ (me.in - me.ui)+' 积分');
                    setTimeout(function(){
                        me.self();
                    }, 15000);
                    console.log("complete");
                },
                success : function(data) {
                    if(data && data.result){
                        if(data.sn == sn){
                            me.lottery_point(data);
                        }
                    }
                },
                error : function() {}
            });
        },
        fill : function(data){
            var me = H.turntable,meDialog = H.dialog;
                switch (data.pt){
                    case 0://谢谢参与
                        showTips("太可惜了，竟然与大奖擦肩而过");
                        setTimeout(function(){
                            $('#btn-lottery').animate({'-webkit-transform': 'rotate(360deg)'}, 300);
                        }, 800);
                       break;
                    case 1://实物奖品
                       meDialog.shiwuLottery.open(data);
                       break;
                    case 2://积分奖品
                        console.log("积分奖品");
                        $(".sum-jf").text('你有 '+ (me.in - me.ui + data.pv)+' 积分');
                       meDialog.jfLottery.open(data);
                       break;
                    case 4://现金红包
                        meDialog.redbagLottery.open(data);
                        break;
                    /*case 5://兑换码
                     meDialog.duiHuanMaLottery.open(data);
                     break;
                    case 7://卡劵奖品
                        meDialog.wxcardLottery.open(data);
                        break;*/
                    case 9://外链奖品
                        meDialog.linkLottery.open(data);
                        break;
                }
        },
        lottery_point : function(data){
            // 奖项列表
            awards = H.turntable.luckyWheel;
            // 初始化大转盘
            var lw = new luckWheel(
                {
                    items : awards,
                    // 回调函数
                    callback : function() {
                        H.turntable.fill(data);
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

    //查询用户信息
    W.callbackIntegralRankSelfRoundHandler = function(data) {
        if (data.result) {
            H.turntable.in = data.in;

            $(".sum-jf").text('你有 '+ (data.in || 0)+' 积分');
        }
    };
    //查询业务的抽奖活动 at=3 --积分抽奖
    W.callbackLotteryRoundHandler = function(data){
        if(data && data.result){
            var me = H.turntable,
                imgList = [],
                items = data.la[0].bi;
            me.ui = data.la[0].ui;

            if(items.length > 0){
                me.imgList = items.split(",");
            }

            $(".expend").text("，每次转盘需消耗 " + data.la[0].ui + " 积分");
            $("#img_lottery_bg").attr("src", me.imgList[me.imgList.length - 1]);
            $(".lottey-draw").removeClass("none");
            me.lotteryPrizes();
        }
    };
    //查询当前抽奖活动奖品
    W.callbackLotteryPrizesHandler = function(data){
        if(data && data.result){
            H.turntable.luckyWheel = data.pa;
        }
    };
})(Zepto);
$(function(){
    H.turntable.init();
});