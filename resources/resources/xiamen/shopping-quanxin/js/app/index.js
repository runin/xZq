/**
 * 购物首页
 */
(function ($) {

    H.index = {
        init: function () {
            // 首页列表
            getResult('api/shop/item/roll', {}, 'callbackShopMallItemRoll', true);
            this.promotion();
        },

        promotion: function () {
            getResult('api/common/promotion', {oi: openid}, W.commonApiPromotionHandler);
        }
    };

    H.forenotice = {
        init: function () {
            // 节目单列表
            getResult('api/shop/item/recommend', {}, 'callbackShopMallItemRecommend', true);
            this.promotion();
        },

        promotion: function () {
            getResult('api/common/promotion', {oi: openid}, W.commonApiPromotionHandler);
        }
    };

    H.countDown = {
        timeOffset: 0,
        roundData: null,
        currentRound: 0,
        nextRound: 0,
        interval: null,
        intervalStart: 0,
        intervalEnd: 0,

        init: function () {
            getResult('api/lottery/round?ran=' + Math.random(), {}, 'callbackLotteryRoundHandler');
        },

        initCountDown: function (data) {
            var now = new Date();
            this.timeOffset = data.sctm - now.getTime();
            this.roundData = data.la;
            this.currentRound = this.getCurrentRound();
            this.nextRound = this.getNextRound();

            if (this.currentRound < 0) {
                // 没有正在进行的红包活动
                if (this.nextRound == -1) {
                    // 今天抽奖已经全部结束
                } else {
                    this.updateCountDown();
                }
            } else {
                location.href = './yao.html';
            }
        },

        getCurrentRound: function () {
            var now = new Date().getTime() + this.timeOffset;
            for (var i in this.roundData) {
                var et = this.roundData[i].pd + ' ' + this.roundData[i].et;
                var st = this.roundData[i].pd + ' ' + this.roundData[i].st;
                if (now <= timestamp(et) && now >= timestamp(st)) {
                    return i;
                }
            }
            return -1;
        },

        getNextRound: function () {
            var now = new Date().getTime() + this.timeOffset;
            var next = 0;
            for (var i in this.roundData) {
                var et = this.roundData[i].pd + ' ' + this.roundData[i].et;
                if (now >= timestamp(et)) {
                    next = i;
                }
            }

            if (next >= (this.roundData.length - 1)) {
                return -1;
            } else {
                return parseInt(next, 10) + 1;
            }
        },

        updateCountDown: function () {
            var st = this.roundData[this.nextRound].pd + ' ' + this.roundData[this.nextRound].st;
            var et = this.roundData[this.nextRound].pd + ' ' + this.roundData[this.nextRound].et;

            this.intervalStart = timestamp(st);
            this.intervalEnd = timestamp(et);
            clearInterval(this.interval);
            this.interval = setInterval(function () {
                var nowTime = new Date().getTime() + H.countDown.timeOffset;
                var sT = isNaN(H.countDown.intervalStart) ? 0 : H.countDown.intervalStart - nowTime;
                var eT = isNaN(H.countDown.intervalEnd) ? 0 : H.countDown.intervalEnd - nowTime;

                if (sT >= 0) {
                    // 即将开始
                    console.log('即将开始');

                } else if (eT >= 0) {
                    //正在进行
                    location.href = "./yao.html";
                } else {
                    // 结束
                    console.log('已经结束');

                }
            }, 100);
        }
    };

    // 首页幻灯片
    H.swipe = {
        $main: $('.main'),
        $container: $('#swiper-container'),
        $wrapper: $('#swiper-wrapper'),
        swiper: null,
        init: function (data) {
            var me = this;
            this.$wrapper.append(this.tpl(data));
            this.resize_window();

            this.swiper = new Swiper(this.$container.get(0), {
                centeredSlides: true,
                slidesPerView: 2,
                grabCursor: true,
                calculateHeight: true,
                cssWidthAndHeight: false,
                initialSlide: $('.ui-order-item').index('[data-index="0"]')
            });

            this.$wrapper.delegate('.ui-order-item', 'click', function (e) {
                var $tg = $(e.target).closest('.ui-order-item');
                uid = $tg.attr('data-uid');
                window.location.href = 'order.html?ituid=' + uid;
            });

            this.$wrapper.delegate('.btn-ask', 'click', function (e) {
                var uid = $(this).attr('data-uid');
                window.location.href = 'comment.html?ituid=' + uid;
                return false;
            });

        },

        initFore: function (data) {
            var me = this;
            this.$wrapper.append(this.foreTpl(data));
            this.resize_window();

            this.swiper = new Swiper(this.$container.get(0), {
                centeredSlides: true,
                slidesPerView: 2,
                grabCursor: true,
                calculateHeight: true,
                cssWidthAndHeight: false,
                initialSlide: $('.ui-order-item').index('[data-index="0"]')
            });

        },

        resize_window: function () {
            var height = $(window).height();

            this.$main.css('height', height);

            var itemMaxHeight = 66 + height * 0.55;
            this.$wrapper.css('marginTop', ((height - 57 - 70) - itemMaxHeight) / 2);

            if (height < 500) {
                $(".ui-order-item .item-detail").css('max-height', '50vh');
            }
        },

        add: function (data, index) {
            if (index > 0) {
                this.swiper.appendSlide(this.tpl(data, true));
            } else {
                this.swiper.prependSlide(this.tpl(data, true));
            }
        },


        tpl: function (data, flag) {
            var t = simpleTpl();
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                !flag && t._('<div class="swiper-slide">');

                t._('<div class="ui-order-item" data-uid="' + item.uid + '" data-index="' + item.in + '" data-collect="true" data-collect-flag="shopping-quanxin-index-todetail" data-collect-desc="全心购物 下单">')
                    ._('<div class="item-detail">')
                    ._('<img class="detail-cover" src="' + item.im + '" />')
                    ._('<div class="detail-info">')
                    ._('<h2>' + item.n + '</h2>')
                    ._('<p class="curr-price">')
                    ._('<span class="currency">￥</span>')
                    ._('<strong>' + this.format_price(item.yp, true) + '</strong>')
                    ._('<span class="decimal">' + this.format_price(item.yp, false) + '</span>')
                    ._('<span class="market-price">￥' + this.format_price(item.mkp) + '</span>')
                    ._('<span class="sold">已售' + item.se + item.un + '</span>')
                    ._('</p>')
                    ._('</div>')
                    ._('</div>')
                    ._('<div class="item-ctrl">');
                item.re && t._('<p class="tip">' + item.re + '</p>');
                t._('<a href="javascript:void(0);" class="btn btn-buy" data-collect="true" data-collect-flag="shopping-quanxin-index-buynow" data-collect-desc="全心购物 立即抢购">立即抢购</a>')
                    ._('<a href="javascript:void(0);" data-uid="' + item.uid + '" class="btn btn-ask" data-collect="true" data-collect-flag="shopping-quanxin-index-ask" data-collect-desc="全心购物 我要提问">我要提问</a>')
                    ._('</div>')
                    ._('</div>');

                !flag && t._('</div>');
            }

            return t.toString();
        },

        foreTpl: function (data, flag) {
            var t = simpleTpl();
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                !flag && t._('<div class="swiper-slide">');

                t._('<div class="ui-order-item" data-url="' + item.hrf + '" data-uid="' + item.uid + '" data-index="' + item.in + '"  data-collect="true" data-collect-flag="shopping-quanxin-index-todetail" data-collect-desc="全心购物 下单">')
                    ._('<div class="item-detail">')
                    ._('<img class="detail-cover" src="' + item.im + '" />')
                    ._('<div class="detail-info">')
                    ._('<h2>' + item.n + '</h2>')
                    ._('<p class="curr-price">')
                    ._('<span class="currency">￥</span>')
                    ._('<strong>' + this.format_price(item.yp, true) + '</strong>')
                    ._('<span class="decimal">' + this.format_price(item.yp, false) + '</span>')
                    ._('<span class="market-price">￥' + this.format_price(item.mkp) + '</span>')
                    ._('</p>')
                    ._('</div>')
                    ._('</div>')
                    ._('<div class="item-ctrl">');
                t._('<p class="tip">明天 ' + dateformat(str2date(item.vst || ''), 'hh:mm') + '</p>');
                t._('<a href="#" class="btn btn-disabled btn-buy" data-collect="true" data-collect-flag="shopping-quanxin-index-buynow" data-collect-desc="全心购物 即将开始">即将开始</a>')
                    ._('</div>')
                    ._('</div>');

                !flag && t._('</div>');
            }

            return t.toString();
        },

        format_price: function (price, only_int) {
            var result = (price / 100 || 0).toFixed(2) + '',
                index = result.indexOf('.');
            if (typeof only_int == 'undefined') {
                return result;
            } else if (only_int == true) {
                return result.slice(0, index);
            } else {
                return result.substr(index);
            }
        }
    };

    W.callbackShopMallItemRoll = function (data) {
        if (data.code == 0) {
            H.swipe.init(data.items || []);
        } else {
            //FIX ME 无数据提示
        }
    };

    W.callbackShopMallItemRecommend = function (data) {
        if (data.code == 0) {
            H.swipe.initFore(data.items || []);
        } else {
            //FIX ME 无数据提示
        }
    };

    W.callbackLotteryRoundHandler = function (data) {
        hideLoading();
        if (data.result == true) {
            H.countDown.initCountDown(data);
        }
    };

    W.commonApiPromotionHandler = function (data) {
        if (data.code == 0) {
            $(".all-link").css("bottom", 65 + "px");
            $('#tttj').removeClass('none');
            $('#tttj').html(data.desc).attr('href', data.url);
        }
    };

    H.countDown.init();

})(Zepto);