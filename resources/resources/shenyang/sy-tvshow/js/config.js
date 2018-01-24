//测试环境
var domain_url = "http://test.holdfun.cn/portal/";
//正式环境
//var domain_url = "http://yaotv.holdfun.cn/portal/";
//本地环境
// var domain_url = "http://192.168.0.13:8080/portal/";
// var domain_url = "http://192.168.0.160:8080/portal/";

var resourceType = "1";
var version = "v1.0";

var share_img = "http://yaotv.qq.com/shake_tv/img/20addafd-8776-4a8d-bb92-01c61b729979.png";
var share_title = "沈阳新闻频道沈阳剧场摇奖啦~";
var share_desc = "［看电视.摇微信 掌中有乐趣］看《沈阳剧场》,通过微信摇一摇(电视)进行电视互动,赢取幸运大奖！";
var share_url = window.location.href;
var share_group = share_title;
var index_bg = 'images/bg.jpg?' + version;
var title_img = 'images/title.png?' + version;
var copyright = "页面由沈阳广播电视台提供<br>新掌趣科技技术支持&amp;Powered by holdfun.cn";

var yao_tv_id = 10080;
var follow_shaketv_appid = '';

var serviceNo = "tv_shenyang_tvshow";

//测试
var mpappid = "wxc5d930ea846a40e1"; 
var stationUuid = "57b327411e13499698f799798d01b053";
var channelUuid = "93c382caaca447a6b9f7125acc2b79df";

//正式
//var mpappid = "wx9097d74006e67df3"; 
// var stationUuid = "2440f1e53cdb49f4a4cd91915747469f";
// var channelUuid = "410836af35794e5f879f52be87ab090a";

var yao_avatar_size = 46;
var answer_delaytimer_zone = 2000;  //单位ms 答题进行中对答错题处理的最大倒数值 例如: 0ms < eT < 2000ms
var answer_delaytimer = 1000;  //单位ms 在answer_delaytimer_zone时间段内处理答错题的显示，防止快速跳转到下一题
var sendTime = 5000;    //单位ms 快捷弹幕发送间隔时间  

