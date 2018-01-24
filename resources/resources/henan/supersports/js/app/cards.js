(function($) {
    H.cards = {
        init: function() {
            this.event();
            this.getInfoPort();
        },
        event: function() {
            $('body').delegate('.btn-make, .swiper-slide', 'click', function(e){
                e.preventDefault();
                recordUserOperate(openid, "制作贺卡按钮", "btn-make");
                toUrl('card.html?pid=' + $('.swiper-slide-active').attr('data-id') || '');
            });
        },
        getInfoPort: function() {
            var me = this;
            shownewLoading(null,'祝福正在赶来...');
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/linesdiy/info' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLinesDiyInfoHandler',
                timeout: 1e4,
                complete: function() {
                    hideLoading();
                },
                success : function(data) {
                    if (data.code == 0 && data.tt && data.gitems) {
                        saveData('lotteryTime', data.tt);
                        me.fill(data.gitems);
                    }
                },
                error : function() {
                }
            });
        },
        fill: function(data){
            var items = data, tpl = '';
            // 倒序
            // for (var a = 0, i = items.length - 1; i >= 0; i--, a++) tpl += '<div class="swiper-slide" data-id="' + items[i].uid + '" data-collect="true" data-collect-flag="swiper-slide' + a + '" data-collect-desc="卡片-' + items[i].t + '"><p class="pname">' + items[i].t + '</p><img data-src="' + items[i].ib + '" class="swiper-lazy" src="./images/lazy.png"><div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div></div>';
            
            // 正序
            for (i in items) tpl += '<div class="swiper-slide" data-id="' + items[i].uid + '" data-collect="true" data-collect-flag="swiper-slide' + i + '" data-collect-desc="卡片-' + items[i].t + '"><p class="pname">' + items[i].t + '</p><img data-src="' + items[i].ib + '" class="swiper-lazy" src="./images/lazy.png"><div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div></div>';

            $('.swiper-wrapper').html(tpl);
            this.swiper();
        },
        swiper: function() {
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: 1,
                paginationClickable: true,
                keyboardControl: true,
                spaceBetween: 35,
                speed: 600,
                loop: true,
                iOSEdgeSwipeDetection: true,
                preloadImages: true,
                lazyLoading: true,
                lazyLoadingInPrevNext: true,
                lazyLoadingInPrevNextAmount: 3,
                onInit: function(swiper) {
                    var index = parseInt(swiper.activeIndex);
                },
                onSlideChangeEnd: function(swiper) {
                    var index = parseInt(swiper.activeIndex);
                    $('.btn-make').attr({
                        'data-collect-flag': $('.swiper-slide-active').attr('data-collect-flag'),
                        'data-collect-desc':  $('.swiper-slide-active').attr('data-collect-desc')
                    });
                }
            });
        }
    };
})(Zepto);

$(function() {
    H.cards.init();
    H.jssdk.init();
});