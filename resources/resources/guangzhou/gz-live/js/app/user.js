$(function() {
	getResult("user/channelUuid/integralrank", {oi : shaketv_openid,cu: channelUuid}, 'callbackJfRankHandler', true);
	getResult('personal/channel/countprize', {oi : shaketv_openid,cu: channelUuid}, 'callbackCountPrizeHandler');
	
	if(nickname != null && nickname != ""){
		$(".avatar").find("p").html(nickname);
	}
	if(headimgurl != null && headimgurl != ""){
		$(".avatar").find("img").attr("src",headimgurl+"/"+yao_avatar_size);
	}
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