(function($) {
	H.declaration = {
		tid: '',
		uuid: '',
		init: function() {
			var me = this;
			if (!openid) {
				return;
			};
			me.loadResize();
			me.updateCount();
			me.updateDeclaration();
			me.event();
		},
		event: function() {
			$('.back2answer').click(function(e) {
				e.preventDefault();
				toUrl('answer.html');
			});
		},
		updateDeclaration: function() {
			getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler', false, null, true);
		},
		updateCount: function() {
			getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
			setInterval(function() {
				getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
			}, 5000);
		},
		fillDeclaration: function(data) {
			var me = this, t = simpleTpl(),
				gitems = data.gitems || [],
				length = gitems.length;
			me.tid = data.tid;
			for (var i = 0; i < length; i ++) {
				t._('<li data-uuid="' + gitems[i].uid + '" data-collect-flag="yn-travel-declaration-golyric" data-collect-desc="配词页-配词详情页按钮">')
					._('<img src="' + gitems[i].ib + '">')
					._('<p>点此为TA配词</p>')
					._('<i></i>')
				._('</li>')
			};
			$('.declaration-box').html(t.toString());
			me.lyricBtnclick();
		},
		lyricBtnclick: function() {
			$('.declaration-box li').click(function(e) {
				e.preventDefault();
				window.location.href = 'lyric.html?tid=' + H.declaration.tid + '&uuid=' + $(this).attr('data-uuid');
			});
		},
		loadResize: function() {
			var winW = $(window).width(),
				winH = $(window).height();
			$('body').css({
				'width': winW,
				'min-height': winH
			});
		}
	};

	W.callbackCountServicePvHander = function(data) {
		if (data.code == 0) {
			$('header .topic-box span').animate({'opacity': '1'}, 1000);
			$('header .topic-box span label').text(data.c);
		} else {
			$('header .topic-box span').animate({'opacity': '0'}, 1000);
		};
	};

	W.callbackLinesDiyInfoHandler = function(data) {
		if (data.code == 0) {
			H.declaration.fillDeclaration(data);
		};
	};
})(Zepto);

$(function() {
	H.declaration.init();
});