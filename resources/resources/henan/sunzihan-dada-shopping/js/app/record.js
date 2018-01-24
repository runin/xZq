;(function($) {
    H.record = {
        page: 1,
        pageSize: 10,
        time : 0,
        loadmore:  true,
        init: function() {
            this.event();
            this.getList();
        },
        event: function(){
            var me = H.record;

            var range = 180, //距下边界长度/单位px
                maxpage = 100, //设置加载最多次数
                totalheight = 0;

            $(window).scroll(function(){
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                if (($(document).height() - range) <= totalheight  && me.page < maxpage && me.loadmore) {
                    me.getList();
                    me.page ++;

                }
            });
            $(".back").click(function(e){
                e.preventDefault();
                toUrl("home.html");
            });
        },
        //查看订单(积分换礼)
        getList: function(){
            var me = H.record;
            getResult('api/mall/order/myrecord', {
                openid: openid,
                page: me.page,
                pageSize : me.pageSize
            }, 'callbackMallOrderMyRecord', true);
            me.page ++;
        }
    };

    W.callbackMallOrderMyRecord = function(data) {
        var me = H.record;
        if (data.code == 0) {
            var t = simpleTpl(),
                items = data.items || [],
                len = items.length,
                at = '';

            if (me.time == 0 && len == 0) {
                $(".empty").removeClass("none");
                return;
            } else if (len < me.pageSize) {
                me.loadmore = false;
            }
            for (var i = 0; i < len; i ++) {console.log(items[i].ip);
                at = items[i].at.split(" ")[0];
                at = at.replace('年','-');
                at = at.replace('月','-');
                at = at.replace('日','');
                t._('<li>')
                    ._('<div class="items">')
                        ._('<img src="'+ items[i].ii +'">')
                        ._('<label>'+ (items[i].n || "") +'</label>')
                        ._('<span>'+ items[i].ip +' 积分</span>')
                    ._('</div>')
                    ._('<div class="data">兑换时间：'+ (at || "") +'</div>')
                ._('</li>');
            }
            $('#gift-timeline').append(t.toString()).closest('.list').removeClass('none');
        } else {
            me.loadmore = false;
            $('.btn-loadmore').addClass('none');
            $(".empty").removeClass("none");
        }
    };

})(Zepto);

$(function() {
    H.record.init();
});
