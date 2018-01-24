$(function() {
	var uuid = getQueryString('uuid');
	getResult('travel/enterattr/detail/' + uuid, {}, 'callbackTravelDetailHander', true);
});

// 概况
window.callbackTravelDetailHander = function(data) {
	if (data.code == 0) {
		$('title').text(data.t);
		$('#info').html(data.c);
		return;
	}
	alert(data.message);
	window.location.href = 'index.html';
}