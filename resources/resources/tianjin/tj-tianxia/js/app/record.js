(function($){
    H.index = {
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
                var c_cls = 'none',p_cls = 'none';
                var licls = (i+1)%2 == 0 ? "":"gift-content-blue";
                t._('<li class="quan">')
                    ._('<div class="gift-content '+licls+'">')
                        if (items[i].pt == 5) {
                            if(items[i].cc.split(',')[0]){
                                c_cls = '';
                            }
                            if(items[i].cc.split(',')[1]){
                                p_cls = '';
                            }
                        }
                        t._('<div class="gift-name code">')
                            ._('<img src="./images/icon-content-quan.png">')
                            ._('<p>' + items[i].pn + '</p>')
                            ._('<p class="pwd '+c_cls+'">兑换码: <label>' + items[i].cc.split(',')[0] + '</label></p>')
                            ._('<p class="pwd '+p_cls+'">密&nbsp;&nbsp;码: <label>' + items[i].cc.split(',')[1]  + '</label></p>')
                            ._('<i></i>')
                        ._('</div>')
                    ._('</div>')
                    ._('<div class="gift-code">')
                    ._('<p>中奖日期：'+items[i].lt.split(" ")[0]+'</p>')
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