$(function(){
	 getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler');
	shownewLoading();
	$('.ad-box').click(function(e) {
		e.preventDefault();
		toUrl('comment.html');
	});
	$('.jump').click(function(e) {
		e.preventDefault();
		toUrl('comment.html');
	})
});
window.callbackLinesDiyInfoHandler = function(data){
	if(data&&data.code == 0&&data.gitems){
		hidenewLoading();
		var width = document.documentElement.clientWidth,
		height = document.documentElement.clientHeight;
		Img = new Image();
		if(!data.gitems[0].ib){
			jump(3);
		}
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
				'background-position':'center top',
				'overflow': 'hidden',
				'opacity': '1'
			});
			$('.pre-ad').css({
				'width':  width + 'px',
				'height': height + 'px'
			});
			jump(3);
			
		};
		Img.onerror = function(){
			jump(3);
		};
	}else{
		hidenewLoading();
		jump(3);
	}
}
function jump(m){
	var n = m||3;
	setInterval(function(){
		if(n>=0){
			$(".jump").html(n+"s");
		}else{
			toUrl('yao.html');
		}
		n--;
	},1000);
}
