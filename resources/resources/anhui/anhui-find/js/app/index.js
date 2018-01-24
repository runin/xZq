/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		from: getQueryString('from'),
		init: function () {
			var me = this;
			if (me.from) {
				setTimeout(function () {
					H.dialog.guide.open();
				}, 800);
			}
			me.load_bg();
		},
		event_handler : function() {
			var me = this;
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
		},
		load_bg: function(){
			imgReady(index_bg, function() {
				$('body').css('background-size', document.documentElement.clientWidth + 'px ' + document.documentElement.clientHeight + 'px');
				$('body').css('background-image', 'url('+ index_bg +')');
			});
		}
	}
})(Zepto);

$(function(){
	H.index.init();
});


