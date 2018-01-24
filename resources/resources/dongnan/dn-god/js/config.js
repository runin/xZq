//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'https://yaotv.holdfun.cn/portal/';
//本地环境
//var domain_url = 'http://192.168.0.160:8080/portal/';

// http://test.holdfun.cn/portal/api/common/test?serviceNo=tv_dongnan_god&tvStationUuid=59eeecb199954602ba89a4c9611e752c&tvChannelUuid=251ded3ed9e94035b53aec32371c4f88&dev=yz

var version = "V1.0";
var share_img = "http://cdn.holdfun.cn/resources/images/2016/01/04/e58fd3070bde43e9b7fbb746baa34456.png";
var share_title = "锁定东南卫视《男神女神颜习社》，免费抢好礼啦！";
var share_desc = "收看《男神女神颜习社》，对着电视通过微信摇一摇（电视），免费豪礼等你来拿，快来参与吧！";
var share_group = share_title;
var share_url = window.location.href;

//使用东南卫视appid互通卡券
var wxcard_appid = 'wx0c280d95d5c32bf6';
var follow_shaketv_appid = "wx5ab42b9b0f5c95e3";


//测试
var mpappid = "wxc5d930ea846a40e1";
var channelUuid = "251ded3ed9e94035b53aec32371c4f88";
var stationUuid = "59eeecb199954602ba89a4c9611e752c";

//正式--东南卫视
// var serviceNo = "tv_dongnan_god";
// var yao_tv_id = 10041;
// var shaketv_appid = "wx0c280d95d5c32bf6";
//var mpappid = "wx9097d74006e67df3";
//var channelUuid = "a7ff2d3e97aa4473a7c7017b9602cd35";
//var stationUuid = "5bab04bffa3d4c7caa33ba23b7d06969";

// 正式--东南卫视子账号
//var serviceNo = "tv_dnwszhh_god";
//var yao_tv_id = 10041;
//var shaketv_appid = "wxd65728047f59a497";
//var mpappid = "wx9097d74006e67df3";
//var channelUuid = "78125878be8c477ea8c7edc30dc73570";
//var stationUuid = "635cf29168364f69a2bddf605b8d5781";

var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由福建广电新媒体提供<br>新掌趣科技技术支持&Powered by holdfun.cn';
var thanks_tips = ['就这样与红包擦身而过了，继续加油哦！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var dev = '';