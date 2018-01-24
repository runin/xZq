var lotteryInfoUuid = "20140726";
var COMMON_SYSTEM_ERROR_TIP = "系统繁忙，请稍候再试！";
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

var callbackHandler = function(data) {
};

function shareFrom() {
	var from = getQueryString("from");
	if (from != null && from != '') {
		location.href = "index.html";
	}
}