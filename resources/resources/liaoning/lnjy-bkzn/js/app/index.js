(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnJoin: $('#btn-join'),
		$btnRule: $('#btn-rule'),
		$btnRecord: $('#btn-record'),
		guide: true,
		init: function() {
			if (!openid) {
				return false;
			};
			var me = this;
			if (me.from == 'share') {
				H.dialog.guide.open();
			};
			me.resie();
			me.event();
		},
		event: function() {
			this.$btnJoin.click(function(e){
				e.preventDefault();
				toUrl("lottery.html");
			});
			this.$btnRecord.click(function(e){
				e.preventDefault();
				toUrl("record.html");
			});
			this.$btnRule.click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
		},
		resie: function() {
			var winW = $(window).width(),
				winH = $(window).height();
			var joinW = winW * 0.7;
			var joinH = Math.ceil(joinW * 96 / 355);
			$('body').css({
				'width': winW,
				'height': winH
			});
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});