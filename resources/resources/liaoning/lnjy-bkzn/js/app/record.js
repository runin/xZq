(function($) {
	H.record = {
		c:getQueryString("c"),
		init: function () {
			this.list();
			this.resize();
			this.event();
		},
		event: function() {
			$('#back-btn').click(function(e) {
                e.preventDefault();
                toUrl('index.html');
			});
		},
        resize: function() {
        	var winW = $(window).width(),
        		winH = $(window).height(),
        		footerH = $('footer').height();
        	$('body').css({
        		'width': winW,
        		'height': winH
        	});
        	$('.content').css('height', Math.floor(winH - footerH));
        },
		list: function(){
			getResult('api/lottery/record', {oi: openid}, 'callbackUserPrizeHandler', true);
		}
	};
	
	W.callbackLotteryRecordHandler = function(data){
		if (data.result) {
			var t = simpleTpl(),
				items = data.rl || [],
				len = items.length;
			for (var i = 0; i < len; i ++) {
				var classStatecc = typeof(items[i].cc)=="undefined"?"none":"";
				t._('<li>')
					._('<div class="gift-icon"></div>')
					._('<div class="gift-time">'+ items[i].lt.split(" ")[0] +'</div>')
					._('<div class="gift-content">')
						._('<p class="gift-name">奖品名称: '+ items[i].pn +'</p>')
						._('<p class="gift-code '+classStatecc+'">兑奖码: '+ items[i].cc +'</p>')
					._('</div>')
				._('</li>');
			};
			$('#list').append(t.toString()).removeClass('none');
		} else {
			$(".content").html('<p class="empty">亲，您暂时没有奖品哦~</P>');
			return;
		};
	};
})(Zepto);

$(function(){
	H.record.init();
});