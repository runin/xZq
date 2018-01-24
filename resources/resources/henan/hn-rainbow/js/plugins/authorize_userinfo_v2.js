(function (W) {

    W.openid = $.fn.cookie(COOKIE_KEY_OPENID);
    //调试
    openid = "45454";

    if (W.openid == 'null') {
        W.openid = null;
    }

    W.headimgurl = $.fn.cookie(COOKIE_KEY_AVATAR);
    W.nickname = $.fn.cookie(COOKIE_KEY_NICKNAME);
    W.expires_in = { expires: 30 };

    W.Authorize = function (o) {
        this.mpappid = o && o.mpappid || mpappid; //mpappid
        this.serviceNo = o && o.serviceNo || serviceNo; //serviceNo
        this.scope = "snsapi_userinfo"; //scope
        this.redirect_uri = domain_url + "api/mp/auth/snsapi_userinfo"; //redirect_uri
        this.callBackPage = o && o.callBackPage || ""; //授权之后的回调页面
        this.param = ""; //微信的参数
    }

    Authorize.prototype.authorize = function (fn) {
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.mpappid + "&redirect_uri=" + encodeURIComponent(this.redirect_uri + "?callBackPage=" + this.callBackPage + "&param=" + this.param + "&referer=" + location.href) + "&response_type=code&scope=" + this.scope + "&state=" + this.serviceNo + "#wechat_redirect";
        if (fn) {
            fn();
        }
    };

    Authorize.prototype.getParam = function () {
        var jsonobj = {};
        var currentSearch = decodeURIComponent(location.search.slice(1)).split('&');

        for (var i = 0, l = currentSearch.length, items; i < l; i++) {
            var sindex = currentSearch[i].search("=");
            var tname = currentSearch[i].substring(0, sindex);
            var tval = currentSearch[i].substring(sindex + 1, currentSearch[i].length);
            jsonobj[tname] = tval;
        }
        this.param = encodeURIComponent(JSON.stringify(jsonobj));
    }

    Authorize.prototype.init = function (fn) {
        this.getParam();
        var that = this;

        if (!openid || !nickname) {

            openid = that.getQueryString("openid");
            openid && $.fn.cookie(COOKIE_KEY_OPENID, openid, expires_in);
            if (!openid) {
                that.authorize();
            }

        } else {
            $.fn.cookie(COOKIE_KEY_OPENID, openid, expires_in);
            if (fn) {
                setTimeout(function () {
                    fn();
                }, 50);
            }
        }
        if (!headimgurl) {
            headimgurl = that.getQueryString("headimgurl");
            headimgurl && $.fn.cookie(COOKIE_KEY_AVATAR, headimgurl, expires_in);
        } else {
            $.fn.cookie(COOKIE_KEY_AVATAR, headimgurl, expires_in);
        }
        if (!nickname) {
            nickname = that.getQueryString("nickname");
            nickname && $.fn.cookie(COOKIE_KEY_NICKNAME, nickname, expires_in);
        } else {
            $.fn.cookie(COOKIE_KEY_NICKNAME, nickname, expires_in);
        }
    }

    /**
    * 摇电视授权
    * @type {string}
    */
    var yao_shaketv_scope = 'base';
    var shaketv_openid = $.fn.cookie(COOKIE_KEY_SHAKE_OPENID);
    var expires_in = { expires: 30 };
    var redirect_url = window.location.href;
    var authorize_count = 0;

    var check_weixin_login = function () {
        if (!window['shaketv']) {
            return false;
        }
        if (!shaketv_openid) {
            shaketv.authorize(shaketv_appid, yao_shaketv_scope, function (data) {
                // alert(JSON.stringify(data));
                if (data.errorCode == 0) {
                    get_info(data.code);
                }
            });
        } else {
            $.fn.cookie(COOKIE_KEY_SHAKE_OPENID, shaketv_openid, expires_in);
        }
    };

    var get_info = function (code) {
        if (authorize_count > 0) {
            return;
        }
        authorize_count++;
        $.ajax({
            type: 'GET',
            async: false,
            url: domain_url + 'shaketv/yaotv/userinfo',
            data: { code: code, mpopenid: W.openid },
            dataType: "jsonp",
            jsonpCallback: 'callbackShaketvYaotvUserinfoHandler',
            success: function (data) {
                if (typeof data.errcode != 'undefined' && data.errcode > 0) {
                    return;
                }
                shaketv_openid = data.openid;
                data.openid && $.fn.cookie(COOKIE_KEY_SHAKE_OPENID, data.openid, expires_in);
            }
        });
    };

    //  new Authorize().init(check_weixin_login());

})(window);