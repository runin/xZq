$(function() {
	$('#btn-submit-signup').click(function(e) {
		e.preventDefault();

		var $name = $('#name'),
			$mobile = $('#mobile'),
			uuid = getQueryString('uuid'),
			name = $.trim($name.val()),
			mobile = $.trim($mobile.val());
		
		if (!uuid) {
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

		/*if(!checkCard()){
			$('#card_no').focus();
			return false;
		}*/

		getResult('present/sure', {
			uuid: uuid,
			openid: openid,
			p: mobile,
			n: encodeURIComponent(name),
			i: $('#card_no').val()
		}, 'callbackTravelEnterSureHander');
	});
	
	
	getResult('user/' + openid + '/phone', {}, 'callbackUserPhoneHandler');
});

window.callbackTravelEnterSureHander = function(data) {
	if (data.code == 0) {
		window.location.href = 'signup_success.html?date=' + data.at + '&title=' + data.t + '&tip=' + data.it;
		return;
	}
	alert(data.message);
	window.location.href = 'index.html';
}

window.callbackUserPhoneHandler = function(data) {
	$('#mobile').val(data.result || '');
}

