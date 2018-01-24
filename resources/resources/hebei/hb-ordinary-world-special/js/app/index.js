$(function(){
	shownewLoading();
	var width = document.documentElement.clientWidth,
	height = document.documentElement.clientHeight,
	Img = new Image();
	getResult('api/comments/topic/round', {oi: openid}, 'callbackCommentsTopicInfo',true);
	$('.pre-ad').click(function(e) {
		e.preventDefault();
		toUrl('enter.html');
	});
	$('i').click(function(e) {
		e.preventDefault();
		toUrl('enter.html');
	});
});
window.callbackCommentsTopicInfo = function(data){
	var width = document.documentElement.clientWidth,
		height = document.documentElement.clientHeight;
		Img = new Image();
	if(data.code == 0){
		if(data.items[0].im){
			Img.src = data.items[0].im;
		}else{
			Img.src = 'images/cover.jpg';
		}
	}else{
		Img.src = 'images/cover.jpg';
	}
	Img.onload = function (){
			$('body').css({
				'width': width + 'px',
				'height': height + 'px'
			});
			$('.ad-box').css({
				'background-image' : 'url('+Img.src+')' ,
				'background-repeat': 'no-repeat',
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
			setTimeout(function() {
				toUrl('enter.html')
			}, 4000);
		};
}