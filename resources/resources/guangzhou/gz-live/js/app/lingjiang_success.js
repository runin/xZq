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
});

window.checkHandler = function(data){
	if (data.code == 0) {
		window.location.href = 'lingjiang_success.html?uuid='+ uuid;
	};
	if (data.code == 3) {
		var name = data.name;
		var phone = data.phone;
		var address = data.address;
		$('.lj-name').html(name);
		$('label.phone').html(phone);
		$('label.address').html(address);
	};
};