(function($){
    H.record = {
        page: 1,
        pageSize: 20,
        beforePage: 0,
        loadmore: true,
        firstLoad: true,
        rankOpen: false,
        request_cls: 'requesting',
        isAni:false,
        isShow:false,
        isChg:false,
        uid:null,
        tk:null,
        redNum:0,
        lotNum:0,
        cardNum:0,
        recData:null,
        init: function(){
            this.resize();
            this.event();
            this.scrollEvent();
            //this.getUuid();
            H.record.getUserinfo();
            H.record.getMygold();
            H.record.getRecord();
        },
        event: function(){
            var me = this;
            $('.btn-talk').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                $(this).addClass(me.request_cls);
                toUrl('talk.html');
            });
            $('.btn-tg').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                $(this).addClass(me.request_cls);
                toUrl('tiger.html');
            });
            $('#btn-record').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('active')) {
                    return;
                }
                $('.tab-box a').removeClass('active');
                $(this).addClass('active');
                me.rankOpen = false;
                $('.content-record').removeClass('none');
                $('.content-rank').addClass('none');
            });
            $('#btn-rank').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('active')) {
                    return;
                }
                $('.tab-box a').removeClass('active');
                $(this).addClass('active');
                me.rankOpen = true;
                $('.content-record').addClass('none');
                $('.content-rank').removeClass('none');
            });
        },
        scrollEvent: function() {
            var me = this, range = 10, maxpage = 100, totalheight = 0, fixedStep = 100;
            $(window).scroll(function(){
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos) - fixedStep;
                if (me.rankOpen && ($(document).height() - range - fixedStep) <= totalheight && me.page < maxpage && me.loadmore) {
                    if ($('#spinner').length > 0) {
                        return;
                    };
                    //me.getRank(me.page);
                }
            });
        },
        showDetail: function (self) {
            H.dialog.detail.open();
            H.record.fillRecord(H.record.recData,self.id);
        },
        getRecord: function() {
            getResult('api/lottery/record', {oi: openid}, 'callbackLotteryRecordHandler', true);
        },
        getUserinfo: function () {
            getResult('api/user/info_v2', {matk: matk}, 'callbackUserInfoHandler', true);
        },
        getMygold: function () {
            getResult('api/lottery/integral/rank/self', {
                oi: openid
                //pu: H.record.uid
            }, 'callbackIntegralRankSelfRoundHandler', true, this.$dialog);
        },
        getRank: function () {
            getResult('api/lottery/integral/rank/top10', {
                //pu:H.record.uid
            }, 'callbackIntegralRankTop10RoundHandler', true, this.$dialog);
        },
        resize: function () {
            $(".info-data").css("opacity","1").find("div").css("line-height",($(window).height()*0.06)+"px").find("a").css("line-height",($(window).height()*0.045)+"px");
        },
        userInfo: function (data) {
            if(data.hi){
                $(".avatar").attr("src",data.hi);
            }else{
                $(".avatar").attr("src","./images/avatar.png");
            }
            if(data.nn){
                $(".nickname").text(data.nn);
            }else{
                $(".nickname").text("匿名");
            }
        },
        fillRecord: function(data,pt) {
            var t = simpleTpl(), items = data.rl || [], len = items.length, isPick = false, img = "./images/lit-card-bg.png";
            for (var i = 0; i < len; i ++) {
                if(items[i].pt == pt || (pt == 7 && items[i].pt == 6)){
                    if(isPick == false){
                        if(pt == 1){img = "./images/lit-shiwu-bg.png";}else if(pt == 4){img = "./images/lit-red-bg.png";}
                        isPick = true;
                    }
                    t._('<li>')
                        ._('<div class="gift-icon"></div>')
                        ._('<div class="gift-info">')
                    if (items[i].cc) {
                        if (items[i].cc.split(',')[0]) {
                            t._('<div class="gift-numb">' + items[i].cc.split(',')[0] + '<div class="gift-time">' + items[i].lt.split(" ")[0] + '</div></div>')
                        }
                    }else{
                        t._('<div class="gift-time">获奖时间：' + items[i].lt.split(" ")[0] + '</div>')
                    }
                        t._('<p class="gift-name">奖品名称：' + items[i].pn + '</p>')
                            ._('</div>')
                            ._('</div>')
                            ._('<img src="./images/line.jpg" />')
                    ._('</li>')
                }
            }
            $('.content-record ul').append(t.toString());
            $(".content-record ul li .gift-icon").css({"background": "url(" + img + ") no-repeat","background-size":"100% 100%"});
        }
    };
    H.lottery = {
        dec: 0,
        sau: 0,
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
        isHolding:false,
        repeat_load: true,
        recordFirstload: true,
        sponsorDetailFlag: false,
        lotteryImgList: [],
        lotteryTime: getRandomArbitrary(1,3),
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        init: function() {
            //this.event();
            //this.getUserinfo_port();
            //this.getSau_port();
            this.lotteryRound_port();
            //this.shake();
        },
        event: function() {
            var me = this;
            $.ajax({
                type:"GET",
                url:domain_url+"api/common/promotion"+dev,
                dataType:"jsonp",
                jsonp: "callback",
                jsonpCallback:"commonApiPromotionHandler",
                data:{
                    oi: openid
                },
                success: function (data) {
                    if(data.code == 0){
                        var jumpUrl = data.url;
                        $(".linkout").removeClass("none").css({"-webkit-animation":"picshake 3s infinite","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("click", function () {
                            shownewLoading();
                            setTimeout(function () {
                                window.location.href = jumpUrl;
                            },2000);
                        });
                    }else{
                        $(".linkout").addClass("none");
                    }
                },
                error: function () {
                    //alert("请求数据失败，请刷新页面");
                }
            });
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
            //setTimeout(function(){ me.red_record(); }, recordDelay);
            //setInterval(function(){ me.red_record(); }, me.allRecordTime);
            setTimeout(function(){ me.account_num(); }, pvDelay);
            // getnum
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
            $('.countdown').removeClass('none').css("opacity","1").off();
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            if(me.isHolding){
                H.dialog.tip.open();
            }
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html("距摇奖结束还有");
            me.count_down();
            $('.countdown').removeClass('none').css("opacity","0").on("click", function () {
                toUrl("lottery.html");
            });
            me.index++;
            me.canJump = true;
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
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
        change: function() {
            this.isCanShake = false;
            $(".countdown").removeClass('none').find(".countdown-tip").html('本期摇奖已结束，下期再战！').off();
            $('.detail-countdown').html("");
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


    W.callbackLotteryRecordHandler = function(data) {
        if (data.result) {
            $(".info-data a").on("click", function (e) {
                var me = this;
                e.preventDefault();
                H.record.showDetail(me);
            });
            H.record.recData = data;
            var items = data.rl || [], len = items.length;
            for(var i = 0;i<len;i++){
                switch (items[i].pt){
                    case 1:
                        H.record.lotNum ++;
                        break;
                    case 4:
                        H.record.redNum ++;
                        break;
                    case 6:
                        H.record.cardNum ++;
                        break;
                    case 7:
                        H.record.cardNum ++;
                        break;
                    default :
                        break;
                }
            }
        }
        if(H.record.redNum == 0){$(".lt-red").find("a").off().on("click",function(){showTips("您还没有获得该奖品哦！快去摇奖吧~")});}else{$(".lt-red").find("a").html(H.record.redNum)}
        if(H.record.lotNum == 0){$(".lt-lot").find("a").off().on("click",function(){showTips("您还没有获得该奖品哦！快去摇奖吧~")});}else{$(".lt-lot").find("a").html(H.record.lotNum)}
        if(H.record.cardNum == 0){$(".lt-card").find("a").off().on("click",function(){showTips("您还没有获得该奖品哦！快去摇奖吧~")});}else{$(".lt-card").find("a").html(H.record.cardNum)}
    };
    W.callbackUserInfoHandler = function(data) {
        if (data.result) {
            H.record.tk = data.tk;
            H.record.userInfo(data);
        } else {
            H.record.userInfo(data);
        }
        $("header").css("opacity","1");
    };
    W.callbackLinesDiyInfoHandler = function(data) {
        if (data.code == 0) {
            H.record.uid = data.tid;
            H.record.getRecord();
            H.record.getRank(0);
            //H.record.getUserinfo();
            H.record.getMygold();
        } else {

        }
    };
    W.callbackIntegralRankSelfRoundHandler = function(data) {
        if (data.result == true) {
            $(".rk-s").find("p").html(data.in);
            if(data.rk){
                $(".rk-r").find("p").html(data.rk);
            }else{
                $(".rk-r").find("p").html("");
            }
            getResult('api/lottery/integral/total/day', {oi: openid}, 'callbackIntegralDayTotalHandler', true);
        } else {

        }
    };
    W.callbackIntegralDayTotalHandler = function(data) {
        if (data.result == true && data.dt) {
            $(".rk-g").find("p").html(data.dt);
        } else {
            $(".rk-g").find("p").html("0");
        }
    };
    W.callbackLotteryAllRecordHandler = function(data) {
        if (data.result) {
            if (data.rl.length < H.record.pageSize) {
                H.record.loadmore = false;
            } else if (data.rl.length == H.record.pageSize) {
                if(H.record.page == 1){
                    H.record.beforePage = 1;
                    H.record.page = 2;
                }else{
                    H.record.beforePage = H.record.page;
                    H.record.page++;
                }
                H.record.loadmore = true;
            }
            //H.record.fillRank(data);
            H.record.fillRecord(data);
        } else {
            if (H.record.page == 1) {
                //$(".content-rank").empty().append('<p class="empty">加油赢金币<br>金币榜就会有您的大名哦~</p>');
                H.record.fillRank(0);
            }
            H.record.loadmore = false;
        }
    };
})(Zepto);

$(function(){
    H.record.init();
    H.lottery.init();
});