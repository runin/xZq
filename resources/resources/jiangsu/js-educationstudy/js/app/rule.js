(function ($) {
    H.rule = {
        isLoaded: false,
        $dialog: $('#rule').parent(),

        init: function () {
  
            this.bindBtns();
        },
        bindBtns: function () {

        },
        fillRule: function (data) {
            H.rule.$dialog.find('.dialog-content').html(data.rule);
        },
        ruleError: function () {
            // alert('网络错误，请稍后重试');
            // H.rule.$dialog.addClass('none');
        },
        show: function () {

            $('.rule-wrapper').parent().removeClass('none');
            if (!this.isLoaded) {
                showLoading();
                getResult('api/common/rule', null, 'commonApiRuleHandler');
            }
        }
    };
    W.commonApiRuleHandler = function (data) {
        hideLoading();
        if (data.code == 0) {
            H.rule.fillRule(data);
        } else {
            H.rule.ruleError();
        }
    };
    H.rule.init();
    H.rule.show();
})(Zepto);