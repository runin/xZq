//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
// var domain_url = 'https://yaotv.holdfun.cn/portal/';
var version = 'V1.0';
var share_img = "http://cdn.holdfun.cn/resources/images/2016/03/04/ab65b298b3af449eb7557db398e16671.jpg";
var share_title = "顶级对决！绝版周边！尽在河南卫视《武林风》";
var share_desc = "收看河南卫视《武林风》，玩微信摇电视，周边、大奖送不停！";
var share_url = window.location.href;

//使用河南卫视appid互通卡券
var wxcard_appid = 'wxd947dcbb3aab758d';
var yao_tv_id = 10006;
var shaketv_appid = "wxd947dcbb3aab758d";
var follow_shaketv_appid = "wx116133bec15a09b0";
var follow_shaketv_appid_hnws = "wxd5ef9003e371faae";//摇奖页河南卫视一键关注appid
var follow_shaketv_appid_wlf = "wx116133bec15a09b0";//首页武林风一键关注appid

//测试
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";

//正式
//var serviceNo = "tv_henantv_wlf";
//var mpappid = "wx9097d74006e67df3";
//var channelUuid = "792ad2d0e13c44519ff54b1f3c1cccd6";
//var stationUuid = "44d176f36e164967a2c5b586c55eff9d";

var wTitle= "武林风";//title名称
var shareData = {
    'imgUrl': share_img,
    'link': share_url,
    'desc': share_desc,
    'title': share_title
};
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由河南卫视提供<br>河南广电摇电视互动云平台技术支持&Powered by holdfun.cn';
var dev = '';