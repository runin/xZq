(function ($) {

    H.index = {
        $body: $("body"),
        $header: $("header"),
        $content: $(".content"),
        $button: $(".button"),
        $guide: $('.guide-wrapper'),
        $rule: $('.rule-wrapper'),
        init: function () {
            H.index.resize();
            H.index.initTime();
            H.index.initGuide();
            H.index.initRule();
        },

        initTime: function () {

        },

        initGuide: function () {
            this.$guide.find('.button').click(function () {
                H.index.$guide.addClass('none');
            });
            this.$guide.find('.guide-close').click(function () {
                H.index.$guide.addClass('none');
            });
            var showKey = getQueryString('cb41faa22e731e9b');
            if (!showKey) {
                H.index.$guide.removeClass('none');
                H.index.$guide.find('.guide').addClass('fadeIn');
            }
        },

        initRule: function () {
            this.$content.find('#btn-rule').click(function () {
                H.index.$rule.removeClass('none');
                H.index.$rule.find('.rule').addClass('fadeIn');
            });
            this.$rule.find('.rule-close').click(function () {
                H.index.$rule.addClass('none');
            });
            showLoading();
            getResult("common/rule", {}, "W.callbackRuleHandler");
        },

        resize: function () {
            var w = $(W).width();
            var h = $(W).height();
            this.$body.css("background-size", w + "px " + h + "px");
            this.$header.css("top", h * 0.165);

            this.$content.css("width", w);
            this.$content.css("height", h / 4 + 10);
            this.$content.css("bottom", 0);
        }
    };

    W.callbackRuleHandler = function (data) {
        hideLoading();
        if (data.code == 0) {
            H.index.$rule.find('.text').html(data.rule);
        }
    };

    $(W).resize(function () {
        H.index.resize();
    });

    H.index.init();

})(Zepto);