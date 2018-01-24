$(function() {
	getResult("user/" + openid + "/channelUuid/"+ channelUuid +"/integralrank", {}, 'callbackJfRankHandler', true);
	getResult('personal/' + openid + '/channel/'+ channelUuid +'/countprize', {}, 'callbackCountPrizeHandler');
	
	if(nickname != null && nickname != ""){
		$(".avatar").find("p").html(nickname);
	}
	if(headimgurl != null && headimgurl != ""){
		$(".avatar").find("img").attr("src",headimgurl+"/"+yao_avatar_size);
	}
	
	$(".btn-back").click(function(e){
		e.preventDefault();
		toUrl('index.html');
	});
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