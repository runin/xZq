//测试环境
//var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
var domain_url = 'https://yaotv.holdfun.cn/portal/';
//本地环境
//var domain_url = 'http://192.168.0.160:8080/portal/';

// http://test.holdfun.cn/portal/api/common/test?serviceNo=tv_shenyang_star&tvStationUuid=57b327411e13499698f799798d01b053&tvChannelUuid=93c382caaca447a6b9f7125acc2b79df&dev=yz

var version = 'V1.0';
var share_img = 'https://yaotv.qq.com/shake_tv/img/20addafd-8776-4a8d-bb92-01c61b729979.png';
var share_title = '我是大明星';
var share_desc = '锁定每周六沈阳新闻频道《我是大明星》参与摇奖，大奖等你拿！';
var share_group = share_title;
var share_url = window.location.href;
var serviceNo = 'tv_shenyang_star';
var yao_tv_id = '';
var shaketv_appid = "wx564dc59cef3d7609";
var follow_shaketv_appid = '';

//测试
//var mpappid = 'wxc5d930ea846a40e1';
//var channelUuid = '93c382caaca447a6b9f7125acc2b79df';
//var stationUuid = '57b327411e13499698f799798d01b053';

//正式
var mpappid = 'wx9097d74006e67df3';
var channelUuid = '410836af35794e5f879f52be87ab090a';
var stationUuid = '2440f1e53cdb49f4a4cd91915747469f';

var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 1 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由沈阳广播电视台提供<br>新掌趣科技技术支持&Powered by holdfun.cn';
var thanks_tips = ['别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var dev = '';