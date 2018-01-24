/**
 * Created by Administrator on 2014/7/27.
 */
var babyInfoUuid = getQueryString('babyInfoUuid');
$(function() {
	getResult('baby/vote', {babyInfoUuid: babyInfoUuid,openid: openid}, 'callbackBabyVoteHandler',true);
	$("#btn-share").click(function() {
		share('index.html');
	});
});

window.callbackBabyVoteHandler = function(data){
	if(data.result){
		$("#bigPhoto").attr("src", data.p);
		$("#name").empty().html(data.n);
//		$("#introduction").empty().html(data.indesc);
		$("#ticket").empty().html(data.ttn);
		$("#voteEnd").empty().html(data.ved);
		if(data.vote){
			$("#btn-vote-ticket").removeAttr("href");
			$("#btn-vote-ticket").empty().html("已投票");
			$("#btn-vote-ticket").removeClass("tpbtn").addClass("tpbtned");
		}
		$("#share-ticket").removeClass("none");
		$("#baby-loading").addClass("none");
	}else{
		backUrl("index.html");
	}
}

//投票
window.voteBaby = function() {
	getResult('baby/yaoVote', {babyInfoUuid: babyInfoUuid,openid: openid,from : gefrom}, 'callbackBabyYaoVoteHandler');
}

window.callbackBabyYaoVoteHandler = function(data){
	if (data.result) {
		//摇进来的是+2票，分享的就是+1
		var ticketNum = 2;
		if(gefrom != null && gefrom != '')
			ticketNum = 1;
		$("#btn-vote-ticket").empty().html("已投票");
		$("#btn-vote-ticket").removeAttr("href");
		$("#ticket").html(parseInt($("#ticket").html()) + ticketNum);
		$("#btn-vote-ticket").removeClass("tpbtn").addClass("tpbtned");
	} else
		alert(data.message);
}