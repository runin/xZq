(function ($) {

    H.index = {
        $myPrize: $("#my_prize"),
        init: function () {
            this.initRedpackGet();
            this.initEvent();
        },

        initRedpackGet: function () {
            var money_rp = getQueryString("rp");
            if (money_rp && money_rp == 1) {
                showTips("领取成功！", 2, 1500);
            }
        },

        initEvent: function () {
            this.$myPrize.click(function () {
                location.href = "./prize.html";
            });
        }
    };

    W.callbackXxxxXxx = function (data) {
    };

    H.index.init();

})(Zepto);