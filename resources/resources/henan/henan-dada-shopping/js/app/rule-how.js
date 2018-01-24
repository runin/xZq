;(function($){
    H.ruleHow = {
        type:  getQueryString("type"),
        init: function(){
            this.event();
            this.linesdiyInfo();
        },
        event: function(){
            $(".btn-back").click(function(e){
                e.preventDefault();
                toUrl("home.html");
            });
        },
        isShow: function(){
            var me = this;
            if(this.type == "rule"){
                $("#rule").removeClass("none");
            }else{
                $("#how").removeClass("none");
            }

        },
        //获取当前最新剧照信息
        linesdiyInfo: function(){
            getResult("api/linesdiy/info", {}, "callbackLinesDiyInfoHandler");
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
        var me = H.ruleHow;
        if(data.code == 0){
            $("#rule h1").text(data.gitems[0].t);
            $("#rule .content").html(data.gitems[0].info);

            $("#how h1").text(data.gitems[1].t);
            $("#how .content").html(data.gitems[1].info);
            me.isShow();
        }
    }
})(Zepto);
$(function(){
    H.ruleHow.init();
});