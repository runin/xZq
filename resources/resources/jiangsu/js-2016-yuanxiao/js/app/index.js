(function ($) {

    H.index = {
        $main: $('#main'),
        $toGame: $('#to_game'),
        $runWrapper: $('.words-run'),
        $runIndex: 0,

        $rule: $('#rule'),
        $rolling: $('#rolling'),
        $bgm: $('#audio_bgm'),
        $bgmBtn: $('.bgm'),

        isFirstTouch: true,
        
        init: function(){
            this.resize();
            this.bindBtns();
            this.setUserinfo();
            this.runWords();
            this.bgm();
        },

        bgm: function(){
            this.$bgmBtn.tap(function(){
                if($(this).hasClass('playing')){
                    H.index.$bgmBtn.removeClass('playing');
                    H.index.$bgmBtn.find('img').attr('src', './images/icon-voice-disabled.png');
                    H.index.$bgm[0].pause();
                }else{
                    H.index.$bgmBtn.addClass('playing');
                    H.index.$bgmBtn.find('img').attr('src', './images/icon-voice.png');
                    H.index.$bgm[0].play();
                }
            });
        },

        setUserinfo: function(){
            $('#nickname').text(W.nickname ? W.nickname : '匿名');
            $('#avatar').attr('src',W.headimgurl ? W.headimgurl : './images/avatar.jpg');
        },

        runWords: function(){
            if(this.$rule.hasClass('none') && this.$rolling.hasClass('none')){
                var length = this.$runWrapper.find('p').length;
                if(this.$runIndex >= length){
                    this.$runIndex = 0;
                    this.$runWrapper.removeClass('moving').css({
                        '-webkit-transform': 'translate(0px, 0px)'
                    });
                }else{
                    this.$runWrapper.addClass('moving').css({
                        '-webkit-transform': 'translate(0px, '+ -1 * 32 * this.$runIndex +'px)'
                    });
                }
                this.$runIndex++;
            }

            setTimeout(function(){
                H.index.runWords();
            }, 2500);
        },

        bindBtns: function(){
            H.index.$toGame.tap(function(){
                location.href = 'game.html';
            });

            $('.can-tap').bind('touchstart',function(){
                $(this).addClass('taped');
            });

            $('.can-tap').bind('touchend',function(){
                $(this).removeClass('taped');
            });

            $('#main').bind('touchstart',function(){
                if(H.index.isFirstTouch){
                    H.index.isFirstTouch = false;
                    H.index.$bgm[0].play();
                }
            });

            $('#door').bind('touchstart',function(){
                if(H.index.isFirstTouch){
                    H.index.isFirstTouch = false;
                    H.index.$bgm[0].play();
                }
            });
        },

        resize: function(){
            var width = $(window).width();
            var height = $(window).height();

            H.index.$main.css({
                width: width,
                height: height
            });

            var maincdHeight = width * 0.3 / 199 * 107;
            $('#mcd-top').css('padding-top', (maincdHeight - 48)/2);

        }
    };

    H.index.init();
    
})(Zepto);