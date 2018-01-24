(function($){
    H.index = {
        init: function(){
            this.event();
        },
        event: function(){
            var me = H.index;
            $("#btn-rule").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                H.dialog.rule.open();
            });
            $("#go").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("yao.html");
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    };
})(Zepto);
$(function(){
   H.index.init();
});

