(function (W) {
    cookie_version = '1';
    auth_mpappid = 'wx9097d74006e67df3';

    W.matk = $.fn.cookie(auth_mpappid + '_matk' + cookie_version);
    W.openid = $.fn.cookie(auth_mpappid + '_openid' + cookie_version);
    W.headimgurl = $.fn.cookie(mpappid + '_headimgurl' + cookie_version);
    W.nickname = $.fn.cookie(mpappid + '_nickname' + cookie_version);
    expires_in = { expires: 30 };
    matk_expires_in = { expires: 1 };

    Authorize = function (options) {
        //授权后回调页面
        this.callBackPage = options && options.callBackPage || ""; 
    };

    Authorize.prototype.init =function(fn){
        if (!openid || !matk) {
            query_nickname = this.getQueryParam('nickname');
            query_headimgurl = this.getQueryParam('headimgurl');
            if (query_nickname == null && query_headimgurl == null) {
                // 静默授权回调
                W.matk = this.getQueryParam("matk");
                matk && $.fn.cookie(auth_mpappid + '_matk' + cookie_version, matk, matk_expires_in);
                W.openid = this.getQueryParam("openid");
                openid && $.fn.cookie(auth_mpappid + '_openid' + cookie_version, openid, expires_in);
                if (!openid || !matk) {
                    this.authorizeBase();
                    return;
                }else{
                    this.userinfoInit(fn);
                    return;    
                }
            }else{
                // 非静默授权返回了nickname或headimgurl，因此matk与openid不可用。重新授权
                this.authorizeBase();
                return;
            }
        }else{
            this.userinfoInit(fn);
        }
    };

    Authorize.prototype.userinfoInit = function(fn){
        if(!nickname || !headimgurl){
            W.nickname = this.getQueryParam("nickname");
            nickname && $.fn.cookie(mpappid + '_nickname' + cookie_version, nickname, expires_in);
            W.headimgurl = this.getQueryParam("headimgurl");
            headimgurl && $.fn.cookie(mpappid + '_headimgurl' + cookie_version, headimgurl, expires_in);
            if(!nickname || !headimgurl){
                this.authorizeUserInfo();
                return;
            }else{
                setTimeout(function(){
                    fn();
                },50);
            }
        }else{
            setTimeout(function(){
                fn();
            },50);
        }
    };

    Authorize.prototype.authorizeUserInfo = function () {
        var scope = "snsapi_userinfo";
        var redirect_uri = domain_url + "api/mp/auth/snsapi_userinfo";
        var param = this.getParam();
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + mpappid + "&redirect_uri=" + encodeURIComponent(redirect_uri+"?callBackPage="+this.callBackPage+"&param="+param)+ "&response_type=code&scope=" + scope +  "&state=" + serviceNo + "#wechat_redirect";
    };

    Authorize.prototype.authorizeBase = function () {
        var scope = "snsapi_base";
        var redirect_uri = domain_url + "api/mp/auth/snsapi_base";
        var param = this.getParam();
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + auth_mpappid + "&redirect_uri=" + encodeURIComponent(redirect_uri+"?callBackPage="+this.callBackPage+"&param="+param)+ "&response_type=code&scope=" + scope +  "&state=" + serviceNo + "#wechat_redirect";
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
            return null;
        }
        return null;
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
        return encodeURIComponent(JSON.stringify(jsonobj));
    };

    

    

    /**
     * 摇电视授权
     * @type {string}
     */
    var yao_shaketv_scope = 'base';
    if(W.shaketv_appid){
        var shaketv_openid  = $.fn.cookie(shaketv_appid + '_openid' + cookie_version);
        var shaketv_matk  = $.fn.cookie(shaketv_appid + '_matk' + cookie_version);    
    }
    

    W.check_weixin_login = function() {
        if (!window['shaketv'] || !W.shaketv_appid) {
            return false;
        }
        if (!shaketv_openid || !shaketv_matk) {
            shaketv.authorize(shaketv_appid, yao_shaketv_scope, function(data) {
                if (data.errorCode == 0) {
                    get_info(data.code);
                }
            });
        } else {
            $.fn.cookie(shaketv_appid + '_openid' + cookie_version, shaketv_openid, expires_in);
        }
    };

    var get_info = function(code) {
        $.ajax({
            type : 'GET',
            async : false,
            url : domain_url + 'shaketv/yaotv/userinfo',
            data: {code: code,mpopenid: openid},
            dataType : "jsonp",
            jsonpCallback : 'callbackShaketvYaotvUserinfoHandler',
            success : function(data) {
                if (typeof data.errcode != 'undefined' && data.errcode > 0) {
                    return;
                }
                shaketv_openid = data.openid;
                data.openid && $.fn.cookie(shaketv_appid + '_openid' + cookie_version, data.openid, expires_in);
                shaketv_matk = data.matk;
                data.matk && $.fn.cookie(shaketv_appid + '_matk' + cookie_version, data.matk, matk_expires_in);
            }
        });
    };
	
	
	new Authorize({callBackPage:"index.html"}).init(check_weixin_login());

})(window);