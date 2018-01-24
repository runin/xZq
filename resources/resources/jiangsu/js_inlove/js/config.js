//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'https://yaotv.holdfun.cn/portal/';
//DEV注册
//http://test.holdfun.cn/portal/api/common/test?serviceNo=tv_jiangsu_happy&tvStationUuid=2025fdc4fe104c74b60768fa57050551&tvChannelUuid=2593ae33dee8450699e3a01b56930841&dev=yz

var version = 'V1.0';
var share_img = '';
var share_title = '';
var share_desc = '';
var share_url = window.location.href;
var serviceNo = 'tv_jiangsu_letslove';
var yao_tv_id = 10050;
var shaketv_appid = 'wx801857adaf27891e';
var follow_shaketv_appid = 'wxca9de9df38b0951e';

//测试
var stationUuid = '2025fdc4fe104c74b60768fa57050551';
var channelUuid = '2593ae33dee8450699e3a01b56930841';
var mpappid = 'wxc5d930ea846a40e1';

//正式
// var stationUuid = '4160bcaf21e9495f9cf17fe9689f5bbb';
// var channelUuid = 'c6ca92df04f2498a929806b22cb866ef';
// var mpappid = 'wx9097d74006e67df3';

var yao_avatar_size = 0;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var copyright = '页面由江苏卫视提供<br>新掌趣科技技术支持 & Powered by holdfun.cn';
var dev = '?dev=yz';