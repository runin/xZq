(function($) {
    H.index = {
        init: function(){
            this.resize();
            this.event();
        },
        resize: function(){
            var me = this;
            var bg = 'images/bg.jpg';
            shownewLoading(null,'请稍等...');
            imgReady(bg, function() {
                $('.item-animate').removeClass('none').addClass('animated');
                hidenewLoading();
            });
            $('.ctrls').removeClass('none').addClass('animated');

            var w_win = $(window).width(), h_win = $(window).height();
            $('body').css({
                "width": w_win,
                "height": h_win
            });

        },
        event: function(){
            var me = H.index;
            $(".go").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("yao.html");
            });
            $("#btn-rule").click(function(e) {
				e.preventDefault();
                me.btn_animate($(this));
				H.dialog.rule.open();
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