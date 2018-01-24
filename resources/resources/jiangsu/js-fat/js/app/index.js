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
                toUrl("switch.html");
            });
            $(".index-rule").tap(function(e){
                e.preventDefault();
                H.dialog.rule.open();
            });
        }
    };
})(Zepto);
$(function(){
    H.index.init();
});
