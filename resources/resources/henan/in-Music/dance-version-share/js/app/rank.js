(function($) {
    H.rank = {
        guid: getQueryString("guid"),
        periodUuid: getQueryString("periodUuid"),
        pid: getQueryString("pid"),
        showMode: getQueryString("showMode"),
        init: function() {
            this.event();
            this.loadImg();
            this.voteSupport();
            this.share();
        },
        share: function(){
            var name = W.localStorage.getItem("nameStar-"+ openid),
            count = W.localStorage.getItem("voteCountStar-"+ openid),
            base = W.localStorage.getItem("guid-"+ this.guid +"pid-"+ this.pid)*1 || 0;

            if (base && base > 0) {
                $('.s-name').html(name);
                $('.s-num').html(base);
            } else {
                if (H.rank.showMode == '1') {
                    $('.myinfo').html('<label style="font-size:17px;">本期演唱会助威活动已结束!</label>');
                } else {
                    $('.myinfo').html('<label style="font-size:19px;">您还未进行任何投票</label>');
                }
            }
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
                window.location.href = "https://www.baidu.com/index.php?tn=02049043_33_pg";
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


            $('body').delegate('.content .left img', 'tap', function(e) {
                e.preventDefault();
                toUrl('details.html?periodUuid=' + me.periodUuid + '&guid=' + me.guid + '&pid=' + $(this).parents('li').attr('id'));
            })
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
                    var base1 = W.localStorage.getItem("guid-"+ me.guid +"pid-"+ itema[j].puid)*1 || 0;
                    var base2 = W.localStorage.getItem("guid-"+ me.guid +"pid-"+ itema[j + 1].puid)*1 || 0;
                    if ((itema[j].cunt + base1) < (itema[j + 1].cunt + base2)) {
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
                var base = W.localStorage.getItem("guid-"+ me.guid +"pid-"+ item.puid)*1 || 0;
                t._('<li id="'+item.puid+'">')
                     ._(' <div class="left"><img src="'+ item.img1 +'" /><span>'+ item.name +'</span></div>')
                     ._('<div class="right">'+ (base + item.cunt*1) +'赞</div>')
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