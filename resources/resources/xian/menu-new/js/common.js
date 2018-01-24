var callbackHandler = function(data) {};
var callbackDataHandler = function(data) {};
var callbackUserHandler = function(data) {};
var share_img, share_title, share_desc, share_group;
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
