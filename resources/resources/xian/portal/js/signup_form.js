$(function() {
	$('#btn-submit-signup').click(function() {
		var $name = $('#name'),
			$mobile = $('#mobile'),
			$card = $('#card'),
			euid = getQueryString('euid'),
			name = $.trim($name.val()),
			mobile = $.trim($mobile.val()),
			card = $.trim($card.val());
		
		if (!euid) {
			alert('找不到该活动');
			return;
		}
		if (!name) {
			alert('请先输入姓名');
			$name.focus();
			return false;
		}
		if (!mobile || !/^\d{11}$/.test(mobile)) {
			alert('请先输入正确的手机号');
			$mobile.focus();
			return false;
		}
		
		if (!card || !/^(\d{18,18}|\d{15,15}|\d{17,17}x)$/.test(card)) {
			alert('请先输入正确的身份证号');
			$card.focus();
			return false;
		}
		getResult('indexenter/enter', {
			euid: euid,
			openid: openid,
			phone: mobile,
			username: encodeURIComponent(name),
			idcard: card
		}, 'callbackEnterHandler');
	});
	
	
	getResult('user/' + openid + '/phone', {}, 'callbackUserPhoneHandler');
});

window.callbackEnterHandler = function(data) {
	if (data.code == 0) {
		var date = getQueryString('date'),
			title = decodeURIComponent(getQueryString('title'));
		
		window.location.href = 'signup_success.html?date=' + date + '&title=' + title;
		return;
	}
	alert(date.message);
}

window.callbackUserPhoneHandler = function(data) {
	$('#mobile').val(data.result || '');
}

