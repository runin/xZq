(function() {
	
	H.didi = {		
		$mobile: $('#mobile'),
		key: shaketv_appid + '_bjws_lottery',
		lotteryCount: null,
		init: function() {
			if (!openid) {
				return;
			}
			if (!W['localStorage'].cardid) {
				window.location.href = 'star.html';
				return;
			}
			
			this.lotteryCount = $.fn.cookie(this.key);
			this.lottery();
			this.$mobile.val($.fn.cookie(shaketv_appid + '_mobile') || '');
			
			this.event();
		},
		
		event: function() {
			var me = this, $share = $('#share');
			$('.btn-card').click(function(e) {
				e.preventDefault();
				
				$(window).scrollTop(0);
				share();
			});
			
			$('#btn-award').click(function(e) {
				e.preventDefault();
				
				var $mobile = me.$mobile,
					mobile = $.trim($mobile.val());
				
				if (!mobile) {
					H.dialog.didi.open();
					return;
					
				} else if (!/^\d{11}$/.test(mobile)) {
					alert('请先输入正确的手机号码');
					$mobile.focus();
					return;
				}
				
				me.award(mobile, $mobile);
			});
			
		},
		
		rate: function() {
			var random = parseInt(Math.random() * 100) + 1;
			return parseInt(lottery_rate) >= random;
		},
		
		lottery: function() {
			var me = this, $num = $('#award-num');
			if (!isNaN(parseInt(me.lotteryCount)) && me.lotteryCount < 3) {
				if (!me.rate()) {
					me.nowin();
					return;
				}
			} else if (me.lotteryCount >= 3) {
				me.nowin();
				return;
			}
			getResult({
				url: 'ceremony/lottery/bjws', 
				data: {oi: openid}, 
				jsonpCallback: 'callbackLotteryHandler',
				loading: true,
				success: function(data) {
					W['localStorage'].removeItem('cardid');
					if (data.result) {
						$('html').addClass('h-didi').find('.hidden').removeClass('hidden');
						$.fn.cookie(me.key, ++ me.lotteryCount, expires_in);
						$('#award-num').text(data.pn || '');
					} else {
						me.nowin();
					}
				},
				error: function() {
					$('html').addClass('h-didi h-didi-none').find('.hidden').removeClass('hidden');
					H.dialog.tips.open();
				}
			});
		},
		
		nowin: function() {
			$('html').addClass('h-didi h-didi-none').find('.hidden').removeClass('hidden');
		},
		
		award: function(mobile, $bindUI) {
			getResult({
				url: 'ceremony/award', 
				data: {
					oi: openid,
					ph: mobile
				}, 
				jsonpCallback: 'callbackAwardHandler',
				loading: true,
				bindUI: $bindUI,
				success: function(data) {
					if (data.result !== 1) {
						alert(data.message || '领奖失败，请重试');
						return;
					}
					$('#didi-award').addClass('awarded');
					$('.mobile-text').text(mobile);
					$.fn.cookie(shaketv_appid + '_mobile', mobile, expires_in);
				},
				error: function() {
					H.dialog.tips.open();
				}
			});
		}
	
	};
	
})(Zepto);

$(function() {
	H.didi.init();
});