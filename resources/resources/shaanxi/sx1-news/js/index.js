$(function() {
	imgReady(index_bg, function() {
		$('html').css('background-color', '#f88d0a');
		$('body').css('background-size', document.documentElement.clientWidth + 'px auto');
		$('body').css('background-image', 'url('+ index_bg +')');
		$('#tab').removeClass('none').addClass('bounce-in-up');
		
		imgReady(title_img, function() {
			$('#logo').css('background-image', 'url('+ title_img +')').addClass('swing');
		});
	});
});
