$(function() {
	shareFrom();
	$("#btn-share").click(function() {
		$("#div-share-box").show();
	});
	$("#div-share-box").click(function() {
		$("#div-share-box").hide();
	});
	$.ajax({
				type : "get",
				async : false,
				url : domain_url + "lottery/luckwheel/detail",
				data : {
					openid : openid,
					lotterySurveyPrizeRecordUuid : getQueryString('lotterySurveyPrizeRecordUuid')
				},
				dataType : "jsonp",
				jsonp : "callback",
				jsonpCallback : "callbackHandler",
				success : function(data) {
					if (data.code == 0) {
						$("#prize").empty().html(
								data.prizeName + data.prizeCount
										+ data.prizeUnit);
						$("#phone").empty().html(data.phone);
					} else if (data.code == 1) {
						location.href = "index.html";
					}
				},
				error : function() {
					alert(COMMON_SYSTEM_ERROR_TIP);
				}
			});
});