(function ($) {

    H.wailian = {
        $wrapper: $('.wailian-wrapper'),

        init: function () {
            this.bindBtns();
            this.resize();
        },

        show: function (data) {

            var data = JSON.parse(data);

            if (data.tt) {
                H.wailian.$wrapper.find('.hongbao-text').html(data.tt);
            }
            H.wailian.$wrapper.find('.hongbao-wailian img').attr('src', data.pi);
            H.wailian.$wrapper.find('.hongbao-click').attr('data-href', data.ru);
            H.wailian.$wrapper.parent().removeClass('none');
        },

        bindBtns: function () {
            H.wailian.$wrapper.find('.hongbao-close').click(function () {
                H.event.handle(H.wailian.$wrapper.attr('onWailianClose'));
                H.wailian.$wrapper.parent().addClass('none');
            });

            H.wailian.$wrapper.find('.hongbao-click').click(function () {
                H.wailian.$wrapper.parent().addClass('none');
                showLoading();
                //				getResult('api/lottery/award', {
                //                    oi: openid,
                //                    hi: headimgurl,
                //                    nn: nickname
                //                }, 'callbackLotteryAwardHandler');

                //				setTimeout(function(){
                //					hideLoading();
                //					location.href = H.wailian.$wrapper.find('.hongbao-click').attr('data-href');
                //				}, 1500);

                loadData({ url: domain_url + 'api/lottery/award', callbackLotteryAwardHandler: function () {

                    hideLoading();
                    location.href = H.wailian.$wrapper.find('.hongbao-click').attr('data-href');
                }, data: {
                    oi: openid,
                    hi: headimgurl,
                    nn: nickname
                }
                });


            });
        },

        resize: function () {
            var title = H.wailian.$wrapper.find('.hongbao-title');
            H.resize.attr(title, ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom']);
        }

    };

    H.wailian.init();

})(Zepto);
