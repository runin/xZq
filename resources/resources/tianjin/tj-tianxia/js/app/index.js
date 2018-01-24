$(function() {
	$('#lottery').click(function(){
        $(this).addClass("pulse");
        setTimeout(function(){
            toUrl("lottery.html");
        },1000);
	});
    $('#question').click(function(){
        $(this).addClass("pulse");
        setTimeout(function(){
            toUrl("question.html");
        },1000);
    });
    $('#record').click(function(){
        $(this).addClass("pulse");
        setTimeout(function(){
            toUrl("record.html");
        },1000);
    });
	
	$("#rule").click(function(e){
		e.preventDefault();
        $(this).addClass("pulse");
        setTimeout(function(){
            H.dialog.rule.open();
            $(this).removeClass("pulse");
        },1000);
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
        $(".index-btn").css("margin-bottom","2%");
	};

});
