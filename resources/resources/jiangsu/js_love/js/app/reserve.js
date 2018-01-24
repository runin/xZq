(function($) {
	H.reserve = {
		reserveFlag: 0,
		maxReserveNum: 2,
		swiperContainer: null,
		failNum: parseInt($.fn.cookie(mpappid + '_failNum')) || 0,
		init: function () {
    		this.event();
    		this.resize();
    		shownewLoading(null, '预约查询中...');
			getResult('api/recommendpro/programlist', {}, 'callbackApiRedProlistHandler');	
		},
		resize: function() {
			var winW = $(window).width(), winH = $(window).height();
			$('.bg').css({ 'height': winH });
		},
		event: function() {
			var me = this;
            $('body').delegate('.swiper-slide a', 'click', function(e) {
				e.preventDefault();
				var that = this, reserveid = $(this).attr('data-reserveid') || '', date = $(this).attr('data-date') || '';
				if ($(this).hasClass('open')) {
					toUrl('lottery.html');
					return;
				};
				if ($(this).hasClass('reserved')) return;
				if ($(this).hasClass('reserving')) return;
				$(this).removeClass().addClass('reserving');
				shaketv.reserve_v2({
					tvid: yao_tv_id,
					reserveid: reserveid,
					date: date
				}, function(d){
					// alert(JSON.stringify(d));
					if (d.errorCode == '0' || d.errorCode == '-1007') {
						$(that).removeClass().addClass('reserved');
						if ($('.reserved').length < me.maxReserveNum) {
							setTimeout(function(){
								me.swiperContainer.slideNext();
							}, 800);
						}
					} else if (d.errorCode == '-1002') {
						$(that).removeClass().addClass('reserve');
					} else {
						// $(that).removeClass().addClass('reserve');
						me.failNum++;
						$(that).removeClass().addClass('reserved');
						if ($('.reserved').length < me.maxReserveNum) {
							setTimeout(function(){
								me.swiperContainer.slideNext();
							}, 800);
						}
						$.fn.cookie(mpappid + '_failNum', me.failNum, {expires: 0.5});
					}
					var reservedNum = $('.reserved').length;
					$('.reserved-num').text(reservedNum);
					if (reservedNum >= me.maxReserveNum) {
						$('.reserved').addClass('open');
					} else {
						$('.reserved').removeClass('open');
					}
				});
            });
		},
		fillResult: function(data) {
			var me = this, t = simpleTpl(), items = data.items || [], length = items.length, nowTime = timeTransform(data.cut), loadNum = 0;
			for (var i = 0; i < length; i ++) {
                if(comptime(nowTime, items[i].reserveDate + ' ' + items[i].pbt) > 0){
                	loadNum++;
					t._('<section class="swiper-slide slide' + i + '" id="reserve' + i + '">')
						._('<section class="image-wrapper"><p></p><img class="swiper-lazy" src="./images/reserve-default.png" data-src="' + items[i].isb + '"></section>')
						._('<a href="javascript:;" data-reserveid="' + items[i].reserveNo + '" data-date="' + items[i].reserveDate.replace(/-/g, '') + '" data-collect="true" data-collect-flag="btn-reserve" data-collect-desc="预约按钮"><i></i></a>')
					._('</section>')
                }
			};
			$('.swiper-wrapper').html(t.toString());
			if (loadNum != 0) {
				if (loadNum < this.maxReserveNum) this.maxReserveNum = loadNum;
				if($.fn.cookie(mpappid + '_failNum') >= loadNum) toUrl('lottery.html');
				$('.total-num').text(loadNum);
				$('.swiper-control').animate({'opacity':'1'}, 500);
			    var swiper = new Swiper('.swiper-container', {
			        pagination: '.swiper-pagination',
			        nextButton: '.swiper-button-next',
			        prevButton: '.swiper-button-prev',
			        slidesPerView: 1,
			        paginationClickable: true,
			        keyboardControl: true,
			        spaceBetween: 100,
			        speed: 600,
			        effect: 'coverflow',
			        coverflow: {
			        	rotate: -30,
			            slideShadows : false
			        },
			        iOSEdgeSwipeDetection : true,
			        preloadImages: false,
			        lazyLoading: true,
					onSlideChangeEnd: function(swiper) {
						$('.swiper-slide').removeClass('boom');
						$('.slide' + parseInt(swiper.activeIndex)).addClass('boom');
					}
			    });
			    me.swiperContainer = swiper;
				this.checkReserve(this.reserveFlag, data);
			} else {
				// showTips('节目预约不存在<br>请管理员检查配置');
				toUrl('lottery.html');
			}
		},
		checkReserve: function(i, data) {
			var me = this, items = data.items || [], length = items.length, reserveSelect = '#reserve' + i + ' a';
			shaketv.preReserve_v2({
				tvid: yao_tv_id,
				reserveid: items[me.reserveFlag].reserveNo,
				date: items[me.reserveFlag].reserveDate.replace(/-/g, '')
			}, function(d){
				if(d.errorCode == '-1007') {
					$(reserveSelect).removeClass().addClass('reserved');
				} else {
					$(reserveSelect).removeClass().addClass('reserve');
				}
				var reservedNum = $('.reserved').length;
				$('.reserved-num').text(reservedNum);
				// if (reservedNum >= me.maxReserveNum) {
				// 	$('.reserved').addClass('open');
				// 	toUrl('answer.html');
				// } else {
				// 	$('.reserved').removeClass('open');
				// }
				if ((reservedNum + me.failNum) >= me.maxReserveNum) {
					toUrl('lottery.html');
				} else {
					$('.swiper-slide a').removeClass('open');
				}
				me.reserveFlag++;
				if (me.reserveFlag < length) {
					me.checkReserve(me.reserveFlag, data);
				}
				if (length == me.reserveFlag) {
					$('.swiper-slide a, .reserve-tips').animate({'opacity':'1'}, 500);
					hidenewLoading();
				}
			});
		}
	};

	W.callbackApiRedProlistHandler = function(data) {
		if (data.code == 0) {
			H.reserve.fillResult(data);
		} else {
			toUrl('lottery.html');
		}
	};
})(Zepto);                             

$(function(){
	H.reserve.init();
});