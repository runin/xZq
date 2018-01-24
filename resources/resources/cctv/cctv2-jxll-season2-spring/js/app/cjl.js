var openid = getQueryString("openid") ? getQueryString("openid") : "test";
(function($) {
    H.cjl = {
        init: function () {
            this.event();
        },
        event: function() {
            $(".down-btn").click(function(e) {
                e.preventDefault();
                shownewLoading();
                setTimeout(function(){
                    if(is_android()){
                        location.href = "http://weixin.jitech.cn/downapp/download.do?type=android";
                    }else{
                        location.href = "https://itunes.apple.com/cn/app/id1064777129?mt=8";
                    }
                },800);
            });
        }
    };
})(Zepto);

$(function(){
    H.cjl.init();
});