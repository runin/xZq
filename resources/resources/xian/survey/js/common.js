var resourceType = "1";
var share_img, share_title, share_desc, share_group;
var COMMON_SYSTEM_ERROR_TIP = "系统繁忙，请稍候再试！";
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
var callbackHandler = function(data) {
};
var callbackDataHandler = function(data) {
};
var callbackUserHandler = function(data) {
};

//在需要分享后，返回首页的页面运行此方法
var from = getQueryString("from");
var gefrom = getQueryString("gefrom");
if (from != null && from != ''){
	gefrom = from;
}
var noRunShare = $("#noRunShare").val();
if (!noRunShare) {
	if (from != null && from != '' && window.location.pathname.indexOf("index.html") < 0) {
		location.href = "index.html?from="+from;
	}
}
function toUrl(url) {
	if (from != null && from != '') {
		if (url.indexOf(".html?")>0) {
			url = url + "&gefrom=" + from;
		} else {
			url = url + "?gefrom=" + from;
		}
	}
	if (gefrom != null && gefrom != '') {
		if(url.indexOf("gefrom=")<0){
			if (url.indexOf(".html?")>0) {
				url = url + "&gefrom=" + gefrom;
			} else {
				url = url + "?gefrom=" + gefrom;
			}
		}
	}
	setTimeout("window.location.href='" + url + "'", 5);
}


$(function() {
	$("script").each(function(i, item) {
		var scr = $(this).attr("src");
		$(this).attr("src", scr + "?v=" + version);
	});
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "version/check",
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackVersionHandler",
		success : function(data) {
			if(!data.result){
				location.href = data.redirect;
			}
			share_img = data.si;
			share_title = data.st;
			share_desc = data.sd;
			share_group = data.sgt;
		},
		error : function() {
		}
	});
	
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "user/save",
		data : {
			openid : openid,
			type : resourceType,
			userProfile : userProfile
		},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackUserHandler",
		success : function(data) {
		},
		error : function() {
		}
	});
});
