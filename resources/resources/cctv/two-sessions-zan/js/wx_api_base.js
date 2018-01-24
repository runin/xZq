var yao_scope = 'base';
var openid = $.fn.cookie(shaketv_appid + '_openid');
var expires_in = {expires: 30};
var redirect_url = window.location.href;

var authorize = function() {
	if (!window['shaketv']) {
		return false;
	}
	
	shaketv.authorize(shaketv_appid, yao_scope, function(data) {
		if (data.errorCode == 0) {
			get_info(data.code);
		} else {
			init && init();
		}
	});
	
};

var get_info = function(code) {
	window.callbackShaketvYaotvUserinfoHandler = function(data) {}; 
	$.ajax({
		type : 'GET',
		async : false,
		url : domain_url + 'shaketv/yaotv/userinfo',
		data: {code: code},
		dataType : "jsonp",
		jsonpCallback : 'callbackShaketvYaotvUserinfoHandler',
		success : function(data) {
			if (typeof data.errcode != 'undefined' && data.errcode > 0) {
				init && init();
				return;
			}
			openid = data.openid;
			data.openid && $.fn.cookie(shaketv_appid + '_openid', data.openid, expires_in);
			
			init && init();
		},
		error: function() {
			init && init();
		}
	});
};

var check_weixin_login = function() {
	if (!openid) {
		authorize();
	} else {
		$.fn.cookie(shaketv_appid + '_openid', openid, expires_in);
		
		init && init();
	}
};

var check_version = function() {
	$.ajax({
		type : "get",
		async : true,
		url : domain_url + "version/check",
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackVersionHandler",
		success : function(data) {
			if (!data.result){
				window.location.href = data.redirect;
				return;
			}
			
			check_weixin_login();
		},
		error : function() {
			check_weixin_login();
		}
	});
};

$(function() {
	if (!/micromessenger/i.test(navigator.userAgent)) {
		window.location.href = 'wx.html';
	} else {
		check_version();
	}
});
