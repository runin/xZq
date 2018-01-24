//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'http://yaotv.holdfun.cn/portal/';

var version = 'V1.0';
var share_img = 'http://cdn.holdfun.cn/resources/images/2016/09/06/5f53e49661ce4980ae705a2e6f99e981.jpg';
var share_title = '观看《中国面孔》参与摇一摇互动，赢取超值礼品！';
var share_desc = '观看《中国面孔》打开手机微信参与摇一摇电视，既有趣有有料，还有奖！';
var share_group = share_title;
var share_url = window.location.href;

//使用东南卫视appid互通卡券
var wxcard_appid = 'wx0c280d95d5c32bf6';
var yao_tv_id = 10041;
var shaketv_appid = "wx0c280d95d5c32bf6";
var follow_shaketv_appid = "wx5ab42b9b0f5c95e3";

//测试
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";

//正式
//var serviceNo = "tv_sdtv_face";
//var mpappid = "wx9097d74006e67df3";
//var stationUuid = "08bd418e276540179da602b4554dc44f";
//var channelUuid = "3aaaf39bf7824e37a041165c467f9762";

var wTitle= "中国面孔";//title名称
var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由山东卫视提供<br>新掌趣科技技术支持&amp;Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var thanks_imgs = ['images/thanks-code.jpg','images/thanks-code1.jpg'];
var dev = '';