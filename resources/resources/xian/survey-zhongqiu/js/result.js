$(function() {
	$("#btn-share").click(function() {
		$("#div-share-box").removeClass("none");
	});
	$("#div-share-box").click(function() {
		$("#div-share-box").addClass("none");
	});
	var eachSurveyUuid = getQueryString("surveyUuid");
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "survey/result/" + eachSurveyUuid,
		data : {
			openid : openid
		},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackHandler",
		success : function(data) {
			if (data.result) {
				$("#survey-title").empty().html(data.survey.title);
				if (data.survey.surveyImage != ''
						&& data.survey.surveyImage.length > 0) {
					$("#survey-img").next()
							.attr("src", data.survey.surveyImage);
					$("#survey-img").removeClass("none");
				}
				$.each(data.survey.tvServiceSurveyAttrDtoList,function(i,item){
					var checkitem = '<input type="'+ (data.survey.type==1?'radio':'checkbox') +'" disabled="disabled" name="checkedParams" value="'+ item.uuid +'"/>';
					$("#survey-attr").append('<li style="padding-left:32px;" >' + 
							(data.checkedStatus? checkitem : '')
							+ item.surveyValue + '（'+ (item.agreeCount/data.count * 100).toFixed(2) +'%）</li>');
				});
				if(data.checkedSurvey){
					$.each(data.checkedSurvey,function(i,item){
						$("input[name='checkedParams'][value='"+item.checkuuid+"']").attr("checked", true);				
					});
				}
				$("#survey-loading").addClass("none"); 
				$("#survey-boby").removeClass("none"); 
			}
		},
		error : function() {
		}
	});

});