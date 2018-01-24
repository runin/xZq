(function($){
    H.index = {
        init: function() {
            this.event();
        },
        event: function() {
            $('#btn-play').click(function(e){
                e.preventDefault();
                $(this).removeClass('lightSpeedIn');
                if ($(this).hasClass('pulse')) {
                    return;
                }
                $(this).addClass('pulse');
                toUrl('lottery.html');
            });
        }
    };
})(Zepto);

$(function(){
    H.index.init();
});