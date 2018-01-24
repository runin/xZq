$(function() {
	// 天气
	getResult("weather", {
		stationuuid : stationUuid
	}, 'callbackWeatherHandler');

	getResult('travel/enter/index', {
		cuid : channelUuid,
		openid : openid
	}, 'callbackTravelEnterHander', true);

	$('#wantn').click(function(e) {
		e.preventDefault();

		if ($(this).hasClass('disabled')) {
			return;
		}
		getResult('travel/enter/want', {
			uuid : $('body').data('uuid'),
			openid : openid
		}, 'callbackTravelEnterWantHander');
	});

	$('#sign').click(function(e) {
		e.preventDefault();

		if ($(this).hasClass('signed')) {
			return;
		}

		getResult('signin/savesign', {
			euid : $('body').data('uuid'),
			openid : openid
		}, 'callbackDoSignHandler')
	});
});

// 首页报名信息
window.callbackTravelEnterHander = function(data) {
	if (data.code > 0) {
		return;
	}
	var $info = $('#info'), t = simpleTpl(), items = data.items || [], len = items.length;

	$info.removeClass('none');
	$info.find('h2').text(data.t);
	$info.find('em').text(data.w);
	$('title').text(data.t);
	$('body').data('uuid', data.id || 0);
	$('#cover').attr('src', data.lg);

	if (data.i == false) {
		$info.find('.wantn').addClass('disabled');
	}
	for ( var i = 0; i < len; i++) {
		var hrefs = [ 'summary.html', 'strategy.html', 'signup.html',
				'old_list.html' ], type = items[i].tp || 1, href = hrefs[type - 1]
				+ '?uuid=' + items[i].id + '&id=' + data.id;

		t
				._(
						'<a href="javascript:toUrl(\''
								+ href
								+ '\')" class="btn bn'
								+ type
								+ ' box-orient-h" data-collect="true" data-collect-flag="tour-main-item-'
								+ type + '" data-collect-desc="' + items[i].t
								+ '">')._('<i></i>')
				._('<div class="box-flex">')._(
						'<strong>' + items[i].t + '</strong><br />')._(
						'<span>' + items[i].d + '</span>')._('</div>')
				._('</a>');
	}
	$('#menubox').html(t.toString());

	// 是否签到
	getResult('signin/checksign', {
		euid : data.id,
		openid : openid
	}, 'callbackCheckSignHandler');
}

// 天气
window.callbackWeatherHandler = function(data) {
	if (data.code == 0) {
		$('#w-date').text(data.rd);
		$('#w-temp').text(
				data.low && data.high ? data.low + '/' + data.high + '℃' : '');
		$('#w-img').attr('src', data.wimg ? (data.wimg) : '');
		$('#weatherbox').removeClass('none');
	}
};

// 我要去
window.callbackTravelEnterWantHander = function(data) {
	if (data.code == 0) {
		$('#wantn').addClass('disabled');

		var $num = $('#w-num');
		$num.text($num.text() * 1 + 1);
	}
}

// 是否签到
window.callbackCheckSignHandler = function(data) {
	if (data.code == 1) {
		setSigned();

		if (data.isPhoneNull) {
			setTimeout(function() {
				if (confirm("亲，请完善中奖信息！")) {
					var url = "phone.html";
					if (gefrom != null && gefrom != '') {
						url = url + "?gefrom=" + gefrom;
					}
					window.location.href = url;
				}
			}, 200);
		}
	}
}

window.setSigned = function() {
	$('#sign').removeClass('sign').addClass('signed').html('<i></i>今日已签  明日再抢');
}
// 点击签到按钮
window.callbackDoSignHandler = function(data) {
	if (data.code == 3) {
		setSigned();
		setTimeout(function() {
			alert(data.message);
			location.href = "win.html?signinPrizeRecordUuid="
					+ data.signinPrizeRecordUuid;
		}, 200);
	} else if (data.code == 2) {
		setSigned();
		setTimeout(function() {
			alert(data.message);
		}, 200);
	} else {
		alert(data.message);
	}
}
