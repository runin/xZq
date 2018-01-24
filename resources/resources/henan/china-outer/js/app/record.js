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
                    ._('<div class="gift-content">');
                        if (items[i].pt == 1) {
                            t._('<img src="images/gift.png" />')

                        }else if(items[i].pt == 4){
                            t._('<img src="images/redpack.png" />')
                        }
                        t._('<p class="gift-name">' + items[i].pn + '</p>')
                    ._('</div>')
                    ._('<div class="gift-detail">')
                        ._('<img src="images/award-bg.png" />')
                        ._('<label class="detail">' + items[i].pd + '</label>')
                    ._('</div>')
                ._('</li>')
            }
            $('.content ul').append(t.toString());
            H.record.broadEffect();

        },
        event: function(){
            var me = this;
            $(".head-img").attr("src", headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar.png');
            $(".nickname").text(nickname || "匿名用户");
            $('#btn-go2index').click(function(e) {
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('lottery.html');
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        broadEffect: function() {
            setTimeout(function(){
                $('ul li').each(function(index) {
                    var $this = $(this);
                    setTimeout(function(){
                        $this.addClass('animatedSelf infinite flipX');
                    }, 500*(index + 1));
                });
            }, 3000);
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