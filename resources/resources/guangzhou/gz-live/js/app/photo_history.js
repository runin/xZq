(function($) {
	H.history = {
		uuid: '',
		zanuuid: '',
		showPage: 1,
		showPagesize: 10,
		isTrue: true,
		init: function() {
			var me = this;
			if (!openid) {
				return false;
			};
			getResult('gzlive/photo/index', {
				openid: openid
			}, 'photoIndexHandler', true, null, true);
		},
		fill: function(data) {
			var me = this, serverTime = str2date(data.ae),
				now = new Date(), end = new Date(serverTime),
				lastTime = end.getTime() - now.getTime();
			var lastDay = Math.ceil(lastTime / (24 * 60 * 60 * 1000));
			if (lastDay > 0) {
				$('.topic-info').removeClass('none');
				$('.count-day label').html(lastDay);
			} else {
				$('.topic-info').addClass('none');
				$('.topic-title span').html('上期话题');
			};

			$('.topic-head img').attr('src', data.ai);
			$('.topic-title .topic-name').html(data.at);
			$('.topic-content .topic-desc').html(data.att);
			$('.count-total label').html(data.ac);

			if ($('.topic-name').html().length > 10 && $('.topic-name').html().length < 20) {
				$('.topic-name').css('font-size', '24px');
			} else if ($('.topic-name').html().length >= 20) {
				$('.topic-name').css('font-size', '19px');
			} else {
				$('.topic-name').css('font-size', '30px');
			};
			getResult('gzlive/photo/history', {
				page: H.history.showPage,
				pageSize: H.history.showPagesize
			}, 'photoHistoryHandler', true, null, true);
		},
		fill_list: function(data) {
			var t = simpleTpl(),
				history = data.history || [],
				historyLen = history.length;
			// $('.comments-back ul').empty();
			for (var i = 0; i < historyLen; i ++) {
				t._('<li data-uuid="' + history[i].au + '">')
					._('<div>')
						._('<p class="his-topic-name">' + history[i].at + '</p>')
						._('<p class="his-topic-time">' + (history[i].ae).split(' ')[0] + '</p>')
					._('</div>')
					._('<p>' + history[i].ad + '</p>')
				._('</li>')
			};
			$('.comments-back ul').append(t.toString());
			var historyLen = $('.comments-back ul li').length;
			H.history.commNum = H.history.showPage * H.history.showPagesize - historyLen;
			this.event();
		},
		event: function() {
			if (H.history.isTrue) {
				H.history.isTrue = false;
				$('.more').click(function(e) {
					e.preventDefault();
					$('.more').removeClass('hasmore').addClass('nomore').find('a').html('正在拼命加载');
					// if (H.history.commNum <= 0) {
					// 	H.history.showPage++;
					// };
					getResult('gzlive/photo/history', {
						page: H.history.showPage,
						pageSize: H.history.showPagesize * H.history.showPage
					}, 'photoHistoryHandler', true, null, true);
				});
			};
			$('.comments-back li').click(function(e) {
				e.preventDefault();
				var topicUuid = $(this).attr('data-uuid') || '';
				if (topicUuid != '') {
					setTimeout(function() {
						toUrl('photo.html?uuid=' + topicUuid + '&history=open');
					}, 50);
				};
			});
		}
	};

	W.photoIndexHandler = function(data) {
		$('.main').animate({'opacity':'1'}, 500).css('z-index', '0');
		if (data.code == 0) {
			H.history.uuid = data.au;
			H.history.fill(data);
		} else if (data.code == 4) {
			setTimeout(function() {
				toUrl('index.html');
			}, 50);
		} else {
			setTimeout(function() {
				toUrl('index.html');
			}, 50);
		};
	};
	
	W.photoHistoryHandler = function(data) {
		$('.more').removeClass('nomore').addClass('hasmore').find('a').html('点击加载更多');
		if (data.code == 0) {
			if (data.history == '') {
				$('.more').addClass('none');
				if(H.history.showPage == 1) {
					$('.comments-back').append('<p class="no-history">我是第一期啦~快来参加吧！</p>');
				} else {
					$('.comments-back').append('<p class="no-history">没有更多啦~</p>');
				}
			} else {
				$('.more').removeClass('none');
				H.history.showPage++;
				H.history.fill_list(data);
			}
		};
	};
	
})(Zepto);

$(function() {
	H.history.init();
});