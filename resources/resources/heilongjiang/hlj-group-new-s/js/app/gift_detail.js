(function($){
	H.gift_detail = {
		$nav_item: $('.nav a'),
		$list: $('.detail-list'),
		uid: getQueryString('uid'),
		clickZhuHuan: true ,
		init: function(){
			this.event();
			this.mall_detail();
		},
		mall_detail: function(){
			getResult('api/mall/item/detail/' + H.gift_detail.uid, {}, 'callbackStationMallDetail', true);
		},
		butt_loading: function(){
			var t = simpleTpl();
			t._(' <div class="loader">')
				._('<span></span>')
				._('<span></span>')
				._('<span></span>')
				._('<span></span>')
				._('<span></span>')
				._('</div>');
			$('#copyright_gift').before(t.toString());
		},
		event: function(){
			var me = H.gift_detail;
			me.$nav_item.click(function(e) {
				e.preventDefault();

				var index = me.$nav_item.index($(this));
				me.$nav_item.removeClass('curr');
				$(this).addClass('curr');
				me.$list.find('li').addClass('none').eq(index).removeClass('none');
			});
			$('.btn-back').click(function(e) {
				e.preventDefault();

				window.location.href = "mall.html";
				return;
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
			$('.btn-exchangenow').click(function(e) {
				e.preventDefault();
				if(me.clickZhuHuan){
					me.clickZhuHuan = false;
				}

				var amount = $.trim($('#amount').val()),
					mobile = $.trim($('#mobile').val()),
					address = $.trim($('.address').val());

				if (!/^\d+$/.test(amount) || amount < 1) {
					showTips('请输入正确的数量');
					return false;
				} else if (!/^\d{11}$/.test(mobile)) {
					showTips('手机号码格式不正确');
					return false;
				}else if (address.length < 5 || address.length > 60 || address.length == 0) {
					showTips('地址长度为5~60个字符');
					$address.focus();
					return false;
				}


				if (!confirm('手机号码是领奖的唯一凭证！\n您的手机号码是'+ mobile +'，确认兑换？')) {
					return false;
				}

				$(this).hide();
				me.butt_loading();
				getResult("api/mall/order/pay", {
					openid: openid,
					phone: mobile,
					address: encodeURIComponent(address),
					buyCount: amount,
					itemUuid: me.uid
				}, 'callbackMallApiPay');
			});

		}
	};
	W.callbackStationMallDetail = function(data){
		var $info = $('#info'),
		    $detail_list = $('#detail-list');

		if (data.code == 0) {
			var t = simpleTpl();
			$('#cover').html('<img src="'+ data.ib +'" />');
			$info.find('h2').text(data.n || '');
			$info.find('.jf strong').text(data.ip || 0);
			$info.find('.price strong').text(Math.round((data.mp || 0)) / 100);
			$info.find('.kc strong').text(data.ic == -1 ? '充足' : (data.ic + data.ut));
			$info.data('tip', data.tip || '');

			$detail_list.find('.xq').html('<p>'+ data.d +'</p>');
			$detail_list.find('.cs').html('<p>'+ (data.param || '') +'</p>');
		}
	};
	W.callbackMallApiPay = function(data) {
		if (data.code == 0) {
			showTips('恭喜您，兑换成功！');
			window.location.href = "mall.html";
			return;
		}
		alert(data.message);
	}
})(Zepto);

$(function() {
	H.gift_detail.init();
});