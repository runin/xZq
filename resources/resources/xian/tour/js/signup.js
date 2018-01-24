$(function() {
	// 主id，旅游互动的id
	window.uuid = getQueryString('id');
	
	$('#wantn').click(function(e) {
		e.preventDefault();
		
		if ($(this).hasClass('disabled')) {
			return false;
		}
		getResult('travel/enter/want', {
			uuid: uuid,
			openid: openid
		}, 'callbackTravelEnterWantHander');
	});
	
	// 签到
	$('#sign').click(function(e) {
		e.preventDefault();
		
		if ($(this).hasClass('signed')) {
			return;
		}
		
		getResult('signin/savesign', {
			euid: $('body').data('uuid'),
			openid: openid
		}, 'callbackDoSignHandler')
	});
	
	//报名
	$('#btn-signup').click(function(e) {
		e.preventDefault();
		
		if ($(this).hasClass('disabled')) {
			return false;
		}
		window.location.href = 'signup_form.html?uuid=' + uuid; 
	});
	
	getResult('travel/enter/detail', {uuid: uuid, openid: openid}, 'callbackTravelEnterDetailHander', true);
	
	// 天气
	getResult("weather", {stationuuid: stationUuid}, 'callbackWeatherHandler');
	
	// 是否已签到
	getResult('signin/checksign', {euid: uuid, openid: openid}, 'callbackCheckSignHandler');
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

window.callbackWeatherHandler = function(data) {
	if (data.code == 0) {
		$('#w-date').text(data.rd);
		$('#w-temp').text(data.low && data.high ? data.low + '/' + data.high + '℃' : '');
		$('#w-img').attr('src', data.wimg ? (data.wimg) : '');
		$('#weatherbox').removeClass('none');
	}
}

window.callbackCheckSignHandler = function(data) {
	if (data.code == 1) {
		setSigned();
		
		if (data.isPhoneNull) {
			setTimeout(function() {
				if (confirm("亲，请完善中奖信息！")){
					var url = "phone.html";
					if (gefrom != null && gefrom != '') {
						url = url + "?gefrom=" + gefrom;
					}
					window.location.href= url;
				}
			}, 200);
		}
	}
}
window.setSigned = function() {
	$('#sign').removeClass('sign').addClass('signed').html('<i></i>今日已签  明日再抢');
}