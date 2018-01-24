//测试环境
var domain_url = "http://test.holdfun.cn/portal/";
//正式环境
//var domain_url = "http://yaotv.holdfun.cn/portal/";
//本地环境
// var domain_url = "http://192.168.0.13:8080/portal/";
// var domain_url = "http://192.168.0.160:8080/portal/";

var resourceType = "1";
var version = "v1.0";

var share_img = "http://cdn.holdfun.cn/resources/images/910946b8441148f8bc186f0d0fcb3f69/2015/07/08/ae94e3cd20b94ec7ad444f634d192a4f.jpg";
var share_title = "收看《交通360》，现金红包等你拿！";
var share_desc = "收看广西睛彩交通频道《交通360》，使用微信摇一摇（电视），现金红包等你来拿，快来参与吧！";
var share_url = window.location.href;
var share_group = share_title;
var copyright = "页面由广西交通频道提供<br /> 新掌趣科技技术支持&Powered by holdfun.cn";

var yao_tv_id = 10298;
var follow_shaketv_appid = '';

var serviceNo = "tv_gxjiaotong_jiaotong";
//测试
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "2e9ad348950f4d76a241ca2a7c5e06bc";
var channelUuid = "82e99bfeec2e479a92ab10c20a8c8dac";

//正式
//var mpappid = "wx9097d74006e67df3";
//var stationUuid = "910946b8441148f8bc186f0d0fcb3f69";
//var channelUuid = "6ba665810f964fb7a4944b7e88025be3";

var yao_avatar_size = 46;
var answer_delaytimer_zone = 2000;  //单位ms 答题进行中对答错题处理的最大倒数值 例如: 0ms < eT < 2000ms
var answer_delaytimer = 1000;  //单位ms 在answer_delaytimer_zone时间段内处理答错题的显示，防止快速跳转到下一题