; (function ($) {

    H.index = {
        initParam: function () {
            this.rule = $("#rule");
            this.dialog_close = $(".dialog-close");
            this.look_rule =$(".look_rule");
        },
        initEvent: function () {
            var that = this;
            this.dialog_close.click(function () {
                that.rule.find(".dialog-main").addClass("go").removeClass("out");
                setTimeout(function(){
                    that.rule.addClass("none");
                },500)
            });
            this.look_rule.click(function(){
                  that.rule.removeClass("none");
                  that.rule.find(".dialog-main").addClass("out").removeClass("go");
            });
        },
        init: function () {
            this.initParam();
            this.initEvent();
        }
    };
    H.index.init();
})(Zepto);