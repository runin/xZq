$(function() {
	imgReady(index_bg, function() {
		$('html').css('background-color', 'rgba(53,62,132,1)');
		$('body').css('background-size', document.documentElement.clientWidth + 'px auto');
		$('body').css('background-image', 'url('+ index_bg +')');
		$('#tab').removeClass('none').addClass('bounce-in-up');

		imgReady(title_img, function() {
			$('#logo').css('background-image', 'url('+ title_img +')').addClass('swing');
		});
		$("#btn-begin").click(function(){
			if(openid == "" || openid == null){
				return;
			}
			toUrl("answer.html");
		});
	});
});