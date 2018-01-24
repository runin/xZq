//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'https://yaotv.holdfun.cn/portal/';
var version = 'V1.0';
var share_img = 'http://cdn.holdfun.cn/resources/images/2016/02/24/ee42dd46458c46c9858f06577c811a89.png';
var share_title = '每周四晚收看《华豫之门》，探寻中华文化瑰宝';
var share_desc = '开启华豫之门，溯源中华文化，保护华夏瑰宝，弘扬民族气韵';
var share_group = share_title;
var share_url = window.location.href;

var yao_tv_id = "";
var shaketv_appid = "wxd947dcbb3aab758d";
var follow_shaketv_appid = "";
var follow_shaketv_appid_index = "wx1cdfd94eb93c66e7";//首页一键关注appid
var follow_shaketv_appid_yao = "wxd5ef9003e371faae";//摇奖页一键关注appid

//测试
var serviceNo = "tv_hebeitv_three";
var mpappid = "wxc5d930ea846a40e1";
var stationUuid = "fedc792bb5324726a2e4d43ccaa6694d";
var channelUuid = "70534c7fdbb8462491e225c94eba082b";

//正式
//var serviceNo = "tv_henantv_hyzm";
// var mpappid = "wx9097d74006e67df3";
// var channelUuid = "792ad2d0e13c44519ff54b1f3c1cccd6";
// var stationUuid = "44d176f36e164967a2c5b586c55eff9d";

var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由河南卫视提供<br>河南摇电视互动云平台&Powered by holdfun.cn';
var dev = '';
var textList = [
    '就差一点了，坚持才是胜利啊',
    '据扯，面朝东方更容易中奖',
    '不是不中奖，只是缘分少了点',
    '做人嘛，最重要的就是开心',
    '祝您猴年行大运，运气马上就来啦'
];