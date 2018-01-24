(function($) {
    H.shop = {
        swiperContainer: null,
        payback: getQueryString('payback') || '',
        exchange: getQueryString('exchange') || false,
        swiperJump: getQueryString('swiperJump') || 0,
        ref: getQueryString("ref"),
        linkExp: "",
        init: function() {
            var me = this;
            if(this.ref == "link"){
                $("footer").addClass("none");
                me.linkExp = "&ref=link";
            }
            this.event();
            this.getTel();
            this.shopItemPort();
            shownewLoading(null, '商品加载中...');
        },
        event: function() {
            var me = this;
            $('body').delegate('.btn-ljgm', 'tap', function(e) {
                e.preventDefault();
                toUrl('detail.html?uid=' + $(".swiper-slide-active").attr('data-uid') + '&swiperJump=' + $(".swiper-slide-active").attr('data-flag') + me.linkExp);
            }).delegate('.btn-ljdh', 'tap', function(e) {
                e.preventDefault();
                toUrl('detail.html?uid=' + $(this).attr('data-uid') + '&exchange=card&swiperJump=' + $(this).attr('data-flag'));
            }).delegate('.swiper-slide', 'click', function(e) {
                e.preventDefault();
                if (me.exchange) {
                    toUrl('detail.html?uid=' + $(this).attr('data-uid') + '&exchange=card&swiperJump=' + $(this).attr('data-flag'));
                } else {
                    toUrl('detail.html?uid=' + $(this).attr('data-uid') + '&swiperJump=' + $(this).attr('data-flag') + me.linkExp);
                }
            })
            $('#btn-topic').on('click', function(e) {
                e.preventDefault();
                toUrl("comment.html");
            });
        },
        paybackTips: function() {
            if (this.payback == 'ok') {
                showTips('您已成功付款，静待好货上门~', 2000);
            } else if (this.payback == 'error') {
                showTips('付款失败了哦，请重新提交订单', 2000);
            }
        },
        shopItemPort: function() {
            getResult('api/shop/item/list', {
                Page: 1,
                pageSize: 100
            }, 'callbackShopMallItemList');
        },
        fillProduct: function(data) {
            var me = this, t = simpleTpl(), items = data.items || [], length = items.length;
            for (var i = length - 1; i >= 0; i--) {
                if (me.exchange) {
                    if (items[i].ise == 1) {
                        t._('<section class="swiper-slide slide' + i + '" id="silde' + i + '" data-uid="' + items[i].uid + '" data-flag="silde' + i + '">')
                            ._('<section class="image-wrapper">')
                                ._('<p></p><img class="swiper-lazy" src="./images/reserve-default.jpg" data-src="' + items[i].im + '">')
                                ._('<section class="info-box"><h1>' + items[i].n + '</h1><p><span class="yp">￥' + items[i].yp/100 + '</span><span class="mkp">￥' + items[i].mkp/100 + '</span></p></section>')
                            ._('</section>')
                            ._('<a href="javascript:;" class="btn-ljdh" data-uid="' + items[i].uid + '" data-flag="silde' + i + '" data-collect="true" data-collect-flag="btn-ljdh" data-collect-desc="按钮-立即兑换"><img src="./images/btn-ljdh.png"></a>')
                        ._('</section>')
                    }
                } else {
                    t._('<section class="swiper-slide slide' + i + '" id="silde' + i + '" data-uid="' + items[i].uid + '" data-flag="silde' + i + '">')
                        ._('<section class="image-wrapper">')
                            ._('<p></p><img class="swiper-lazy" src="./images/reserve-default.jpg" data-src="' + items[i].im + '">')
                            ._('<section class="info-box"><h1>' + items[i].n + '</h1><p><span class="yp">￥' + items[i].yp/100 + '</span><span class="mkp">￥' + items[i].mkp/100 + '</span></p></section>')
                        ._('</section>')
//                      ._('<a href="javascript:;" class="btn-ljgm" data-uid="' + items[i].uid + '" data-flag="silde' + i + '" data-collect="true" data-collect-flag="btn-ljgm" data-collect-desc="按钮-立即购买"><img src="./images/btn-ljgm.png"></a>')
                    ._('</section>')
                }
            };
            $('.swiper-wrapper').html(t.toString());
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                slidesPerView: 1,
                paginationClickable: true,
                keyboardControl: true,
                spaceBetween: 20,
                speed: 600,
                effect: 'coverflow',
                coverflow: {
                    stretch: 0,
                    depth: 300,
                    modifier: 1,
                    rotate: -30,
                    slideShadows : false
                },
                iOSEdgeSwipeDetection : true,
                preloadImages: false,
                lazyLoading: true,
                lazyLoadingInPrevNext : true,
                loop: true,
                onInit: function(swiper){
                    var index = parseInt(swiper.activeIndex);
                    $('.swiper-slide').removeClass('boom');
                    $('.slide' + parseInt(swiper.activeIndex)).addClass('boom');
                    // $('body').scrollToTop($('body').height());
                },
                onSlideChangeEnd: function(swiper) {
                    var index = parseInt(swiper.activeIndex);
                    $('.swiper-slide').removeClass('boom');
                    $('.slide' + parseInt(swiper.activeIndex)).addClass('boom');
                    // $('body').scrollToTop($('body').height());
                }
            });
            $('.swiper-control').animate({'opacity':'1'}, 500, function(){
                me.paybackTips();
            });
            if (me.swiperJump != '') {
                swiper.slideTo($('#' + me.swiperJump).index(), 0, false);
            }
        },
        getTel: function() {
            getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler');
        }
    };

    W.callbackLinesDiyInfoHandler = function(data) {
        if (data.code == 0 && data.gitems != undefined) {
            if (data.gitems[0].t != '') {
                $('.tel').html(data.gitems[0].t).removeClass('hidden');
            } else {
                $('.tel').addClass('hidden');
            }
        } else {
            $('.tel').addClass('hidden');
        }
    };

    W.callbackShopMallItemList = function(data) {
        var me = H.shop;
        hidenewLoading();
        if (data.code == 0) me.fillProduct(data);
    };
})(Zepto);

$(function() {
    H.shop.init();
});