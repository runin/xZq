(function($){
    H.record = {
        request_cls: 'requesting',
        init: function(){
            var me = this;
            me.event();
            me.getRecord();
        },
        getRecord: function() {
            getResult('api/lottery/record', {oi: openid}, 'callbackLotteryRecordHandler', true);
        },
        fillRecord: function(data) {
            var t = simpleTpl(), items = data.rl || [], len = items.length;
            for (var i = 0; i < len; i ++) {
                t._('<li>')
                    ._('<div class="gift-icon"></div>')
                    ._('<div class="gift-time">' + items[i].lt + '</div>')
                    ._('<div class="gift-content">')
                        ._('<p class="gift-name">您在互动中赢得' + items[i].pn + '</p>')
                        if (items[i].cc) {
                            if (items[i].cc.split(',')[0]) {
                                t._('<p class="gift-code">兑换码: ' + items[i].cc.split(',')[0] + '</p>')
                            }
                            if (items[i].cc.split(',')[1]) {
                                t._('<p class="gift-password">密码: ' + items[i].cc.split(',')[1] + '</p>')
                            }
                        }
                        if (items[i].pt == 9 && items[i].rl && items[i].rl.length != 0) {
                            t._('<p class="gift-url"><a href="' + items[i].rl + '">领取地址</a></p>')
                        }
                        if (items[i].su == 3 ) {
                            t._('<span class="gift-status award">已领取</span>')
                        }else if (items[i].su == 2){
                        	t._('<span class="gift-status unaward">未领取</span>')
                        }
                    t._('</div>')
                ._('</li>')
            };
            $('.content ul').append(t.toString());
        },
        event: function(){
            var me = this;
            $('#btn-go2index').click(function(e) {
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('index.html');
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        }
    };

    W.callbackLotteryRecordHandler = function(data) {
        if (data.result) {
            H.record.fillRecord(data);
        } else {
            $(".content").empty().append('<p class="empty">亲，您暂时没有奖品哦~</P>');
            return;
        }
    };
})(Zepto);

$(function(){
    H.record.init();
});