(function(){
    H.index = {
        init: function(){
            this.event();
        },
        event: function(){
            var me = H.index;
            $('.go').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('ad.html');
            });
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    }
})(Zepto);
$(function(){
    H.index.init();
});
