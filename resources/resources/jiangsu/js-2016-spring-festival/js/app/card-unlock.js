(function ($) {

    H.cardUnlock = {
        
        $dialogWrapper : $('#card_unlock_dialog'),
        $dialog : $('#card_unlock_dialog .dialog'),
        $btnClose : $('#card_unlock_dialog .btn-close'),
        $btnSend : $('#card_unlock_dialog .card-get-btn'),
        $cover : $('#card_unlock_dialog .card-cover'),
        $guide : $('#card_unlock_guide'),
        $title : $('#card_unlock_dialog .card-title'),
        $text : $('#card_unlock_dialog .card-text'),

        cardData: null,

        init: function(){
            this.bindBtns();
        },

        show: function(data){

            H.cardUnlock.cardData = data;

            H.cardUnlock.$cover.attr('src', data.lli);
            H.cardUnlock.$title.text(data.tt);
            H.cardUnlock.$text.text(data.ct);
            H.cardUnlock.$dialogWrapper.removeClass('none');
            H.cardUnlock.$dialog.addClass('transparent');

            setTimeout(function(){
                H.cardUnlock.$dialog.removeClass('transparent');
                var index = H.card.getTapIndex(H.card.lastX, H.card.lastY);
                H.cardUnlock.$dialog.playKeyframe({
                    name: 'smallcard-'+index+'-open',
                    duration: 300,
                    timingFunction: 'ease',
                    complete: function(){
                        H.share.unlockShare(H.cardUnlock.cardData, 4);
                    }
                });
            },100);
        },

        showLiukong: function(index){
           H.cardUnlock.show(H.card.cardData.ml[index]);
        },

        bindBtns: function(){
            H.cardUnlock.$btnClose.tap(function(){
                var index = H.card.getTapIndex(H.card.lastX, H.card.lastY);
                H.cardUnlock.$dialog.playKeyframe({
                    name: 'smallcard-'+index+'-close',
                    duration: 300,
                    timingFunction: 'ease',
                    complete: function () {
                        H.share.commonShare();
                        setTimeout(function(){
                            H.cardUnlock.$dialogWrapper.addClass('none');
                            H.cardUnlock.$dialog.css({
                                '-webkit-animation':'none',
                                'animation':'none'
                            }); 
                        }, 100);
                    }
                });
            });

            H.cardUnlock.$btnSend.tap(function(){
                localStorage.setItem(openid + LS_KEY_UNLOCKING_PREFIX + H.cardUnlock.cardData.ud, true);
                H.card.unLockingCards.push(H.cardUnlock.cardData.ud);

                $('#card_unlock_guide').removeClass('none');
                $('#card_unlock_guide .cloud-wrapper').addClass('floating');
                setTimeout(function(){
                    $('#card_unlock_guide .cloud-wrapper .cloud-text').removeClass('none').addClass('fadeIn');
                }, 400); 
            });

            H.cardUnlock.$guide.tap(function(){
                $(this).addClass('none');
                $('#card_unlock_guide .cloud-wrapper .cloud-text').addClass('none').removeClass('fadeIn');
            });
        },

        resize : function(dialogHeight, videoTop, videoHeight){
            var bigBtnTopRatio = 560 / 702;
            var bigBtnHeightRatio = 71 / 702;

            $('#card_unlock_dialog .card-get-btn').css({
                'top' : dialogHeight * bigBtnTopRatio,
                'height' : dialogHeight * bigBtnHeightRatio
            });

            var leftHeightBig = dialogHeight * bigBtnTopRatio -  videoTop - videoHeight -  20;
            $('#card_unlock_dialog .card-title').css({
                'height' : leftHeightBig / 2 - 12,
                'line-height' : leftHeightBig / 2 - 12 + 'px',
                'margin' : '8px 0 4px'
            });
            $('#card_unlock_dialog .card-text').css({
                'height' : leftHeightBig / 2 - 12,
                'line-height' : leftHeightBig / 2 - 12 + 'px',
                'margin' : '4px 0 8px'
            });
        }
    };


    H.cardUnlock.init();

})(Zepto);