(function($) {
    H.record = {
        uuid: null,
        $container: $(".container").find("ul"),
        init: function() {
            this.event();
            this.dataArticle();
        },
        dataArticle: function() {
            var dayTime = timeTransform(new Date().getTime()).split(" ")[0];
            getResult("api/lottery/record", { oi: openid, pt: "9", bd: dayTime }, "callbackLotteryRecordHandler", true);
        },
        fillDom: function(items) {
            var t = simpleTpl();
            var me = this;
            if (items.length === 0) {
                showTips("暂时没有中奖纪录");
                return;
            }
            for (var i = 0; i < items.length; i++) {

                t._('<li>')
                    ._('<a href="' + items[i].rl + '" data-collect="true" data-collect-flag="record-present' + i + '" data-collect-desc="中奖纪录-外链-' + items[i].pn + '">')
                    ._('<i class="present-icon"></i>')
                    ._('<div class="present-box">')
                    ._('<p class="record-time">' + (items[i].lt.substring(0, 10)) + '</p>')
                    ._('<div class="record-content">')
                    ._('<p class="record-infor">您在互动中赢得' + items[i].pn + '</p>')
                    ._('<p class="record-state ' + ((items[i].su == 3) ? "get-present" : "un-get") + '">' + ((items[i].su == 3) ? "已领取" : "未领取") + '</p>')
                    ._('</div>')
                    ._('</div>')
                    ._('</li>')
            };
            me.$container.empty();
            me.$container.append(t.toString());
        },
        event: function() {

            $("#btn-back").on("touchend", function(e) {
                e.preventDefault();
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
                    shownewLoading();
                    toUrl('lottery.html');
                }
            })
        }
    };
    W.callbackLotteryRecordHandler = function(data) {
        if (data.result) {
            H.record.fillDom(data.rl);
        }
        else
        {
            $(".container").addClass("none");
            showTips("暂无中奖纪录");
        }
    }
    H.record.init();
})(Zepto);
