$(function() {
	$('#date').text(getQueryString('date'));
	$('#title').text(getQueryString('title'));
	$('#jf-tip').text(getQueryString('tip'));
	
	$('.btn-backto').click(function(e) {
		e.preventDefault();
		
		window.location.href = 'index.html';
	});
	
	$('.btn-share').click(function(e) {
		e.preventDefault();
		
		share('index.html');
	});
	
});

