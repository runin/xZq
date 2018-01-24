(function ($) {

    H.nothing = {
        $dialogWrapper: $('#nothing_dialog'),
        $dialog: $('#nothing_dialog .dialog'),
        $count: $('.award-count'),
        $tips: $('#yao .cover-tips'),

        from: 'yao',

        tips: ['姿势摆的好，就能中大奖', '别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'],

        init: function(){
            H.nothing.resize();
        },

        show: function(){
            
            H.nothing.$dialog.find('.award-btn').unbind('tap').tap(function(){
                H.nothing.close();
            });

            H.nothing.$dialogWrapper.removeClass('none');
            H.nothing.$dialog.addClass('transparent');
            setTimeout(function(){
                H.nothing.$dialog.removeClass('transparent');
                H.nothing.$dialog.addClass('award-in');
            },100);
        },

        showTips: function(){
            var rand = Math.floor(Math.random() * H.nothing.tips.length);
            H.nothing.$tips.text(H.nothing.tips[rand]);
        },

        close: function(){
            H.nothing.$dialog.removeClass('award-in');
            H.nothing.$dialogWrapper.addClass('none');
            
            if(H.nothing.from == 'vip'){
                H.vip.reset();
            }
        },

        resize: function(){
            var height = $(window).height();
            var dialogRatio = 770 / 1009

            var dialogHeight = height * dialogRatio;
            $('#nothing_dialog .dialog').css({
                'height' : dialogHeight,
                'top' : (height - dialogHeight)/2
            });
        }

    };

    H.nothing.init();

})(Zepto);