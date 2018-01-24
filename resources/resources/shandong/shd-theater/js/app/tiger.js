(function($) {
	H.tiger = {
        uid: null,
        isask:false,
        request_cls: 'requesting',
        awardData:null,
        isWarmup:0,
        isInAni:false,
        myGold:false,
        /**
         * @param c.bot 对象的DOM元素
         * @param c.time 对象执行动画的时间
         * @param c.pos 对象执行结束动画需要降落到的位置  false为没有结束
         */
        c1:{
            time:2000,
            bot:$(".col1-bot"),
            pos:false
        },
        c2:{
            time:1900,
            bot:$(".col2-bot"),
            pos:false
        },
        c3:{
            time:2100,
            bot:$(".col3-bot"),
            pos:false
        },
        aniEndFlag:0,
        isinit:false,
		init: function() {
            var me = this;
            //getResult('api/article/list', {}, 'callbackArticledetailListHandler');
            me.getMygold();
            me.warmup();
            me.event();
        },
        event: function(){
            var me = this;
            $(".btn-person").on("click", function () {
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                $(this).addClass(me.request_cls);
                toUrl("info.html");
            });
            $(".btn-talk").on("click", function () {
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    setTimeout(function(){
                        $(this).removeClass('requesting');
                    }, 700);
                }
                toUrl("talk.html");
            });
            $(".tiger").append('<img class="tg-lt1" src="images/tg-lt.png" /><img class="tg-lt2" src="images/tg-lt2.png" />');
            $(".tg-lt1").on("load", function () {
                $(this).css("opacity","1");
            });
            $(".tg-lt2").on("load", function () {
                me.shining(1.6);
            });
        },
        getMygold: function () {
            getResult('api/lottery/integral/rank/self', {
                oi: openid
            }, 'callbackIntegralRankSelfRoundHandler', true, this.$dialog);
        },
        resize: function () {

        },
        //跑马灯
        shining: function (time) {
            $(".tg-lt2").css({"-webkit-animation":""});
            setTimeout(function () {
                $(".tg-lt2").css({"opacity":"1","-webkit-animation":"shining " + time + "s infinite"});
            },1);
        },
        //动画开始
        start: function () {
            var me = this;
            if(this.isWarmup >= 1){
                H.lottery.shake_listener();
                me.shining(.5);
            }
            me.rolling($(".col1"),me.c1);
            setTimeout(function () {
                me.rolling($(".col2"),me.c2);
                setTimeout(function () {
                    me.rolling($(".col3"),me.c3);
                },300);
            },300);
        },
        //预热  先执行一次动画防止卡顿
        warmup: function () {
            $(".tiger-fun").css({"-webkit-animation":"opa 2s"});
            this.start();
        },
        //动画停止
        stop: function (data) {
            var randNum = getRandomArbitrary(1,4);
            //给pos赋值  动画循环时执行结束动画
            if(data == null || data.result == false || data.pt == 0){
                //未中奖，打乱图片
                H.tiger.c1.pos = randNum;
                setTimeout(function () {
                    H.tiger.c2.pos = getRandomArbitrary(1,4);
                    setTimeout(function () {
                        H.tiger.c3.pos = getRandomArbitrary(1,4);
                        //最后一张图片一定要跟前两张中的一张不一样
                        if(H.tiger.c3.pos == H.tiger.c1.pos || (H.tiger.c3.pos == false)){
                            if(H.tiger.c1.pos == 1){
                                H.tiger.c3.pos = 2
                            }else{
                                H.tiger.c3.pos -= 1;
                            }
                        }
                    },300);
                },300);
            }else{
                //中奖，所有图片一样
                H.tiger.c1.pos = randNum;
                setTimeout(function () {
                    H.tiger.c2.pos = randNum;
                    setTimeout(function () {
                        H.tiger.c3.pos = randNum;
                    },300);
                },300);
            }
        },
        /**
         * @param obj 传入执行对象的DOM元素
         * @param c 传入执行对象的参数
         * @param c.bot 用于遮盖的DOM元素
         * @param c.time 对象执行动画的时间
         * @param c.pos 对象执行结束动画需要降落到的位置  false为没有结束
         */
        rolling: function (obj,c) {
            var tfunc = 'ease-in';
            H.tiger.isInAni = true;
            //动画加速
            if(c.time <= 1000){
                tfunc = 'linear'
            }else{
                c.time -= 1400;
            }
            if(c.pos == false){
                c.bot.css("opacity","0");
                //未结束状态动画会完全执行
                obj.animate({
                    '-webkit-transform':'translate(0px,75%)'
                }, c.time,tfunc, function () {
                    c.bot.css("opacity","1");
                    obj.css({"-webkit-transform":'translate(0px,0px)'});
                    //动画执行完一遍后重新执行动画
                    H.tiger.rolling(obj,c);
                    if(H.tiger.isWarmup<1){
                        H.tiger.stop(true);
                    }
                });
            }else{
                tfunc = 'ease-out';
                c.bot.css("opacity","0");
                //结束状态最后降落位置由 c.pos 决定  动画执行时间延长为 c.time*c.pos
                obj.animate({
                    '-webkit-transform':'translate(0px,' + (c.pos*25).toString() + '%)'
                },(c.time*c.pos),tfunc, function () {
                    c.pos = false;
                    // aniEndFlag 判断是否3组动画都执行完毕
                    if(H.tiger.aniEndFlag >= 2){
                        //三组动画都执行完毕
                        H.tiger.aniEndFlag = 0;
                        if(H.tiger.isWarmup >= 1){
                            if(H.tiger.awardData == null || H.tiger.awardData.result == false || H.tiger.awardData.pt == 0){
                                H.dialog.openLuck.open(null);
                            }else{
                                $("#audio-b").get(0).play();    //中奖声音
                                H.dialog.openLuck.open(H.tiger.awardData);
                            }
                        }else{
                            H.tiger.isWarmup ++;
                            if(H.tiger.isWarmup<1){
                                H.tiger.warmup();
                            }else{
                                $(".tiger-fun").css("opacity","1");
                            }
                        }
                        H.tiger.shining(1.6);
                        H.tiger.isInAni = false;
                    }else{
                        H.tiger.aniEndFlag ++;
                    }
                });
            }
        }
    };
    W.callbackArticledetailListHandler = function(data){
        if(data == undefined){

        }else{
            if(data.code == 0){
                hidenewLoading();
                $(".round-bg").css({"background":"url(" + (data.arts[1].img?data.arts[1].img:"images/tv-info.png").toString() + ") no-repeat","background-size":"100% 100%","background-position":"0 0"});
            }else if(data.code == 1){
                if(H.tiger.isask == false){
                    getResult('api/article/list', {}, 'callbackArticledetailListHandler');
                    H.tiger.isask = true;
                }else{
                    hidenewLoading();
                    $(".round-bg").css({"background":"url(images/tv-info.png) no-repeat","background-size":"100% 100%","background-position":"0 0"});
                }
            }
        }
    };
    W.callbackIntegralRankSelfRoundHandler = function(data) {
        if (data.result == true) {
            H.tiger.myGold = data.in;
        } else {

        }
    };
    H.lottery = {
        dec: 0,
        sau: 0,
        type: 2,
        index: 0,
        times: 0,
        pageType:1,
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
        isHolding:false,
        repeat_load: true,
        recordFirstload: true,
        sponsorDetailFlag: false,
        lotteryImgList: [],
        lotteryTime: getRandomArbitrary(1,3),
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        init: function() {
            this.getSau_port();
            this.lotteryRound_port();
            this.shake_listener();
            //this.shake();
        },
        getSau_port: function() {
            getResult("api/linesdiy/info", {}, "callbackLinesDiyInfoHandler");
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
            var me = this, delay = Math.ceil(60000*2*Math.random() + 60000);
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
                data: {at:3},
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
                $('.countdown, .icon-lotterytip').addClass('none');
                me.safeFlag = true;
            } else if (flag == 'off') {
                clearTimeout(me.pingFlag);
                me.pingFlag = null;
                me.lotteryRound_port();
                $('.countdown, .icon-lotterytip').removeClass('none');
                me.safeFlag = false;
            } else {
                me.safeLotteryMode('off');
            };
            hidenewLoading();
        },
        shake_listener: function() {
            if (!H.lottery.safeFlag) {
                if(H.lottery.sponsorDetailFlag) {
                    return;
                }
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
                //if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                //    H.lottery.isToLottey = false;
                //}
            }
            //if(!$(".icon-lottery-wheel").hasClass("shake")) {
            //    $(".icon-lottery-wheel").addClass("shake");
            //    $("#audio-a").get(0).play();
            //}
            recordUserOperate(openid, "摇奖", "shakeLottery");
            if(!openid || openid=='null' || H.lottery.isToLottey == false || H.lottery.safeFlag == true) {
                setTimeout(function(){
                    H.lottery.fill(null);//摇一摇
                }, 1800);
            } else {
                //if(!H.lottery.wxCheck) {
                //    //微信config失败
                //    setTimeout(function(){
                //        H.lottery.fill(null);//摇一摇
                //    }, 1800);
                //    return;
                //}
                H.lottery.drawlottery();
            }
            H.lottery.isToLottey = true;
        },
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        account_num: function(){
            getResult('api/common/servicedaypv', {}, 'commonApiSDPVHander');
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this, nowTimeStr = this.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [], day = nowTimeStr.split(" ")[0];
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
                    me.endType = 3;
                    me.change();
                    return;
                }
                //config微信jssdk
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
                        me.initComponent();
                        $.fn.cookie('jumpNum', 0, {expires: -1});
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
            var me = this, recordDelay = Math.ceil(15000*Math.random() + 20000), pvDelay = Math.ceil(20000*Math.random() + 10000);
            setTimeout(function(){ me.red_record(); }, recordDelay);
            setInterval(function(){ me.red_record(); }, me.allRecordTime);
            setTimeout(function(){ me.account_num(); }, pvDelay);
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.isCanShake = false;
            me.isHolding = true;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html('距摇奖开始还有');
            me.count_down();
            $('.countdown').removeClass('none').css("opacity","1");
            $(".tiger").css("opacity","1");
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            $(".btn-start").addClass('none').off();
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            //if(me.isHolding){
            //    H.dialog.tip.open();
            //}
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html("距摇奖结束还有");
            me.count_down();
            $('.countdown').removeClass('none');
            $(".tiger").css("opacity","1");
            me.index++;
            me.canJump = true;
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            $(".btn-start").removeClass('none').on("click", function () {
                if(H.tiger.isWarmup >= 1 && H.lottery.isCanShake && !H.tiger.isInAni){
                    var me = this;
                    $(me).addClass(H.tiger.request_cls);
                    setTimeout(function(){
                        $(me).removeClass(H.tiger.request_cls);
                    }, 700);
                    if(H.tiger.myGold >= 10){
                        H.tiger.myGold -= 10;
                        H.tiger.start();
                    }else{
                        showTips('您的积分不足，不能抽奖哦');
                    }
                }
            });
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%' + '时</span>' + '%M%' + '分' + '%S%秒', // 还有...结束
                    stpl: '<span class="fetal-H">%H%' + '时</span>' + '%M%' + '分' + '%S%秒', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.canJump){
                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                                if(!me.isTimeOver){
                                    me.isTimeOver = true;
                                    $('.countdown-tip').html('请稍后');
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
                                        me.change();
                                        me.type = 3;
                                        return;
                                    }
                                    $('.countdown-tip').html('请稍后');
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
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        drawlottery: function() {
            //shownewLoading();
            var me = this, sn = new Date().getTime()+'';
            me.lotteryTime = getRandomArbitrary(1, 3);
            me.times = 0;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/exec/luck4Integral' + dev,
                data: { matk: matk , sn: sn },
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryLuck4IntegralHandler',
                timeout: 10000,
                complete: function() {
                    hidenewLoading();
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
                            H.dialog.PV = data.pv;
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
            H.tiger.awardData = data;
            H.tiger.stop(data);
        },
        thanks: function() {
            var me = this;
            me.canJump = true;
            if (typeof(thanks_tips) == 'undefined' || thanks_tips.length == 0) {
                var tips = '姿势摆的好，就能中大奖';
            } else {
                var tips = thanks_tips[getRandomArbitrary(0, thanks_tips.length)]
            }
            $('.thanks-tips').html(tips).addClass('show');
            setTimeout(function(){
                $('.thanks-tips').removeClass('show');
                setTimeout(function(){
                    $('.thanks-tips').empty();
                    me.isCanShake = true;
                }, 300);
            }, 1000);
        },
        lottery_point: function(data) {
            var me = this;
            setTimeout(function() {me.fill(data);}, 1800);
        },
        wxConfig: function() {
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'mp/jsapiticket' + dev,
                data: {appId: shaketv_appid},
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
                            appId: shaketv_appid,
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
                if (len == 0) {
                    $(me).addClass('none');
                } else {
                    $(me).removeClass('none');
                }
                if(len > 1) {
                    com[i] = setInterval(function() {
                        $(me).find('ul').animate({'margin-top': '-30px'}, delay, function() {
                            $(me).find('ul li:first').appendTo($ul)
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                };
            });
        },
        change: function() {
            this.isCanShake = false;
            $(".countdown").removeClass('none').find(".countdown-tip").html('本期摇奖已结束，下期再战！');
            $(".tiger").css("opacity","1");
            $('.detail-countdown').html("");
            $(".btn-start").addClass('none').off();
            hidenewLoading();
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            H.lottery.sau = data.tid;
        }
    };
    W.commonApiSDPVHander = function(data){
        if(data.code == 0){
            $(".getRed-num label").html(data.c);
            setInterval(function(){
                var pv = getRandomArbitrary(33, 99);
                pv = $(".getRed-num label").html()*1 + pv;
                $(".getRed-num label").html(pv);
            }, 8000);
            $(".info-box").removeClass("none");
        }
    };
    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            var list = data.rl;
            if(list && list.length > 0){
                var con = "";
                for(var i = 0 ; i < list.length; i++){
                    con += "<li>" + (list[i].ni || "匿名用户") + "中了" + list[i].pn + "</li>";
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
                $(".marquee").removeClass("none");
            }
        }
    };
})(Zepto);

$(function(){
	H.tiger.init();
	H.lottery.init();
});