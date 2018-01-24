
//正式环境
//var domain_url = "https://yaotv.holdfun.cn/portal/";

var domain_url = "http://test.holdfun.cn/portal/";
var resourceType = "1";
var version = "v1.0";

var share_img = "https://yao.holdfun.cn/portal/resources/images/624bbf67b3054c09bb5baa32d123196c/2014/09/28/6e298c94ef03433b9d5c4f107164162c.jpg";
var share_title = "收看《西安零距离》，参与调查赢大奖！";
var share_desc = "［看电视.摇微信 掌中有乐趣］看《西安零距离》,通过微信摇一摇(电视)进行电视互动,参与新闻调查！";
var share_url = window.location.href;
var share_group = share_title;
var copyright = "页面由西安广播电视台提供<br>新掌趣科技技术支持&amp;Powered by holdfun.cn";

var yao_tv_id = '10074';
var follow_shaketv_appid = 'wxc969fd346ef191de';
var shaketv_appid = "wxf7d2837930310c4f";
var serviceNo = "tv_xian2_ljl_jywp";	//正式

//正式 西安二套
var mpappid = "wx9097d74006e67df3";
var stationUuid = "527cefb704fe43f2a7d2523a659d73f8";
var channelUuid = "a76ff96889da45cb833002b5d84fd71d";

var answer_delaytimer_zone = 2000;  //单位ms 答题进行中对答错题处理的最大倒数值 例如: 0ms < eT < 2000ms
var answer_delaytimer = 1000;  //单位ms 在answer_delaytimer_zone时间段内处理答错题的显示，防止快速跳转到下一题

var textList = [
	'好遗憾，再试一次吧~',
    '没摇中，换个姿势再摇一次呗!',
    '人生最重要的两个字是坚持，继续摇吧!',
    '多摇几次，一定能中的!',
    '听说倒立着摇会中大奖哦~',
    '好遗憾！换只手再摇一摇~'];

 var dev="";