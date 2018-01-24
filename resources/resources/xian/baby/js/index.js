var babyEachUuid=null;
var isHistory = false;
$(function() {
	var baby_tab_loading=false;
	var history_tab_loading = false;
	getAllBaby();
	$('.nav .box-flex').click(function(e) {
		e.preventDefault();
		$(this).siblings().removeClass('active').end().addClass('active');
		$('.mod_box').addClass('none').eq($(this).index()).removeClass('none');
	});
	$("#btn-sign-in").click(function() {
		$.ajax({
			type : "get",
			async : false,
			url : domain_url + "signin/save",
			data : {
				resUuid : babyEachUuid,
				openid : openid
			},
			dataType : "jsonp",
			jsonp : "callback",
			jsonpCallback : "callbackHandler",
			success : function(data) {
				if (data.code == 3) {
					$("#btn-sign-in").remove();
					$("#btn-sign-in-ed").removeClass(
							"none");
					alert(data.message);
					location.href = "win_step1.html?signinPrizeRecordUuid="
							+ data.signinPrizeRecordUuid;
				} else if (data.code == 2) {
					$("#btn-sign-in").remove();
					$("#btn-sign-in-ed").removeClass("none");
					alert(data.message);
				} else {
					alert(data.message);
				}
			},
			error : function() {
				alert(COMMON_SYSTEM_ERROR_TIP);
			}
		});
	});
	
	$("#baby_tab").click(function(){
		if (!baby_tab_loading) {
			$("#baby-loading").addClass("none");
		} else {
			$("#baby-loading").removeClass("none");
		}
	});
	
	$("#activity_tab").click(function(){
		$("#baby-loading").addClass("none");
	});
	$("#history_tab").click(function(){
		if(history_tab_loading){
			$("#baby-loading").addClass("none");
			return;
		}
		if(!isHistory){
			$("#baby-loading").removeClass("none");
			getHistory();
		}
	});
	
	$("#baby_history_more").click(function(){
		getHistory();
	});
});

var page = 1;
function getHistory(){
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "baby/history",
		data :{
			page :page
		},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackHistoryHandler",
		success : function(data) {
			history_tab_loading=true;
			$("#baby-loading").addClass("none");
			if (data.result) {
				$.each(data.items,function(i,item){
					$("#history-field").append(spellHistoryHtml(item));
				});
				if(data.items.length < 5){
					$("#baby_history_more").remove();
				}
				page++;
			}else{
				if(!isHistory)
					$("#history-field").append('<figure class="active_box fd" style="text-align: center;"><P>暂无往期宝宝数据！</P></figure>');
				$("#baby_history_more").remove();
			}
			isHistory = true;
			$("#baby_history_more").removeClass("none");
		},
		error : function() {
			alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
}


function spellBabyInfo(item){
	var url = "javascript:toUrl('vote.html?babyInfoUuid=" + item.uuid + "');";
	return '<figure class="babylist"><a href="'+ url +'" data-collect="true" data-collect-flag="baby-index-canvassing-img-btn" data-collect-desc="图片拉票">'
	+'<img src="'+ item.bigPhoto +'" width="100%"></a>'
    +'<figcaption class="box-orient-h">'
    +'<div class="box-flex"><h4>'+ item.name +'</h4><h5>票数：<em id="'+ item.uuid +'-ticket">'+ item.totalTicketNumber +'</em></h5></div>'
    +'<div class="vote_box">'
    +'<a ' + (item.vote?'':'href="javascript:voteBaby('+ item.uuid +');"') +' class="'+ (item.vote?'votebtned':'votebtn')+' " id="'+ item.uuid
    +'" data-collect="true" data-collect-flag="baby-index-vote-btn" data-collect-desc="投票">'+ (item.vote?'已投票':'投票') +'</a>'
    +'<a href="'+ url +'" data-collect="true" data-collect-flag="baby-index-canvassing-btn" data-collect-desc="拉票">拉票</a>'
    +'</div>'
    +'</figcaption>'
    +'</figure>';
}



function spellHistoryHtml(item) {
	var url = "javascript:toUrl('history_list.html?babyEachUuid=" + item.uuid + "');";
	return '<figure class="active_box fd"><a href="' + url + '" data-collect="true" data-collect-flag="baby-index-history" data-collect-desc="'+ item.whichQi +'期萌宝宝">'
	+ '<img src="'
	+ item.firstBabyPhoto
	+ '" width="116">'
	+ '<figcaption><h4>第'
	+ item.whichQi
	+ '期</h4><p>'
	+ item.firstBabyName
	+ '</p><span>'
	+ item.beginDate
	+ '</span></figcaption></a></figure>';
}

function getAllBaby(){
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "baby/info",
		data : {
			openid : openid
		},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackHandler",
		success : function(data) {
			if(data.result){
				$.each(data.items,function(i,item){
					$("#baby_box").append(spellBabyInfo(item));
				});
				babyEachUuid = data.each.uuid;
				$("#vote-end-time").empty().html(data.each.voteEndDate + "   " + data.each.voteEndTime);
				$("#baby-loading").addClass("none");
				$("#baby_box").removeClass("none");
				validateBabyEach();
			}
		},
		error : function() {
			alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});

}


// 验证活动是否过期
function validateBabyEach(){
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "baby/validate/" + babyEachUuid,
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackHandler",
		success : function(data) {
			if (!data.result) {
				alert(data.message);
			}
			signinCheck();
		},
		error : function() {
			signinCheck();
			// alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
}

// 页面进来需要请求
function signinCheck() {
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "signin/check",
		data : {
			resUuid : babyEachUuid,
			openid : openid
		},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackHandler",
		success : function(data) {
			if (data.result) {
				$("#btn-sign-in-ed").removeClass("none");
				$("#btn-sign-in").remove();
			}else{
				$("#btn-sign-in").removeClass("none");
			}
			if(data.isPhoneNull){
				setTimeout(doro, 500);
			}
		},
		error : function() {
			// alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
}

function doro(){
	if(confirm("亲，请完善中奖信息！")){
		var url = "phone.html";
		if (gefrom != null && gefrom != '') {
			url = url + "?gefrom=" + gefrom;
		}
		location.href= url;
	}
}
// 投票
function voteBaby(babyInfoUuid) {
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "baby/yaoVote",
		data : {
			babyInfoUuid : babyInfoUuid,
			openid : openid,
			from : gefrom
		},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackHandler",
		success : function(data) {
			if (data.result) {
				//摇进来的是+2票，分享的就是+1
				var ticketNum = 2;
				if(gefrom != null && gefrom != '')
					ticketNum = 1;
				$("#" + babyInfoUuid).empty().html("已投票");
				$("#" + babyInfoUuid).removeClass("votebtn").addClass(
				"votebtned");
				$("#" + babyInfoUuid).removeAttr("href");
				$("#" + babyInfoUuid + "-ticket").html(
						parseInt($("#" + babyInfoUuid + "-ticket")
								.html()) + ticketNum);
			} else
				alert(data.message);
		},
		error : function() {
			alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
}