(function($) {
    H.countDown = {
        periodUuid: getQueryString("periodUuid") || "",//期uuid
        guid: getQueryString("guid") || "",//组uuid
        pid: getQueryString("pid") || "",//选手uuid
        dec: 0,
        type: 2,
        index: 0,
        times: 0,
        endType: 1,
        pal: null,
        nowTime: null,
        pingFlag: null,
        roundData: null,
        nextPrizeAct: null,
        canJump: true,
        wxCheck: false,
        isError: false,
        safeFlag: false,
        lastRound: false,
        isToLottey: true,
        isCanShake: false,
        isTimeOver: false,
        repeat_load: true,
        recordFirstload: true,
        crossLotteryFlag: false,    //跨天摇奖倒计时标识  true为有跨天摇奖 false为没有跨天摇奖
        crossLotteryCanCallback: false,
        lotteryImgList: [],
        lotteryTime: getRandomArbitrary(1,3),
        $progressBarAnswerPage:$('#progress-bar'),
        $giftAnswerPage:$('#gift'),
        $lotteryCountdownAnswerPage:$('#lottery-answerPage'),
        $detail:$('#detail'),
        luckData: null,
        init: function() {
            this.loadImg();
            this.event();
            this.lotteryRound_port();
        },
        loadImg: function(){
            var imgs = [
                "images/item-bg.jpg"
            ];
            loadImg = function () {
                for (var i = 0; i < imgs.length; i++) {//图片预加载
                    var img = new Image();
                    img.style = "display:none";
                    img.src = imgs[i];
                    img.onload = function () {
                        $("body").animate({'opacity':'1'}, 100);
                    }
                }

            };
            loadImg();
        },
        event: function(){
            var me = this;
            me.$giftAnswerPage.tap(function(e){
                e.preventDefault();
                var markJump = '';
                if(!$(this).hasClass("yao")){
                    return;
                }else{
                    if($("body").attr("data-type") == "details"){
                        markJump = "detailsClick";
                    }else{
                        markJump = "voteClick";
                    }
                    toUrl("lottery.html?markJump="+ markJump +'&periodUuid='+ me.periodUuid +'&guid='+ me.guid +'&pid='+ me.pid);
                }

            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        ping: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/common/time' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'commonApiTimeHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.t){
                        me.safeLotteryMode('off');
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        checkPing: function() {
            var me = this, delay = Math.ceil(60000*2*Math.random() + 60000*1);
            me.pingFlag = setTimeout(function(){
                clearTimeout(me.pingFlag);
                me.ping();
                me.checkPing();
            }, delay);
        },
        lotteryRound_port: function() {
            var me = this;
            shownewLoading();
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryRoundHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.result == true){
                        me.nowTime = timeTransform(data.sctm);
                         var nowTimeStemp = new Date().getTime();
                         me.dec = nowTimeStemp - data.sctm;
                         me.roundData = data;
                         me.currentPrizeAct(data);
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.lotteryRound_port();
                            },500);
                        }else{
                            me.change();
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                    me.safeLotteryMode('on');
                }
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this, nowTimeStr = this.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [], day = nowTimeStr.split(" ")[0];
            // 判断是否为跨天摇奖 配置文件中crossdayLimit跨天摇奖阀值，默认2h
            var lastLotteryEtime = prizeActListAll[prizeActListAll.length - 1].pd + ' ' + prizeActListAll[prizeActListAll.length - 1].et;
            var lastLotteryNtime = prizeActListAll[prizeActListAll.length - 1].nst;
            var crossDay = timeTransform(new Date().setDate(new Date(lastLotteryEtime).getDate() + 1)).split(" ")[0];
            var minCrossDay = crossDay + ' 00:00:00';
            var maxCrossDay = timeTransform(new Date(minCrossDay).getTime() + crossdayLimit);
            if(comptime(lastLotteryNtime, minCrossDay) <= 0 && comptime(lastLotteryNtime, maxCrossDay) >= 0) {
                me.crossLotteryFlag = true;
            } else {
                me.crossLotteryFlag = false;
            }

            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    if (me.crossLotteryFlag) {
                        me.type = 1;
                        me.crossCountdown(prizeActList[prizeLength - 1].nst);
                    } else {
                        me.type = 3;
                        me.endType = 3;
                        me.change();
                    }
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) <= 0 && comptime(nowTimeStr, endTimeStr) >= 0){
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
            }else{
                me.safeLotteryMode('on');
                return;
            }
        },
        safeLotteryMode: function(flag) {
            var me = this;
            if (flag == 'on') {
                me.checkPing();
                me.$lotteryCountdownAnswerPage.addClass('none');
                me.safeFlag = true;
            } else if (flag == 'off') {
                clearTimeout(me.pingFlag);
                me.pingFlag = null;
                me.lotteryRound_port();
                me.$lotteryCountdownAnswerPage.removeClass('none');
                me.safeFlag = false;
            } else {
                me.safeLotteryMode('off');
            };
            hidenewLoading();
        },
        progressChange: function(beginTimeLong, word){
            var me = H.countDown, intervalFlag  = 0;

            clearInterval(intervalFlag);
            me.$progressBarAnswerPage.removeClass("wan init");
            me.$lotteryCountdownAnswerPage.attr('etime',beginTimeLong).empty();
            me.$detail.addClass("none");
            if(word == "距离摇奖开始还有:"){
                me.$lotteryCountdownAnswerPage.removeClass("none");
                me.$giftAnswerPage.removeClass("yao");

                me.$progressBarAnswerPage.addClass("init");
                var sum = 0,flag = true,varWidth = 0,energyWidth = 165;
                intervalFlag = setInterval(function(){
                    if(_ss && flag){
                        sum = _ss;
                        flag = false;
                    }
                    energyWidth = 192;
                    varWidth = energyWidth-energyWidth*(_ss/sum);
                    if(varWidth < 6){
                        varWidth = 6;
                    }
                    me.$progressBarAnswerPage.animate(
                        {"width": varWidth + "px"},
                        500);
                },1000);
            }else if(word == "距离摇奖结束还有:"){
                me.$lotteryCountdownAnswerPage.addClass("none");
                me.$detail.removeClass("none").text("抽奖中");
                me.$giftAnswerPage.addClass("yao");
                me.$progressBarAnswerPage.addClass("wan");
                if(getQueryString('markJump') == "yaoClick"){
                    return;
                }
                var markJump = '';
                if($("body").attr("data-type") == "details"){
                    markJump = "detailsClick";
                }else{
                    markJump = "voteClick";
                }
                toUrl("lottery.html?markJump="+ markJump +'&periodUuid='+ me.periodUuid +'&guid='+ me.guid +'&pid='+ me.pid);

            }else{
                me.$lotteryCountdownAnswerPage.addClass("none");
                me.$detail.removeClass("none").text("已结束");
                me.$giftAnswerPage.removeClass("yao");
                me.$progressBarAnswerPage.css("width","3%!important");
            }
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {console.log("摇奖开启倒计时");
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;

            me.progressChange(beginTimeLong, '距离摇奖开始还有:');

            me.count_down();
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){console.log("摇奖结束倒计时");
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;

            me.progressChange(beginTimeLong, '距离摇奖结束还有:');

            me.count_down();
            me.index++;
            me.canJump = true;
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            hidenewLoading();
        },
        // 跨天摇奖开启倒计时
        crossCountdown: function(nextTime) {
            var me = this;
            me.isCanShake = false;
            me.crossLotteryFlag = false;
            me.crossLotteryCanCallback = true;
            me.type = 1;
            var beginTimeLong = timestamp(nextTime);
            beginTimeLong += me.dec;
            me.count_down();
            hidenewLoading();
        },
        count_down: function() {
            var me = H.countDown,
                $this = me.$lotteryCountdownAnswerPage;
            $this.each(function() {//答题页摇奖倒计时
                $(this).countDownAnswerProgress({
                    etpl : '%SS%'+'s' , // 还有...结束
                    stpl : '%SS%'+'s', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.canJump){
                            if (me.crossLotteryCanCallback) {
                                if(!me.isTimeOver){
                                    var delay = Math.ceil(1000*Math.random() + 500);
                                    me.isTimeOver = true;
                                    me.crossLotteryCanCallback = false;
                                    $this.html('请稍后');
                                    shownewLoading(null, '请稍后...');
                                    setTimeout(function(){
                                        me.lotteryRound_port();
                                    }, delay);
                                }
                            } else {
                                if(me.type == 1){
                                    //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                                    if(!me.isTimeOver){
                                        me.isTimeOver = true;
                                        $this.html('请稍后');
                                        shownewLoading(null,'请稍后...');
                                        setTimeout(function() {
                                            me.nowCountdown(me.pal[me.index]);
                                        }, 1000);
                                    }
                                }else if(me.type == 2){
                                    //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                                    if(!me.isTimeOver){
                                        me.isTimeOver = true;
                                        if(me.index >= me.pal.length){
                                            if (me.crossLotteryFlag) {
                                                me.type = 1;
                                                $this.html('请稍后');
                                                shownewLoading(null,'请稍后...');
                                                setTimeout(function() {
                                                    me.crossCountdown(me.pal[me.pal.length - 1].nst);
                                                }, 1000);
                                            } else {
                                                me.type = 3;
                                                me.change();
                                            }
                                            return;
                                        }
                                        $this.html('请稍后');
                                        shownewLoading(null,'请稍后...');
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
                                            } else {
                                                me.change();
                                            }
                                        },1000);
                                    }
                                }else{
                                    me.isCanShake = false;
                                }
                            }
                        }else{
                            $this.html('请稍后');
                        }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                        /*if(me.type = 1){
                         meAnswer.$progressBarAnswerPage.animate(
                         {"height": 160/_ss + 'px'},
                         500);
                         }*/

                    },
                    stCallback : function(){}
                });
            });

        },
        change: function() {
            var me = H.countDown;
            this.isCanShake = false;
            hidenewLoading();
            me.progressChange();
        }
    };
})(Zepto);

