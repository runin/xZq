/**
 * Created by Chris on 2015/12/9.
 */
(function($) {
    H.over = {
        nextPrize:function(){
            var me = this;
            getResult("api/linesdiy/info",{},"callbackLinesDiyInfoHandler",true);
        },
        swiperOver: function() {
            var me = this, overSwiper = new Swiper('.swiper-container-over', {
                preloadImages: true,
                lazyLoading: true,
                slidesPerView : 1.1,
                centeredSlides: false,
                spaceBetween : 15,
                freeMode : true
            });
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            var t = simpleTpl();
            var items = data.gitems;
            if(items && items.length > 0){
                t._('<div class="swiper-container-over">')
                    ._('<div class="swiper-wrapper">');
                for(var i = 0;i < items.length;i ++){
                    t._('<div class="swiper-slide">')
                        ._('<img src="./images/load-swiper.png" data-src="'+items[i].ib+'" class="swiper-lazy over-img">')
                        ._('<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>')
                        ._('</div>');
                }
                t._('</div>')
                ._('</div>');
                $("#over-swiper").empty().html(t.toString());
                H.over.swiperOver();
                $(".swiper-container-over").animate({'opacity': '1'},500);
            }
        }
    };
})(Zepto);