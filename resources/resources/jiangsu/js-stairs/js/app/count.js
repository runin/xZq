(function($) {
    H.count = {
        first: true,
        type: 2,
        index: 0,
        times: 0,
        endType: 1,
        pal: null,
        nowTime: null,
        roundData: null,
        nextPrizeAct: null,
        lastRound: false,
        isToLottey: true,
        isCanShake: false,
        isTimeOver: false,
        repeat_load: true,
        recordFirstload: true,
        dec:0,
        init: function(){
            var me = this;
            me.current_time();
        },
        ping: function() {
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'api/common/time' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback: 'commonApiTimeHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.t){
                        var nowTimeStemp = new Date().getTime();
                        H.count.dec = nowTimeStemp - data.t*1;
                    }
                }
            });
        },
        //查抽奖活动接口
        current_time: function(){
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    if(!data.result || data.flow == 1){
                        if(H.count.repeat_load){
                            H.count.repeat_load = false;
                            setTimeout(function(){
                                H.count.current_time();
                            },500);
                        }
                    }else{
                        H.count.nowTime = timeTransform(data.sctm);
                        var nowTimeStemp = new Date().getTime();
                        H.count.dec = nowTimeStemp - data.sctm;
                        H.count.roundData = data;
                        H.count.currentPrizeAct(data);
                    }
                },
                error : function(xmlHttpRequest, error) {
                    if(H.count.repeat_load) {
                        H.count.repeat_load = false;
                        setTimeout(function(){
                            H.count.current_time();
                        },500);
                    }
                }
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this, nowTimeStr = this.nowTime, prizeActList = data.la, prizeLength = 0;
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.type = 3;
                    me.endType = 3;
                    // 最后一轮摇奖结束，结束页
                    H.count.showOver();
                    return;
                }
                setInterval(function(){
                    H.count.ping();
                },10000);

                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        if(i < prizeActList.length - 1){
                            var nextBeginTimeStr = prizeActList[i + 1].pd + " " + prizeActList[i + 1].st;
                            if(comptime(endTimeStr, nextBeginTimeStr) <= 0){
                                me.endType = 2;
                                // 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
                                me.lastRound = false;
                                me.nextPrizeAct = prizeActList[i+1];
                            } else {
                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                me.endType = 1;
                            }
                        }else{
                            // 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
                            me.endType = 3;
                            me.lastRound = true;
                        }
                        me.nowCountdown(prizeActList[i]);
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        me.beforeCountdown(prizeActList[i]);
                        return;
                    }
                }
            }
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.count.dec;
            $('.lottery-countdown').attr('etime',beginTimeLong).empty();
            $(".lottery-tip").html('距本轮摇奖开始');
            me.count_down();
            $(".lottery-countdown").removeClass("none");
            $('.lottery-cd').removeClass('none');
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            hidenewLoading();
            $('.shake-wrapper').addClass('none');
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.count.dec;
            $('.lottery-countdown').attr('etime',beginTimeLong).empty();
            $(".lottery-tip").html("距本轮摇奖结束");
            me.count_down();
            $(".lottery-countdown").removeClass("none");
            $('.lottery-cd').removeClass('none');
            me.index++;
            hidenewLoading();
            $('#popup-lottery, .shake-wrapper').removeClass('none');
            $('.lottery-cd').addClass('none');
        },
        count_down: function() {
            var me = this;
            $('.lottery-countdown').each(function() {
                $(this).countDown({
                    etpl: '<label>%H%</label>' + '小时' + '<label>%M%</label>' + '分' + '<label>%S%</label>' + '秒', // 还有...结束
                    stpl: '<label>%H%</label>' + '小时' + '<label>%M%</label>' + '分' + '<label>%S%</label>' + '秒', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.type == 1){
                            //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                            if(!me.isTimeOver){
                                me.isTimeOver = true;
                                $('.lottery-tip').html('请稍后');
                                $(".lottery-countdown").addClass("none");
                                setTimeout(function() {
                                    me.nowCountdown(me.pal[me.index]);
                                }, 1000);
                            }
                        }else if(me.type == 2){
                            //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                            if(!me.isTimeOver){
                                me.isTimeOver = true;
                                if(me.index >= me.pal.length){
                                    $(".lottery-countdown").addClass("none");
                                    me.type = 3;
                                    // 最后一轮摇奖结束，结束页
                                    H.count.showOver();
                                    return;
                                }
                                $('.lottery-tip').html('请稍后');
                                $(".lottery-countdown").addClass("none");
                                var i = me.index - 1;
                                if(i < me.pal.length - 1){
                                    var endTimeStr = me.pal[i].pd + " " + me.pal[i].et;
                                    var nextBeginTimeStr = me.pal[i + 1].pd + " " + me.pal[i + 1].st;
                                    if(comptime(endTimeStr,nextBeginTimeStr) <= 0){
                                        // 有下一轮并且下一轮的开始时间和本轮的结束时间重合
                                        me.endType = 2;
                                    } else {
                                        // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                        me.endType = 1;
                                    }
                                }
                                setTimeout(function(){
                                    if(me.endType == 2){
                                        me.nowCountdown(me.pal[me.index]);
                                    }else if(me.endType == 1){
                                        me.beforeCountdown(me.pal[me.index]);
                                    }
                                },1000);
                            }
                        }else{
                            me.isCanShake = false;
                        }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        showOver: function(){
            $(".lottery-tip").html('当天摇奖已结束');
            $(".lottery-countdown").empty().addClass("none");
            $('.lottery-cd').removeClass('none');
            $('.shake-wrapper').addClass('none');
        }
    };
})(Zepto);
$(function(){
    H.count.init();
});