$(function(){
	shownewLoading();
	var Img = new Image();
		Img.src = "images/index-title.jpg";
		Img.onload = function (){
			$('.ad-box').css({
				'opacity': '1'
			});
			hidenewLoading();
		};
	$('i').click(function(e) {
		e.preventDefault();
		toUrl('lottery.html');
	});
});

