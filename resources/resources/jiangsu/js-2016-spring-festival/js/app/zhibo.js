(function ($) {

    H.zhibo = {
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

        init: function(){
            getResult('api/article/list', null, 'callbackArticledetailListHandler');
            H.zhibo.resize();
            H.zhibo.bindBtns();
        },

        beginCountdown: function(){
            if(H.router.curSlide == 'index' && H.zhibo.$dialogWrapper.hasClass('none') && H.cardGet.$dialogWrapper.hasClass('none')){
                var cur = new Date().getTime() - H.countdown.serverOffset;
                if(H.zhibo.videoData && H.zhibo.videoData.length > 0){
                    var data = H.zhibo.videoData;
                    for(var i in data){
                        isShowed = false;
                        for(var j in H.zhibo.showed){
                            if(data[i].uid == H.zhibo.showed[j]){
                                isShowed = true;
                            }
                        }
                        if(!isShowed){
                            if(timestamp(data[i].bt) < cur && cur < timestamp(data[i].et)){
                                H.zhibo.show(data[i]);
                                return true;
                            }
                        }
                    }
                }
            }

            setTimeout(function(){
                H.zhibo.beginCountdown();
            }, 500);
        },

        show: function(data){
            H.zhibo.showed.push(data.uid);
            H.zhibo.videoCounter++;
            var videoHtml = '<iframe frameborder="0" style="width:'+parseInt(H.zhibo.videoWidth)+'px;height:'+parseInt(H.zhibo.videoHeight)+'px;" width="'+parseInt(H.zhibo.videoWidth)+'" height="'+parseInt(H.zhibo.videoHeight)+'"  src="'+data.gu+'" allowfullscreen></iframe>'
            H.zhibo.$cover.html(videoHtml);



            H.zhibo.$dialogWrapper.removeClass('none');
            H.zhibo.$dialog.addClass('transparent');
            setTimeout(function(){
                H.zhibo.$dialog.removeClass('transparent');
                H.zhibo.$dialog.addClass('bounceInDown');
            },100);

            setTimeout(function(){
                H.zhibo.$snow.addClass('none');
                H.zhibo.$cover.removeClass('none');
            }, 3000);

        },

        close: function(){
            H.zhibo.$dialog.removeClass('bounceInDown').addClass('bounceOutUp');
            
            setTimeout(function(){
                H.zhibo.$dialogWrapper.addClass('none');
                H.zhibo.$dialog.removeClass('bounceOutUp');
                H.zhibo.$cover.empty();
            }, 500);

            H.zhibo.beginCountdown();
        },

        bindBtns: function(){

            H.zhibo.$tv.tap(function(){
                H.zhibo.player.play();
                return false;
            });

            H.zhibo.$dialogWrapper.tap(function(){
                H.zhibo.close();
            });
        },

        resize: function(){
            var width = $(window).width();
            var height = $(window).height();

            var tvRatio = 424 / 296;

            var tvWidth = width * 0.8;
            var tvHeight = tvWidth / tvRatio;

            H.zhibo.videoWidth = tvWidth * 0.7;
            H.zhibo.videoHeight = tvHeight * 0.8;
            
        }
    };

    W.callbackArticledetailListHandler = function(data){
        if(data.code == 0){
            H.zhibo.videoData = data.arts;
            H.zhibo.beginCountdown();
        }
    }


})(Zepto);