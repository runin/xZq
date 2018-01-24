(function($) {
    H.lottery = {
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
        $lotteryCountdown: $("#lottery-countdown"),
        luckData: null,
        init: function() {
            this.loadImg();
            this.event();
            //this.resize();
            this.lotteryRound_port();
            this.shake();
        },
        loadImg: function(){
            var imgs = [
                "images/bg-lottery-bottom.jpg",
                "images/bg-wheel-bottom.png",
                "images/bg-wheel-top.png",
                "images/bg-yao-default.jpg",
                "images/red-bg.png"
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
                me.wxCheck = true;
                me.lotteryTime = 1;
                me.shake_listener();
            });

        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
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

                        /*测试-s*/
                        /*data = testLotteryData;
                         me.nowTime = timeTransform(data.sctm);
                         console.log(me.nowTime);
                         var nowTimeStemp = new Date().getTime();
                         me.dec = nowTimeStemp - data.sctm;
                         me.roundData = data;
                         me.currentPrizeAct(data);*/
                        /*测试-e*/
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
                me.$lotteryCountdown.addClass('none');
                $('.fail-tips').removeClass('none');
                me.safeFlag = true;
            } else if (flag == 'off') {
                clearTimeout(me.pingFlag);
                me.pingFlag = null;
                me.lotteryRound_port();
                me.$lotteryCountdown.removeClass('none');
                $('.fail-tips').addClass('none');
                me.safeFlag = false;
            } else {
                me.safeLotteryMode('off');
            };
            hidenewLoading();
        },
        shake_listener: function() {
            if (!H.lottery.safeFlag) {
                if(H.lottery.isCanShake){
                    H.lottery.isCanShake = false;
                    H.lottery.canJump = false;
                }else{
                    return;
                }
                if (H.lottery.type != 2) {
                    return;
                }
                H.lottery.times++;
                if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                    H.lottery.isToLottey = false;
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
                }, 1200);
                $(".home-box").addClass("yao");
            }
            recordUserOperate(openid, "摇奖", "shakeLottery");
            shownewLoading(null, '抽奖中，请稍后...');
            if(!openid || openid=='null' || H.lottery.isToLottey == false || H.lottery.safeFlag == true) {
                setTimeout(function(){
                    H.lottery.fill(null);//摇一摇
                }, 1500);
            } else {
                if(!H.lottery.wxCheck) {
                    //微信config失败
                    setTimeout(function(){
                        H.lottery.fill(null);//摇一摇
                    }, 1500);
                    return;
                }

                setTimeout(function(){
                    H.lottery.drawlottery();
                }, 1500);
            }
            H.lottery.isToLottey = true;
        },
        imgMath: function() {//随机背景
            var me = this;
            if(me.lotteryImgList.length >0){
                var i = Math.floor((Math.random()*me.lotteryImgList.length));
                $("body").css({
                    "backgroundImage":"url('"+H.lottery.lotteryImgList[i]+"')",
                    "background-repeat": "no-repeat",
                    "background-size": "100% auto",
                    "background-position": "center center"
                });
            }
        },
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        //查询当前参与人数
        account_num: function(){
            getResult('api/common/servicedaypv', {}, 'commonApiSDPVHander');
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
                //config微信jssdk
                me.wxConfig();
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
                        me.initComponent();
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
        initComponent: function(){
            var me = this,
            recordDelay = Math.ceil(3000*Math.random() + 3000),
            allRecordTime = Math.ceil(20000*Math.random() + 600000),
            PVTime = Math.ceil(20000*Math.random() + 10000);
            setTimeout(function(){ me.red_record(); }, recordDelay);
            setInterval(function(){ me.red_record(); }, allRecordTime);
            setTimeout(function() {me.account_num();}, me.PVTime);
        },
        progressChange: function(beginTimeLong, word){
            if($("body").attr("data-type") == "answer"){
                var meAnswer = H.answer, intervalFlag  = 0;

                clearInterval(intervalFlag);
                meAnswer.$progressBarAnswerPage.removeClass("wan init");
                meAnswer.$lotteryCountdownAnswerPage.attr('etime',beginTimeLong).empty();
                if(word == "距离摇奖开始还有:"){
                    meAnswer.$lotteryCountdownAnswerPage.removeClass("none");
                    meAnswer.$giftAnswerPage.attr("src", "images/grey-gift.png").removeClass("yao");

                    meAnswer.$progressBarAnswerPage.addClass("init");
                    var sum = 0,flag = true,topHeight = 0,energyHeight = 165;
                    intervalFlag = setInterval(function(){
                        if(_ss && flag){
                            sum = _ss;
                            flag = false;
                        }
                        if(W.screen.height == 500){
                            energyHeight = 105;
                        }else if(W.screen.height == 568){
                            energyHeight = 135;
                        }
                        topHeight = energyHeight-energyHeight*(_ss/sum);
                        if(topHeight < 17){
                            topHeight = 17;
                        }
                        meAnswer.$progressBarAnswerPage.animate(
                            {"height": topHeight + "px"},
                            500);
                    },1000);
                }else if(word == "距离摇奖结束还有:"){
                    meAnswer.$lotteryCountdownAnswerPage.addClass("none");
                    meAnswer.$giftAnswerPage.attr("src", "images/gift.png").addClass("yao");
                    meAnswer.$progressBarAnswerPage.addClass("wan");
                }else{
                    meAnswer.$lotteryCountdownAnswerPage.removeClass("none");
                    meAnswer.$giftAnswerPage.attr("src", "images/grey-gift.png").removeClass("yao");
                    meAnswer.$progressBarAnswerPage.css("height","10%");
                }
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
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty().removeClass("none");
            me.$lotteryCountdown.find(".countdown-tip").html('距离摇奖开始还有:');

            me.progressChange(beginTimeLong, '距离摇奖开始还有:');

            me.count_down();
            me.$lotteryCountdown.removeClass('none');
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            me.downloadImg();
            hidenewLoading();

            if($("body").attr("data-type") == "lottery"){
                toUrl("answer.html");
            }
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){console.log("摇奖结束倒计时");
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty().removeClass("none");
            me.$lotteryCountdown.find(".countdown-tip").html("距离摇奖结束还有:");

            me.progressChange(beginTimeLong, '距离摇奖结束还有:');

            me.count_down();
            me.$lotteryCountdown.removeClass('none');
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
            var me = this;
            me.isCanShake = false;
            me.crossLotteryFlag = false;
            me.crossLotteryCanCallback = true;
            me.type = 1;
            var beginTimeLong = timestamp(nextTime);
            beginTimeLong += me.dec;
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty().removeClass("none");
            me.$lotteryCountdown.find(".countdown-tip").html('距本轮摇奖开始还有:');
            me.count_down();
            me.$lotteryCountdown.removeClass('none');
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            me.$lotteryCountdown.find('.detail-countdown').each(function() {//摇奖页倒计时
                $(this).countDown({
                    etpl: '<span class="fetal-H"><img src="images/dian.png" />%H%' + '<img src="images/dian.png" /></span>' + '%M%' + '<img src="images/dian.png" />' + '%S%<img src="images/dian.png" />', // 还有...结束
                    stpl: '<span class="fetal-H"><img src="images/dian.png" />%H%' + '<img src="images/dian.png" /></span>' + '%M%' + '<img src="images/dian.png" />' + '%S%<img src="images/dian.png" />', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.canJump){
                            if (me.crossLotteryCanCallback) {
                                if(!me.isTimeOver){
                                    var delay = Math.ceil(1000*Math.random() + 500);
                                    me.isTimeOver = true;
                                    me.crossLotteryCanCallback = false;
                                    me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                    me.$lotteryCountdown.find('.detail-countdown').addClass("none");
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
                                        me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                        me.$lotteryCountdown.find('.detail-countdown').addClass("none");
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
                                                me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                                me.$lotteryCountdown.find('.detail-countdown').addClass("none");
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
                                        me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                        me.$lotteryCountdown.find('.detail-countdown').addClass("none");
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
                            me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                            me.$lotteryCountdown.find('.detail-countdown').addClass("none");
                        }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    },
                    stCallback : function(){}
                });
            });

            if($("body").attr("data-type") == "answer"){
                var meAnswer = H.answer;
                    $this = meAnswer.$lotteryCountdownAnswerPage;
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
            }

        },
        drawlottery: function() {
            var me = this, sn = new Date().getTime()+'';
            me.lotteryTime = getRandomArbitrary(1,3);
            me.times = 0;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/exec/luck' + dev,
                data: {
                    matk: matk ,
                    sn: sn
                },
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryLuckHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.flow && data.flow == 1){
                        me.lotteryTime = getRandomArbitrary(3, 6);
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
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
            recordUserPage(openid, "调用抽奖接口", 0);
        },
        fill: function(data) {
            var me = this;
            me.imgMath();
            $(".home-box").removeClass("yao");
            if(data == null || data.result == false || data.pt == 0){
                $("#audio-a").get(0).pause();
                setTimeout(function(){
                    me.thanks();
                }, 1500);
                return;
            }else{
                $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();    //中奖声音
            }
            me.showDialog(data);
        },
        showDialog: function(data){
            var meDialog = H.dialog;
            switch (data.pt){
                case 1://实物奖品
                    meDialog.shiwuLottery.open(data);
                    break;
                /*case 2://积分奖品
                    meDialog.jfLottery.open(data);
                    break;*/
                case 4://现金红包
                    meDialog.redbagLottery.open(data);
                    break;
                /*case 5://兑换码
                    meDialog.duiHuanMaLottery.open(data);
                    break;*/
                case 7://卡劵奖品
                    meDialog.wxcardLottery.open(data);
                    break;
                case 9://外链奖品
                    meDialog.linkLottery.open(data);
                    break;
            }
        },
        thanks: function() {
            var me = this;
            hidenewLoading();
            me.canJump = true;
            me.isCanShake = true;
            if (typeof(thanks_tips) == 'undefined' || thanks_tips.length == 0) {
                var tips = '不纯不抢，继续来战，加油吧~';
            } else {
                var tips = thanks_tips[getRandomArbitrary(0, thanks_tips.length)]
            }

            showTips(tips);

            setTimeout(function(){
                if($('body').attr("data-type") == "answer"){
                    H.dialog.right.close();
                    H.answer.nextAnswer();
                }
                me.isCanShake = true;
            }, 800);

           /* $('.thanks-tips').html(tips).addClass('show');
            setTimeout(function(){
                $('.thanks-tips').removeClass('show');
                setTimeout(function(){
                    $('.thanks-tips').empty();
                }, 300);
            }, 1300);*/

        },
        lottery_point: function(data) {
            var me = this;
            //setTimeout(function() {me.fill(data);}, 1000);
            me.fill(data);
        },
        wxConfig: function() {
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'mp/jsapiticket' + dev,
                data: {appId: wxcard_appid},
                dataType: "jsonp",
                jsonpCallback: 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                },
                success: function(data) {
                    if(data.code == 0){
                        var url = window.location.href.split('#')[0];
                        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
                        var timestamp = Math.round(new Date().getTime()/1000);
                        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
                        //权限校验
                        wx.config({
                            debug: false,
                            appId: wxcard_appid,
                            timestamp: timestamp,
                            nonceStr:nonceStr,
                            signature:signature,
                            jsApiList: [
                                "addCard",
                                "checkJsApi"
                            ]
                        });
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        scroll: function(options) {
            $('.marquee').each(function(i) {
                var me = this, com = [], delay = 1000;
                var len = $(me).find('li').length;
                var $ul = $(me).find('ul');
                var hei = $(me).find('ul li').height();
                if (len == 0) {
                    $(me).addClass('none');
                } else {
                    $(me).removeClass('none');
                }
                if(len > 1) {
                    com[i] = setInterval(function() {
                        $(me).find('ul').animate({'margin-top': -hei+'px'}, delay, function() {
                            $(me).find('ul li:first').appendTo($ul);
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                };
            });
        },
        change: function() {
            var me = H.lottery;
            this.isCanShake = false;
            me.$lotteryCountdown.removeClass('none').find(".countdown-tip").html('本期摇奖已结束，下期再战！');
            me.$lotteryCountdown.find('.detail-countdown').html("").addClass("none");
            hidenewLoading();
            me.progressChange();
            if($("body").attr("data-type") == "lottery"){
                toUrl("answer.html");
            }
        }
    };

    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            var list = data.rl;
            if(list && list.length > 0){
                var con = "";
                for(var i = 0 ; i < list.length; i++){
                    var username = (list[i].ni || "匿名用户");
                    if (username.length >= 9) {
                        username = username.substring(0, 8) + '...';
                    }
                    con += "<li><span>" + username + "中了 <label>" + list[i].pn + "</label></label></span></li>";
                }
                var len = $(".marquee").find("li").length;
                if(len >= 500){
                    $(".marquee").find("ul").html(con);
                }else{
                    $(".marquee").find("ul").append(con);
                }
                if(H.lottery.recordFirstload){
                    H.lottery.recordFirstload = false;
                    H.lottery.scroll();
                }
                $(".marquee").animate({'opacity':'1'}, 500, function(){$(".marquee").removeClass("hidden");});
            }
        }
    };

    W.commonApiSDPVHander = function(data){
        if(data.code == 0){
            if (data.c*1 != 0) {
                $(".count label").html(data.c);
                $(".count").removeClass("hidden");
                setInterval(function(){
                    var pv = getRandomArbitrary(33,99);
                    pv = $(".count label").html()*1 + pv;
                    $(".count label").html(pv);
                },3000);
            }
        }
    };
})(Zepto);

$(function() {
    H.lottery.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.lottery.isError){
                    H.lottery.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });

    wx.error(function(res){
        H.lottery.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});

var testLotteryData = {
    "result": true,
    "la": [
        {
            "ud": "aad71c59fd0d40689d48a6ae98268d66",
            "pd": "2016-01-15",
            "st": "10:30:00",
            "et": "10:30:15",
            "nst": "2016-01-15 10:30:25",
            "lc": 50,
            "bi": "",
            "ui": 0
        },
        {
            "ud": "d5020ac08c2f4773beb41d5ed1f83aee",
            "pd": "2016-01-15",
            "st": "10:30:25",
            "et": "10:30:35",
            "nst": "2016-01-15 10:30:35",
            "lc": 50,
            "bi": "",
            "ui": 0
        },
        {
            "ud": "aad71c59fd0d40689d48a6ae98268d66",
            "pd": "2016-01-15",
            "st": "10:30:35",
            "et": "10:30:45",
            "nst": "2016-01-15 10:30:45",
            "lc": 50,
            "bi": "",
            "ui": 0
        },
        {
            "ud": "d5020ac08c2f4773beb41d5ed1f83aee",
            "pd": "2016-01-15",
            "st": "10:30:45",
            "et": "10:30:55",
            "nst": "2016-01-15 10:50:00",
            "lc": 50,
            "bi": "",
            "ui": 0
        }
    ],
    "sctm": 1452825000000 //2016-01-15 10:30:00
};