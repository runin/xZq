$(function() {
	imgReady(index_bg, function() {
		$('html').css('background-color', '#fce310');
		//$('body').css('background-size', document.documentElement.clientWidth + 'px auto');
		$('body').css('background-image', 'url('+ trophy_bg +')');
		$('#tab').removeClass('none').addClass('bounce-in-up');
		
		imgReady(title_img, function() {
			$('#logo').css('background-image', 'url('+ title_img +')').addClass('swing');
		});
	});
});
