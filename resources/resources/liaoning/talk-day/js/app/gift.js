;(function($) {
	H.gift = {
		page: 1,
		pageSize: 5,
		loadmore:  true,
		init: function() {
			this.event();
			this.getList();
		},
		event: function(){
			var me = H.gift;

			var range = 180, //距下边界长度/单位px
				maxpage = 100, //设置加载最多次数
				totalheight = 0;

			$(window).scroll(function(){
				var srollPos = $(window).scrollTop();
				totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
				if (($(document).height() - range) <= totalheight  && me.page < maxpage && me.loadmore) {
					if(!$('#gift-timeline-jf').hasClass('none')){
						me.getList();
					}

				}
			});
		},
		//查看订单(积分换礼)
		getList: function(){
			var me = H.gift;
			getResult('api/mall/order/myrecord', {
				openid: openid,
				page: me.page,
				pageSize : me.pageSize
			}, 'callbackMallOrderMyRecord', true);
			me.page ++;
		}
	};

	W.callbackMallOrderMyRecord = function(data) {
		var me = H.gift;
		if (data.code == 0) {
			var t = simpleTpl(),
				items = data.items || [],
				len = items.length,
				at = '';

			if (len < me.pageSize) {
				me.loadmore = false;
			}
			
			for (var i = 0; i < len; i ++) {
				at = items[i].at.split(" ")[0];
				at = at.replace('年','-');
				at = at.replace('月','-');
				at = at.replace('日','');
				t._('<li>')
					._('<div class="gift-icon"></div>')
					._('<div class="gift-time">'+ at || '' +'</div>')
					._('<div class="gift-content">')
						._('<h2>商品名称：'+ items[i].n||''+ '</h2>' )
						._('<p class="">换购积分（/单位）：'+ items[i].ip || '' +'</p>')
						._('<p class="">换购数量：'+ items[i].am || '' +'</p>')
					._('</div>')
				._('</li>');
			}
			$('#gift-timeline').append(t.toString());
			$('.list').removeClass('none');
		} else {
			$('.list').html('<p class="no-content">目前没有兑换记录</p>').removeClass('none');
			me.loadmore = false;
			$('.btn-loadmore').addClass('none');
		}
	};

})(Zepto);

$(function() {
	H.gift.init();
});
