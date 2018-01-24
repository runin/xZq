(function ($) {

    H.guide = {
        $guides: $('.guide'),

        $guide1: $('#guide_unlock'),
        $unlock: $('#guide_unlock .icon'),
        $unlockTips: $('#guide_unlock .tips'),
        unlockWidth: 0,
        unlockHeight: 0,
        unlockLeft: 0,
        unlockTop: 0,

        $guide2: $('#guide_vip'),
        $door: $('#guide_vip .icon'),
        $doorTips: $('#guide_vip .tips'),
        doorWidth: 0,
        doorHeight: 0,
        doorLeft: 0,
        doorTop: 0,
        
        $guide3: $('#guide_countdown'),
        $countdown: $('#guide_countdown .icon'),
        $countdownTips: $('#guide_countdown .tips'),
        countDownWidth: 0,
        countDownHeight: 0,
        countDownLeft: 0,
        countDownTop: 0,

        init: function(){

            var isGuided = localStorage.getItem(openid + LS_KEY_GUIDE);
            if(!isGuided){
                H.guide.show();
                H.guide.bindBtns();    
            }else{
                H.welcome.init();
            }
        },

        show: function(){
            H.guide.$guide1.removeClass('none');
        },

        bindBtns: function(){
            H.guide.$guide1.tap(function(){
                $(this).addClass('none');
                H.guide.$guide2.removeClass('none');
            });

            H.guide.$guide2.tap(function(){
                $(this).addClass('none');
                H.guide.$guide3.removeClass('none');
            });

            H.guide.$guide3.tap(function(){
                $(this).addClass('none');
                localStorage.setItem(openid + LS_KEY_GUIDE, true);
                H.welcome.init();
            });
        },

        resize: function(){
            var height = $(window).height();

            H.guide.$door.css({
                'width' : H.guide.doorWidth,
                'height' : H.guide.doorHeight,
                'left' : H.guide.doorLeft,
                'top' : H.guide.doorTop
            });
            H.guide.$doorTips.css({
                'top' : H.guide.doorTop
            });

            H.guide.$countdown.css({
                'width' : H.guide.countDownWidth,
                'height' : H.guide.countDownHeight,
                'left' : H.guide.countDownLeft,
                'top' : H.guide.countDownTop - height * 0.02
            });
            H.guide.$countdownTips.css({
                'top' : H.guide.countDownTop + H.guide.countDownHeight
            });

            H.guide.$unlock.css({
                'width' : H.guide.unlockWidth,
                'height' : H.guide.unlockHeight,
                'left' : H.guide.unlockLeft,
                'top' : H.guide.unlockTop
            });
            H.guide.$unlockTips.css({
                'top' : H.guide.unlockTop + H.guide.unlockHeight - 30,
            });
        }
    };

    // H.guide.init();

})(Zepto);