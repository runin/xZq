(function($) {
	H.index = {
		countNum: 3,
		from: getQueryString('from') || '',
		cb41faa22e731e9b: getQueryString('cb41faa22e731e9b') || '',
		init: function () {
			var me = this;
			if (cb41faa22e731e9b != '') {
				cb41faa22e731e9b = '?cb41faa22e731e9b=' + cb41faa22e731e9b + '&from=' + from;
			} else {
				cb41faa22e731e9b = '?from=' + from;
			}
			me.preload();
			me.event();
		},
		event: function() {
			var me = this;
			$('.pre-ad').click(function(e) {
				e.preventDefault();
				toUrl('main.html');
			});
			$('a').click(function(e) {
				e.preventDefault();
				if (!$(this).hasClass('requesting')) {
					$(this).addClass('requesting');
					toUrl('main.html');
				};
			});
		},
		preload: function() {
			var me = this, loadImg = new Image()
				width = document.documentElement.clientWidth,
				height = document.documentElement.clientHeight;
			shownewLoading();
			loadImg.src = 'images/cover.jpg';
			loadImg.onload = function (){
				$('body').css({
					'width': width + 'px',
					'height': height + 'px'
				});
				$('.ad-box').css({
					'background': 'url(images/cover.jpg) no-repeat center center #b2801d',
					'background-size': 'cover',
					'width': width + 'px',
					'height': height + 'px',
					'overflow': 'hidden',
					'opacity': '1'
				});
				var cb41Url = window.location.href;
				if(cb41Url.indexOf('cb41faa22e731e9b') < 0 ){
					$('.pre-ad').css({
						'width':  width + 'px',
						'height': height + 'px'
					});
				} else {
					$('.pre-ad').css({
						'width':  width + 'px',
						'height': (height - 50) + 'px'
					});
				};
				hidenewLoading();
				$('footer').css('opacity', '1');
				var countInterval = setInterval(function() {
					if (me.countNum >= 0) {
						// $('.ad-box a').removeClass('none').text(me.countNum + 's后跳过');
						$('.ad-box a').removeClass('none').text('点此跳过');
						me.countNum--;
					} else {
						$('.ad-box a').addClass('none');
						clearInterval(countInterval);
						toUrl('main.html');
					}
				}, 1000);
			};
		}
	};
})(Zepto);                             

$(function(){
	H.index.init();
});