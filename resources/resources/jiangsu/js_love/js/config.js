﻿//测试环境
//var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
var domain_url = 'https://yaotv.holdfun.cn/portal/';
//DEV注册
//http://test.holdfun.cn/portal/api/common/test?serviceNo=tv_jiangsu_happy&tvStationUuid=2025fdc4fe104c74b60768fa57050551&tvChannelUuid=2593ae33dee8450699e3a01b56930841&dev=yz

var version = 'V2.9';
var share_img = 'http://cdn.holdfun.cn/resources/images/2016/04/14/91837a3250f840b1a6ae7f9d4d44ac21.png';
var share_title = '看江苏卫视电视剧，参与手机互动，集齐卡牌得壕礼！';
var share_desc = '我与卡牌之间，只差一个你。卫视好礼大派发，快戳进来看看。';
var share_group = share_title;
var share_url = window.location.href;
// var serviceNo = 'tv_jiangsu_happy';
// var serviceNo = 'tv_jiangsu_dazf';
var serviceNo = 'tv_jiangsu_EmotionalTheatre';
var yao_tv_id = 10050;
var shaketv_appid = 'wx801857adaf27891e';
var follow_shaketv_appid = 'wxca9de9df38b0951e';

//测试
//var dev="?dev=E";
//var mpappid = "wx1f5c419bcb390bdf";
//var stationUuid = "2e9ad348950f4d76a241ca2a7c5e06bc";
//var channelUuid = "82e99bfeec2e479a92ab10c20a8c8dac";

//正式
var dev = '';
var stationUuid = '4160bcaf21e9495f9cf17fe9689f5bbb';
var channelUuid = 'c6ca92df04f2498a929806b22cb866ef';
var mpappid = 'wx9097d74006e67df3';

var yao_avatar_size = 0;
var textList  = ["天若有情天亦老，给个红包好不好！"]
var crossdayLimit = 1 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为1小时。单位ms
// var tongjiKey = '2025fdc4fe104c74b60768fa57050551-tv_jiangsu_happy-6d3e17f3d0664e97bd5ff98db777eac9';
// var tongjiKey = '4160bcaf21e9495f9cf17fe9689f5bbb-tv_jiangsu_dazf-50d725b91ebe4be6811349b329e16029';
var tongjiKey = '4160bcaf21e9495f9cf17fe9689f5bbb-tv_jiangsu_dfzc-61219a50142a435d8054aebd48f80435';
var copyright = '页面由江苏卫视提供<br>新掌趣科技技术支持 & Powered by holdfun.cn';
var wxData = {"imgUrl": share_img,"link": share_url,"desc": share_desc,"title": share_title};
var wxshareData = {"imgUrl": share_img,"link": share_url,"desc": share_desc,"title": share_title};
var sharePage = 'card.html';
var sharePageExpect = 'cardPU=&';