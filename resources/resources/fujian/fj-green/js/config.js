//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'https://yaotv.holdfun.cn/portal/';
//DEV注册
//http://test.holdfun.cn/portal/api/common/test?serviceNo=tv_fjtv_green&tvStationUuid=cf1a27e71052436caf406b80940188db&tvChannelUuid=bba621b653914b08a16858ab9dbd5146&dev=yz

var version = 'V1.0';
var share_img = 'http://cdn.holdfun.cn/resources/images/2016/02/26/638f2a94040543798dd5c01287cbc3c7.png';
var share_title = '锁定福建电视台全频道《惜福护绿》，轻松抢超值大礼！';
var share_desc = '收看《惜福护绿》，对着电视通过微信摇一摇（电视），超值大奖等你来拿，快来参与吧！';
var share_group = share_title;
var share_url = window.location.href;
//使用东南卫视appid互通卡券
var wxcard_appid = 'wx0c280d95d5c32bf6';

//测试
var yao_tv_id = 0;
var serviceNo = 'tv_fjtv_green';
var shaketv_appid = 'wx42b81d2a2af2fb72';
var stationUuid = 'cf1a27e71052436caf406b80940188db';
var channelUuid = 'bba621b653914b08a16858ab9dbd5146';
var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
var mpappid = 'wxc5d930ea846a40e1';

//正式（综合频道）
//var yao_tv_id = 10138;
//var serviceNo = 'tv_fjtv_green';
//var shaketv_appid = 'wxe2ca2cf669263ba0';
//var stationUuid = 'fb4b1e17bb3f4a21816287e2d31132c1';
//var channelUuid = '1fed746dc09445eb9abbcbaf7e838d41';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（综合频道-地推1）
//var yao_tv_id = 10138;
//var serviceNo = 'tv_fjtv_green4dt1';
//var shaketv_appid = 'wxe2ca2cf669263ba0';
//var stationUuid = 'fb4b1e17bb3f4a21816287e2d31132c1';
//var channelUuid = '1fed746dc09445eb9abbcbaf7e838d41';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（综合频道-地推2）
//var yao_tv_id = 10138;
//var serviceNo = 'tv_fjtv_green4dt2';
//var shaketv_appid = 'wxe2ca2cf669263ba0';
//var stationUuid = 'fb4b1e17bb3f4a21816287e2d31132c1';
//var channelUuid = '1fed746dc09445eb9abbcbaf7e838d41';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（综合频道-地推3）
//var yao_tv_id = 10138;
//var serviceNo = 'tv_fjtv_green4dt3';
//var shaketv_appid = 'wxe2ca2cf669263ba0';
//var stationUuid = 'fb4b1e17bb3f4a21816287e2d31132c1';
//var channelUuid = '1fed746dc09445eb9abbcbaf7e838d41';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（综合频道-地推4）
//var yao_tv_id = 10138;
//var serviceNo = 'tv_fjtv_green4dt4';
//var shaketv_appid = 'wxe2ca2cf669263ba0';
//var stationUuid = 'fb4b1e17bb3f4a21816287e2d31132c1';
//var channelUuid = '1fed746dc09445eb9abbcbaf7e838d41';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（综合频道-地推5）
//var yao_tv_id = 10138;
//var serviceNo = 'tv_fjtv_green4dt5';
//var shaketv_appid = 'wxe2ca2cf669263ba0';
//var stationUuid = 'fb4b1e17bb3f4a21816287e2d31132c1';
//var channelUuid = '1fed746dc09445eb9abbcbaf7e838d41';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（综合频道-帮帮团）
//var yao_tv_id = 10138;
//var serviceNo = 'tv_fjtv_green4bbt';
//var shaketv_appid = 'wxe2ca2cf669263ba0';
//var stationUuid = 'fb4b1e17bb3f4a21816287e2d31132c1';
//var channelUuid = '1fed746dc09445eb9abbcbaf7e838d41';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（东南卫视）
//var yao_tv_id = 10041;
//var serviceNo = 'tv_dongnan_green';
//var shaketv_appid = 'wx0c280d95d5c32bf6';
//var stationUuid = '5bab04bffa3d4c7caa33ba23b7d06969';
//var channelUuid = 'a7ff2d3e97aa4473a7c7017b9602cd35';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（电视剧频道）
//var yao_tv_id = 10168;
//var serviceNo = 'tv_fjplay_green';
//var shaketv_appid = 'wx6ed71e20c36e38df';
//var stationUuid = '778aae3e0b1a4bb4970954d87ea1a297';
//var channelUuid = '4cb41a4fcc3247479a77738351c4beb2';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（都市时尚频道）
//var yao_tv_id = 10142;
//var serviceNo = 'tv_fjdushi_green';
//var shaketv_appid = 'wx669467cb0aa7b94e';
//var stationUuid = '8a7f1cc17d854700b0de3122d0a1f459';
//var channelUuid = 'd0c99556b15649de8957201d93779eb0';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（公共频道）
//var yao_tv_id = 10142;
//var serviceNo = 'tv_fjgg_green';
//var shaketv_appid = 'wx61ea749215f94d22';
//var stationUuid = 'eaac853541e64c2889a42824835afb8b';
//var channelUuid = 'f38e7aeb05394124b7537e8956443609';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（经视频道）
//var yao_tv_id = 10143;
//var serviceNo = 'tv_fjem_green';
//var shaketv_appid = 'wx7fd729f116fadf8b';
//var stationUuid = '583f132de0f548c788ef7555aaafbec4';
//var channelUuid = '72ae8d12bb204ab985c1a535fe36b719';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（体育频道）
//var yao_tv_id = 10144;
//var serviceNo = 'tv_fjqy_green';
//var shaketv_appid = 'wx14e4ad701c075d6c';
//var stationUuid = '16f9bc8199874fbbb481c9014db03c76';
//var channelUuid = 'db91c4378a4445eaa9588abebb3dcd26';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（少儿频道）
//var yao_tv_id = 10145;
//var serviceNo = 'tv_fjsr_green';
//var shaketv_appid = 'wx15bd44e42767404d';
//var stationUuid = '35eee45124ef4d77b3d9a3a32d97edbb';
//var channelUuid = 'eef1da0b6cae4efc99141c48ca70b9a2';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

//正式（海峡卫视）
//var yao_tv_id = 10141;
//var serviceNo = 'tv_hxws_green';
//var shaketv_appid = 'wx438480355bb78dbe';
//var stationUuid = 'c20a46742eae4414ad2a22aca0400464';
//var channelUuid = 'ad0f24a3307b4910818ad1b604beeb01';
//var follow_shaketv_appid = 'wx5ab42b9b0f5c95e3';
//var mpappid = 'wx9097d74006e67df3';

var rule_temp = '';
var yao_avatar_size = 0;
var crossdayLimit = 1 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为1小时。单位ms
var copyright = '页面由福建广电新媒体有限公司提供<br>新掌趣科技技术支持 & Powered by holdfun.cn';
var thanks_tips = ['姿势摆的好，就能中大奖', '别灰心，继续加油！','可能是姿势不对哦~','加油~好运马上就来','换个姿势，再来一次！','再来一次，大奖在等你哦！'];
var dev = '';