; (function (w) {
    w.yao_scope = 'userinfo';
    w.openid = $.fn.cookie(mpappid + '_openid');
    w.headimgurl = $.fn.cookie(mpappid + '_headimgurl');
    w.nickname = $.fn.cookie(mpappid + '_nickname');
    w.expires_in = { expires: 30 };
    w.Authorize = function (o) {
        this.mpappid = o && o.mpappid || mpappid; //mpappid
        this.serviceNo = o && o.serviceNo || serviceNo; //serviceNo
        this.scope = "snsapi_base"; //scope
        this.redirect_uri = domain_url + "api/mp/auth/snsapi_base"; //redirect_uri
        this.jumpUrl = ""; //已经授权的，默认跳去的页面
    }
    Authorize.prototype.authorize = function (fn) {
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.mpappid + "&redirect_uri=" + encodeURIComponent(this.redirect_uri) + "&response_type=code&scope=" + this.scope + "&state=" + this.serviceNo + "#wechat_redirect ";
    };
    Authorize.prototype.checkIsAuthorize = function () {
        if ($.fn.cookie(mpappid + '_openid')) {
            return true;
        } else {
            return false;
        }
    };
    Authorize.prototype.getQueryParam = function (name) {
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
    Authorize.prototype.jumpToUrl = function () {
        if (this.jumpUrl) {
            window.location.href = this.jumpUrl;
        }
    }
    Authorize.prototype.init = function (fn) {
        var that = this;
        if (!openid) {
            openid = that.getQueryParam("openid");
            openid && $.fn.cookie(mpappid + '_openid', openid, expires_in);
            if (!openid) {
                that.authorize(function () {
                });
            }
        } else {
            $.fn.cookie(mpappid + '_openid', openid, expires_in);
            if(fn){
                setTimeout(function(){
                        fn();
                },50);
            }
        }
        if (!headimgurl) {
            headimgurl = that.getQueryParam("headimgurl");
            headimgurl && $.fn.cookie(mpappid + '_headimgurl', headimgurl, expires_in);
        } else {
            $.fn.cookie(mpappid + '_headimgurl', headimgurl, expires_in);
        }
        if (!nickname) {
            nickname = that.getQueryParam("nickname");
            nickname && $.fn.cookie(mpappid + '_nickname', nickname, expires_in);
        } else {
            $.fn.cookie(mpappid + '_nickname', nickname, expires_in);
        }
    }
    new Authorize().init();

})(window);

