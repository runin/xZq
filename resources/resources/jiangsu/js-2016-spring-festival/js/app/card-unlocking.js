(function ($) {

    H.cardUnlocking = {

        $dialogWrapper : $('#card_unlocking_dialog'),
        $dialog : $('#card_unlocking_dialog .dialog'),
        $friendLi: $('#card_unlocking_dialog .card-friend-list ul li'),
        $cover : $('#card_unlocking_dialog .card-cover'),
        $title : $('#card_unlocking_dialog .card-title'),
        $text : $('#card_unlocking_dialog .card-text'),
        $guide : $('#card_unlock_guide'),
        $btnClose : $('#card_unlocking_dialog .btn-close'),
        $btnSend : $('#card_unlocking_dialog .card-unlocking-btn'),
        $locking: $('#card_unlocking_dialog .locking'),
        $tips: $('#card_unlocking_dialog .card-friend-tips'),

        cardData: null,


        init: function(){
            this.bindBtns();
        },

        show: function(data){

            H.cardUnlocking.cardData = data;

            for(var i in H.cardUnlocking.$friendLi){
                H.cardUnlocking.$friendLi.eq(i).html(parseInt(i) + 1);
            }

            for(var i in data.fl){
                H.cardUnlocking.$friendLi.eq(i).html('<img src="'+(data.fl[i].hi ? data.fl[i].hi : "./images/avatar.jpg")+'" />');
            }
            
            var lockLeft = data.uu - data.fl.length;
            H.cardUnlocking.$locking.attr('src', './images/big-unlock-' + lockLeft + '.png');
            H.cardUnlocking.$tips.text('还差'+lockLeft+'人，盼你们如南方人盼暖气');

            H.cardUnlocking.$cover.attr('src', data.lli);
            H.cardUnlocking.$title.text(data.tt);
            H.cardUnlocking.$text.text(data.ct);
            H.cardUnlocking.$dialogWrapper.removeClass('none');
            H.cardUnlocking.$dialog.addClass('transparent');
            
            setTimeout(function(){
                H.cardUnlocking.$dialog.removeClass('transparent');
                var index = H.card.getTapIndex(H.card.lastX, H.card.lastY);
                H.cardUnlocking.$dialog.playKeyframe({
                    name: 'bigcard-'+index+'-open',
                    duration: 300,
                    timingFunction: 'ease',
                    complete: function(){
                        H.share.unlockShare(H.cardUnlocking.cardData, lockLeft);
                    }
                });
            },100);
        },

        bindBtns: function(){
            H.cardUnlocking.$btnClose.tap(function(){
                var index = H.card.getTapIndex(H.card.lastX, H.card.lastY);
                H.cardUnlocking.$dialog.playKeyframe({
                    name: 'bigcard-'+index+'-close',
                    duration: 300,
                    timingFunction: 'ease',
                    complete: function () {
                        H.share.commonShare();
                        setTimeout(function(){
                            H.cardUnlocking.$dialogWrapper.addClass('none');
                            H.cardUnlocking.$dialog.css({
                                '-webkit-animation':'none',
                                'animation':'none'
                            });  
                        }, 100);
                    }
                });
            });

            H.cardUnlocking.$btnSend.tap(function(){
                localStorage.setItem(openid + LS_KEY_UNLOCKING_PREFIX + H.cardUnlocking.cardData.ud, true);
                H.card.unLockingCards.push(H.cardUnlocking.cardData.ud);

                $('#card_unlock_guide').removeClass('none');
                $('#card_unlock_guide .cloud-wrapper').addClass('floating');
                setTimeout(function(){
                    $('#card_unlock_guide .cloud-wrapper .cloud-text').removeClass('none').addClass('fadeIn');
                }, 400); 
            });

            H.cardUnlocking.$guide.tap(function(){
                $(this).addClass('none');
                $('#card_unlock_guide .cloud-wrapper .cloud-text').addClass('none').removeClass('fadeIn');
            });
        },

        resize : function(width, dialogHeight, videoTop, videoHeight){
            
            var bigBtnTopRatio = 740 / 864;
            var bigBtnHeightRatio = 71 / 864
            var bigFriendWidthRatio = 470 / 640;

            $('#card_unlocking_dialog .card-unlocking-btn').css({
                'top' : dialogHeight * bigBtnTopRatio,
                'height' : dialogHeight * bigBtnHeightRatio
            });

            $('#card_unlocking_dialog .card-friend-list ul').css({
                'width' : width * bigFriendWidthRatio
            });
            $('#card_unlocking_dialog .card-friend-list ul li').css({
                'width' : width * bigFriendWidthRatio / 4 - 4,
                'height': width * bigFriendWidthRatio / 4 - 4,
                'line-height' : width * bigFriendWidthRatio / 4 - 4 + 'px',
            });

            var leftHeightBig = dialogHeight * bigBtnTopRatio -  videoTop - videoHeight - (width * bigFriendWidthRatio / 4 - 4) - 50;
            $('#card_unlocking_dialog .card-title').css({
                'height' : leftHeightBig / 2 - 12,
                'line-height' : leftHeightBig / 2 - 12 + 'px',
                'margin' : '8px 0 4px'
            });
            $('#card_unlocking_dialog .card-text').css({
                'height' : leftHeightBig / 2 - 12,
                'line-height' : leftHeightBig / 2 - 12 + 'px',
                'margin' : '4px 0 8px'
            });


        }
    };


    H.cardUnlocking.init();

})(Zepto);