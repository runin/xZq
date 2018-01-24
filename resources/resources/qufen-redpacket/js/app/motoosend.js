+(function() {
    var me = {
        init: function() {
            var nickname = decodeURIComponent(getQueryString("snickname"));
            var headimgurl = decodeURIComponent(getQueryString("sheadimgurl"));
            if (headimgurl) {
                $(".userHead").attr("src", headimgurl);
            }
            $(".nickname").html(nickname || "你的好友");
            $(".gotosend").click(function() {
                window.location.href = "index.html";
            });
        }
    };
    me.init();
})();
