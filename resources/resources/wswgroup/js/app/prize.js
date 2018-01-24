(function ($) {

    H.prize = {
        $headImg: $("#head-img"),
        $nickname: $("#nickname"),
        $prizeContent: $("#prize-content"),
        init: function () {
            this.initData();
        },

        initData: function () {
            showLoading();
            getResult("api/lottery/record", {oi: openid, pt: 1}, "W.callbackLotteryRecordHandler");

            headimgurl && H.prize.$headImg.attr("src", headimgurl);
            H.prize.$nickname.text(nickname || '匿名用户');
        },

        getFormatDate: function (date) {
            if (date && date.length > 16) {
                return date.substr(0, 16);
            } else {
                return date;
            }
        }
    };

    W.callbackLotteryRecordHandler = function (data) {
        hideLoading();
        //alert(JSON.stringify(data));
        if (data && data.result) {
            if (data.rl.length > 0) {
                var prizeHtml = '';
                $(data.rl).each(function (i, item) {
                    prizeHtml += '<section style="position: relative;padding-left: 10px;"><img src="./images/gift-min.png" style="width: 45px;height: 45px;"/><span style="color: #feab24;font-size: 20px;position: absolute;top: 10px;left: 65px;">' + H.prize.getFormatDate(item.lt) + '</span><section style="border-left: 5px solid #feab24;width: 100%;height: 80px;margin-left: 20px;margin-top: -5px;margin-bottom: -5px;padding-left: 30px;"><section style="background-color: white;height: 70px;border-radius: 5px 0 0 5px;color:#ff3f01; "><p style="height: 34px;line-height: 34px;padding-left: 10px;padding-right: 40px;font-size: 14px;">您在中外名人答谢会中获得一份礼品</p><p style="height: 1px;border-bottom: 1px solid #ff3f00;margin-left: 10px;margin-right:40px;"></p><p style="height: 34px;line-height: 34px;padding-left: 10px;padding-right: 40px;font-size: 14px;">奖品名称：' + item.pn + '</p></section></section></section>';
                });
                H.prize.$prizeContent.empty().html(prizeHtml);
            }
        }
    };

    H.prize.init();

})(Zepto);