//测试环境
var domain_url = "http://test.holdfun.cn/portal/";
//正式环境
//var domain_url = "http://yaotv.holdfun.cn/portal/";
//本地环境
 //var domain_url = "http://192.168.0.28:8080/portal/";
// var domain_url = "http://192.168.0.160:8080/portal/";

var resourceType = "1";
var version = "v1.0";

var share_img = "http://cdn.holdfun.cn/resources/images/6420a707255d4d77bf61aa879e4947d4/2015/07/09/0972eff8962f4a988fb71acb8221a84c.jpg";
var share_title = "每晚19:00锁定广州新闻频道《新闻日日睇》，参与互动赢大奖！";
var share_desc = "每晚19:00锁定广州新闻频道《新闻日日睇》，参与互动投票赢大奖！";
var share_url = window.location.href;
var share_group = share_title;
var copyright = "本页面由直播广州提供<br />新掌趣科技技术支持&Powered by holdfun.cn";

//var yao_tv_id = 10050;
var follow_shaketv_appid = 'wx054e6daa5439e791';
var serviceNo = "tv_guangzhou_daydaydi";
var shaketv_appid = "wx1ded142944ec2e92";
//测试
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "2e9ad348950f4d76a241ca2a7c5e06bc";
var channelUuid = "82e99bfeec2e479a92ab10c20a8c8dac";

//正式
//var mpappid = "wx9097d74006e67df3";
//var stationUuid = "53a759c40d4a43318dae737d14a9ab41";
//var channelUuid = "f3975caf9026456394d69fad8cba2325";
var yao_avatar_size = 64;
var answer_delaytimer_zone = 2000;  //单位ms 答题进行中对答错题处理的最大倒数值 例如: 0ms < eT < 2000ms
var answer_delaytimer = 1000;  //单位ms 在answer_delaytimer_zone时间段内处理答错题的显示，防止快速跳转到下一题