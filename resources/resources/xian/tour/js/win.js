var signinPrizeRecordUuid = getQueryString('signinPrizeRecordUuid');
$(function() {
	$("#btn-share").click(function() {
		share('index.html');
	});
	
	$('#btn-submit').click(function(e) {
		submitAward();
	});
	
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "signin/prize",
		data : {
			openid : openid,
			signinPrizeRecordUuid : signinPrizeRecordUuid
		},
		dataType : "jsonp",
		jsonp : "callback",// 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		jsonpCallback : "callbackHandler",// 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		success : function(data) {
			if (data.code == 0) {
				$("#prize-image").attr('src',data.prizeImage);
				$("#prize").empty().html(data.prizeName+data.prizeCount+data.prizeUnit);
				if (data.phone != '')
					$("#phone").val(data.phone);
				$("#btn-submit").removeClass("none");
				$("#prize-info").removeClass("none");
				$("#baby-loading").addClass("none");
			} else if (data.code == 1) {
				$("#all").hide();
				alert(data.message);
				var url = "index.html";
				if (gefrom != null && gefrom != '') {
					url = url + "?gefrom=" + gefrom;
				}
				//location.href= url;
			} else if (data.code == 4) {
				 $("#prize-info-step1").addClass("none");
				 $("#prize-info-step2").removeClass("none");
				 $("#prize-phone").val(data.phone);
				 $("#prize-info").removeClass("none");
				 $("#baby-loading").addClass("none");
			}
		}
	});
});

window.submitAward = function() {
	var phone = $.trim($("#phone").val());
	if (phone == '' || phone.length != 11) {
		alert("请输入正确的手机号码！");
		$("#phone").focus();
		return;
	}
	
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "signin/award",
		data : {
			openid : openid,
			signinPrizeRecordUuid : signinPrizeRecordUuid,
			phone : phone
		},
		dataType : "jsonp",
		jsonp : "callback",// 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		jsonpCallback : "callbackHandler",// 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		success : function(data) {
			if (data.code == 0) {
				$("#prize-info-step1").addClass("none");
				$("#prize-info-step2").removeClass("none");
				$("#prize-phone").empty().html(data.phone);
			} else if (data.code == 1) {
				alert(data.message);
			}
		}
	});
}
