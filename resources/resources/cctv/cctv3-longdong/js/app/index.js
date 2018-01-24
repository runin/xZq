(function($) {
    H.index = {
        init: function() {
            this.event();
        },
        event: function() {
            var me = this;
            $('body').delegate('#btn-rule', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    shownewLoading();
                    H.dialog.rule.open();
                }
            }).delegate('#btn-go2lottery', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    shownewLoading();
                    toUrl('lottery.html');
                }
            });
        }
    };
})(Zepto);

$(function() {
    H.index.init();
});