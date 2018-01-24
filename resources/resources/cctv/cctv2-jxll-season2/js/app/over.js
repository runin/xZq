/**
 * Created by Chris on 2015/12/9.
 */
(function($) {
    H.over = {
        even:function(){
            $("#ddtj").click(function(e){
                e.preventDefault();
                if(!$(this).hasClass("clicked")){
                    $(this).addClass("clicked");
                    shownewLoading("请稍候...",null);
                    var url = $(this).attr("data-href");
                    setTimeout(function(){
                        location.href = url;
                    },800);
                }
            });
        },
        nextPrize:function(){
            var me = this;
            getResult("api/linesdiy/info",{},"callbackLinesDiyInfoHandler",true);
            this.ddtj();
            this.even();
        },
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
        swiperOver: function() {
            var me = this, overSwiper = new Swiper('.swiper-container-over', {
                nextButton: '.swiper-button-next-over',
                prevButton: '.swiper-button-prev-over',
                pagination: '.swiper-pagination',
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                effect : 'coverflow',
                slidesPerView: 1,
                centeredSlides: true,
                coverflow: {
                    rotate: 0,
                    stretch: H.common.overStretch,
                    depth: 80,
                    modifier: 2,
                    slideShadows : true
                }
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
                    ._('<div class="swiper-button-prev swiper-button-prev-over swiper-button-white" data-collect="true" data-collect-flag="over-swiper-btn-prev" data-collect-desc="结束页-点击左箭头"><img src="./images/icon-arrow-left.png"></div>')
                    ._('<div class="swiper-button-next swiper-button-next-over swiper-button-white" data-collect="true" data-collect-flag="over-swiper-btn-next" data-collect-desc="结束页-点击右箭头"><img src="./images/icon-arrow-right.png"></div>')
                ._('</div>');
                $("#over-swiper").empty().html(t.toString());
                H.over.swiperOver();
                $(".swiper-container-over").animate({'opacity': '1'},500);
            }
        }
    };

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').attr('data-href', (data.url || '')).removeClass('none');
        } else {
            $('#ddtj').remove();
        };
    }
})(Zepto);