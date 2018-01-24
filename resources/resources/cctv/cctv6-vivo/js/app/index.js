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
        }).delegate('#btn-go2play', 'click', function(e) {
            e.preventDefault();
            var me = this;
            if(!$(me).hasClass('requesting')){
                $(me).addClass('requesting');
                shownewLoading();
                toUrl('game.html');
            }
        });
    }
};

$(function() {
    H.index.init();
});