;(function($) {
	H.gift = {
		page: 1,
		pageSize: 5,
		loadmore:  true,
		init: function() {
			this.event();
		},
		event: function(){
			var me = H.gift,
				jfFlag = true,
				chouFlag = true,
				$jf = $('#gift-timeline-jf'),
				$chou = $('#gift-timeline-chou');
			$('.gift-nav li:first-child').click(function(e){
				e.preventDefault();
				console.log('抽奖');
				if($chou.hasClass('none') && chouFlag){
					$('.gift-timeline').addClass('none');
					me.getSleftList();
					chouFlag = false;
				}else{
					$jf.addClass('none');
					$chou.removeClass('none');
				}

			});
			$('.gift-nav li:last-child').click(function(e){
				e.preventDefault();
				console.log('积分换礼');
				if($jf.hasClass('none') && jfFlag){
					me.page = 1;
					$('.gift-timeline').addClass('none');
					me.getList();
					jfFlag = false;
				}else{
					$chou.addClass('none');
					$jf.removeClass('none');
				}
			});

			var range = 180, //距下边界长度/单位px
				maxpage = 100, //设置加载最多次数
				totalheight = 0;

			$(window).scroll(function(){
				var srollPos = $(window).scrollTop();
				totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
				if (($(document).height() - range) <= totalheight  && me.page < maxpage && me.loadmore) {
					if(!$('#gift-timeline-jf').hasClass('none')){
						me.getList();
						me.page ++;
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
		},
		//查询个人中奖记录
		getSleftList: function(){
			getResult('api/lottery/record', {oi: openid}, 'callbackLotteryRecordHandler', true);
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
						._('<h2>'+ items[i].n || '' +'</h2>')
					._('</div>')
				._('</li>');
			}
			$('#gift-timeline-jf').append(t.toString()).removeClass('none');
		} else {
			me.loadmore = false;
			$('.btn-loadmore').addClass('none');
		}
	};
	W.callbackLotteryRecordHandler = function(data){
		if(data.result){
			var t = simpleTpl(),
				items = data.rl || [],
				len = items.length,
				lt = '',
				isShow = '';

			for (var i = 0; i < len; i ++) {
				lt = items[i].lt.split(" ")[0];
				isShow = items[i].cc ? '': 'none';
				t._('<li>')
					 ._('<div class="gift-icon"></div>')
					 ._('<div class="gift-time">'+ lt || '' +'</div>')
					 ._('<div class="gift-content">')
						 ._('<h2>'+ items[i].pn || '' +'</h2>')
						 ._('<p class="'+ isShow +'">'+ (items[i].cc ? items[i].cc : '') +'</p>')
					 ._('</div>')
				 ._('</li>');
			}
			$('#gift-timeline-chou').html(t.toString()).removeClass('none');
		}
	};

})(Zepto);

$(function() {
	H.gift.init();
});
