var add_param1 = function (sourceUrl, parameterName, parameterValue, replaceDuplicates) {
    if ((sourceUrl == null) || (sourceUrl.length == 0)) {
        sourceUrl = document.location.href;
    }
    var urlParts = sourceUrl.split("?");
    var newQueryString = "";
    if (urlParts.length > 1) {
        var parameters = urlParts[1].split("&");
        for (var i = 0; (i < parameters.length); i++) {
            var sindex = parameters[i].search("=");
            var tname = parameters[i].substring(0, sindex);
            var tval = parameters[i].substring(sindex + 1, parameters[i].length);

            if (!(replaceDuplicates && tname == parameterName)) {
                if (newQueryString == "") {
                    newQueryString = "?";
                } else {
                    newQueryString += "&";
                }
                newQueryString += tname + "=" + tval;
            }
        }
    }

    if (parameterValue !== null) {
        if (newQueryString == "") {
            newQueryString = "?";
        } else {
            newQueryString += "&";
        }
        newQueryString += parameterName + "=" + parameterValue;
    }
    return urlParts[0] + newQueryString;
};

(function (W) {
    
    W.openid = $.fn.cookie(COOKIE_KEY_OPENID);
   
    W.isHoldfunAuthed = $.fn.cookie(COOKIE_KEY_HOLDFUN_AUTHED);
    W.shakeOpenid = $.fn.cookie(COOKIE_KEY_SHAKE_OPENID);
    W.headimgurl = $.fn.cookie(COOKIE_KEY_AVATAR);
    
    W.nickname = $.fn.cookie(COOKIE_KEY_NICKNAME);
   
    W.expires_in = { expires: 30 };


    var mpAuthRedirect = auth_domain_url + "api/mp/auth/snsapi_userinfo";
    var holdfunAuthRedirect = auth_domain_url + "api/mp/auth/snsapi_base";
    var params = null;
    var shakeAuthCount = 0;


    var getParam = function(){
        var jsonObj={};
        var currentSearch = location.search.slice(1).split('&');
        for ( var i = 0 ; i < currentSearch.length  ; i++ ) {
            var sindex = currentSearch[i].search("=");
            var tname = currentSearch[i].substring(0, sindex);
            var tval = currentSearch[i].substring(sindex + 1, currentSearch[i].length);

            if(tname == 'vi'){
                localStorage.setItem('last_vi', tval);
            }else if(tname == 'co'){
                localStorage.setItem('last_co', tval);
            }else if(tname == 'hd'){
                localStorage.setItem('last_hd', tval);
            }else if(tname == 'voi'){
                localStorage.setItem('last_voi', tval);
            }else if(tname == 'nn'){
                localStorage.setItem('last_nn', tval);
            }else if(tname == 'te'){
                localStorage.setItem('last_te', tval);
            }else{
                jsonObj[tname] = tval;
            }

            
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

       

        var cur = location.href;
        cur = add_param1(cur, 'vi', null, true);
        cur = add_param1(cur, 'co', null, true);
        cur = add_param1(cur, 'hd', null, true);
        cur = add_param1(cur, 'voi', null, true);
        cur = add_param1(cur, 'nn', null, true);
        cur = add_param1(cur, 'te', null, true);

        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+ W.mpappid +"&redirect_uri="
                      +  encodeURIComponent( mpAuthRedirect + "?callBackPage=" + callback + "&param=" + params + "&referer=" + cur )
                      + "&response_type=code&scope=snsapi_userinfo&state="+ W.auth_serviceNo +"#wechat_redirect";
    
    };


    /**
     * END OF 公众号授权
     */
    

    params = getParam();
    // mpAuth(holdfunAuth(yaoAuth()));
    mpAuth();

})(window);