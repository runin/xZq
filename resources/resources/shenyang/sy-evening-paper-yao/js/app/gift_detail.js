var $nav_item = $('.nav a'),
	$list = $('.detail-list'),
	uid = getQueryString('uid'),
	clickZhuHuan = true ;

getResult('mall/item/detail/' + uid, {}, 'callbackStationMallDetail', true);
getResult('user/' + openid + '/phone', {}, 'callbackUserPhoneHandler');

eventHandler();

function eventHandler() {
	$nav_item.click(function(e) {
		e.preventDefault();

		var index = $nav_item.index($(this));
		$nav_item.removeClass('curr');
		$(this).addClass('curr');
		$list.find('li').addClass('none').eq(index).removeClass('none');
	});

	$('.btn-exchange').click(function(e) {
		e.preventDefault();

		$(this).parent().addClass('block');
		return;
	});
	$('.btn-close').click(function(e) {
		$('.loader').addClass('none');
		e.preventDefault();

		$(this).parent().removeClass('block');
	});

	$('.btn-exchangenow').click(function(e) {
		if(clickZhuHuan){
			clickZhuHuan = false;
		}
		e.preventDefault();

		var amount = $.trim($('#amount').val()),
			mobile = $.trim($('#mobile').val()),
            name = $.trim($('#name').val());
		if (!/^\d+$/.test(amount) || amount < 1) {
			showTips('请输入正确的数量');
			return false;
		} else if (name.length > 20 || name.length == 0) {
			showTips('请输入您的姓名，不要超过20字哦!');
			return false;
		}
		else if (!/^\d{11}$/.test(mobile)) {
			showTips('手机号码格式不正确');
			return false;
		}


		if (!confirm('手机号码是领奖的唯一凭证！\n您的手机号码是'+ mobile +'，确认兑换？')) {
			return false;
		}

		$('.btn-exchangenow').hide();
		butt_loading();

		getResult("mall/order/pay", {
			openid: openid,
			name:name,
			phone: mobile,
			buyCount: amount,
			itemUuid: uid
		}, 'callbackMallOrderPay');
	});
	$(document).click(function(e) {
		e.preventDefault();
		if ($(e.target).closest('.ctrl').length > 0) {
			return false;
		}
		$('#ctrl').removeClass('block');
	});

	$('.btn-plus').click(function() {
		var val = $.trim($('#amount').val());
		if (!/^\d+$/.test(val)) {
			return false;
		}
		$('#amount').val(++ val);
	});
	$('.btn-minus').click(function() {
		var val = $.trim($('#amount').val());
		if (!/^\d+$/.test(val) || val <= 1) {
			return false;
		}
		$('#amount').val(-- val);
	});

}


function callbackStationMallDetail(data) {
	if (data.code == 0) {
		var t = simpleTpl();
		$('#cover').html('<img src="'+ data.ib +'" />');
		$('#info').find('h2').text(data.n || '');
		$('#info').find('.jf strong').text(data.ip || 0);
		$('#info').find('.price strong').text(Math.round((data.mp || 0)) / 100);
		$('#info').find('.kc strong').text(data.ic == -1 ? '充足' : (data.ic + data.ut));
		$('#info').data('tip', data.tip || '');

		$('#detail-list').find('.xq').html('<p>'+ data.d +'</p>');
		$('#detail-list').find('.cs').html('<p>'+ (data.param || '') +'</p>');
	}
}

function callbackMallOrderPay(data) {
	if (data.code == 0) {
		var amount = $.trim($('#amount').val()),
			name = $.trim($('#info').find('h2').text()),
			tip = $('#info').data('tip'),
			cover = $('#cover').find('img').attr('src'),
			jifen = $.trim($('#jf').text()),
			uid = getQueryString('uid');

		window.location.href = 'success.html?uid='+ uid +'&amount=' + amount + '&jf=' + jifen + '&tip='+ encodeURIComponent(tip) + '&name=' + encodeURIComponent(name) + '&cover=' + cover;
		return;
	}
}

function callbackUserPhoneHandler(data) {
	$('#mobile').val(data.result || '');
}

function butt_loading(){
	var t = simpleTpl();
	t._(' <div class="loader">')
		._('<span></span>')
		._('<span></span>')
		._('<span></span>')
		._('<span></span>')
		._('<span></span>')
		._('</div>');
	$('#copyright_gift').before(t.toString());
}