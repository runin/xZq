;(function($){
    H.index = {
        mySwiper: null,
        $mask: $("#mask"),
        init: function(){
            this.swiper();
            this.event();
            this.signInfo();
            this.resize();
            this.audio();
            if (is_android()) $('.andrShow').removeAttr('style');
            myVideo = document.getElementById('myvideo');
        },
        event: function(){
            var me = this;
            $("body").delegate("#submit", "click",function(e){
                e.preventDefault();
                me.btn_animate($(this));

                if($(this).hasClass("diabled")){
                    $(this).addClass("diabled");
                    return;
                }
                //  必填信息
                var $active = $(".items9");
                var $companyName = $active.find(".company"),
                    $name = $active.find(".peopleName"),
                    $phone = $active.find(".phone");

                var companyName = $.trim($companyName.val()),
                    name = $.trim($name.val()),
                    phone = $.trim($phone.val());

                if(name.length < 2 || name.length > 30){
                    showTips('联系人长度为2~30个字符');
                    $name.focus();
                    return false;
                }else if(!/^\d{11}$/.test(phone)){
                    showTips('这电话，可打不通哦...');
                    $phone.focus();
                    return false;
                }

                getResult('api/entryinfo/asyncsave', {
                    openid : openid,
                    name : encodeURIComponent(name),//联系人
                    address : encodeURIComponent(companyName),//公司名
                    phone : phone //联系电话
                }, 'callbackActiveEntryInfoSaveHandler',true);


            });
            $("body").delegate("#close", "tap",function(e){
                e.preventDefault();
                me.maskHide_slideTo();
            });

            $.fn.meteor = function(options) {
                var defaults = {
                    starCount: 10,
                    meteorCount: 10
                };
                var settings = $.extend(defaults, options),
                    width = $(window).width(),
                    height = $(window).height();
                for (var left, top, num, delay, second, i = '', j = 0; j < settings.starCount; j ++) {
                    left = (width * Math.random()).toFixed(2);
                    top = (height * Math.random()).toFixed(2);
                    delay = Math.random().toFixed(2);
                    second = (1 + 4 * Math.random()).toFixed();
                    num = Math.round(1 + 3 * Math.random());
                    // i += '<i class="star style' + num + '" style="left:' + left + "px; top:" + top + "px; -webkit-animation-delay:" + delay + "s; -webkit-animation: star " + second + 's linear infinite;"></i>';
                    i += '<i class="star style' + num + '" style="-webkit-transform: translate(' + left + "px," + top + "px); -webkit-animation-delay:" + delay + "s; -webkit-animation: star " + second + 's linear infinite;"></i>';
                }

                for (var j = 0; j < settings.meteorCount; j++) {
                    left = (520 * Math.random() - 210).toFixed(2);
                    top = (100 * Math.random() - 80).toFixed(2);
                    delay = (.5 + 2.5 * Math.random()).toFixed();
                    second = (1.2 + 2.8 * Math.random()).toFixed();
                    num = Math.round(1 + 3 * Math.random());
                    // i += '<i class="meteor style' + num + '" style="left:' + left + "px; top:" + top + "px; -webkit-animation-delay:" + delay + "s; -webkit-animation: meteor " + second + 's linear infinite;"></i>';
                    i += '<i class="meteor style' + num + '" style="-webkit-transform: translate(' + left + "px," + top + "px); -webkit-animation-delay:" + delay + "s; -webkit-animation: meteor " + second + 's linear infinite;"></i>';
                }
                $(this).append(i);
            };

            setTimeout(function(){
                $('.meteor').meteor({
                    starCount: 20,
                    meteorCount: 10
                });
            },2000);


            $('.play').click(function(e){
                e.preventDefault();
                if (myVideo.paused) {
                    myVideo.currentTime = 0;
                    myVideo.play();
                    $('.play').animate({
                        opacity: 0
                    }, 500);
                    myVideo.addEventListener('ended', function() {
                        $(".play").animate({
                            opacity: 1
                        }, 500);
                        $('.audio-icon').trigger('click');
                    });
                    if (isPlaying) $('.audio-icon').trigger('click');
                } else {
                    myVideo.pause();
                    $(".play").animate({
                        opacity: 1
                    }, 500);
                    $('.audio-icon').trigger('click');
                }
            });
        },
        maskHide_slideTo: function(){
            this.$mask.addClass("none");
            $("#submit").removeClass("diabled");
            this.mySwiper.slideTo(0, 1000, false);//切换到第一个slide，速度为1秒
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        swiper: function(){
            var me = this;
            var swiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                /*touchRatio: 1.5,
                lazyLoading : true,
                lazyLoadingInPrevNext : true,
                lazyLoadingInPrevNextAmount : 2,*/
                onSlideChangeEnd: function(swiper){
                    console.log(parseInt(swiper.activeIndex)); //每次切换时，提示现在是第几个slide
                    if(swiper.activeIndex == 2){
                        $(".dot").show();
                        setTimeout(function(){
                            $(".dot").hide();
                        },2800);
                    }
                    recordUserOperate(openid, "滑动切换" + swiper.activeIndex + "页面", "swiper-slide-" + swiper.activeIndex);
                    if (swiper.activeIndex != 6) {
                        myVideo.pause();
                        $(".play").animate({
                            opacity: 1
                        }, 500);
                    }
                }
            });

            me.mySwiper = swiper;
        },
        target : function(index){
            return $(".items"+ index).find(".body");
        },
        //获取报名活动信息
        signInfo: function(){
            getResult('api/entryinfo/info',{},'callbackActiveEntryInfoHandler');
        },
        resize: function(){
            var me = this,
                win_W = $(window).width(),
                win_H = $(window).height();
            me.$mask.css({
                "height": win_H,
                "width": win_W
            });
            $(".content").css({
                "position": "relative",
                "left": (win_W - 255)/2,
                "top": (win_H - 253)/2,
                "z-index": "99"
            });
        },
        animation_heart: function(){
            var heart = getRandomArbitrary(1,7),
                cls = getRandomArbitrary(1,5),
                imgName = getRandomArbitrary(1,6),
                $heartAnimation = $("#heart-animation");

            $heartAnimation.removeClass("none").append("<img class='heart"+heart+" f"+cls+"' id='heart"+imgName+"' src='images/"+ imgName +".png'/>");
            $heartAnimation.find("img").one("webkitAnimationEnd", function () {
                $heartAnimation.find("img").remove();
            });
        },
        audio: function(){
            var $audio = $('#ui-audio').audio({
                auto: true,         // 是否自动播放，默认是true
                stopMode: 'pause',  // 停止模式是stop还是pause，默认stop
                audioUrl: 'images/fanh5.mp3',
                steams: ["<img src='./images/icon-musical-note.png' />", "<img src='./images/icon-musical-note.png' />"],
                steamHeight: 150,
                steamWidth: 44
            });
        }
    };

    //获取报名活动信息
    W.callbackActiveEntryInfoHandler = function(data){};


    //报名接口
    W.callbackActiveEntryInfoSaveHandler = function(data) {
        var me = H.index;

        if (data.code == 0) {
                me.$mask.removeClass("none");
                setTimeout(function(){
                    me.maskHide_slideTo();
                },5000);
        } else {
            console.log("资料提交失败，请稍后重试");
        }
    };
})(Zepto);
$(function(){
    H.index.init();
});