//测试
var domain_url = 'http://test.holdfun.cn/portal/';
var report_url = 'http://test.holdfun.cn/reportlog/';

//正式
// var domain_url = 'http://yaotv.holdfun.cn/portal/';
// var report_url = 'http://cs.holdfun.cn/reportlog/';
var version = 'V1.0';
var share_img = 'http://cdn.holdfun.cn/resources/images/2016/08/10/1b6d6a5420234afdbcfb4131e0f2eceb.png';
var share_title = '《震撼一条龙》喊你来摇奖啦！';
var share_desc = '收看《震撼一条龙》参与摇电视互动，现金红包等你拿！';
var share_group = share_title;
var share_url = window.location.href;

//使用东南卫视appid互通卡券
var wxcard_appid = '';
var yao_tv_id = 51101;
var shaketv_appid = "wxad03d0df07e886e8";
var follow_shaketv_appid = "";

//测试
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";

//正式
//var serviceNo = "tv_jszy_zhytl";
// var stationUuid = '4f6c6a32d10f47c792bc6b6f4eff6e41';
// var channelUuid = 'd69b0b35a5ca4269b92e2be06f30a51e';
// var mpappid = 'wx9097d74006e67df3';

var wTitle= "震撼一条龙";//title名称
var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由江苏综艺频道提供<br>一真科技技术支持&Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var thanks_imgs = ['images/thanks-haier.jpg'];
var thanks_imgsSmall = ['images/thanks-blr.jpg', 'images/thanks-jsdjq.jpg'];
var dev = '';