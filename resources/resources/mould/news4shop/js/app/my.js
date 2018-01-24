(function($) {
    H.my = {
        init: function() {
            this.event();
            this.orderMyrecordPort();
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
            getResult('api/mall/order/myrecord', {
                opened: openid,
                page: 1,
                pageSize: 50
            }, 'callbackMallOrderMyRecord');
        },
        fillOrderDetail: function(data) {
            var t = simpleTpl(), items = data.items || [], length = items.length;
            for (var i = 0; i < length; i++) {
                t._('<section class="list" data-uid="' + items[i].uid + '">')
                    ._('<img src="' + items[i].ii + '">')
                    ._('<section class="detail">')
                        ._('<p>' + items[i].n + '</p>')
                        ._('<p>消耗金币：' + items[i].ip + '</p>')
                    ._('</section>')
                    ._('<i>' + items[i].at.split(' ')[0] + '</i>')
                ._('</section>')
            };
            $('#J_myRecord').html(t.toString());
        }
    };

    W.callbackMallOrderMyRecord = function(data) {
        var me = H.my;
        if (data.code == 0) me.fillOrderDetail(data);
    };
})(Zepto);

$(function() {
    H.my.init();
});