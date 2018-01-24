//测试
var domain_url = 'http://test.holdfun.cn/portal/';
var report_url = 'http://test.holdfun.cn/reportlog/';

//正式
// var domain_url = 'https://yaotv.holdfun.cn/portal/';
// var report_url = 'http://cs.holdfun.cn/reportlog/';
var version = 'V1.0';
var share_img = 'http://cdn.holdfun.cn/resources/images/2016/08/04/50a01454a74a4078bf2aac386fe85e42.jpg';
var share_title = '娱乐圈第一男神居然是他？ 谁是娱乐圈top1男神 由你说了算！';
var share_desc = '男神势力榜火爆来袭，每晚准时收看东南卫视《娱乐乐翻天》，手机摇一摇参与投票互动，就能为你心中男神投票！还有机会获得节目组送出的限量奖品哦！快快行动吧！';
var share_group = share_title;
var share_url = window.location.href;

//使用东南卫视appid互通卡券
var wxcard_appid = 'wx0c280d95d5c32bf6';
var follow_shaketv_appid = "wx5ab42b9b0f5c95e3";

//测试
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";

//正式--东南卫视
// var yao_tv_id = 10041;
// var shaketv_appid = "wx0c280d95d5c32bf6";
//var serviceNo = "tv_dongnan_yllft2";
//var stationUuid = "5bab04bffa3d4c7caa33ba23b7d06969";
//var channelUuid = "a7ff2d3e97aa4473a7c7017b9602cd35";
// var mpappid = 'wx9097d74006e67df3';

//正式--东南卫视子账号
// var yao_tv_id = 51482;
// var shaketv_appid = "wxd65728047f59a497";
//var serviceNo = "tv_dnwszhh_yllft2";
//var stationUuid = "635cf29168364f69a2bddf605b8d5781";
//var channelUuid = "78125878be8c477ea8c7edc30dc73570";
// var mpappid = 'wx9097d74006e67df3';

var wTitle= "娱乐乐翻天";//title名称
var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由福建广电新媒体提供<br>新掌趣科技技术支持&amp;Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var thanks_imgs = ['images/thanks-code.jpg','images/thanks-code1.jpg'];
var dev = '';