(function($) {
    H.over = {
        init: function () {
            this.event();
            this.tttj();
            // this.recordCheck();
            this.nextPrize();
            $.fn.cookie('jumpNum', 0, {expires: -1});
        },
        nextPrize:function(){
          getResult("api/linesdiy/info",{},"callbackLinesDiyInfoHandler",true);
        },
        event: function() {
            var me = this;
        },
        swiper: function() {
            var me = this, swiper = new Swiper('.swiper-container', {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                pagination: '.swiper-pagination',
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                spaceBetween: 85
            });
            $(".swiper-container").animate({'opacity':'1'},800);
        },
        recordCheck: function() {
            var day = new Date().getDay();
            if (day == '0') {
                $('#btn-go2record').removeClass('none');
            } else {
                $('#btn-go2record').addClass('none');
            }
        },
        tttj: function() {
            $('#tttj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };

    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            var t = simpleTpl();
            var items = data.gitems;
            if(items && items.length > 0){
                for(var i = 0;i < items.length;i ++){
                    t._('<div class="swiper-slide">')
                        ._('<img src="./images/load-swiper.png" data-src="'+items[i].ib+'" class="swiper-lazy">')
                        ._('<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>')
                    ._('</div>');
                }
                $("#nextPrize").html(t.toString());
                H.over.swiper();
            }
        }
    };

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('#tttj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
        } else {
            $('#tttj').remove();
        };
    };
})(Zepto);

$(function(){
    H.over.init();
});