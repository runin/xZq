//测试环境
// var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
var domain_url = 'https://yaotv.holdfun.cn/portal/';
var version = 'V1.0';
var share_img = 'http://cdn.holdfun.cn/resources/images/2017/01/09/cc6329b409664e6baf1292b60a7748cd.jpg';
var share_title = '看精品剧场，喝牛栏山珍品陈酿';
var share_desc = '收看江苏综艺频道《精品剧场》，牛栏山珍品陈酿，每日大放送。';
var share_group = share_title;
var share_url = window.location.href;

//使用江苏综艺appid互通卡券
var wxcard_appid = 'wxad03d0df07e886e8';
//使用山东卫视appid互通卡券
// var wxcard_appid = 'wx3ba142cf8c3fc698';
var yao_tv_id = 10596;
var shaketv_appid = "wxad03d0df07e886e8";
var follow_shaketv_appid = "";

//测试
// var serviceNo = "tv_hebeitv_three";
// var mpappid = "wxc5d930ea846a40e1";
// var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
// var channelUuid = "70534c7fdbb8462491e225c94eba082b";

//正式
var serviceNo = "tv_jszy_jpjc2";
var stationUuid = '4f6c6a32d10f47c792bc6b6f4eff6e41';
var channelUuid = 'd69b0b35a5ca4269b92e2be06f30a51e';
var mpappid = 'wx9097d74006e67df3';

var wTitle= "精品剧场";//title名称
var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由江苏综艺频道提供<br>新掌趣科技技术支持 & Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var thanks_imgs = ['images/thanks-haier.jpg'];
var thanks_imgsSmall = ['images/thanks-blr.jpg', 'images/thanks-jsdjq.jpg'];
var dev = '';