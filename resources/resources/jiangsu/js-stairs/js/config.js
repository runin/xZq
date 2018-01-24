//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'https://yaotv.holdfun.cn/portal/';
//DEV注册
//http://test.holdfun.cn/portal/api/common/test?serviceNo=tv_jiangsu_stairs&tvStationUuid=2025fdc4fe104c74b60768fa57050551&tvChannelUuid=2593ae33dee8450699e3a01b56930841&dev=yz

var version = 'V1.0';
var share_img = 'http://cdn.holdfun.cn/resources/images/2016/03/08/0fe6169540c44a39b2a6fe323a5f0730.png';
var share_title = '看《爱的阶梯》参与手机互动得豪礼！';
var share_desc = '观看江苏卫视《爱的阶梯》参与摇电视互动，在互动中与大家比拼对剧情的了解！同时更有惊喜大奖等着你，踏上爱的阶梯，迎接不断豪礼！';
var share_group = share_title;
var share_url = window.location.href;
var serviceNo = 'tv_jiangsu_lovestairs';
var yao_tv_id = 0;
var shaketv_appid = 'wx801857adaf27891e';
var follow_shaketv_appid = 'wxca9de9df38b0951e';

//测试
var stationUuid = '2025fdc4fe104c74b60768fa57050551';
var channelUuid = '2593ae33dee8450699e3a01b56930841';
var mpappid = 'wxc5d930ea846a40e1';

//正式
//var stationUuid = '4160bcaf21e9495f9cf17fe9689f5bbb';
//var channelUuid = 'c6ca92df04f2498a929806b22cb866ef';
//var mpappid = 'wx9097d74006e67df3';

var rule_temp = '';
var yao_avatar_size = 0;
var crossdayLimit = 1 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为1小时。单位ms
var copyright = '页面由江苏卫视提供<br>新掌趣科技技术支持 & Powered by holdfun.cn';
var thanks_tips = ['姿势摆的好，就能中大奖', '别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var dev = '';

var wxData = {
	"imgUrl": share_img,
	"link": share_url,
	"desc": share_desc,
	"title": share_title
};