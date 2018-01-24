(function (W) { 

    W.matk = $.fn.cookie(COOKIE_KEY_MATK);
    W.openid = $.fn.cookie(COOKIE_KEY_OPENID);
    W.headimgurl = $.fn.cookie(COOKIE_KEY_AVATAR);
    W.nickname = $.fn.cookie(COOKIE_KEY_NICKNAME);

    // W.matk = 1213;
    // W.openid = 1213;
    // W.nickname = 'hello';
    
    W.expires_in = { expires: 30 };
    W.matk_expires_in = { expires: 1 };


    /**
     * 新掌趣授权
     */
     W.holdfunAuth = function(afterholdfunAuth){
        if (!openid || !matk) {
            query_nickname = getQueryString('nickname');
            query_headimgurl = getQueryString('headimgurl');

            // FIX ME 改造getQueryString
            if (query_nickname == null && query_headimgurl == null) {
                // 静默授权回调
                W.matk = getQueryString("matk");
                W.openid = getQueryString("openid");

                if(W.openid && W.openid != 'null' && W.openid != '' && W.matk && W.matk != 'null' && W.matk != ''){
                    $.fn.cookie(COOKIE_KEY_MATK, W.matk, matk_expires_in);
                    $.fn.cookie(COOKIE_KEY_OPENID, W.openid, expires_in);
                    if(afterholdfunAuth){
                        afterholdfunAuth();
                    }
                }else{
                    holdfunAuthRun();
                }
            }else{
                // 非静默授权返回了nickname或headimgurl，因此matk与openid不可用。重新授权
                holdfunAuth(afterholdfunAuth);
                return;
            }
        }else{
            if(afterholdfunAuth){
                afterholdfunAuth();
            }
        }
    };

    var holdfunAuthRun = function(){
        var authMpappid = 'wx9097d74006e67df3';
        var holdfunAuthRedirect = auth_url + "api/mp/auth/saas_snsapi_base";
        var params = getParam();
        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + authMpappid + "&redirect_uri="
                      +  encodeURIComponent( holdfunAuthRedirect + "?callBackPage=" + location.href + "&param=" + params )
                      + "&response_type=code&scope=snsapi_base&state="+ authMpappid +"#wechat_redirect";
    };
    /**
     * END OF 新掌趣授权
     */



    /**
     * 公众号授权
     */

    W.mpAuth = function(mpappid, aftermpAuth){
        if(!nickname && !headimgurl){
            W.nickname = getQueryString("nickname");
            nickname && $.fn.cookie(COOKIE_KEY_NICKNAME, nickname, expires_in);
            W.headimgurl = getQueryString("headimgurl");
            headimgurl && $.fn.cookie(COOKIE_KEY_AVATAR, headimgurl, expires_in);
            if(!nickname && !headimgurl){
                if(!mpappid || mpappid == 'null' || mpappid == ''){
                    if(aftermpAuth){
                        aftermpAuth();
                    }
                }else{
                    mpAuthRun(mpappid);
                    return;
                }
            }else{
                if(aftermpAuth){
                    aftermpAuth();
                }
            }
        }else{
            if(aftermpAuth){
                aftermpAuth();
            }
        }
    };

    var mpAuthRun = function(mpappid){
        var mpAuthRedirect = auth_url + "api/mp/auth/saas_snsapi_userinfo";
        var params = getParam();
        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+ mpappid +"&redirect_uri="
                      +  encodeURIComponent( mpAuthRedirect + "?callBackPage=" + location.href + "&param=" + params )
                      + "&response_type=code&scope=snsapi_userinfo&state="+ mpappid +"#wechat_redirect";
    };

    /**
     * END OF 公众号授权
     */

     var getParam = function(){
        var jsonObj={};
        var currentSearch = location.search.slice(1).split('&');
        for ( var i = 0 ; i < currentSearch.length ; i++ ) {
            var sindex = currentSearch[i].search("=");
            var tname = currentSearch[i].substring(0, sindex);
            var tval = currentSearch[i].substring(sindex + 1, currentSearch[i].length);
            jsonObj[tname] = tval;
        }
        return encodeURIComponent(JSON.stringify(jsonObj));
    };

})(window);