(function($){
    H.food = {
        localData: null,
        init: function(){
            this.event();
            this.allhisperiod();
        },
        event: function(){
            var me = H.food,
                $splendid = $("#splendid"),
                $jc = $("#jc"),
                $btnClose = $("#btn-close");

            $jc.click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                $(this).addClass("none");
                $splendid.removeClass("none");
                setTimeout(function(){
                    me.splendidSwiper(me.localData);flag = false;
                },200);
            });
            $btnClose.click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                $jc.removeClass("none");
                $splendid.addClass("none");
                $(".gallery-top .swiper-wrapper").empty();
                $(".gallery-thumbs .swiper-wrapper").empty();
            });

            $("#food-swiper").delegate('.swiper-slide', 'click', function(e) {
                e.preventDefault();
                var current = true;

                if($(this).hasClass("disabled")){
                    return;
                }

                if($(this).hasClass("current")){
                    toUrl("index.html?sign="+ $(this).attr("id") + "&current="+current);
                }else{
                    toUrl("index.html?sign="+ $(this).attr("id"));
                }
            });

            $("#food-swiper").delegate('.swiper-slide', 'tap', function(e) {
                e.preventDefault();
                var current = true;

                if($(this).hasClass("stop-swiping")){
                    return;
                }
            });

        },
        //查询业务竞猜投票历史期接口
        allhisperiod: function(){
            getResult('api/voteguess/allhisperiod', {}, 'callbackVoteguessAllperiodHandler', true);
        },
        foodSwiperFillDom: function(data) {
            var me = this, t = simpleTpl(),
                items = JSON.parse(JSON.stringify(data.items)).reverse() || [],
                length = items.length,
                index = 1,
                isHasCurrentDate = false,//是否存在当期标识
                loopFlag = true;

            var currentDate = normalDate(new Date());
            currentDate = currentDate.split(" ")[0];

            for (var i = 0 ; i < length; i ++) {console.log(items[i].ptt);
                var listDate = items[i].pst.split(" ")[0];
                if(listDate == currentDate){
                    index = i-1;
                    isHasCurrentDate = true;
                }else{
                    index = length - 2;
                }

                var im = items[i].iul || "./images/food-default.jpg";
                t._('<section class="swiper-slide slide' + i + '" id=' + items[i].pid + ' data-date="'+ items[i].pst +'">')
                    ._('<section class="image-wrapper">')
                        ._('<div class="name"> ' + items[i].ptt + '</div>')
                        ._('<p></p><img class="swiper-lazy" src="'+im+'" data-src="' + im + '">')
                    ._('</section>')
                ._('</section>')
            }

            if(length == 1){
                loopFlag = false;
                $('#food-swiper .swiper-wrapper').html(t.toString()).append(
                    '<section class="swiper-slide disabled slide'+ length +' ">' +
                        '<section class="image-wrapper">' +
                            '<div class="name"></div><p></p><img class="swiper-lazy" src="">' +
                        '</section>' +
                    '</section>');

                $('.slide0').before(
                    '<section class="swiper-slide disabled slide'+ length +' ">' +
                        '<section class="image-wrapper">' +
                            '<div class="name"></div><p></p><img class="swiper-lazy" src="">' +
                        '</section>' +
                    '</section>');
                $(".swiper-button-white").addClass("swiper-button-disabled");
                $("#food-swiper .swiper-wrapper .swiper-slide").addClass("stop-swiping");
            }else{
                $('#food-swiper .swiper-wrapper').html(t.toString()).append(
                    '<section class="swiper-slide disabled slide'+ length +' ">' +
                        '<section class="image-wrapper">' +
                            '<div class="name">敬请期待</div><p></p><img class="swiper-lazy" src="./images/qdDdefault.jpg">' +
                        '</section>' +
                    '</section>');
            }

            if(isHasCurrentDate){
                $("#food-swiper .swiper-wrapper .swiper-slide").eq(length-1).addClass("current");
            }

            $('#food-swiper.swiper-control').animate({'opacity':'1'}, 500);console.log("index="+index);
            var swiper = new Swiper('#food-swiper .swiper-container', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                slidesPerView: 3,
                keyboardControl: true,
                spaceBetween: 2,
                speed: 600,
                effect: 'coverflow',
                coverflow: {
                    stretch: 0,
                    depth: 100,
                    modifier:1.3,
                    rotate: -30,
                    slideShadows : false
                },
                iOSEdgeSwipeDetection : true,
                preloadImages: false,
                lazyLoading: true,
                lazyLoadingInPrevNext : true,
                resistanceRatio : 0.6,
                touchRatio : 1,
                initialSlide :index,
                loop: loopFlag,
                noSwiping : true,
                noSwipingClass : 'stop-swiping',
                onInit: function(swiper){},
                /*onClick: function(swiper){
                    var $slide = $("#food-swiper .slide"+ swiper.clickedIndex),
                        current = true;
                    if($slide.hasClass("current")){
                        toUrl("index.html?sign="+ $slide.attr("id") + "&current="+current);
                    }else{
                        toUrl("index.html?sign="+ $slide.attr("id"));
                    }

                },*/
                onSlideChangeEnd: function(swiper) {}
            });
            /*me.swiperContainer = swiper;*/
        },
        init_qqvideo: function(data){
            var me = this,
                winW = $(window).width(),
                winH = $(window).height(),
                parentHeight = $("#center").height();

            var videoWidth = parseInt(winW*0.83);
            var videoHeight = parseInt(parentHeight*0.53);
            var w = videoWidth;
            //var videoHtml = '<iframe frameborder="0" style="width:'+w+'px;height:'+videoHeight+'px;" width="'+w+'" height="'+videoHeight+'"  src="http://v.qq.com/iframe/player.html?vid=m0137rrajuc&auto=0" allowfullscreen></iframe>';
            var videoHtml = '';

            var length = data.items.length;
            for (var i = 0 ; i < length; i ++) {
                var url = data.items[i].viul;

                videoHtml = '<iframe frameborder="0" style="width:'+w+'px;height:'+videoHeight+'px;" width="'+w+'" height="'+videoHeight+'"  src="'+ url +'" allowfullscreen></iframe>';
                $("#video"+ i).html(videoHtml);
            }
        },
        splendidSwiper: function(data){

            var me = this, t = simpleTpl(),m = simpleTpl(),
                items = JSON.parse(JSON.stringify(data.items)).reverse() || [],
                length = items.length,
                index = 1;

            var currentDate = normalDate(new Date());
            currentDate = currentDate.split(" ")[0];

            for (var i = 0 ; i < length; i ++) {
                var listDate = items[i].pst.split(" ")[0];
                if(listDate == currentDate){
                    index = i;
                }else{
                    index = length - 1;
                }

                t._('<section class="swiper-slide swiper-no-swiping slide' + i + '" id=' + items[i].pid + ' data-date="'+ items[i].pst +'">')
                    ._('<div class="video-div" data-collect="true" data-collect-flag="index-video" data-collect-desc="首页-视频点击">')
                        ._('<section class="video" id="video' + i + '"></section>')
                    ._('</div>')
                ._('</section>');

                m._('<div class="swiper-slide slide' + i + '" style="background-image:url('+ items[i].vtul +')" data-date="'+ items[i].pst +'"></div>');
            }
            $('.gallery-top .swiper-wrapper').html(t.toString());

            $('.gallery-thumbs .swiper-wrapper').html(m.toString());
            me.init_qqvideo(data);

            var galleryTop = new Swiper('.gallery-top', {
                spaceBetween: 30,
                slidesPerView: 1,
                iOSEdgeSwipeDetection : true,
                preloadImages: false,
                lazyLoading: true,
                lazyLoadingInPrevNext : true,
                resistanceRatio : 0.5,
                touchRatio : 1,
                paginationClickable: true,
                centeredSlides: true,
                initialSlide :index,
                onClick: function(swiper){}
            });


            var galleryThumbs = new Swiper('.gallery-thumbs', {
                spaceBetween: 10,
                slidesPerView: 3,
                centeredSlides: true,
                slideToClickedSlide: true,
                iOSEdgeSwipeDetection : true,
                preloadImages: false,
                lazyLoading: true,
                lazyLoadingInPrevNext : true,
                resistanceRatio : 0.5,
                touchRatio : 1,
                initialSlide :index,
                onClick: function(swiper){}
            });
            galleryTop.params.control = galleryThumbs;
            galleryThumbs.params.control = galleryTop;
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        }
    };
    W.callbackVoteguessAllperiodHandler = function(data){
        var me = H.food;
        if(data.code == 0){
            me.localData = data;
            me.foodSwiperFillDom(data);
        }
    };
})(Zepto);

;(function($) {
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
                if($(this).find(".countdown-tip").html() == "距离摇奖结束还有"){
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
            me.$lotteryCountdown.find(".countdown-tip").html('距离摇奖开始还有');
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
            me.$lotteryCountdown.find(".countdown-tip").html("距离摇奖结束还有");
            me.count_down();
            me.$lotteryCountdown.removeClass('none');
            me.index++;
            me.canJump = true;
            hidenewLoading();
           /* if(getQueryString('markJump') == "yaoClick"){
                return;
            }
            toUrl("lottery.html");*/
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
            me.$lotteryCountdown.find(".countdown-tip").html('距离摇奖开始还有');
            me.count_down();
            me.$lotteryCountdown.removeClass('none');
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            me.$lotteryCountdown.find('.detail-countdown').each(function() {
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
})(Zepto);

$(function(){
    H.food.init();
    H.lottery.init();
});

