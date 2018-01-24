//测试环境
var domain_url = "http://test.holdfun.cn/portal/";
//var domain_url = "https://yaotv.holdfun.cn/portal/";
//本地环境
//var domain_url = "http://192.168.0.120:8080/portal/";
var version = "V1.0";
var share_img = "http://cdn.holdfun.cn/resources/images/2016/02/03/4407df6dd6c44cb48a25c2afdce2f932.png";
var share_title = "收看CCTV7《乡村大世界之过年了》，参与互动赢取大奖！";
var share_desc = "看CCTV7《乡村大世界之过年了》，参与摇一摇互动赢取大奖！";
var share_group = share_title;
var share_url = window.location.href;
var serviceNo = "tv_cctv7_gnl";
var yao_tv_id = "10031";
var follow_shaketv_appid = "wx486e050fd1d0b7e2";
var shaketv_appid = "wx6d86b929be1437b2";
var mpappid = "wx9097d74006e67df3";
var channelUuid = "6aa7d92d39704fa8a31831f74decc25b";
var stationUuid = "d58bdf04f1854f14825a2ff0db6730e8";
var yao_avatar_size = 64;  
var copyright = '页面由CCTV7提供<br>新掌趣科技技术支持&Powered by holdfun.cn';
var dev="";
var textList = [
    '就差一点了，坚持才是胜利啊',
    '据扯，面朝东方更容易中奖',
    '不是不中奖，只是缘分少了点',
    '做人嘛，最重要的就是开心',
    '祝您猴年行大运，运气马上就来啦'
];
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var wxIsReady = false;

var wxData = {
	"imgUrl": share_img,
	"link": share_url,
	"desc": share_desc,
	"title": share_title
};

var wxshareData = {
    "imgUrl": share_img,
    "link": share_url,
    "desc": share_desc,
    "title": share_title
};