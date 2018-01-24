//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'https://yaotv.holdfun.cn/portal/';
//本地环境
//var domain_url = 'http://192.168.0.160:8080/portal/';

// http://test.holdfun.cn/portal/api/common/test?serviceNo=tv_cctv7_2015Festival&tvStationUuid=3e860a4462ec40be878419200707d0dd&tvChannelUuid=f6913a49d6c342c297fbd4cf724193ac&dev=yz

var version = 'V1.0';
var share_img = 'http://yaotv.qq.com/shake_tv/img/30ad3b34-0b70-45b6-a0d4-92757b63506b.jpg';
var share_title = '看CCTV7《2015中国农民艺术节》特别节目，摇动手机，电视手机抢不停！';
var share_desc = '看CCTV7《2015中国农民艺术节》特别节目，摇动手机参与互动，有机会赢取电视手机等超值奖品！';
var share_group = share_title;
var share_url = window.location.href;
var serviceNo = 'tv_cctv7_2015Festival';
// var serviceNo = 'tv_cctv7_2015Festival_cb';	//重播专用业务编号
var yao_tv_id = 10031;
var shaketv_appid = "wx6d86b929be1437b2";
var follow_shaketv_appid = "wx486e050fd1d0b7e2";

//测试
var mpappid = 'wxc5d930ea846a40e1';
var channelUuid = 'f6913a49d6c342c297fbd4cf724193ac';
var stationUuid = '3e860a4462ec40be878419200707d0dd';

//正式
//var mpappid = 'wx9097d74006e67df3';
//var channelUuid = '6aa7d92d39704fa8a31831f74decc25b';
//var stationUuid = 'd58bdf04f1854f14825a2ff0db6730e8';

var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由CCTV7农业节目提供<br>新掌趣科技技术支持&Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var dev = '';