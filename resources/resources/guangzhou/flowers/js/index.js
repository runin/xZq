(function($) {
	
	H.index = {
		init: function() {
			H.utils.resize();
			H.weixin.init();
		}
	};
	
	H.sign = {
		init: function() {
			H.utils.resize();
			H.weixin.init();
			
			getResult('live/activity/sign', {
				ac: activity_code,
				oi: openid
			}, 'callbackLiveActivitySign', true);
		}
	};
	
	H.lottery = {
		$wrapper: $('#wrapper'),
		$title: $('#title'),
		$detail: $('#detail'),
		$prize: $('#prize'),
		step: parseInt(getQueryString('step')),
		expires: {expires: 7},
		
		init: function() {
			H.utils.resize();
			H.weixin.init();
			
			var result = parseInt($.fn.cookie('result')),
				result_code = parseInt($.fn.cookie('result-c-' + this.step)),
				result_pn = $.fn.cookie('result-pn-' + this.step),
				result_pp = $.fn.cookie('result-pp-' + this.step);
			
			// 没有中过奖，且当前step没有抽过奖，可以抽奖
			if (!result && isNaN(result_code)) {
				this.start();
			} else {
				var data = {
					lottery_code: isNaN(result_code) ? 2 : result_code,
					pn: result_pn,
					pp: result_pp
				};
				
				this.update(data);
			}
		},
		
		rate: function() {
			var random = parseInt(Math.random() * 100) + 1;
			return parseInt(lottery_rate) >= random;
		},
		
		start: function() {
			//if (this.rate()) {
				getResult('live/activity/lottery', {
					ac: activity_code,
					oi: openid,
					si: this.step
				}, 'callbackLiveActivityLottery', true);
			//} else {
			//	this.update({
			//		lottery_code: 2
			//	});
			//}
		},
		
		update: function(data) {
			$.fn.cookie('result-c-' + this.step, data.lottery_code, this.expires);
			this.$wrapper.attr('class', 'wrapper');
			
			if (!data.lottery_code || data.lottery_code != 1) {
				return;
			} else {
				$.fn.cookie('result', 1, this.expires);
			}
			
			$.fn.cookie('result-pn-' + this.step, data.pn ? data.pn : '', this.expires);
			$.fn.cookie('result-pp-' + this.step, data.pp ? data.pp : '', this.expires);
			
			this.$title.text('恭喜您中奖');
			this.$detail.text(data.pn);
			this.$wrapper.addClass('pp');
			this.$prize.html('<img src="'+ data.pp +'" />');
		}
	};
	
	H.weixin = {
		init: function() {
			$(document).wx({
				"img_url" : share_img,
		        "desc" : share_desc,
		        "title" : share_title,
		        "url": share_url
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
			
			this.$main.css('minHeight', height).css('height', height);
			showLoading();
			imgReady(main_bg, function() {
				hideLoading();
				me.$main.css('background-image', 'url('+ main_bg +')');
			});
		}
	};
	
	// 签到
	W.callbackLiveActivitySign = function(data) {};
	
	// 抽奖
	W.callbackLiveActivityLottery = function(data) {
		// lottery_code : [1中奖 2未中奖],
		H.lottery.update(data);
	};
	
})(Zepto);

H.index.init();