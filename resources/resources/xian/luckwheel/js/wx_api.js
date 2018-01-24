var profile_name = 'tencentvideo';
var interface_url = 'http://imp.qq.com';
var openid = null;
var access_token = null;
function get_cookie(c_name) {
	var c_end, c_start, c_value;
	if (document.cookie.length > 0) {
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
		//document.write('请在微信客户端打开链接');
		window.location.href = 'wx.html';
		return false;
	}
	openid = get_cookie(profile_name + '_openid'),
			access_token = get_cookie(profile_name + '_access_token');
	if (openid && access_token) {
		return true;
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
check_weixin_login();