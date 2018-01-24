//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
// var domain_url = 'https://yaotv.holdfun.cn/portal/';
var version = 'V1.0';
var share_img = "http://cdn.holdfun.cn/resources/images/2017/01/17/22f3dff2bbd94382b72f1202da916351.png";
var share_title = "广西公共频道少儿春晚";
var share_desc = "看《少儿春晚》通过微信摇一摇(电视)，丰盛好礼摇不停！";
var share_url = window.location.href;

//使用河南卫视appid互通卡券
var wxcard_appid = 'wxd947dcbb3aab758d';
var yao_tv_id = 10331;
var shaketv_appid = "wx9c16aac4338f2032";
var follow_shaketv_appid = "";
//测试
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";

//正式
//var serviceNo = "tv_gxgonggong_srcw";
// var mpappid = 'wx9097d74006e67df3';
// var channelUuid = "5e1f59a756f148fcaafc2922aea1c549";
// var stationUuid = "8785070ef96b4316b067ad9331c390a2";

var wTitle= "广西少儿春晚";//title名称
var shareData = {
    'imgUrl': share_img,
    'link': share_url,
    'desc': share_desc,
    'title': share_title
};
var rule_temp = '';
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var copyright = '页面由广西电视台提供<br>新掌趣科技技术支持&Powered by holdfun.cn';
var dev = '';