$(function() {
	imgReady(index_bg, function() {
		imgReady(title_img, function() {
			$('#logo').css('background-image', 'url('+ title_img +')').addClass('swing');
		});
	});
	$("#rule").click(function(){
	});
});

