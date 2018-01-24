(function($){
    H.collectSuccess={
        sign: getQueryString("sign"),
        init: function(){
            this.event();
            // 一键分享
            window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, getNewUrl(openid, this.sign));
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        event: function(){
            var me = H.collectSuccess;
            $("#btn-back").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("index.html?sign="+ me.sign);
            });
        }
    };
})(Zepto);
$(function(){
    H.collectSuccess.init();
});
