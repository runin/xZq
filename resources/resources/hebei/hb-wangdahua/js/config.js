//测试环境
var domain_url = "http://test.holdfun.cn/portal/";
//正式环境
//var domain_url = "http://yaotv.holdfun.cn/portal/";
//本地环境
// var domain_url = "http://192.168.0.13:8080/portal/";

var resourceType = "1";
var version = "v1.0";
var share_img = "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/af6ea3c900164b939ad7494523b52c40/2015/04/11/d8efd9b2095c4e4eaeaa90f1b0cf1655.jpg";

var share_title = "《王大花的革命生涯》河北卫视与“妮”同在，明星周边等你来拿！";
var share_desc = "电视机前收看《王大花的革命生涯》的同时,通过微信摇一摇(电视)参与互动 , 答题吐槽还能赢大礼！";
var share_url = window.location.href;
var share_group = share_title;
// var service_no = "tv_hebei_wangdahua";
var service_no = "tv_yunnan_wangdahua";
var index_bg = 'images/bg.jpg?' + version;
var title_img = 'images/title.png?' + version;
var copyright = "页面由河北电视台新媒体运营部提供<br>新掌趣科技技术支持&amp;Powered by holdfun.cn";

// 正式预约ID
// var yao_tv_id = 10005;
// var yao_tv_id = 10051;	// 安徽台测试预约ID
var yao_tv_id = 10028;	// 云南台测试预约ID
var follow_shaketv_appid = '';

//测试 安徽电视台
// var stationUuid = "af6ea3c900164b939ad7494523b52c40";
// var channelUuid = "a8d6d67c9d2d40439cba35ccba790fc5";
// var shaketv_appid = 'wx6ffe3f8cfc8412d7';

//测试 云南电视台
var stationUuid = "2e9ad348950f4d76a241ca2a7c5e06bc";
var channelUuid = "82e99bfeec2e479a92ab10c20a8c8dac";
var shaketv_appid = 'wx1f5c419bcb390bdf';

//正式
// var stationUuid = "738deea1eea144f0b6411cb757022771";
// var channelUuid = "e725249dc5d24e7b87829a8bc645c99f";
// var shaketv_appid = 'wx305d206dce0ae25c';

var yao_avatar_size = 64;


// 评论阀值
var send_limit_count = 5;
// 评论阀值的时间限制 单位s
var send_limit_time = 10;