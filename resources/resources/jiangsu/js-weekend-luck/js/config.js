//测试环境
var domain_url = "http://test.holdfun.cn/portal/";
//正式环境
//var domain_url = "http://yaotv.holdfun.cn/portal/";
//本地环境
 //var domain_url = "http://192.168.0.28:8080/portal/";
// var domain_url = "http://192.168.0.160:8080/portal/";

var resourceType = "1";
var version = "v1.0";

var share_img = "http://cdn.holdfun.cn/resources/images/4160bcaf21e9495f9cf17fe9689f5bbb/2015/07/02/5d9c724047974fd7b2e773fdfb99f3ef.jpg";
var share_title = "收看《周末好运到》，摇微信免费豪礼等你来拿！";
var share_desc = "收看江苏城市频道《周末好运到》，使用微信摇一摇（电视），免费豪礼等你来拿，快来参与吧！";
var share_url = window.location.href;
var share_group = share_title;
var copyright = "页面由江苏城市频道提供<br /> 一真科技技术支持&Powered by holdfun.cn";

var yao_tv_id = 10050;
var follow_shaketv_appid = 'wxc1dd1d3968a6ff20';

var serviceNo = "tv_jiangsu_week_luck";

//测试
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "2e9ad348950f4d76a241ca2a7c5e06bc";
var channelUuid = "82e99bfeec2e479a92ab10c20a8c8dac";

//正式
//var mpappid = "wx9097d74006e67df3";
//var stationUuid = "4160bcaf21e9495f9cf17fe9689f5bbb";
//var channelUuid = "3ebf4abf280844528f9020bf83ee5b8d";

var answer_delaytimer_zone = 2000;  //单位ms 答题进行中对答错题处理的最大倒数值 例如: 0ms < eT < 2000ms
var answer_delaytimer = 1000;  //单位ms 在answer_delaytimer_zone时间段内处理答错题的显示，防止快速跳转到下一题