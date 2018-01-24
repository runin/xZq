$(function() {
	if(!openid){
		showLoading();
		return;
	}
	$(".turn-box").click(function(e){
		e.preventDefault();
		if($(".nav-header").hasClass("slideOut")){
			$(".nav-header").removeClass("slideOut").addClass("slideIn");
			$(".title-logo").addClass("showme");
		}else{
			$(".nav-header").removeClass("slideIn").addClass("slideOut");
			$(".title-logo").removeClass("showme");
			if($(".hand").hasClass("handMove")){
				$(".hand").removeClass("handMove").addClass("none");
			}
			if($(".clicktip").hasClass("clickMe")){
				$(".clicktip").removeClass("clickMe");
			}
		}
	});

	$("#rule").click(function(e){
		e.preventDefault();
		H.dialog.rule.open();
	});
	$("#comments").click(function(e){
		e.preventDefault();
		toUrl("comments.html");
	});
	$(".btn-bao").click(function(e){
		e.preventDefault();
		toUrl("baoliao.html");
	});
	$(".btn-gift").click(function(e){
		e.preventDefault();
		toUrl("gift.html");
	});
	$(".btn-submit").click(function(e){
		getResult('api/entryinfo/personcount', {
			openid: openid
		}, 'callbackClueSaveHandler',true);
	});
	
	var share = getQueryString("from");
	if(share == "share"){
        H.dialog.guide.open();
	}
	W.callbackActiveEntryPersoncountHandler = function(data){
		if(data.code == 0){
			if(data.result){
				toUrl("submit_success.html");
			}else{
				toUrl("submit.html");
			}
		}else{
			showTips("报名活动尚未开始");
		}
	}
});
