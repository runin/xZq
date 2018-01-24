(function($){
    H.record = {
        page: 1,
        pageSize:10,
        loadmore : true,
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
            var maxpage = 100, totalheight = 0;
            $(".gift-box").scroll(function(){
                var srollPos = $(".gift-box").scrollTop();
                totalheight = parseFloat($(".ulcontent").height()) - parseFloat($(".gift-box").height()) - parseFloat(srollPos);
                if (totalheight <= 80 && H.record.page < maxpage && H.record.loadmore) {
                    H.record.list();
                }
            });
            $("body").delegate(".red-url","click",function(e){
                e.preventDefault();
                if(!$(this).hasClass("clicked")){
                    $(this).addClass("clicked");
                    var href = $(this).attr("data-href");
                    shownewLoading(null,"请稍后...");
                    setTimeout(function(){
                        location.href = href;
                    },500);
                }
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
            var me = this;
            getResult('api/lottery/record', {oi: openid,pn: me.page, ps: me.pageSize}, 'callbackLotteryRecordHandler', true);
        },
        tpl: function(data){
            var me = this,
                t = simpleTpl(),
                items = data.rl || [],
                len = items.length;
            for (var i = 0; i < len; i ++) {
                var licls = (i+1)%2 == 0 ? "":"gift-content-blue";
                var urlClass = "";
                t._('<li class="quan">')
                    ._('<div class="gift-content '+licls+'">')
                    ._('<div class="gift-name code">')
                    ._('<img src="./images/icon-content-quan.png">')
                    ._('<p>' + items[i].pn + '</p>');
                if (items[i].pt == 5 && items[i].cc) {
                    urlClass = "none";
                    if(items[i].cc.split(',')[0]){
                        t._('<p class="pwd">兑换码: <label>' + items[i].cc.split(',')[0] + '</label></p>');
                    }
                    if(items[i].cc.split(',')[1]){
                        t._('<p class="pwd">密&nbsp;&nbsp;码: <label>' + items[i].cc.split(',')[1]  + '</label></p>');
                    }
                }else if(items[i].pt != 9){
                    urlClass = "none";
                }
                t._('<i></i>')
                    ._('</div>')
                    ._('</div>')
                    ._('<div class="gift-code">')
                    ._('<a class="red-url ' + urlClass + '" data-href="'+ items[i].rl+'" data-collect="true" data-collect-flag="record-href-btn" data-collect-desc="中奖记录-外链奖品跳转">领取地址</a>')
                    ._('<p>中奖日期：'+items[i].lt.split(" ")[0]+'</p>')
                    ._('</div>')
                    ._('</li>');
            }
            if(len > 0){
                me.page++;
            }
            $('.gift-box ul').append(t.toString()).removeClass('none');
        }
    };

    W.callbackLotteryRecordHandler = function(data){
        if (data.result) {
            if (data.rl.length < H.record.pageSize) {
                H.record.loadmore = false;
            } else if(data.rl.length == H.record.pageSize){
                H.record.loadmore = true;
            }
            H.record.tpl(data);
        } else {
            H.record.loadmore = false;
            if(H.record.page == 1){
                $(".gift-box").html('<p class="empty">亲，您暂时没有奖品哦~</P>');
            }
        }
    };
})(Zepto);

$(function(){
    H.record.init();
});