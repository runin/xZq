(function($) {
	H.talk = {
        uid: null,
        input: $("#input_text"),
        maxid: 0,
        pageSize: 10,
        meArray: new Array(),
        isBottom:false,
        $tip:$("#mesg-tip"),
        isFirst:true,
        isask:false,
        request_cls: 'requesting',
        isinit:false,
        isret:false,
        isLeft:false,
        lastXPos:0,
        lastYPos:0,
        notMove:true,
        cx:330,
        cy:330,
		init: function() {
            var me = this;
            //getResult('api/article/list', {}, 'callbackArticledetailListHandler');
            getResult('api/linesdiy/info', {oi: openid}, 'callbackLinesDiyInfoHandler');
            me.event();
            me.toucha($("#talk-dialog-open"));
            me.question();
            me.canBottom();
            H.utils.resize();
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
            $(".btn-tg").on("click", function () {
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                $(this).addClass(me.request_cls);
                toUrl("tiger.html");
            });
            $(".AD").on("click", function () {
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                $(this).addClass(me.request_cls);
                setTimeout(function () {
                    window.location.href = 'https://shop13635631.koudaitong.com/v2/showcase/homepage?kdt_id=13443463&redirect_count=1';
                },500);
            });
            $("#talk-dialog-open").animate({"-webkit-transform":'translate(0,260px)'},300,'ease-out',function () {
                me.isret = false;
                me.lastYPos = 260;
                me.notMove = true;
            });
            $("#talk-dialog-cls").on("click", function () {
                $(".footer").css({"-webkit-animation":"drop 1s"}).one("webkitAnimationEnd", function () {
                    $(this).css({"-webkit-animation":""});
                    $(".talk-dialog").addClass('none');
                });
                $(".talk-dialog").animate({'opacity':'0'}, 800);
            });
            $("#input_submit").on("touchstart", function () {
                $("up").css("opacity","0");
            }).on("click",function(){
                $("up").css("opacity","0");
                if($.trim(H.talk.input.val()).length == 0){
                    showTips("什么都没有说呢");
                    return false;
                } else if ($.trim(H.talk.input.val()).length < 3){
                    showTips("多说一点吧！至少3个字哦");
                    return false;
                } else if ($.trim(H.talk.input.val()).length > 100){
                    showTips("评论字数不能超过100个字哦");
                    return false;
                }
                if (H.talk.uid != '') {
                    getResult('api/comments/save',{
                        'co' : encodeURIComponent(H.talk.input.val()),
                        'op' : openid,
                        'nickname': nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "匿名用户",
                        'headimgurl': headimgurl ? headimgurl : "",
                        'tid': H.talk.uid,
                        'ty': 1
                    }, 'callbackCommentsSave', true, null);
                }
            });
            me.$tip.click(function(){
                $('#body').scrollToTop($('#comment_list').height());
            });
        },
        toucha: function (obj) {
            var me = this;
            obj.on("touchstart", function (ts) {
                if (ts.targetTouches.length == 1) {
                    ts.preventDefault();
                    var touch = ts.targetTouches[0];
                }
                var constx = touch.pageX;
                var consty = touch.pageY;
                obj.on("touchmove", function (e) {
                    e.preventDefault();
                    e = e.changedTouches[0];
                    if(!me.isret){
                        if(((e.pageX - constx) < 10 && (e.pageX - constx) > -10 ) && ((e.pageY - consty) < 10 && (e.pageY - consty) > -10 )){me.notMove = true;}else{me.notMove = false;}
                        me.cx = e.pageX;
                        me.cy = e.pageY;
                        if(me.isLeft){
                            $(this).css({"-webkit-transform":'translate(' + (me.cx-constx-($(window).width() * .9 - 60)) + 'px,' + (me.cy-consty + me.lastYPos) + 'px)'});
                        }else{
                            $(this).css({"-webkit-transform":'translate(' + (me.cx-constx) + 'px,' + (me.cy-consty + me.lastYPos) + 'px)'});
                        }
                    }
                }).one("touchend", function () {
                    me.isret = true;
                    var endXPos = null,endYPos = null;
                    if((me.cx-constx < -($(window).width() * .3)) || (me.cx-constx+me.lastXPos) <-($(window).width() *.4)){
                        endXPos = -($(window).width() * .9 - 60);
                        me.isLeft = true;
                    }else {
                        endXPos = 0;
                        if(!me.notMove){
                            me.isLeft = false;
                        }
                    }
                    if((me.cy- 35) < ($(window).height() * .1)){
                        endYPos = ($(window).height() * .1);
                    }else if((me.cy) > ($(window).height() * .9 - 60)){
                        endYPos = ($(window).height() * .9 - 60);
                    }else {
                        endYPos = me.cy - 35;
                    }
                    if(me.notMove == true){
                        $(".talk-dialog").removeClass('none').animate({'opacity':'1'}, 900);
                        $(".footer").css({"-webkit-animation":"ubuntushow 1s"}).one("webkitAnimationEnd", function () {
                            $(this).css({"-webkit-animation":""});
                            $(".talk-dialog").removeClass('none');
                            me.isret = false;
                            $("#talk-dialog-open").off();
                            me.toucha(obj);
                            me.notMove = true;
                        });
                    }else{
                        $("#talk-dialog-open").animate({"-webkit-transform":'translate(' + endXPos + 'px,' + endYPos + 'px)'},300,'ease-out',function () {
                            me.isret = false;
                            $("#talk-dialog-open").off();
                            me.toucha(obj);
                            me.notMove = true;
                        });
                        me.lastXPos = endXPos;
                        me.lastYPos = endYPos;
                    }
                })
            });
        },
        question:function(){
            //getResult('api/user/info_v2',{
            //    'matk' : matk
            //}, 'callbackUserInfoHandler', true, null);
            H.talk.room();
            setInterval(function(){
                H.talk.room();
            },10000);
        },
        fillAfterSubmit: function(){
            var me = this;
            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : "images/head.jpg";
            var comments = "";
            comments += '<li>'
                + '<img class="fr" src="' + h +'">'
                + '<div class="ron">'
                + '<p class="tar">我</p>'
                + '<span class="triangle-right"></span>'
                + '<span class="triangle-right2"></span>'
                + '<div class="article-right fr">'+me.input.val()+'</div>'
                + '</div>'
                + '</li>';
            $('#comment_list').append(comments);
            $('#body').scrollToTop(9999999);
        },
        room: function(){
            getResult('api/comments/room', {
                //'anys' : H.talk.uid,
                'maxid' : H.talk.maxid,
                'ps' : H.talk.pageSize
            }, 'callbackCommentsRoom');
        },
        isin: function(uid){
            for(var i = 0;i < H.talk.meArray.length;i++){
                if(H.talk.meArray[i] == uid){
                    return true;
                }
            }
            return false;
        },
        canBottom: function() {
            var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
            var nScrollTop = 0;   //滚动到的当前位置
            var nDivHight = $("#body").height();
            //console.log(nDivHight);
            $('#body').scroll(function(){
                var nDivHight = $("#body").height();
                nScrollHight = $(this)[0].scrollHeight;
                nScrollTop = $(this)[0].scrollTop;
                if(nScrollTop + nDivHight >= nScrollHight-3){
                    H.talk.isBottom = true;
                    H.talk.$tip.animate({
                            opacity: 0
                        }, 500,
                        'ease-out');
                }else{
                    H.talk.isBottom = false;
                }
                //else if(){
                //
                //}
            });
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
        if(data == undefined){

        }else{
            if(data.code == 0){
                hidenewLoading();
                var gt = data.gitems;
                for(var i = 0;(i<gt.length);i++){
                    $(".swiper-wrapper").append('<img class="swiper-slide" src="' + gt[i].ib + '" />');
                }
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    autoplay : 5000,
                    loop : true,
                    //direction : 'vertical',
                    paginationBulletRender: function (index, className) {
                        var pname = '';
                        return '<span class="' + className + '">' + pname + '</span>';
                    }
                });
            }else{

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
                if(H.talk.isask == false){
                    getResult('api/article/list', {}, 'callbackArticledetailListHandler');
                    H.talk.isask = true;
                }else{
                    hidenewLoading();
                    $(".round-bg").css({"background":"url(images/tv-info.png) no-repeat","background-size":"100% 100%","background-position":"0 0"});
                }
            }
        }
    };
    W.callbackUserInfoHandler = function(data){
        if(data.result == true){
            $(".handimg").attr("src",data.hi+ '/' + yao_avatar_size);
        }else if(data.result == false){
            $(".handimg").attr("src","images/head.jpg");
        }else{

        }
    };
    W.callbackCommentsSave = function(data) {
        if(data.code == 0){
            H.talk.fillAfterSubmit();
            H.talk.input.blur().val('');
            H.talk.meArray.push(data.uid);
            showTips('发送成功');
        }else{
            showTips(data.message);
        }
    };
    W.callbackCommentsRoom = function(data){
        if(data.code == 0){
            var items = data.items;
            if(items.length > 0){
                H.talk.maxid = data.maxid;
                var t = simpleTpl();
                for(var i = items.length-1;i >= 0;i--){
                    if(H.talk.isin(items[i].uid)){
                        continue;
                    }
                    var h= items[i].hu ? items[i].hu + '/' + yao_avatar_size : "images/head.jpg";
                    var n = items[i].na ? items[i].na:'匿名用户';
                    if(items[i].op == hex_md5(openid)){
                        t._('<li>')
                            ._('<img class="fr" src="'+h+'">')
                            ._('<div class="ron">')
                                ._('<p class="tar">我</p>')
                                ._('<span class="triangle-right"></span>')
                                ._('<span class="triangle-right2"></span>')
                                ._('<div class="article-right fr">'+items[i].co+'</div>')
                            ._('</div>')
                         ._("</li>");
                    }else{
                        t._('<li>')
                            ._('<img class="fl" src="'+h+'">')
                            ._('<div class="ron">')
                                ._('<p>'+n+'</p>')
                                ._('<span class="triangle"></span>')
                                ._('<div class="article fl">'+items[i].co+'</div>')
                            ._('</div>')
                        ._("</li>");
                    }
                }
                $('#comment_list').append(t.toString());

                if(H.talk.isFirst){
                    $('#body').scrollToTop($('#comment_list').height());
                    H.talk.isFirst = false;
                    return;
                }

                if(!H.talk.isBottom){
                    if(!H.talk.isFirst){
                        H.talk.$tip.animate({
                                opacity: 1
                            }, 500,
                            'ease-in');
                    }else{
                        H.talk.isFirst = false;
                    }
                }else{
                    $('#body').scrollToTop(999999);
                }
            }
        }
    };
    H.utils = {
        $body: $('#body'),
        //$input_text: $('#input_text'),
        resize: function() {
            var height = $(window).height();
            var width = $(window).width();
            this.$body.css('height', Math.round((height * 0.55) - 60));
            //this.$input_text.css({'width': (width * 0.92 - 85) + "px","top":(height*0.45)+"px"});
            $('body').css('height', height);
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
            //$.ajax({
            //    type:"GET",
            //    url:domain_url+"api/common/promotion"+dev,
            //    dataType:"jsonp",
            //    jsonp: "callback",
            //    jsonpCallback:"commonApiPromotionHandler",
            //    data:{
            //        oi: openid
            //    },
            //    success: function (data) {
            //        if(data.code == 0){
            //            var jumpUrl = data.url;
            //            $(".linkout").removeClass("none").css({"-webkit-animation":"picshake 3s infinite","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("click", function () {
            //                shownewLoading();
            //                setTimeout(function () {
            //                    window.location.href = jumpUrl;
            //                },2000);
            //            });
            //        }else{
            //            $(".linkout").addClass("none");
            //        }
            //    },
            //    error: function () {
            //        //alert("请求数据失败，请刷新页面");
            //    }
            //});
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
    //W.callbackLinesDiyInfoHandler = function(data){
    //    if(data.code == 0){
    //        H.lottery.sau = data.tid;
    //    }
    //};
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
})(Zepto);

$(function(){
	H.talk.init();
	H.lottery.init();
});