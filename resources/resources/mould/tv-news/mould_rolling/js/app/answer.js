(function($) {
	H.answer = {
		actUid : null,
		page : 0,
		beforePage : 0,
		pageSize:10,
		item_index : 0,
		commActUid: "",
		loadmore : true,
		isCount : true,
		expires: {expires: 7},
        hotIsZ:[],
        attrUuid: null,
        QUEdata:[],
        timeText:$(".time-box>p"),
        randomShow:[1,2,3],
        iscontinue:false,
        isInit:false,
        isR:0,
        isW:0,
        AR:$(".answer-r"),
        AW:$(".answer-w"),
        AT:$(".answer-t"),
        scoreObj:null,
        QUElength:0,
        loadNumb:0,
		init : function(){
            H.answer.resize();
        },
        resize: function () {
            //var winW = $(window).width(),winH=$(window).height(),hotH=winH*.35;
            H.answer.event_handler();
        },
		event_handler: function() {
			var me = this;
            $("#lottery").one("click", function () {
                H.lottery.drawlottery();
            });
            getResult('api/question/round', {yoi: openid}, 'callbackQuestionRoundHandler', true, null, true);
        },
        isload: function () {
            $(".answer-box>a").on("click", function () {
                H.answer.answer($(this).attr('auid'));
            });
        },
        fill: function (data) {
            this.QUElength = data.length;
            for(var i=0;i<this.QUElength;i++){
                H.answer.QUEdata.push(data[i]);
            }
            H.answer.QUEdata.sort(function(){ return 0.5 - Math.random() });
            this.loadQue();
        },
        loadQue: function () {
            $(".round>p").html(this.loadNumb+1);
            var EQ=getRandomArbitrary(0,(this.QUElength-4)),thisQue=this.QUEdata[this.loadNumb];
            $(".top>p").html(thisQue.qt.toString()).attr('quid',thisQue.quid);
            $(".top>span").html(thisQue.aitems[0].at.toString());
            $("#answer-yes").attr('auid',thisQue.aitems[0].auid);
            $("#answer-no").attr('auid',thisQue.aitems[1].auid);
            this.randomShow.sort(function(){ return 0.5 - Math.random() });
            for(var i=0;i<3;i++){
                var nowQue = H.answer.QUEdata[EQ],nowObj = $(".rolling").children().eq(H.answer.randomShow[i]);
                if(nowQue.qt == thisQue.qt){
                    EQ++;
                    nowQue = H.answer.QUEdata[EQ];
                }
                nowObj.find('p').html(nowQue.qt.toString());
                nowObj.find('span').html(nowQue.aitems[0].at.toString());
                EQ++;
            }
            this.loadNumb++;
            this.isload();
            this.iscontinue = true;
            if(!this.isInit){
                this.timeBox();
                this.isInit = true;
            }
            //console.log($("."+"rolling:nth-child(" + numb + ")"));
        },
        timeBox: function () {
            setTimeout(function () {
                if(H.answer.iscontinue == false){
                }else if(parseInt(H.answer.timeText.text())=="1"){
                    H.answer.timeText.html(parseInt(H.answer.timeText.text())-1);
                    $(".answer-box>a").off();
                    H.answer.showResult("timeout");
                }else{
                    H.answer.timeBox();
                    H.answer.timeText.html(parseInt(H.answer.timeText.text())-1);
                }
            },1000);
        },
        showResult: function (data) {
            if(data == "timeout"){
                this.isW++;
                this.ani(this.AT);
            }else if(data.rs == 2){
                this.isR++;
                this.ani(this.AR);
            }else if(data.rs == 1){
                this.isW++;
                this.ani(this.AW);
            }
        },
        score: function () {
            var myScore = Math.ceil(this.isR/this.QUElength*100),me=this;
            if(myScore>=80){
                me.scoreObj = $(".score-A");
            }else if((myScore<80)&&(myScore>=50)){
                me.scoreObj = $(".score-B");
            }else{
                me.scoreObj = $(".score-C");
            }
            $(".answer-Rnumb>p").html(this.isR);
            $(".answer-Wnumb>p").html(this.isW);
            $(".congratulate").html("恭喜您，您的成绩打败了全国" + myScore + "%的网友");
            H.answer.isEnd.init();
        },
        isEnd:{
            init: function () {
                this.justhide($(".round"));
                this.justhide($(".time-box"));
                this.justhide($(".rolling"));
                this.justhide($(".answer-box"));
                this.justhide($(".arr"),true);
            },
            justhide: function (self,type) {
                var me = this;
                self.css({"-webkit-animation":"justhide .5s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                    $(this).css({"-webkit-animation":""}).addClass('none');
                    if(type){
                        me.justshow($(".game-over"));
                        me.justshow($(".score-box"),true);
                        me.justshow($(".lottery-box"));
                    }
                });
            },
            justshow: function (self,type) {
                self.removeClass('none').css({"-webkit-animation":"justshow .5s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                    $(this).css({"-webkit-animation":""});
                    if(type){
                        H.answer.scoreObj.css({"-webkit-animation":"dropdown .5s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                            $(this).css({"opacity":"1","-webkit-animation":""});
                        });
                    }
                });
            }
        },
        ani: function (self) {
            self.css({"-webkit-animation":"popself 2s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                $(this).css({"-webkit-animation":""});
                if(H.answer.loadNumb == H.answer.QUElength){
                    H.answer.score();
                }else{
                    setTimeout(function () {
                        H.answer.loadQue();
                    },1300);
                    $(".rolling").css({"-webkit-animation":"rolling 3s","animation-timing-function":"ease","-webkit-animation-timing-function":"ease"}).one("webkitAnimationEnd", function () {
                        $(this).css({"-webkit-animation":""});
                        H.answer.timeText.text("10");
                        H.answer.timeBox();
                    });
                }
            });
        },
        answer: function (auid) {
            $(".answer-box>a").off();
            H.answer.iscontinue = false;
            getResult('api/question/answer', {
                yoi: openid,
                suid: $(".top>p").attr('quid'),
                auid: auid
            }, 'callbackQuestionAnswerHandler', true);
        }
	};

    W.callbackQuestionRoundHandler = function(data) {
        if (data.code == 0) {
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
                success : function(serverdata) {
                    hidenewLoading();
                    if(serverdata.t){
                        var serverT = serverdata.t;
                        var st = timestamp(data.pst);
                        var et = timestamp(data.pet);
                        if((serverT>st)&&(serverT<et)){
                            H.answer.fill(data.qitems);
                        }else{
                            console.log("not this time");
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        }
    };

	W.callbackanswerCount = function(data){
		if(data.code == 0){
            $(".tt-numb").removeClass('none');
            $(".tt-numb>p").html((data.tc?data.tc:'0')+"评论");
        }
	};

	W.callbackQuestionAnswerHandler = function(data){
		if(data.code == 0){
            H.answer.showResult(data);
        }
	};

    H.lottery = {
        dec: 0,
        sau: 0,
        type: 2,
        index: 0,
        times: 0,
        endType: 1,
        pageType: 1,
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
        sponsorDetailFlag: false,
        lotteryImgList: [],
        lotteryTime: 1,
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        init: function() {
            this.event();
            //this.resize();
            //this.getUserinfo_port();
            this.getSau_port();
            this.lotteryRound_port();
            //this.shake();
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
                if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                    H.lottery.isToLottey = false;
                }
            }
            //if(!$(".icon-lottery-wheel").hasClass("shake")) {
            //    $(".icon-lottery-wheel").addClass("shake");
            //    $("#audio-a").get(0).play();
            //}
            //if (!$(".yao-bg").hasClass("yao")) {
            //    H.lottery.imgMath();
            //    $("#audio-a").get(0).play();
            //    $(".m-t-b").css({
            //        '-webkit-transition': '-webkit-transform .2s ease',
            //        '-webkit-transform': 'translate(0px,-100px)'
            //    });
            //    $(".m-f-b").css({
            //        '-webkit-transition': '-webkit-transform .2s ease',
            //        '-webkit-transform': 'translate(0px,100px)'
            //    });
            //    setTimeout(function() {
            //        $(".m-t-b").css({
            //            '-webkit-transform': 'translate(0px,0px)',
            //            '-webkit-transition': '-webkit-transform .5s ease'
            //        });
            //        $(".m-f-b").css({
            //            '-webkit-transform': 'translate(0px,0px)',
            //            '-webkit-transition': '-webkit-transform .5s ease'
            //        });
            //    }, 1200);
            //    $(".yao-bg").addClass("yao");
            //}
            recordUserOperate(openid, "摇奖", "shakeLottery");
            if(!openid || openid=='null' || H.lottery.isToLottey == false || H.lottery.safeFlag == true) {
                setTimeout(function(){
                    H.lottery.fill(null);//摇一摇
                }, 1800);
            } else {
                if(!H.lottery.wxCheck) {
                    //微信config失败
                    setTimeout(function(){
                        H.lottery.fill(null);//摇一摇
                    }, 1800);
                    return;
                }
                H.lottery.drawlottery();
            }
            H.lottery.isToLottey = true;
        },
        event: function() {
        },
        getSau_port: function() {
            getResult("api/linesdiy/info", {}, "callbackLinesDiyInfoHandler");
        },
        getUserinfo_port: function() {
            getResult("api/user/info_v2", {oi: openid}, "callbackUserInfoHandler");
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
                data: {at:6},
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
        imgMath: function() {//随机背景
            var me = this;
            if(me.lotteryImgList.length >0){
                var i = Math.floor((Math.random()*me.lotteryImgList.length));
                $("body").css("background","url('" + me.lotteryImgList[i] + "') no-repeat center center");
            }
        },
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
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
                me.wxConfig();
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
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html('距摇奖开始还有');
            me.count_down();
            $('.countdown').removeClass('none');
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            me.downloadImg();
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html("距摇奖结束还有");
            me.count_down();
            $('.countdown').removeClass('none');
            me.index++;
            me.canJump = true;
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            me.downloadImg();
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...开始
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
            shownewLoading();
            var me = this, sn = new Date().getTime()+'';
            me.lotteryTime = 1;
            me.times = 0;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/exec/luck4Vote' + dev,
                data: { matk: matk , sn: sn, sau: me.sau},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryLuck4VoteHandler',
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
            this.imgMath();
            //setTimeout(function() {
            //    $(".yao-bg").removeClass("yao");
            //}, 300);
            //$(".icon-lottery-wheel").removeClass("shake");
            if(data == null || data.result == false || data.pt == 0){
                //$("#audio-a").get(0).pause();
                H.lottery.thanks();
                return;
            }else{
                //$("#audio-a").get(0).pause();
                //$("#audio-b").get(0).play();    //中奖声音
            }
            H.dialog.openLuck.open(data);
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
                if(H.lottery.pageType == 1){
                    toUrl("index.html");
                }
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
        change: function() {
            this.isCanShake = false;
            $(".countdown").removeClass('none').find(".countdown-tip").html('本期摇奖已结束！');
            $('.detail-countdown').html("");
            hidenewLoading();
        }
    };

    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            H.lottery.sau = data.tid;
        }
    };

})(Zepto);

$(function(){
    //getResult('api/voteguess/inforoud', {}, 'callbackVoteguessInfoHandler', true);
    H.answer.init();
    H.lottery.init();
});