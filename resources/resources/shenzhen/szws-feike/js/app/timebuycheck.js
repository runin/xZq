
(function($) {
     H.timebuy =
        {
            nowTime: null,
            first: true,
            istrue: false,
            pal:[],
            repeat_load: true, //用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
            dec: 0, //服务器时间和本地时间的时差
            firstPra: null, //第一轮摇奖活动 用来重置倒计时
            type: 2, //判断倒计时形式 1为抽奖开始之前，2为抽奖正在播出 默认为2
            init: function() 
            {
                // this.current_time();
            },
            current_time: function() 
            {
                    var me = this;
                    $.ajax({
                        type: 'GET',
                        async: false,
                        url: domain_url + 'api/lottery/round' + dev,
                        data: {at:5},
                        dataType: "jsonp",
                        jsonpCallback: 'callbackLotteryRoundHandler',
                        timeout: 11000,
                        complete: function() {},
                        success: function(data) {
                        },
                        error: function(xmlHttpRequest, error) {
                          
                        }
                    });
            },
            worldTips : function(){
            var color=["blue","green","yellow"]
            var index = 0;
            var i = 0;
            var word = "限时购";
            var typeWord = function(){
                if(index <= word.length){
                    $(".nav-middle").html(word.substring(0,index++) + "<img src='images/icon-middle.png'>") ;
                    // $(".nav-middle").css({"color":color[i++/3],"font-size":"18px"});
                }else{
                    // $(".nav-middle").css({"color":"#fff","font-size":"17px"});
                    clearInterval(timer);
                    return;
                }      
            };
            var timer = setInterval(function(){
                typeWord();
            },800);
           },
            currentPrizeAct: function(data)
                 {
                    var me = this,
                        nowTimeStr = me.nowTime,
                        prizeActListAll = data.la,
                        prizeLength = 0,
                        prizeActList = [];
                    var day = nowTimeStr.split(" ")[0];
                    if (prizeActListAll && prizeActListAll.length > 0) {
                        for (var i = 0; i < prizeActListAll.length; i++) {
                            if (prizeActListAll[i].pd == day) {
                                prizeActList.push(prizeActListAll[i]);
                            }
                        };
                    }
                    me.pal = prizeActList;
                    prizeLength = prizeActList.length;
                    if (prizeActList.length > 0) {
                        for (var i = 0; i < prizeActList.length; i++) {
                            var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                            var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                            //在活动时间段内且可以抽奖
                            if (comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0) {
                                //H.lottery.getPort();
                                me.index = i;
                                me.nowCountdown(prizeActList[i]);
                                hidenewLoading();
                                return;
                            }
                        }
                    }
            },
            // 摇奖结束倒计时
            nowCountdown: function(pra) {
                var me = this;
                me.type = 2;
                me.istrue = true;
                $(".nav-middle img").addClass("wobble");
                var endTimeStr = pra.pd+" "+pra.et;
                var beginTimeLong = timestamp(endTimeStr);
                beginTimeLong += me.dec;
                $('.detail-countdown1').attr('etime', beginTimeLong);
                // setInterval(function()
                // {
                //     me.worldTips();
                // },4000);
                me.count_down();
                me.index++;
                hidenewLoading();
            },
            refreshDec:function()
            {
                var me = this;
                //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
                var dely = Math.ceil(60000*5*Math.random() + 60000*3);
                setInterval(function(){
                    $.ajax({
                        type : 'GET',
                        async : false,
                        url : domain_url + 'api/common/time',
                        data: {},
                        dataType : "jsonp",
                        jsonpCallback : 'commonApiTimeHandler',
                        timeout: 11000,
                        complete: function() {
                        },
                        success : function(data) {
                            if(data.t){
                                var nowTime = Date.parse(new Date());
                                me.dec = nowTime - data.t;
                            }
                        },
                        error : function(xmlHttpRequest, error) {
                        }
                    });
                },dely);
             },
             count_down: function()
             {
                var me = this;
                $('.detail-countdown1').each(function() {
                    var $me = $(this);
                    $(this).countDown({
                        etpl : '%H%'+':'+'%M%' + ':' + '%S%'+'', // 还有...结束
                        stpl : '%H%'+':'+'%M%' + ':' + '%S%'+'', // 还有...开始
                        sdtpl : '',
                        otpl : '',
                        otCallback : function() {
                            // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                            // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                            // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                            // isTimeOver 用来进行重复判断默认为false，第一次进入之后变为true
                           
                            if(me.istrue){
                                me.istrue = false;
                                if(me.type == 1) {              
                                    me.nowCountdown(H.lottery.pal[H.lottery.index]);
                                }
                                else
                                {
                                    $(".nav-middle img").removeClass("wobble");
                                     return;
                                } 
                            }
                                
                        },
                        sdCallback :function(){
                           me.istrue = true;
                        }
                    });
                });
             },
        }
})(Zepto);
$(function() {
    H.timebuy.init();
});