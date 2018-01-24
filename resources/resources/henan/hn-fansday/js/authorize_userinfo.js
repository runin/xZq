; (function (w) {
    w.yao_scope = 'userinfo';
    w.openid = $.fn.cookie(mpappid + '_openid');
    w.headimgurl = $.fn.cookie(mpappid + '_headimgurl');
    w.nickname = $.fn.cookie(mpappid + '_nickname');
    w.expires_in = { expires: 30 };
    w.Authorize = function (o) {
        this.mpappid =o && o.mpappid || mpappid;//mpappid
        this.serviceNo =o && o.serviceNo || serviceNo;//serviceNo
        this.scope = "snsapi_userinfo";//scope
        this.redirect_uri = domain_url + "api/mp/auth/snsapi_userinfo";//redirect_uri
        this.callBackPage = o && o.callBackPage||"";//授权之后的回调页面
        this.param = "";//微信的参数
    }
    Authorize.prototype.authorize = function (fn) {

        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.mpappid + "&redirect_uri=" + encodeURIComponent(this.redirect_uri+"?callBackPage="+this.callBackPage+"&param="+this.param)+ "&response_type=code&scope=" + this.scope +  "&state=" + this.serviceNo + "#wechat_redirect";
        if(fn){
            fn();
        }
    };
    Authorize.prototype.checkIsAuthorize = function () {
        if($.fn.cookie(mpappid + '_openid')){
            return true;
        }else{
            return false;
        }
    };
    Authorize.prototype.getQueryParam =function(name){
        var currentSearch = decodeURIComponent(location.search.slice( 1 ));
        if (currentSearch != '') {
            var paras = currentSearch.split('&');
            for ( var i = 0, l = paras.length, items; i < l; i++ ) {
                items = paras[i].split( '=' );
                if ( items[0] === name) {
                    return items[1];
                }
            }
            return '';
        }
        return '';

    };
    Authorize.prototype.jumpToUrl =function(){
        if(this.callBackPage){
            window.location.href = this.callBackPage;
        }
    }

    Authorize.prototype.getParam =function(){
        var  jsonobj={};
        var currentSearch = decodeURIComponent(location.search.slice(1)).split('&');

        for ( var i = 0, l = currentSearch.length, items; i < l; i++ ) {
            items = currentSearch[i].split( '=' );
            jsonobj[items[0]] = items[1];
        }
        this.param =  encodeURIComponent(JSON.stringify(jsonobj));
    }
    Authorize.prototype.init =function(fn){
        this.getParam();
        var that =this;

        if (!openid||!nickname) {
            openid = that.getQueryParam("openid");
            openid &&  $.fn.cookie(mpappid + '_openid', openid, expires_in);
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

    /**
     * 摇电视授权
     * @type {string}
     */
    var yao_shaketv_scope = 'base';
    var shaketv_openid  = $.fn.cookie(shaketv_appid + '_openid');
    var expires_in = {expires: 30};
    var redirect_url = window.location.href;
    var authorize_count = 0;

    var check_weixin_login = function() {
        if (!window['shaketv']) {
            return false;
        }
        if (!shaketv_openid) {
            shaketv.authorize(shaketv_appid, yao_shaketv_scope, function(data) {
                // alert(JSON.stringify(data));
                if (data.errorCode == 0) {
                    get_info(data.code);
                }
            });
        } else {
            $.fn.cookie(shaketv_appid + '_openid', shaketv_openid, expires_in);
        }
    };

    var get_info = function(code) {
        if (authorize_count > 0) {
            return;
        }
        authorize_count ++;
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

                // window.location.href = redirect_url;
            }
        });
    };
   new Authorize({callBackPage:"index.html"}).init(check_weixin_login());
})(window);