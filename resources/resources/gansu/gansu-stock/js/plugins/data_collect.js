function recordUserLog(openid, operateDesc, operateDomId, loadingTime, flag) {
	$.ajax({
		type : "get",
		async : false,
		url : domain_url + "userlog",
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : "callbackDataHandler",
		data : {
			openId : openid,
			operateDesc : encodeURIComponent(operateDesc),
			operateDomId : operateDomId,
			loadingTime : loadingTime,
			from : gefrom,
			flag : flag
		}
	});
}
/**
 * 记录用户操作日志
 * 
 * @param openid
 *            操作用户的openid
 * @param operateDesc
 *            中文描述做的事情
 * @param operateDomId
 *            操作的元素的id
 */
function recordUserOperate(openid, operateDesc, operateDomId) {
	recordUserLog(openid, operateDesc, operateDomId, "", "false");
}
/**
 * 加载页面记录日志
 * 
 * @param openid
 *            操作用户的openid
 * @param operateDesc
 *            进入的某页面名称
 * @param loadingTime
 *            页面加载耗时多少毫秒
 */
function recordUserPage(openid, operateDesc, loadingTime) {
	recordUserLog(openid, operateDesc, "", loadingTime, "true");
}
$(function() {
	recordUserPage(openid, $('title').html(), "");
	$('body').delegate("*[data-collect='true']","click",function(e) {
		if ($(this).attr('data-stoppropagation') == 'true') {
			e.stopPropagation();
		}
		recordUserOperate(openid, $(this).attr("data-collect-desc"), $(this).attr("data-collect-flag"));
	});
});