(function($) {
	
	H.card = {
		star_id: getQueryString('id'),
		$btn_send: $('#btn-sendcard'),
		$btn_award: $('#btn-award'),
		$btns: $('.btn'),
		$star: $('#box-star'),
		$me: $('#box-me'),
		$mywish: $('#mywish'),
		$tips: $('#tips'),
		$audio: null,
		init: function() {
			H.utils.resize();
			this.event();
			
			if (!this.star_id) {
				window.location.href = 'stars.html';
				return false;
			}
			
			this.$btns.addClass('none');
			if (this.is_view()) {
				this.$btn_award.removeClass('none');
				H.dialog.guide.open();
				getResult('ceremony/cardinfo?cu=' + this.star_id, {}, 'callbackCardInfoHandler', true);
			} else {
				this.$btn_send.removeClass('none');
				this.fill_data((parseInt(this.star_id) || 1) - 1, {
					name: $.fn.cookie('da-nickname') || '',
					avatar: $.fn.cookie('da-avatar') ? ($.fn.cookie('da-avatar') + '/' + avatar_size) : ''
				});
			}
		},
		
		is_view: function() {
			return this.star_id.length > 2;
		},
		
		fill_data: function(star_id, info) {
			var star = W['stars'][star_id];
			if (!star) {
				return;
			}
			this.$star.find('.content').addClass(star.type);
			this.$star.find('img').attr('src', star.avatar || '');
			if (star.type == 'audio') {
				this.$audio = $('<audio preload="auto" class="audio none" src="'+ star.wish +'"></audio>');
				this.$star.append(this.$audio);
				this.audio_ready();
			} else {
				this.$star.find('.wish').text(star.wish || '');
			}
			this.$star.find('.name').text(star.name || '');
			this.$tips.find('strong').text(star.name || '');

			this.$me.find('.name').text(info.name);
			this.$me.find('img').attr('src', info.avatar);
			if (info.wish) {
				this.$me.find('.wish').html(info.wish);
			}
		},
		
		audio_ready: function() {
			var me = this;
			this.$audio.on('loadedmetadata', function() {
				me.$star.find('.wish').text(Math.ceil($(this).get(0).duration) + "'");
				this.play();
			});
		},
		
		text: function() {
			return this.$mywish.val() || '祝大家2015年万事如意，天天开心～';
		},
		
		event: function() {
			var me = this;
			this.$star.find('.wish').click(function() {
				var $tg = $(this),
					$audio = me.$star.find('audio');
				if ($tg.hasClass('scale')) {
					return;
				}
				$tg.closest('.content').addClass('scale');
				$audio.get(0).play();
				$audio.on('playing', function() {
					console.log('playing')
				}).on('ended', function() {
					console.log('ended');
					$audio.get(0).pause();
					$tg.closest('.content').removeClass('scale');
				});
			});
			
			this.$btn_send.click(function(e) {
				e.preventDefault();
				
				if (me.is_view()) {
					window.location.href = 'stars.html';
					return;
				}
				getResult('ceremony/makecard', {
					oi: openid,
					sn: me.star_id,
					gt: encodeURIComponent(me.text())
				}, 'callbackMakeCardHandler', true);
			});
			
			this.$btn_award.click(function(e) {
				e.preventDefault();
				
				window.location.href = 'index.html?award=true';
			});
		}
	};
	
	H.utils = {
		$main: $('#main'),
		resize: function() {
			var me = this,
				width = $(window).width(),
				height = $(window).height(),
				main_bg = 'http://cdn.holdfun.cn/ahtv/images/bg-card.jpg';
			
			this.$main.css('minHeight', height);
			showLoading();
			imgReady(main_bg, function() {
				hideLoading();
				me.$main.css('background-image', 'url('+ main_bg +')');
			});
		}
	};
	
	W.callbackMakeCardHandler = function(data) {
		if (data && data.result) {
			var url = share_url;
			url = add_param(url, 'id', data.cu, true);
			url = add_param(url, 'soi', openid, true);
			url = add_param(url, 'sn', H.card.star_id, true);

			share_desc = H.card.text()
			share_title = '我跟'+ $('#tips').find('strong').text() +'在国剧盛典现场给你送贺礼啦'; 
			share_url = url;
			
			share();
			
			H.card.$btn_send.addClass('shared');
			return;
		}
		alert('制作贺卡失败,请重试');
	};
	
	W.callbackCardInfoHandler = function(data) {
		if (data && data.result) {
			H.card.fill_data(data.sn - 1, {
				avatar: data.hi + '/' + avatar_size,
				name: data.nn,
				wish: data.gt
			});
		}
	};
	
})(Zepto);

H.card.init();
