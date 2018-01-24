(function($){
    H.index = {
        myVedio:document.getElementById("video"),
        $video: $("#video"),
        $index: $("#index"),
        url: null,
        init: function(){
            this.event();
            this.resize();
            this.articleInfo();
            this.promotion();
        },
        //获取当前剧集列表信息
        promotion :function(){
        	getResult('api/common/promotion', {oi:openid}, 'commonApiPromotionHandler',false);
        },
        articleInfo: function(){
            getResult('api/article/list',{},'callbackArticledetailListHandler');
        },
        init_qqvideo: function(){
            var me = this,
                winW = $(window).width(),
                winH = $(window).height();

            var videoWidth = winW*0.87;
            var videoHeight = videoWidth/(600/357);
            var w = videoWidth*0.96;
            var videoHtml = '<iframe frameborder="0" style="width:'+w+'px;height:'+videoHeight+'px;" width="'+videoWidth+'" height="'+videoHeight+'"  src="'+me.url+'" allowfullscreen></iframe>';
            me.$video.html(videoHtml).css({
                "width": videoWidth,
                "height": videoHeight
            });

        },
        event: function(){
            var me = this;
            $("#btn-huopu").tap(function(e){
                e.preventDefault();
                toUrl("shop.html");
            });
            /*$(me.myVedio).one('loadeddata', function() {
                shownewLoading();
                // 暂停，但下载还在继续
                me.myVedio.pause();

                // 启动定时器检测视频下载进度
                var timer = setInterval(function() {
                    var end = me.getEnd(me.myVedio),
                        duration = me.myVedio.duration;
                    //alert(end +'=='+duration);
                    if(end < duration) {
                        return
                    }
                    hidenewLoading();
                    var width = $(me.myVedio).parent().width();

                    // 下载完了，开始播放吧
                    $(me.myVedio).attr("width",width);
                    me.myVedio.play();
                    console.log("下载完了，开始播放吧");
                    clearInterval(timer);
                }, 1000);
            });

            $('body').delegate('#video,.play', 'click', function(e) {
                e.preventDefault();
                if (me.myVedio.paused){
                    me.myVedio.play();

                }else{
                    me.myVedio.pause();
                    $(".play").animate({opacity:1},500);
                }
            });

            $(".play").animate({opacity:0},500);
            me.videoEvent("ended");*/
        },
        // 获取视频已经下载的时长
        getEnd:function(video) {
            var end = 0;
            try {
                end = video.buffered.end(0) || 0;
                end = parseInt(end * 1000 + 1) / 1000
            } catch(e) {
            }
            return end
        },
        videoEvent:function(e){
            var me = this;
            me.myVedio.addEventListener(e,function(){
                if(e == "ended"){
                    $(".play").animate({opacity:1},500);
                }
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        resize: function(){
            var me = this, winW = $(window).width(),
                winH = $(window).height() - 45;
            me.$index.css({
                "width": winW,
                "height": winH
            });

        }
    };
    W.commonApiPromotionHandler = function(data){
    	if(data.code == 0){
			var jumpUrl = data.url;
			$(".ddtj").addClass("yaoyiyao").removeClass("none");
			$(".ddtj").click(function(e){
				e.preventDefault();
				shownewLoading();
				window.location.href = jumpUrl;
			})
		}else{
			$(".ddtj").addClass("none");
		}
    }
    //获取当前剧集列表信息
    W.callbackArticledetailListHandler = function(data){
        var me = H.index;
        if(data.code == 0){
            me.url = data.arts[0].gu;
            $("#detail").text(data.arts[0].t);
            me.init_qqvideo();
            setTimeout(function() {
                H.talk.dmResize();
            },1000);
        }
    };
})(Zepto);

;(function($) {
    H.talk = {
        uid: null,
        input: $("#input_text"),
        maxid: 0,
        pageSize: 10,
        meArray: new Array(),
        isBottom:false,
        isFirst:true,
        init: function() {
            var me = this;
            me.event();
            me.question();
            me.canBottom();
            $('.avatar-img').attr('src',headimgurl ? (headimgurl + '/' + yao_avatar_size) : './images/avatar.png');
        },
        dmResize: function(){
            var me = this, winW = $(window).width(),
                winH = $(window).height(),
                videoHeight = 0,
                syHeight = 0;

            videoHeight =  winW*0.9/(580/329);
            $(".index .video-div .video").css({
                "height": videoHeight
            });
            syHeight = winH - (videoHeight + 210) ;

            $(".page-con").css({
                "height": Math.round(syHeight)
            });
            me.msgDom();
        },
        event: function(){
            var me = this;
            $("#input_submit").click(function(){
                if($.trim(H.talk.input.val()).length == 0){
                    showTips("什么都没有说呢");
                    return false;
                } else if ($.trim(H.talk.input.val()).length < 3){
                    showTips("多说一点吧！至少3个字哦");
                    return false;
                } else if ($.trim(H.talk.input.val()).length > 100){
                    showTips("评论字数不能超过100个字哦");
                    return false;
                };
                if (H.talk.uid != '') {
                    getResult('api/comments/save',{
                        'co' : encodeURIComponent(H.talk.input.val()),
                        'op' : openid,
                        'nickname': nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "匿名用户",
                        'headimgurl': headimgurl ? headimgurl : "",
                        'tid': H.talk.uid,
                        'ty': 1
                    }, 'callbackCommentsSave', true, null);
                };
            });
        },
        question:function(){
            getResult("api/comments/topic/round",{},"callbackCommentsTopicInfo",true);
        },
        fillAfterSubmit: function(){
            var me = this;
            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : "images/avatar.png";
            var comments = "";
            comments += '<li>'
            + '<label class="fl"><img src="' + h +'"></label>'
            + '<div class="ron">'
            /*+ '<p class="tar">我</p>'*/
            + '<span class="triangle"></span>'
            + '<div class="article fl">'+me.input.val()+'</div>'
            + '</div>'
            + '</li>';
            $('#comment_list li:nth-child(5)').after(comments);
        },
        room: function(){
            var me = H.talk;
            setInterval(function(){
                getResult('api/comments/room', {
                    'anys' : me.uid,
                    'maxid' : me.maxid,
                    'ps' : me.pageSize
                }, 'callbackCommentsRoom');
            },5000);
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
            $('#body').scroll(function(){
                nScrollHight = $(this)[0].scrollHeight;
                nScrollTop = $(this)[0].scrollTop;
                if(nScrollTop + nDivHight >= nScrollHight-3){
                    H.talk.isBottom = true;
                }else{
                    H.talk.isBottom = false;
                }
            });
            $('#body').on('touchmove',function(e){
                if($('#comment_list').height()> nDivHight){
                    e.stopPropagation();
                }
            });
        },
        msgDom: function(){
        var msg =
            [
            '<li><label class="fl"><img src="images/head/0q.jpg"></label><div class="ron"><span class="triangle"></span><div class="article fl">原来是方木啊hahaha~</div></div></li>',
            '<li><label class="fl"><img src="images/head/1q.jpg"></label><div class="ron"><span class="triangle"></span><div class="article fl">羽皇一言不合就强吻。</div></div></li>',
            '<li><label class="fl"><img src="images/head/2q.jpg"></label><div class="ron"><span class="triangle"></span><div class="article fl">看了第一集已经开始站双若cp。</div></div></li>',
            '<li><label class="fl"><img src="images/head/3q.jpg"></label><div class="ron"><span class="triangle"></span><div class="article fl">画风突变巴拉拉小魔仙好伐？</div></div></li>',
            '<li><label class="fl"><img src="images/head/4q.jpg"></label><div class="ron"><span class="triangle"></span><div class="article fl">张若昀美翻了啊。</div></div></li>',
            '<li><label class="fl"><img src="images/head/5q.jpg"></label><div class="ron"><span class="triangle"></span><div class="article fl">等着雪飞霜现身</div></div></li>',
            '<li><label class="fl"><img src="images/head/6q.jpg"></label><div class="ron"><span class="triangle"></span><div class="article fl">张若昀的翅膀什么时候长出来？？？</div></div></li>',
            '<li><label class="fl"><img src="images/head/7q.jpg"></label><div class="ron"><span class="triangle"></span><div class="article fl">摔了还是这么拽</div></div></li>',
            '<li><label class="fl"><img src="images/head/8q.jpg"></label><div class="ron"><span class="triangle"></span><div class="article fl">美出了新高度。还有谁？</div></div></li>',
            '<li><label class="fl"><img src="images/head/9q.jpg"></label><div class="ron"><span class="triangle"></span><div class="article fl">片尾曲最后就像打歌一样</div></div></li>'
            ];

            var t = '',me = H.talk;
            $.each(msg, function(i, items){
                t += items;
            });
            $('#comment_list').append(t);
            $(".page-con").removeClass("none");
            $(".box").textSlider({
                speed: 40, //数值越大，速度越慢
                line: 4   //触摸翻滚的条数
            });
        }
    };

    W.callbackCommentsTopicInfo = function(data){
        var me = H.talk;
        if(data.code == 0){
            var item = data.items[0];
            me.uid = item.uid;
            $("#title-img").attr("src",item.av);
            $("#title-per").html(item.p);
            $("#title-que").html(item.t);
            me.room();
        }
    };

    W.callbackCommentsSave = function(data) {
        var me = H.talk;
        if(data.code == 0){
            me.fillAfterSubmit();
            me.input.blur().val('');
            me.meArray.push(data.uid);
        }else{
            showTips(data.message);
        }
    };
    W.callbackCommentsRoom = function(data){
        var me = H.talk;
        if(data.code == 0){
            var items = data.items;
            if(items.length > 0){
                me.maxid = data.maxid;
                var t = simpleTpl();
                for(var i = items.length-1;i >= 0;i--){
                    if(me.isin(items[i].uid)){
                        continue;
                    }
                    var h= items[i].hu ? items[i].hu + '/' + yao_avatar_size : "images/avatar.png";
                    var n = items[i].na ? items[i].na:'匿名用户';
                    if(items[i].op == hex_md5(openid)){
                        t._('<li>')
                            ._('<label class="fl"><img src="'+h+'"></label>')
                            ._('<div class="ron">')
                            /*._('<p class="tar">我</p>')*/
                            ._('<span class="triangle"></span>')
                            ._('<div class="article fl">'+filterXSS(items[i].co)+'</div>')
                            ._('</div>')
                            ._("</li>");
                    }else{
                        t._('<li>')
                            ._('<label class="fl"><img src="'+h+'"></label>')
                            ._('<div class="ron">')
                            /*._('<p>'+n+'</p>')*/
                            ._('<span class="triangle"></span>')
                            ._('<div class="article fl">'+filterXSS(items[i].co)+'</div>')
                            ._('</div>')
                            ._("</li>");
                    }
                }
                $('#comment_list').append(t.toString());

                if(me.isFirst){
                    me.isFirst = false;
                    return;
                }

                if(!me.isBottom){
                    if(!me.isFirst){
                    }else{
                        me.isFirst = false;
                    }
                }
            }
        }
    };


})(Zepto);
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
        $progressBarAnswerPage:$('#progress-bar'),
        $giftAnswerPage:$('#gift'),
        $lotteryCountdownAnswerPage:$('#lottery-answerPage'),
        luckData: null,
        init: function() {
            this.loadImg();
            this.lotteryRound_port();
            $('#gift').tap(function(e){
                if($(this).hasClass("yao")){
                    toUrl("yao.html");
                }
            });
        },
        loadImg: function(){
            var imgs = [
                "images/comment-bg.jpg",
                "images/comment-btn-fs.png",
                "images/comment-btn-hp.png",
                "images/comment-btn-ht.png",
                "images/comment-input-bg.jpg",
                "images/comment-plt-bg.png",
                "images/comment-tlt.png",
                "images/comment-vedio-bg.png",
                "images/comment-vedio-bottom.png",
                "images/comment-gift.png",
                "images/comment-grey-gift.png",
                "images/comment-press.png"
            ];
            loadImg = function () {
                for (var i = 0; i < imgs.length; i++) {//图片预加载
                    var img = new Image();
                    img.style = "display:none";
                    img.src = imgs[i];
                    img.onload = function () {
                        $("body").animate({'opacity':'1'}, 100);
                    }
                }

            };
            loadImg();
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

                        /*测试-s*/
                        /*data = testLotteryData;
                         me.nowTime = timeTransform(data.sctm);
                         console.log(me.nowTime);
                         var nowTimeStemp = new Date().getTime();
                         me.dec = nowTimeStemp - data.sctm;
                         me.roundData = data;
                         me.currentPrizeAct(data);*/
                        /*测试-e*/
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
        progressChange: function(beginTimeLong, word){
                var me = H.lottery, intervalFlag  = 0;

                clearInterval(intervalFlag);
                me.$progressBarAnswerPage.removeClass("wan init");
                me.$lotteryCountdownAnswerPage.attr('etime',beginTimeLong).empty();
                if(word == "距离摇奖开始还有:"){
                    me.$lotteryCountdownAnswerPage.removeClass("none");
                    me.$giftAnswerPage.attr("src", "images/comment-grey-gift.png").removeClass("yao");

                    me.$progressBarAnswerPage.addClass("init");
                    var sum = 0,flag = true,topHeight = 0,energyHeight = 165;
                    intervalFlag = setInterval(function(){
                        if(_ss && flag){
                            sum = _ss;
                            flag = false;
                        }
                        if(W.screen.height == 500){
                            energyHeight = 105;
                        }else if(W.screen.height == 568){
                            energyHeight = 135;
                        }
                        topHeight = energyHeight-energyHeight*(_ss/sum);
                        if(topHeight < 17){
                            topHeight = 17;
                        }
                        me.$progressBarAnswerPage.animate(
                            {"height": topHeight + "px"},
                            500);
                    },1000);
                }else if(word == "距离摇奖结束还有:"){
                    me.$lotteryCountdownAnswerPage.addClass("none");
                    me.$giftAnswerPage.attr("src", "images/comment-gift.png").addClass("yao");
                    me.$progressBarAnswerPage.addClass("wan");
                    if(getQueryString('markJump') == "yaoClick"){
                        return;
                    }
                    toUrl("yao.html");
                }else{
                    me.$lotteryCountdownAnswerPage.removeClass("none");
                    me.$giftAnswerPage.attr("src", "images/comment-grey-gift.png").removeClass("yao");
                    me.$progressBarAnswerPage.css("height","10%!important");
                }
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {console.log("摇奖开启倒计时");
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;

            me.progressChange(beginTimeLong, '距离摇奖开始还有:');

            me.count_down();
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){console.log("摇奖结束倒计时");
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;

            me.progressChange(beginTimeLong, '距离摇奖结束还有:');

            me.count_down();
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
            me.count_down();
            hidenewLoading();
        },
        count_down: function() {
                var me = H.lottery,
                $this = me.$lotteryCountdownAnswerPage;
                $this.each(function() {//答题页摇奖倒计时
                    $(this).countDownAnswerProgress({
                        etpl : '%SS%'+'s' , // 还有...结束
                        stpl : '%SS%'+'s', // 还有...开始
                        sdtpl: '',
                        otpl: '',
                        otCallback: function() {
                            if(me.canJump){
                                if (me.crossLotteryCanCallback) {
                                    if(!me.isTimeOver){
                                        var delay = Math.ceil(1000*Math.random() + 500);
                                        me.isTimeOver = true;
                                        me.crossLotteryCanCallback = false;
                                        $this.html('请稍后');
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
                                            $this.html('请稍后');
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
                                                    $this.html('请稍后');
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
                                            $this.html('请稍后');
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
                                $this.html('请稍后');
                            }
                        },
                        sdCallback: function(){
                            me.isTimeOver = false;
                            /*if(me.type = 1){
                             meAnswer.$progressBarAnswerPage.animate(
                             {"height": 160/_ss + 'px'},
                             500);
                             }*/

                        },
                        stCallback : function(){}
                    });
                });

        },
        change: function() {
            var me = H.lottery;
            this.isCanShake = false;
            hidenewLoading();
            me.progressChange();
        }
    };
})(Zepto);

$(function(){
    H.index.init();
    H.talk.init();
    H.lottery.init();
});


var _ss = 0;//全局变量剩余秒数
$.fn.countDownAnswerProgress = function(options) {
    var defaultVal = {
        // 存放结束时间
        eAttr : 'etime',
        sAttr : 'stime', // 存放开始时间
        wTime : 100, // 以100毫秒为单位进行演算
        etpl : '%SS%', // 还有...结束
        stpl : '%SS%', // 还有...开始
        sdtpl : '已开始',
        otpl : '活动已结束', // 过期显示的文本模版
        stCallback: null,
        sdCallback: null,
        otCallback: null
    };
    var dateNum = function(num) {
        return num < 10 ? '0' + num : num;
    };
    var subNum = function(num){
        numF = num.toString().substring(0,1);
        numS = num.toString().substring(1,num.length);
        _ss = numF + numS;
        return num = numF + numS;
    };
    var s = $.extend(defaultVal, options);
    var vthis = $(this);
    var runTime = function() {
        var nowTime = new Date().getTime();
        vthis.each(function() {
            var nthis = $(this);
            var sorgT = parseInt(nthis.attr(s.sAttr));
            var eorgT = parseInt(nthis.attr(s.eAttr));
            var sT = isNaN(sorgT) ? 0 : sorgT - nowTime;
            var eT = isNaN(eorgT) ? 0 : eorgT - nowTime;
            var showTime = function(rT, showTpl) {
                var ss_ = Math.round(rT / s.wTime);
                ss_ = subNum(dateNum(Math.floor(ss_ *s.wTime/1000)));
                nthis.html(showTpl.replace(/%SS%/, ss_));
            };
            if (sT > 0) {
                showTime(sT, s.stpl);
                s.stCallback && s.stCallback();
            } else if (eT > 0) {
                showTime(eT, s.etpl);
                s.sdCallback && s.sdCallback();
            } else {
                nthis.html(s.otpl);
                s.otCallback && s.otCallback();
            }

        });
    };

    setInterval(function() {
        runTime();
    }, s.wTime);
};

var testLotteryData = {
    "result": true,
    "la": [
        {
            "ud": "aad71c59fd0d40689d48a6ae98268d66",
            "pd": "2016-01-15",
            "st": "10:30:10",
            "et": "10:30:15",
            "nst": "2016-01-15 10:30:25",
            "lc": 50,
            "bi": "",
            "ui": 0
        },
        {
            "ud": "d5020ac08c2f4773beb41d5ed1f83aee",
            "pd": "2016-01-15",
            "st": "10:30:25",
            "et": "10:30:35",
            "nst": "2016-01-15 10:30:35",
            "lc": 50,
            "bi": "",
            "ui": 0
        },
        {
            "ud": "aad71c59fd0d40689d48a6ae98268d66",
            "pd": "2016-01-15",
            "st": "10:30:35",
            "et": "10:30:45",
            "nst": "2016-01-15 10:30:45",
            "lc": 50,
            "bi": "",
            "ui": 0
        },
        {
            "ud": "d5020ac08c2f4773beb41d5ed1f83aee",
            "pd": "2016-01-15",
            "st": "10:30:45",
            "et": "10:30:55",
            "nst": "2016-01-15 10:50:00",
            "lc": 50,
            "bi": "",
            "ui": 0
        }
    ],
    "sctm": 1452825000000 //2016-01-15 10:30:00
};