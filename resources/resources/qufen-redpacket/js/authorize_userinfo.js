;(function() {
    var w = window;
    w.openid = '';
    w.baseOpenid = '';
    w.codeOpenid = '';
    w.headimgurl = '';
    w.nickname = '';
    w.expires_in = { expires: 30 };
    w.Authorize = function(o) {

        w.openid = $.fn.cookie(KEY_OPENID);
        w.baseOpenid = $.fn.cookie(KEY_BASEOPENID);
        w.codeOpenid = $.fn.cookie(w.mpAppId + "_codeOpenid");
        w.headimgurl = $.fn.cookie(KEY_HEAD_IMG);
        w.nickname = $.fn.cookie(KEY_NICKNAME);

          //调试
         // w.openid = "o8QsptxfDxqZKHQreLKnpdh1JuT0";
         // w.baseOpenid = "d83c996b1db604cd9ef4d087272aedc4";
         // w.codeOpenid = "d83c996b1db604cd9ef4d087272aedc8";


        this.scope = "snsapi_userinfo";
        this.redirect_uri = "http://tttj.holdfun.cn/mpAccount/mobile/wx/auth/authXzq";
        //授权之后的回调页面
        this.callBackPage = o && o.callBackPage || "index";
        //自定义参数
        this.param = o && o.param || "";

    };
    Authorize.prototype.authorize = function() {
        var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + w.mpAppId + "&redirect_uri=" + encodeURIComponent(this.redirect_uri + "?succ=" + encodeURIComponent(encodeURIComponent(this.callBackPage)) + "&returnRedirct=" + encodeURIComponent(domain_url + "api/weixin/auth/snsapi_thirdAuth?v=1&param=" + encodeURIComponent(encodeURIComponent(this.param)))) + "&response_type=code&scope=" + this.scope + "&state=" + businessId + "#wechat_redirect";
        window.location.href = url;
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
    Authorize.prototype.init = function() {
        if (!w.openid || w.openid == 'null' || !w.baseOpenid || w.baseOpenid == 'null') {
            w.openid = this.getQueryParam("openid");
            w.baseOpenid = this.getQueryParam("baseOpenid");
            w.codeOpenid = this.getQueryParam("codeOpenid");


            w.unionid = this.getQueryParam("unionid"); //关联unionid
            if (!w.openid || w.openid == 'null' || !w.baseOpenid || w.baseOpenid == 'null') {
                this.authorize();
            } else {
                w.openid && $.fn.cookie(KEY_OPENID, w.openid, w.expires_in);
                w.baseOpenid && $.fn.cookie(KEY_BASEOPENID, w.baseOpenid, w.expires_in);
                w.codeOpenid && $.fn.cookie(w.mpAppId + "_codeOpenid", w.codeOpenid, w.expires_in);

                w.unionid && $.fn.cookie(w.mpAppId + "unionid", w.unionid, w.expires_in);
                w.headimgurl = this.getQueryParam("headimgurl");
                w.headimgurl && $.fn.cookie(KEY_HEAD_IMG, w.headimgurl, w.expires_in);
                var _nickname = this.getQueryParam("nickname");
                if (_nickname) {
                    w.nickname = decodeURIComponent(_nickname);
                    w.nickname && $.fn.cookie(KEY_NICKNAME, w.nickname, w.expires_in);
                }
            
            }
        } else {
            w.openid && $.fn.cookie(KEY_OPENID, w.openid, w.expires_in);
            w.baseOpenid && $.fn.cookie(KEY_BASEOPENID, w.baseOpenid, w.expires_in);
            w.codeOpenid && $.fn.cookie(w.mpAppId + "_codeOpenid", w.codeOpenid, w.expires_in);
            w.headimgurl && $.fn.cookie(KEY_HEAD_IMG, w.headimgurl, w.expires_in);
            w.nickname && $.fn.cookie(KEY_NICKNAME, w.nickname, w.expires_in);
             
        }
    };
    if (businessId) {
        var url = location.href;
        var array = url.split("?");
        var callBackPage = array[0];
        callBackPage = callBackPage.substring(callBackPage.indexOf("/", 10) + 1);
        var param = '';
        if (array.length == 2) {
            if (array[1]) {
                param = "&" + array[1];
            }
        }
         //new Authorize({ callBackPage: callBackPage, param: param }).init();
    } else {
        showTips("不存在的店铺");
    }
})();

