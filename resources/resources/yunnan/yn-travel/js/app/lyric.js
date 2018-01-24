(function($) {
	H.lyric = {
		tid: getQueryString('tid') || '',
		uuid: getQueryString('uuid') || '',
		shareuuid: '',
		REQUEST_CLS: 'requesting',
		$inputContent: $('#content'),
		init: function() {
			var me = this;
			if (!openid) {
				$('footer').empty().html('<a href="declaration.html" class="lyric-btn">马上去配词</a>');
				return;
			};
			if (me.tid == '' || me.uuid == '') {
				$('header, section, footer').animate({'opacity':'0'}, 1800);
				showTips('选张美图去配词吧~', null, 3000);
				setTimeout(function() {
					toUrl('declaration.html');
				}, 3500);
			};
			me.updateLyric();
			me.event();
		},
		event: function() {
			var me = this;
			$('.back').click(function(e) {
				e.preventDefault();
				toUrl('declaration.html');
			});
			$('#content').focus(function(e) {
				e.preventDefault();
				$('footer').css('position', 'static');
			});
			$('#content').blur(function(e) {
				e.preventDefault();
				setTimeout(function() {
					me.loadResize();
				}, 500);
			});
		},
		updateLyric: function() {
			var me = this;
			getResult('api/linesdiy/detail/' + me.uuid, {}, 'callbackLinesDiyDetailHandler', false, null, true);
		},
		saveLyric: function(content) {
			var me = this;
			getResult('api/linesdiy/save', {
				yoi: openid,
				tuid: me.uuid,
				jsdt: encodeURIComponent(content)
			}, 'callbackLinesDiySaveHandler', false, null, true);
		},
		fillLyric: function(data) {
			var me = this;
			$('.lyric-box').find('img').attr('src', data.ib);
			me.lyricBtnclick();
			var loadPic = new Image();
			loadPic.src = data.ib;
			loadPic.onload = function (){
				setTimeout(function() {
					me.loadResize();
				}, 500);
			};
		},
		lyricBtnclick: function() {
			var me = this;
			$('.lyric-confirm').click(function(e) {
				e.preventDefault();
				if ($(this).hasClass(me.REQUEST_CLS)) {
					return;
				};
				var content = $.trim(me.$inputContent.val()) || '',
					content = content.replace(/<[^>]+>/g, ''),
					len = content.length;
				if (len == 0) {
					showTips('请先说点什么吧');
					return;
				};
				$(this).addClass(me.REQUEST_CLS);
				me.saveLyric(content);
				setTimeout(function() {
					me.loadResize();
				}, 500);
			});
			$('.lyric-share').click(function(e) {
				e.preventDefault();
				toUrl('lyricShare.html?ruid=' + H.lyric.shareuuid + '&isfrom=share');
				// $('body').removeClass().addClass('share');
				setTimeout(function() {
					me.loadResize();
				}, 500);
			});
		},
		loadResize: function() {
			var winW = $(window).width(),
				winH = $(window).height();
			if ($('.lyric-body').height() + 48 > winH ) {
				$('footer').css('position', 'static');
			} else {
				$('footer').css('position', 'absolute');
			}
		}
	};

	W.callbackLinesDiyDetailHandler = function(data) {
		if (data.code == 0) {
			H.lyric.fillLyric(data);
		};
	};

	W.callbackLinesDiySaveHandler = function(data) {
		$('.lyric-confirm').removeClass(H.lyric.REQUEST_CLS);
		if (data.code == 0) {
			showTips('配词成功!', null, 1000);
			$('body').removeClass().addClass('confirm');
			H.lyric.shareuuid = data.ruid;
			console.log(data.ruid);
			return;
		};
		showTips(data.message);
	};
})(Zepto);

$(function() {
	H.lyric.init();
});