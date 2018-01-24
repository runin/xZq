//测试环境
var domain_url = "http://test.holdfun.cn/portal/";
//正式环境
//var domain_url = "http://yaotv.holdfun.cn/portal/";
//本地环境
// var domain_url = "http://192.168.0.13:8080/portal/";
// var domain_url = "http://192.168.0.160:8080/portal/";

var resourceType = "1";
var version = "v1.0";

var share_img = "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/2e9ad348950f4d76a241ca2a7c5e06bc/2015/05/04/1c2112236f3b4675a2247a737a4f74ff.jpg";
var share_title = "深圳卫视《下一站婚姻》正在热播，参与互动赢取泰国六日游大礼包！";
var share_desc = "每晚19点30分，锁定深圳卫视《下一站婚姻》，参与微信摇一摇(电视)互动赢取泰国游，签名照或现金红包！";
var share_url = window.location.href;
var share_group = share_title;
var service_no = "tv_szws_nextlove";
var index_bg = 'images/bg.jpg?' + version;
var title_img = 'images/title.png?' + version;
var copyright = "页面由深圳卫视提供<br>掌动优视技术支持&amp;Powered by holdfun.cn";

var yao_tv_id = 10048;
var follow_shaketv_appid = 'wx546630766e556dcd';

//测试
var stationUuid = "e41875a9dfef45adb7281c025197a957";
var channelUuid = "3848d5f452dd4058b28dc58eb40e1d81";
var shaketv_appid = 'wx4e4ed0f61ea6d29c';

//正式
// var stationUuid = "aa747b484802471a84f4375d069e9797";
// var channelUuid = "b4ce4676906049d2826ff0d3c0d15f91";
// var shaketv_appid = 'wx028e76a8342017a4';

var yao_avatar_size = 46;
var answer_delaytimer_zone = 2000;  //单位ms 答题进行中对答错题处理的最大倒数值 例如: 0ms < eT < 2000ms
var answer_delaytimer = 1000;  //单位ms 在answer_delaytimer_zone时间段内处理答错题的显示，防止快速跳转到下一题