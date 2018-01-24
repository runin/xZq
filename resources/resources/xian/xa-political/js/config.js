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

var yao_tv_id = '10073';
var follow_shaketv_appid = "wxab83ae1ae02145a7";

//测试
var wxcard_appid = 'wxddbb0402d822bee5';
var shaketv_appid = "wxddbb0402d822bee5";
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";
var satisfaction = "fedc792bb5324726a2e4d43ccaa6694d-tv_hebeitv_three-7ff3f8073764476e925c2c3d7420ee23"; //满意
var yawp = "fedc792bb5324726a2e4d43ccaa6694d-tv_hebeitv_three-d4f48b4816824d6d97ec48a2d98c002f"; //不满意


//正式-西安一套电视台
//使用wxcard_appid互通卡券
//var wxcard_appid = 'wxb721f5cd22bb16a4';
//var shaketv_appid = "wxb721f5cd22bb16a4";
//var serviceNo = "tv_xian_political";
//var stationUuid = "624bbf67b3054c09bb5baa32d123196c";
//var channelUuid = "3f5e18aee3db4c5b81560d2f0994f87b";
//var mpappid = 'wx9097d74006e67df3';
//var satisfaction = "624bbf67b3054c09bb5baa32d123196c-tv_xian_political-dd9c7859dcc547478a833d464c032dfb"; //满意
//var yawp = "624bbf67b3054c09bb5baa32d123196c-tv_xian_political-08ac76b1893d442d8d1837f53d4dd870"; //不满意


var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由西安电视台提供<br>新掌趣科技技术支持&Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var thanks_imgs = ['images/thanks-code.jpg','images/thanks-code1.jpg'];
var dev = '';