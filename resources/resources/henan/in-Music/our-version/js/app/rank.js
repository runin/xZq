(function($) {
    H.rank = {
        periodUuid: getQueryString("periodUuid"),
        init: function() {
            this.event();
            this.loadImg();
            this.voteSupport();
        },
        //获取竞猜信息（最新）
        getCurrentInfo: function(){
            getResult('api/voteguess/inforoud', {}, 'callbackVoteguessInfoHandler', true);
        },
        voteSupport: function() {
            var me =  H.rank;
            getResult('api/voteguess/allplayertickets', { periodUuid: me.periodUuid }, 'callbackVoteguessAllplayerticketsHandler');
        },
        loadImg: function(){
            var imgs = [
                "images/item-bg.jpg",
                "images/rank-tlt.png",
                "images/rank-li-bg.png"
            ];
            loadImg = function () {
                for (var i = 0; i < imgs.length; i++) {//图片预加载
                    var img = new Image();
                    img.style = "display:none";
                    img.src = imgs[i];
                    img.onload = function () {
                        $("body").animate({'opacity':'1'}, 100);
                    }
                }

            };
            loadImg();
        },
        event: function() {
            var me = this;
            $("#live").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                window.location.href = "http://statics.holdfun.cn/live/material/live.html?roomId=f52da9e4669045bc9eaf8f6041f8e2d3&enterId=7e51a2c4e62445b8b3db7c89ef861777";
            });
            $("#share-div").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                $("#mask").removeClass("none");

            });
            $("#mask").tap(function(e){
                e.preventDefault();
                $(this).addClass("none");
            });
        },
        swap: function(i, j,itema)
        {
            var temp = itema[i];
            itema[i] = itema[j];
            itema[j] = temp;
        },
        bubbleSort: function(itema)
        {
            var me = H.rank;
            for (var i = itema.length - 1; i > 0; --i)
            {
                for (var j = 0; j < i; ++j)
                {
                    if (itema[j].cunt < itema[j + 1].cunt) {
                        me.swap(j, j + 1,itema);
                    }
                }
            }
        },
        tpl: function(data){
            var me = H.rank,
                t = simpleTpl(),
                attrs = data.items || [];

            me.bubbleSort(attrs);
            $.each(attrs, function(i, item){
                t._('<li id="'+item.puid+'">')
                     ._(' <div class="left"><img src="'+ item.img1 +'" /><span>'+ item.name +'</span></div>')
                     ._('<div class="right">'+ item.cunt +'赞</div>')
                 ._('</li>')
            });
            $('#content ul').append(t.toString());
            $('#content').removeClass("none");
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        }
    };
    W.callbackVoteguessAllplayerticketsHandler = function(data) {
        if (data.code == 0 && data.items) {
            H.rank.tpl(data);
        }
    };
})(Zepto);

$(function() {
    H.rank.init();
});