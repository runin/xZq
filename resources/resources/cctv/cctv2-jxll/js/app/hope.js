(function($) {
	H.hope = {
		init: function() {
			var me = this, winW = $(window).width(), winH = $(window).height();
			this.event();
			$('body').css({
				'width': winW,
				'height': winH
			});
			this.swiperInit();
		},
		event: function() {
			var me = this;
			$('.btn-go2lottery').click(function(e) {
				e.preventDefault();
				toUrl('vote.html');
			});
			$('.btn-showlove').click(function(e) {
				e.preventDefault();
				shownewLoading(null, '请稍等...');
				location.href = 'http://ssl.gongyi.qq.com/m/weixin/detail.htm?showwxpaytitle=1&et=fx#p%3Ddetail%26id%3D6599';
			});
		},
		swiperInit: function() {
			scaleW = window.innerWidth / 320;
			scaleH = window.innerHeight / 480;
			var resizes = document.querySelectorAll('.resize');
			for (var j = 0; j < resizes.length; j++) {
				resizes[j].style.width = parseInt(resizes[j].style.width) * scaleW + 'px';
				resizes[j].style.height = parseInt(resizes[j].style.height) * scaleH + 'px';
				resizes[j].style.top = parseInt(resizes[j].style.top) * scaleH + 'px';
				resizes[j].style.left = parseInt(resizes[j].style.left) * scaleW + 'px';
			};
			var mySwiper = new Swiper('.swiper-container', {
				direction: 'vertical',
				onSlideChangeEnd: function(swiper) {
					var activeIndex = parseInt(mySwiper.activeIndex);
					if (activeIndex == 2) {
					} else {
					}
				}
			});
		}
	};
})(Zepto);

$(function() {
	H.hope.init();
});