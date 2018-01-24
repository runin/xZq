var mpappid = 'wx4111efa8ff94aa0d';
var getParam = function(){
    var _jsonobj = {},
    	_lists = decodeURIComponent(location.search.slice(1)).split('&');
    for (var i = 0 ;i < _lists.length; i++) {
        var index = _lists[i].search("=");
        var name = _lists[i].substring(0, index);
        var val = _lists[i].substring(index + 1, _lists[i].length);
        _jsonobj[name] = val;
    };
    return encodeURIComponent(JSON.stringify(_jsonobj));
}

var auth = function(){
    var redirect = 'http://weixin.holdfun.cn/redirect/fandom/' + 'userinfo';
    var params = getParam();
    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + mpappid + "&redirect_uri=" + encodeURIComponent(redirect + "?callBackPage=" + location.href.split('?')[0] + "&param=" + params + '&authCallback=http://fandom.holdfun.cn/fportal/api/weixin/auth/snsapi_third_userinfo') + "&response_type=code&scope=snsapi_userinfo&state=" + quanId + "#wechat_redirect";
};