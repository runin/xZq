var infoPage = 1,page = 1,isShowRule = false,isShowHistory = false;
$(function() {
	$('.nav .box-flex').click(function(e) {
		e.preventDefault();
		if($(this).hasClass('active'))return;
		$(this).siblings().removeClass('active').end().addClass('active');
		$('.mod_box').addClass('none').eq($(this).data("index")).removeClass('none');
	});

	getBabyInfo(infoPage, true);
	getResult('baby/history', {page : page, serviceNo : serviceNo}, 'callbackHistoryHandler', false);
	
	$('#sign').click(function(e) {
		e.preventDefault();
		if ($(this).hasClass('signed')) {
			return;
		}
		getResult('signin/savesign', {euid: $('body').data('uuid'),openid: openid}, 'callbackDoSignHandler',false);
	});
	$("#activity_tab").click(function(){
		if(isShowRule)return;
		getResult('common/activtyRule/' + serviceNo, {}, 'callbackRuleHandler', false);
	});
 
	$("#baby_history_more").click(function(){
		getResult('baby/history', {page : page, serviceNo : serviceNo}, 'callbackHistoryHandler', false);
	});
	
	var range = 20, //距下边界长度/单位px
		maxpage = 100, //设置加载最多次数
		totalheight = 0; 
	
	$(window).scroll(function(){
		if ($('#baby-box-field').hasClass('loading-info') || $('body').data('count') < infoPage) {
			return;
		}
	    var srollPos = $(window).scrollTop();
	    totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
		if (($(document).height() - range) <= totalheight  && infoPage < maxpage) {
			getBabyInfo(infoPage);
	    }
	});
});

window.getBabyInfo = function(page, showloading) {
	$('#baby-box-field').addClass('loading-info');
	getResult('baby/info', {page : page, openid : openid, serviceNo : serviceNo}, 'callbackBabyInfo', showloading);
}

window.callbackBabyInfo = function(data) {
	$('#baby-box-field').removeClass('loading-info');
	if(infoPage == 1){
		if(data.leu){
			$('body').data('uuid', data.leu || 0);
			// 是否签到
			getResult('signin/checksign', {euid: data.leu,openid: openid}, 'callbackCheckSignHandler');
		}else{
			setSigned();
		}
		$('body').data('count', data.c || 0);
	}
	if(data.result){
		$.each(data.items,function(i,item){
			$("#baby-box-field").append(spellInfosHtml(item));
		});
		$('body').data('serviceNo', data.sn || 0);
		infoPage++;
	}else{
		if(infoPage == 1){
			var msg = "亲，活动还未开始";
			if(data.message && data.message.length > 0)
				msg = data.message;
			$("#baby-box-field").append('<figure class="babylist" style="text-align: center;"><P>'+msg+'</P></figure>');
		}
	}
};

//是否签到
window.callbackCheckSignHandler = function(data) {
	if (data.code == 1) {
		setSigned();
		if (data.isPhoneNull) {
			setTimeout(function() {
				if (confirm("亲，请完善中奖信息！")){
					backUrl("phone.html");
				}
			}, 200);
		}
	}
};

window.setSigned = function() {
	$('#sign').removeClass('sign').addClass('signed').html('<i></i>今日已签  明日再抢');
};

// 点击签到按钮
window.callbackDoSignHandler = function(data) {
	if (data.code == 3) {
		setSigned();
		setTimeout(function() {
			alert(data.message);
			location.href = "win.html?signinPrizeRecordUuid=" + data.signinPrizeRecordUuid;
		}, 200);
	} else if (data.code == 2) {
		setSigned();
		setTimeout(function() {
			alert(data.message);
		}, 200);
	} else {
		alert(data.message);
	}
};

var spellInfosHtml = function(obj) {
	var url = "javascript:toUrl('vote.html?babyInfoUuid=" + obj.uid + "');";
	return '<figure class="babylist '+ (obj.iln?'new':'')+'">'
			+ '<a href="' + url + '"><img src="'+ obj.ph +'" width="100%"></a>'
			+ '<figcaption class="box-orient-h">'
			+ '<div class="box-flex"><h4 class="ellipsis">'+ obj.nam +'</h4><h5>票数：<em id="'+ obj.uid +'-ticket">'+ obj.tol +'</em></h5></div>'
			+ (obj.end?'':'<div class="vote_box"><a id="'+ obj.uid + '"' + (obj.vote?'':'href="javascript:voteBaby(\''+ obj.uid +'\');"') +' class="'+ (obj.vote?'votebtned':'votebtn')+'" data-collect="true" data-collect-flag="baby-index-vote-btn" data-collect-desc="投票" >'+ (obj.vote?'已投票':'投票') +'</a>'
			+ '<a href="'+ url +'" data-collect="true" data-collect-flag="baby-index-canvassing-btn" data-collect-desc="拉票">拉票</a></div>')
			+ '</figcaption>'
			+ '<div class="lasttime"><i></i>投票截止时间：<em>'+ obj.ved +'</em></div>'
			+ '</figure>';
};

var spellHistoryHtml = function(item) {
	var url = "javascript:toUrl('history_list.html?babyEachUuid=" + item.uid + "');";
	return '<figure class="active_box fd"><a href="' + url + '" data-collect="true" data-collect-flag="baby-index-history" data-collect-desc="'+ item.wq +'期自拍达人">'
	+ '<img src="'
	+ item.fbp
	+ '" width="80px">'
	+ '<figcaption><h4>第'
	+ item.wq
	+ '期</h4><p>'
	+ item.fbn
	+ '</p><span>'
	+ item.bd
	+ '</span></figcaption></a></figure>';
};

window.callbackRuleHandler = function(data) {
	if (data.code == 0) {
		$('#rule').html(data.rule).removeClass('none');
	}
};

window.callbackHistoryHandler = function(data) {
	if (data.result) {
		$.each(data.items,function(i,item){
			$("#history-field").append(spellHistoryHtml(item));
		});
		if(data.items.length < 5){
			$("#baby_history_more").remove();
		}else{
			$("#baby_history_more").removeClass("none");
		}
		page++;
	}else{
		if(!isShowHistory)
			$("#history-field").append('<figure class="active_box fd" style="text-align: center;"><P>暂无往期数据！</P></figure>');
		$("#baby_history_more").remove();
	}
	isShowHistory = true;
};

//投票
window.voteBaby = function(infoUid) {
	getResult('baby/yaoVote', {babyInfoUuid: infoUid,openid: openid,from : gefrom}, 'callbackBabyYaoVoteHandler');
};

window.callbackBabyYaoVoteHandler = function(data){
	if (data.result) {
		//摇进来的是+2票，分享的就是+1
		var ticketNum = 2;
		if(gefrom != null && gefrom != '') ticketNum = 1;
		$("#" + data.uid).empty().html("已投票");
		$("#" + data.uid).removeClass("votebtn").addClass("votebtned");
		$("#" + data.uid).removeAttr("href");
		$("#" + data.uid + "-ticket").html(parseInt($("#" + data.uid + "-ticket").html()) + ticketNum);
	} else
		alert(data.message);
};
