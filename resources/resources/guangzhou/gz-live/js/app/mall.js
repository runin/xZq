var page = 1,
	pageSize = 5,
	loadmore = true;
	
$(function() {
	/*$('.btn-loadmore').click(function(e) {
		e.preventDefault();
		
		var loadCls = 'loading';
		if ($(this).hasClass(loadCls) || $(this).hasClass('disabled')) {
			return;
		}
		$(this).addClass(loadCls);
		page ++;
		getList();
	});*/
	getList(true);
	page ++;
	
	getResult('mall/item/jfrule', {stationUuid:stationUuid, serviceNo:serviceNo}, 'callbackJfruleHandler', true);
	
	var range = 180, //距下边界长度/单位px
	maxpage = 100, //设置加载最多次数
	totalheight = 0; 

	$(window).scroll(function(){
	    var srollPos = $(window).scrollTop();
	    totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
		if (($(document).height() - range) <= totalheight  && page < maxpage && loadmore) {
			if (!$('#mallSpinner').hasClass('none')) {
				return;
			}
			$('#mallSpinner').removeClass('none');
			getList();
			page ++;
	    }
	});
	
});

function getList(showloading) {
	getResult("mall/item/newlist", {cuid: channelUuid, page: page, pageSize: pageSize}, 'callbackStationMall', showloading);
}

function callbackStationMall(data) {
	$('#mallSpinner').addClass('none');
	
	if (data.code == 0) {
		var items = data.items || [],
			len = items.length,
			t = simpleTpl();
		
		if (len < pageSize) {
			loadmore = false;
		}
		
		for (var i = 0; i < len; i ++) {
			var url = 'gift_detail.html?uid='+ items[i].uid;
			t._('<li>')
				._('<a href="'+ url +'" data-collect="true" data-collect-flag="gz-live-main-mall" data-collect-desc="积分商城 '+ items[i].n +'">')
					._('<img src="'+ items[i].is +'" />')
					._('<div class="right">')
					._(items[i].bd?'<h2>'+ items[i].bd +'</h2>':'')
						._(items[i].sn?'<h2>'+ items[i].sn +'</h2>':'')
						._('<p>兑换积分：'+ items[i].ip + '<span class="price">￥' + (Math.round((items[i].mp || 0)) / 100) + '</span></p>')
					._('</div>')
				._('</a>')
			._('</li>');
		}
		
		$('#list').append(t.toString());
		for (var i = 0; i < len; i ++) {
			if(i%2!==0){
				$('#list li').eq(i).css("background","#f2f1f1");
			}		
		}	
	} else {
		$('.btn-loadmore').addClass('none');
	}
}

window.callbackJfruleHandler = function(data) {
	if (data.code == 0) {
        if(data.rule = '' && data.rule.length > 0 && data.rule != null){
            $('.tips').removeClass('none');
            $('#p_jfrule').empty().html(data.rule);
        }
	}
};