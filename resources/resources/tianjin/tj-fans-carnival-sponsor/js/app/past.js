(function($) {
    H.past = {
        $btnGo: $('#btn-go'),
        request_cls: 'requesting',
        init: function() {
            this.event();
            this.loadImg();
        },
        loadImg: function(){
            var imgs = [
                "images/index-bg.jpg",
                "images/go.png",
                "images/theme.png",
                "images/tvlogo.png"
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
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        }
    };
})(Zepto);

$(function() {
    H.past.init();
});