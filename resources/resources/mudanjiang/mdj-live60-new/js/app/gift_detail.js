(function($){
	H.gift_detail = {
		$nav_item: $('.nav a'),
		$list: $('.detail-list'),
		$copyright_gift: $('#copyright_gift'),
		$btn_exchangenow: $('.btn-exchangenow'),
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
			var me = H.gift_detail, t = simpleTpl();
			t._(' <div class="loader">')
				._('<span></span>')
				._('<span></span>')
				._('<span></span>')
				._('<span></span>')
				._('<span></span>')
				._('</div>');
			me.$copyright_gift.html(t.toString());
		},
		event: function(){
			var me = H.gift_detail;
			$('.back-home').click(function(e){
				e.preventDefault();
				toUrl('mall.html');
			});
			me.$nav_item.click(function(e) {
				e.preventDefault();

				var index = me.$nav_item.index($(this));
				me.$nav_item.removeClass('curr');
				$(this).addClass('curr');
				me.$list.find('li').addClass('none').eq(index).removeClass('none');
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
			me.$btn_exchangenow.click(function(e) {
				e.preventDefault();
				if(me.clickZhuHuan){
					me.clickZhuHuan = false;
				}

				var amount = $.trim($('#amount').val()),
					mobile = $.trim($('#mobile').val());

				if (!/^\d+$/.test(amount) || amount < 1) {
					showTips('请输入正确的数量');
					return false;
				} else if (!/^\d{11}$/.test(mobile)) {
					showTips('手机号码格式不正确');
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
					buyCount: amount,
					itemUuid: me.uid
				}, 'callbackMallApiPay');
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
		var me = H.gift_detail;
		if (data.code == 0) {
			showTips('恭喜您，兑换成功！');
			toUrl("mall.html");
			return;
		}else{
			me.$copyright_gift.addClass('none');
			me.$btn_exchangenow.show();
			showTips(data.message);
		}
	}
})(Zepto);

$(function() {
	H.gift_detail.init();
});
