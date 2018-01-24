var profile_name = 'tencentvideo';
var interface_url = 'http://imp.qq.com';
var openid = null;
var access_token = null;
var refresh_token = null;
var expires_in = null;
var userProfile = null;

var yao_openid = null;
var yao_expires_in = {expires: 30};
var yao_redirect_url = window.location.href;

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

function check_weixin_login() {
	if (!/micromessenger/i.test(navigator.userAgent)) {
		window.location.href = 'wx.html';
		return false;
	}
	openid = get_cookie(profile_name + '_openid'),
	refresh_token = get_cookie(profile_name + '_refresh_token'),
	expires_in = get_cookie(profile_name + '_expires_in'),
	access_token = get_cookie(profile_name + '_access_token');
	yao_openid = get_cookie(shaketv_appid + '_openid');
	
	if (openid && access_token) {
		if (!yao_openid) {
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
			$.fn.cookie(shaketv_appid + '_openid', openid, yao_expires_in);
		}
	} else {
		var url, url_data;
		url_data = [
				this.interface_url + '/index.php/weixin/oauth2/'
						+ this.profile_name + '?redirect_url=',
				encodeURIComponent(window.location.href)
						+ '&login_redirected=1' ];
		if (this.get_user_data) {
			url_data.push('&snsapi=1');
		}
		url = url_data.join('');
		window.location.href = url;
	}
}

window.callbackShaketvYaotvUserinfoHandler = function(data) {
	if (typeof data.errcode != 'undefined' && data.errcode > 0) {
		return;
	}
	
	yao_openid = data.openid;
	$.fn.cookie(shaketv_appid + '_openid', data.openid, yao_expires_in);
	
	$.ajax({
		type : 'GET',
		async : false,
		url : domain_url + 'user/relate',
		data: {openid: openid, newOpenid: yao_openid},
		dataType : "jsonp",
		jsonp : 'callbackUserRelateHandler',
		complete: function() {
			window.location.href = yao_redirect_url;
		},
		success : function(data) {}
	});
};

window.callbackUserRelateHandler = function(data) {};

check_weixin_login();