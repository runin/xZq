var uuid = getQueryString('uuid');

$(function() {
	if (uuid && openid) {
		getResult('gzlive/prize/check', {
			openid: openid,
			uuid: uuid
		}, 'checkHandler');
	} else {
		return;
	};

	$('#btn-submit').click(function(e) {
		e.preventDefault();

		if ($(this).hasClass('requesting')) {
			return;
		};
		$(this).addClass('requesting');

		var $name = $('#name'),
		name = $.trim($name.val()),
		$phone = $('#phone'),
		phone = $.trim($phone.val()),
		regex = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^\d{11}$)/,
		$address = $('#address'),
		address = $.trim($address.val());

		if (!name) {
			$(this).removeClass('requesting');
			alert('请写下你的姓名');
			$name.focus();
			return;
		};
		if (!phone || !regex.test(phone)) {
			$(this).removeClass('requesting');
			alert('请输入正确的电话号码，格式为：\n手机：13800138000');
			$phone.focus();
			return;
		};
		if (!address) {
			$(this).removeClass('requesting');
			alert('请输入您的收货地址哦！');
			$address.focus();
			return;
		};

		if (uuid && openid) {
			getResult('gzlive/prize/award', {
				openid: openid,
				uuid: uuid,
				name: encodeURIComponent(name),
				phone: phone,
				address: encodeURIComponent(address)
			},'callbackAwardHander');
		} else {
			return;
		};
	});

});

window.checkHandler = function(data){
	if (data.code == 3) {
		window.location.href = 'lingjiang_success.html?uuid='+ uuid;
	};
};
window.callbackAwardHander = function(data) {
	if (data.code == 3 || data.code == 1) {
		$('#btn-submit').addClass('requesting');
		return;
	};
	if (data.code == 0) {
		window.location.href = 'lingjiang_success.html?uuid='+ uuid;
	};
};
