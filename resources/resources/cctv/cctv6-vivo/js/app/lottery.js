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
    init: function() {
        if ($.cookie('canLottery') == null) {
            $('body').removeClass('intro');
            shownewLoading(null, '<p style="font-size:15px;line-height:19px;">通关游戏才能摇奖</p>');
            localStorage.clear();
            setTimeout(function(){
                location.href = 'game.html';
            }, 2000);
            return;
        } else {
            $.cookie('canLottery', 0, {expires: -1});
            var me = this, Img = new Image();
            Img.src = 'images/icon-vivoDoll.png';
            Img.onload = function (){
                setTimeout(function() {
                    $('body').removeClass('intro').find('#btn-go2back').removeClass('none');
                }, 3000);
            };
            Img.onerror = function (){
                setTimeout(function() {
                    $('body').removeClass('intro').find('#btn-go2back').removeClass('none');
                }, 3000);
            };
        }
        this.event();
        this.lotteryRound_port();
        this.shake();
    },
    event: function() {
        var me = this;
        $('body').delegate('#test', 'click', function(e) {
            e.preventDefault();
            me.wxCheck = true;
            me.lotteryTime = 1;
            me.shake_listener();
        }).delegate('#btn-go2back', 'click', function(e) {
            e.preventDefault();
            if(!$(this).hasClass('requesting')){
                $(this).addClass('requesting');
                if ($.cookie('canLottery') != null) {
                    $.cookie('canLottery', 0, {expires: -1});
                }
                toUrl('index.html');
            }
        }).delegate('#btn-intro-close', 'click', function(e) {
            e.preventDefault();
            if(!$(this).hasClass('requesting')){
                $(this).addClass('requesting');
                $('body').removeClass('intro');
                setTimeout(function(){
                    $('#btn-go2back').removeClass('none');
                }, 100);
            }
        });
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
                    delLotteryCookie();
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
            $('.fail-tips').removeClass('none');
            me.safeFlag = true;
        } else if (flag == 'off') {
            clearTimeout(me.pingFlag);
            addLotteryCookie();
            me.pingFlag = null;
            me.lotteryRound_port();
            $('.countdown, .icon-lotterytip').removeClass('none');
            $('.fail-tips').addClass('none');
            me.safeFlag = false;
        } else {
            me.safeLotteryMode('off');
        };
        hidenewLoading();
    },
    shake_listener: function() {
        if ($('body').hasClass('intro')) {
            return;
        }
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
        if(!$(".container").hasClass("yao")) {
            $("#audio-a").get(0).play();
            $('.icon-X6').addClass('wobble');
            $(".container").addClass("yao");
        }
        recordUserOperate(openid, "摇奖", "shakeLottery");
        shownewLoading(null, '抽奖中，请稍后...');
        if(!openid || openid=='null' || H.lottery.isToLottey == false || H.lottery.safeFlag == true) {
            setTimeout(function(){
                H.lottery.fill(null);//摇一摇
            }, 1000);
        } else {
            setTimeout(function() {
                if(!H.lottery.wxCheck) {
                    //微信config失败
                    setTimeout(function(){
                        H.lottery.fill(null);//摇一摇
                    }, 1000);
                    return;
                }
                H.lottery.drawlottery();
            }, 1000);
        }
        H.lottery.isToLottey = true;
    },
    account_num: function(){
        getResult('api/common/servicepv', {}, 'commonApiSPVHander');
    },
    red_record: function(){
        getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
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
                    // me.crossCountdown(prizeActList[prizeLength - 1].nst);
                    $(".countdown").removeClass('none').find(".countdown-tip").html('通关游戏，可参与新一轮摇奖');
                    shownewLoading(null,'<p style="font-size:14px;line-height:18px;">通关游戏<br>可参与新一轮摇奖</p>');
                    me.changeUrl();
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
                    return;
                }
                if(comptime(nowTimeStr, beginTimeStr) > 0){
                    // me.beforeCountdown(prizeActList[i]);
                    me.changeUrl();
                    $(".countdown").removeClass('none').find(".countdown-tip").html('摇奖还未开始！敬请期待...');
                    shownewLoading(null,'<p style="font-size:14px;line-height:18px;">摇奖还未开始！<br>敬请期待...</p>');
                    return;
                }
            }
            // me.initComponent();
        }else{
            me.safeLotteryMode('on');
            return;
        }
    },
    initComponent: function(){
        var me = this, accountDelay = Math.ceil(3000*Math.random() + 1000), recordDelay = Math.ceil(3000*Math.random() + 3000), allRecordTime = Math.ceil(40000*Math.random() + 100000);
        setTimeout(function(){me.account_num();}, accountDelay);
        setTimeout(function(){me.red_record();}, recordDelay);
        setInterval(function(){me.red_record();}, allRecordTime);
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
        $(".countdown-tip").html('距本轮摇奖开始还有');
        me.count_down();
        $('.countdown').removeClass('none');
        if(prizeActList.bi.length > 0){
            me.lotteryImgList = prizeActList.bi.split(",");
        }
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
        $(".countdown-tip").html("距本轮摇奖结束还有");
        me.count_down();
        $('.countdown').removeClass('none');
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
        $('.detail-countdown').attr('etime',beginTimeLong).empty();
        $(".countdown-tip").html('距本轮摇奖开始还有');
        me.count_down();
        $('.countdown').removeClass('none');
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
                                    // $('.countdown-tip').html('请稍后');
                                    // shownewLoading(null,'请稍后...');
                                    // setTimeout(function() {
                                        // me.nowCountdown(me.pal[me.index]);
                                        me.changeUrl();
                                    // }, 1000);
                                    $(".countdown").removeClass('none').find(".countdown-tip").html('通关游戏，可参与新一轮摇奖');
                                    shownewLoading(null,'<p style="font-size:14px;line-height:18px;">通关游戏<br>可参与新一轮摇奖</p>');
                                }
                            }else if(me.type == 2){
                                //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                                if(!me.isTimeOver){
                                    me.isTimeOver = true;
                                    if(me.index >= me.pal.length){
                                        if (me.crossLotteryFlag) {
                                            me.type = 1;
                                            // $('.countdown-tip').html('请稍后');
                                            // shownewLoading(null,'请稍后...');
                                            // setTimeout(function() {
                                                // me.crossCountdown(me.pal[me.pal.length - 1].nst);
                                                me.changeUrl();
                                            // }, 1000);
                                            $(".countdown").removeClass('none').find(".countdown-tip").html('通关游戏，可参与新一轮摇奖');
                                            shownewLoading(null,'<p style="font-size:14px;line-height:18px;">通关游戏<br>可参与新一轮摇奖</p>');
                                        } else {
                                            me.type = 3;
                                            me.change();
                                        }
                                        return;
                                    }
                                    // $('.countdown-tip').html('请稍后');
                                    // shownewLoading(null,'请稍后...');
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
                                            // me.nowCountdown(me.pal[me.index]);
                                            me.changeUrl();
                                            $(".countdown").removeClass('none').find(".countdown-tip").html('通关游戏，可参与新一轮摇奖');
                                            shownewLoading(null,'<p style="font-size:14px;line-height:18px;">通关游戏<br>可参与新一轮摇奖</p>');
                                        }else if(me.endType == 1){
                                            // me.beforeCountdown(me.pal[me.index]);
                                            me.changeUrl();
                                            $(".countdown").removeClass('none').find(".countdown-tip").html('摇奖还未开始！敬请期待...');
                                            shownewLoading(null,'<p style="font-size:14px;line-height:18px;">摇奖还未开始！<br>敬请期待...</p>');
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
        var me = this, sn = new Date().getTime()+'';
        me.lotteryTime = getRandomArbitrary(1,3);
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
                    me.lotteryTime = getRandomArbitrary(10, 18);
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
        $(".container").removeClass("yao");
        $('.icon-X6').removeClass('wobble');
        if(data == null || data.result == false || data.pt == 0){
            $("#audio-a").get(0).pause();
            H.dialog.thanks.open();
            return;
        }else{
            $("#audio-a").get(0).pause();
            $("#audio-b").get(0).play();    //中奖声音
        }
        if (data.pt == 1) {
            H.dialog.shiwuLottery.open(data);
        } else if (data.pt == 7) {
            H.dialog.wxcardLottery.open(data);
        }  else if (data.pt == 9) {
            H.dialog.linkLottery.open(data);
        } else {
            H.dialog.thanks.open();
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
        setTimeout(function() {me.fill(data);}, 1000);
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
                    $(me).find('ul').animate({'margin-top': '-34px'}, delay, function() {
                        $(me).find('ul li:first').appendTo($ul)
                        $(me).find('ul').css({'margin-top': '0'});
                    });
                }, 3000);
            };
        });
    },
    change: function() {
        hidenewLoading();
        this.isCanShake = false;
        $('body').removeClass('intro');
        $(".countdown").removeClass('none').find(".countdown-tip").html('本期摇奖已结束，下期再战！');
        $('.detail-countdown').html("");
    },
    changeUrl: function() {
        this.isCanShake = false;
        // $(".countdown").removeClass('none').find(".countdown-tip").html('不要走开，玩完游戏再摇一次吧！');
        $('.detail-countdown').html("");
        $('body').removeClass('intro');
        setTimeout(function(){
            location.href = 'index.html';
        }, 2000);
        // toUrl('game.html');
    }
};

W.commonApiSPVHander = function(data){
    if(data.code == 0 && data.c != 0){
        $(".count label").html(data.c);
        $(".count").animate({'opacity':'1'}, 500).removeClass("hidden");
        setInterval(function(){
            var pv = getRandomArbitrary(33,100);
            pv = $(".count label").html()*1 + pv;
            $(".count label").html(pv);
        }, 3000);
    }
};

W.callbackLotteryAllRecordHandler = function(data){
    if(data.result){
        var list = data.rl;
        if(list && list.length > 0){
            var con = "";
            for(var i = 0 ; i < list.length; i++){
                var username = (list[i].ni || "匿名用户");
                if (username.length >= 7) {
                    username = username.substring(0, 6) + '...';
                }
                con += "<li><span>" + username + "&nbsp;中了" + list[i].pn + "</span></li>";
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
            $(".marquee").animate({'opacity':'1'}, 800, function(){$(".marquee").removeClass("hidden");});
        }
    }
};

$(function() {
    H.lottery.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                if(t && !H.lottery.isError){
                    H.lottery.wxCheck = true;
                }
            }
        });
    });

    wx.error(function(res){
        H.lottery.isError = true;
    });
});