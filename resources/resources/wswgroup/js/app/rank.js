
(function ($) {



    H.rank = {
        $rankContent: $("#rank-content"),
        timeOffset: 0,
        roundData: null,
        lotteryUuid: '',

        init: function () {
            showLoading();
            getResult('api/lottery/round', {}, 'W.callbackLotteryRoundHandler');
        },

        getCurrentRound: function () {
            var now = new Date().getTime() + this.timeOffset;
            for (var i in this.roundData) {
                var et = this.roundData[i].pd + ' ' + this.roundData[i].et;
                if (now < timestamp(et)) {
                    return i;
                }
            }
            return -1;
        },

        queryLotteryCount: function () {
            if (H.rank.lotteryUuid) {
                getResult('api/lottery/lotteryCountRank', {lu: H.rank.lotteryUuid, rn: 10}, 'W.callbackLotteryCountRankHandler');
            }
        }
    };

    W.callbackLotteryRoundHandler = function (data) {
        hideLoading();
        if (data.result == true) {
            var now = new Date();
            H.rank.timeOffset = data.sctm - now.getTime();
            H.rank.roundData = data.la;
            if (H.rank.roundData && H.rank.roundData.length > 0) {
                H.rank.lotteryUuid = H.rank.roundData[H.rank.roundData.length - 1].ud;
            }
            //alert(H.rank.lotteryUuid);
            H.rank.queryLotteryCount();
            setInterval(function () {
                H.rank.queryLotteryCount();
            }, 2000);
        }
    };

    W.callbackLotteryCountRankHandler = function (data) {
        if (data && data.result) {
            if (data.lr.length > 0) {
                var rankHtml = '';
                $(data.lr).each(function (i, item) {
                    rankHtml += '<tr style="border-bottom: 1px solid white;"><td style="padding: 10px;text-align:left;"><section style="position: relative;margin: 0 auto;display: inline-block;width: 20em;"><section style="background-color: white;width: 50px;height: 50px;padding: 2px;border-radius: 100%;"><img onerror="this.src=\'./images/avatar.jpg\'" src="' + item.hi + '" style="width: 46px;height: 46px;border-radius: 100%;"/></section><span style="position: absolute;left: 60px;top: 9px;font-size:24px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width:100%;display:block;">' + (item.nn || '匿名用户') + '</span></section></td><td style="padding: 10px;line-height: 50px;font-size:24px;">' + item.lc + '</td><td style="padding: 10px;line-height: 50px;font-size:24px;">' + item.ri + '</td></tr>';
            
                });
                H.rank.$rankContent.empty().html(rankHtml);
            }
        }
    };

    H.rank.init();

})(Zepto);