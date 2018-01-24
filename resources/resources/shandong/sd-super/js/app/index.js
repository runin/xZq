(function($) {
    H.index = {
        init: function() {
            // if (/index.html/i.test(location.href)) this.coverTime(5);
            this.event();
        },
        event: function() {
            var me = this;
            $('body').delegate('.jt', 'tap', function(e){
                e.preventDefault();
                toUrl("main.html");
            }).delegate('.btn-join', 'tap', function(e){
                e.preventDefault();
                toUrl("main.html");
            });
        },
        coverTime: function(t) {
            var me = this, time = t || 5;
            Img = new Image();
            Img.src = 'images/bg.jpg';
            Img.onload = function (){
                $('.jt').removeClass('none').find('label').text(time);
                var cc = setInterval(function(){
                    time--;
                    $('.jt label').html(time);
                    if (time == 0) {
                        clearInterval(cc);
                        toUrl("main.html");
                    }
                }, 1e3);
            };
        }
    };
})(Zepto);

$(function() {
    H.index.init();
});