//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'https://yaotv.holdfun.cn/portal/';

// http://test.holdfun.cn/portal/api/common/test?serviceNo=tv_cctv13_speak&tvStationUuid=3c6d0bc48e244d738d97d14b97e267a3&tvChannelUuid=62908c579d2b49b69303407f9666d3d0&dev=yz

var version = 'V1.0';
var share_img = 'http://cdn.holdfun.cn/resources/images/2016/01/22/c09916e0fb8e4e35ba970dd816315072.png';
var share_title = '央视新闻频道《春节说吧》，让思念先回家。';
var share_desc = '参与央视《春节说吧》，道出你的心声，说出你的思念。';
var share_group = share_title;
var share_url = window.location.href;
var serviceNo = 'tv_cctv13_speak';
var yao_tv_id = '';
var shaketv_appid = 'wxbb778eb4f2d5d495';
var follow_shaketv_appid = '';

//测试
var mpappid = 'wxc5d930ea846a40e1';
var channelUuid = '62908c579d2b49b69303407f9666d3d0';
var stationUuid = '3c6d0bc48e244d738d97d14b97e267a3';

//正式
//var mpappid = 'wx9097d74006e67df3';
//var channelUuid = '6db4861f31b74eeca8d24a72deb5f840';
//var stationUuid = '2b921f4fc1de41118fb6bdc0e925cac7';

var rule_temp = '';
var yao_avatar_size = 0;
var copyright = '页面由央视新闻提供';
var dev = '';

var wxIsReady = false;
var starNo = 0; //对应明星的编号（编号从0开始增长），如果为是用户自定义贺卡编号为U
var choiceType = 0; //选择寄送给哪种好友 0-家人 1-朋友 2-同事， 默认为 0-家人
var cardDetailType = 0; //贺卡描述类型 0-文字 1-语音， 默认为 0-文字
var defaultName = '说吧用户';
var uploadImgUrl = '';
var downloadFlag = false;
var cardUUID = '';
var hostName = ['董倩', '水均益', '李梓萌', '刚强', '王宁', '郭志坚', '侯丰'];
var hostCDNAvatar = ['http://cdn.holdfun.cn/resources/images/2016/02/01/ab324a429a904c7293a15b7cd4c6fc86.jpg','http://cdn.holdfun.cn/resources/images/2016/02/01/c2b899e157924835afac66a606933aa9.jpg','http://cdn.holdfun.cn/resources/images/2016/02/01/3ac99b49600446d488ff77c6f5a6ba56.jpg','http://cdn.holdfun.cn/resources/images/2016/02/01/521035d6ce0f4f38befbdc4355b6a2aa.jpg','http://cdn.holdfun.cn/resources/images/2016/02/01/dedb70e6638d4725ba6d7a330c83320c.jpg','http://cdn.holdfun.cn/resources/images/2016/02/01/a6a05cd5324d471b8146f1211305af3d.jpg','http://cdn.holdfun.cn/resources/images/2016/02/01/02684be5eead4126899fc55cabaa29ee.jpg'];
var swiper = null;
var userDIYFlag = false;
var userWordFlag = false;
var playVoiceFlag = true;
var stopCheckFlag = true;

var lastDuration = 0;
var recordBegin = 0;
var intervalFlag = 0;
var recordTimeLimit = 30;
var localVoiceID = '';
var uploadVoiceID = '';
var serverVoiceID = '';

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