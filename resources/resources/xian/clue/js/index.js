var callbackClueHandler = function(data) {
};
var callbackUserPhoneHandler = function(data) {
};
function submitSurvey() {
	var content = $("#content").val();
	if (!content || content.length < 10) {
		alert("请输入爆料信息，长度最少10个字！");
		$("#content").focus();
		return;
	} else if (content.length > 200) {
		alert("爆料文字请不要超过200个字！");
		$("#content").focus();
		return;
	}
	var phone = $("#phone").val();
	if (phone == '' || phone.length != 11) {
		alert("请输入正确的手机号码！");
		$("#phone").focus();
		return;
	}
	var encodeStr = encodeURIComponent(content);
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "clue/save",
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackClueHandler",
		data : {
			openid : openid,
			phone : phone,
			content : encodeStr
		},
		success : function(data) {
			if (data.result) {
				alert("谢谢您提供爆料，下面进行抽奖");
				var url = "lottery.html";
				if (gefrom != null && gefrom != '') {
					url = url + "?gefrom=" + gefrom;
				}
				location.href = url;
			} else {
				alert(data.message);
			}
		},
		error : function() {
			alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
}
$(function() {
	$("#sed").click(function() {
		submitSurvey();
	});
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "user/"+openid+"/phone",
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackUserPhoneHandler",
		success : function(data) {
			$("#phone").val(data.result);
		},
		error : function() {}
	});
});