$(function() {
	window.page = 1;
	window.pageSize = 5;
	
	$('.btn-loadmore').click(function(e) {
		e.preventDefault();
		
		var loadCls = 'loading';
		if ($(this).hasClass(loadCls) || $(this).hasClass('disabled')) {
			return;
		}
		$(this).addClass(loadCls);
		page ++;
		getList();
	});
	getList(true);
});

window.getList = function(showloading) {
	getResult('travel/enterattr/history', {cuid: channelUuid, page: page, pageSize: pageSize}, 'callbackTravelHisHander', showloading);
}
window.callbackTravelHisHander = function(data) {
	$('.btn-loadmore').removeClass('loading');
	
	if (data.code == 0) {
		var t = simpleTpl(),
			items = data.items || [],
			len = items.length;

		if (len < pageSize) {
			$('.btn-loadmore').addClass('none');
		} else {
			$('.btn-loadmore').removeClass('none');
		}
		
		for (var i = 0; i < len; i ++) {
			t._('<div class="list_box">')
	          	._('<a href="strategy.html?uuid='+ items[i].id +'">')
	           		._('<img src="'+ items[i].ic +'" width="94">')
	           		._('<strong>'+ items[i].t +'</strong>')
	           		._('<p>'+ items[i].d +'</p>')
	           		._('<span>'+ (items[i].dt) +'</span>')
	        	._('</a>')
		    ._('</div>');
		}
		$('#list').append(t.toString());
	} else {
		$('.btn-loadmore').addClass('none');
	}
}