var isHasHistory = false;
var isHasCurrent = false;
var activityUuid = null;
var surveyInfoUuid = null;
function spellHistoryHtml(data){
	var url = "javascript:toUrl('result.html?surveyUuid="+ data.uuid +"')";
	return '<figure class="active_box fd">'
		+'<a href="' + url + '"><figcaption><h4>'
		+'第'+data.whichQi+'期'
		+'<span>'
		+ data.surveyDate
		+'</span></h4><p>'
		+ data.title
		+'</p>'
		+'</figcaption></a></figure>';
}

function spellCurrentHtml(data){
	var resultStr = '<h2>'+ data.surveyInfo.title +'</h2>' + '<ul class="qulist">';
	if(data.surveyInfo.tvServiceSurveyAttrDtoList){
		$.each(data.surveyInfo.tvServiceSurveyAttrDtoList,function(i,item){
			var checkedResult = data.checkedStatus?'（'+ (item.agreeCount/data.count * 100).toFixed(2) + '%）':'';
			resultStr += '<li><label>'
			   + '<input type="'+ (data.surveyInfo.type==1?'radio':'checkbox') +'" disabled="disabled" name="checkedParams" value="'+ item.uuid +'"/>'
			   + item.surveyValue + checkedResult + '</label></li>';
		});
	}
	resultStr +='</ul>';
	return resultStr;
}
function loadCurrent(){
	if(!isHasCurrent){
		$("#survey-loading").removeClass("none");
		$.ajax({
			type : "get",
			async : false,
			url : domain_url + "survey/current/" + openid,
			dataType : "jsonp",
			jsonp : "callback",
			jsonpCallback : "callbackHandler",
			success : function(data) {
				$("#survey-loading").addClass("none");
				activityUuid = data.surveyInfo.stationProgramActivityUuid;
				surveyInfoUuid = data.surveyInfo.uuid;
				$("#current_box").empty().html(spellCurrentHtml(data));
				if (data.result) {
					if (data.surveyInfo.type == 1)
						$("#current_box :radio").attr("disabled", false);
					else if (data.surveyInfo.type == 2)
						$("#current_box :checkbox").attr("disabled", false);
					$("#submitBtn").html("提交调查");
					$("#submitBtn").attr('class','send_btn');
					$("#submitBtn").attr("href","javascript:submitSurvey();");
					$("#submitBtn").removeClass("none");
				}else{
					if(data.checkedSurvey){
						$.each(data.checkedSurvey,function(i,item){
							$("input[name='checkedParams'][value='"+item.checkuuid+"']").attr("checked", true);				
						});
					}
					$("#submitBtn").html(data.message);
					$("#submitBtn").removeClass("none");
					if(data.surveyPrizeUuid && data.surveyPrizeStatus!=0){
						$("#view_prize_btn").attr("href","javascript:toUrl('win_step2.html?surveyPrizelogUuid="+data.surveyPrizeUuid+"')");
						$("#view_prize_btn").removeClass("none");
					}
				}
				isHasCurrent = true;
			},
			error : function() {}
		});
	}
}
$(function() {
	//初始化选项卡切换事件
	$('.nav .box-flex').click(function(e) {
		e.preventDefault();
		$(this).siblings().removeClass('active').end().addClass('active');
		$('.mod_box').addClass('none').eq($(this).index()).removeClass('none');
	});
	//初始化加载本期调查
	loadCurrent();
	
	$("#survey_current_tab").click(function(){
		$("#survey-loading").addClass("none");
		loadCurrent();
	});
	$("#survey_activity_tab").click(function(){
		$("#survey-loading").addClass("none");
	});

	$("#survey_history_tab").click(function(){
		$("#survey-loading").addClass("none");
		if(!isHasHistory){
			$("#survey-loading").removeClass("none");
			$("#survey_history_box").empty();
			getHistory(surveyInfoUuid);
		}
	});
	
	$("#surey_history_more").click(function(){
		getHistory(surveyInfoUuid);
	});
});

var page = 1;
function getHistory(surveyInfoUuid){
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "survey/history/" + surveyInfoUuid,
		data :{
			page : page
		},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackHandler",
		success : function(data) {
			$("#survey-loading").addClass("none");
			if (data.result) {
				$.each(data.items,function(i,item){
					$("#survey_history_box").append(spellHistoryHtml(item));
				});
				if(data.items.length < 5){
					$("#surey_history_more").remove();
				}
				page++;
			}else{
				if (!isHasHistory)
					$("#survey_history_box").append('<figure class="active_box fd" style="text-align: center;"><P>暂无往期调查数据</P></figure>');
				$("#surey_history_more").remove();
			}
			$("#surey_history_more").removeClass("none");
			isHasHistory = true;
		},
		error : function() {
		}
	});
}


function submitSurvey() {
	var checkedParamsObject = $("input[name='checkedParams']:checked");
	var checkedParams = "";
	if (null == checkedParamsObject || checkedParamsObject.length == 0) {
		alert("请选择您赞同的观点");
		return;
	} else {
		checkedParamsObject.each(function() {
			checkedParams += "," + $(this).val();
		});
		checkedParams = checkedParams.substring(1);
	}

	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "survey/save?openid=" + openid
				+ "&activityUuid=" + activityUuid + "&surveyInfoUuid="
				+ surveyInfoUuid + "&checkedParams=" + checkedParams,
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackHandler",
		success : function(data) {
			if (data.result) {
				alert("谢谢您参与调查，下面进行抽奖");
				var url = "lottery.html?activityUuid=" + activityUuid + "&surveyInfoUuid=" + surveyInfoUuid;
				if (gefrom != null && gefrom != '') {
					url = url + "&gefrom=" + gefrom;
				}
				location.href = url;
			} else {
				alert(data.message);
			}
		},
		error : function() {
			alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
}