(function($) {
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
        lotteryTime: getRandomArbitrary(1,2),
        animateEnd: false,
        cookieTime: 12*60*60*1000,
        thanksFlag: null,
        init: function() {
            this.event();
            this.lotteryRound_port();
            this.shake();
            this.resize();
            this.growTree();
            this.tttj();
            this.getLogo();
            // $('#audio_bgm').get(0).play();
        },
        event: function() {
            var me = this;
            $('body').delegate('#test', 'click', function(e) {
                e.preventDefault();
                me.wxCheck = true;
                me.lotteryTime = 1;
                me.shake_listener();
            });
            $('.layer-wrapper').delegate('.layer-bg1', 'tap', function(e) {
                e.preventDefault();
                if ($('#tree').hasClass('step2')) {
                    if(!$(this).hasClass('requesting')){
                        $(this).addClass('requesting');
                        $('.rain-wrapper').removeClass('none');
                        $('.hand-tips').addClass('none');
                        $('#tree').removeClass().addClass('step3');
                        $('.sun-wrapper p').addClass('show');
                        $('.sun-wrapper img').removeClass('none');
                        setTimeout(function(){
                            $('.layer-bg1').animate({'opacity': '0'}, 1000, function() {
                                $('.layer-bg1').addClass('none');
                                $('.layer-bg2').css('opacity', '0').removeClass('requesting none').animate({'opacity': '1'}, 1000, function() {
                                });
                                $('.shake-wrapper').css('opacity', '0').removeClass('none').animate({'opacity': '1'}, 0, function() {
                                        me.animateEnd = true;
                                        $('.countdown').removeClass('must-none');
                                        $('.layer-bg').addClass('requesting');
                                        $('.lottery-wrapper').addClass('done');
                                });
                            });
                            var exp = new Date(); 
                            exp.setTime(exp.getTime() + me.cookieTime);
                            $.fn.cookie(W.openid + '_GrowFlag', 3, {expires: exp});
                        }, 4000);
                    }
                } else {
                    if(!$(this).hasClass('requesting')){
                        $(this).addClass('requesting');
                        $('.layer-bg1').removeClass('none')
                        $('.rain-wrapper').removeClass('none');
                        $('.layer-bg1 .hand-tips').addClass('none');
                        $('#tree').removeClass().addClass('step1');
                        setTimeout(function(){
                            $('.layer-bg1').animate({'opacity': '0'}, 1000, function() {
                                $('.layer-bg1').addClass('none');
                                $('.layer-bg2').css('opacity', '0').removeClass('requesting none').animate({'opacity': '1'}, 1000, function() {
                                });
                            });
                            var exp = new Date(); 
                            exp.setTime(exp.getTime() + me.cookieTime);
                            $.fn.cookie(W.openid + '_GrowFlag', 1, {expires: exp});
                        }, 4000);
                    }
                }
            });
            $('.layer-wrapper').delegate('.layer-bg2', 'tap', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    $('.sun-wrapper img').removeClass('none');
                    $('.layer-bg2 .hand-tips').addClass('none');
                    $('#tree').removeClass().addClass('step2');
                    $('.rain-wrapper').addClass('none');
                    $('.layer-bg1 .hand-tips').removeClass('none');
                    setTimeout(function(){
                        $('.layer-bg2').animate({'opacity': '0'}, 1000, function() {
                            $('.layer-bg2').addClass('none');
                            $('.layer-bg1').css('opacity', '0').removeClass('requesting none').animate({'opacity': '1'}, 1000, function() {
                            });
                        });
                        var exp = new Date(); 
                        exp.setTime(exp.getTime() + me.cookieTime);
                        $.fn.cookie(W.openid + '_GrowFlag', 2, {expires: exp});
                    }, 4000);
                }
            });
            $('#music').tap(function(){
                if($('#music').hasClass('playing')){
                    $('#music').removeClass('playing');
                    $('#audio_bgm').get(0).pause();
                    recordUserOperate(openid, "音乐暂停", "music-off");
                }else{
                    $('#music').addClass('playing');
                    $('#audio_bgm').get(0).play();
                    recordUserOperate(openid, "音乐开始", "music-on");
                }
            });
        },
        resize: function() {
            var me = this, winW = $(window).width(), winH = $(window).height();
            $('body').css({
                'width': winW,
                'height': winH
            });
        },
        growTree: function() {
            if($.fn.cookie(W.openid + '_GrowFlag')*1 == 1){
                $('#tree').removeClass().addClass('step1');
                $('.layer-bg1').removeClass('none').animate({'opacity': '0'}, 0, function() {
                    $('.layer-bg1').addClass('none');
                    $('.layer-bg2').css('opacity', '0').removeClass('requesting none').animate({'opacity': '1'}, 0, function() {
                    });
                });
            } else if ($.fn.cookie(W.openid + '_GrowFlag')*1 == 2) {
                $('#tree').removeClass().addClass('step2');
                $('.layer-bg2').removeClass('none').animate({'opacity': '0'}, 0, function() {
                    $('.layer-bg2').addClass('none');
                    $('.layer-bg1').css('opacity', '0').removeClass('requesting none').animate({'opacity': '1'}, 0, function() {
                    });
                });
            } else if ($.fn.cookie(W.openid + '_GrowFlag')*1 == 3) {
                $('#tree').removeClass().addClass('step3');
                $('.sun-wrapper p').addClass('show');
                $('.sun-wrapper img').removeClass('none');
                $('.hand-tips').addClass('none');
                $('.layer-bg1').removeClass('none').animate({'opacity': '0'}, 0, function() {
                    $('.layer-bg1').addClass('none');
                    $('.layer-bg2').css('opacity', '0').removeClass('requesting none').animate({'opacity': '1'}, 0, function() {
                    });
                    $('.shake-wrapper').css('opacity', '0').removeClass('none').animate({'opacity': '1'}, 0, function() {
                            H.index.animateEnd = true;
                            $('.countdown').removeClass('must-none');
                            $('.layer-bg').addClass('requesting');
                            $('.lottery-wrapper').addClass('done');
                    });
                });
            } else {
                $('.layer-bg1').removeClass('none');
            }
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
            // shownewLoading();
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
                            // me.change();
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
            var me = this, day = timeTransform(new Date().getTime()).split(" ")[0], lotteryDay = ['2016-01-08'];
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
                $('.fail-tips').removeClass('none');
                me.safeFlag = true;
            } else if (flag == 'off') {
                clearTimeout(me.pingFlag);
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
            if (!H.index.safeFlag) {
                if (!H.index.animateEnd) {
                    return;
                }
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
            if(!$(".lottery-wrapper").hasClass("yao")) {
                if(is_android()) {
                    $('#music').removeClass('playing');
                    $('#audio_bgm').get(0).pause();
                }
                $("#audio-a").get(0).play();
                clearTimeout(H.index.thanksFlag);
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
                        '-webkit-transition': '-webkit-transform .3s ease'
                    });
                    $(".m-f-b").css({
                        '-webkit-transform': 'translate3d(0,0,0)',
                        '-webkit-transition': '-webkit-transform .3s ease'
                    });
                }, 800);
                $('.thanks-tips').empty().removeClass('show');
                $(".lottery-wrapper").addClass("yao");
                $('.shake-wrapper img').addClass('noshake');
            }
            recordUserOperate(openid, "摇奖", "shakeLottery");
            shownewLoading(null, '抽奖中，请稍后...');
            if(!openid || openid=='null' || H.index.isToLottey == false || H.index.safeFlag == true) {
                setTimeout(function(){
                    H.index.fill(null);//摇一摇
                }, 1000);
            } else {
                if(!H.index.wxCheck) {
                    //微信config失败
                    setTimeout(function(){
                        H.index.fill(null);//摇一摇
                    }, 1000);
                    return;
                }
                H.index.drawlottery();
            }
            H.index.isToLottey = true;
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
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty().removeClass('none');
            $(".countdown-tip").html('距本轮摇奖开始还有');
            me.count_down();
            $('.countdown').removeClass('none');
            hidenewLoading();
            $('.home-box, #focus').animate({'opacity':'1'}, 500);
            $('.shake-wrapper img').addClass('noshake');
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty().removeClass('none');
            $(".countdown-tip").html("距本轮摇奖结束还有");
            me.count_down();
            $('.countdown').removeClass('none');
            me.index++;
            me.canJump = true;
            hidenewLoading();
            $('.home-box, #focus').animate({'opacity':'1'}, 500);
            $('.shake-wrapper img').removeClass('noshake');
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
            $('.detail-countdown').attr('etime',beginTimeLong).empty().removeClass('none');
            $(".countdown-tip").html('距本轮摇奖开始还有');
            me.count_down();
            $('.countdown').removeClass('none');
            hidenewLoading();
            $('.home-box, #focus').animate({'opacity':'1'}, 500);
            $('.shake-wrapper img').addClass('noshake');
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
                                            if (me.crossLotteryFlag) {
                                                me.type = 1;
                                                $('.countdown-tip').html('请稍后');
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
            me.lotteryTime = getRandomArbitrary(1,2);
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
            // me.imgMath();
            hidenewLoading();
            $(".lottery-wrapper").removeClass("yao");
            if(data == null || data.result == false || data.pt == 0){
                // $("#audio-a").get(0).pause();
                me.thanks();
                return;
            }else{
                // $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();    //中奖声音
            }
            if (data.pt == 1) {
                H.dialog.shiwuLottery.open(data);
            } else if (data.pt == 2) {
                H.dialog.jifenLottery.open(data);
            }  else if (data.pt == 4) {
                // H.dialog.redbagLottery.open(data);
                me.thanks();
            } else if (data.pt == 5) {
                H.dialog.codeLottery.open(data);
            }  else if (data.pt == 7) {
                H.dialog.wxcardLottery.open(data);
            } else if (data.pt == 9) {
                H.dialog.linkLottery.open(data);
            } else {
                me.thanks();
            }
        },
        thanks: function() {
            var me = this;
            hidenewLoading();
            me.canJump = true;
            me.isCanShake = true;
            if (typeof(thanks_tips) == 'undefined' || thanks_tips.length == 0) {
                var tips = '姿势摆的好，就能中大奖';
            } else {
                var tips = thanks_tips[getRandomArbitrary(0, thanks_tips.length)]
            }
            $('.thanks-tips').html(tips).addClass('show');
            me.thanksFlag = setTimeout(function(){
                me.isCanShake = true;
                $('.thanks-tips').removeClass('show');
                $('.shake-wrapper img').removeClass('noshake');
            }, 1500);
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
        change: function() {
            this.isCanShake = false;
            $('.shake-wrapper img').addClass('noshake');
            $(".countdown").removeClass('none').find(".countdown-tip").html('本期摇奖已结束，下期再战！');
            $('.detail-countdown').html("").addClass('none');
            hidenewLoading();
        },
        tttj: function() {
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
        getLogo: function() {
            getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler');
        }
    };

    W.commonApiPromotionHandler = function(data) {
        if (data.code == 0 && data.desc && data.url) {
            var urlList = data.url.split(';');
            var descList = data.desc.split(';');
            for (var i = 0; i < urlList.length; i++) {
                if (urlList[i] != '') {
                    (function(i){
                        if (i >= 0 && i < 3) {
                            if (descList[i] == '') {
                                $('#xf' + (i + 1)).parent('td').addClass('hide');
                            } else {
                                $('#xf' + (i + 1)).parent('td').removeClass('hide');
                                $('#xf' + (i + 1)).text(descList[i]);
                                $('#xf' + (i + 1)).click(function(e) {
                                    e.preventDefault();
                                    if ($(this).hasClass('requesting')) {
                                        return;
                                    }
                                    $(this).addClass('requesting');
                                    recordUserOperate(openid, $(this).attr("data-collect-desc"), $(this).attr("data-collect-flag"));
                                    shownewLoading(null, '跳转中，请稍后...');
                                    setTimeout(function(){location.href = urlList[i];}, 1000);
                                });
                            }
                        } else if (i == 3) {
                            $('#xf' + (i + 1)).parent('td').removeClass('hide');
                            $('#xf' + (i + 1)).click(function(e) {
                                e.preventDefault();
                                if ($(this).hasClass('requesting')) {
                                    return;
                                }
                                $(this).addClass('requesting');
                                recordUserOperate(openid, $(this).attr("data-collect-desc"), $(this).attr("data-collect-flag"));
                                shownewLoading(null, '跳转中，请稍后...');
                                setTimeout(function(){location.href = urlList[i];}, 1000);
                            });
                        } else {
                            $('#xf' + (i + 1)).removeClass('none');
                            $('#xf' + (i + 1) + ' p').text(descList[i] || '');
                            $('#xf' + (i + 1)).click(function(e) {
                                e.preventDefault();
                                if ($(this).hasClass('requesting')) {
                                    return;
                                }
                                $(this).addClass('requesting');
                                recordUserOperate(openid, $(this).attr("data-collect-desc"), $(this).attr("data-collect-flag"));
                                shownewLoading(null, '跳转中，请稍后...');
                                setTimeout(function(){location.href = urlList[i];}, 1000);
                            });
                        }
                    })(i);
                } else {
                    if (i >= 0 && i < 4) {
                        $('#xf' + (i + 1)).parent('td').addClass('hide');
                    } else {
                        $('#xf' + (i + 1)).addClass('none');
                    }
                }
            }
        } else {
            if (i >= 0 && i < 4) {
                $('#xf' + (i + 1)).parent('td').addClass('hide');
            } else {
                $('#xf' + (i + 1)).addClass('none');
            }
        }
    };

    W.callbackLinesDiyInfoHandler = function(data) {
        if (data.code == 0 && data.gitems != undefined) {
            if (data.gitems[0].ib) {
                $('.tvlogo').attr('src', data.gitems[0].ib);
            }
        }
    };
})(Zepto);

$(function() {
    H.index.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.index.isError){
                    H.index.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });

    wx.error(function(res){
        H.index.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});