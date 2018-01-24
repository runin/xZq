//测试环境
var domain_url = "http://test.holdfun.cn/portal/";
//正式环境
//var domain_url = "https://yaotv.holdfun.cn/portal/";
//var domain_url = "http://192.168.0.120:8080/portal/";
var resourceType = "1";
var version = "v1.0";
var share_img = "http://cdn.holdfun.cn/resources/images/2016/01/28/cbf862f056e44b2f9fb1e04863439795.jpg";
var share_title = "收看CCTV6电影频道《男人的情怀》电影季，赢现洋河金红包、猴酒等大奖好礼！";
var share_desc = "收看CCTV6电影频道《男人的情怀》电影季，打开手机微信摇一摇参与互动摇奖，赢洋河现金红包、猴酒等大奖好礼！";
var share_url = window.location.href;
var share_group = share_title; 
var copyright = "页面由CCTV6提供<br>新掌趣科技技术支持&Powered by holdfun.cn";

var yao_tv_id = '';
var follow_shaketv_appid = '';

var serviceNo = "tv_cctv6yh_man";
var shaketv_appid = "wx4b63ce2a74a75050";
var mpappid = "wx9097d74006e67df3";
var stationUuid = "6bf5dc2ec44f43ee9262c6c3ceb3cd56";
var channelUuid = "62c46b03765046e187c5ab9e6c8f60f0";
var dev="";
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms