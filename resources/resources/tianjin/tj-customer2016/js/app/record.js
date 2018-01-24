(function($){
    H.record = {
        request_cls: 'requesting',
        init: function(){
            var me = this;
            $('header .avatar').attr('src', (headimgurl ? (headimgurl + '/' + yao_avatar_size) : './images/avatar.png'));
            $('header .nikename').text(nickname ? nickname : '匿名用户');
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
                    ._('<div class="gift-time">' + items[i].lt.split(" ")[0] + '</div>')
                    ._('<div class="gift-content">')
                        ._('<p class="gift-name">奖品名称: ' + items[i].pn + '</p>')
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
                    t._('</div>')
                ._('</li>')
            };
            $('.content ul').append(t.toString());
        },
        event: function(){
            var me = this;
            $('#btn-go2index').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                $(this).addClass(me.request_cls);
                toUrl('index.html');
            });
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