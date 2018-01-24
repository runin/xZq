(function($) {
	H.reserve = {
		reserveFlag: 0,
		init: function () {
			showLoading();
			var me = this;
			me.resize();
			getResult('index/programlist', {}, 'callbackRcommendProgramlistHander', true, this.$dialog);
		},
		event: function() {
			var me = this;
			$(".btn-lottery").click(function(e) {
				e.preventDefault();
				showLoading();
				toUrl('lottery.html');
			});
			$(".reserve").click(function(e) {
				e.preventDefault();
				var me = this, reserveid = $(this).attr('data-reserveid') || '';
				if (reserveid == '' || $(this).hasClass('reserveOK')) {
					return;
				};
				$(this).text('预约中...');
				shaketv.reserve(yao_tv_id, reserveid, function(d){
					if (d.errorCode == 0 || d.errorCode == -1007) {
						$(me).addClass('reserveOK').html('已预约');
					} else {
						$(me).removeClass('reserveOK').html('预约');
					};
					var reserveNum = $('.reserveOK').length,
						showNum = $('.swiper-slide').length;
					$('.reserveOKnum').text(reserveNum);
					if (reserveNum != showNum) {
						$('.reserve').removeClass('none');
					} else {
						$('.btn-lottery').removeClass('none').addClass('bounceInUp');
						setTimeout(function() {
							$('.reserve').addClass('none');
						}, 800);
					};
				});
			});
		},
		fillResult: function(data) {
			var me = this, t = simpleTpl(),
				items = data.items || [],
				length = items.length;
			for (var i = 0; i < length; i ++) {
				t._('<div class="swiper-slide" id="reserve' + i + '">')
					._('<img src="' + items[i].is + '">')
					._('<span class="reserve" data-reserveid="' + items[i].pd + '" data-collect="true" data-collect-flag="js-lizhi-reserve-reservebtn" data-collect-desc="预约页-预约按钮">预约</span>')
				._('</div>')
			};
			$('.swiper-wrapper').html(t.toString());
			$('.reserveTotalnum').text(length);
			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				paginationClickable: true,
				spaceBetween: 30,
				centeredSlides: true,
				autoplay: 0,
				autoplayDisableOnInteraction: false
			});
			me.event();
			// me.fillReserve(data);
			me.lookReserve(me.reserveFlag, data);
		},
		fillReserve: function(data) {
			var me = this, items = data.items || [],
				length = items.length, i = 0;
			for (var i = 0; i < length; i ++) {
				var reserveSelect = '#reserve' + i + ' .reserve';
				shaketv.preReserve(yao_tv_id, items[i].pd, function(d){
					if(d.errorCode == -1007) {
						$(reserveSelect).addClass('reserveOK').html('已预约');
					} else {
						$(reserveSelect).removeClass('reserveOK').html('预约');
					};
					var reserveNum = $('.reserveOK').length,
						showNum = $('.swiper-slide').length;
					$('.reserveTotalnum').text(showNum);
					$('.reserveOKnum').text(reserveNum);
					if (reserveNum != showNum) {
						$('.reserve').removeClass('none');
					} else {
						$('.btn-lottery').removeClass('none').addClass('bounceInUp');
						setTimeout(function() {
							$('.reserve').addClass('none');
						}, 800);
					};
				});
				if (length - i == 1) {
					$('.reserveBox').animate({'opacity':'1'}, 2000);
				};
			};
		},
		lookReserve: function(i, data) {
			var me = this, items = data.items || [],
				length = items.length, reserveSelect = '#reserve' + i + ' .reserve';
			shaketv.preReserve(yao_tv_id, items[me.reserveFlag].pd, function(d){
				if(d.errorCode == -1007) {
					$(reserveSelect).addClass('reserveOK').html('已预约');
				} else {
					$(reserveSelect).removeClass('reserveOK').html('预约');
				};
				var reserveNum = $('.reserveOK').length,
					showNum = $('.swiper-slide').length;
				$('.reserveTotalnum').text(showNum);
				$('.reserveOKnum').text(reserveNum);
				if (reserveNum != showNum) {
					$('.reserve').removeClass('none');
				} else {
					$('.btn-lottery').removeClass('none').addClass('bounceInUp');
					setTimeout(function() {
						$('.reserve').addClass('none');
					}, 800);
				};
				me.reserveFlag++;
				if (me.reserveFlag < length) {
					me.lookReserve(me.reserveFlag, data);
				};
				if (length == me.reserveFlag) {
					$('.reserveBox').animate({'opacity':'1'}, 1500);
					hideLoading();
				};
			});
		},
		resize: function() {
			var winW = $(window).width(),
				winH = $(window).height();
			$('body').css({
				'width': winW,
				'height': winH
			});
		}
	};

	W.callbackRcommendProgramlistHander = function(data) {
		if (data.code == 0) {
			H.reserve.fillResult(data);
		};
	};
})(Zepto);                             

$(function(){
	H.reserve.init();
});