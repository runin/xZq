(function ($) {
    H.tv = {
        $dialogWrapper : $('#zhibo'),
        $dialog : $('#zhibo .dialog'),
        $tmpl: $('#tmpl_zhibo'),
        $tv: $('#tv'),
        $snow: $('#tv .tv-snow'),
        $cover: $('#tv .tv-cover'),
        $video: $('#zhibovideo'),
        videoData : null,
        showed: [],
        videoCounter: 0,
        videoWidth: 0,
        videoHeight: 0,
        player: null,
        quid: null,
        init: function(){
            getResult('api/question/round', null, 'callbackQuestionRoundHandler');
            H.tv.resize();
            H.tv.bindBtns();
        },
        beginCountdown: function(){
            if(H.tv.$dialogWrapper.hasClass('none')){
                var cur = new Date().getTime();
                if(H.tv.videoData && H.tv.videoData.length > 0){
                    var data = H.tv.videoData;
                    for(var i in data){
                        isShowed = false;
                        for(var j in H.tv.showed){
                            if(data[i].quid == H.tv.showed[j]){
                                isShowed = true;
                            }
                        }
                        if(!isShowed){
                            if(timestamp(data[i].qst) < cur && cur < timestamp(data[i].qet)){
                                H.tv.show(data[i]);
                                return true;
                            }
                        }
                    }
                }
            }
            setTimeout(function(){
                H.tv.beginCountdown();
            }, 500);
        },
        show: function(data){
            if($.fn.cookie(openid + '_' + data.quid + '_tv')) return;
            H.tv.quid = data.quid;
            H.tv.showed.push(data.quid);
            H.tv.videoCounter++;
            var videoHtml = '<iframe frameborder="0" style="width:'+parseInt(H.tv.videoWidth)+'px;height:'+parseInt(H.tv.videoHeight)+'px;" width="'+parseInt(H.tv.videoWidth)+'" height="'+parseInt(H.tv.videoHeight)+'"  src="'+data.qt+'&tiny=0&auto=1" allowfullscreen></iframe>'
            H.tv.$cover.html(videoHtml);

            H.tv.$dialogWrapper.removeClass('none');
            H.tv.$dialog.addClass('transparent');
            setTimeout(function(){
                H.tv.$dialog.removeClass('transparent');
                H.tv.$dialog.addClass('bounceInDown');
            },100);
            setTimeout(function(){
                H.tv.$snow.addClass('none');
                H.tv.$cover.removeClass('none');
            }, 3000);
        },
        close: function(){
            if (H.tv.quid) $.fn.cookie(openid + '_' + H.tv.quid + '_tv', true, {expires: 0.5});
            H.tv.$dialog.removeClass('bounceInDown').addClass('bounceOutUp');
            setTimeout(function(){
                H.tv.$dialogWrapper.addClass('none');
                H.tv.$dialog.removeClass('bounceOutUp');
                H.tv.$cover.empty();
            }, 500);
            H.tv.beginCountdown();
        },
        bindBtns: function(){
            H.tv.$tv.tap(function(){
                H.tv.player.play();
                return false;
            });
            H.tv.$dialogWrapper.tap(function(){
                H.tv.close();
            });
        },
        resize: function(){
            var width = $(window).width();
            var height = $(window).height();

            var tvRatio = 556 / 400;

            var tvWidth = width * 0.8;
            var tvHeight = tvWidth / tvRatio;

            H.tv.videoWidth = tvWidth * 0.68;
            H.tv.videoHeight = tvHeight * 0.69;
        }
    };

    W.callbackQuestionRoundHandler = function(data){
        if(data.code == 0){
            H.tv.videoData = data.qitems;
            H.tv.beginCountdown();
        }
    };
})(Zepto);