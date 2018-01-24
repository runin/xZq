(function($) {
	H.index = {
        // showoverFlag: getQueryString('showoverFlag'),
		init: function () {
			this.event();
            // if (this.showoverFlag == 'off') {
            //     $('body').removeClass().addClass('off');
            // } else {
            //     $('body').removeClass().addClass('on');
            // }
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
            }).delegate('#btn-go', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    shownewLoading();
                    toUrl('lottery.html');
                }
            });
		}
	}
})(Zepto);                             

$(function(){
	H.index.init();
});