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
		var me = this;
        if(clickZhuHuan){
            clickZhuHuan = false;
        }
		e.preventDefault();

		var $mobile = $('#mobile'),
			mobile = $.trim($mobile.val()),
			$name = $('#name'),
			name = $.trim($name.val()),
			$address = $('#address'),
			address = $.trim($address.val()),
			amount = $.trim($('#amount').val());

		if (((me.name && me.name == name) && me.mobile && me.mobile == phone)
			&& (me.address && me.address == address)) {
			return;
		}

		if (name.length < 2 || name.length > 30) {
			alert('姓名长度为2~30个字符');
			return false;
		}
		else if (!/^\d{11}$/.test(mobile)) {
			alert('这手机号，可打不通哦...');
			return false;
		}
		else if (address.length < 5 || address.length > 60) {
			alert('地址长度为5~60个字符');
			return false;
		}

        $('.btn-exchangenow').hide();
        butt_loading();

		getResult("mall/order/pay", {
			openid: openid,
			phone: mobile,
			buyCount: amount,
			itemUuid: uid,
			name: name,
			address: address
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
	alert(data.message);
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