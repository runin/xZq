(function($) {
    H.over = {
        init: function () {
            this.swiper();
            $.fn.cookie('jumpNum', 0, {expires: -1});
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
            $(".swiper-box").animate({'opacity':'1'},800);
        }
    };
})(Zepto);

$(function(){
    H.over.init();
});