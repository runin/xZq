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
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        PVTime: Math.ceil(20000*Math.random() + 10000),
        $lotteryCountdown: $("#lottery-countdown"),
        $goLottery: $("#go-lottery"),//投票页摇奖按钮状态
        $showTips: $("#show-tips"),//摇奖页摇奖状态提示
        init: function() {
            this.event();
            this.resize();
            this.lotteryRound_port();
            this.jump();

            /*this.keyDown();
            this.scroll();*/

            //getResult('api/article/list', {}, 'callbackArticledetailListHandler');
            this.shake();
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

            $(".btn-back").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("switch.html?cb41faa22e731e9b="+cb41faa22e731e9b);
            });
        },

        keyDown: function() {
            document.onkeydown = function(e) {
                var keycode = e.which;
                var realkey = String.fromCharCode(e.which);
                if (keycode == 32) {
                    H.lottery.shake_listener();
                }
            }
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
                        console.log(me.nowTime);
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
                //H.lottery.times =1;
                //if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                //}
                H.lottery.isToLottey = true;
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
                if($('body').attr("data-tip") == "lottery"){
                    $("body").css({"background":"url('" + me.lotteryImgList[i] + "') no-repeat center center","background-size":"100% auto"});
                }
            }
        },
        jump: function(){
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        red_record: function(){
            getResult('api/lottery/allrecord', {pt:4}, 'callbackLotteryAllRecordHandler');
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
                //如果第一轮未开始
                if(comptime(prizeActList[0].pd + " " + prizeActList[0].st,nowTimeStr) < 0){
                    me.beforeCountdown(prizeActList[0]);
                    me.$goLottery.find("span").text("等待摇奖");
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
            var me = this, recordDelay = Math.ceil(15000*Math.random() + 20000);
            setTimeout(function(){ me.red_record(); }, recordDelay);
            setInterval(function(){ me.red_record(); }, me.allRecordTime);
            setTimeout(function() {me.account_num();}, me.PVTime);
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.$lotteryCountdown.find(".countdown-tip").html('距离摇奖开始还有');
            me.count_down();
            me.$lotteryCountdown.removeClass('none');
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            me.downloadImg();
            hidenewLoading();
            //me.$goLottery.find("span").text("去摇奖");
            //me.$showTips.text("摇奖即将开始，请等待主持人提示开始摇奖");
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.$lotteryCountdown.find(".countdown-tip").html("距摇奖结束还有");
            me.count_down();
            me.$lotteryCountdown.removeClass('none');
            me.index++;
            me.canJump = true;
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            me.downloadImg();
            hidenewLoading();
            //me.$goLottery.find("span").text("去摇奖");
            //me.$showTips.text("好运唯我有，大奖摇到手！使劲摇吧！");
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
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
            //me.$lotteryCountdown.find(".countdown-tip").html('距本轮摇奖开始还有');
            me.count_down();
            //me.$lotteryCountdown.removeClass('none');
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            me.$lotteryCountdown.find('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%' + '</span><label>时</label><span class="fetal-H">' + '%M%' + '</span>分<span class="fetal-H">' + '%S%' + '</span>秒', // 还有...结束
                    stpl: '<span class="fetal-H">%H%' + '</span><label>时</label><span class="fetal-H">' + '%M%' + '</span>分<span class="fetal-H">' + '%S%' + '</span>秒', // 还有...开始
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
                        }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        drawlottery: function() {
            var me = this, sn = new Date().getTime()+'';
            me.lotteryTime = 0;
            me.times = 0;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/exec/luck' + dev,
                data: { matk: matk , sn: sn},
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
                if($('body').attr("data-tip") == "lottery"){
                    $("#audio-a").get(0).pause();
                }
                setTimeout(function(){
                    H.dialog.thanks.open(data);
                }, 1500);
                return;
            }else{
                if($('body').attr("data-tip") == "lottery"){
                    $("#audio-a").get(0).pause();
                    $("#audio-b").get(0).play();    //中奖声音
                }
            }

            if (data.pt == 1) {//1:实物奖品
                H.dialog.shiwuLottery.open(data);
            }else if (data.pt == 4) {//4:现金红包
                H.dialog.redbagLottery.open(data);
            }else if (data.pt == 7) {//7:电子卡券
                H.dialog.wxcardLottery.open(data);
            } else if (data.pt == 9) {//9:外链领取奖品
                H.dialog.linkLottery.open(data);
            } else {
                H.dialog.thanks.open(data);
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
            $('.thanks-tips').html(tips).addClass('show');
            setTimeout(function(){
                $('.thanks-tips').removeClass('show');
                setTimeout(function(){
                    $('.thanks-tips').empty();
                }, 300);
            }, 800);
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
                if (len == 0) {
                    $(me).addClass('none');
                } else {
                    $(me).removeClass('none');
                }
                if(len > 1) {
                    com[i] = setInterval(function() {
                        $(me).find('ul').animate({'margin-top': '-28px'}, delay, function() {
                            $(me).find('ul li:first').appendTo($ul)
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                };
            });
        },
        change: function() {
            var me = H.lottery;
            this.isCanShake = false;
            //me.$lotteryCountdown.removeClass('none').find(".countdown-tip").html('本期摇奖已结束，下期再战！');
            me.$lotteryCountdown.find('.detail-countdown').html("").addClass('none');
            hidenewLoading();
            me.$goLottery.find("span").text("等待摇奖");
            me.$showTips.text("本期摇奖已结束，下期再战！");
            $(".clock").css({"opacity":"0","width":"0"});
        }
    };

    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            // <img src='images/jl-left.png'><span>
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
                $(".count").removeClass("none");
                setInterval(function(){
                    var pv = getRandomArbitrary(33,99);
                    pv = $(".count label").html()*1 + pv;
                    $(".count label").html(pv);
                },3000);
            }
        }
    };
    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            var desc_list = data.desc.split(";");
            var url_list = data.url.split(";");
            var index = localStorage.getItem("ysdjq_link_index")?(localStorage.getItem("ysdjq_link_index")*1):0;
            if(index >= url_list.length){
                index = 0;
            }
            $('#ddtj').attr('data-collect-flag', "ysdjq-lottery-link-btn-"+index).attr("data-collect-desc","摇奖页-吸粉链接-"+index);
            $('.ddtj').text(desc_list[index] || '');
            $('.ddtj-div').addClass("wobble");
            $('#ddtj').click(function(){
                location.href = url_list[index];
                localStorage.setItem("ysdjq_link_index", ++index);
            });
            $('#ddtj').removeClass("hidden");
        } else {
            $('#ddtj').remove();
        }
    };
    W.callbackArticledetailListHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.code == 0){
                $(".AD").removeClass('none').on("click", function () {
                    shownewLoading();
                    setTimeout(function () {
                        window.location.href = data.arts[0].gu;
                    },500);
                });
                $(".AD-tips").before('<img data-collect="true" data-collect-flag="lottery-AD" data-collect-desc="摇奖页广告" class="AD-img" src="' + (data.arts[2].img).toString() + '" />');
            }else if(data.code == 1){
            }
        }
        hidenewLoading();
    }
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