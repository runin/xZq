(function() {
	
	H.index = {
		from: getQueryString('from'),
		REQUEST_CLS: 'requesting',
		CURR_TIME: 0,
		START_TIME: 0,
		interval: null,
		players: $('.ui-player-item').length,
		round_timer: null,
		round: 0, // 过了几轮
		expires: {expires: 7},
		$ctrl: $('#ctrl-flower'),
		$btn_vote: $('#btn-vote'),
		$btn_follow: $('#btn-follow'),
		$btn_lottery: $('#btn-lottery'),
		COOKIE_KEY: 'vote-tv',
		
		init: function() {
			var cookie_share = $.fn.cookie('share_desc');
			share_desc = cookie_share || share_desc;
			
			H.utils.resize();
			H.weixin.init();
			H.shaketv.init();
			
			if (this.from && !$.fn.cookie('guided')) {
				setTimeout(function() {
					H.dialog.guide.open();
				}, 800);
			}
		
			var me = this, voted_num = 0, unvoted = [];
			$('.swiper-slide').each(function() {
				var index = $(this).attr('data-index'),
					voted = $.fn.cookie(me.COOKIE_KEY + '-' + index);
				
				if (voted) {
					voted_num ++;
					$('#flower' + index).find('.detail-info').addClass('selected');
					
					if (voted_num >= me.players) {
						me.$btn_vote.addClass('none');
					}
				} else {
					unvoted.push(parseInt(index) - 1);
				}
			});

			H.swipe.init(unvoted[Math.floor(Math.random() * unvoted.length)]);
			this.event();
			
			getResult('flowers/activity/info', {
				oi: openid
			}, 'callbackFlowersActivityInfo', true);
		},
		
		event: function() {
			var me = this;
			this.$btn_vote.click(function(e) {
				e.preventDefault();

				var $active = $('.swiper-slide-active'),
					index = $active.attr('data-index');
					
				if ($active.find('.detail-info').hasClass('selected')) {
					alert('已给该选手投过票');
					return;
				}
				if ($(this).hasClass(me.REQUEST_CLS)) {
					return;
				}
				$(this).addClass(me.REQUEST_CLS);
				getResult('/flowers/vote', {
					oi: openid,
					voi: index
				}, 'callbackFlowersVote', true);
			});
		},
		
		voted: function(data) {
			this.$btn_vote.removeClass(this.REQUEST_CLS)
			if (data.vote_code == 1) {
				W.lc += 1;
				H.dialog.lottery.update();
				
				H.dialog.tip.open('投票成功，请留意电视每15分钟有一次投票和抽奖机会');
				this.$btn_vote.addClass('none');
				this.$btn_lottery.removeClass('none');
				
				$.fn.cookie('round-' + this.round, 1, this.expires);
				$.fn.cookie(H.index.COOKIE_KEY + '-' + data.voi, 1, this.expires);
				
				var $flower = $('#flower' + data.voi);
				$flower.find('.detail-info').addClass('selected');
				
				// 修改分享文案
				share_desc = '我在看美在花城总决赛直播，支持' + data.voi + '号' + $flower.find('span').text();
				$.fn.cookie('share_desc', share_desc, this.expires);
				H.weixin.init();
			}
		},
		
		// 每30分钟可抽奖一次
		update_state: function() {
			var me = this, time_step = 100;
			this.interval = setInterval(function() {
				me.CURR_TIME += time_step;
				
				// 未到开始时间，不能投票不能抽奖
				if (me.CURR_TIME >= me.START_TIME) {
					clearInterval(me.interval);
					
					me.round = Math.floor((me.CURR_TIME - me.START_TIME) / flowers_timer);
					var timer = me.CURR_TIME - me.START_TIME - flowers_timer * me.round;
					
					if (me.round >= me.players) {
						return;
					}
					
					me.reset_ctrl();
					// timer时间之后
					setTimeout(function() {
						me.round ++ ;
						me.reset_ctrl();
						// 每隔30分钟有一次抽奖机会
						me.round_timer = setInterval(function() {
							me.CURR_TIME += flowers_timer;

							if (me.CURR_TIME - flowers_timer * me.players >= me.START_TIME) {
								clearInterval(me.round_timer);
								return;
							}
							me.round ++;
							me.reset_ctrl();
						}, flowers_timer);
						
					}, timer);
				}
			}, time_step);
		},
		
		reset_ctrl: function() {
			var round = parseInt($.fn.cookie('round-' + this.round));
			if (isNaN(round)) {
				this.$btn_lottery.addClass('none');
				this.$btn_vote.removeClass('none');
			} else {
				this.$btn_vote.addClass('none');
				H.dialog.lottery.update();
			}
			this.$ctrl.removeClass('none');
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
			    initialSlide: !isNaN(index) ? index : Math.floor(Math.random() * H.index.players)
			});
		}
	};
	
	H.shaketv = {
		init: function() {
			// 一键关注
			shaketv && shaketv.subscribe(flowers_follow_key, function(returnData){
				console.log(returnData.errorMsg);
			});
		}
	};
	
	H.weixin = {
		init: function() {
			$(document).wx({
				"img_url" : share_img,
		        "desc" : share_desc,
		        "title" : share_title
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
	W.callbackFlowersVote = function(data) {
		H.index.voted(data);
	};
	
	W.callbackFlowersActivityInfo = function(data) {
		// errcode:1表示活动不存在。errcode:0表示正常。
		if (data.errcode == 0) {
			H.dialog.lottery.update(data.ln);
			H.index.CURR_TIME = data.st;
			H.index.START_TIME = data.bt;
			
			H.index.update_state();
		}
	};
	
})(Zepto);

H.index.init();
