(function ($) {

    H.index = {
        $video : $('#main_video'),
        videoHeight: 0,
        videoWidth: 0,

        init: function(){
            this.resize();
            this.bindBtns();

            var mySwiper = new Swiper('#wrap', {
                direction: 'vertical',
                onSlideChangeEnd: function(swiper) {
                    if(swiper.activeIndex == 11){
                        $('#main_video').html('<iframe frameborder="0" width="'+H.index.videoWidth+'" height="'+H.index.videoHeight+'" src="http://v.qq.com/iframe/player.html?vid=v0181fprwog&tiny=0&auto=0" allowfullscreen></iframe>');
                    }
                }
            });
        },

        bindBtns: function(){
            $('#share_dialog').tap(function(){
                $(this).addClass('none');
            });

            $('#share_dialog').bind('touchmove', function(){
                return false;
            });

            $('#btn_share').tap(function(){
                $('#share_dialog').removeClass('none');
            });

            $('#wrap .tab-video-item').tap(function(){
                $('.tab-video-item').removeClass('active');
                $(this).addClass('active');
                $('#main_video').html('<iframe frameborder="0" width="'+H.index.videoWidth+'" height="'+H.index.videoHeight+'" src="'+$(this).attr('data-src')+'" allowfullscreen></iframe>');
            });

            
        },

        resize: function(){
            var width = $(window).width();
            var height = $(window).height();
            $('.item').css({
                'background-size': width + 'px ' + height + 'px'
            });

            $('.box-half').css({
                'height': height / 2
            });

            var videoRatio = 480 / 272;
            var videoTotalWidth = width * 0.92;
            var mainVideoHeight = ( videoTotalWidth - 6 ) / videoRatio;
            var tabVideoHeight = ( videoTotalWidth - 4 - 6 ) / 2 / videoRatio;

            var videoTotalHeight = mainVideoHeight + tabVideoHeight + 9;
            $('.video-box').css('top', (height - videoTotalHeight) / 2 );

            var flowerRatio = 576 / 232;
            var flowerContentWidth = width * 0.92;
            var flowerContentHeight = (height - videoTotalHeight) / 2;
            var flowerHeight = width * 0.92 / flowerRatio;
            if(flowerContentWidth / flowerContentHeight > flowerRatio){
                $('.flower').css({
                    'height': flowerContentHeight
                });
            }else{
                $('.flower').css({
                    'height': flowerContentHeight,
                    'padding-top': flowerContentHeight - flowerHeight
                });
            }

            var leftHeight = (height - flowerContentHeight - videoTotalHeight) / 3;
            $('.tips-box').css({
                'top': flowerContentHeight + videoTotalHeight,
                'height': leftHeight,
                'padding-top': (leftHeight / 2) + 'px'
            });

            $('.btn-box').css({
                'top': flowerContentHeight + videoTotalHeight + leftHeight + (leftHeight / 2) 
            });

            H.index.$video.css({
                'width': videoTotalWidth - 6,
                'height': mainVideoHeight,
                'background-size': videoTotalWidth - 6 + 'px ' + mainVideoHeight + 'px'
            });

            H.index.videoWidth = videoTotalWidth - 6;
            H.index.videoHeight = mainVideoHeight;

            var slogon = 211 / 358;
            var slogonHeight = height * 0.45;
            var slogonWidth = slogonHeight * slogon;
            $('.item-5 .p5-slogon').css({
                'left': (width - slogonWidth)/ 2,
                'width': slogonWidth,
                'height': slogonHeight,
                'background-size': slogonWidth + 'px ' + slogonHeight + 'px'
            });
        }
    };

    H.index.init();

})(Zepto);