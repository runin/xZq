var domain_url = 'http://test.holdfun.cn/portal/';
// var domain_url = 'https://yaotv.holdfun.cn/portal/';
var report_url = 'http://cs.holdfun.cn/reportlog/';

//DEV注册
//http://test.holdfun.cn/portal/api/common/test?serviceNo=tv_jiangsu_happy&tvStationUuid=2025fdc4fe104c74b60768fa57050551&tvChannelUuid=2593ae33dee8450699e3a01b56930841&dev=yz

var version = 'V1.0';
var share_img = '';
var share_title = '';
var share_desc = '';
var share_url = window.location.href;

//测试
var serviceNo = "tv_jiangsu_happy";
var stationUuid = '2025fdc4fe104c74b60768fa57050551';
var channelUuid = '2593ae33dee8450699e3a01b56930841';
var mpappid = 'wxc5d930ea846a40e1';

//正式
// var serviceNo = "tv_ssports_s2017";
// var stationUuid = "81b0c4045d224904985dbc6000b181be";
// var channelUuid = "49fde001025f4c6b9d7da49c21a15053";
// var mpappid = 'wx9097d74006e67df3';

var wTitle = '新英体育2017新春贺岁';
var sharePage = 'share.html';
var shareData = {
	'imgUrl': share_img,
	'link': share_url,
	'desc': share_desc,
	'title': share_title
};

var actData = {
	"time": 5,
	"recordTime": 60,
	"lotteryTime": 65
};

var dev = '';