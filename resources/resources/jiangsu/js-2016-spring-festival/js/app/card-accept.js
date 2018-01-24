(function ($) {

    H.cardAccept = {
        $dialogWrapper : $('#card_accept_dialog'),
        $dialog : $('#card_accept_dialog .dialog'),
        $video: $('#card_accept_dialog .video-wrapper'),
        
        $didi: $('#card_accept_dialog .card-gift'),
        $voice: $('#card_accept_dialog .card-voice-preview'),
        $text: $('#card_accept_dialog .card-text p'),
        $ok: $('#card_accept_dialog .card-send-btn'),
        $header: $('#card_accept_dialog .headerimg'),
        $nickname: $('#card_accept_dialog .nickname'),
        $bigText: $('#card_accept_dialog .text-show'),
        $more: $('#card_accept_dialog .card-text-more'),
        $duration: $('#card_accept_dialog .comment-duration'),

        cardData: null,
        didiData: null,

        init: function(){
            this.bindBtns();

            var send = getQueryString('send');
            if(send){
                var hasDidied = localStorage.getItem(openid + LS_KEY_DIDI);
                if(hasDidied){
                    H.cardAccept.fill();
                }else{
                    getResult('api/lottery/luck4Collect',{
                        oi: openid
                    },'callbackLotteryLuck4CollectHandler', null, null, null, 15000, function(){
                        H.cardAccept.fill();
                    });
                }
            }
        },

        fill: function(){

            var nn = localStorage.getItem('last_nn');
            var hd = localStorage.getItem('last_hd');
            var vi = localStorage.getItem('last_vi');
            var co = localStorage.getItem('last_co');
            var te = localStorage.getItem('last_te');
            var voi = localStorage.getItem('last_voi');
            var du = getQueryString('du');

            localStorage.removeItem('last_nn');
            localStorage.removeItem('last_hd');
            localStorage.removeItem('last_vi');
            localStorage.removeItem('last_co');
            localStorage.removeItem('last_te');
            localStorage.removeItem('last_voi');

            var data = H.cardAccept.cardData;

            H.cardAccept.$header.attr('src', hd);
            H.cardAccept.$nickname.text(nn ? xssEscape(decodeURIComponent(nn)) : '匿名' );
            H.cardAccept.$duration.text(du ? du + '\"' : '');
            H.card.initVideoEvents(vi, co, H.cardAccept.$video);

            if(voi){
                // 语音贺卡
                H.cardAccept.$voice.attr('data-vid', voi).removeClass('none');
                H.cardAccept.$voice.tap(function(){
                    var serverId = $(this).attr('data-vid');
                    H.voice.playVoice(serverId);
                });
            }else{
                // 文字贺卡
                H.cardAccept.$text.text(xssEscape(decodeURIComponent(te)));
                $('#card_accept_dialog .card-text-wrapper').removeClass('none');
            }

            H.cardAccept.show();
        },

        initDidi: function(data){
            H.cardAccept.$ok.find('img').attr('src', './images/btn-didi.png');
            H.cardAccept.$ok.addClass('didi');
        },

        show: function(){
            H.cardAccept.$dialogWrapper.removeClass('none');
            H.cardAccept.$dialog.addClass('transparent');
            setTimeout(function(){
                H.cardAccept.$dialog.removeClass('transparent');
                H.cardAccept.$dialog.addClass('bounceInDown');
            },100);
        },

        didiDone: function(){
            H.cardAccept.$ok.find('img').attr('src', './images/btn-join.png');
            H.cardAccept.$ok.removeClass('didi');
            localStorage.setItem(openid + LS_KEY_DIDI, true);
        },

        bindBtns: function(){
            

            H.cardAccept.$ok.tap(function(){
                if($(this).hasClass('didi')){
                    var data = H.cardAccept.didiData;
                    data.pi = './images/default-didi.jpg';
                    data.pd = 'didi';
                    H.award.show(data, 'accept');
                }else{
                    H.cardAccept.$dialog.removeClass('bounceInDown').addClass('bounceOutUp');
                    setTimeout(function(){
                        H.card.closeVideo(H.cardAccept.$video);
                        H.cardAccept.$dialogWrapper.addClass('none');
                        H.cardAccept.$dialog.removeClass('bounceOutUp');
                        
                        H.countdown.init();
                    }, 500);
                }
            });

            H.cardAccept.$text.tap(function(){
                if(H.cardAccept.$bigText.hasClass('none')){
                    H.cardAccept.$more.addClass('rotate');
                    H.cardAccept.$bigText.removeClass('none');
                }else{
                    H.cardAccept.$more.removeClass('rotate');
                    H.cardAccept.$bigText.addClass('none');
                }
            });

            H.cardAccept.$more.tap(function(){
                if(H.cardAccept.$bigText.hasClass('none')){
                    H.cardAccept.$more.addClass('rotate');
                    H.cardAccept.$bigText.removeClass('none');
                }else{
                    H.cardAccept.$more.removeClass('rotate');
                    H.cardAccept.$bigText.addClass('none');
                }
            });
        },

        resize : function(dialogHeight){
            var btnTopRatio = 740 / 864;
            var btnHeightRatio = 71 / 864;
            var textMaxHeightRatio = 0.27;

            $('#card_accept_dialog .card-send-btn').css({
                'top' : dialogHeight * btnTopRatio,
                'height' : dialogHeight * btnHeightRatio
            });

            H.cardAccept.$bigText.css({
                'max-height': dialogHeight * textMaxHeightRatio
            });
        }
    };

    W.callbackLotteryLuck4CollectHandler = function(data){
        if(data.result){
            H.cardAccept.didiData = data;
            H.cardAccept.initDidi();
        }
        
        H.cardAccept.fill();
    };

})(Zepto);