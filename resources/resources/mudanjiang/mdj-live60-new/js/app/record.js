;(function($) {
	H.record = {
		page: 1,
		pageSize: 5,
		time: 0,
		loadmore:  true,
		init: function() {
			this.event();
			this.getSleftList();
		},
		event: function(){
			var me = H.record;
			$('.btn-back').click(function(e){
				e.preventDefault();
				toUrl('index.html');
			});

			var range = 180, //距下边界长度/单位px
				maxpage = 100, //设置加载最多次数
				totalheight = 0;

			$(window).scroll(function(){
				var srollPos = $(window).scrollTop();
				totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
				if (($(document).height() - range) <= totalheight  && me.page < maxpage && me.loadmore) {
					me.getSleftList();
				}
			});
		},
		//查询个人中奖记录
		getSleftList: function(){
			var me = H.record;
			getResult('api/lottery/record', {
				oi: openid,
				pt: '1,4,5',
				pn: me.page,
				ps : me.pageSize
			}, 'callbackLotteryRecordHandler', true);
			me.page ++;
		}
	};

	W.callbackLotteryRecordHandler = function(data){
		var me = H.record;
		if(data.result){
			var t = simpleTpl(),
				items = data.rl || [],
				len = items.length,
				lt = '',
				isShow = '';
			if (len < me.pageSize) {
				me.loadmore = false;
			}
			for (var i = 0; i < len; i ++) {
				lt = items[i].lt.split(" ")[0];
				isShow = items[i].cc ? '': 'none';
				t._('<li>')
					._('<div class="gift-icon"></div>')
					._('<div class="gift-time">'+ lt || '' +'</div>')
					._('<div class="gift-content">')
						._('<div class="des">您在直播60分节目中赢得'+ items[i].pn || '' +'</div>')
						._('<h2>'+ items[i].pn || '' +'</h2>')
						._('<p class="'+ isShow +'">'+ (items[i].cc ? items[i].cc : '') +'</p>')
					._('</div>')
					._('</li>');
			}
			$('#gift-timeline-chou').append(t.toString()).removeClass('none');
		}else{
			me.loadmore = false;
			if(me.time == 0){
				$('.tips').removeClass('none');
			}
		}
		me.time ++;
	};

})(Zepto);

$(function() {
	H.record.init();
});
