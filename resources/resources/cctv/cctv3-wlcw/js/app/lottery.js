(function($) {
	H.lottery = {
        dec: 0,
        type: 2,
        index: 0,
        times: 0,
        endType: 1,
        pal: null,
        nowTime: null,
        roundData: null,
        nextPrizeAct: null,
        canJump: true,
        wxCheck: false,
        isError: false,
        lastRound: false,
        isToLottey: true,
        isCanShake: false,
        isTimeOver: false,
        repeat_load: true,
        lotteryImgList: [],
        lotteryTime: getRandomArbitrary(1,6),
        first: true,
		init: function() {
            var me = this;
            me.event();
            me.resize();
            me.lotteryRound_port();
            me.shake();
		},
		resize: function() {
			var me = this, winW = $(window).width(), winH = $(window).height(), resizes = document.querySelectorAll('.resize'), scaleW = window.innerWidth / 320, scaleH = window.innerHeight / 480;
			$('body, .cover-box').css({'width': winW, 'height': winH});
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
		},
		event: function() {
			var me = this;
            $("#test").click(function(e){
                wx.openAddress({
                    success: function (res) {
                            // 用户成功拉出地址
                            alert("succ"+JSON.stringify(res));
                        },
                        cancel: function (res) {
                            alert("cancel"+JSON.stringify(res));
                            // 用户取消拉出地址
                        }
                    });
            });
		},
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        ping: function() {
            var me = this;
            setInterval(function(){
                $.ajax({
                    type: 'GET',
                    async: true,
                    url: domain_url + 'api/common/time' + dev,
                    data: {},
                    dataType: "jsonp",
                    jsonpCallback: 'commonApiTimeHandler',
                    timeout: 10000,
                    success: function(data) {
                        if(data.t){
                            me.dec = data.t - new Date().getTime();
                        }
                    }
                });
            },10000);
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
                        $('.product-box-pull').removeClass('on');
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
                    me.change();
                }
            });
        },
        shake_listener: function() {
                if(H.index.activeIndex != 1){
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
            if(!$(".fudai").hasClass("yao")) {
                $("#audio-a").get(0).play();
                $(".fudai").addClass("yao");
                $(".coin").addClass("yao-coin");
            }
            if(!openid || openid=='null' || H.lottery.isToLottey == false) {
                H.lottery.fill(null);
            } else {
                if(!H.lottery.wxCheck) {
                    //微信config失败
                    H.lottery.fill(null);//摇一摇
                    return;
                }
                H.lottery.drawlottery();
            }
            H.lottery.isToLottey = true;
        },
        imgMath: function() {//随机背景
            var me = this;
            if(me.lotteryImgList.length >0){
                var i = Math.floor((Math.random()*me.lotteryImgList.length));;
                $("#shake-box").css("background","url('" + me.lotteryImgList[i] + "') no-repeat center center");
            }
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
            var me = this, nowTimeStr = this.nowTime,  prizeLength = 0, prizeActList = data.la, day = nowTimeStr.split(" ")[0];
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
                $('.swiper-container').animate({'opacity':'1'}, 300);
                me.ping();
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
                me.change();
            }
        },
        initComponent: function(){
            var me = this;
            setTimeout(function() {me.account_num();}, me.PVTime);
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            $(".shake-content").animate({opacity:0},800);
            setTimeout(function(){
                $("#shake").addClass("none");
                $("#before-shake").removeClass("none");
                $("#before-shake").animate({opacity:1},800);
            },800);
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html('距摇奖开始还有');
            me.count_down();
            $('.countdown, .icon-countdowntips').removeClass('none');
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            me.downloadImg();
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            if (!H.index.myVedio.paused){
                H.index.myVedio.pause();
                $(".play").animate({opacity:1},500);
            }
            $(".shake-content").animate({opacity:0},800);
            setTimeout(function(){
                $("#before-shake").addClass("none");
                $("#shake").removeClass("none");
                $("#shake").animate({opacity:1},800);
            },800);
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html("距摇奖结束还有");
            me.count_down();
            $('.countdown, .icon-countdowntips').removeClass('none');
            me.index++;
            me.canJump = true;
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            me.downloadImg();
            hidenewLoading();
            if(H.lottery.first){
                setInterval(function(){
                    H.lottery.allRecord_port();
                },8000);
                setInterval(function(){
                    H.lottery.leftPrizeCount();
                },5000);
            }
        },
        count_down: function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl:  '%M%' + '分' + '%S%' + '秒', // 还有...结束
                    stpl:  '%M%' + '分' + '%S%' + '秒', // 还有...开始
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
                                    $('.countdown-tip').html('请稍后');
                                    shownewLoading(null,'请稍后...');
                                    if(me.index >= me.pal.length){
                                        me.change();
                                        me.type = 3;
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
            me.lotteryTime = getRandomArbitrary(1,6);
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
                    hidenewLoading();
                },
                success: function(data) {
                    if(data.flow && data.flow == 1){
                        me.lotteryTime = getRandomArbitrary(6, 10);
                        me.times = 0;
                        sn = new Date().getTime()+'';
                        me.fill(null);//摇一摇
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            sn = new Date().getTime()+'';
                            me.fill(data);
                        }
                    }else{
                        sn = new Date().getTime()+'';
                        me.fill(null);
                    }
                },
                error: function() {
                    sn = new Date().getTime()+'';
                    me.fill(null);//摇一摇
                }
            });
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
        },
        fill: function(data) {
            var me = this;
            me.imgMath();
            setTimeout(function(){
                $(".fudai").removeClass("yao");
                $(".coin").removeClass("yao-coin");
                if(data == null || data.result == false || data.pt == 0){
                    me.thanks();
                    return;
                }else{
                    $("#audio-b").get(0).play();    //中奖声音
                }
                if (data.pt == 1) {
                    H.dialog.shiwuLottery.open(data);
                } else if (data.pt == 7) {
                    H.dialog.wxcardLottery.open(data);
                } else if (data.pt == 4) {
                    H.dialog.redLottery.open(data);
                } else {
                    me.thanks();
                }
            },1000);
        },
        thanks: function() {
            H.dialog.thanksLottery.open();
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
                                "checkJsApi",
                                "openAddress"
                            ]
                        });
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        change: function() {
            hidenewLoading();
            // this.tttj();
            this.isCanShake = false;
            $(".countdown-tip").html('今日摇奖已结束，请明天再来');
            $('.detail-countdown').html("");
            $(".countdown, .showOver").removeClass("none");
            $('.swiper-container').animate({'opacity':'1'}, 300);
        },
        allRecord_port: function(){
            getResult('api/lottery/allrecord', {ol:1}, 'callbackLotteryAllRecordHandler');
        },
        //查询业务当前抽奖活动有限制奖品剩余数量
        leftPrizeCount:function(){
            getResult('api/lottery/leftDayCountLimitPrize',{},'callbackLeftDayCountLimitPrizeHandler');
        },
        scroll: function(options) {
            $('.marquee').each(function(i) {
                var me = this, com = [], delay = 1000;
                var len  = $(me).find('li').length;
                var $ul = $(me).find('ul');
                var hei = $(me).find('ul li').height();
                if (len == 0) {
                    $(me).addClass('hidden');
                } else {
                    $(me).removeClass('hidden');
                }
                if(len > 1) {
                    com[i] = setInterval(function() {

                        $(me).find('ul').animate({'margin-top': -hei+'px'}, delay, function(){
                            $(me).find('ul li:first-child').appendTo($ul);
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                }
            });
        },
	};

    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            var list = data.rl;
            if(list && list.length>0){
                var con = "";
                for(var i = 0 ; i<list.length; i++){
                    con +='<li><i></i>'+(list[i].ni || "匿名用户")+'中了'+list[i].pn+'</li>';
                }
                var len = $(".marquee").find("li").length;
                if(len >= 500){
                    $(".marquee").find("ul").html(con);
                }else{
                    $(".marquee").find("ul").append(con);
                }
                if(H.lottery.first){
                    H.lottery.first = false;
                    H.lottery.scroll();
                }
                $(".marquee").removeClass("none");
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

    W.callbackLeftDayCountLimitPrizeHandler = function(data){
        if(data.result){
            var num = $(".left-num").text();
            if(num*1 >= data.lc || num*1 == 0){
                $(".left-num").text(data.lc);
                if(data.lc == 0){
                    $(".rednum").css("opacity","0");
                }else{
                    $(".rednum").css("opacity","1");
                }
            }
        }
    };
})(Zepto);

$(function() {
	H.lottery.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard',
                'openAddress'
            ],
            success: function (res) {
                alert(JSON.stringify(res));
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
    });
});