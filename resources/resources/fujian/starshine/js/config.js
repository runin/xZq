//测试环境
var domain_url = "http://test.holdfun.cn/portal/";
//正式环境
//var domain_url = "https://yaotv.holdfun.cn/portal/";
//var domain_url = "http://192.168.0.120:8080/portal/";
var resourceType = "1";
var version = "v1.0";
var share_img = "http://cdn.holdfun.cn/resources/images/2016/04/08/5c99416f65044d898a10516acdb4e9bb.png";
var share_title = "福建综合频道《星光大擂台》，敢唱你就来！";
var share_desc = "相信音乐力量，期待动人声音，报名通道已开启，还有大礼等你来摇！";
var share_url = window.location.href;
var share_group = share_title; 
var copyright = "页面由福建广电新媒体提供<br>新掌趣科技技术支持&Powered by holdfun.cn";
var yao_tv_id = '';
var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
var shaketv_appid = "wxe2ca2cf669263ba0";
//使用东南卫视appid互通卡券
var wxcard_appid = 'wx0c280d95d5c32bf6';

//测试
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";

//正式(综合-》摇电视)
//var serviceNo = "tv_fjtv_starshine";
// var mpappid = "wx9097d74006e67df3";
// var stationUuid = "fb4b1e17bb3f4a21816287e2d31132c1";
// var channelUuid = "1fed746dc09445eb9abbcbaf7e838d41";

var dev="";
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var yao_avatar_size = 64;