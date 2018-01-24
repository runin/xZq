var profile_name = 'tencentvideo';
var interface_url = 'http://imp.qq.com';
var openid = null;
var expires_in = {expires: 30};
var redirect_url = window.location.href;
var access_token = null;
var refresh_token = null;
var expires_in = null;
var userProfile = null;
function get_cookie(c_name) {
	var c_end, c_start, c_value;
	if (document.cookie.length > 0) {
		userProfile = document.cookie;
		c_value = " " + document.cookie;
		c_start = c_value.indexOf(" " + c_name + "=");
		if (c_start === -1) {
			c_value = null;
		} else {
			c_start = c_value.indexOf("=", c_start) + 1;
			c_end = c_value.indexOf(";", c_start);
			if (c_end === -1) {
				c_end = c_value.length;
			}
			c_value = unescape(c_value.substring(c_start, c_end));
		}
	}
	return c_value;
}

var check_weixin_login = function() {
	if (!/micromessenger/i.test(navigator.userAgent)) {
		window.location.href = 'wx.html';
		return false;
	}
	openid = $.fn.cookie(shaketv_appid + '_openid');
	if (!openid) {
		window['shaketv'] && shaketv.authorize(shaketv_appid, yao_userinfo_scope, function(data) {
			if (data.errorCode == 0) {
				$.ajax({
					type : 'GET',
					async : false,
					url : domain_url + 'shaketv/yaotv/userinfo',
					data: {code: data.code},
					dataType : "jsonp",
					jsonp : 'callbackShaketvYaotvUserinfoHandler',
					success : function(data) {}
				});
			}
		});
	} else {
		$.fn.cookie(shaketv_appid + '_openid', openid, expires_in);
	}
};

window.callbackShaketvYaotvUserinfoHandler = function(data) {
	if (typeof data.errcode != 'undefined' && data.errcode > 0) {
		return;
	}
	openid = data.openid;
	$.fn.cookie(shaketv_appid + '_openid', data.openid, expires_in);
	window.location.href = redirect_url;
};

function hideWeiXinShareMenuItem() {
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {  
		WeixinJSBridge.call('hideOptionMenu');
		WeixinJSBridge.call('hideToolbar');
	}); 
}
check_weixin_login();
