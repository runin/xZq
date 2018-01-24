(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnJoin: $('#btn-join'),
		$btnRule: $('#btn-rule'),
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
				showLoading();
				toUrl("reserve.html");
			});
			this.$btnRule.click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			// $('.folk').click(function(e) {
			// 	e.preventDefault();
			// 	$('.folk').animate({'height':'0'}, 300, function(){
			// 		$('.folk').css('display', 'none');
			// 		$('.tips').css('display', 'none');
			// 		$('.btn-join').removeClass('none');
			// 	});
			// });
		},
		resie: function() {
			var winW = $(window).width(),
				winH = $(window).height();
			var joinW = winW * 0.7;
			var joinH = Math.ceil(joinW * 96 / 355);
			$('body, .fly-leafs').css({
				'width': winW,
				'height': winH
			});
			$('.btn-join').css({
				'height': joinH,
				'line-height': Math.ceil(joinH * 0.78) + 'px'
			});
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});