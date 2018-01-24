$(function() {
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "survey/prize",
		data : {
			surveyPrizelogUuid : getQueryString('surveyPrizelogUuid'),
			openid : openid
		},
		dataType : "jsonp",
		jsonp : "callback",// 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		jsonpCallback : "callbackHandler",// 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		success : function(data) {
			$("#survey_prize_loading").addClass("none");
			$("#cjbox_div").removeClass("none");
			if (data.code == 0) {
				//积分
				if (data.prizeType == 2) {
					$("#prize").empty().html(data.prizeName);
				} else {
					//实物
					$("#prize").empty().html(data.prizeName + data.prizeCount + data.prizeUnit);
				}
				//手机号码后面提示
				$("#win_prize_tip").empty().html(data.wpt);
				$("#phone").val(data.phone);
			} else if (data.code == 1) {
				alert(data.message);
				var url = "index.html";
				if (gefrom != null && gefrom != '') {
					url = url + "?gefrom=" + gefrom;
				}
				location.href = url;
			}
		},
		error : function() {
			alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
});


function submitAward() {
	var phone = $("#phone").val();
	if (phone == '' || phone.length != 11) {
		alert("请输入正确的手机号码！");
		$("#phone").focus();
		return;
	}
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "survey/award",
		data : {
			openid : openid,
			surveyPrizelogUuid : getQueryString('surveyPrizelogUuid'),
			phone : $("#phone").val()
		},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackHandler",
		success : function(data) {
			if (data.code == 0) {
				var url = "win_step2.html?surveyPrizelogUuid="+getQueryString('surveyPrizelogUuid');
				if (gefrom != null && gefrom != '') {
					url = url + "&gefrom=" + gefrom;
				}
				location.href = url;
			} else if (data.code == 1) {
				alert(data.message);
			}
		},
		error : function() {
			alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
}