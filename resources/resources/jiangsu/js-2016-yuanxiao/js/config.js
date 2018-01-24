var domain_url = "http://test.holdfun.cn/portal/"; 
var domain_url = "http://yaotv.holdfun.cn/portal/"; 

var serviceNo = 'tv_szws_street';
var serviceNo = 'tv_jiangsu_jsyx';

// var isDev = 'bob';

var share_img = '';
var share_title = '';
var share_desc = '';
var share_page = '';

// 业务编号
var mpappid = 'wx9097d74006e67df3';
var shaketv_appid  = 'wx801857adaf27891e';
var version = '3';

var COOKIE_KEY_OPENID = mpappid + '_openid' + version;
var COOKIE_KEY_SHAKE_OPENID = '';
var COOKIE_KEY_HOLDFUN_AUTHED = 'holdfun_authed' + version;

var COOKIE_KEY_NICKNAME = mpappid + '_nickname' + version;
var COOKIE_KEY_AVATAR = mpappid + '_headimgurl' + version;

var rollingCost = 30;

var gameConfig = {
	// 加载资源
	assetsToLoader : [
		"http://yaotv.qq.com/shake_tv/auto2/2016/02/24fhrcyiktg69bg/bg-game.jpg",
		"../images/icon-game-door-left.jpg",
		"../images/icon-game-door-right.jpg",
		"http://yaotv.qq.com/shake_tv/auto2/2016/02/24fhrcyiktg69bg/bg-game-door.png",
		"http://yaotv.qq.com/shake_tv/auto2/2016/02/24fhrcyiktg69bg/bg-game-cover-bottom.png"
	]
};

var LS_KEY_IS_ACCPECTED_50 = 'accept_50_' + version;