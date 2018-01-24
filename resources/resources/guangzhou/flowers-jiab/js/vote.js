(function() {
	
	H.vote = {
		REQUEST_CLS: 'requesting',
		expires: {expires: 7},
		$btn_vote: $('#btn-vote'),
		COOKE_KEY: 'vote-jiab',
		
		init: function() {
			H.utils.resize();
			H.weixin.init();
		
			var voted = parseInt($.fn.cookie(this.COOKE_KEY));
			if (!voted) {
				this.$btn_vote.removeClass('none');
			} else {
				$('#flower' + voted).find('.detail-info').addClass('selected');
			}
			
			H.swipe.init(isNaN(voted) ? null : voted - 1);
			this.event();
		},
		
		event: function() {
			var me = this;
			this.$btn_vote.click(function(e) {
				e.preventDefault();
				
				if ($(this).hasClass(me.REQUEST_CLS)) {
					return;
				}
				$(this).addClass(me.REQUEST_CLS);
				getResult('live/activity/vote', {
					ac: activity_code,
					oi: openid,
					voi: $('.swiper-slide-active').attr('data-index')
				}, 'callbackLiveActivityVote', true);
			});
		},
		voted: function(data) {
			this.$btn_vote.removeClass(this.REQUEST_CLS);
			if (data.vote_code) {
				H.dialog.tip.open();
				this.$btn_vote.addClass('none');
				$.fn.cookie(H.vote.COOKE_KEY, data.voi, H.vote.expires);
				$('#flower' + data.voi).find('.detail-info').addClass('selected');
			}
		}
	};
	
	H.swipe = {
		$main: $('#main'),
		$container: $('#swiper-container'),
		$wrapper: $('#swiper-wrapper'),
		swiper: null,
		init: function(index) {
			var me = this;
			this.swiper = new Swiper(this.$container.get(0), {
			    centeredSlides: true,
			    slidesPerView: 2,
			    grabCursor: true,
			    calculateHeight: true,
			    itemWidth: 0.62,
			    initialSlide: index || Math.floor(Math.random() * $('.ui-player-item').length)
			});
		}
			
	};
	
	H.weixin = {
		init: function() {
			$(document).wx({
				"img_url" : share_img,
		        "desc" : share_desc,
		        "title" : share_title,
		        "url" : share_url
			});
		}
	};
	
	H.utils = {
		$main: $('#main'),
		resize: function() {
			var me = this,
				width = $(window).width(),
				height = $(window).height(),
				main_bg = 'images/bg.jpg';
			
			this.$main.css('width', width).css('height', height);
			showLoading();
			imgReady(main_bg, function() {
				hideLoading();
				me.$main.css('background-image', 'url('+ main_bg +')');
			});
		}
	};
	
	
	// 投票
	W.callbackLiveActivityVote = function(data) {
		H.vote.voted(data);
	};
	
})(Zepto);

H.vote.init();
