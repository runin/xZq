(function($) {
    H.my = {
        init: function() {
            this.event();
            this.orderMyrecordPort();
            shownewLoading(null, '查询中...');
        },
        event: function() {
            var me = this;
            $('.btn-back').tap(function(e) {
                e.preventDefault();
                toUrl('vote.html');
            });
        },
        orderMyrecordPort: function() {
            var me = this;
            getResult('api/lottery/record', {
                oi: openid,
                pn: 1,
                ps: 100
            }, 'callbackLotteryRecordHandler');
        },
        fillOrderDetail: function(data) {
            var t = simpleTpl(), rl = data.rl || [], length = rl.length, status = '';
            for (var i = 0; i < length; i++) {
                if (rl[i].su == 3 || rl[i].su == 4) {
                    if (rl[i].su == 4) status = ' get';
                    if (rl[i].su == 3) status = ' noget';
                    t._('<section class="list' + status + '" data-uid="' + rl[i].ru + '">')
                        ._('<p style="background:url(' + rl[i].pi + ') no-repeat;background-size:cover;"></p>')
                        ._('<section class="detail">')
                            ._('<h1>您在新闻夜总汇节目中赢得超值大礼包</h1>')
                            ._('<p>中奖时间：' + rl[i].lt + '</p>')
                            ._('<i></i>')
                        ._('</section>')
                    ._('</section>')
                }
            };
            $('#J_myRecord').html(t.toString());
        }
    };

    W.callbackLotteryRecordHandler = function(data) {
        var me = H.my;
        if (data.result) me.fillOrderDetail(data);
        hidenewLoading();
    };
})(Zepto);

$(function() {
    H.my.init();
});