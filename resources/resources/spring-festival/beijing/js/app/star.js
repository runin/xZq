(function() {
	
	H.star = {
		$stars: $('#star-list'),
		$mobile: $('#mobile'),
		starId: getQueryString('id'),
		key: shaketv_appid + '_bjws_lottery',
		lotteryCount: null,
		init: function() {
			if (!openid || !nickname) {
				return;
			}
			
			this.lotteryCount = $.fn.cookie(this.key);
			
			this.lottery();
			
			this.fillData();
			
			this.$mobile.val($.fn.cookie(shaketv_appid + '_mobile') || '');
			
			this.event();
		},
		
		fillData: function() {
			var t = simpleTpl(),
				stars = W['stars'] || [];
			
			for (var i = 0, len = stars.length; i < len; i ++) {
				t._('<li data-id="'+ (i + 1) +'">')
					._('<audio preload="auto" class="audio none" src="'+ stars[i].wish +'"></audio>')
					._('<div class="avatar">')
						._('<i class="icon-voice none"></i>')
						._('<img src="'+ stars[i].avatar +'" />')
					._('</div>')
					._('<span>'+ stars[i].name +'</span>')
				._('</li>');
			}
			this.$stars.html(t.toString()).css('minHeight', $(window).height() * 0.62);
		},
		
		event: function() {
			var me = this;
			this.$stars.delegate('li', 'click',function(e) {
				var $tg = $(this),
					$siblings = $tg.siblings('li');
				
				if ($siblings.hasClass('scale')) {
					return;
				}
				$siblings.removeClass('selected');
				$(this).addClass('selected scale');
				
				var $audio = $(this).find('audio');
				$audio.get(0).play();
				$audio.on('playing', function() {
					console.log('playing')
				}).on('ended', function() {
					console.log('ended');
					$audio.get(0).pause();
					$tg.removeClass('scale');
				});
				
			});
			
			$('#btn-sendcard').click(function(e) {
				e.preventDefault();
				
				var $selected = me.$stars.find('.selected');
				if ($selected.length == 0) {
					alert('请先选择您喜欢的明星');
					return false;
				}
				me.starId = $selected.attr('data-id');
				window.location.href = 'card.html?id=' + me.starId;
			});
			
			var $box = $('#bomb-box'),
				$baozhu = $('#baozhu');
			
			$baozhu.addClass('no-border').click(function(e) {
				me.lottery();
				
				/*
				$box.addClass('fire');
				setTimeout(function() {
					$box.attr('class', 'bomb-box bombing');
					setTimeout(function() {
						var $html = $('html');
						
						$html.attr('class', 'h-didi');
						if ($html.attr('tpcls')) {
							$html.attr('class', $html.attr('tpcls'));
						}
					}, 600);
				}, 1000); */
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
			
			$('.btn-card').click(function(e) {
				e.preventDefault();
				
				$('html').attr('class', 'h-star');
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

			window.callbackLotteryHandler = function() {};
			getResult({
				url: 'ceremony/lottery/bjws', 
				data: {oi: openid}, 
				jsonpCallback: 'callbackLotteryHandler',
				loading: true,
				success: function(data) {
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
	H.star.init();
});