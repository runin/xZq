var yao_scope = 'base';
var datet = new Date();
datet.setTime(datet.getTime() +(1000*60*60*20));
var openid = $.fn.cookie(shaketv_appid + '_openid');
var headimgurl = $.fn.cookie(shaketv_appid + '_headimgurl');
var nickname = $.fn.cookie(shaketv_appid + '_nickname');
var expires_in = { expires: datet };
var redirect_url = window.location.href;
var check_weixin_login = function () {
    if (!/micromessenger/i.test(navigator.userAgent)) {
        window.location.href = 'wx.html';
        return false;
    }
    
    if (!window['shaketv']) {
        return false;
    }

    if (!openid) {
        shaketv.authorize(shaketv_appid, yao_scope, function (data) {
            if (data.errorCode == 0) {
                get_info(data.code);
            
            }
        });
    } else {
        $.fn.cookie(shaketv_appid + '_openid', openid, expires_in);
        $.fn.cookie(shaketv_appid + '_headimgurl', headimgurl, expires_in);
        $.fn.cookie(shaketv_appid + '_nickname', nickname, expires_in);
    }
};
var get_info = function (code) {
    $.ajax({
        type: 'GET',
        async: false,
        url: domain_url + 'shaketv/yaotv/userinfo',
        data: { code: code },
        dataType: "jsonp",
        jsonpCallback: 'callbackShaketvYaotvUserinfoHandler',
        success: function (data) {
            if (typeof data.errcode != 'undefined' && data.errcode > 0) {
                return;
            }
            openid = data.openid;
            data.openid && $.fn.cookie(shaketv_appid + '_openid', data.openid, expires_in);
            headimgurl = data.headimgurl;
            data.headimgurl && $.fn.cookie(shaketv_appid + '_headimgurl', data.headimgurl, expires_in);
            nickname = data.nickname;
            data.nickname && $.fn.cookie(shaketv_appid + '_nickname', data.nickname, expires_in);
            window.location.href = redirect_url;
        }
    });
};

$(function () {
    check_weixin_login();
});
