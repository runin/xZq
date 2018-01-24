$(function() {
	var title = getQueryString('title'),
		date = getQueryString('date');
	
	$('#title').text(date + '  ' + title);
	
	$('.btn-backto').click(function(e) {
		e.preventDefault();
		
		window.location.href = 'signup.html';
	});
	
	$('.btn-share').click(function(e) {
		e.preventDefault();
		
		share('signup.html');
	});
	
});

