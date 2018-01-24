+(function ($) {
    var index = {
        initParam: function () {
            this.gobtn = $(".gobtn");
        },
        initEvent: function () {
            this.gobtn.click(function () {
                window.location.href = "comment.html";
            });
        },
        init: function () {
            this.initParam();
            this.initEvent();
        }
    };
    index.init();
})(Zepto);