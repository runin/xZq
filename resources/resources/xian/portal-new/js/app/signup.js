
eventHandler();

getResult('indexenter/enterinfo', {
	cuid: channelUuid,
	openid: openid
}, 'callbackEnterInfoHandler', true);

function eventHandler() {
	$('#btn-wg').click(function(e) {
		e.preventDefault();
		
		if ($(this).hasClass('faved')) {
			return false;
		}
		var euid = $('body').data('euid');
		getResult('indexenter/wantgo', {
			euid: euid,
			openid: openid
		}, 'callbackWantGoHandler');
	});
	
	$('#btn-signup').click(function(e) {
		e.preventDefault();
		
		if ($(this).hasClass('disabled')) {
			return false;
		}
		var $body = $('body'),
			euid = $body.data('euid'),
			title = $body.data('title'),
			date = $body.data('date');
		
		window.location.href = 'signup_form.html?euid=' + euid + '&title=' + encodeURIComponent(title) + '&date=' + date; 
	});
}

function callbackEnterInfoHandler(data) {
	if (data.code == 1) {
		$('#btn-signup').addClass('disabled').text(data.message);
	}
	if (!data.cw) {
		$('#btn-wg').addClass('faved');
	}
	$('title').text(data.tt);
	$('body').data('euid', data.id).data('title', data.tt).data('date', data.dt);
	
	$('#info').find('h2').text(data.an);
    $('#info').find('.num-wg').text(data.wc + 5);
	
	$('#signed').find('strong').text(data.ec + 5);
	
	$('#intro').append(data.ds);
}

function callbackWantGoHandler(data) {
	if (data.code == 0) {
		$('#btn-wg').addClass('faved');
		
		var $num = $('#info').find('.num-wg'),
			num = $num.text() * 1;
		
		$num.text(num + 1);
	}
}