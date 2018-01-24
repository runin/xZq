/**
 * Created by Administrator on 2014/7/27.
 */
var babyInfoUuid = getQueryString('babyInfoUuid');
$(function() {
	babyInfo();
	$("#btn-share").click(function() {
		$("#div-share-box").removeClass("none");
	});
	$("#div-share-box").click(function() {
		$("#div-share-box").addClass("none");
	});
});

// 页面进来需要请求
function babyInfo() {
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "baby/vote",
		data : {
			babyInfoUuid : babyInfoUuid,
			openid : openid
		},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackHandler",
		success : function(data) {
			if(data.result){
				$("#bigPhoto").attr("src", data.babyInfoDto.bigPhoto);
				$("#name").empty().html(data.babyInfoDto.name);
				$("#introduction").empty().html(data.babyInfoDto.introduction);
				$("#ticket").empty().html(data.babyInfoDto.totalTicketNumber);
				if(data.babyInfoDto.vote){
					$("#btn-vote-ticket").removeAttr("href");
					$("#btn-vote-ticket").empty().html("已投票");
					$("#btn-vote-ticket").removeClass("tpbtn").addClass("tpbtned");
				}
				$("#share-ticket").removeClass("none");
				$("#baby-loading").addClass("none");
			}else{
				var url = "index.html";
				if (gefrom != null && gefrom != '') {
					url = url + "?gefrom=" + gefrom;
				}
				location.href= url;
			}
		},
		error : function() {
			$("#share-ticket").removeClass("none");
			$("#baby-loading").addClass("none");
			alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
}

function voteBaby() {
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "baby/yaoVote",
		data : {
			babyInfoUuid : babyInfoUuid,
			from : gefrom,
			openid : openid
		},
		dataType : "jsonp",
		jsonp : "callback",// 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		jsonpCallback : "callbackHandler",// 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		success : function(data) {
			if (data.result) {
				//摇进来的是+2票，分享的就是+1
				var ticketNum = 2;
				if(gefrom != null && gefrom != '')
					ticketNum = 1;
				$("#btn-vote-ticket").empty().html("已投票");
				$("#btn-vote-ticket").removeAttr("href");
				$("#ticket").html(parseInt($("#ticket").html()) + ticketNum);
				$("#btn-vote-ticket").removeClass("tpbtn").addClass("tpbtned");
			} else
				alert(data.message);
		},
		error : function() {
			alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
}