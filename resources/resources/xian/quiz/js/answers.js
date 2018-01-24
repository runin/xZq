var isHasCurrent = false;
var activityUuid = null;
var quizInfoUuid = null;
var callbackQuestionHandler = function(data) {
};
var callbackAnswerHandler = function(data) {
};
var rightQuizStr = null;
var user_answer_uuid = '';
var quizType = 1;
function spellCurrentHtml(data) {
	var resultStr = '';
	$.each(data.quizInfo.attrDtos, function(i, item) {
		resultStr += '<li><a href="javascript:;" id="' + item.uuid +'" '
				+ ' name="answer" '
				+ ' data-collect="true" data-collect-flag="quiz-answer-select-btn" data-collect-desc="选择答题选项">' + item.quizValue +'</a></li>';
		if(data.rightQuiz==item.uuid)
			rightQuizStr = item.quizValue;
	});
	resultStr += '</ul>';
	return resultStr;
}
function initQuizAttr(){
	if(quizType==1){
		$("a[name='answer']").click(function(){
			$("#"+user_answer_uuid.substr(1)).removeClass("checked");
			user_answer_uuid = '';
			$(this).addClass("checked");
			user_answer_uuid += "," + $(this).attr('id');
		});
	}else{
		$("a[name='answer']").each(function(){
			$(this).toggle(
				function(){
					$(this).addClass("checked");
					user_answer_uuid += "," + $(this).attr('id');
				},function(){
					$(this).removeClass("checked");
					user_answer_uuid = user_answer_uuid.replace("," + $(this).attr('id'),"");
				});
		});
	}
}
function loadCurrent() {
	if (!isHasCurrent) {
		$("#quiz-loading").removeClass("none");
		$.ajax({
					type : "get",
					async : false,
					url : domain_url + "quiz/" + openid + "/question",
					dataType : "jsonp",
					jsonp : "callback",
					jsonpCallback : "callbackQuestionHandler",
					success : function(data) {
						isHasCurrent = true;
						$("#quizTitle").empty().html(data.quizInfo.title);
						$("#quizAttr").empty().html(spellCurrentHtml(data));
						quizType = data.quizInfo.type;
						if(quizType==2)
						$("#quizAttr").attr("class","answer-multi");
						initQuizAttr();
						if (data.result) {
							$("#submitBtn").html("确定");
							$("#submitBtn").attr("href", "javascript:submitQuiz();");
							$("#submitBtn").attr('class', 'btn as-btn');
						} else {
							$("#submitBtn").html(data.message);
							$("#submitBtn").attr('class', 'btned as-btn');
						}
						$("#quiz-loading").addClass("none");
						$("#as-box").removeClass("none");
						activityUuid = data.quizInfo.stationProgramActivityUuid;
						quizInfoUuid = data.quizInfo.uuid;
						// 展开答题纸
						var $box = $('#as-box'),
						$answer = $('#as-answer'),
						timer = 700;
						$box.stop().animate({height: $answer.outerHeight() + 20}, timer, function() {
							$answer.removeClass('hidden');
						});
					},
					error : function() {
					}
				});
	}
}
function submitQuiz() {
	var quizResult = user_answer_uuid;
	if (null == quizResult || quizResult.length == 0) {
		alert("请选择一个答案");
		return;
	} else {
		quizResult = quizResult.substring(1);
	}
	$("#submitBtn").attr('class', 'btned as-btn');
	$("#submitBtn").attr("href", "##");
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "quiz/answer?openid=" + openid + "&activityUuid="
				+ activityUuid + "&quizInfoUuid=" + quizInfoUuid
				+ "&quizResult=" + quizResult,
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackAnswerHandler",
		success : function(data) {
			if (data.code == 100) {
				alert("恭喜您答对了，下面进行抽奖");
				var url = "win.html?activityUuid=" + activityUuid;
				if (gefrom != null && gefrom != '') {
					url = url + "&gefrom=" + gefrom;
				}
				location.href = url;
			} else if (data.code == 101) {
				alert("很遗憾,您答错了,正确答案是"+rightQuizStr);
				location.href = "index.html";
			} else {
				alert(data.message);
			}
		},
		error : function() {
			alert(COMMON_SYSTEM_ERROR_TIP);
		}
	});
}
$(function() {
	loadCurrent();
});