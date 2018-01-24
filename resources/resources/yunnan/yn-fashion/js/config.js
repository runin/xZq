//测试环境
var domain_url = "http://test.holdfun.cn/portal/";
//正式环境
//var domain_url = "http://yaotv.holdfun.cn/portal/";
//本地环境
// var domain_url = "http://192.168.0.13:8080/portal/";
// var domain_url = "http://192.168.0.160:8080/portal/";
// var domain_url = "http://192.168.0.29:8080/portal/";

var resourceType = "1";
var version = "v3.2";

var share_img = "http://cdn.holdfun.cn/resources/images/9509028bd85644418ca224b7375874dd/2015/04/16/7e9c598e8d0b4522883aa63d0e6e18f6.png";
var share_title = "云南卫视邀您参与《时尚我最懂》互动，赢取时尚大礼。";
var share_desc = "周四晚22:20锁定云南卫视《时尚我最懂》，拍立得等时尚大礼等你来拿哦！";
var share_url = window.location.href;
var share_group = share_title;
var serviceNo = "tv_yunnan_sswzd"; //测试环境
//var serviceNo = "tv_yunnan_fashion";  //正式环境
var index_bg = 'images/bg.jpg?' + version;
var title_img = 'images/title.png?' + version;
var copyright = "页面由云南卫视提供<br>新掌趣科技技术支持&amp;Powered by holdfun.cn";

var yao_tv_id = 10028;
var follow_shaketv_appid = 'wx152150e8a01aaa2a';

//测试
var stationUuid = "2e9ad348950f4d76a241ca2a7c5e06bc";
var channelUuid = "82e99bfeec2e479a92ab10c20a8c8dac";
var mpappid = "wxc5d930ea846a40e1";

//正式
//var stationUuid = "9509028bd85644418ca224b7375874dd";
//var channelUuid = "52107fa937b14028aba2c16a9823439e";
//var mpappid = "wx9097d74006e67df3";

var yao_avatar_size = 64;
var answer_delaytimer_zone = 2000;  //单位ms 答题进行中对答错题处理的最大倒数值 例如: 0ms < eT < 2000ms
var answer_delaytimer = 1000;  //单位ms 在answer_delaytimer_zone时间段内处理答错题的显示，防止快速跳转到下一题