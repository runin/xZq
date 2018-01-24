(function($) {
    H.index = {
        $btnGo: $('#btn-go'),
        init: function() {
            this.event();
            this.loadImg();
        },
        loadImg: function(){
            var imgs = [
                "images/big-logo.jpg",
                "images/cloud.png",
                "images/logo-left.jpg",
                "images/logo-left.jpg"
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

            this.$btnGo.tap(function(e) {
                e.preventDefault();
                me.btn_animate($(this));
                window.location.href = "http://linkcook.cn/h5/food.html";
            }).one("webkitAnimationEnd", function () {
                $(this).removeClass("rubberBand");
            });

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
    H.index.init();
});