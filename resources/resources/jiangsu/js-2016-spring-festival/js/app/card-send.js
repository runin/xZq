(function ($) {

    H.cardSend = {
        $dialogWrapper : $('#card_send_dialog'),
        $dialog : $('#card_send_dialog .dialog'),
        $btnClose : $('#card_send_dialog .btn-close'),
        $btnSend: $('#card_send_btn'),
        $guide: $('#card_send_guide'),
        $video: $('#card_send_dialog .video-wrapper'),
        
        $didi: $('#card_send_dialog .card-gift'),
        $switcher: $('#card_send_dialog .card-record-switcher'),
        $voiceInput: $('#card_send_dialog .card-voice-input'),
        $textInput: $('#card_send_dialog .card-input'),
        $input: $('#card_send_dialog .card-input input'),
        $preview: $('#card_send_dialog .card-voice-preview'),
        $reset: $('#card_send_dialog .card-record-reset'),

        cardData: null,
        curType: 'text',
        recordBegin: 0,
        lastDuration: 0,
        curServerId: 0,

        init: function(){
            this.bindBtns();
        },

        show: function(data){
            H.cardSend.cardData = data;
            H.cardSend.$dialogWrapper.removeClass('none');
            H.cardSend.$dialog.addClass('transparent');
            setTimeout(function(){
                H.cardSend.$dialog.removeClass('transparent');
                H.cardSend.$dialog.addClass('scaleIn');
            },100);

            H.card.initVideoEvents(data.cd, data.ulli ,H.cardSend.$video);
        },

        bindBtns: function(){
            H.cardSend.$btnClose.tap(function(){
                H.share.commonShare();
                H.cardSend.$dialog.removeClass('scaleIn').addClass('scaleOut');
                
                setTimeout(function(){
                    H.card.closeVideo(H.cardSend.$video);
                    H.cardSend.reset();
                    H.cardSend.$dialogWrapper.addClass('none');
                    H.cardSend.$dialog.removeClass('scaleOut');
                }, 400);
            });

            H.cardSend.$btnSend.tap(function(){

                if(H.cardSend.curType == 'voice'){
                    if(H.cardSend.curServerId == 0){
                        showTips('请说出您的祝福^ ^');
                        return false;
                    }

                    showLoading(null, '贺卡制作中');
                    H.share.cardShare(H.cardSend.cardData.cd, H.cardSend.cardData.ulli , null, H.cardSend.curServerId, H.cardSend.cardData.ct, Math.ceil(H.cardSend.lastDuration / 1000));
                    setTimeout(function(){
                        hideLoading();
                        H.cardSend.done();
                        getResult('api/greetingcard/make', {
                            oi : openid,
                            mu : H.cardSend.cardData.ud,
                            vi : H.cardSend.curServerId,
                            vd : Math.ceil(H.cardSend.lastDuration / 1000),
                            gt : null,
                            nn : nickname,
                            hi : headimgurl
                        }, 'callbackGreetingcardMakeHandler');
                    }, 1000);

                }else{
                    var val = $.trim(H.cardSend.$input.val());
                    if(val.length == 0){
                        showTips('请写下您的祝福^ ^');
                        return false;
                    }else if(val.length > 100){
                        showTips('祝福请不要太长哦，贺卡塞不下啦^ ^');
                        return false;
                    }

                    showLoading(null, '贺卡制作中');
                    H.share.cardShare(H.cardSend.cardData.cd , H.cardSend.cardData.ulli , val, null, H.cardSend.cardData.ct, null);
                    setTimeout(function(){
                        hideLoading();
                        H.cardSend.done();
                        getResult('api/greetingcard/make', {
                            oi : openid,
                            mu : H.cardSend.cardData.ud,
                            vi : null,
                            gt : val,
                            nn : nickname,
                            hi : headimgurl
                        }, 'callbackGreetingcardMakeHandler');
                    }, 1000);
                }
                
            });

            H.cardSend.$guide.tap(function(){
                $(this).addClass('none');
                $('#card_send_guide .cloud-wrapper .cloud-text').addClass('none').removeClass('fadeIn');
            });

            H.cardSend.$switcher.tap(function(){
                if($(this).hasClass('active')){
                    // 去发文字
                    H.cardSend.curType = 'text';
                    $(this).removeClass('active');
                    $(this).find('img').attr('src', './images/icon-record.png');
                    H.cardSend.$voiceInput.addClass('none');
                    H.cardSend.$textInput.removeClass('none');
                }else{
                    // 去发语音
                    H.cardSend.curType = 'voice';
                    $(this).addClass('active');
                    $(this).find('img').attr('src', './images/icon-keyboard.png');
                    H.cardSend.$voiceInput.removeClass('none');
                    H.cardSend.$textInput.addClass('none');
                }
            });

            H.cardSend.$voiceInput.bind('touchstart', function(){
                $(this).addClass('recording');
                H.cardSend.recordBegin = new Date().getTime();
                H.voice.$tips.removeClass('none');
                wx.startRecord();
                return false;
            });

            H.cardSend.$voiceInput.bind('touchend', function(){
                $(this).removeClass('recording');
                H.voice.$tips.addClass('none');
                wx.stopRecord({
                    success: function (res) {
                        H.cardSend.lastDuration = new Date().getTime() - H.cardSend.recordBegin;
                        H.cardSend.uploadVoice(res.localId);
                    }
                });
                return false;
            });

            H.cardSend.$preview.tap(function(){
                var serverId = $(this).attr('data-vid');
                H.voice.playVoice(serverId);
            });

            H.cardSend.$reset.tap(function(){
                H.cardSend.reset();
                return false;
            });
        },

        reset: function(){
            H.cardSend.$textInput.addClass('none');
            H.cardSend.$voiceInput.removeClass('none');
            H.cardSend.$preview.addClass('none');
            H.cardSend.$switcher.find('img').attr('src', './images/icon-keyboard.png');
            H.cardSend.$switcher.removeClass('none').addClass('active');
            H.cardSend.$input.val('');
        },

        uploadVoice: function(localId){
            wx.uploadVoice({
                localId: localId,
                isShowProgressTips: 1,
                    success: function (res){
                    H.cardSend.curServerId = res.serverId;
                    H.cardSend.previewVoice(res.serverId);
                }
            });
        },

        previewVoice: function(serverId){
            H.cardSend.$voiceInput.addClass('none');
            H.cardSend.$switcher.addClass('none');
            H.cardSend.$preview.removeClass('none');
            H.cardSend.$preview.find('.comment-duration').html(Math.ceil(H.cardSend.lastDuration / 1000) + '\"');
            H.cardSend.$preview.attr('data-vid', serverId);
        },

        done: function(data){
            $('#card_send_guide').removeClass('none');
            $('#card_send_guide .cloud-wrapper').addClass('floating');
            setTimeout(function(){
                $('#card_send_guide .cloud-wrapper .cloud-text').removeClass('none').addClass('fadeIn');
            }, 400);  
        },


        resize : function(dialogHeight){
            var btnTopRatio = 740 / 864;
            var btnHeightRatio = 71 / 864;            
            
            $('#card_send_dialog .card-send-btn').css({
                'top' : dialogHeight * btnTopRatio,
                'height' : dialogHeight * btnHeightRatio
            });

        }
    };

    W.callbackGreetingcardMakeHandler = function (data) {
        
    };

    H.cardSend.init();

})(Zepto);