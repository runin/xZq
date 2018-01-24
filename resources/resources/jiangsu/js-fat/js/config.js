//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
// var domain_url = 'https://yaotv.holdfun.cn/portal/';
var version = 'V3.1';
var share_img = '';
var share_title = '';
var share_desc = '';
var share_group = share_title;
var share_url = window.location.href;

var yao_tv_id = 51101;
var shaketv_appid = "wx801857adaf27891e";
var wxcard_appid = 'wx801857adaf27891e';
var follow_shaketv_appid = "wx4f9afe0a87047cf4";

//测试
var dev = '?dev=chris';
var serviceNo = "tv_cctv2_surprise";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "53dc672b238b4ed2bc3a2f6245882a15";
var channelUuid = "50daf4ba0679424baf8311759a3e9fc9";

//正式
// var dev = '';
// var serviceNo = "tv_jiangsu_cutmylife";
// var mpappid = "wx9097d74006e67df3";
// var channelUuid = "c6ca92df04f2498a929806b22cb866ef";
// var stationUuid = "4160bcaf21e9495f9cf17fe9689f5bbb";

var sharePage = '';
var sharePageExpect = '';
var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由江苏卫视提供<br>新掌趣科技技术支持&Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var thanks_imgs = ['images/code.jpg'];