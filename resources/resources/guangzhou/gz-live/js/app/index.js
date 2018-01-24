$(function() {
	imgReady(index_bg, function() {
		$('#tab').removeClass('none').addClass('bounce-in-up');
		$('#jifen').attr('href', "user.html");

	});
	$('#comments').click(function(){
		toUrl('comments.html');
	});
	
	$("#rule").click(function(e){
		e.preventDefault();
		H.dialog.rule.open();
	});
	
	var share = getQueryString("from");
	if(share == "share"){
		$("#from").removeClass('none');
		setTimeout(function(){
				$("#from").addClass('rotate');
				setTimeout(function(){
				$("#index").removeClass('none');
				$("#from").addClass('none');
			},2000);
		},4000);
	}else{
		$("#index").removeClass('none');
	}

	$('#try').click(function(e) {
		e.preventDefault();
		$("#from").addClass('rotate');
		setTimeout(function(){
			$("#index").removeClass('none');
			$("#from").addClass('none');
		},2000);
	});

	var cbUrl = window.location.href;
	if(cbUrl.indexOf('cb41faa22e731e9b') < 0 ){
		$('#div_subscribe_area').css('height', '0');
	} else {
		$('#div_subscribe_area').css('height', '50px');
	};

});
