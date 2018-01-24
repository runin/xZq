(function ($) {

    H.cardGet = {
        $dialogWrapper : $('#card_get_dialog'),
        $dialog : $('#card_get_dialog .dialog'),
        $btnGet : $('#card_get_dialog .card-get-btn'),
        $cover : $('#card_get_dialog .card-get-cover'),
        $title : $('#card_get_dialog .card-title'),
        $actor : $('#card_get_dialog .card-text'),

        cardData : null,

        isReturn : true,

        init: function(){
            this.bindBtns();
        },

        show: function(data){
            if(H.cardGet.$dialogWrapper.hasClass('none')){

                H.cardGet.cardData = data;
                H.cardGet.$cover.attr('src', data.ulli);
                H.cardGet.$title.text(data.tt);
                H.cardGet.$actor.text(data.ct);

                H.cardGet.$dialogWrapper.removeClass('none');
                H.cardGet.$dialog.addClass('transparent');
                setTimeout(function(){
                    H.cardGet.$dialog.removeClass('transparent');
                    H.cardGet.$dialog.addClass('bounceInDown');
                },100);
            }
        },

        close: function(){
            H.cardGet.$dialog.playKeyframe({
                name: 'bigcard-2-close',
                duration: 300,
                timingFunction: 'ease',
                complete: function () {
                    setTimeout(function(){
                        
                        H.cardGet.$dialogWrapper.addClass('none');  
                        H.cardGet.$dialog.css({
                            '-webkit-animation':'none',
                            'animation':'none'
                        });

                        // FIX ME
                        H.card.beginCountdown();

                    }, 100);
                }
            });
        },

        bindBtns: function(){
            H.cardGet.$btnGet.tap(function(){
                if(H.cardGet.isReturn){
                    H.cardGet.isReturn = false;
                    showLoading(null, '贺卡领取中');
                    getResult('api/greetingcard/material/gain', {
                        oi : openid,
                        mu : H.cardGet.cardData.ud,
                    }, 'callbackGreetingcardMaterialGainHandler');
                }
            });
        },

        success: function(){
            localStorage.setItem(openid + LS_KEY_CARD_PREFIX + H.cardGet.cardData.ud, 'true');
            H.card.addCard(H.cardGet.cardData.ud);
            H.cardGet.close();
        },

        resize : function(dialogHeight, videoTop, videoHeight){
            var bigBtnTopRatio = 560 / 702;
            var bigBtnHeightRatio = 71 / 702            

            $('#card_get_dialog .card-get-btn').css({
                'top' : dialogHeight * bigBtnTopRatio,
                'height' : dialogHeight * bigBtnHeightRatio
            });
            var leftHeightbig = dialogHeight * bigBtnTopRatio -  videoTop - videoHeight -  20;
            $('#card_get_dialog .card-title').css({
                'height' : leftHeightbig / 2 - 12,
                'line-height' : leftHeightbig / 2 - 12 + 'px',
                'margin' : '8px auto 4px'
            });
            $('#card_get_dialog .card-text').css({
                'height' : leftHeightbig / 2 - 12,
                'line-height' : leftHeightbig / 2 - 12 + 'px',
                'margin' : '4px auto 8px'
            });
        }
    };

    W.callbackGreetingcardMaterialGainHandler = function(data){
        hideLoading();
        H.cardGet.isReturn = true;
        if(data.result == true){
            H.cardGet.success();
        }else{
            // FIX ME 领取失败处理
        }
    }

    H.cardGet.init();

})(Zepto);