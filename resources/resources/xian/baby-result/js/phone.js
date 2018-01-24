function submitPhone() {
	var phone = $("#phone").val();
	if (phone == '' || phone.length != 11) {
		alert("请输入正确的手机号码！");
		$("#phone").focus();
		return;
	}
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "signin/info",
		data : {
			openid : openid,
			phone : $("#phone").val()
		},
		dataType : "jsonp",
		jsonp : "callback",// 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		jsonpCallback : "callbackHandler",// 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		success : function(data) {
			if (data.result) {
				var url = "index.html";
				if (gefrom != null && gefrom != '') {
					url = url + "?gefrom=" + gefrom;
				}
				location.href= url;
			}
		},
		error : function() {
//			alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
}