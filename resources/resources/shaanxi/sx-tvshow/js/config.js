//测试环境
var domain_url = "http://test.holdfun.cn/portal/";
//正式环境
//var domain_url = "https://yaotv.holdfun.cn/portal/";
//var domain_url = "http://192.168.0.120:8080/portal/";
var resourceType = "1";
var version = "v1.0";
var share_img = "http://cdn.holdfun.cn/resources/images/2016/03/29/118a109581354b218df944abe8bbf396.png";
var share_title = "看《陪伴剧场》，免费赢好礼";
var share_desc = "看《陪伴剧场》，对着电视通过微信摇一摇（电视），大奖等你来拿，快来参与吧！";
var share_url = window.location.href;
var share_group = share_title; 
var copyright = "页面由陕西卫视提供<br>新掌趣科技技术支持&Powered by holdfun.cn";
var yao_tv_id = '';
var follow_shaketv_appid = 'wx1094bcd581ce2e00';

var serviceNo = "tv_shaanxi_company";
var shaketv_appid = "wx7b2316d0cbbb058f";
var mpappid = "wx9097d74006e67df3";
var stationUuid = "5dec4168b61b461d968b8c55675ed060";
var channelUuid = "55ecd043bfaa48d492bbf1abe0c29043";
var dev="";
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var yao_avatar_size = 64;