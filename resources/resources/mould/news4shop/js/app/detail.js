(function($) {
    H.detail = {
        phone: '',
        address: '',
        realName: '',
        goodCoin: null,
        userIntegral: null,
        swiperContainer: null,
        goodUid: getQueryString('uid') || '',
        init: function() {
            this.event();
            this.detailItemPort();
        },
        event: function() {
            var me = this;
            // $('body').delegate('#J_productList a', 'tap', function(e) {
            //     e.preventDefault();
            //     toUrl('detail.html?uid=' + $(this).attr('data-uid'));
            // });

            $('.btn-pay').tap(function(e) {
                e.preventDefault();
                if ($('.btn').hasClass('btn-noCoin')) return;
                if (me.userIntegral != null && me.goodCoin != null) {
                    if (me.userIntegral < me.goodCoin) {
                        showTips('金币不足！');
                        $('.btn').addClass('btn-noCoin');
                        return;
                    } else {
                        me.userInfoPort();
                        H.dialog.payGood.open();
                    }
                }
            });
        },
        selfIntegralPort: function() {
            getResult('api/lottery/integral/rank/self', {
                oi: openid
            }, 'callbackIntegralRankSelfRoundHandler');
        },
        detailItemPort: function() {
            var me = this;
            if (me.goodUid == '') toUrl('shop.html');
            getResult('api/mall/item/detailitem', {
                uuid: me.goodUid
            }, 'callbackStationMallDetail');
        },
        userInfoPort: function() {
            getResult('api/user/info_v2', {
                matk: matk
            }, 'callbackUserInfoHandler');
        },
        fillGoodDetail: function(data) {
            if (data.ib != '') {
                var t = simpleTpl(), list = data.ib.split(';') || [], length = list.length;
                for (var i = 0; i < length; i++) {
                    t._('<section class="swiper-slide slide' + i + '">')
                        ._('<img src="' + list[i] + '"></a>')
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
            }
            $('#J_goodShow h1').text(data.n);
            $('#J_goodShow p').text('现价：' + data.ip + '金币');
            $('#J_detailShow').html(data.d);
            this.goodCoin = data.ip * 1;
            this.selfIntegralPort();
        }
    };

    W.callbackStationMallDetail = function(data) {
        var me = H.detail;
        if (data.code == 0) {
            me.fillGoodDetail(data);
        } else {
            toUrl('shop.html');
        }
    };

    W.callbackIntegralRankSelfRoundHandler = function(data) {
        var me = H.detail;
        if (data.result) me.userIntegral = data.in * 1;
    };

    W.callbackUserInfoHandler = function(data) {
        var me = H.detail;
        if (data.result) {
            H.dialog.payGood.update(data);
        }
    };
})(Zepto);

$(function() {
    H.detail.init();
});