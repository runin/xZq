
$(function() {
	// 主id，旅游互动的id
	window.uuid = getQueryString('uuid');
	
	$('#wantn').click(function(e) {
		e.preventDefault();
		
		if ($(this).hasClass('disabled')) {
			return false;
		}
		getResult('sytravel/enter/want', {
			uuid: uuid,
			openid: openid
		}, 'callbackTravelEnterWantHander');
	});
	
	//报名
	$('#btn-signup').click(function(e) {
		e.preventDefault();
		
		if ($(this).hasClass('disabled')) {
			return false;
		}
		window.location.href = 'signup_form.html?uuid=' + uuid; 
	});
	
	getResult('sytravel/enter/detail', {uuid: uuid, openid: openid}, 'callbackTravelEnterDetailHander', true);
});

window.callbackTravelEnterDetailHander = function(data) {
	if (data.code == 1) {
		$('#btn-signup').addClass('disabled').text(data.message);
	}
	if (!data.i) {
		$('#wantn').addClass('disabled');
	}
	$('body').data('uuid', uuid).data('title', data.t);
	
	$('#info').find('h2').text(data.an);

	$('#w-num').text(data.w);
	
	$('#count').find('strong').text(data.ec + 5);
	$('#cover').attr('src', data.lg);
	$('#intro-content').html(data.ad);
}

//我要去
window.callbackTravelEnterWantHander = function(data) {
	if (data.code == 0) {
		$('#wantn').addClass('disabled');
		 
		var $num = $('#w-num');
		$num.text($num.text() * 1 + 1);
	}
}