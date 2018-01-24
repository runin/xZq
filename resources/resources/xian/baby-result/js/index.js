var babyEachUuid=null;
var isHistory = false;
$(function() {
	var history_tab_loading = false;
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
	
	signinCheck();
	
	$("#history_tab").trigger("click");
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
			//alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
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
