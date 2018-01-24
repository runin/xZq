//测试
var domain_url = 'http://test.holdfun.cn/portal/';
var report_url = 'http://test.holdfun.cn/reportlog/';

//正式
// var domain_url = 'http://yaotv.holdfun.cn/portal/';
// var report_url = 'http://cs.holdfun.cn/reportlog/';
var version = 'V1.0';
var share_url = window.location.href;

//使用东南卫视appid互通卡券
var wxcard_appid = 'wx0c280d95d5c32bf6';
var follow_shaketv_appid = '';

//测试
var share_img = '';
var share_title = '';
var share_desc = '';
var share_group = share_title;
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";


//正式(都市频道)
//var share_img = '';
//var share_title = '';
//var share_desc = '';
//var share_group = share_title;
//var serviceNo = "tv_fjds_common";
//var mpappid = "wx9097d74006e67df3";
//var channelUuid = "d0c99556b15649de8957201d93779eb0";
//var stationUuid = "8a7f1cc17d854700b0de3122d0a1f459";


//正式（青运频道）
//var share_img = 'http://cdn.holdfun.cn/resources/images/2016/06/02/741e0157ac5c47ecaf6ceecb8532080c.jpg';
//var share_title = '看TV8美洲杯 赢FIFAonline3大奖';
//var share_desc = '看福建青运频道TV8美洲杯，摇一摇拿大奖，FIFAonline3抢不停。';
//var share_group = share_title;
//var yao_tv_id = 10144;
//var serviceNo = 'tv_fjqy_tv8';
//var shaketv_appid = 'wx14e4ad701c075d6c';
//var stationUuid = '16f9bc8199874fbbb481c9014db03c76';
//var channelUuid = 'db91c4378a4445eaa9588abebb3dcd26';
//var mpappid = 'wx9097d74006e67df3';
//var wTitle= "TV8美洲杯";

//正式（东南卫视）
//var share_img = 'http://cdn.holdfun.cn/resources/images/2016/06/16/a1c8f99b46b447249ca0e99e0355c104.jpg';
//var share_title = '看618海交会，赢FIFAonline3大奖';
//var share_desc = '看东南卫视618海交会，摇一摇拿大奖，FIFAonline3抢不停。';
//var share_group = share_title;
//var yao_tv_id = 10041;
//var serviceNo = 'tv_dongnan_618hjh';
//var shaketv_appid = '	wx0c280d95d5c32bf6';
//var stationUuid = "5bab04bffa3d4c7caa33ba23b7d06969";
//var channelUuid = "a7ff2d3e97aa4473a7c7017b9602cd35";
//var mpappid = 'wx9097d74006e67df3';
//var wTitle= "618海交会";

//正式（公共频道全民大娱乐）
// var share_img = '';
// var share_title = '看《全民大娱乐》，为全民娱乐。';
// var share_desc = '微信摇一摇“电视”，进入《全民大娱乐》，超级豪礼等你拿。';
// var share_group = share_title;
// var yao_tv_id = 10041;
// var serviceNo = 'tv_fjgg_qmdyl';
// var shaketv_appid = 'wx61ea749215f94d22';
// var stationUuid = "eaac853541e64c2889a42824835afb8b";
// var channelUuid = "f38e7aeb05394124b7537e8956443609";
// var mpappid = 'wx9097d74006e67df3';
// var wTitle= "全民大娱乐";

//正式（福建电视台海峡卫视）
// var share_img = 'http://cdn.holdfun.cn/resources/images/2016/09/20/f7457ff90ead4eb4807a7cad2e7c774a.jpg';
// var share_title = '中国心，海峡情。';
// var share_desc = '海峡两岸一家亲，微信摇一摇参与互动赢好礼。';
// var share_group = share_title;
// var yao_tv_id = 10141;
// var serviceNo = 'tv_hxws_common';
// var shaketv_appid = 'wx438480355bb78dbe';
// var stationUuid = "c20a46742eae4414ad2a22aca0400464";
// var channelUuid = "ad0f24a3307b4910818ad1b604beeb01";
// var mpappid = 'wx9097d74006e67df3';
// var wTitle= "海峡卫视";

var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由福建广电新媒体提供<br>新掌趣科技技术支持&Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var thanks_imgs = ['images/code.jpg'];
var dev = '';