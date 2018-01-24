//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
// var domain_url = 'https://yaotv.holdfun.cn/portal/';
var version = 'V1.0';
var share_img = "http://cdn.holdfun.cn/resources/images/2017/02/24/f307277f48754795b23cf93e685fae46.jpg";
var share_title = "江苏卫视节目单";
var share_desc = "掌上电子节目单，一览当天好节目";
var share_url = window.location.href;

//使用江苏卫视appid互通卡券
var wxcard_appid = 'wx801857adaf27891e';
var yao_tv_id = 10050;
var shaketv_appid = "wx801857adaf27891e";
var follow_shaketv_appid = "";
//测试
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";

//正式
// var serviceNo = "tv_jiangsu_jmdl";
// var mpappid = 'wx9097d74006e67df3';
// var channelUuid = "c6ca92df04f2498a929806b22cb866ef";
// var stationUuid = "4160bcaf21e9495f9cf17fe9689f5bbb";

var wTitle= "江苏卫视";//title名称
var shareData = {
    'imgUrl': share_img,
    'link': share_url,
    'desc': share_desc,
    'title': share_title
};
var rule_temp = '';
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var copyright = '页面由江苏卫视提供<br>新掌趣科技技术支持 & Powered by holdfun.cn';
var dev = '';