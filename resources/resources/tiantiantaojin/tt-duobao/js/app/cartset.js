(function($) {
    H.cartSet = {
        $body: $("body"),
        $shopCart: $(".shop-cart"),
        finishFlag: true,
        imgFlag: true,
        init: function() {

            this.eventHander();
            getResult("cart/listCart", { oid: openid }, "callBackListShoppingCartHandler");

        },
        eventHander: function() {
            var me = this;
            me.$body.delegate(".btn-addCart", "click", function(e) {
                
                if (H.cartSet.finishFlag && H.cartSet.imgFlag) {
                    H.cartSet.finishFlag = false;
                    H.cartSet.imgFlag = false;
                } else {
                    return;
                }
                var $img = $(this).closest(".tt-goods").find("img");
                var uuid = $(this).closest(".tt-goods").attr("data-uuid")
                imgMove($img, me.$shopCart);
                var cartNum = me.$shopCart.find("b").text();

                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "callback",
                    url: business_url + "cart/add",
                    jsonpCallback: 'callBackAddCartItemHandler',
                    data: {
                        oid: openid,
                        pid: uuid,
                    },
                    complete: function() {
                        H.cartSet.finishFlag = true;
                    },
                    success: function(data) {
                        if (data.result == 1) {
                            me.$shopCart.find("b").text(Number(cartNum) + 1).removeAttr("style");
                        } else if (data.result == 2) {
                            return
                        } else {
                            showTips("啊哦，网络在开小差噢，稍后再试试吧~");
                            //showTips("啊哦，网络在开小差噢，稍后再试试吧~");
                        };
                        H.cartSet.finishFlag = true;
                    }
                })
            });
        },
    }
    W.callBackListShoppingCartHandler = function(data) {
        if (data.result == 0) {
            if (data.count) {
                H.cartSet.$shopCart.find("b").text(data.count).removeAttr("style");
            }
            H.cartSet.$shopCart.removeClass("none");
        } else {
            H.cartSet.$shopCart.removeClass("none");
            showTips("啊哦，网络在开小差噢，稍后再试试吧~");
        }
    }
    var imgMove = function(srcObj, shopCart) {
        img = $('<img width="' + srcObj.offset().width + '" src="' + srcObj.attr("src") + '" />');
        var t = 20;
        img.css({
            position: "absolute",
            top: srcObj.offset().top,
            left: srcObj.offset().left,
            "z-index": 3
        });
        $("body").append(img);
        var r = (img.offset().left - shopCart.offset().left - shopCart.offset().width / 2) / t,
            d = (img.offset().top - shopCart.offset().top - shopCart.offset().height / 2) / t,
            l = img.width() / t,
            c = img.height() / t;
        u && clearInterval(u);
        var u = setInterval(function() {
            img.offset().width > 0 ? img.css({
                top: img.offset().top - d,
                left: img.offset().left - r,
                width: img.offset().width - l,
                height: img.offset().height - c
            }) : (u && clearInterval(u),
                img.remove(),H.cartSet.imgFlag = true)
        }, t)

    };
    H.cartSet.init();
})(Zepto);
