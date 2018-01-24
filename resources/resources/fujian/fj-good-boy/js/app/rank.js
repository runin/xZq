/**
 * 加油好少年--排行榜
 */
(function($) {
    H.rank = {
        $ul: $('ul'),
        page: 1,
        pageSize: 10,
        total: 0,
        loadmore : true,
        init: function() {
            getList(true);
            this.event_handler();
        },

        event_handler: function() {
            $('.btn-loadmore').click(function(e) {
                e.preventDefault();

                var loadCls = 'loading';
                if ($(this).hasClass(loadCls)) {
                    return;
                }
                $(this).addClass(loadCls);
                H.rank.page ++;
                getList();
            });
        },

        add_items: function(data) {
            var items = data.items || [],
                len = items.length,
                t = simpleTpl();

            this.total = data.ac;
            for (var i = 0; i < len; i++) {
                t._('<li data-guid="'+ items[i].au +'">')
                    ._('<div></div>')
                    ._('<div><img src="'+ items[i].ai +'"></div>')
                    ._('<div><p>'+ (items[i].an || '') +'</p><p>'+ items[i].vn +'票</p></div>')
                 ._('</li>')
            }
            this.$ul.append(t.toString());
        }
    };

    W.getList = function(showloading) {
        getResult('vote/rankthis', {
            actUuid: $.fn.cookie("puid-"+ openid),
            page: H.rank.page,
            pageSize: H.rank.pageSize
        }, 'rankthisHandler', true);
    };

    W.rankthisHandler = function(data) {
        if (data.code != 0) {
            return;
        }
        var callbackHumorRePage = data;

        $('.btn-loadmore').removeClass('loading');

        var $loadmore = $('.btn-loadmore');

        if (data.items.length < H.rank.pageSize) {
            $loadmore.addClass('none');
        } else {
            $loadmore.removeClass('none');
        }
        H.rank.add_items(callbackHumorRePage);
    };

})(Zepto);
$(function(){
    H.rank.init();
});