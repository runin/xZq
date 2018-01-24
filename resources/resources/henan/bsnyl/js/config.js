//本地环境
//var domain_url = "http://192.168.1.100:8080/portal/";

//测试
var domain_url = 'http://test.holdfun.cn/portal/';
var report_url = 'http://test.holdfun.cn/reportlog/';

//正式
// var domain_url = 'https://yaotv.holdfun.cn/portal/';
// var report_url = 'http://cs.holdfun.cn/reportlog/';
var version = 'V1.0';
var share_img = '';
var share_title = '';
var share_desc = '';
var share_group = share_title;
var share_url = window.location.href;

//使用河南卫视appid互通卡券
var wxcard_appid = 'wxd947dcbb3aab758d';
var yao_tv_id = 10006;
var shaketv_appid = "wxd947dcbb3aab758d";
var follow_shaketv_appid = "wxd5ef9003e371faae";//一键关注appid 河南卫视

//测试
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";


//正式
//var serviceNo = "tv_henantv_jsnyl";
// var mpappid = "wx9097d74006e67df3";
// var channelUuid = "792ad2d0e13c44519ff54b1f3c1cccd6";
// var stationUuid = "44d176f36e164967a2c5b586c55eff9d";

var wTitle= "剧说你要来";//title名称
var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由河南卫视提供<br>河南摇电视互动云平台技术支持&Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var thanks_imgs = ['images/code.jpg'];
var dev = '';