var _ss = 0;//全局变量剩余秒数
$.fn.countDownAnswerProgress = function(options) {
    var defaultVal = {
        // 存放结束时间
        eAttr : 'etime',
        sAttr : 'stime', // 存放开始时间
        wTime : 100, // 以100毫秒为单位进行演算
        etpl : '%SS%', // 还有...结束
        stpl : '%SS%', // 还有...开始
        sdtpl : '已开始',
        otpl : '活动已结束', // 过期显示的文本模版
        stCallback: null,
        sdCallback: null,
        otCallback: null
    };
    var dateNum = function(num) {
        return num < 10 ? '0' + num : num;
    };
    var subNum = function(num){
        numF = num.toString().substring(0,1);
        numS = num.toString().substring(1,num.length);
        _ss = numF + numS;
        return num = numF + numS;
    };
    var s = $.extend(defaultVal, options);
    var vthis = $(this);
    var runTime = function() {
        var nowTime = new Date().getTime();
        vthis.each(function() {
            var nthis = $(this);
            var sorgT = parseInt(nthis.attr(s.sAttr));
            var eorgT = parseInt(nthis.attr(s.eAttr));
            var sT = isNaN(sorgT) ? 0 : sorgT - nowTime;
            var eT = isNaN(eorgT) ? 0 : eorgT - nowTime;
            var showTime = function(rT, showTpl) {
                var ss_ = Math.round(rT / s.wTime);
                ss_ = subNum(dateNum(Math.floor(ss_ *s.wTime/1000)));
                nthis.html(showTpl.replace(/%SS%/, ss_));
            };
            if (sT > 0) {
                showTime(sT, s.stpl);
                s.stCallback && s.stCallback();
            } else if (eT > 0) {
                showTime(eT, s.etpl);
                s.sdCallback && s.sdCallback();
            } else {
                nthis.html(s.otpl);
                s.otCallback && s.otCallback();
            }

        });
    };

    setInterval(function() {
        runTime();
    }, s.wTime);
};
$(function(){
    H.countDown.init();
});
