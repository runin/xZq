//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'https://yaotv.holdfun.cn/portal/';
//本地环境
//var domain_url = 'http://192.168.0.160:8080/portal/';

// http://test.holdfun.cn/portal/api/common/test?serviceNo=tv_xian_2015AM&tvStationUuid=624bbf67b3054c09bb5baa32d123196c&tvChannelUuid=7dc785df091d48f9b79b3cef2d63e2f2&dev=yz

var version = 'V1.0';
var share_img = 'https://yaotv.qq.com/shake_tv/img/20addafd-8776-4a8d-bb92-01c61b729979.png';
var share_title = '2015年新掌趣年终会';
var share_desc = '感谢2015，展望2016。一起与新掌趣摇出未来！';
var share_group = share_title;
var share_url = window.location.href;
var serviceNo = 'tv_xian_2015AM';		// 测试环境
// var serviceNo = 'tv_xian6_2015AM';		// 正式环境
var yao_tv_id = '';
var shaketv_appid = "wx937b62ac2b603d7c";
var wxCard_appid = "wx937b62ac2b603d7c";
var follow_shaketv_appid = '';

//测试
var mpappid = 'wxc5d930ea846a40e1';
var channelUuid = '7dc785df091d48f9b79b3cef2d63e2f2';
var stationUuid = '624bbf67b3054c09bb5baa32d123196c';

//正式
//var mpappid = 'wx9097d74006e67df3';
//var channelUuid = 'e17eaeb7bb054f08b4b94a83c455d8d3';
//var stationUuid = '7fbcc9b60f7e46fab25d1d6f5f5824a8';

var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 1 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由沈阳广播电视台提供<br>新掌趣科技技术支持&Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var dev = '';