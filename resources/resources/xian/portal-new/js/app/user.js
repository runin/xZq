$(function() {
	getResult("user/" + openid + "/channelUuid/"+ channelUuid +"/integralrank", {}, 'callbackJfRankHandler', true);
	getResult('personal/' + openid + '/channel/'+ channelUuid +'/countprize', {}, 'callbackCountPrizeHandler');
});

window.callbackJfRankHandler = function (data) {
	if (data.code == 0) {
		$('.ph').find('strong').text(data.rk || 0);
		$('.jf').find('strong').text(data.jf || 0);
	}
}
window.callbackCountPrizeHandler = function (data) {
	if (data.code == 0) {
		$('.lp').find('strong').text(data.cp || 0);
	}
}