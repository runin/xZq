; (function (w) {
    w.matk = $.fn.cookie(mpappid + '_matk');
    w.openid = $.fn.cookie(mpappid + '_openid');
    //w.matk = "oioBhswJLkpwupInBfoS2lZpouBY3";
    //w.openid = "oioBhswJLkpwupInBfoS2lZpouBY3";
    w.headimgurl = $.fn.cookie(mpappid + '_headimgurl');
    w.nickname = $.fn.cookie(mpappid + '_nickname');
    w.expires_in = { expires: 30 };
    w.matk_expires_in = { expires: 1 };
    w.Authorize = function (o) {
        this.mpappid =o && o.mpappid || mpappid;//mpappid
        this.serviceNo =o && o.serviceNo || serviceNo;//serviceNo
        this.callBackPage = o && o.callBackPage||"";//授权之后的回调页面
        this.param = "";//微信的参数
    };
    Authorize.prototype.authorizeUserInfo = function () {
        var that =this;
        that.scope = "snsapi_userinfo";//scope
        that.redirect_uri = domain_url + "api/mp/auth/snsapi_userinfo";//redirect_uri
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.mpappid + "&redirect_uri=" + encodeURIComponent(that.redirect_uri+"?callBackPage="+this.callBackPage+"&param="+this.param)+ "&response_type=code&scope=" + that.scope +  "&state=" + this.serviceNo + "#wechat_redirect";
    };
    Authorize.prototype.authorizeBase = function () {
        var that =this;
        that.scope = "snsapi_base";//scope
        that.redirect_uri = domain_url + "api/mp/auth/snsapi_base";//redirect_uri
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.mpappid + "&redirect_uri=" + encodeURIComponent(that.redirect_uri+"?callBackPage="+this.callBackPage+"&param="+this.param)+ "&response_type=code&scope=" + that.scope +  "&state=" + this.serviceNo + "#wechat_redirect";
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
        var that = this;
        if (!openid||!nickname) {
            openid = that.getQueryParam("openid");
            openid && $.fn.cookie(mpappid + '_openid', openid, expires_in);
            nickname = that.getQueryParam("nickname");
            nickname && $.fn.cookie(mpappid + '_nickname', nickname, expires_in);
            headimgurl = that.getQueryParam("headimgurl");
            headimgurl && $.fn.cookie(mpappid + '_headimgurl', headimgurl, expires_in);
            matk = that.getQueryParam('matk');
            matk && $.fn.cookie(mpappid + '_matk', matk, matk_expires_in);
            if (!openid||!nickname||!matk) {
                that.authorizeUserInfo();
            }
        } else {
            $.fn.cookie(mpappid + '_openid', openid, expires_in);
            $.fn.cookie(mpappid + '_nickname', nickname, expires_in);
            $.fn.cookie(mpappid + '_headimgurl', headimgurl, expires_in);
            if(!matk){

                matk = that.getQueryParam('matk');
                if(!matk){

                    that.authorizeBase();
                }else{

                    $.fn.cookie(mpappid + '_matk', matk, matk_expires_in);
                    if(fn){
                        setTimeout(function(){
                            fn();
                        },50);
                    }
                }
            }else{
                if(fn){
                    setTimeout(function(){
                        fn();
                    },50);
                }
            }
        }
    };

    /**
     * 摇电视授权
     * @type {string}
     */
    var yao_shaketv_scope = 'base';
    var shaketv_openid  = $.fn.cookie(shaketv_appid + '_openid');
    var shaketv_matk  = $.fn.cookie(shaketv_appid + '_matk');

    w.check_weixin_login = function() {
        if (!window['shaketv']) {
            return false;
        }
        if (!shaketv_openid || !shaketv_matk) {
            shaketv.authorize(shaketv_appid, yao_shaketv_scope, function(data) {
                if (data.errorCode == 0) {
                    get_info(data.code);
                }
            });
        } else {
            $.fn.cookie(shaketv_appid + '_openid', shaketv_openid, expires_in);
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
                shaketv_openid = data.openid;
                data.openid && $.fn.cookie(shaketv_appid + '_openid', data.openid, expires_in);
                shaketv_matk = data.matk;
                data.matk && $.fn.cookie(shaketv_appid + '_matk', data.matk, matk_expires_in);
            }
        });
    };
})(window);