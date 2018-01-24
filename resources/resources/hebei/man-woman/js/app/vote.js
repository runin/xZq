/**
 * 男过女人关-投票页
 */
(function($) {
    H.vote = {
        clickedIndex: 0,
        flag: true,
        guid: '',
        dec: 0,//服务器时间与本地时间的差值
        pal: [],// 抽奖活动list
        nowTime: null,
        isTimeOver: false,
        $music_label: $('.music-label'),
        $dm_section: $('.dm-section'),
        $input_comment: $('#input-comment'),
        $music: $('.music'),
        init: function(){
            this.event();
            this.getVoteinfo();
            H.dom.init();
            this.refreshDec();
        },
        refreshDec:function(){
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000*5*Math.random() + 60000*3);
            setInterval(function(){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/common/time',
                    data: {},
                    dataType : "jsonp",
                    jsonpCallback : 'commonApiTimeHandler',
                    timeout: 11000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.t){
                            var nowTime = new Date().getTime();
                            H.vote.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
        event: function(){
            var me = H.vote;
            $(".back-btn").click(function(e) {
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('yao.html');
            });

            $('.gallery-btn').delegate('.music', 'click', function(e) {
                e.preventDefault();
                me.btn_animate($(this));
                var $curr = $('.items-btn').eq(me.clickedIndex);
                console.log(me.clickedIndex + "___" + $curr.find('.ui-audio').attr('data-url'));
                var typeofAudio = typeof(audio);
                if(!(typeofAudio == 'undefined' || typeofAudio == '' || typeofAudio == null)){
                    audio = null;
                }

                if(!me.flag){
                    return;
                }
                me.flag = false;

                var $audio = $('.ui-audio').audio({
                    auto: true,			// 默认自动播放
                    stopMode: 'stop',	// 默认stop，可不传
                    audioUrl: $curr.find('.ui-audio').attr('data-url'),
                    steams: ["<img src='./images/icon-musical-note.png' />", "<img src='./images/icon-musical-note.png' />"],
                    steamHeight: 150,
                    steamWidth: 44
                });
            });

            $('.gallery-btn').delegate('.vote-btn', 'click', function(e) {
                e.preventDefault();
                me.btn_animate($(this));
                if ($(this).hasClass('disabled')) {
                    showTips("抱歉！投票未开始");
                    return;
                }
                if ($(this).hasClass('requesting')) {
                    return;
                }
                $(this).addClass('requesting');

                getResult('api/voteguess/guessplayer', {
                    yoi: openid,
                    guid: me.guid,
                    pluids: $(this).closest('.items-btn').attr("id").slice(5)
                }, 'callbackVoteguessGuessHandler', true);
            });

            $('a.pl-btn').on('click',function(e){
                e.preventDefault();
                me.btn_animate($(this));
                /*if($('body').scrollTop()){
                    $('html, body').animate({
                        scrollTop: 120 + 'px'
                    }, 500, function () {
                        $('body').scrollTop(0);
                    });
                    $(this).text("我要评论");
                }else{
                    $('html, body').animate({
                        scrollTop: 120 + 'px'
                    }, 500, function () {
                        $('body').scrollTop(120);
                    });
                    $(this).text("隐藏评论");
                }*/
                $('html, body').animate({
                    scrollTop: 120 + 'px'
                }, 500, function () {
                    $('body').scrollTop(120);
                });

                setTimeout(function(){
                    $('body').scrollTop(120);
                },300);

            });

            $('.dm-btn').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                if(me.$dm_section.hasClass("none")){
                    me.$dm_section.removeClass('none');
                    $(this).text("隐藏弹幕");
                    me.$input_comment.attr("placeholder", "弹幕吐槽来一发");
                }else{
                    me.$dm_section.addClass('none');
                    $(this).text("显示弹幕");
                    me.$input_comment.attr("placeholder", "显示弹幕才能看到评论哦");
                }

            });
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        getVoteinfo: function(){
            getResult('api/voteguess/inforoud', {}, 'callbackVoteguessInfoHandler', true);
        },
        voteSupport: function() {
            var me =  H.vote;
            getResult('api/voteguess/groupplayertickets', { groupUuid: me.guid }, 'callbackVoteguessGroupplayerticketsHandler');
        },
        getVote: function() {
            var me = H.vote;
           getResult('api/voteguess/isvote', { yoi: openid, guid: me.guid}, 'callbackVoteguessIsvoteHandler ');
        },
        swiperInit: function(){
            var me = H.vote;
            var galleryThumbs = new Swiper('.gallery-thumbs', {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                spaceBetween: 10,
                centeredSlides: false,
                slidesPerView: 4,
                touchRatio: 1,
                freeMode : false,
                preventClicks : false,
                preventLinksPropagation : false,
                preloadImages: false,
                lazyLoading: true,
                paginationClickable: true
            });

            $(".gallery-thumbs").animate({'opacity':'1'},800);
            var activeIndex = galleryThumbs.activeIndex,
                $bigImg = $('.gallery-top img'),
                $btn_attr = $('.gallery-btn .items-btn'),
                $num_attr = $('.gallery-num .items-num'),
                $thumbs = $('.gallery-thumbs .swiper-slide');

            $bigImg.attr("data-original", $thumbs.eq(activeIndex).attr("data-bigImg"));
            $("img.lazy").picLazyLoad({effect: "fadeIn"});

            $btn_attr.eq(activeIndex).removeClass('none');
            $num_attr.eq(activeIndex).removeClass('none');

            $thumbs.find("img").eq(activeIndex).addClass('imged');

            $thumbs.click(function(e){
                e.preventDefault();
                me.flag = true;

                me.clickedIndex = galleryThumbs.clickedIndex;
                if(me.clickedIndex == undefined){
                    return;
                }

                $bigImg.addClass('none').attr('src','');
                var src = $('.swiper-slide').eq(me.clickedIndex).attr("data-bigImg");
                $thumbs.find("img").removeClass('imged');
                if(src){
                    $bigImg.attr('src', src).removeClass('none');
                    $thumbs.find("img").eq(me.clickedIndex).addClass('imged');
                }

                $btn_attr.addClass('none');
                $btn_attr.eq(me.clickedIndex).removeClass('none');

                /*$(".swiper-slide").eq(me.clickedIndex).addClass('imged');
                $(".swiper-slide").eq(me.clickedIndex).removeClass('imged');*/


                $num_attr.addClass('none');
                $num_attr.eq(me.clickedIndex).removeClass('none');
                if($('.items-btn .music').eq(me.clickedIndex).hasClass('none')){
                    me.$music_label.addClass('hidden');
                }else{
                    me.$music_label.removeClass('hidden');
                }
            });
        },
        spellInfo_html: function(data){
            var t = simpleTpl(),
                me = H.vote;

            $.each(data.items[0].pitems, function(i,item){
                t._('<div class="swiper-slide" data-id="' + item.pid + '" data-bigImg="'+ item.im2 +'">')
                    ._('<img data-src="'+ item.im +'" class="swiper-lazy"/>')
                    ._('<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>')
                ._('</div>')
            });
            $('.gallery-thumbs .swiper-wrapper').append(t.toString());

            var f  = simpleTpl();
            $.each(data.items[0].pitems, function(i,item){
                f._('<div class="items-btn none" id="vote-' + item.pid + '">')
                    ._('<a class="vbtn vote-btn"><img src="images/vote-zan.png"></a>')
                    ._('<div class="music none">')
                        ._('<section class="ui-audio" data-url="'+ item.in +'">')
                            ._(' <div id="coffee-flow" class="coffee-flow">')
                                ._('<a href="#" class="audio-icon"></a>')
                                ._('<strong class="audio-txt hide">关闭</strong>')
                            ._(' </div>')
                        ._('</section>')
                    ._('</div>')
                ._('</div>')
            });
            $('.gallery-btn').append(f.toString());

            var g  = simpleTpl();
            $.each(data.items[0].pitems, function(i,item){
                g._('<div class="items-num none" id="num-' + item.pid + '">')
                    ._('<span></span><label class="wai"><label class="num"></label><i> 票</i></label>')
                ._('</div>')
            });
            $('.gallery-num').append(g.toString());

            me.swiperInit();
            me.voteSupport();

            me.nowTime = timeTransform(parseInt(data.cud));
            var nowTime = new Date().getTime();
            var serverTime = data.cud;
            me.dec = nowTime - serverTime;


            me.currentPrizeAct(data);
        },
        currentPrizeAct: function(data){
            //获取抽奖活动
            var prizeActListAll = data.items,
                prizeLength = 0,
                nowTimeStr = H.vote.nowTime,
                prizeActList = [],
                me = H.vote;
            var day = nowTimeStr.split(" ")[0];
            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].gst.split(" ")[0] == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].get,nowTimeStr) >= 0){
                    me.type = 3;
                    me.change();
                    return;
                }

                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].gst;
                    var endTimeStr = prizeActList[i].get;
                    me.index = i;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){

                        me.nowCountdown(prizeActList[i]);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.beforeShowCountdown(prizeActList[i]);
                        return;
                    }
                }
            }else{
                me.change();
                return;
            }
        },
        // 倒计时
        count_down : function() {
            $('.detail-countdown').each(function() {
                var me = H.vote;
                $(this).countDown({
                    etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
                    stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        // isTimeOver 用来进行重复判断默认为false，第一次进入之后变为true

                        if(!me.isTimeOver){
                            me.isTimeOver = true;
                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                me.nowCountdown(me.pal[me.index]);
                            }else if(me.type == 2){

                                //距摇奖结束倒计时结束后显示距离下轮摇奖开始倒计时
                                if(me.index >= me.pal.length){
                                    me.change();
                                    me.type = 3;
                                    return;
                                }
                                me.beforeShowCountdown(me.pal[me.index]);
                            }

                        }
                    },
                    sdCallback :function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        change: function(){
            var me = H.vote;
            $(".vote-btn").addClass("none");
            $(".music").removeClass("none");
            $(".countdown").removeClass("none").html('本期摇奖已结束，请等待下期!');
        },
        // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            var me = H.vote,
                beginTimeStr = pra.gst;
            me.type = 1;
            $(".vote-btn").addClass("disabled");
            me.countdown_domShow(beginTimeStr,"距投票开启还有");
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            var me = H.vote,
                endTimeStr = pra.get;
            me.type = 2;
            me.index ++;
            $(".vote-btn").removeClass("disabled");
            me.getVote();

            me.countdown_domShow(endTimeStr,"距投票结束还有");
        },
        countdown_domShow: function(time, word){
            var me = H.vote,
                timeLong = timestamp(time);
            timeLong += me.dec;

            $('.detail-countdown').attr('etime',timeLong);
            $(".countdown-tip").html(word);
            me.count_down();
            $(".countdown").removeClass("none");
        }
    };

    H.dom = {
        init: function(){
            this.resize();
        },
        resize: function(){
            var winW = $(window).width(),
                winH = $(window).height(),
                $player = $(".player"),
                $playerTop = $(".player-top"),
                $playerBottom = $(".player-bottom");


            $player.css({
                "height": winH
            });
            $playerTop.css({
                "height": winH*0.87
            });
            $playerBottom.css({
                "height": winH*0.13
            });

            var $galleryTop = $(".gallery-top"),
                $footerBtn = $(".footer-btn");

            $galleryTop.css({
                "height": winH*0.87*0.82
            });

            $footerBtn.css({
                "height": winH*0.87*0.16
            });

            $('.body-top').css({
                "height": winH
            });

            $('.ctrls label img').attr('src',headimgurl ? (headimgurl + '/' + yao_avatar_size) : './images/avatar.png');
        }
    };
    W.callbackVoteguessInfoHandler = function(data){
        var me = H.vote;
        if(data.code == 0){
            me.guid = data.items[0].guid;
            me.spellInfo_html(data);
        }
    };

    W.callbackVoteguessGroupplayerticketsHandler = function(data) {
        if (data.code == 0 && data.items) {
            $.each(data.items, function(i,item){
                $('#num-'+item.puid).find('label.num').text(item.cunt);
            });
        }
    };

    W.callbackVoteguessIsvoteHandler = function(data) {
        var me = H.vote,
            $items_btn = $('.items-btn');
        if (data.code == 0) {
                if (data.so) {
                    var soList = data.so.split(',');
                    $.each(soList, function(i,item){
                        $('#vote-'+item).find('.vote-btn').addClass('none');
                        $('#vote-'+item).find('.music').removeClass('none');
                        me.$music_label.removeClass('hidden');
                    });
                    if($('.items-btn .music').eq(me.clickedIndex).hasClass('none')){
                        me.$music_label.addClass('hidden');
                    }else{
                        me.$music_label.removeClass('hidden');
                    }
                }else{
                    $items_btn.addClass('none');
                    $items_btn.eq(me.clickedIndex).removeClass('none');
                }
            } else {
                $items_btn.addClass('none');
            }
        };

    W.callbackVoteguessGuessHandler = function(data){
        var me = H.vote;
        if(data.code == 0){
            var $num = $('.items-num .num').eq(me.clickedIndex);
            $num.text($num.text()*1+1);


            $('.items-btn').eq(me.clickedIndex).find(".vote-btn").addClass('none');
            $('.items-btn').eq(me.clickedIndex).find(".music").removeClass('none');
            me.$music_label.removeClass('hidden');
        }
    };
})(Zepto);
$(function(){
    H.vote.init();
});


