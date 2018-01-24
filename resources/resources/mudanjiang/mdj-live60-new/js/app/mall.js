(function($){
    H.mall = {
        page: 1,
        pageSize: 6,
        loadmore: true,
        init: function(){
            var me = this;
            this.event();
            this.self();
            this.getList();
        },
        //查询用户信息
        self: function(){
            getResult('api/lottery/integral/rank/self', {oi: openid}, 'callbackIntegralRankSelfRoundHandler', true);
        },
        selfupdate: function(data) {
            $('header').find('img').attr('src', headimgurl ? (headimgurl + '/' + 64) : './images/avatar.jpg');
            $('.nickname').text(nickname ? nickname : '匿名用户');
            $('.sum-jf').find('span').text(data.in || 0);
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
            var me = H.mall,
                $gift_nav = $('.gift-nav');
            $('div').click(function(e) {
                e.preventDefault();

                $(this).siblings('div').removeClass('active');
                $(this).addClass('active');
                if($(this).index() == 1){
                    $gift_nav.removeClass('none');
                    $('#jb').addClass('none');
                    $('#gift').removeClass('none');
                    if($('#gift-timeline-jf').hasClass('none')){
                        H.gift.getList();
                    }
                }else{
                    $gift_nav.addClass('none');
                    $('#gift').addClass('none');
                    $('#jb').removeClass('none');

                }
            });
            $('.back-btn').click(function(e){
                e.preventDefault();

                window.location.href = "index.html";
            });
            var range = 180, //距下边界长度/单位px
                maxpage = 100, //设置加载最多次数
                totalheight = 0;
            $(window).scroll(function(){
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                if (($(document).height() - range) <= totalheight  && me.page < maxpage && me.loadmore) {
                    if(!$('#jb').hasClass('none')){
                        me.getList();
                        me.page ++;
                    }
                }
            });
        }
    };
    W.callbackIntegralRankSelfRoundHandler = function(data) {
        if (data.result) {
            H.mall.selfupdate(data);
        }
    };
    W.callbackStationMallHotList = function(data) {
        var me = H.mall;
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
                    ._('<a href="'+ url +'" data-collect="true" data-collect-flag="mdj-live60-mall" data-collect-desc="积分商城 '+ items[i].n +'">')
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