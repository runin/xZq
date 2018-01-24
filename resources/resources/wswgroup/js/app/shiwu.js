(function ($) {

    H.shiwu = {
        $wrapper: $('.shiwu-1-wrapper'),
        $mobile: $("#input-mobile"),

        init: function () {
            this.bindBtns();
            this.resize();
        },

        show: function (data) {

            var data = JSON.parse(data);

            /*if(H.shiwu.$wrapper.find('.hongbao-title').length > 0){
             var htmlTpl = H.shiwu.$wrapper.find('.hongbao-title').html();
             H.shiwu.$wrapper.find('.hongbao-title').html(htmlTpl.replace("%XXXXX%", data.pn));
             }*/

            H.shiwu.$wrapper.find('.hongbao-shiwu-img').attr('src', data.pi);
            H.shiwu.fillUserInfo(data);
            H.shiwu.$wrapper.parent().removeClass('none');
            H.shiwu.$wrapper.addClass("fadeIn");
        },

        fillUserInfo: function (data) {
            //H.shiwu.$wrapper.find('input.rn').val(data.rn ? data.rn : '');
            H.shiwu.$mobile.val(data.ph ? data.ph : '');
            //H.shiwu.$wrapper.find('input.ad').val(data.ad ? data.ad : '');
        },

        bindBtns: function () {
            H.shiwu.$wrapper.find('.hongbao-close').click(function () {
                H.event.handle(H.shiwu.$wrapper.attr('onShiwuClose'));
                H.shiwu.$wrapper.parent().addClass('none');
            });

            H.shiwu.$wrapper.find('.hongbao-click').click(function () {
                var realname = "";
                var phone = "";
                var address = "";

                /*var $realname = H.shiwu.$wrapper.find('.hongbao-input-wrapper.rn');
                 var $phone = H.shiwu.$wrapper.find('.hongbao-input-wrapper.ph');
                 var $address = H.shiwu.$wrapper.find('.hongbao-input-wrapper.ad');*/

                //if (!$phone.hasClass('none')) {
                phone = $.trim(H.shiwu.$mobile.val());
                if (!phone) {
                    alert("电话号码不能为空");
                    return;
                } else if (!/^\d{11}$/.test(phone)) {
                    alert('电话号码格式错误');
                    return;
                }
                //}

                //if (!$realname.hasClass('none')) {
                //    realname = $.trim($realname.find('input').val());
                //    if (realname.length <= 0) {
                //        alert('请填写姓名');
                //        return;
                //    }
                //}
                //
                //if (!$address.hasClass('none')) {
                //    address = $.trim($address.find('input').val());
                //    if (address.length <= 0) {
                //        alert('请填写地址');
                //        return;
                //    }
                //}

                getResult('api/lottery/award', {
                    oi: openid,
                    nn: nickname ? encodeURIComponent(nickname) : "",
                    hi: headimgurl ? headimgurl : "",
                    rn: realname ? encodeURIComponent(realname) : "",
                    ph: phone ? phone : "",
                    ad: address ? address : ""
                }, 'callbackLotteryAwardHandler');
            });
        },

        resize: function () {

            var title = H.shiwu.$wrapper.find('.hongbao-title');
            H.resize.attr(title, ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom', 'line-height']);

            var shiwu = H.shiwu.$wrapper.find('.hongbao-shiwu');
            H.resize.attr(shiwu, ['height']);

            var hongbaoInput = H.shiwu.$wrapper.find('.hongbao-input');
            H.resize.attr(hongbaoInput, ['padding-top']);

            var inputWrapper = H.shiwu.$wrapper.find('.hongbao-input-wrapper');
            H.resize.attr(inputWrapper, ['margin-bottom']);

            var inputLabel = H.shiwu.$wrapper.find('.hongbao-input-wrapper label');
            H.resize.attr(inputLabel, ['line-height', 'height']);

            var input = H.shiwu.$wrapper.find('.hongbao-input-wrapper input');
            H.resize.attr(input, ['line-height', 'height']);
        }

    };

    W.callbackLotteryAwardHandler = function (data) {
        if (data.result) {
            H.event.handle(H.shiwu.$wrapper.attr('onShiwuOk'));
            H.shiwu.$wrapper.parent().addClass('none');
            showTips("领取成功！", 2, 1500);
        }

    }

    H.shiwu.init();

})(Zepto);
