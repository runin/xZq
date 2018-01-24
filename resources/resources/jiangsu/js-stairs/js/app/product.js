(function($) {
    H.product = {
        items: [],
        integral_limit: 0,
        user_integral: 0,
        uid: $.fn.cookie(openid + "_tid"),
        already: false,
        init: function () {
            var me = this;
            var al = localStorage.getItem("already");
            if(al && al == me.uid){
                me.already = true;
            }
            H.product.userIntegral();
            me.list();
        },
        event: function() {
            var me = this;
            $(".btn-exchange").click(function(e){
                e.preventDefault();
                if($(this).hasClass("clicked")){
                    return;
                }
                if($(this).hasClass("already")){
                    showTips("您已经兑换过，请明天再来吧！");
                    return;
                }
                if($(this).hasClass("null")){
                    showTips("今天的商品已被兑完，明天早点来吧！");
                    return;
                }
                if(me.user_integral < $(this).attr("attr-ip")){
                    showTips("您的积分不够，赶紧去赚积分吧！");
                    return;
                }
                $(this).addClass("clicked");
                setTimeout(function(){
                    $(".btn-exchange").removeClass("clicked");
                },1000);
                shownewLoading();
                var i = $(this).attr("attr-id");
                localStorage.setItem("already", H.product.uid);
                H.dialog.exchangeDialog.open(me.items[i]);
            });
        },
        list: function(){
            getResult("api/mall/item/list",{},"callbackStationCommMall");
        },
        userIntegral: function(){
            var me = this;
            getResult("api/lottery/integral/rank/self",{oi:openid,pu:me.uid},"callbackIntegralRankSelfRoundHandler");
        }
    };
    W.callbackStationCommMall = function(data){
        if(data.code == 0){
            var items = data.items;
            if(items && items.length > 0){
                H.product.items = items;
                var t = new simpleTpl();
                for(var i = 0; i < items.length; i ++){
                    t._('<div class="item">')
                        ._('<img src="'+ items[i].is +'">')
                        ._('<p>'+ items[i].sn +'</p>')
                        ._('<p>剩余：<span id="left-num">'+ items[i].ic +'</span></p>');
                    if(items[i].ip <= 0){
                        t._('<a class="btn-exchange null none" attr-id="'+ i +'" attr-ip="'+ items[i].ip +'"></a>');
                    }else{
                        var already = H.product.already ? "already" : "";
                        t._('<a class="btn-exchange '+already+' none" attr-id="'+ i +'" attr-ip="'+ items[i].ip +'"></a>');
                    }
                    t._('</div>');
                }
                $(".list").html(t.toString());
                H.product.event();
            }
        }
        if(H.product.uid && H.product.uid != ''){
            $(".btn-exchange").removeClass("none");
        }
        $(".list").removeClass("none");
    };

    W.callbackIntegralRankSelfRoundHandler = function(data){
        if(data.result){
            H.product.user_integral = data.in;
        }
    };
})(Zepto);

$(function(){
    H.product.init();
});