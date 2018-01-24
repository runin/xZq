var signinPrizeRecordUuid = getQueryString('signinPrizeRecordUuid');
$(function() {
	$("#btn-share").click(function() {
		share('index.html');
	});
	getResult('signin/win', {signinPrizeRecordUuid: signinPrizeRecordUuid,openid: openid}, 'callbackSignWinHandler',true);
});

window.callbackSignWinHandler = function(data){
	if (data.code == 0) {
		$("#prize-image").attr('src',data.prizeImage);
		$("#prize").empty().html(data.prizeName+data.prizeCount+data.prizeUnit);
		if (data.phone != '')
			$("#phone").val(data.phone);
		$("#btn-submit").removeClass("none");
		$("#prize-info").removeClass("none");
	} else if (data.code == 1) {
		$("#all").hide();
		alert(data.message);
		backUrl("index.html");
	} else if (data.code == 4) {
		 $("#prize-image").attr('src',data.prizeImage);
		 $("#prize").empty().html(data.prizeName+data.prizeCount+data.prizeUnit);
		 $("#prize-phone").empty().html(data.phone);
		 $("#prize-info-step1").addClass("none");
		 $("#prize-info-step2").removeClass("none");
		 $("#prize-info").removeClass("none");
	}
}

var submitAward = function() {
	var phone = $("#phone").val();
	if (phone == '' || phone.length != 11) {
		alert("请输入正确的手机号码！");
		$("#phone").focus();
		return;
	}
	getResult('signin/winaward', {signinPrizeRecordUuid: signinPrizeRecordUuid,openid: openid,phone:phone}, 'callbackSignWinawardHandler',false);
}

window.callbackSignWinawardHandler = function(data){
	if (data.code == 0) {
		$("#prize-info-step1").addClass("none");
		$("#prize-info-step2").removeClass("none");
		$("#prize-phone").empty().html(data.phone);
	} else if (data.code == 1) {
		alert(data.message);
	}
}