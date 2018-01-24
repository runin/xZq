(function($){
    H.index = {
        request_cls: 'requesting',
        from: getQueryString('from'),
        init: function(){
            this.list();
            this.event();
            this.resize();
        },
        event: function(){
            var me = this;
            $('#btn-go2index').click(function(e) {
                e.preventDefault();
                toUrl('index.html');
            });
        },
        resize: function() {
            var winW = $(window).width(),
                winH = $(window).height();
            $('body').css({
                'width': winW,
                'height': winH
            });
        },
        list: function(){
            getResult('api/lottery/record', {oi: openid}, 'callbackUserPrizeHandler', true);
        }
    };

    W.callbackLotteryRecordHandler = function(data){
        if (data.result) {
            var t = simpleTpl(),
                items = data.rl || [],
                len = items.length;
            for (var i = 0; i < len; i ++) {
                var priceType = typeof(items[i].cc) == 'undefined' ? 'good' : 'quan';
                t._('<li class=' + priceType + '>')
                    ._('<div class="gift-content">')
                        if (items[i].pt == 5 && (items[i].cc).indexOf(',') >= 0) {
                            flag = ' code'
                        } else {
                            flag = ""
                        }
                        t._('<div class="gift-name' + flag + '">')
                            ._('<img src="./images/icon-content-' + priceType + '.png">')
                            ._('<p>' + items[i].pn + '</p>')
                            ._('<p class="pwd">密码: ' + ( typeof(items[i].cc) == "undefined" ? "" : items[i].cc.split(',')[1] ) + '</p>')
                            ._('<i></i>')
                        ._('</div>')
                    ._('</div>')
                    ._('<div class="gift-code">')
                        if (items[i].cc) {
                            if ((items[i].cc).indexOf(',') < 0) {
                                t._('<p>兑换码: ' + ( typeof(items[i].cc) == "undefined" ? "" : items[i].cc ) + '</p>')
                            } else {
                                t._('<p>兑换码: ' + ( typeof(items[i].cc) == "undefined" ? "" : items[i].cc.split(',')[0] ) + '</p>')
                            }
                        }
                    t._('</div>')
                ._('</li>')
            };
            $('.gift-box ul').append(t.toString()).removeClass('none');
        } else {
            $(".gift-box").html('<p class="empty">亲，您暂时没有奖品哦~</P>');
            return;
        };
    };
})(Zepto);

$(function(){
    H.index.init();
});