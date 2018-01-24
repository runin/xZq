$(function() {
	$('#date').text(getQueryString('date'));
	$('#title').text(getQueryString('title'));
	
	$('.btn-backto').click(function(e) {
		e.preventDefault();
		
		window.location.href = 'index.html';
	});
	
	$('.btn-share').click(function(e) {
		e.preventDefault();
		
		share('index.html');
	});
	
});

