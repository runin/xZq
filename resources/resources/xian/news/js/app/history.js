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
	
	getList(true);
});

window.getList = function(showLoading) {
	getResult('news/history', {serviceNo: serviceNo,page: page, pageSize: pageSize}, 'callbackHistoryHandler', showLoading);
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
					._('<i class="none"></i>')
				._('</a>')
			._('</li>');
		}
		$items = $(t.toString());
		$('#list').append($items);
		$items.each(function() {
			var height = $(this).height(),
				top = Math.floor((height - 18) / 2) + 'px';
			$(this).find('i').css('top', top).removeClass('none');
		});
	}
};
