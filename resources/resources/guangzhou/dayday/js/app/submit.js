$(function() {
	$('#btn-submit').click(function(e) {

		e.preventDefault();
		if ($(this).hasClass('requesting')) {
			return;
		}
        $(this).addClass('requesting');

		var $name = $('#name'),
			name = $.trim($name.val()),
			$phone = $('#phone'),
			phone = $.trim($phone.val()),
			regex = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^\d{11}$)/;
		if(!name) {
			$(this).removeClass('requesting');
			showTips('请填写您的姓名');
			$name.focus();
			return;
		}
	
		if (!phone || !regex.test(phone)) {
			$(this).removeClass('requesting');
			showTips('请输入正确的电话号码，格式为：\n手机：13800138000');
			$phone.focus();
			return;
		}
		getResult('api/entryinfo/asyncsave', {
			openid: openid,
			phone: phone,
			name: name
		}, 'callbackActiveEntryInfoSaveHandler');
		
	});
});
window.callbackActiveEntryInfoSaveHandler = function(data) {
	$('#btn-submit').removeClass('requesting');
	if (data.code == 0) {
		window.location.href = 'submit_success.html';
	} else {
		showTips(data.message);
	}
}
