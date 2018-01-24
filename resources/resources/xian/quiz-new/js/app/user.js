$(function() {
    getResult('api/lottery/integral/rank/self', {
        oi: openid
    }, 'callbackIntegralRankSelfRoundHandler', true);
	getResult('personal/' + openid + '/channel/'+ channelUuid +'/countprize', {}, 'callbackCountPrizeHandler');
});

window.callbackIntegralRankSelfRoundHandler = function (data) {
	if (data.result) {
		$('.ph').find('strong').text(data.rk || 0);
		$('.jf').find('strong').text(data.in || 0);
	}
}
window.callbackCountPrizeHandler = function (data) {
	if (data.code == 0) {
		$('.lp').find('strong').text(data.cp || 0);
	}
}