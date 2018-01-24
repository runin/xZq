(function($) {
    H.index = {
        init: function() {
            this.event();
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
        }
    };
})(Zepto);

$(function() {
    H.index.init();
});