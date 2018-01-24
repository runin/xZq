(function($) {
    H.jifen = {
        uid: $.fn.cookie(openid + "_tid"),
        init: function () {
            this.event();
            this.userIntegral();
            this.top20();
            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : "images/avatar-default.png";
            $(".avatar").attr("src",h);
            var n = nickname ? nickname : "匿名用户";
            $(".user-name").text(n);
        },
        event: function() {
            var me = this;
            $(".btn-prize").click(function(e){
                e.preventDefault();
                toUrl("product.html");
            });
        },
        userIntegral: function(){
            var me = this;
            getResult("api/lottery/integral/rank/self",{oi:openid,pu:me.uid},"callbackIntegralRankSelfRoundHandler");
        },
        top20: function(){
            var me = this;
            getResult("api/lottery/integral/rank/top10",{pu:me.uid},"callbackIntegralRankTop10RoundHandler");
        }
    };
    W.callbackIntegralRankSelfRoundHandler = function(data){
        if(data.result){
            $(".user-integral").text(data.in);
            $("#jifen").removeClass("none");
        }
    };
    W.callbackIntegralRankTop10RoundHandler = function(data){
        if(data.result){
            var list = data.top10;
            if(list && list.length > 0){
                var t = simpleTpl();
                for(var i = 0; i < list.length; i ++){
                    var h= list[i].hi ? list[i].hi + '/' + yao_avatar_size : "images/avatar-default.png";
                    var n = list[i].nn ? list[i].nn:'匿名用户';
                    t._('<li>')
                        ._('<span class="no">'+(i+1)+'、</span>')
                        ._('<img src="'+h+'">')
                        ._(' <span class="name">'+n+'</span>')
                        ._('<span class="integral">'+list[i].in+'</span>')
                    ._('</li>');
                }
                $("#list").html(t.toString());
            }
        }
    };
})(Zepto);

$(function(){
    H.jifen.init();
});