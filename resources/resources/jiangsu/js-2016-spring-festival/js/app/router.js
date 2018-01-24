(function ($) {

    H.router = {
    	curUrl: 'cover',
        curSlide: 'index',

        init: function(){
            H.index.resize();
            H.card.init();
            var send = getQueryString('send');
            if(send){
                // 好友发来贺卡
                H.cardAccept.init();
            }else{
                // 正常流程
                H.countdown.init();
            }
        },

        slideTo: function(url){
            H.router.curSlide = url;
            var width = $(window).width();
            
            if(url == 'yao'){
                $('.page-wrapper').css({
                    '-webkit-transform' : 'translate(' + -1 * width + 'px, 0px)'
                });
                $('#comment_input').attr('disabled', 'disabled');
                $('.guide').addClass('none');

            }else if(url == 'index'){
                $('.page-wrapper').css({
                    '-webkit-transform' : 'translate(0px, 0px)'
                });
                setTimeout(function(){
                    $('#comment_input').removeAttr('disabled');
                    var isGuided = localStorage.getItem(openid + LS_KEY_GUIDE);
                    if(!isGuided){
                        $('#guide_unlock').removeClass('none');
                    }
                }, 1000);
                
            }

            return false;
        }
    };

})(Zepto);