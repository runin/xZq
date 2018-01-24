var page = 1,rangPage = 1,isShowRule = false,isShowHistory = false;
$(function() {
	$('.nav .box-flex').click(function(e) {
		e.preventDefault();
		if($(this).hasClass('active'))return;
		$(this).siblings().removeClass('active').end().addClass('active');
		$('.mod_box').addClass('none').eq($(this).data("index")).removeClass('none');
	});

	getRangInfo(rangPage, true);
	
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
	$("#history_tab").click(function(){
		if(isShowHistory)return;
		getResult('baby/history', {page : page, serviceNo : serviceNo}, 'callbackHistoryHandler', false);
	});
	$("#baby_history_more").click(function(){
		getResult('baby/history', {page : page, serviceNo : serviceNo}, 'callbackHistoryHandler', false);
	});
	
	var range = 20, //距下边界长度/单位px
		maxpage = 5, //设置加载最多次数
		totalheight = 0; 
	
	$(window).scroll(function(){
		if ($('#baby-box-field').hasClass('loading-info') || $('body').data('count') < rangPage) {
			return;
		}
	    var srollPos = $(window).scrollTop();
	    totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
		if (($(document).height() - range) <= totalheight  && rangPage < maxpage) {
			getRangInfo(rangPage);
	    }
	});
});

window.getRangInfo = function(page, showloading) {
	$('#baby-box-field').addClass('loading-info');
	getResult('baby/rang', {page : page, serviceNo : serviceNo, openid : openid}, 'callbackRangHandler', showloading);
}


window.callbackRangHandler = function(data) {
	$('#baby-box-field').removeClass('loading-info');
	if(rangPage == 1){
		$('body').data('count', data.c || 0);
		// 是否签到
		getResult('signin/checksign', {euid: data.leu,openid: openid}, 'callbackCheckSignHandler');
	}
	if(data.items && data.items.length > 0){
		$.each(data.items,function(i,item){
			$("#baby-box-field").append(spellRangInfosHtml(item));
		});
	}else{
		if(rangPage == 1)
			$("#baby-box-field").append('<figure class="babylist" style="text-align: center;"><P>'+data.message+'</P></figure>');
	}
	$('body').data('uuid', data.leu || 0);
	$('body').data('serviceNo', data.sn || 0);
	rangPage++;
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

var spellRangInfosHtml = function(obj) {
	return '<figure class="babylist">'
			+ '<img src="'+ obj.ph +'" width="100%">'
			+ '<figcaption class="box-orient-h">'
			+ '<div class="box-flex"><h4 class="ellipsis">'+ obj.nam +'</h4><h5>票数：<em id="'+ obj.uid +'-ticket">'+ obj.tol +'</em></h5></div>'
			+ '</figcaption>'
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
