function submitPhone() {
	var phone = $("#phone").val();
	if (phone == '' || phone.length != 11) {
		alert("请输入正确的手机号码！");
		$("#phone").focus();
		return;
	}
	getResult('signin/info', {phone : $("#phone").val(),openid: openid}, 'callbackHandler',true);
}

window.callbackHandler = function(data){
	if (data.result) {
		backUrl("index.html");
	}
}