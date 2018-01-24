/**
 * 全部节目单
 */
(function($) {
	
	H.all = {
		$main: $('.main'),
		$list: $('.all-list'),

		$page : 1,
		$pageSize : 20,

		init: function() {
			var height = $(window).height();
			this.$main.css('min-height', height);

			showLoading();

			getResult('api/shop/item/all',{},'callbackShopMallItemAll');
		},

		initAllList: function(data){
			this.$list.append(this.tpl(data.items));

			this.$list.find('li').each(function(i){
			    setTimeout(function(){
			       $('.all-list li').eq(i).addClass('show');
			    },50*i);
			});
		},

		emptyList: function(){
			this.$list.append('<li class="empty show">暂时还没有商品哦</li>');
		},

		tpl: function(data) {
			var t = simpleTpl();
			for (var i = 0, len = data.length; i < len; i ++) {
				var item = data[i];
				t._('<li>')
				 	._('<a href="javascript:void(0);">')
				 		._('<section class="img-detail">')
							._('<img src="'+item.im+'" />')	
						._('</section>')
						._('<section class="content-detail">')
							._('<h2>'+item.n+'</h2>')	
							._('<p>微信独享价：<span class="red">￥'+this.format_price(item.yp)+'</span></p>')	
							._('<p>播放时间：'+dateformat(str2date(item.vst || ''), 'MM/dd hh:mm')+'</p>')	
						._('</section>')
					._('</a>')
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

	W.callbackShopMallItemAll = function(data) {
		hideLoading();
		if (data.code == 0) {
			H.all.initAllList(data);
		}else{
			H.all.emptyList();
		}
	};

})(Zepto);

$(function(){
	H.all.init();
});