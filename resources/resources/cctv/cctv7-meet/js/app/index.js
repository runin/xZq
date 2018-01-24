$(function(){
	showLoading();
	var width = document.documentElement.clientWidth,
	height = document.documentElement.clientHeight,
	Img = new Image();
	Img.src = 'images/cover.jpg';

	Img.onload = function (){
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
		hideLoading();
		$('footer').css('opacity', '1');
		setTimeout(function() {
			toUrl('main.html')
		}, 5000);
	};
	$('.pre-ad').click(function(e) {
		e.preventDefault();
		toUrl('main.html');
	});
});