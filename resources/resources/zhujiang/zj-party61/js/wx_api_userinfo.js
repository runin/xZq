; (function (w) {
	w.openid = $.fn.cookie(mpappid + '_openid');
	w.matk = $.fn.cookie(mpappid + '_matk');
	w.expires_in = { expires: 30 };
	w.matk_expires_in = { expires: 1 };
	w.Authorize = function (o) {
		this.mpappid =o && o.mpappid || mpappid;//mpappid
		this.serviceNo =o && o.serviceNo || serviceNo;//serviceNo
		this.scope = "snsapi_base";//scope
		this.redirect_uri = domain_url + "api/mp/auth/snsapi_base";//redirect_uri
		this.callBackPage = o && o.callBackPage||"";//授权之后的回调页面
		this.param = "";//微信的参数
	};
	Authorize.prototype.authorize = function () {
		window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.mpappid + "&redirect_uri=" + encodeURIComponent(this.redirect_uri+"?callBackPage="+this.callBackPage+"&param="+this.param)+ "&response_type=code&scope=" + this.scope +  "&state=" + this.serviceNo + "#wechat_redirect";
	};
	Authorize.prototype.getQueryParam =function(name){
		var currentSearch = decodeURIComponent(location.search.slice( 1 ));
		if (currentSearch != '') {
			var paras = currentSearch.split('&');
			for ( var i = 0, l = paras.length, items; i < l; i++ ) {
				var sindex = paras[i].search("=");
				var tname = paras[i].substring(0, sindex);
				var tval = paras[i].substring(sindex + 1, paras[i].length);
				if (tname === name) {
					return tval;
				}
			}
			return '';
		}
		return '';
	};
	Authorize.prototype.getParam =function(){
		var  jsonobj={};
		var currentSearch = decodeURIComponent(location.search.slice(1)).split('&');
		for ( var i = 0 ; i < currentSearch.length  ; i++ ) {
			var sindex = currentSearch[i].search("=");
			var tname = currentSearch[i].substring(0, sindex);
			var tval = currentSearch[i].substring(sindex + 1, currentSearch[i].length);
			jsonobj[tname] = tval;
		}
		this.param =  encodeURIComponent(JSON.stringify(jsonobj));
	};
	Authorize.prototype.init =function(fn){
		this.getParam();
		var that =this;
		if (!openid || !matk) {
			w.openid = that.getQueryParam("openid");
			w.matk = that.getQueryParam("matk");
			if(!openid || !matk){
				that.authorize();
			}else{
				$.fn.cookie(mpappid + '_openid', openid, expires_in);
				$.fn.cookie(mpappid + '_matk', matk, matk_expires_in);
			}
		} else {
			$.fn.cookie(mpappid + '_openid', openid, expires_in);
			if(!matk){
				matk = that.getQueryParam('matk');
				if(!matk){
					that.authorize();
				}else{
					$.fn.cookie(mpappid + '_matk', matk, matk_expires_in);
				}
			}else {
				if (fn) {
					setTimeout(function () {
						fn();
					}, 50);
				}
			}
		}
	};

	/**
	 * 摇电视授权
	 * @type {string}
	 */
	var yao_shaketv_scope = 'userinfo';
	window.shaketv_matk = $.fn.cookie(shaketv_appid + '_matk');
	window.shaketv_openid = $.fn.cookie(shaketv_appid + '_openid');
	window.headimgurl = $.fn.cookie(shaketv_appid + '_headimgurl');
	window.nickname = $.fn.cookie(shaketv_appid + '_nickname');

	w.check_weixin_login = function() {
		if (!/micromessenger/i.test(navigator.userAgent)) {
			window.location.href = 'wx.html';
			return false;
		}
		if (!window['shaketv']) {
			return false;
		}
		if (!shaketv_openid || !nickname) {
			shaketv.authorize(shaketv_appid, yao_shaketv_scope, function(data) {
				if (data.errorCode == 0) {
					get_info(data.code);
				} else {
					shaketv.authorize(shaketv_appid, 'base', function(data) {
						get_info(data.code);
					});
				}
			});
		} else {
			if(!shaketv_matk){
				shaketv.authorize(shaketv_appid, 'base', function(data) {
					get_info(data.code);
				});
			}
			$.fn.cookie(shaketv_appid + '_openid', shaketv_openid, expires_in);
			$.fn.cookie(shaketv_appid + '_headimgurl', headimgurl, expires_in);
			$.fn.cookie(shaketv_appid + '_nickname', nickname, expires_in);
		}
	};

	var get_info = function(code) {
		$.ajax({
			type : 'GET',
			async : false,
			url : domain_url + 'shaketv/yaotv/userinfo',
			data: {code: code,mpopenid: w.openid},
			dataType : "jsonp",
			jsonpCallback : 'callbackShaketvYaotvUserinfoHandler',
			success : function(data) {
				if (typeof data.errcode != 'undefined' && data.errcode > 0) {
					return;
				}
				w.shaketv_matk = data.matk;
				w.shaketv_openid = data.openid;
				w.headimgurl = data.headimgurl;
				w.nickname = data.nickname;
				data.matk && $.fn.cookie(shaketv_appid + '_matk', data.matk, matk_expires_in);
				data.openid && $.fn.cookie(shaketv_appid + '_openid', data.openid, expires_in);
				data.headimgurl && $.fn.cookie(shaketv_appid + '_headimgurl', data.headimgurl, expires_in);
				data.nickname && $.fn.cookie(shaketv_appid + '_nickname', data.nickname, expires_in);
			}
		});
	};
	new Authorize({callBackPage:"index.html"}).init(check_weixin_login());
})(window);
