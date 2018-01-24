//测试环境
var domain_url = 'http://test.holdfun.cn/portal/';
//正式环境
//var domain_url = 'https://yaotv.holdfun.cn/portal/';

// http://test.holdfun.cn/portal/api/common/test?serviceNo=tv_cctv1_mxsd&tvStationUuid=0ff2d291e25e4d469a06c8c63ea89629&tvChannelUuid=f8d1e1af5ef24915a13ba5985c0b45d8&dev=yz

var version = 'V1.0';
var share_img = 'http://cdn.holdfun.cn/resources/images/2016/01/28/ae77c42c270c4aa3b4cad641608f48a2.png';
var share_title = '收看《梦想公益盛典》扫一扫二维码参与互动，赢取梦金园黄金大礼！';
var share_desc = '扫一扫屏幕二维码参与梦想公益盛典互动，赢取梦金园金条金猴等黄金大礼！';
var share_group = share_title;
var share_url = window.location.href;
var serviceNo = 'tv_cctv1_mxsd';
var yao_tv_id = '';
var shaketv_appid = 'wxe8e712137c1fbd04';
var follow_shaketv_appid = '';

//测试
var mpappid = 'wxc5d930ea846a40e1';
var channelUuid = 'f8d1e1af5ef24915a13ba5985c0b45d8';
var stationUuid = '0ff2d291e25e4d469a06c8c63ea89629';

//正式
//var mpappid = 'wx9097d74006e67df3';
//var channelUuid = '6e33320b81b84ea6803030861a9bad57';
//var stationUuid = 'c19f0495e5ad470a8f334e2bccff5b26';

var defalut_rule = '1、欢迎收看CCTV-1梦金园《梦想公益盛典》，陪您欢天喜地过大年！<br />2、参与方式：观看节目时，打开手机微信，点击发现，选择摇一摇（电视），摇动手机即可参与摇奖；<br />3、实物中奖观众请确保填写正确的联系方式，以便节目结束后派发奖品，如有联系方式错误或不完善的情况，则视为自动弃权；所有奖品将在春节假期过后陆续发送，请耐心等待；<br />4、卡券中奖观众可在梦金园京东微店购物时抵用，具体请参照卡券使用规则；凭此券序列码(点击“出示使用”即会显示序列码)也可在梦金园天猫、京东旗舰店电脑端进行下单使用，请您在下单购买前，出示您的【优惠券序列码】以及【中奖微信账号ID】给接待您的在线客服。梦金园天猫旗舰店电脑端网址：https://mokingran.tmall.com 梦金园京东旗舰店电脑端网址：http://mokingran.jd.com<br />5、本奖品由梦金园黄金独家提供，奖品的兑换使用及售后由梦金园全权负责；<br /><br /><br />';
var rule_temp = '';
var yao_avatar_size = 64;
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
var copyright = '页面由CCTV1提供<br>新掌趣科技技术支持&Powered by holdfun.cn';
var thanks_tips = ['继续摇，摇出一年的好运气！','过年添金添福，金子就在不远处！','金子抱回家，红包抢到手，就差一摇啦！','梦金园祝您新年有梦、有金、有团圆！','哎呀，一不小心与金子擦肩而过了！','姿势要美、角度要好、抢红包要趁早','金日宜表白、宜抢红包、宜抢金!  '];
var dev = '';