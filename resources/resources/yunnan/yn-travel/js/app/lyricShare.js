(function($) {
	H.lyricShare = {
		isfrom: getQueryString('isfrom') || '',
		ruid: getQueryString('ruid') || '',
		REQUEST_CLS: 'requesting',
		init: function() {
			var me = this;
			if (!openid) {
				return;
			};
			if (me.isfrom == 'share') {
				$('body').addClass('is-share');
			} else {
				$('body').removeClass('is-share');
			}
			me.updateLyric();
			me.event();
		},
		event: function() {
			var me = this;
			$('.lyric-play').click(function(e) {
				e.preventDefault();
				toUrl('declaration.html');
			});
		},
		updateLyric: function() {
			var me = this;
			getResult('api/linesdiy/record/' + me.ruid, {}, 'callbackLinesDiyRecordHandler', false, null, true);
		},
		fillLyric: function(data) {
			var me = this;
			$('.lyric-box').find('img').attr('src', data.ib);
			$('.lyric-box').find('p').text(data.jd);
		},
		loadResize: function() {
			var winW = $(window).width(),
				winH = $(window).height();
			$('body').css({
				'width': winW,
				'height': winH
			});
		}
	};

	W.callbackLinesDiyRecordHandler = function(data) {
		if (data.code == 0) {
			H.lyricShare.fillLyric(data);
		};
	};
})(Zepto);

$(function() {
	H.lyricShare.init();
});