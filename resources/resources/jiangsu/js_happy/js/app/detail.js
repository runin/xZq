(function($) {
    H.detail = {
        phone: '',
        address: '',
        realName: '',
        goodCoin: null,
        userIntegral: null,
        swiperContainer: null,
        uid: getQueryString('uid') || '',
        price: 0,
        price_min: 0,
        price_max: 0,
        price_default: 0,
        stock: 0,
        stock_default: 0, 
        cc: '',           
        ccn: '',          
        sc: '',           
        scn: '',          
        sizes: [],        
        colors: [],       
        sku: {},          
        exchange: getQueryString('exchange') || false,
        swiperJump: getQueryString('swiperJump') || 0,
        isinit:false,
        isret:false,
        isLeft:false,
        lastXPos:0,
        lastYPos:0,
        notMove:true,
        cx:330,
        cy:330,
        ref: getQueryString("ref") == "link" ? "ref=link" : "",
        init: function() {
            this.event();
            this.detailItemPort();
            this.userInfoPort();
            this.toucha($('#btn-goback'));
            if (this.exchange) this.cardExchange();
        },
        event: function() {
            var me = this, initYPos = $(window).height() * 0.8;
            $('#btn-goback').animate({"-webkit-transform":'translate(0,260px)'},300,'ease-out',function () {
                me.isret = false;
                me.lastYPos = 260;
                me.notMove = true;
            });
            $('.btn-pay').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('error')) return;
                if (me.colors.length > 0 && (!me.cc || !me.ccn)) {
                    showTips('请选择颜色');
                    return;
                } else if (me.sizes.length > 0 && (!me.sc || !me.scn)) {
                    showTips('请选择类别');
                    return;
                }
                $('.btn-pay, .good-wrapper').addClass('none');
                $('.order i label').text(parseInt($("#number").val()));
                $('.order p label').text((parseFloat($('.yp label').html()) * parseInt($("#number").val())).toFixed(2));
                $('.userinfo-wrapper').removeClass('none');
                $('.btn-goback').addClass('none');
            });
            $('.btn-submit').click(function(e) {
                e.preventDefault();
                if(me.check()) {
                    if(!$('.btn-submit').hasClass("flag")){
                        $('.btn-submit').addClass("flag");
                        me.orderSubmitPort();
                    }
                }
            });
            $('.btn-exchange').click(function(e) {
                e.preventDefault();
                if(me.check()) {
                    if(!$('.btn-exchange').hasClass("flag")){
                        $('.btn-exchange').addClass("flag");
                        me.orderExchangePort();
                    }
                }
            });
            $('.quantity-decrease').click(function(e) {
                e.preventDefault();
                me.minus();
            });
            $('.quantity-increase').click(function(e) {
                e.preventDefault();
                me.plus();
            });

            $('#size-wrapper').delegate('.btn-size', 'click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('disabled')) return;
                if ($(this).hasClass('active')) {
                    me.sc = me.scn = '';
                    $(this).removeClass('active');
                    $('.btn-color').removeClass('disabled');
                } else {
                    $(this).addClass('active').siblings().removeClass('active');
                    me.sc = $(this).attr('data-sc');
                    me.scn = $(this).attr('data-scn');
                    
                    $('.btn-color').each(function() {
                        var cc = $(this).attr('data-cc');
                        if (!me.sku[cc + '#' + me.sc]) {
                            $(this).addClass('disabled');
                        } else {
                            $(this).removeClass('disabled');
                        }
                    });
                }
                me.updateSKU();
            });
            
            $('#color-wrapper').delegate('.btn-color', 'click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('disabled')) return;
                if ($(this).hasClass('active')) {
                    me.cc = me.ccn = '';
                    $(this).removeClass('active');
                    $('.btn-size.disabled').removeClass('disabled')
                } else {
                    $(this).addClass('active').siblings().removeClass('active');
                    me.cc = $(this).attr('data-cc');
                    me.ccn = $(this).attr('data-ccn');
                    
                    $('.btn-size').each(function() {
                        var sc = $(this).attr('data-sc');
                        if (!me.sku[me.cc+'#'+sc]) {
                            $(this).addClass('disabled');
                        } else {
                            $(this).removeClass('disabled');
                        }
                    });
                }
                me.updateSKU();
            });
        },
        toucha: function (obj) {
            var me = this;
            obj.on("touchstart", function (ts) {
                if (ts.targetTouches.length == 1) {
                    ts.preventDefault();
                    var touch = ts.targetTouches[0];
                }
                var constx = touch.pageX;
                var consty = touch.pageY;
                obj.on("touchmove", function (e) {
                    e.preventDefault();
                    e = e.changedTouches[0];
                    if(!me.isret){
                        if(((e.pageX - constx) < 20 && (e.pageX - constx) > -20 ) && ((e.pageY - consty) < 20 && (e.pageY - consty) > -20 )){me.notMove = true;}else{me.notMove = false;}
                        me.cx = e.pageX;
                        me.cy = e.pageY;
                        if(me.isLeft){
                            $(this).css({"-webkit-transform":'translate(' + (me.cx-constx-($(window).width() * .9 - 60)) + 'px,' + (me.cy-consty + me.lastYPos) + 'px)'});
                        }else{
                            $(this).css({"-webkit-transform":'translate(' + (me.cx-constx) + 'px,' + (me.cy-consty + me.lastYPos) + 'px)'});
                        }
                    }
                }).one("touchend", function () {
                    me.isret = true;
                    var endXPos = null,endYPos = null;
                    if((me.cx-constx < -($(window).width() * .3)) || (me.cx-constx+me.lastXPos) <-($(window).width() *.4)){
                        endXPos = -($(window).width() * .9 - 60);
                        me.isLeft = true;
                    }else {
                        endXPos = 0;
                        if(!me.notMove){
                            me.isLeft = false;
                        }
                    }
                    console.log('me.cy = ' + me.cy + '  $(window).height() = ' + $(window).height());
                    if((me.cy- 35) < ($(window).height() * .1)){
                        endYPos = ($(window).height() * .1);
                        // endYPos = me.cy - 35;
                    }else if((me.cy) > ($(window).height() * .9 - 60)){
                        endYPos = ($(window).height() * .9 - 60);
                        // endYPos = me.cy - 35;
                    }else {
                        endYPos = me.cy - 35;
                    }
                    if(me.notMove == true){
                        if (me.exchange) {
                            toUrl('shop.html?swiperJump=' + me.swiperJump + '&exchange=card');
                        } else {
                            toUrl('shop.html?swiperJump=' + me.swiperJump + '&' + me.ref);
                        }
                    }else{
                        $('#btn-goback').animate({"-webkit-transform":'translate(' + endXPos + 'px,' + endYPos + 'px)'},300,'ease-out',function () {
                            me.isret = false;
                            $('#btn-goback').off();
                            me.toucha(obj);
                            me.notMove = true;
                        });
                        me.lastXPos = endXPos;
                        me.lastYPos = endYPos;
                    }
                })
            });
        },
        cardExchange: function() {
            $('.quantity-wrapper').addClass('disable');
            $('.quantity').attr('disabled', 'disabled');
            $('.btn-submit').addClass('none');
            $('.btn-exchange').removeClass('none');
        },
        orderSubmitPort: function() {
            var me = this;
            shownewLoading(null, '请稍等...');
            getResult('api/shop/order/submit', {
                tid: me.uid,
                qt: parseInt($("#number").val()),
                yo: openid,
                ph: me.phone,
                co: encodeURIComponent(me.realName),
                ad: encodeURIComponent(me.address),
                cc: encodeURIComponent(me.cc),
                sc: encodeURIComponent(me.sc),
                cn: me.ccn,
                sn: me.scn,
                pt: 2
            }, 'callbackShopMallOrderSubmitOrder');
        },
        orderExchangePort: function() {
            var me = this;
            shownewLoading(null, '请稍等...');
            getResult('api/shop/order/exchange', {
                tid: me.uid,
                qt: 1,
                yo: openid,
                ph: me.phone,
                co: encodeURIComponent(me.realName),
                ad: encodeURIComponent(me.address),
                cc: encodeURIComponent(me.cc),
                sc: encodeURIComponent(me.sc),
                cn: me.ccn,
                sn: me.scn,
                pt: 3
            }, 'callbackShopMallOrderExchangeOrder');
        },
        detailItemPort: function() {
            var me = this;
            if (me.uid == '') toUrl('shop.html?' + me.ref);
            getResult('api/shop/item/itemdetail', {
                yoi: openid,
                itemUuid: me.uid
            }, 'callbackShopMallItemDetail');
        },
        userInfoPort: function() {
            getResult('api/user/info_v2', {
                matk: matk
            }, 'callbackUserInfoHandler');
        },
        fillGoodDetail: function(data) {
            var me = this;
            if (data.om != '') {
                var t = simpleTpl(), list = data.om.split(';') || [], length = list.length;
                $('.order img').attr('src', list[0]);
                for (var i = 0; i < length; i++) {
                    t._('<section class="swiper-slide slide' + i + '">')
                        ._('<img src="' + list[i] + '"></a>')
                    ._('</section>')
                };
                $('.swiper-wrapper').html(t.toString());
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination .wrapper',
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
            if (data.kc <= 0) {
                $('.quantity-wrapper').addClass('disable');
                $('.quantity').attr('disabled', 'disabled').val('0');
                $('.btn').addClass('error').html('商品已售罄');
                $('.kc label').text('0');
                this.stock_default = 0;
                this.stock = 0;
            } else if (data.kc == -1) {
                if (me.exchange) {
                    me.cardExchange();
                } else {
                    $('.quantity-wrapper').removeClass('disable');
                    $('.quantity').removeAttr('disabled', 'disabled').val('1');
                }
                $('.kc label').text('999999');
                $('.btn').removeClass('error').html('提交订单');
                this.stock_default = 999999;
                this.stock = 999999;
            } else if (data.kc == 1) {
                if (me.exchange) {
                    me.cardExchange();
                } else {
                    $('.quantity-increase').removeClass('disable').addClass('no');
                    $('.quantity').removeAttr('disabled', 'disabled').val('1');
                }
                $('.kc label').text(data.kc);
                $('.btn').removeClass('error').html('提交订单');
                this.stock_default = data.kc * 1;
                this.stock = data.kc * 1;
            } else {
                if (me.exchange) {
                    me.cardExchange();
                } else {
                    $('.quantity-wrapper').removeClass('disable');
                    $('.quantity').removeAttr('disabled', 'disabled').val('1');
                }
                $('.kc label').text(data.kc);
                $('.btn').removeClass('error').html('提交订单');
                this.stock_default = data.kc * 1;
                this.stock = data.kc * 1;
            }
            $('.good-wrapper h1, .order h1').text(data.n);
            if (this.exchange) {
                $('.yp label').text('0');
            } else {
                $('.yp label').text(data.yp / 100);
            }
            $('.mkp label').text(data.mp / 100);
            $('.detail').html(data.pinf);
            this.uid = data.uid;
            this.fillSpecifications(data);
        },
        fillSpecifications: function(data) {
            var me = this;
            this.colors = data.colors || [];
            this.sizes = data.sizes || [];

            if (this.colors.length > 0) {
                var t = simpleTpl(), len = this.colors.length;
                for (var i = 0; i < len; i++) {
                    t._('<a href="javascript:;" class="btn-color" data-cc="' + this.colors[i].cc + '" data-ccn="' + this.colors[i].ccn + '">' + this.colors[i].ccn + '</a>');
                }
                $('#color-wrapper').removeClass('none').html(t.toString());
                $('.type').removeClass('none');
                $('.order-detail h3').removeClass('none');
            }
            if (this.sizes.length > 0) {
                var t = simpleTpl(), len = this.sizes.length;
                for (var i = 0; i < len; i++) {
                    t._('<a href="javascript:;" class="btn-size" title="' + this.sizes[i].scn + '" data-sc="' + this.sizes[i].sc + '" data-scn="' + this.sizes[i].scn + '">' + this.sizes[i].scn + '</a>');
                }
                $('#size-wrapper').removeClass('none').html(t.toString());
                $('.type').removeClass('none');
                $('.order-detail h3').removeClass('none');
            }

            $.each(data.sku || [], function(index, obj) {
                $.each(obj, function(key, value) {
                    var arr = value.split('#');
                    me.sku[key] = {
                        'price': arr[0],
                        'stock': arr[1]
                    };
                });
            });
            this.price_min = data.minp;
            this.price_max = data.maxp;
            this.price_default = data.yp;
        },
        updateSKU: function() {
            var me = this,
                color = $('.btn-color.active').attr('data-cc'),
                size = $('.btn-size.active').attr('data-sc'),
                key = (color || '') + '#' + (size || ''),
                stock = this.sku[key] ? this.sku[key].stock : this.stock_default,
                price = this.sku[key] ? this.sku[key].price : this.price_min;

            $('.order-detail h3 label').text((this.ccn ? '"' + this.ccn + '" ' : '') + (this.scn ? ' "' + this.scn + '"' : ''));

            if (stock <= 0) {
                $('.quantity-wrapper').addClass('disable');
                $('.quantity').attr('disabled', 'disabled').val('0');
                $('.btn').addClass('error').html('商品已售罄');
                $('.kc label').text('0');
                this.stock_default = this.stock;
            } else if (stock == -1) {
                if (me.exchange) {
                    me.cardExchange();
                } else {
                    $('.quantity-wrapper').removeClass('disable');
                    $('.quantity').removeAttr('disabled', 'disabled').val('1');
                }
                $('.kc label').text('999999');
                $('.btn').removeClass('error').html('提交订单');
                this.stock_default = 999999;
            } else if (stock == 1) {
                if (me.exchange) {
                    me.cardExchange();
                } else {
                    $('.quantity-increase').removeClass('disable').addClass('no');
                    $('.quantity').removeAttr('disabled', 'disabled').val('1');
                }
                $('.kc label').text(stock);
                $('.btn').removeClass('error').html('提交订单');
                this.stock_default = stock * 1;
            } else {
                if (me.exchange) {
                    me.cardExchange();
                } else {
                    $('.quantity-wrapper').removeClass('disable');
                    $('.quantity').removeAttr('disabled', 'disabled').val('1');
                }
                $('.kc label').text(stock);
                $('.btn').removeClass('error').html('提交订单');
                this.stock_default = stock * 1;
            }

            if (this.exchange) {
                $('.yp label').text('0');
            } else {
                $('.yp label').text(parseFloat(price / 100 || 0));
            }
        },
        check: function() { 
            var me = this,
                $phone = $('.phone'),
                $address = $('.address'),
                $realName = $('.realName');
                me.phone = $.trim($phone.val().toLowerCase().replace(/undefined/g, '').replace(/null/g, ''));
                me.address = $.trim($address.val().toLowerCase().replace(/undefined/g, '').replace(/null/g, ''));
                me.realName = $.trim($realName.val().toLowerCase().replace(/undefined/g, '').replace(/null/g, ''));
                $phone.val(me.phone);
                $address.val(me.address);
                $realName.val(me.realName);

            if(me.address.length < 5){
                showTips('请填写你的详细地址！');
                return false;
            } else if (me.realName.length > 50 || me.realName.length == 0) {
                showTips('请填写你的姓名!');
                return false;
            } else if (!/^\d{11}$/.test(me.phone)) {
                showTips('请填写正确手机号!');
                return false;
            }
            return true;
        },
        minus: function() {
            if ($('.quantity-wrapper').hasClass('disable')) return;
            var a = parseInt($("#number").val()), c = parseInt($(".kc label").html());
            if (c == 1) {
                $('.quantity-decrease').addClass('no');
                return;
            }
            if (a <= 1) {
                $("#number").val(1);
                $('.quantity-increase').removeClass('no');
                $('.quantity-decrease').addClass('no');
            } else {
                a--;
                $("#number").val(a);
                $('.quantity-increase, .quantity-decrease').removeClass('no');
            }
        },
        plus: function() {
            if ($('.quantity-wrapper').hasClass('disable')) return;
            var a = parseInt($("#number").val()), c = parseInt($(".kc label").html());
            if (c == a) {
                $('.quantity-increase').addClass('no');
                return;
            }
            if (a > c) {
                $("#number").val(1);
                $('.quantity-increase').removeClass('no');
                $('.quantity-decrease').addClass('no');
            } else {
                a++;
                $("#number").val(a);
                $('.quantity-increase, .quantity-decrease').removeClass('no');
            }
        }
    };

    W.callbackShopMallItemDetail = function(data) {
        var me = H.detail;
        if (data.code == 0) {
            me.fillGoodDetail(data);
        } else {
            toUrl('shop.html?' + me.ref);
        }
    };

    W.callbackUserInfoHandler = function(data) {
        var me = H.detail;
        if (data.result) {
            if (data.ph) {
                me.phone = data.ph.toLowerCase().replace(/undefined/g, '').replace(/null/g, '');
                $('.phone').val(me.phone);
            }
            if (me.address) {
                me.address = data.ad.toLowerCase().replace(/undefined/g, '').replace(/null/g, '');
                $('.address').val(me.address);
            }
            if (me.realName) {
                me.realName = data.rn.toLowerCase().replace(/undefined/g, '').replace(/null/g, '');
                $('.realName').val(me.realName);
            }
        }
    };

    W.callbackShopMallOrderSubmitOrder = function(data) {
        var me = H.detail;
        if (data.code == 0) {
            location.href = data.redirectUrl;
        } else {
            hidenewLoading();
            showTips('很抱歉，购买失败了！<br>刷新下页面试试');
            // $('.btn-pay, .good-wrapper').removeClass('none');
            // $('.userinfo-wrapper').addClass('none');
            $('.btn-submit').removeClass('flag');
        }
    };

    W.callbackShopMallOrderExchangeOrder = function(data) {
        var me = H.detail;
        if (data.code == 0) {
            toUrl('card.html?duiback=ok');
        } else {
            hidenewLoading();
            showTips('很抱歉，兑换失败了！<br>重新提交试试');
            // $('.btn-pay, .good-wrapper').removeClass('none');
            // $('.userinfo-wrapper').addClass('none');
            $('.btn-exchange').removeClass('flag');
        }
    };
})(Zepto);

$(function() {
    H.detail.init();
});