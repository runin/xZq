//测试环境
var domain_url = "http://test.holdfun.cn/portal/";
//正式环境
//var domain_url = "http://yaotv.holdfun.cn/portal/";
//本地环境
// var domain_url = "http://192.168.0.13:8080/portal/";
// var domain_url = "http://192.168.0.160:8080/portal/";
// var domain_url = "http://192.168.0.29:8080/portal/";

var resourceType = "1";
var version = "v1.0";

var share_img = "http://cdn.holdfun.cn/resources/images/aa747b484802471a84f4375d069e9797/2015/05/22/def81ae6cdd241e98e9a1521d975efa2.jpg";
var share_title = "深圳卫视《茗天闪亮》正在热播，参与互动赢大奖！";
var share_desc = "每晚19：30，锁定深圳卫视《茗天闪亮》，参与微信摇一摇(电视)互动抢大奖！";
var share_url = window.location.href;
var share_group = share_title;
var service_no = "tv_szws_shining";
var index_bg = 'images/bg.jpg?' + version;
var title_img = 'images/title.png?' + version;
var copyright = "页面由深圳卫视提供<br>掌动优视技术支持&amp;Powered by holdfun.cn";

var yao_tv_id = 10048;
var follow_shaketv_appid = 'wx546630766e556dcd';

var serviceNo = "tv_szws_shining";

//测试
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "e41875a9dfef45adb7281c025197a957";
var channelUuid = "3848d5f452dd4058b28dc58eb40e1d81";

//正式
//var mpappid = "wx9097d74006e67df3"; 
// var stationUuid = "aa747b484802471a84f4375d069e9797";
// var channelUuid = "b4ce4676906049d2826ff0d3c0d15f91";

var yao_avatar_size = 46;
var answer_delaytimer_zone = 2000;  //单位ms 答题进行中对答错题处理的最大倒数值 例如: 0ms < eT < 2000ms
var answer_delaytimer = 1000;  //单位ms 在answer_delaytimer_zone时间段内处理答错题的显示，防止快速跳转到下一题
var sendTime = 5000;    //单位ms 快捷弹幕发送间隔时间  