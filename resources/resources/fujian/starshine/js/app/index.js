$(function(){
	 getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler');
	shownewLoading();
	$('.pre-ad').click(function(e) {
		e.preventDefault();
		toUrl('comment.html');
	});
	$('.jump').click(function(e) {
		e.preventDefault();
		toUrl('comment.html');
	});

});
window.callbackLinesDiyInfoHandler = function(data){
	if(data&&data.code == 0&&data.gitems){
		var width = document.documentElement.clientWidth,
		height = document.documentElement.clientHeight;
		Img = new Image();
		Img.src = data.gitems[0].ib;
		Img.onload = function (){
			$('body').css({
				'width': width + 'px',
				'height': height + 'px'
			});
			$('.ad-box').css({
				'background-image' : 'url('+Img.src+')' ,
				'background-repeat': 'no-repeat',
				'background-size': 'cover',
				'overflow': 'hidden',
				'opacity': '1'
			});
			$('.pre-ad').css({
				'width':  width + 'px',
				'height': height + 'px'
			});
			var n = 3
			setInterval(function(){
				if(n>=0){
					$(".jump").html(n+"s");
				}else{
					toUrl('comment.html');
				}
				n--;
			},1000);
			hidenewLoading();
		};
	}else{
		hidenewLoading();
	}
}
