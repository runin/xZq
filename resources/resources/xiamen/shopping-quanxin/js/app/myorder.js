/**
 * 我的订单
 */
(function($) {
	
	H.myorder = {
		$main: $('.main'),
		$list: $('.myorder-list'),

		$page : 1,
		$pageSize : 20,

		init: function() {
			var height = $(window).height();
			this.$main.css('min-height', height);
			this.$main.css('max-height', 'none');
			this.$main.css('padding-bottom', '10px');

			showLoading();
			getResult('api/shop/order/myrecord',{
				'yo' : openid,
				'page' : this.$page,
				'pageSize' : this.$pageSize
			},'callbackShopMallOrderMyrecord');
		},

		initOrderList: function(data){
			this.$list.append(this.tpl(data.es));

			this.$list.find('li').each(function(i){
			    setTimeout(function(){
			       $('.myorder-list li').eq(i).addClass('show');
			    },50*i);
			});

			this.$list.find('li').click(function(){
				$(this).find('.more').removeClass('none');
			});

		},

		emptyList: function(){
			this.$list.append('<li class="empty show">暂时还没有下单哦</li>');
		},

		tpl: function(data) {
			var t = simpleTpl();
			for (var i = 0, len = data.length; i < len; i ++) {
				var item = data[i];
				t._('<li>')
				 	._('<section class="item">')
				 		._('<a class="img-detail" href="./order.html?ituid='+item.its[0].uid+'">')
							._('<img src="'+item.its[0].i+'" />')	
						._('</a>')
						._('<section class="content-detail">')
							._('<h2>'+item.its[0].n+'</h2>')	
							._('<p class="total">合计:￥'+this.format_price(item.its[0].p * item.its[0].q) + '</p>')
							._('<p class="sum">数量: '+item.its[0].q + '</p>')
							._('<section class="more none">')
								._('<p class="content-ot">下单时间：'+ dateformat(str2date(item.ot),'yyyy-MM-dd hh:mm')+'</p>')
								._('<p class="content-tel">联系电话：'+item.tl+'</p>')
								._('<p class="content-add">配送地址：'+item.ad+'</p>')
							._('</section')
							
						._('</section>')
					._('</section>')
				._('</li>');		
			}
			return t.toString();
		},
		format_price: function(price, only_int) {
			var result = (price / 100 || 0).toFixed(2) + '';
			index = result.indexOf('.');
			if (typeof only_int == 'undefined') {
				return result;
			} else if (only_int == true) {
				return result.slice(0, index);
			} else {
				return result.substr(index);
			}
		}
	};

	W.callbackShopMallOrderMyrecord = function(data) {
		hideLoading();
		if (data.code == 0) {
			H.myorder.initOrderList(data);
		}else{
			H.myorder.emptyList();
		}
	};

})(Zepto);

$(function(){
	H.myorder.init();
});