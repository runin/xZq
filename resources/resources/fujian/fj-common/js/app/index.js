(function($){
    H.index = {
        init: function(){
            this.resize();
            this.event();
            this.articleList();
        },
        resize: function(){
            var me = this, winW = $(window).width(), winH = $(window).height();
            $("body").css({
                "width": winW,
                "height": winH
            });
            $("#items-img").css({"height": winH*0.64});
        },
        articleList: function(){
            getResult('api/article/list', {}, 'callbackArticledetailListHandler',true);
        },
        event: function(){
            $("#index").tap(function(e){
                e.preventDefault();
                toUrl("lottery.html");
            });
        }
    };
    W.callbackArticledetailListHandler = function(data){
        if(data.code == 0){
            $("#items-img").attr("src", data.arts[0].img);
        }
    }
})(Zepto);
$(function(){
    H.index.init();
});
