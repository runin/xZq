$(function() {
	getResult('user/'+openid+'/phone', {}, 'callbackUserPhoneHandler');
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
		$addr = $('#addr'),
		addr = $.trim($addr.val());

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
		if (!addr) {
			$(this).removeClass('requesting');
			alert('请输入您的收货地址哦！');
			$addr.focus();
			return;
		};

		getResult('news/lingjiang', {
			serviceNo: service_no,
			openid: openid,
			name: encodeURIComponment(name),
			phone: phone,
			addr: encodeURIComponment(addr)
		},'callbackLingjiangHandler');
	});
});

window.callbackUserPhoneHandler = function(data){
	$('#phone').val(data.result);
};

window.callbackLingjiangHandler = function(data){
	$('#btn-submit').removeClass('requesting');
	if (data.code == 0) {
		window.is_submit = true;
		window.location.href = 'lingjiang_success.html';
	} else {
		alert(data.message);
	};
};