//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'https://yaotv.holdfun.cn/portal/';

var version = 'V1.0';
var share_img = 'http://cdn.holdfun.cn/resources/images/2016/09/13/f3e907a4d4df4365a28a82aba3e27f83.jpg';
var share_title = '观看《中国情歌汇》，听情歌，玩互动，摇红包！';
var share_desc = '拿起手机打开微信点击发现摇一摇（电视），即可参与有奖互动！';
var share_group = share_title;
var share_url = window.location.href;

var yao_tv_id = 10028;
var shaketv_appid = "wxc4594483f2548a4f";
var follow_shaketv_appid = "wx631e5a5921499a48";//
//var follow_shaketv_appid_hnws = "wxd5ef9003e371faae";//投票页河南卫视一键关注appid
var follow_shaketv_appid_hnws = "wx7151c3924e84b7af";//投票页河南卫视一键关注appid
var follow_shaketv_appid_wlf = "wx7151c3924e84b7af";//摇奖页武林风一键关注appid

//测试
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";

//正式
//var serviceNo = "tv_yunnan_chinese_song";
//var mpappid = "wx9097d74006e67df3";
//var channelUuid = "52107fa937b14028aba2c16a9823439e";
//var stationUuid = "9509028bd85644418ca224b7375874dd";

var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由云南卫视提供<br>新掌趣技术支持&Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var thanks_imgs = ['images/code.jpg'];
var dev = '';
