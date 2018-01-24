//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'https://yaotv.holdfun.cn/portal/';
var version = 'V1.0';
var share_img = '';
var share_title = '';
var share_desc = '';
var share_group = share_title;
var share_url = window.location.href;

var yao_tv_id = 51440;
var shaketv_appid = "wxbec1cdeec592f105";
var wxcard_appid = 'wxbec1cdeec592f105';
var follow_shaketv_appid = "wx7151c3924e84b7af";
//var follow_shaketv_appid_hnws = "wxd5ef9003e371faae";//投票页河南卫视一键关注appid
var follow_shaketv_appid_hnws = "wx7151c3924e84b7af";//投票页河南卫视一键关注appid
var follow_shaketv_appid_wlf = "wx7151c3924e84b7af";//摇奖页武林风一键关注appid

//测试
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";

//正式
/*var dev = '';
var serviceNo = "tv_ysdjq_ysdjq";
var mpappid = "wx9097d74006e67df3";
var channelUuid = "1da4f259f94c4a33b84569393bd9403a";
var stationUuid = "2a20cd9d792b429bb65dc10dc69eee65";*/

//var wxData = {"imgUrl": share_img,"link": share_url,"desc": share_desc,"title": share_title};
var sharePage = 'card.html';
var sharePageExpect = '&SID=';
// var pk_word=["<span style='color:#ffe997'>大鹏展翅</span>","<span style='color:#f601a2'>梅花镖</span>","<span style='color:#0ab41e'>太极一式</span>"];
var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由北京卫视提供<br>新掌趣科技技术支持&Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var thanks_imgs = ['images/code.jpg'];
var dev = '';