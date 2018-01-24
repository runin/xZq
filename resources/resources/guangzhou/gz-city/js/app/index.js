$(function() {
	$('#comments').click(function(){
		if(openid == "" || openid == null){
			return;
		}
		location.href = 'comments.html';
	});
	
	$("#rule").click(function(e){
		e.preventDefault();
		H.dialog.rule.open();
	});
	
	var share = getQueryString("from");
	if(share == "share"){
        H.dialog.guide.open();
	}

	var cbUrl = window.location.href;
	if(cbUrl.indexOf('cb41faa22e731e9b') < 0 ){
		$('#div_subscribe_area').css('height', '0');
	} else {
		$('#div_subscribe_area').css('height', '50px');
	};

    $(".city-logo").addClass("slideInDown");

    setTimeout(function(){
        $(".main").find("a").removeClass("none");
    },1500);

});
