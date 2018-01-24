//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'https://yaotv.holdfun.cn/portal/';
//本地环境
//var domain_url = 'http://192.168.0.160:8080/portal/';

// http://test.holdfun.cn/portal/api/common/test?serviceNo=tv_cctv6_vivo&tvStationUuid=8f3fa52ed37c49f78d191fe51e3edd5f&tvChannelUuid=8b836d5bf85a49a0b0ad7c068b0ceab5&dev=yz

var version = "V1.0";
var share_img = "http://cdn.holdfun.cn/resources/images/2015/12/21/6bde30d1bde14292a4d4081398990d69.png";
var share_title = "收看CCTV6电影频道急速影院，赢vivoX6手机等百万好礼！";
var share_desc = "收看CCTV6电影频道急速影院，打开手机微信摇一摇参与互动游戏，赢vivoX6智能手机百万豪礼！";
var share_group = share_title;
var share_url = window.location.href;
var serviceNo = "tv_cctv6_vivo";
var yao_tv_id = 51164;
var follow_shaketv_appid = "";
var shaketv_appid = "wx4b63ce2a74a75050";

//测试
var mpappid = "wxc5d930ea846a40e1";
var channelUuid = "8b836d5bf85a49a0b0ad7c068b0ceab5";
var stationUuid = "8f3fa52ed37c49f78d191fe51e3edd5f";

//正式
//var mpappid = "wx9097d74006e67df3";
//var channelUuid = "99b282a74c25485cad444cb3741f9905";
//var stationUuid = "79a0898b68df4de2b3a6149cb98db18f";

var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由CCTV6提供<br>新掌趣科技技术支持&Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var dev = '';