$(function() {
	$('#jf-tip').text(getQueryString('tip'));
	$(".btn-back").click(function(){
		window.location.href = "index.html";
	});
});

