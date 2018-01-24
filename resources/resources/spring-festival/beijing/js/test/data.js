/*
	result	true中奖  false未中奖，为true时返回以下内容
	pn	prizeName：奖品名称
	pp	prizePicture：奖品图片URI路径
 */
var callbackLotteryHandlerData = {
	result: false,
	pn: '10元',
	pp: ''
};

/*
	result	-2请求非法 -1参数非法 0未中奖 1领奖成功
*/
var callbackAwardHandlerData = {
	result: 1
};


/*
	result	true成功  false失败，为true时返回以下内容
	hi	headimguri：发送贺卡用户的微信头像URI地址
	nn	nickname：发送贺卡用户的微信昵称
	gt	greeting：用户发送的贺卡内容
	vi	voice：用户提交的贺卡语音祝福语编号
	sn	starNo：用户贺卡关联的明星编号，编号由前端定义
*/
var callbackCardInfoHandlerData = {
	result: true,
	hi: 'http://cdn.holdfun.cn/ahtv/images/stars/%E4%B9%94%E4%BB%BB%E6%A2%81.jpg',
	nn: '大乔小乔',
	gt: '顶戴d',
	vi: 'http://cdn.holdfun.cn/ahtv/audios/%E4%BF%9E%E9%A3%9E%E9%B8%BF.mp3',
	sn: 11	
};

/*
	result	true成功  false失败，为true时返回以下内容
	cu	cardUuid：即贺卡在平台的唯一编号
*/
var callbackMakeCardHandlerData = {
	result: true,
	cu: 'b4ca2de95a23401bb6f380da594167b6'
};