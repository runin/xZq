(function($) {
    H.my = {
        init: function() {
            this.event();
            this.orderMyrecordPort();
            setInterval(function(){
                H.my.orderMyrecordPort();
            }, 10e3);
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
            getResult('api/mall/order/myrecord', {
                openid: openid,
                page: 1,
                pageSize: 100
            }, 'callbackMallOrderMyRecord');
        },
        fillOrderDetail: function(data) {
            var t = simpleTpl(), items = data.items || [], length = items.length, status = '';
            for (var i = 0; i < length; i++) {
                if (items[i].st) {
                    if (items[i].st == 4) status = ' get';
                    if (items[i].st == 3) status = ' noget';
                }
                t._('<section class="list' + status + '" data-uid="' + items[i].uid + '">')
                    ._('<img src="' + items[i].ii + '">')
                    ._('<section class="detail">')
                        ._('<p>' + items[i].n + '</p>')
                        ._('<p>消耗积分：' + items[i].ip + '</p>')
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
        hidenewLoading();
    };
})(Zepto);

$(function() {
    H.my.init();
});