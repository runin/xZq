(function($) {
    H.message = {
        init: function() {
           $(".btn-backtohome").click(function() {
                toUrl("personcenter.html");
            });
        }
    }
})(Zepto);

$(function() {
    H.message.init();
});
