/**
 * 购物订单 
 */
(function($) {
	
	H.order = {
		uid: getQueryString('ituid'),	// 商品uuid
		quantity: 1,					// 购买数量
		price: 0,						// 单价
		price_min: 0,					// 最低单价
		price_max: 0,					// 最高单价（与最高单价组合成单价区间）
		price_default: 0,				// 默认价格
		name: '',						// 商品名称
		cc: '',							// 商品颜色编码
		ccn: '',						// 商品颜色名称
		sc: '',							// 商品规格编码
		scn: '',						// 商品规格名称
		sizes: [],						// 商品规格数组
		colors: [],						// 商品颜色数组
		img_details: [],				// 订单详情页的图片集
		sku: {},						// 商品sku对象
		request_cls: 'requesting',
		disabled_cls: 'disabled',
		
		init: function() {
			this.resize();
			
			this.event_handler();
			
			getResult('api/shop/item/detail/'+ this.uid, {
				yo: openid
			}, 'callbackShopMallItemDetail', true);

			getResult('shaketv/userinfo/base',{
				'yoi' : openid
			},'callbackShaketvBaseUserinfoHandler');
		},
		
		swipe: function() {
			var $container = $('#swiper-container'),
				$wrapper = $('#swiper-wrapper'),
				t = simpleTpl(),
				len = this.img_details.length;
			
			if (len == 0) {
				return;
			}
			for (var i = 0; i < len; i++) {
				t._('<div class="swiper-slide">')
					._('<img src="'+ this.img_details[i] +'" />')
				._('</div>');
			}
			$wrapper.html(t.toString());
			
			if (len > 1) {
				this.swiper = new Swiper($container.get(0), {
				    grabCursor: true,
				    calculateHeight: true,
				    cssWidthAndHeight: false,
				    pagination: '.pagination'
				});
				$('.pagination').find('span').eq(0).addClass('swiper-active-switch');
			}
			$container.removeClass('none');
			
		},
		
		event_handler: function() {
			var me = this;
			$('#btn-confirm').click(function(e) {
				e.preventDefault();
				me.submit(true);
			});
			
			$('#btn-modify').click(function(e) {
				e.preventDefault();
				me.show_order();
			});
			
			$('#btn-submit').click(function(e) {
				e.preventDefault();
				
				if ($(this).hasClass(me.disabled_cls) || $(this).hasClass(me.request_cls)) {
					return;
				}
				me.submit();
			});
			
			$('.stock-tool').click(function(e) {
				e.preventDefault();
				
				var $tg = $(e.target),
					$input = $('#tool-num'),
					step = parseInt($tg.attr('data-step')),
					value = parseInt($.trim($input.val())),
					result = value + step;
				
				if (result <= 0) {
					return false;
				}
				me.quantity = result;
				$input.val(result);
				$('.info-num').find('span').text(result);
				$('.total-money').text((result * me.price).toFixed(2));
			});
			
			$('#size-wrapper').delegate('.rule-size', 'click', function(e) {
				e.preventDefault();
				
				if ($(this).hasClass('disabled')) {
					return;
				}
				if ($(this).hasClass('curr')) {
					me.sc = me.scn = '';
					$(this).removeClass('curr');
					$('.rule-color').removeClass('disabled');
				} else {
					$(this).addClass('curr').siblings().removeClass('curr');
					me.sc = $(this).attr('data-sc');
					me.scn = $(this).attr('data-scn');
					
					$('.rule-color').each(function() {
						var cc = $(this).attr('data-cc');
						if (!me.sku[cc+'#'+me.sc]) {
							$(this).addClass('disabled');
						} else {
							$(this).removeClass('disabled');
						}
					});
				}
				me.update_info();
			});
			
			$('#color-wrapper').delegate('.rule-color', 'click', function(e) {
				e.preventDefault();
				
				if ($(this).hasClass('disabled')) {
					return;
				}
				if ($(this).hasClass('curr')) {
					me.cc = me.ccn = '';
					$(this).removeClass('curr');
					$('.rule-size.disabled').removeClass('disabled')
				} else {
					$(this).addClass('curr').siblings().removeClass('curr');
					me.cc = $(this).attr('data-cc');
					me.ccn = $(this).attr('data-ccn');
					
					$('.rule-size').each(function() {
						var sc = $(this).attr('data-sc');
						if (!me.sku[me.cc+'#'+sc]) {
							$(this).addClass('disabled');
						} else {
							$(this).removeClass('disabled');
						}
					});
				}
				me.update_info();
			});
		},
		
		update_info: function() {
			$('#info-standard').removeClass('none').text(this.ccn + ' ' + this.scn);
			
			var color = $('.rule-color.curr').attr('data-cc'),
				size = $('.rule-size.curr').attr('data-sc'),
				key = (color || '') + '#' + (size || '');

			H.order.update_price(this.sku[key] ? this.sku[key].price : this.price_min);
		},
		
		init_price: function(has_sku) {
			var result = this.format_price(this.price_default);
			if (has_sku) {
				result = this.format_price(this.price_min);
				if (this.price_max > this.price_min) {
					result += ' - ' + this.format_price(this.price_max);
				}
			} else {
				this.price = this.format_price(this.price_default);
				$('.total-money').text((this.price * this.quantity).toFixed(2));
			}
			$('.per-price').text('￥' + result);
		},
		
		update_price: function(price) {
			this.price = this.format_price(price);
			$('.per-price').text('￥' + this.price);
			$('.total-money').text((this.price * this.quantity).toFixed(2));
		},
		
		format_price: function(price) {
			return (price / 100 || 0).toFixed(2);
		},
		
		submit: function(ischeck) {
			var $mobile = $('#mobile'),
				mobile = $.trim($mobile.val()),
				$name = $('#name'),
				name = $.trim($name.val()),
				$address = $('#address'),
				address = $.trim($address.val()),
				$color = $('#color-wrapper').find('a.curr');
			
			if (this.colors.length > 0 && (!this.cc || !this.ccn)) {
				alert('请先选择颜色');
				return false;
			} else if (this.sizes.length > 0 && (!this.sc || !this.scn)) {
				alert('请先选择规格');
				return false;
			}
			
			if (!mobile || !/^\d{11}$/.test(mobile)) {
				alert('请先输入正确的手机号');
				$mobile.focus();
				return false;
			}
			
			$('.name').text(name);
			$('.mobile').text(mobile);
			$('.address').text(address);
			
			if (ischeck) {
				H.order.show_confirm();
				return false;
			}
			

			$(this).addClass(this.request_cls);
			getResult('api/shop/order/confirm/'+ this.uid +'/' + this.quantity, {
				yo: openid,
				ph: mobile,
				pt: 1,
				co: encodeURIComponent(name),
				ad: encodeURIComponent(address),
				cc: encodeURIComponent(this.cc),
				cn: encodeURIComponent(this.ccn),
				sc: encodeURIComponent(this.sc),
				sn: encodeURIComponent(this.scn)
			}, 'callbackShopMallOrderConfirm', true);
		},
		
		show_order: function() {
			$('.wrapper').addClass('none');
			$('#order-wrapper').removeClass('none');
			$('.copyright').removeClass('bottom');
			
			this.resize();
		},
		
		show_confirm: function() {
			$('.wrapper').addClass('none');
			$('#confirm-wrapper').removeClass('none');
			$('.copyright').addClass('bottom');
			$(window).scrollTop(0);
			
			this.resize();
		},
		
		resize: function() {
			var height = $(window).height();
			$('.main').css('minHeight', height);
		},
		
		fill_data: function(data) {
			var me = this;
			this.colors = data.colors || [];
			this.sizes = data.sizes || [];

			if (this.colors.length > 0) {
				var t = simpleTpl();
				for (var i = 0, len = this.colors.length; i < len; i ++) {
					t._('<a href="#" class="rule-item rule-color" data-cc="'+ this.colors[i].cc +'" data-ccn="'+ this.colors[i].ccn +'">'+ this.colors[i].ccn +'</a>');
				}
				$('#color-wrapper').removeClass('none').find('.item-content').html(t.toString());
			}
			if (this.sizes.length > 0) {
				var t = simpleTpl();
				for (var i = 0, len = this.sizes.length; i < len; i ++) {
					t._('<a href="#" class="rule-item rule-size" title="'+ this.sizes[i].scn +'" data-sc="'+ this.sizes[i].sc +'" data-scn="'+ this.sizes[i].scn +'">'+ this.sizes[i].scn +'</a>');
				}
				$('#size-wrapper').removeClass('none').find('.item-content').html(t.toString());
			}

			$.each(data.sku || [], function(index, obj) {
				$.each(obj, function(key, value) {
					var arr = value.split('#');
					me.sku[key] = {
						'price': arr[0],
						'stock': arr[1]
					};
				});
			});
			this.price_min = data.minp;
			this.price_max = data.maxp;
			this.price_default = data.yp;
			H.order.init_price((data.sku || []).length > 0);
			
			this.name = data.n || '';
			this.img_details = data.om ? data.om.split(';') : [];
			
			if (this.img_details.length > 0) {
				H.order.swipe();
			}

			data.pinf && $('#good-zp').removeClass('none').html(data.pinf);
			data.det && $('#good-list').html(data.det).closest('.ui-item').removeClass('none'); 
			$('.good-name').text(this.name);
			$('#ctrl-total').text((data.yp / 100 || 0).toFixed(2));
		},

		fill_user_data: function(data){
			$('#mobile').val(data.phone || '');
			$('#name').val(data.realname || '');
			$('#address').val((data.address || ''));
		}
	};
	
	
	// 商品详情
	W.callbackShopMallItemDetail = function(data) {
		if (data.code != 0) {
			alert(data.message);
			window.location.href = 'index.html';
			return;
		}
		
		H.order.fill_data(data);
	};

	// 用户个人信息
	W.callbackShaketvBaseUserinfoHandler = function(data){
		H.order.fill_user_data(data);
	}
	
	// 确认订单
	W.callbackShopMallOrderConfirm = function(data) {
		$('#btn-submit').removeClass(H.order.request_cls);
		
		if (data.code == 0) {
			var result = 'result.html?n=' + encodeURIComponent(H.order.name);
			result += '&q=' + H.order.quantity; 
			result += '&p=' + H.order.price;
			
			if (H.order.ccn) {
				result += '&ccn=' + encodeURIComponent(H.order.ccn);
			}
			if (H.order.scn) {
				result += '&scn=' + encodeURIComponent(H.order.scn);
			}
			if (H.order.img_details.length > 0) {
				result += '&img=' + H.order.img_details[0]
			} 
			
			window.location.href = result;
			return;
		}
		if(data && data.message){
			alert(data.message);
		}else{
			alert('下单失败！请稍后重试');
		}
		
	};
	
})(Zepto);

H.order.init();