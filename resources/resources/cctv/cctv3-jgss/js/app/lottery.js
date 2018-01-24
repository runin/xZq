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
        lotteryImgList: [],
        lotteryTime: getRandomArbitrary(1,3),
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        redNextWidth:0,
        entityNextWidth:0,
        init: function() {
            this.event();
            this.resize();
            this.lotteryRound_port();
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
            $('#btn-go2vote').click(function(e){
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('vote.html');
                }
            });
            $('.icon-banner').click(function(e){
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    shownewLoading(null,"请稍候...");
                    setTimeout(function(){
                        location.href = "http://wq.jd.com/mshop/gethomepage?venderid=119471&PTAG=17048.1.1";
                    },500);
                }
            });
            $("#btn-go2talk").click(function(e) {
                e.preventDefault();
                if(!$(this).hasClass('bounce')){
                    $(this).addClass('bounce');
                    toUrl("talk.html");
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
                        var nowTimeStemp = new Date().getTime();
                        me.dec = nowTimeStemp - data.t;
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
                            me.specialFetalData();
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                    me.safeLotteryMode('on');
                }
            });
        },
        specialFetalData: function() {
            var me = this, day = timeTransform(new Date().getTime()).split(" ")[0], lotteryDay = ['2016-02-09','2016-02-10','2016-02-11','2016-02-12','2016-02-13'];
            if (lotteryDay.indexOf(day) >= 0) {
                me.safeLotteryMode('on');
            } else {
                me.change();
            }
        },
        safeLotteryMode: function(flag) {
            var me = this;
            if (flag == 'on') {
                me.checkPing();
                $('.countdown, .icon-lotterytip').addClass('none');
                me.safeFlag = true;
                $(".home-box").removeClass("none");
                $(".home-box").animate({opacity:1},500);
                me.imgMath();
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
                }, 1000);
                $(".home-box").addClass("yao");
            }
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
                H.lottery.drawlottery();
            }
            H.lottery.isToLottey = true;
        },
        imgMath: function() {//随机背景
            var me = this;
            if(me.lotteryImgList.length >0){
                var i = Math.floor((Math.random()*me.lotteryImgList.length));
                $("body").css("background","url('" + me.lotteryImgList[i] + "') no-repeat center center #EEE56A");
                $("body").css("background-size","100% auto");
            }else{
                $("body").css("background","url(./images/bg-yao-default.jpg) no-repeat center center #EEE56A");
                $("body").css("background-size","100% auto");
            }
        },
        initComponent: function(){
            var me = this;
            setTimeout(function(){
                me.entity_record();
                me.red_record();
            },4500);
            setTimeout(function(){ me.account_num(); }, me.allRecordTime);
        },
        account_num: function(){
            getResult('api/common/servicedaypv', {}, 'commonApiSDPVHander');
        },
        entity_record: function(){
            getResult('api/lottery/allrecord', {ol:1}, 'callbackLotteryAllRecordHandler');
        },
        red_record: function(){
            getResult('api/lottery/allrecord', {pt:4}, 'callbackLotteryAllRecordHandler');
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
                    me.change(true);
                    return;
                }
                //config微信jssdk
                me.wxConfig();
                $(".home-box").removeClass("none");
                $(".home-box").animate({opacity:1},500);
                me.imgMath();
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
            shownewLoading();
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
            var me = this;
            me.imgMath();
            $(".home-box").removeClass("yao");
            if(data == null || data.result == false || data.pt == 0){
                me.thanks();
                return;
            }else{
                $("#audio-b").get(0).play();    //中奖声音
            }
            if (data.pt == 1) {
                H.dialog.shiwuLottery.open(data);
            } else if (data.pt == 4) {
                H.dialog.redbagLottery.open(data);
            } else if (data.pt == 7) {
                H.dialog.wxcardLottery.open(data);
            } else if (data.pt == 9) {
                H.dialog.linkLottery.open(data);
            } else {
                me.thanks();
            }
        },
        thanks:function(){
            var me = this;
            me.canJump = true;
            if (typeof(thanks_tips) == 'undefined' || thanks_tips.length == 0) {
                var tips = '哎呀，不小心与金子擦肩而过';
            } else {
                var tips = thanks_tips[getRandomArbitrary(0, thanks_tips.length)]
            }
            showTips(tips,5.0,1500);
            setTimeout(function(){
                me.isCanShake = true;
            }, 1400);
        },
        lottery_point: function(data) {
            var me = this;
            setTimeout(function() {me.fill(data);},1500);
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
        scroll: function(con,options) {
            var me = this;
            var spanlen = $(".mar-div" + options).find("span").length;
            if(spanlen >= 500){
                $(".mar-div" + options).empty();
                $(".inMar" + options).removeAttr("style");
                $(".mar-div" + options).html(con);
            }else{
                $(".mar-div" + options).append(con);
            }
            $(".marquee").removeClass("none");
            $(".inMar" + options).css("width",$(".mar-div" + options).width() + "px");
            var offset = $(window).width() * 0.65;
            var len = $(".mar-div" + options).width() - offset;
            if(options == 1){
                var speed = 70;
                $(".inMar1").animate({translateX:-len + "px"},(len-me.entityNextWidth)/speed*1000,"linear",function(){
                    H.lottery.entity_record();
                });
                me.entityNextWidth = len;
            }else{
                var speed = 90;
                $(".inMar2").animate({translateX:-len + "px"},(len-me.redNextWidth)/speed*1000,"linear",function(){
                    H.lottery.red_record();
                });
                me.redNextWidth = len;
            }
        },
        change: function(flag) {
            this.isCanShake = false;
            $(".countdown").removeClass('none').find(".countdown-tip").html('摇奖已结束，期待下期吧！');
            $('.detail-countdown').html("");
            hidenewLoading();
            $(".home-box").animate({opacity:0},500);
            setTimeout(function(){
                $(".home-box").addClass("none");
                if(!flag){
                    $("body").css("background","url(./images/bg.jpg) 0 0 no-repeat #EEE56A");
                    $("body").css("background-size","100% 100%");
                }
                $(".over").removeClass("none");
            },500);
        }
    };

    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            var list = data.rl;
            if(list && list.length > 0){
                if(list.length <2){
                    if(data.ol && data.ol == 1){
                        setTimeout(function(){
                            H.lottery.entity_record();
                        },10000);
                    }else{
                        setTimeout(function(){
                            H.lottery.red_record();
                        },5000);
                    }
                    return;
                }
                var con = "";
                for(var i = 0 ; i < list.length; i++){
                    var recordClass = "";
                    if(list[i].pn.indexOf("金豆") >= 0){
                        var recordClass = "beans";
                    }else if(list[i].pn.indexOf("金元宝") >= 0){
                        var recordClass = "bao";
                    }else if(list[i].pn.indexOf("金条") >= 0){
                        var recordClass = "gold";
                    }else if(list[i].pn.indexOf("金猴") >= 0){
                        var recordClass = "monkey";
                    }
                    con += "<span class='record-span "+recordClass+"'><i></i>哇！" + (list[i].ni || "匿名用户") + "喜中<span>" + list[i].pn + "</span></span>";
                }
                if(data.ol && data.ol == 1){
                    H.lottery.scroll(con,1);
                }else{
                    H.lottery.scroll(con,2);
                }
            }
        }
    };

    W.commonApiSDPVHander = function(data){
        if(data.code == 0){
            if (data.c*1 != 0) {
                $(".user-num").html(data.c);
                $(".count").removeClass("hidden");
                setInterval(function(){
                    var pv = getRandomArbitrary(33,99);
                    pv = $(".user-num").html()*1 + pv;
                    $(".user-num").html(pv);
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