(function($) {
    H.comments = {
        tid: '',
        $inputCmt: $('#input-comment'),
        $btnCmt: $('#btn-comment'),
        REQUEST_CLS: 'requesting',
        init: function() {
            H.utils.resize();
            this.event();
            H.comment.init();
        },

        event: function() {
            var me = this;

            this.$btnCmt.click(function(e) {
                e.preventDefault();

                if ($(this).hasClass(me.REQUEST_CLS)) {
                    return;
                }
                var comment = $.trim(me.$inputCmt.val()) || '',
                    comment = comment.replace(/<[^>]+>/g, ''),
                    len = comment.length;

                if (len < 1) {
                    showTips('请先说点什么吧');
                    me.$inputCmt.removeClass('error').addClass('error');
                    return;
                } else if (len > 20) {
                    showTips('观点字数超出了20字');
                    me.$inputCmt.removeClass('error').addClass('error');
                    return;
                }

                $(this).addClass(me.REQUEST_CLS);

                shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save'+dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: me.tid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
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
                            showTips('发射成功', null, 800);
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar.png';
                            barrage.appendMsg('<div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div>'+comment);
                            $('.isme').parent('div').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                    }
                });

            });
        }
    };

    // 弹幕_S
    H.comment = {
        timer: 5000,
        maxid: 0,
        pageSize: 50,
        $comments: $('#comments'),
        init: function() {
            var me = this;
            W['barrage'] = this.$comments.barrage();
            W['barrage'].start(1);
            setInterval(function() {
                me.flash();
            }, me.timer);
        },
        flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + "api/comments/room?temp=" + new Date().getTime()+dev,
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
                    if (data.code == 0) {
                        me.maxid = data.maxid;
                        var items = data.items || [], umoReg = '/:';
                        for (var i = 0, len = items.length; i < len; i++) {
                            if ((items[i].co).indexOf(umoReg) >= 0) {
                                var funny = items[i].co;
                                var nfunny = funny.replace('/:','');
                                barrage.appendMsg('<div class="c_head_img"><img src="' + (items[i].hu ? (items[i].hu + "/" + yao_avatar_size) : "./images/avatar.png") + '" /></div>'+'<img class="funnyimg" src="./images/funny/' + nfunny + '.png" border="0" />');
                            }else{
                                var hmode = "<div class='c_head_img'><img src='./images/avatar.png' class='c_head_img_img' /></div>";
                                if (items[i].hu) {
                                    hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img' /></div>";
                                }
                                if (i < 5) {
                                    $.fn.cookie('default_comment' + i, hmode + items[i].co, expires_in);
                                }
                                barrage.pushMsg(hmode + items[i].co);
                            }
                        }
                    } else {
                        return;
                    }
                }
            });
        }
    };
    // 弹幕_E

    H.utils = {
        $wrapper: $('article'),
        $comments: $('#comments'),
        resize: function() {
            var height = $(window).height();
            var winW = $(window).width();
            this.$wrapper.css('height', height*0.87*0.80);
            this.$comments.css('height', height*0.87*0.80);
        }
    };
})(Zepto);

$(function() {
    H.comments.init();
});