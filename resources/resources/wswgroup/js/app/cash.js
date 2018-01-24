(function ($) {

    H.cash = {
        $wrapper: $('.cash-1-wrapper'),

        init: function () {
            this.bindBtns();
            this.resize();
        },

        show: function (data) {
            var data = JSON.parse(data);

            H.cash.$wrapper.find('.hongbao-cash-img').attr('src', data.pi);
            //H.cash.$wrapper.find('.hongbao-cash-value').html(data.pv / 100 + '.00');
            H.cash.$wrapper.find('.hongbao-btn').attr('href', data.rp);
            H.cash.$wrapper.parent().removeClass('none');
            H.cash.$wrapper.addClass("fadeIn");
        },

        bindBtns: function () {
            H.cash.$wrapper.find('.hongbao-close').click(function () {
                H.event.handle(H.cash.$wrapper.attr('onCashClose'));
                H.cash.$wrapper.parent().addClass('none');
            });

            H.cash.$wrapper.find('.hongbao-btn').click(function () {
                H.event.handle(H.cash.$wrapper.attr('onCashOk'));
                H.cash.$wrapper.parent().addClass('none');
            });
        },

        resize: function () {
            var title = H.cash.$wrapper.find('.hongbao-title');
            var paddingTop = parseInt(title.css('padding-top'), 10) / H.resize.heightRatio;
            var paddingBottom = parseInt(title.css('padding-bottom'), 10) / H.resize.heightRatio;
            var marginTop = parseInt(title.css('margin-top'), 10) / H.resize.heightRatio;
            var marginBottom = parseInt(title.css('margin-bottom'), 10) / H.resize.heightRatio;
            title.css({
                'padding-top': paddingTop,
                'padding-bottom': paddingBottom,
                'margin-top': marginTop,
                'margin-bottom': marginBottom
            });
        }

    };

    H.cash.init();

})(Zepto);
