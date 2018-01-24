(function (W) {

    W.openid = $.fn.cookie(COOKIE_KEY_OPENID);
    W.openid = 499;
    W.isHoldfunAuthed = $.fn.cookie(COOKIE_KEY_HOLDFUN_AUTHED);
    W.shakeOpenid = $.fn.cookie(COOKIE_KEY_SHAKE_OPENID);
    W.headimgurl = $.fn.cookie(COOKIE_KEY_AVATAR);
    headimgurl = 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3270090739,231767344&fm=116&gp=0.jpg';
    W.nickname = $.fn.cookie(COOKIE_KEY_NICKNAME);
    W.expires_in = { expires: 30 };


    var mpAuthRedirect = auth_domain_url + "api/mp/auth/snsapi_userinfo";
    var holdfunAuthRedirect = auth_domain_url + "api/mp/auth/snsapi_base";
    var params = null;
    var shakeAuthCount = 0;


    var getParam = function(){
        var jsonObj={};
        var currentSearch = location.search.slice(1).split('&');
        for ( var i = 0 ; i < currentSearch.length ; i++ ) {
            var sindex = currentSearch[i].search("=");
            var tname = currentSearch[i].substring(0, sindex);
            var tval = currentSearch[i].substring(sindex + 1, currentSearch[i].length);
            jsonObj[tname] = tval;
        }
        jsonObj['hash'] = location.hash;
        return encodeURIComponent(JSON.stringify(jsonObj));
    };


    /**
     * 摇电视授权
     */
    var yaoAuth = function(){
        if (!window['shaketv']) {
            return false;
        }
        if (!shakeOpenid) {
            shaketv.authorize(shaketv_appid, 'base', function(data) {
                if(data.errorCode == 0) {
                   yaoAuthRun(data.code);
                }
            });
        } else {
            $.fn.cookie(COOKIE_KEY_SHAKE_OPENID, shakeOpenid, expires_in);
        }
    };

    var yaoAuthRun = function(code) {
        if(shakeAuthCount > 0){
            return;
        }
        shakeAuthCount ++;
        
        $.ajax({
            type : 'GET',
            async : false,
            url : domain_url + 'shaketv/yaotv/userinfo',
            data: {code: code,mpopenid: W.openid},
            dataType : "jsonp",
            jsonpCallback : 'callbackShaketvYaotvUserinfoHandler',
            success : function(data) {
                if (typeof data.errcode != 'undefined' && data.errcode > 0) {
                    return;
                }
                shakeOpenid = data.openid;
                data.openid && $.fn.cookie(COOKIE_KEY_SHAKE_OPENID, data.openid, expires_in);
            }
        });
    };

    /**
     * END OF 摇电视授权
     */


    

    /**
     * 新掌趣授权
     */
     var holdfunAuth = function(afterholdfunAuth){
        if(!isHoldfunAuthed || isHoldfunAuthed == 'null'){
            $.fn.cookie(COOKIE_KEY_HOLDFUN_AUTHED, 'true', expires_in);
            holdfunAuthRun();
        }else{
            $.fn.cookie(COOKIE_KEY_HOLDFUN_AUTHED, 'true', expires_in);
            if(afterholdfunAuth){
                afterholdfunAuth();
            }
        }
    };

    var holdfunAuthRun = function(){
        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9097d74006e67df3&redirect_uri="
                      +  encodeURIComponent( holdfunAuthRedirect + "?callBackPage=&param=" + params + "&referer=" + location.href )
                      + "&response_type=code&scope=snsapi_base&state="+ W.auth_serviceNo +"#wechat_redirect";
    };
    /**
     * END OF 新掌趣授权
     */



    /**
     * 公众号授权
     */
    var mpAuth = function(aftermpAuth){
        if(!W.openid || W.openid == 'null'){
            W.openid = getQueryString("openid");
            if(W.openid && W.openid != 'null' && W.openid != ''){
                $.fn.cookie(COOKIE_KEY_OPENID, W.openid, expires_in);
                if(aftermpAuth){
                    aftermpAuth();
                }
            }else{
                mpAuthRun();
            }

            if (!W.headimgurl || W.headimgurl == 'null' || W.headimgurl == '') {
                W.headimgurl = getQueryString("headimgurl");
                W.headimgurl && $.fn.cookie(COOKIE_KEY_AVATAR, W.headimgurl, expires_in);
            } else {
                $.fn.cookie(COOKIE_KEY_AVATAR, W.headimgurl, expires_in);
            }

            if (!W.nickname || W.nickname == 'null' || W.nickname == '' ) {
                W.nickname = getQueryString("nickname");
                W.nickname && $.fn.cookie(COOKIE_KEY_NICKNAME, W.nickname, expires_in);
            } else {
                $.fn.cookie(COOKIE_KEY_NICKNAME, W.nickname, expires_in);
            }
        }else{
            $.fn.cookie(COOKIE_KEY_OPENID, W.openid, expires_in);
            if(aftermpAuth){
                aftermpAuth();
            }
        }
    };

    var mpAuthRun = function(){

        var callback = '';
        if(location.href.indexOf('unlock.html') > 0){
            callback = 'unlock.html';
        }
        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+ W.mpappid +"&redirect_uri="
                      +  encodeURIComponent( mpAuthRedirect + "?callBackPage=" + callback + "&param=" + params + "&referer=" + location.href )
                      + "&response_type=code&scope=snsapi_userinfo&state="+ W.auth_serviceNo +"#wechat_redirect";
    
    };


    /**
     * END OF 公众号授权
     */
    

    params = getParam();
    // mpAuth(holdfunAuth(yaoAuth()));
    mpAuth();

})(window);