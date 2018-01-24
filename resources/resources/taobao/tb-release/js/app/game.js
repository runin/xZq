;(function($) {
    H.game = {
        beforeSelect: null,
        positionList: new Array(),
        resultList: new Array(),
        result: null,
        imgUrl: null,
        uid: null,
        init: function () {
            var me = this;
            me.initImg();
            me.event();
        },
        event: function () {
            $("#switch").click(function () {
                if($(this).hasClass("switch-on")){
                    H.utils.resize();
                    $(this).removeClass("switch-on").addClass("switch-off");
                }else{
                    H.comment.close();
                    $(this).removeClass("switch-off").addClass("switch-on");
                }
            });
        },
        initImg: function () {
            shownewLoading();
            getResult("api/puzzle/activity/round",{},"callbackPuzzleRoundHandler");
        },
        bindClick: function () {
            var me = this;
            $(".item").click(function(){
                if($(".pt").hasClass("moving")){
                    return;
                }
                if($(".pt").hasClass("end")){
                    showTips("你已经完成拼图");
                    return;
                }
                if($(this).hasClass("select")){
                    showTips("请选择要交换的图片");
                    return;
                }
                var num = $(this).attr("data-num");
                if(me.beforeSelect && Math.abs(me.beforeSelect - num) >= 3){
                    showTips("只能交换同行或同列的图片");
                    return;
                }
                if(me.beforeSelect && me.beforeSelect >= 0){
                    me.cellExchange(me.beforeSelect,num);
                }else{
                    $(this).addClass("select");
                    me.beforeSelect = num;
                }
            });
        },
        cellExchange:function(from,to){
            var me = this;
            var fromObj = $("[data-num='"+from+"']");
            var toObj = $("[data-num='"+to+"']");
            $(".pt").addClass("moving");
            //被拖动图片变换位置
            $(toObj).css({
                "z-index":20
            });
            $(toObj).animate({
                'top': me.positionList[from].top + 'px',
                'left': me.positionList[from].left + 'px'
            },function () {
                $(toObj).css({
                    "z-index":10
                });
                me.resultList[from] = $(toObj).attr("data-name");
                $(toObj).attr("data-num",from);
            });
            $(fromObj).animate({
                'top': me.positionList[to].top + 'px',
                'left': me.positionList[to].left + 'px'
            },function () {
                $(fromObj).removeClass("select");
                me.beforeSelect = null;
                me.resultList[to] = $(fromObj).attr("data-name");
                $(fromObj).attr("data-num",to);
                $(".pt").removeClass("moving");
                if(H.game.resultList.join(",") == H.game.result){
                    $(".pt").addClass("end");
                    localStorage.setItem("ptComplete",me.uid);
                    H.dialog.complete.open(me.imgUrl);
                }
            });
        },
        spellItem: function(la){
            var me = this;
            me.result = la.rp;
            var imgs = la.sp.split(",");
            imgs.sort(function(){return 0.5-Math.random();});
            var t = simpleTpl();
            var width = Math.ceil($(window).width() * 0.8 * 0.9 * 0.5);
            var img = new Image();
            img.src = imgs[0];
            img.onload = function(){
                var height = Math.ceil(img.height * (width/img.width));
                for (var j = 0; j < imgs.length; j ++){
                    var left = j%2 == 0 ? 10 : j%2 * width + 15;
                    var top = parseInt(j/2) == 0 ? 10 : parseInt(j/2) * height + 15;
                    me.positionList.push({left:left,top:top});
                    me.resultList[j] = imgs[j].substring(imgs[j].lastIndexOf("/")+1,imgs[j].length);
                    t._('<img class="item" src="'+imgs[j]+'" data-num="'+j+'" data-name="'+ me.resultList[j] +'" style="left: '+left+'px;top: '+top+'px;width:'+width+'px">');
                }
                if(me.resultList.join(",") == me.result){
                    me.spellItem(la);
                }
                $(".pt").append(t.toString());
                $(".pt").css({
                    height: height * 2 + 25 + "px"
                });
                H.game.bindClick();
                hidenewLoading();
            };
        },
        spellResult: function(la){
            var me = this;
            me.result = la.rp;
            var imgs = la.sp.split(",");
            var t = simpleTpl();
            var width = Math.ceil($(window).width() * 0.8 * 0.9 * 0.5);
            var img = new Image();
            img.src = imgs[0];
            img.onload = function(){
                var height = Math.ceil(img.height * (width/img.width));
                for (var j = 0; j < imgs.length; j ++){
                    var left = j%2 == 0 ? 10 : j%2 * width + 15;
                    var top = parseInt(j/2) == 0 ? 10 : parseInt(j/2) * height + 15;
                    me.positionList.push({left:left,top:top});
                    me.resultList[j] = imgs[j].substring(imgs[j].lastIndexOf("/")+1,imgs[j].length);
                    t._('<img class="item" src="'+imgs[j]+'" data-num="'+j+'" data-name="'+ me.resultList[j] +'" style="left: '+left+'px;top: '+top+'px;width:'+width+'px">');
                }
                $(".pt").append(t.toString());
                $(".pt").addClass("end");
                $(".pt").css({
                    height: height * 2 + 25 + "px"
                });
                H.game.bindClick();
                hidenewLoading();
            };
        }
    };

    W.callbackPuzzleRoundHandler = function(data){
        if(data.result){
            var la = data.la;
            if(la && la.length > 0){
                var nowTime = timeTransform(new Date().getTime());
                for (var i = 0; i < la.length; i ++){
                    if(comptime(nowTime,la[i].st) <0 && comptime(nowTime,la[i].et) >=0){
                        H.game.imgUrl = la[i].hp;
                        H.game.uid = la[i].ud;
                        if(la[i].ud == localStorage.getItem("ptComplete")){
                            H.game.spellResult(la[i]);
                        }else{
                            H.game.spellItem(la[i]);
                        }
                    }
                }
            }
        }
    };


    H.lottery = {
        dec: 0,
        type: 2,
        index: 0,
        endType: 1,
        pal: null,
        nowTime: null,
        pingFlag: null,
        roundData: null,
        nextPrizeAct: null,
        canJump: true,
        safeFlag: false,
        lastRound: false,
        isTimeOver: false,
        repeat_load: true,
        crossLotteryFlag: false,    //跨天摇奖倒计时标识  true为有跨天摇奖 false为没有跨天摇奖
        crossLotteryCanCallback: false,
        $lotteryCountdown: $("#lottery-countdown"),
        init: function() {
            this.event();
            this.lotteryRound_port();
        },
        event: function() {
            var me = this;
            me.$lotteryCountdown.click(function(e){
                e.preventDefault();
                if(me.type == 2){
                    toUrl('yao.html');
                }
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
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
            if (flag == 'on') {//抽奖轮次接口出错
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
                    return;
                }
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
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.$lotteryCountdown.find(".countdown-tip").html('距摇奖开始还有');
            me.count_down();
            me.$lotteryCountdown.removeClass('none');
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
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
            hidenewLoading();
            if(getQueryString('markJump') == "yaoClick"){
                return;
            }
            toUrl("yao.html");
        },
        // 跨天摇奖开启倒计时
        crossCountdown: function(nextTime) {
            var me = this;
            me.crossLotteryFlag = false;
            me.crossLotteryCanCallback = true;
            me.type = 1;
            var beginTimeLong = timestamp(nextTime);
            beginTimeLong += me.dec;
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.$lotteryCountdown.find(".countdown-tip").html('距摇奖开始还有');
            me.count_down();
            me.$lotteryCountdown.removeClass('none');
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            me.$lotteryCountdown.find('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '%M%' + ':' + '%S%', // 还有...结束
                    stpl: '%M%' + ':' + '%S%', // 还有...开始
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
        change: function() {
            var me = H.lottery;
            me.$lotteryCountdown.removeClass('none').find(".countdown-tip").html('本期摇奖已结束！');
            me.$lotteryCountdown.find('.detail-countdown').html("");
            hidenewLoading();
        }
    };


    // 弹幕_S
    H.comment = {
        timer: 5000,
        maxid: 0,
        pageSize: 10,
        $inputCmt: $('#input-comment'),
        $btnCmt: $('#btn-comment'),
        $comments: $('#comments'),
        REQUEST_CLS: 'requesting',
        interval: null,
        init: function() {
            var me = this;
            $("#comments").empty();
            W['barrage'] = this.$comments.barrage({
                fontSize: [14],
                fontColor: ["2f1300"]
            });
            setTimeout(function(){
                W['barrage'].start(1);
                me.interval = setInterval(function() {
                    me.flash();
                }, me.timer);
            }, 1000);
            me.event();
        },
        close: function () {
            var me = this;
            $(".comments-section").addClass("none");
            clearInterval(me.interval);
        },
        event: function(){
            var me = this;

            me.$btnCmt.click(function(e) {
                e.preventDefault();

                if ($(this).hasClass(me.REQUEST_CLS)) {
                    return;
                }
                var comment = $.trim(me.$inputCmt.val()) || '',
                    comment = comment.replace(/<[^>]+>/g, ''),
                    len = comment.length;

                if (len < 1) {
                    showTips('请先说点什么吧');
                    me.$inputCmt.focus();
                    return;
                } else if (len > 15) {
                    showTips('字数超出了20字');
                    me.$inputCmt.focus();
                    return;
                }

                $(this).addClass(me.REQUEST_CLS);

                shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'comments/save'+dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: me.tid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(shaketv_appid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        me.$btnCmt.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                            showTips('发射成功');
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
                            barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment">'+filterXSS(comment)+'</div></div>');
                            $('.isme').parent('div').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                        showTips("评论失败");
                    }
                });
            });
        },
        flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'comments/room'+dev,
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
                    if (data.code != 0) {
                        return;
                    }
                    me.maxid = data.maxid;
                    var items = data.items || [], umoReg = '/:';
                    for (var i = 0, len = items.length; i < len; i ++) {
                        if ((items[i].co).indexOf(umoReg) >= 0) {
                            var funny = items[i].co;
                            var nfunny = funny.replace('/:','');
                            barrage.appendMsg('<div class="c_head_img"><img class="c_head_img_img" src="' + (items[i].hu ? (items[i].hu + "/" + yao_avatar_size) : "./images/danmu-head.jpg") + '" /></div>'+'<div class="funnyshow"><img src="./images/funny/' + nfunny + '.png" border="0" /></div>');
                        } else {
                            barrage.pushMsg("<div class='c_head_img'><img class='c_head_img_img' src='" + (items[i].hu ? (items[i].hu + '/' + yao_avatar_size) : './images/danmu-head.jpg') + " '/></div><div class='comment'>"+filterXSS(items[i].co)+"</div>");
                        };
                    }
                }
            });
        }
    };
    // 弹幕_E

    H.utils = {
        $header: $('.countdown-section'),
        $wrapper: $('#article'),
        $comments: $('#comments'),
        $ctrls: $('#ctrls'),
        $btns: $('.btn-tab'),
        resize: function() {
            $(".comments-section").removeClass("none");
            var zwinH = $(window).height(),
                headerH = zwinH * 0.2,
                ctrlshH = this.$ctrls.height(),
                $btnsH = this.$btns.height(),
                barrageH = 0;
            barrageH = zwinH - headerH - ctrlshH - $btnsH;
            this.$comments.css({
                'height': Math.round(barrageH)
            });
            this.$wrapper.css({
                'height': Math.round(barrageH)
            }).removeClass("none");

            $('body').css('height', zwinH);
            H.comment.init();
        }
    };
})(Zepto);
$(function () {
    var hei = $(window).height();
    $("body").css("height",hei+"px");
   H.game.init();
    H.lottery.init();
});