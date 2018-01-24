(function($){
    H.index = {
        init: function(){
            this.event();
        },
        event: function(){
            var me = this;
            $(".btn-index").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("lottery.html");
            });
            $(".icon-link").tap(function(e){
                e.preventDefault();
                $(this).addClass("pulse");
                toUrl("answer.html");
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        }
    }
})(Zepto);
$(function(){
    H.index.init();
});
