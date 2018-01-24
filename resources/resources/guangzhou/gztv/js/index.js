(function($) {
	
	H.index = {
		init: function() {
			H.utils.resize();
		}
	};
	
	H.answer = {
		$wrapper: $('#answer'),
		index: 0,
		expires: {expires: 7},
		SELECTED_CLS: 'selected',
		RESULT_CLS: 'result',
		DISABLED_CLS: 'disabled',
		VIEWRESULT_CLS: 'view-result',
		init: function() {
			H.utils.resize();
			this.event();
			var $btn = $('#btn-submit');
			this.index = $btn.attr('data-index');
			
			var answered = $.fn.cookie('answered'+ this.index);
			if (answered) {
				$('.item').eq(answered).addClass(this.SELECTED_CLS);
				$btn.addClass(this.VIEWRESULT_CLS).text('查看结果').removeClass(this.DISABLED_CLS);
			}
		},
		
		event: function() {
			var me = this,
				$btn = this.$wrapper.find('.btn-submit');
			
			this.$wrapper.find('.item').click(function(e) {
				e.preventDefault();
				
				if (me.$wrapper.hasClass(me.DISABLED_CLS) || $btn.hasClass(me.VIEWRESULT_CLS)) {
					return;
				}
				
				$btn.removeClass(me.DISABLED_CLS);
				me.$wrapper.find('.item').removeClass(me.SELECTED_CLS);
				$(this).addClass(me.SELECTED_CLS);
			});
			
			$btn.click(function(e) {
				e.preventDefault();
				
				if ($btn.hasClass(me.VIEWRESULT_CLS) && $.fn.cookie('answered'+ me.index) > -1) {
					window.location.href = 'success.html?result=' + $.fn.cookie('result'+ me.index) + '&lottery=' + $.fn.cookie('lottery'+ me.index);
					return;
				}
				
				var is_selected = me.isselected(), is_correct = me.iscorrect();
				if (!is_selected) {
					alert('请先选择答案');
					return false;
				}
				$btn.addClass(me.VIEWRESULT_CLS);
				$.fn.cookie('answered'+ me.index, $('.item').index($('.' + me.SELECTED_CLS)), me.expires);
				$.fn.cookie('result'+ me.index, is_correct, me.expires);
				
				if (is_correct) {
					getResult('gztv/business/lottery', {
						openid: openid,
						question_index: me.index
					}, 'callbackGztvLottery', true);
				} else {
					window.location.href = 'success.html?result=' + is_correct;
				}
			});
		},
		
		iscorrect: function() {
			return this.$wrapper.find('.' + this.RESULT_CLS).hasClass(this.SELECTED_CLS);
		},
		isselected: function() {
			return this.$wrapper.find('.' + this.SELECTED_CLS).length > 0;
		}
	};
	
	H.success = {
		$main: $('#main'),
		init: function() {
			H.utils.resize();
			
			var result = getQueryString('result'),
				lottery = getQueryString('lottery'),
				$h2 = this.$main.find('h2'),
				$p = this.$main.find('p'),
				txt = '';
			
			if (result == 'true') {
				txt = '回答正确';
				if (lottery == 1) {
					txt += '，恭喜您中奖！';
				} else {
					$p.text('很遗憾您未中奖，祝您好运。');
				}
			} else {
				txt = '回答错误，请您再接再励。';
				$p.addClass('none');
				this.$main.addClass('fail');
			}
			$h2.text(txt);
			this.$main.removeClass('none');
		}
	};
	
	H.sign = {
		init: function() {
			H.utils.resize();
			
			getResult('gztv/business/sign', {
				openid: openid
			}, 'callbackGztvSign', true);
		}
	};
	
	H.utils = {
		$main: $('#main'),
		resize: function() {
			var me = this,
				width = $(window).width(),
				height = $(window).height(),
				main_bg = 'images/bg.jpg';
			
			this.$main.css('minHeight', height);
			showLoading();
			imgReady(main_bg, function() {
				hideLoading();
				me.$main.css('background', '#F5CEEB url('+ main_bg +') no-repeat center 0')
						.css('background-size', width + 'px auto');
			});
		}
	};
	
	W.callbackGztvLottery = function(data) {
		$.fn.cookie('lottery'+ H.answer.index, data.lottery_code, H.answer.expires);
		window.location.href = 'success.html?result=' + H.answer.iscorrect() + '&lottery=' + data.lottery_code;
	};
	
	W.callbackGztvSign = function(data) {};
	
})(Zepto);

H.index.init();