/**
 * 老三热线--首页
 */
(function($){
    H.index = {
        $huatong: $(".huatong"),
        $phone: $(".phone"),
        init: function(){
            this.event();
            this.slide();
        },
        event: function(){
            var me = H.index;
            $("#btn-rule").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                H.dialog.rule.open();
            });
            $("#go").click(function(e){console.log(1);
                e.preventDefault();
                me.$huatong.addClass("active").removeClass("animated");
                me.$phone.removeClass("animated");
                toUrl('yao.html');
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        slide: function(){
            window.onload = function(){
                var el = document.querySelector('#go');
                var clientWidth = $(window).width();
                var clientHeight = $(window).height();
                var elStep = $(window).width() * 0.2;
                var startPosition, endPosition, deltaX, deltaY, moveLength;
                var ratio = 361/347;
                var isGo = false;
                var me = H.index;

                el.addEventListener('touchstart', function (e) {
                    var touch = e.touches[0];
                    startPosition = {
                        x: touch.pageX,
                        y: touch.pageY
                    }
                });

                el.addEventListener('touchmove', function (e) {
                    var touch = e.touches[0];
                    endPosition = {
                        x: touch.pageX,
                        y: touch.pageY
                    };


                    deltaX = endPosition.x - startPosition.x;
                    deltaY = endPosition.y - startPosition.y;
                    moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2));

                    console.log('moveLength='+moveLength+ '----deltaX='+deltaX+'----deltaY='+deltaY);
                    if(Math.abs(deltaX) > 0 && deltaY < 0){
                        me.$huatong.addClass("active").removeClass("animated");
                        me.$phone.removeClass("animated");
                        isGo = true;
                        setTimeout(function(){
                            if(isGo){
                                toUrl('yao.html');
                            }
                        }, 500);
                    }else{
                        me.$huatong.removeClass("active").addClass("animated");
                        isGo = false;
                    }
                });

                el.addEventListener('touchend', function (e) {
                    if (isGo) {
                        toUrl('yao.html');
                        recordUserOperate(openid, "老三热线", "three-hotline");
                        recordUserPage(openid, "老三热线", 0);
                    }

                });

            }
        }
    }
})(Zepto);
$(function(){
    H.index.init();
});