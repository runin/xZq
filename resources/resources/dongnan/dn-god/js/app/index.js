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
        lotteryImgList: [],
        slideTo: getQueryString('rp') || '',
        lotteryTime: getRandomArbitrary(1,2),
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        init: function() {
            this.event();
            this.swiperInit();
            this.prereserve();
            this.lotteryRound_port();
            this.shake();
            this.tttj();
        },
        prereserve: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/program/reserve/get' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackProgramReserveHandler',
                success : function(data) {
                    if (!data.reserveId) {
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve_v2({
                        tvid:yao_tv_id,
                        reserveid:data.reserveId,
                        date:data.date},
                    function(resp){
                        if (resp.errorCode == 0) {
                            $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                        }
                    });
                }
            });
        },
        swiperInit: function() {
            var me = this, winW = $(window).width(), winH = $(window).height(), scaleW = window.innerWidth / 320, scaleH = window.innerHeight / 480, resizes = document.querySelectorAll('.resize');
            $('body').css({'width': winW, 'height': winH});
            if(!is_android()){
                $(".main-top").css("height", (winH / 2) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2) + "px").css('bottom', '0');
            } else {
                $(".main-top").css("height", (winH / 2 + 0.5) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2 + 0.5) + "px").css('bottom', '0');
            }
            for (var j = 0; j < resizes.length; j++) {
                resizes[j].style.width = parseInt(resizes[j].style.width) * scaleW + 'px';
                resizes[j].style.height = parseInt(resizes[j].style.height) * scaleH + 'px';
                resizes[j].style.top = parseInt(resizes[j].style.top) * scaleH + 'px';
                resizes[j].style.left = parseInt(resizes[j].style.left) * scaleW + 'px';
            };
            var mySwiper = new Swiper('.swiper-container', {
                direction: 'vertical'
            });
            if (H.index.slideTo == '1') {
                mySwiper.slideTo(1, 0, false);
                showTips('红包领取成功！');
            }
        },
        event: function() {
            var me = this;
            $('body').delegate('#test', 'click', function(e) {
                e.preventDefault();
                me.wxCheck = true;
                me.lotteryTime = 1;
                me.shake_listener();
            }).delegate('#btn-rule', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    H.dialog.rule.open();
                }
            }).delegate('#btn-reserve', 'click', function(e) {
                e.preventDefault();
                var that = this;
                var reserveId = $(this).attr('data-reserveid');
                var date = $(this).attr('data-date');
                if (!reserveId || !date) {
                    return;
                };
                window['shaketv'] && shaketv.reserve_v2({
                    tvid:yao_tv_id,
                    reserveid:reserveId,
                    date:date},
                function(d){
                    if(d.errorCode == 0){
                        $("#btn-reserve").addClass('none');
                    }
                });
                if (!$(this).hasClass('flag')) {
                    $(this).addClass('flag');
                    setTimeout(function(){
                        $(that).removeClass('flag');
                    }, 1000);
                };
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
            if (!$('.swiper-slide2').hasClass('swiper-slide-active')) {
                return;
            }
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
            if(!$(".icon-lottery-wheel").hasClass("shake")) {
                $(".icon-lottery-wheel").addClass("shake");
                $("#audio-a").get(0).play();
            }
            recordUserOperate(openid, "摇奖", "shakeLottery");
            recordUserPage(openid, "摇奖", 0);
            shownewLoading(null,'抽奖中，请稍后...');
            if(!openid || openid=='null' || H.index.isToLottey == false || H.index.safeFlag == true) {
                setTimeout(function(){
                    H.index.fill(null);//摇一摇
                }, 1800);
            } else {
                if(!H.index.wxCheck) {
                    //微信config失败
                    setTimeout(function(){
                        H.index.fill(null);//摇一摇
                    }, 1800);
                    return;
                }
                H.index.drawlottery();
            }
            H.index.isToLottey = true;
        },
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        account_num: function(){
            getResult('api/common/servicedaypv', {}, 'commonApiSDPVHander');
        },
        downloadImg: function(){
            var me = this;
            if(me.pal[0].bi.length > 0) {
                me.lotteryImgList = me.pal[0].bi.split(",")[0];
                $('.swiper-slide2').css({
                    'background': 'url(' + me.lotteryImgList + ') no-repeat center center',
                    'background-size': '100% 100%'
                });
            }
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
                me.downloadImg();
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
            setTimeout(function(){ me.red_record(); }, 3000);
            setInterval(function(){ me.red_record(); }, me.allRecordTime);
            // setTimeout(function(){ me.account_num(); }, pvDelay);
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
            $(".countdown-tip").html('距离摇奖开始还有');
            me.count_down();
            $('.countdown').removeClass('none');
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
            $(".countdown-tip").html("距离摇奖结束还有");
            me.count_down();
            $('.countdown').removeClass('none');
            me.index++;
            me.canJump = true;
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
            $(".icon-lottery-wheel").removeClass("shake");
            if(data == null || data.result == false || data.pt == 0){
                $("#audio-a").get(0).pause();
                H.index.thanks();
                return;
            }else{
                $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();    //中奖声音
                if (data.pt == 1) {
                    H.dialog.shiwuLottery.open(data);
                } else if (data.pt == 2) {
                    H.dialog.jifenLottery.open(data);
                } else if (data.pt == 4) {
                    H.dialog.redbagLottery.open(data);
                } else if (data.pt == 7) {
                    H.dialog.wxcardLottery.open(data);
                } else if (data.pt == 9) {
                    H.dialog.linkLottery.open(data);
                } else {
                    H.index.thanks();
                }
            }
        },
        thanks: function() {
            hidenewLoading();
            var me = this;
            me.canJump = true;
            me.isCanShake = true;
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
                        $(me).find('ul').animate({'margin-top': '-26px'}, delay, function() {
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
            $('.detail-countdown').html("");
            hidenewLoading();
        },
        tttj: function() {
            $('#tttj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
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
                if(H.index.recordFirstload){
                    H.index.recordFirstload = false;
                    H.index.scroll();
                }
                $(".marquee").animate({'opacity':'1'}, 800, function(){$(".marquee").removeClass("hidden");});
            }
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
            $(".getRed-num").removeClass("none");
        }
    };

    W.commonApiPromotionHandler = function(data) {
        if (data.code == 0 && data.desc && data.url) {
            var urlList = data.url.split(';');
            if (urlList.length == 1) {
                $('.btn-star').removeClass('none');
                $('.btn-star').click(function(e) {
                    e.preventDefault();
                    if ($(".btn-star").hasClass('requesting')) {
                        return;
                    }
                    $(".btn-star").addClass('requesting');
                    shownewLoading(null, '跳转中，请稍后...');
                    location.href = urlList[0];
                });
            } else if(urlList.length == 2) {
                $('.btn-star').removeClass('none');
                $('.btn-star').click(function(e) {
                    e.preventDefault();
                    if ($(".btn-star").hasClass('requesting')) {
                        return;
                    }
                    $(".btn-star").addClass('requesting');
                    shownewLoading(null, '跳转中，请稍后...');
                    location.href = urlList[0];
                });
                $('#tttj').removeClass('none').find('p').text(data.desc || '');
                $('#tttj').click(function(e) {
                    e.preventDefault();
                    if ($("#btn-rule").hasClass('requesting')) {
                        return;
                    }
                    $("#btn-rule").addClass('requesting');
                    shownewLoading(null, '跳转中，请稍后...');
                    location.href = urlList[1];
                });
            } else {
                $('#tttj').addClass('none');
                $('.btn-star').addClass('none');
            }
        } else {
            $('#tttj').addClass('none');
            $('.btn-star').addClass('none');
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
                if(t && !H.index.isError){
                    H.index.wxCheck = true;
                }
            }
        });
    });
    wx.error(function(res){
        H.index.isError = true;
    });
});