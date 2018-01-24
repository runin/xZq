H.index = {
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
    lotteryTime: getRandomArbitrary(1,2),
    init: function() {
        this.event();
        this.resize();
        this.lotteryRound_port();
        this.shake();
        $(".snow-canvas").snow();
    },
    resize: function() {
        var me = this, winW = $(window).width(), winH = $(window).height();
        if(!is_android()){
            $(".main-top").css("height", (winH / 2) + "px").css('top', '0');
            $(".main-foot").css("height", (winH / 2) + "px").css('bottom', '0');
        } else {
            $(".main-top").css("height", (winH / 2 + 0.5) + "px").css('top', '0');
            $(".main-foot").css("height", (winH / 2 + 0.5) + "px").css('bottom', '0');
        }
    },
    event: function() {
        var me = this;
        $('body').delegate('#test', 'click', function(e) {
            e.preventDefault();
            me.lotteryTime = 1;
            me.shake_listener();
        });
        $('#btn-go2headline').click(function(e){
            e.preventDefault();
            if(!$(this).hasClass('requesting')){
                $(this).addClass('requesting');
                toUrl('headline.html');
            }
        });
    },
    shake: function() {
        W.addEventListener('shake', H.index.shake_listener, false);
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
    safeLotteryMode: function(flag) {
        var me = this;
        if (flag == 'on') {
            me.checkPing();
            $('.marquee, .count').addClass('hidden');
            $('.fail-tips').removeClass('none');
            me.safeFlag = true;
        } else if (flag == 'off') {
            clearTimeout(me.pingFlag);
            me.pingFlag = null;
            me.lotteryRound_port();
            $('.fail-tips').addClass('none');
            me.safeFlag = false;
        } else {
            me.safeLotteryMode('off');
        };
        hidenewLoading();
    },
    shake_listener: function() {
        if (!H.index.safeFlag) {
            if(H.index.isCanShake){
                H.index.isCanShake = false;
                H.index.canJump = false;
            }else{
                return;
            }
            if (H.index.type != 2) {
                return;
            }
            H.index.times++;
            if(!(H.index.times % H.index.lotteryTime == 0)){
                H.index.isToLottey = false;
            }
        }
        if(!$(".home-box").hasClass("yao")) {
            $("#audio-a").get(0).play();
            $(".m-t-b").css({
                '-webkit-transition': '-webkit-transform .2s ease',
                '-webkit-transform': 'translate3d(0,-100px,0)'
            });
            $(".m-f-b").css({
                '-webkit-transition': '-webkit-transform .2s ease',
                '-webkit-transform': 'translate3d(0,100px,0)'
            });
            setTimeout(function(){
                $(".m-t-b").css({
                    '-webkit-transform': 'translate3d(0,0,0)',
                    '-webkit-transition': '-webkit-transform .5s ease'
                });
                $(".m-f-b").css({
                    '-webkit-transform': 'translate3d(0,0,0)',
                    '-webkit-transition': '-webkit-transform .5s ease'
                });
            }, 1000);
            $(".home-box").addClass("yao");
        }
        if(!openid || openid=='null' || H.index.isToLottey == false || H.index.safeFlag == true) {
            setTimeout(function(){
                H.index.fill(null);//摇一摇
            }, 1500);
        } else {
            H.index.drawlottery();
        }
        H.index.isToLottey = true;
    },
    imgMath: function() {//随机背景
        var me = this;
        if(me.lotteryImgList.length >0){
            var i = Math.floor((Math.random()*me.lotteryImgList.length));;
            $("body").css("background","url('" + me.lotteryImgList[i] + "') no-repeat center center");
        }
    },
    downloadImg: function(){
        var me = this, t = simpleTpl();
        if($(".preImg")){
            $(".preImg").remove();
        }
        for(var i = 0;i < me.lotteryImgList.length;i++){
            t._('<img class="preload preImg" src="'+me.lotteryImgList[i]+'">')
        };
        $("body").append(t.toString());
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
        if(comptime(lastLotteryNtime, minCrossDay) < 0 && comptime(lastLotteryNtime, maxCrossDay) >= 0) {
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
        }else{
            me.safeLotteryMode('on');
            return;
        }
    },
    // 摇奖开启倒计时
    beforeCountdown: function(prizeActList) {
        $('.S10').removeClass('hide');
        $('.yao-tip').addClass('hide');
        $('.window').removeClass('hide');
        var me = this;
        me.isCanShake = false;
        me.type = 1;
        var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
        var beginTimeLong = timestamp(beginTimeStr);
        beginTimeLong += me.dec;
        $('.cdbox').removeClass('none').find('p').html('抢大奖倒计时');
        $('.digi').attr('etime',beginTimeLong).empty();
        me.count_down();
        if(prizeActList.bi.length > 0){
            me.lotteryImgList = prizeActList.bi.split(",");
        }
        me.downloadImg();
        hidenewLoading();
    },
    // 摇奖结束倒计时
    nowCountdown: function(prizeActList){
        $('.S10').addClass('hide');
        $('.yao-tip').removeClass('hide');
        $('.ihome').removeClass('hide');
        $('.window').addClass('hide');
        $('.cdbox').addClass('none');
        var me = this;
        me.isCanShake = true;
        me.type = 2;
        var endTimeStr = prizeActList.pd+" "+prizeActList.et;
        var beginTimeLong = timestamp(endTimeStr);
        beginTimeLong += me.dec;
        $('.digi').attr('etime',beginTimeLong).empty();
        $(".cdbox").addClass('none');
        me.count_down();
        me.index++;
        me.canJump = true;
        if(prizeActList.bi.length > 0){
            me.lotteryImgList = prizeActList.bi.split(",");
        }
        me.downloadImg();
        hidenewLoading();
    },
    // 跨天摇奖开启倒计时
    crossCountdown: function(nextTime) {
        $('.S10').removeClass('hide');
        $('.yao-tip').addClass('hide');
        $('.window').removeClass('hide');
        var me = this;
        me.isCanShake = false;
        me.crossLotteryFlag = false;
        me.crossLotteryCanCallback = true;
        me.type = 1;
        var beginTimeLong = timestamp(nextTime);
        beginTimeLong += me.dec;
        $('.digi').attr('etime',beginTimeLong).empty();
        $('.cdbox').removeClass('none').find('p').html('抢大奖倒计时');
        me.count_down();
        hidenewLoading();
    },
    count_down: function() {
        var me = this;
        $('.digi').each(function() {
            $(this).countDown({
                etpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%.' + '%MS%', // 还有...结束
                stpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%.' + '%MS%', // 还有...开始
                sdtpl: '',
                otpl: '',
                otCallback: function() {
                    if(me.canJump){
                        if (me.crossLotteryCanCallback) {
                            if(!me.isTimeOver){
                                var delay = Math.ceil(1000*Math.random() + 500);
                                me.isTimeOver = true;
                                me.crossLotteryCanCallback = false;
                                $('.countdown-tip').html('请稍后');
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
                                    me.nowCountdown(me.pal[me.index]);
                                }
                            }else if(me.type == 2){
                                //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                                if(!me.isTimeOver){
                                    me.isTimeOver = true;
                                    if(me.index >= me.pal.length){
                                        if (me.crossLotteryFlag) {
                                            me.type = 1;
                                            me.crossCountdown(me.pal[me.pal.length - 1].nst);
                                        } else {
                                            me.type = 3;
                                            me.change();
                                        }
                                        return;
                                    }
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
                    }
                },
                sdCallback: function(){
                    me.isTimeOver = false;
                }
            });
        });
    },
    drawlottery: function() {
        shownewLoading(null,'抽奖中，请稍后...');
        var me = this, sn = new Date().getTime()+'';
        me.lotteryTime = getRandomArbitrary(1,2);
        me.times = 0;
        $.ajax({
            type: 'GET',
            async: false,
            url: domain_url + 'api/lottery/luck' + dev,
            data: { oi: openid , sn: sn},
            dataType: "jsonp",
            jsonpCallback: 'callbackLotteryLuckHandler',
            timeout: 10000,
            complete: function() {
            },
            success: function(data) {
                if(data.flow && data.flow == 1){
                    me.lotteryTime = getRandomArbitrary(6, 10);
                    me.times = 0;
                    sn = new Date().getTime()+'';
                    me.lottery_point(null);
                    return;
                }
                if(data.result){
                    if(data.sn == sn){
                        sn = new Date().getTime()+'';
                        me.lottery_point(data);
                    }
                }else{
                    sn = new Date().getTime()+'';
                    me.lottery_point(null);
                }
            },
            error: function() {
                sn = new Date().getTime()+'';
                me.lottery_point(null);
            }
        });
    },
    fill: function(data) {
        var me = this;
        me.imgMath();
        $(".home-box").removeClass("yao");
        if(data == null || data.result == false || data.pt == 0){
            $("#audio-a").get(0).pause();
            me.thanks();
            return;
        }else{
            $("#audio-a").get(0).pause();
            $("#audio-b").get(0).play();    //中奖声音
        }
        if (data.pt == 1) {
            H.dialog.shiwuLottery.open(data);
        } else if (data.pt == 4) {
            H.dialog.redbagLottery.open(data);
        } else {
            me.thanks();
        }
    },
    thanks: function() {
        var me = this;
        me.canJump = true;
        me.isCanShake = true;
        if (typeof(thanks_tips) == 'undefined' || thanks_tips.length == 0) {
            var tips = '继续来战，加油吧~';
        } else {
            var tips = thanks_tips[getRandomArbitrary(0, thanks_tips.length)]
        }
        $('.thanks-tips').html(tips).addClass('show');
        hidenewLoading();
        setTimeout(function(){
            $('.thanks-tips').removeClass('show');
            setTimeout(function(){
                $('.thanks-tips').empty();
            }, 500);
        }, 1200);
    },
    lottery_point: function(data) {
        var me = this;
        setTimeout(function() {me.fill(data);},1500);
    },
    change: function() {
        this.isCanShake = false;
        $('.cdbox').removeClass('none').find('p').html('祝各位同事新年快乐！明年再见~');
        $('.digi').html("").addClass('none');
        $('.window').removeClass('hide');
        hidenewLoading();
    }
};

$(function() {
    H.index.init();
});