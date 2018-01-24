$(function() {
	window.page = 1;
	window.pageSize = 5;
	
	$('.btn-loadmore').click(function(e) {
		e.preventDefault();
		
		var loadCls = 'loading';
		if ($(this).hasClass(loadCls)) {
			return;
		}
		$(this).addClass(loadCls);
		page ++;
		getList();
	});
	
	
	$(".btn-back-simple").click(function(e) {
		e.preventDefault();
		window.location.href="index.html";
	});
	getList(true);
});

window.getList = function(showLoading) {
	getResult('synews/history', {serviceNo: serviceNo,page: page, pageSize: pageSize}, 'callbackHistoryHandler', showLoading);
}

window.callbackHistoryHandler = function(data) {
	$('.btn-loadmore').removeClass('loading');
	
	if (data.result) {
		var $loadmore = $('.btn-loadmore'),
			t = simpleTpl(),
			items = data.items || [],
			len = items.length;
		
		if (len < pageSize) {
			$loadmore.addClass('none');
		} else {
			$loadmore.removeClass('none');
		}
		
		for (var i = 0; i < len; i++) {
			var href = 'answer.html?isHistory=1&surveyInfoUuid=' + items[i].uuid;
			t._('<li>')
				._('<a href="'+ href +'">')
					._('<label>'+ items[i].surveyDate +'</label>')
					._('<span class="content">')
						._('<strong>第'+ items[i].whichQi +'期</strong>')
						._('<span>'+ items[i].title +'</span>')					
					._('</span>')
				._('</a>')
			._('</li>');
		}
		$items = $(t.toString());
		$('#list').append($items);
		$items.each(function() {
			var height = $(this).height(),
				top = Math.floor((height - 18) / 2) + 'px';
		});
	}else{
		var t = simpleTpl();
			t._('<p>亲，这是第一期哦</p>');
			$items = $(t.toString());
		$('#list').append($items);
	}
};
