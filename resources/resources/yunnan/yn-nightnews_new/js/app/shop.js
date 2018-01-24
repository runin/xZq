(function($) {
    H.shop = {
        swiperContainer: null,
        init: function() {
            this.event();
            // this.adGetPort();
            this.shopItemPort();
        },
        event: function() {
            var me = this;
            $('body').delegate('#J_productList a', 'tap', function(e) {
                e.preventDefault();
                toUrl('detail.html?uid=' + $(this).attr('data-uid'));
            }).delegate('.swiper-slide a', 'tap', function(e) {
                e.preventDefault();
                if ($(this).attr('data-good') != '') {
                    toUrl('detail.html?uid=' + $(this).attr('data-good'));
                }
            });
        },
        adGetPort: function() {
            getResult('api/ad/get', {
                areaNo: areaNo
            }, 'callbackAdGetHandler');
        },
        shopItemPort: function() {
            shownewLoading(null, '商品加载中...');
            getResult('api/mall/item/list', {
                page: 1,
                pageSize: 50
            }, 'callbackStationCommMall');
        },
        fillBanner: function(data) {
            var t = simpleTpl(), ads = data.ads || [], length = ads.length, link = "javascript:;";
            for (var i = 0; i < length; i++) {
                if (ads[i].l != '') link = ads[i].l;
                t._('<section class="swiper-slide slide' + i + '" data-u="' + ads[i].u + '">')
                    ._('<a href="' + link + '" data-good="' + ads[i].c + '" data-collect="true" data-collect-flag="btn-good" data-collect-desc="商品按钮"><img src="' + ads[i].p + '"></a>')
                ._('</section>')
            };
            $('.swiper-wrapper').html(t.toString());
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                slidesPerView: 1,
                paginationClickable: true,
                keyboardControl: true,
                spaceBetween: 0,
                speed: 600,
                iOSEdgeSwipeDetection : true,
                preloadImages: false,
                lazyLoading: true,
                onSlideChangeEnd: function(swiper) {
                    $('.swiper-slide').removeClass('boom');
                    $('.slide' + parseInt(swiper.activeIndex)).addClass('boom');
                }
            });
            this.swiperContainer = swiper;
        },
        fillProduct: function(data) {
            var me = this, t = simpleTpl(), items = data.items || [], length = items.length;
            for (var i = 0; i < length; i++) {
                t._('<a href="javascript:;" data-uid="' + items[i].uid + '">')
                    ._('<img src="' + items[i].is + '">')
                    ._('<p>' + items[i].n + '</p>')
                    ._('<i>' + items[i].ip + '积分</i>')
                ._('</a>')
            };
            $('#J_productList').html(t.toString());
        }
    };

    W.callbackStationCommMall = function(data) {
        var me = H.shop;
        if (data.code == 0) me.fillProduct(data);
        hidenewLoading();
    };

    W.callbackAdGetHandler = function(data) {
        var me = H.shop;
        if (data.code == 0) me.fillBanner(data);
    };
})(Zepto);

$(function() {
    H.shop.init();
});