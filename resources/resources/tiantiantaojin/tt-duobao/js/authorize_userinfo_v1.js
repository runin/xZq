//商品详情页单独授权
;
(function(w) {
    w.openid = $.fn.cookie(mpappid + '_openid');
    w.expires_in = {
        expires: 7
    };
    w.Authorize = function(o) {
        this.mpappid = o && o.mpappid || mpappid; //mpappid
        this.serviceNo = o && o.serviceNo || serviceNo; //serviceNo
        this.scope = "snsapi_base"; //scope
        this.redirect_uri = domain_url + "api/mp/auth/snsapi_base_common"; //redirect_uri
        this.callBackPage = o && o.callBackPage || ""; //授权之后的回调页面
        this.param = ""; //微信的参数
        this.refer = window.location.href;
    }
    Authorize.prototype.authorize = function(fn) {

        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.mpappid + "&redirect_uri=" + encodeURIComponent(this.redirect_uri + "?param=" + this.param) + "&response_type=code&scope=" + this.scope + "&state=" + serviceNo1 + "#wechat_redirect";
        if (fn) {
            fn();
        }
    };
    Authorize.prototype.checkIsAuthorize = function() {
        if ($.fn.cookie(mpappid + '_openid')) {
            return true;
        } else {
            return false;
        }
    };
    Authorize.prototype.getQueryParam = function(name) {
        var currentSearch = decodeURIComponent(location.search.slice(1));
        if (currentSearch != '') {
            var paras = currentSearch.split('&');
            for (var i = 0, l = paras.length, items; i < l; i++) {
                items = paras[i].split('=');
                if (items[0] === name) {
                    return items[1];
                }
            }
            return '';
        }
        return '';

    };
    Authorize.prototype.jumpToUrl = function() {
        if (this.callBackPage) {
            window.location.href = this.callBackPage;
        }
    }

    Authorize.prototype.getParam = function(data) {
        var jsonobj = {};
        var currentSearch = decodeURIComponent(location.search.slice(1)).split('&');

        for (var i = 0, l = currentSearch.length, items; i < l; i++) {
            items = currentSearch[i].split('=');
            jsonobj[items[0]] = items[1];
        }
        jsonobj["goods_id"] = data.goods_id;
        this.param = encodeURIComponent(JSON.stringify(jsonobj));
    }
    Authorize.prototype.init = function(fn) {
            var that = this;
            this.getParam({ goods_id: that.getQueryParam("goods_id") });
            if (!openid) {
                if (!that.getQueryParam("card_id")) {
                    openid = that.getQueryParam("openid");
                    openid && $.fn.cookie(mpappid + '_openid', openid, expires_in);
                }
                if (!openid) {
                    that.authorize(function() {});
                } else {
                    if (fn) {
                        setTimeout(function() {
                            fn();
                        }, 50);
                    }
                }

            } else {
                $.fn.cookie(mpappid + '_openid', openid, expires_in);
                if (fn) {
                    setTimeout(function() {
                        fn();
                    }, 50);
                }
            }
        }
        /**
         * 天天淘金
         * @type {string}
         */
    var tttj_scope = "snsapi_userinfo";
    window.tttj_openid = $.fn.cookie(busiAppId + '_openid');
    window.headimgurl = $.fn.cookie(busiAppId + '_headimgurl');
    window.nickname = $.fn.cookie(busiAppId + '_nickname');
    var expires_in = {
        expires: 7
    };
    var tt_param = "";
    var redirect_url = business_url + 'wx/auth/auth_userinfo';
    var authorize_count = 0;
    var callBackPageUrl = "html/goods/goodsview.html";
    var check_tt_authorize = function() {
        if (!/micromessenger/i.test(navigator.userAgent)) {
            window.location.href = 'wx.html';
            return false;
        }
        tt_param = encodeURIComponent(JSON.stringify({ goods_id: getQueryString("goods_id") }));
        if (!openid) {
            return
        } else if (!tttj_openid || !nickname) {
            tttj_openid = getQueryString("qfOpenid");
            tttj_openid && $.fn.cookie(busiAppId + '_openid', tttj_openid, expires_in);
            if (!tttj_openid) {
                tt_authorize();
            }
        } else {
            $.fn.cookie(busiAppId + '_openid', tttj_openid, expires_in);
        }

        if (!headimgurl) {
            headimgurl = getQueryString("headimgurl");
            headimgurl && $.fn.cookie(busiAppId + '_headimgurl', headimgurl, expires_in);
        } else {
            $.fn.cookie(busiAppId + '_headimgurl', headimgurl, expires_in);
        }
        if (!nickname) {
            nickname = getQueryString("nickname");
            nickname && $.fn.cookie(busiAppId + '_nickname', nickname, expires_in);
        } else {
            $.fn.cookie(busiAppId + '_nickname', nickname, expires_in);
        }
    };
    var tt_authorize = function(fn) {
        authorize_count++;
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + busiAppId + "&redirect_uri=" + encodeURIComponent(redirect_url + "?callBackPage=" + callBackPageUrl + "&openId=" + openid + "&authAppId=" + busiAppId + "&param=" + tt_param) + "&response_type=code&scope=" + tttj_scope + "&state=" + state + "#wechat_redirect";
    };
    var getQueryString = function(name) {
        var currentSearch = decodeURIComponent(location.search.slice(1));
        if (currentSearch != '') {
            var paras = currentSearch.split('&');
            for (var i = 0, l = paras.length, items; i < l; i++) {
                items = paras[i].split('=');
                if (items[0] === name) {
                    return items[1];
                }
            }
            return '';
        }
        return '';
    };
   new Authorize().init(check_tt_authorize);
})(window);
