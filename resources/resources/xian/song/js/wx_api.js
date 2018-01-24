var openid = null;
var expires_in = {expires: 30};
var redirect_url = window.location.href;

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
$(function(){
	check_weixin_login();
});
