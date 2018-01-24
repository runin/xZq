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
                     ._('<div class="right">'+ item.cunt +'票</div>')
                 ._('</li>')
            });
            $('#content ul').append(t.toString());
            $('#content').removeClass("none");
            //me.getCurrentInfo();
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
    W.callbackVoteguessInfoHandler = function(data){
        var me = H.rank;
        if(data.code == 0){
            $.each(data.items[0].pitems, function(i,item){
                    $("#"+item.pid).find("img").attr("src", item.im);
            });
            $('#content').removeClass("none");
        }
    };
})(Zepto);

$(function() {
    H.rank.init();
});