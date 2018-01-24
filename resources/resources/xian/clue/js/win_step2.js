var callbackClueAwardHandler = function(data) {
};
function submitAward(){
    var phone = $("#phone_input").val();
    if(phone=='' || phone.length != 11){ alert("请输入正确的手机号码！"); $("#phone_input").focus();return;}
    	$.ajax({
    		type : "get",
    		async : false,
    		url : domain_url + "clue/award",
    		data:{openid:openid,cluePrizelogUuid:getQueryString('cluePrizelogUuid'),phone:$("#phone_input").val()},
    		dataType : "jsonp",
    		jsonp : "callback",
    		jsonpCallback : "callbackClueAwardHandler",
    		success : function(data) {
    			if(data.code==0){
    				$("#mod_phone_box").addClass("none");
    				$("#phone").empty().html($("#phone_input").val());
					$("#btn_box_div").removeClass("none");
					$("#phone_html").removeClass("none");
					
                }else if(data.code==1){
                    alert(data.message);
                }
    		},
    		error : function() {
    			alert(COMMON_SYSTEM_ERROR_TIP);
    		}
    	});
}
$(function() {
	$("#btn-share").click(function() {
		$("#div-share-box").show();
	});
	$("#div-share-box").click(function() {
		$("#div-share-box").hide();
	});
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "clue/award",
		data : {
			cluePrizelogUuid : getQueryString('cluePrizelogUuid'),
			openid : openid
		},
		dataType : "jsonp",
		jsonp : "callback",// 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		jsonpCallback : "callbackClueAwardHandler",// 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		success : function(data) {
			$("#clue_prize_loading").addClass("none");
			$("#cjbox_div").removeClass("none");
			if (data.code == 0) {
				$("#prize").empty().html(
						data.prizeName + data.prizeCount + data.prizeUnit);
				$("#phone").empty().html(data.phone);
				if(!data.phone){
					$("#btn_box_div").addClass("none");
					$("#phone_html").addClass("none");
    				$("#mod_phone_box").removeClass("none");
					alert("请补充手机号码，以便通知您领奖");
					$("#phone_input").focus();
				}else{
					$("#btn_box_div").removeClass("none");
				}
			} else if (data.code == 1) {
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