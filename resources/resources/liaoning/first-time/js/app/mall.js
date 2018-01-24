(function($){
    H.mall = {
        page: 1,
        pageSize: 5,
        loadmore: true,
        init: function(){
            var me = this;
            this.event();
            this.getList();
        },
        //查询热门商品列表
        getList: function(){
            var me = H.mall;
            getResult('api/mall/item/hotlist', {
                page: me.page,
                pageSize : me.pageSize
            }, 'callbackStationMallHotList', true);
            me.page ++;
        },
        event: function(){
            var me = H.mall;
            $('.back-btn').click(function(e){
                e.preventDefault();
                toUrl('user.html');
            });
            var range = 180, //距下边界长度/单位px
                maxpage = 100, //设置加载最多次数
                totalheight = 0;
            $(window).scroll(function(){
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                if (($(document).height() - range) <= totalheight  && me.page < maxpage && me.loadmore) {
                    if (!$('#mallSpinner').hasClass('none')) {
                        console.log(!$('.mallSpinner').hasClass('none'));
                        return;
                    }
                    $('#mallSpinner').removeClass('none');
                    me.getList();
                }
            });
        }
    };
    W.callbackStationMallHotList = function(data) {
        var me = H.mall;
        $('#mallSpinner').addClass('none');
        if (data.code == 0) {
            var items = data.items || [],
                len = items.length,
                t = simpleTpl();

            if (len < me.pageSize) {
                me.loadmore = false;
            }

            for (var i = 0; i < len; i ++) {
                var url = 'gift_detail.html?uid='+ items[i].uid;
                t._('<li>')
                    ._('<a href="'+ url +'" data-collect="true" data-collect-flag="first-time-main-mall" data-collect-desc="积分商城 '+ items[i].n +'">')
                        ._('<img src="'+ items[i].is +'" />')
                            ._('<div class="right">')
                                ._(items[i].n?'<h2>'+ items[i].n +'</h2>':'')
                                ._('<p>兑换积分：'+ items[i].ip + '<span class="price">￥' + (Math.round((items[i].mp || 0)) / 100) + '</span></p>')
                            ._('</div>')
                    ._('</a>')
                ._('</li>');
            }
            $('#list').append(t.toString());
        } else {
            me.loadmore = false;
            return;
        }

    };
})(Zepto);

$(function() {
    H.mall.init();
});