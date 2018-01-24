(function($){
    H.index = {
        init: function(){
            this.event();
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        event: function(){
            var me = H.index;
            $(".go").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("lottery.html")
            });
        }
    }
})(Zepto);
$(function(){
    H.index.init();
});
