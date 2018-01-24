+(function ($) {
    var index = {
        initParam: function () {
            this.enter = $(".enter"); //进入图标
            this.rule = $(".rule"); //规则图标
            this.ruleDialog = $("#rule"); //rule对话框
            this.dialog_close = $(".dialog-close");
        },
        initEvent: function () {
            var that = this;
            this.enter.click(function () {
                window.location.href = "main.html";
            });
            this.dialog_close.click(function () {
                that.ruleDialog.find(".dialog-main").addClass("go").removeClass("out");
                setTimeout(function () {
                    that.ruleDialog.addClass("none");
                }, 500);
            });
            this.rule.click(function () {
                that.ruleDialog.removeClass("none");
                that.ruleDialog.find(".dialog-main").addClass("out").removeClass("go");
            });
        },
        init: function () {
            this.initParam();
            this.initEvent();
        }
    };
    index.init();
})(Zepto);