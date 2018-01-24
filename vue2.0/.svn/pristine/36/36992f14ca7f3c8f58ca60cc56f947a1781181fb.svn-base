window.mpappid = 'wx71cce586e03f2423';

// 测试号
// window.mpappid = 'wxc5d930ea846a40e1';
// window.isDev = true;

window.COOKIE_VERSION = '.50';

window.COOKIE_KEY_TMMP_MATK = mpappid + '_tmmp_matk_' + COOKIE_VERSION;
window.COOKIE_KEY_MATK = mpappid + '_matk_' + COOKIE_VERSION;
window.COOKIE_KEY_UID_ID = mpappid + '_UID_' + COOKIE_VERSION;
window.COOKIE_KEY_NICKNAME = mpappid + '_nickname_' + COOKIE_VERSION;
window.COOKIE_KEY_HEADIMGURL = mpappid + '_headimgurl_' + COOKIE_VERSION;
window.SESSION_KEY_PREVIEW_ITEMS = mpappid + '_preview_' + COOKIE_VERSION;
window.SESSION_KEY_MUSICS = mpappid + '_musics_' + COOKIE_VERSION;
window.SESSION_KEY_TMPLS = mpappid + '_tmpls_' + COOKIE_VERSION;
window.SESSION_KEY_DELETE_ALBUM_IDS = mpappid + '_deletes_' + COOKIE_VERSION;

var getQueryString = function(name) {
    var currentSearch = decodeURIComponent(location.search.slice(1));
    if (currentSearch != '') {
        var paras = currentSearch.split('&');
        for (var i = 0, l = paras.length, items; i < l; i++) {
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

;(function (W) {
    W.tmmpMatk = $.fn.cookie(COOKIE_KEY_TMMP_MATK);
    W.matk = $.fn.cookie(COOKIE_KEY_MATK);
    W.uid = $.fn.cookie(COOKIE_KEY_UID_ID);
    W.nickname = $.fn.cookie(COOKIE_KEY_NICKNAME);
    W.headimgurl = $.fn.cookie(COOKIE_KEY_HEADIMGURL);

    W.expires_in = { expires: 30 };
    W.matk_expires_in = { expires: 1 };

    var Authorize = function(){};

    Authorize.prototype.authorizeUserInfo = function () {
        var param = this.getParam();
        var url = location.protocol + '//' + location.host + location.pathname;
        var redirect_uri = "http://weixin.holdfun.cn/redirect/photo/userinfo?callBackPage=" + url + "&param=" + param;
        if(window.isDev){
            redirect_uri = "http://weixin.holdfun.cn/redirect/phototest/userinfo?callBackPage=" + url + "&param=" + param;
        }
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + W.mpappid
                             + "&redirect_uri=" + encodeURIComponent(redirect_uri)
                             + "&response_type=code&scope=snsapi_userinfo&state=" + W.tmmpMatk + "#wechat_redirect";
    }

    Authorize.prototype.authorizeBase = function () {
        var param = this.getParam();
        var url = location.protocol + '//' + location.host + location.pathname;
        var redirect_uri = "http://weixin.holdfun.cn/redirect/photo/baseinfo?callBackPage=" + url+ "&param=" + param;
        if(window.isDev){
            redirect_uri = "http://weixin.holdfun.cn/redirect/phototest/baseinfo?callBackPage=" + url+ "&param=" + param;
        }
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + W.mpappid
                             + "&redirect_uri=" + encodeURIComponent(redirect_uri)
                             + "&response_type=code&scope=snsapi_base&state=" + W.tmmpMatk + "#wechat_redirect";
    };

    Authorize.prototype.authorizeTmmp = function () {
        var param = this.getParam();
        var url = location.protocol + '//' + location.host + location.pathname;
        var redirect_uri = "http://weixin.holdfun.cn/redirect/phototmmp/baseinfo?callBackPage=" + url+ "&param=" + param;
        if(window.isDev){
            redirect_uri = "http://weixin.holdfun.cn/redirect/phototmmptest/baseinfo?callBackPage=" + url+ "&param=" + param;
        }
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + (window.isDev ? 'wxc5d930ea846a40e1' : 'wx904242bec46e7752')
                             + "&redirect_uri=" + encodeURIComponent(redirect_uri)
                             + "&response_type=code&scope=snsapi_base&state=#wechat_redirect";
    };

    Authorize.prototype.getParam =function(){
        // FIX ME 需要拿#后边的参数
        var  jsonobj={};
        var currentSearch = decodeURIComponent(location.search.slice(1)).split('&');
        for ( var i = 0 ; i < currentSearch.length  ; i++ ) {
            var sindex = currentSearch[i].search("=");
            var tname = currentSearch[i].substring(0, sindex);
            var tval = currentSearch[i].substring(sindex + 1, currentSearch[i].length);
            if(tname != 'matk' && tname != 'type' && tname != 'uid'  && tname != 'nickname' && tname != 'headimgurl'){
                jsonobj[tname] = tval;
            }

        }
        jsonobj['hash'] = location.hash;
        return encodeURIComponent(JSON.stringify(jsonobj));
    };

    Authorize.prototype.initUser =function(fn){
        if( !uid || ( !nickname && !headimgurl ) ){
            // userinfo授权
            tmpType = getQueryString('type');
            if(tmpType != 'tmmp'){
                matk = getQueryString('matk');
            }
            uid = getQueryString("uid");
            nickname = getQueryString("nickname");
            headimgurl = getQueryString("headimgurl");

            matk && $.fn.cookie(COOKIE_KEY_MATK, matk, matk_expires_in);
            uid && $.fn.cookie(COOKIE_KEY_UID_ID, uid, expires_in);
            nickname && $.fn.cookie(COOKIE_KEY_NICKNAME, nickname, expires_in);
            headimgurl && $.fn.cookie(COOKIE_KEY_HEADIMGURL, headimgurl, expires_in);

            if ( !uid || !matk || ( !nickname && !headimgurl ) ){
                this.authorizeUserInfo();
                return false;
            }
        }else{
            // base授权
            $.fn.cookie(COOKIE_KEY_UID_ID, uid, expires_in);
            $.fn.cookie(COOKIE_KEY_NICKNAME, nickname, expires_in);
            $.fn.cookie(COOKIE_KEY_HEADIMGURL, headimgurl, expires_in);
            if(!matk){
                tmpType = getQueryString('type');
                if(tmpType != 'tmmp'){
                    matk = getQueryString('matk');
                }
                if(!matk){
                    this.authorizeBase();
                    return false;
                }else{
                    $.fn.cookie(COOKIE_KEY_MATK, matk, matk_expires_in);
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

    Authorize.prototype.init =function(fn){
        if(!tmmpMatk){
            tmpType = getQueryString('type');
            if(tmpType == 'tmmp'){
                queryTmmpMatk = getQueryString('matk');
                if(tmmpMatk == ''){
                    // empty matk && has type
                    this.authorizeTmmp();
                    return false;
                }else{
                    // has matk && has type
                    $.fn.cookie(COOKIE_KEY_TMMP_MATK, queryTmmpMatk, matk_expires_in);
                    W.tmmpMatk = queryTmmpMatk;
                    this.initUser(fn);
                }
            }else{
                // empty matk & empty type
                this.authorizeTmmp();
                return false;
            }
        }else{
            // cookie has tmmpMatk
            this.initUser(fn);
        }
    };

    new Authorize().init(function(){
        // FIX ME clearUrl参数
        var hash = getQueryString('hash');
        if(hash){
            location.hash = hash;
        }
    });

})(window);
