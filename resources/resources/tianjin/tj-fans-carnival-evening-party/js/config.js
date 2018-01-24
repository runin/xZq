//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'http://yaotv.holdfun.cn/portal/';

var version = 'V1.0';
var share_img = '';
var share_title = '';
var share_desc = '';
var share_group = share_title;
var share_url = window.location.href;

var yao_tv_id = '';
var follow_shaketv_appid = "";

//测试
var wxcard_appid = 'wxddbb0402d822bee5';
var shaketv_appid = "wxddbb0402d822bee5";
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";

//正式-天津广播电视台都市频道
//使用wxcard_appid互通卡券
//var share_img = 'http://cdn.holdfun.cn/resources/images/2016/08/26/33fc61a3e6e64d92b1aa2ddbfe207d7c.jpg';
//var share_title = '收看天津都市《粉丝节晚会》喊你来摇奖啦！';
//var share_desc = '收看天津都市《粉丝节晚会》参与摇电视互动，好礼大奖等你拿！';
//var wxcard_appid = 'wxe1d58496d1805269';
//var shaketv_appid = "wxe1d58496d1805269";
//var serviceNo = "tv_tianjin_fansParty";
//var stationUuid = "765c31761e2e408dbdf9249d72e54be5";
//var channelUuid = "0337e16f1de74017bce04eaa0878c3a8";
//var mpappid = 'wx9097d74006e67df3';

// 正式-天津广播电视台少儿频道
//使用wxcard_appid互通卡券
//var share_img = 'http://cdn.holdfun.cn/resources/images/2016/08/29/4512260f100e422f9d9aed736d09350e.png';
//var share_title = '收看天津少儿《粉丝节晚会》喊你来摇奖啦！';
//var share_desc = '收看天津少儿《粉丝节晚会》参与摇电视互动，好礼大奖等你拿！';
//var wxcard_appid = 'wx6d724a1f93aa7954';
//var shaketv_appid = "wx6d724a1f93aa7954";
//var serviceNo = "tv_tjsr_fansParty";
//var stationUuid = "1b552d16f2ea46f6bc63a7c177b2e336";
//var channelUuid = "2d6b5cb51f3d4ae5a70c11131eaa614d";
//var mpappid = 'wx9097d74006e67df3';

var wTitle= "粉丝狂欢节";//title名称
var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由天津广播电视台提供<br>天津掌视科技技术支持&amp;Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var thanks_imgs = ['images/thanks-code.jpg','images/thanks-code1.jpg'];
var dev = '';