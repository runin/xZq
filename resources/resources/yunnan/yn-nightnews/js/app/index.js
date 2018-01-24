(function($) {
    H.index = {
        init: function() {
            this.event();
            this.animateFix();
        },
        event: function() {
            var me = this;
            $("#btn-play").click(function(e){
                e.preventDefault();
                toUrl('vote.html');
            });
            $("#btn-rule").click(function(e){
                e.preventDefault();
                H.dialog.rule.open();
            });
        },
        animateFix: function() {
            setTimeout(function(){
                $('.icon-logo').removeClass('bounceInDown animated');
                $('.icon-slogan').removeClass('bounceIn animated');
                $('.icon-z1').removeClass('bounceInLeft animated');
                $('.icon-z2').removeClass('bounceInRight animated');
            }, 3500);
        }
    };
})(Zepto);

$(function() {
    H.index.init();
});