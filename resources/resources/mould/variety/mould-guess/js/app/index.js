$(function(){
  	getResult('api/comments/topic/round', {oi:openid}, 'callbackCommentsTopicInfo',true);
	shownewLoading();
	$('.btn-join').click(function(e) {
		e.preventDefault();
		if($(this).hasClass("requesting")){
			return;
		}
		$(this).addClass("requesting");
		toUrl('comment.html');
	});

});
window.callbackCommentsTopicInfo = function(data){
		var width = document.documentElement.clientWidth,
		height = document.documentElement.clientHeight;
		Img = new Image();
		Img.src = data.items[0].im;
		$('.ad-box').css({
			'background-image' : 'url('+Img.src+')' ,
			'background-repeat': 'no-repeat',
			'background-size': 'cover',
			'background-position':'center',
			'overflow': 'hidden',
			'opacity': '1'
		});
};

