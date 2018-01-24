$(function() {
	var type = getQueryString("type") || 1;
	if(type == 1){
		$("#xs-tip").removeClass("none");
	}else{
		$("#xr-tip").removeClass("none");
	}
	$(".btn-back").click(function(e){
		e.preventDefault();
		window.location.href ="index.html";
	});
});

