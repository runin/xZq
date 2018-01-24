//测试环境
var domain_url = "http://test.holdfun.cn/portal/";
//正式环境
//var domain_url = "https://yaotv.holdfun.cn/portal/";
//本地环境
//var domain_url = "http://192.168.0.160:8080/portal/";

// http://test.holdfun.cn/portal/api/common/test?serviceNo=tv_yunnan_zhhmg&tvStationUuid=2e9ad348950f4d76a241ca2a7c5e06bc&tvChannelUuid=e725249dc5d24e7b87829a8bc645c99f&dev=yz

var resourceType = "1";
var version = "V1.0";
var share_title = "《中华好民歌》为民歌发声，谁是歌王，由你决定！";
var share_desc = "电视机前收看《中华好民歌》同时,通过微信摇一摇(电视)参与互动 , 点赞吐槽赢大礼！";
var share_img = "http://cdn.holdfun.cn/resources/images/738deea1eea144f0b6411cb757022771/2015/05/13/6d02ea47b65842d5b7a57ccf22277a4d.jpg";
var serviceNo = "tv_yunnan_zhhmg";//测试
// var serviceNo = "tv_hebeitv_ceshimg";//正式环境测试业务编号
//var serviceNo = "tv_hebeitv_zhhmg";//正式
var copyright = "页面由河北电视台新媒体运营部提供<br/>新掌趣科技技术支持&Powered by holdfun.cn";
var shaketv_appid = 'wx305d206dce0ae25c';
var follow_shaketv_appid = 'wxc95264f9bfb1d189';
var yao_tv_id = 10005;
//测试
var stationUuid = "2e9ad348950f4d76a241ca2a7c5e06bc";
var channelUuid = "82e99bfeec2e479a92ab10c20a8c8dac";
var mpappid = "wxc5d930ea846a40e1";

//正式
//var stationUuid = "738deea1eea144f0b6411cb757022771";
//var channelUuid = "e725249dc5d24e7b87829a8bc645c99f";
//var mpappid = "wx9097d74006e67df3";

var share_url = window.location.href;
var textList = [
    '摇不中啊，换个姿势再摇一次！',
    '人生最重要的两个字是坚持，继续摇吧！',
    '太可惜你长的太帅，大奖被你亮瞎眼了',
    '一大批大奖正在袭来，抓紧摇啊！',
    '太可惜了，竟然与大奖擦肩而过',
    '多摇几次，一定能中的！',
    '不是故意不给中，摇奖姿势要纠正',
    '太遗憾了，换只手吧，再摇一摇'
];
var dev = '';