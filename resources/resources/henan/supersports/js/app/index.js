(function($) {
    H.index = {
        init: function() {
            if (/index.html/i.test(location.href)) this.coverTime();
            this.fillFly();
            this.event();
        },
        event: function() {
            var me = this;
            $('body').delegate('.jt', 'tap', function(e){
                e.preventDefault();
                toUrl("cards.html");
            });
        },
        coverTime: function() {
            var me = this, time = actData.time;
            Img = new Image();
            Img.src = 'images/bg.jpg';
            Img.onload = function (){
                $('.jt').removeClass('none').find('label').text(time);
                var cc = setInterval(function(){
                    time--;
                    $('.jt label').html(time);
                    if (time == 0) {
                        clearInterval(cc);
                        toUrl("cards.html");
                    }
                }, 1e3);
            };
        },
        fillFly: function() {
            $('.fly').html('<b></b><b></b><b></b><b></b><b></b><b class="t2"></b><b class="t2"></b><b class="t2"></b><b class="t2"></b><b class="t2"></b><b class="t3"></b><b class="t3"></b><b class="t3"></b><b class="t3"></b><b class="t3"></b><b class="t4"></b><b class="t4"></b><b class="t4"></b><b class="t4"></b><b class="t4"></b>');
        }
    };
})(Zepto);

$(function() {
    H.index.init();
    H.jssdk.init();
});