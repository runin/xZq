
//正式环境
//var domain_url = "http://yaotv.holdfun.cn/portal/";
var domain_url = "http://test.holdfun.cn/portal/";
var resourceType = "1";
var version = "v2.0";

var share_img = "http://cdn.holdfun.cn/resources/images/53a759c40d4a43318dae737d14a9ab41/2015/09/08/a7f48557c08e49c7917ffa8282ef5f23.png";
var share_title = "微纪录片大赛";
var share_desc = "微纪录片大赛";
var share_url = window.location.href;
var share_group = share_title;
var copyright = "<br>本页面由直播广州提供";

var yao_tv_id = '';
var follow_shaketv_appid = '';

var serviceNo = "tv_xian_zero";	//测试
//var serviceNo = "tv_guangzhou_newsreel";	//正式


//测试 西安二套
var mpappid = "wx9097d74006e67df3";
var stationUuid = "624bbf67b3054c09bb5baa32d123196c";
var channelUuid = "8fe5d6b92b01480cb6a76f5ec3e55984";
//正式
//var mpappid = "wx9097d74006e67df3";
//var stationUuid = "53a759c40d4a43318dae737d14a9ab41";
//var channelUuid = "f3975caf9026456394d69fad8cba2325";

var answer_delaytimer_zone = 2000;  //单位ms 答题进行中对答错题处理的最大倒数值 例如: 0ms < eT < 2000ms
var answer_delaytimer = 1000;  //单位ms 在answer_delaytimer_zone时间段内处理答错题的显示，防止快速跳转到下一题

var textList = [
	'好遗憾，再试一次吧~',
    '没摇中，换个姿势再摇一次呗!',
    '人生最重要的两个字是坚持，继续摇吧!',
    '多摇几次，一定能中的!',
    '听说倒立着摇会中大奖哦~',
    '好遗憾！换只手再摇一摇~'];