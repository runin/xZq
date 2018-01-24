//测试环境
//var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
var domain_url = 'https://yaotv.holdfun.cn/portal/';
var version = 'V1.3';
var share_img = 'http://cdn.holdfun.cn/resources/images/2016/02/29/e8279f9c62cc4535b9c16bdbb42d479d.png';
var share_title = '顶级对决！绝版周边！尽在河南卫视《勇士的荣耀》';
var share_desc = '收看河南卫视《勇士的荣耀》，玩微信摇电视，周边、大奖送不停！';
var share_group = share_title;
var share_url = window.location.href;

var yao_tv_id = 10588;
var shaketv_appid = "wxd947dcbb3aab758d";
var follow_shaketv_appid = "";
var follow_shaketv_appid_hnws = "wxd5ef9003e371faae";//投票页河南卫视一键关注appid
var follow_shaketv_appid_wlf = "wx7151c3924e84b7af";//摇奖页武林风一键关注appid

//测试
//var dev="?dev=E";
//var serviceNo = "tv_yunnan_theater";
//var mpappid = "wx1f5c419bcb390bdf";
//var stationUuid = "2e9ad348950f4d76a241ca2a7c5e06bc";
//var channelUuid = "82e99bfeec2e479a92ab10c20a8c8dac";

//正式
var dev = '';
var serviceNo = "tv_zhengzhoutv_warrior";
var mpappid = "wx9097d74006e67df3";
var channelUuid = "0699f4f3e4964711a6e3677a60ae243d";
var stationUuid = "96709b79381e4bd98ebf324ca599c24a";

var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由文体频道提供<br/>万名扬传媒技术支持&Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var thanks_imgs = ['images/code.jpg'];
