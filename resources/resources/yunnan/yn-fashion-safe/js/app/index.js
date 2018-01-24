(function($) {
	H.index = {
		init: function() {
			var winW = $(window).width(),
				winH = $(window).height(),
				qrcodeH, tipsH, logoH;
			$('.parallax-obj').css({
				'height': winH,
				'width': winW
			});
			$('body').css({
				'height': winH,
				'width': winW
			});
			logoH = Math.ceil(($('.logo').width() * 210 ) / 422) + 1;
			$('.logo').css('height', logoH);
			qrcodeH = Math.ceil(($('.qrcode').width() * 654 ) / 597) + 1;
			$('.qrcode').css('height', qrcodeH);
			tipsH = Math.ceil(($('.tips').width() * 49 ) / 554) + 3;
			$('.tips').css('height', tipsH);
			$('.parallax-obj').parallax();
			if (openid) {
				recordUserPage(openid, "云南卫视《时尚我最懂》宣传页", '');
			};
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});