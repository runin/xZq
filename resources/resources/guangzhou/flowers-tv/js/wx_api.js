var domain_url = "http://yaotv.holdfun.cn/portal/";
var resourceType = "1";
var version = "V1.3";
var serviceNo = "tv_guangzhou_mzhc";
var channelUuid = "2a1252b0e96d48c8b39b43308950a9b1";
var stationUuid = "53a759c40d4a43318dae737d14a9ab41";

var activity_code = 'gztv_mzhc_vote_14';
var share_img = "http://cdn.holdfun.cn/gztv/images/flowers.jpg";
var share_title = "美在花城";
var share_desc = "我在看“美在花城”总决赛直播";
var share_url = "index.html";
var share_group = share_title;

var flowers_timer = 15 * 60 * 1000;
var lottery_rate = 10;
var flowers_follow_key = 'wx614a0f37684e8f10';


var profile_name = 'tencentvideo';
var interface_url = 'http://imp.qq.com';
var openid = null;
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

function check_weixin_login() {
	if (!/micromessenger/i.test(navigator.userAgent)) {
		window.location.href = 'wx.html';
		return false;
	}
	openid = get_cookie(profile_name + '_openid'),
	refresh_token = get_cookie(profile_name + '_refresh_token'),
	expires_in = get_cookie(profile_name + '_expires_in'),
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

if (window.WeixinJSBridge) {
	init();
} else {
	if (document.addEventListener) {
		document.addEventListener("WeixinJSBridgeReady", init, false);
	} else if (document.attachEvent) {
		document.attachEvent("WeixinJSBridgeReady", init);
		document.attachEvent("onWeixinJSBridgeReady", init);
	}
}

function init() {
//	try {
//		WeixinJSBridge.call('hideOptionMenu');
//	} catch (e) {}
}

check_weixin_login();
