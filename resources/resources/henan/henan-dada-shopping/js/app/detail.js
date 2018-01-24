(function($){
    H.detail = {
        uuid: getQueryString("uid"),
        $copyright_gift: $('#copyright_gift'),
        $btn_exchangenow: $('.btn-exchangenow'),
        $ctrl: $("#ctrl"),
        $amount: $('#amount'),
        clickZhuHuan: true ,
        url: null,
        init: function(){
            this.event();
            this.detailitem();
        },
        event: function(){
            var me = H.detail;
            $('#toUrl').click(function(e) {
                e.preventDefault();
                location.href = me.url;
            });

            $('#btn-buy').click(function(e) {
                e.preventDefault();

                var thisBth = $(this);
                if(thisBth.hasClass("toUrl")){
                    return;
                }

                if(location.href.indexOf("link") != -1){
                    thisBth.addClass("toUrl");

                    $.ajax({
                        type: 'GET',
                        async: false,
                        url: domain_url + 'api/mall/order/pay' + dev,
                        data: {
                            openid: openid,
                            phone: '12345678900',
                            buyCount: 1,
                            itemUuid: me.uuid
                        },
                        dataType: "jsonp",
                        jsonpCallback: 'callbackMallApiPay',
                        timeout: 10000,
                        complete: function() {},
                        success: function(data) {
                            thisBth.addClass("none");
                            $("#toUrl").removeClass("none");
                        },
                        error: function(xmlHttpRequest, error) {
                        }
                    });
                    return;
                }

                me.$ctrl.addClass('block');
            });

            $('.btn-close').click(function(e) {
                $('.loader').addClass('none');
                e.preventDefault();

                me.$ctrl.removeClass('block');
            });
            $('.btn-plus').click(function() {
                var val = $.trim(me.$amount.val());
                if (!/^\d+$/.test(val)) {
                    return false;
                }
                me.$amount.val(++ val);
            });
            $('.btn-minus').click(function() {
                var val = $.trim(me.$amount.val());
                if (!/^\d+$/.test(val) || val <= 1) {
                    return false;
                }
                me.$amount.val(-- val);
            });
            me.$btn_exchangenow.click(function(e) {
                e.preventDefault();
                if(me.clickZhuHuan){
                    me.clickZhuHuan = false;
                }

                var amount = $.trim(me.$amount.val()),
                    name = $.trim($('#name').val()),
                    mobile = $.trim($('#mobile').val()),
                    address = $.trim($('.address').val());

                if (!/^\d+$/.test(amount) || amount < 1) {
                    showTips('请输入正确的数量');
                    return false;
                }else if (name.length > 20 || name.length == 0) {
                    showTips('请输入您的姓名，不要超过20字哦!');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('手机号码格式不正确');
                    return false;
                }else if (address.length < 5 || address.length > 60 || address.length == 0) {
                    showTips('地址长度为5~60个字符');
                    return false;
                }


                if (!confirm('手机号码是领奖的唯一凭证！\n您的手机号码是'+ mobile +'，确认兑换？')) {
                    return false;
                }

                $(this).hide();
                me.butt_loading();
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/mall/order/pay' + dev,
                    data: {
                        openid: openid,
                        phone: mobile,
                        name: encodeURIComponent(name),
                        address: encodeURIComponent(address),
                        buyCount: amount,
                        itemUuid: me.uuid
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackMallApiPay',
                    timeout: 10000,
                    complete: function() {},
                    success: function(data) {
                        if (data.code == 0) {
                            showTips('恭喜您，兑换成功！');
                            toUrl("record.html");
                            return;
                        }else{
                            me.$copyright_gift.addClass('none');
                            me.$btn_exchangenow.show();
                            showTips(data.message);
                        }
                    },
                    error: function(xmlHttpRequest, error) {
                    }
                });
            });
        },
        //获取单个商品详情
        detailitem: function(){
            getResult('api/mall/item/detailitem', {uuid: H.detail.uuid}, 'callbackStationMallDetail', true);
        },
        butt_loading: function(){
            var me = H.detail, t = simpleTpl();
            t._(' <div class="loader">')
                ._('<span></span>')
                ._('<span></span>')
                ._('<span></span>')
                ._('<span></span>')
                ._('<span></span>')
                ._('</div>');
            me.$copyright_gift.html(t.toString());
        },
        swiper: function(){
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplay: 5000//可选选项，自动滑动
            });
        },
        spellDom: function(imgs){
            var t = simpleTpl();
            $.each(imgs, function(i, img){
                t._('<div class="swiper-slide"><img src="'+ img +'"></div>');
            });
            $(".swiper-wrapper").append(t.toString());
            this.swiper();
        }
    };
    W.callbackStationMallDetail = function(data){
        var me = H.detail;
        if(data.code == 0){
            me.spellDom(data.param.split(","));
            $("#shop-name").text(data.n);
            $("#value").text(data.ip || 0);
            $(".content").html(data.d);
            me.url = data.tip;
        }
    };
})(Zepto);

$(function(){
    H.detail.init();
});