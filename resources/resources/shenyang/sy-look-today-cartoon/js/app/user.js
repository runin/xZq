$(function() {
	getResult("user/channelUuid/integralrank", {oi: openid, cu: channelUuid}, 'callbackJfRankHandler', true);
	getResult('personal/channel/countprize', {oi: openid, cu: channelUuid}, 'callbackCountPrizeHandler');
	$('.avatar-wrapper img').attr('src',headimgurl ? (headimgurl + '/' + yao_avatar_size) : './images/avatar.jpg');
	$('.avatar p').text(nickname ? nickname : '沈阳观众');
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