var $nav_item = $('.nav a'),
	$list = $('.detail-list'),
	uid = getQueryString('uid');

getResult('index/recommend/' + uid, {}, 'callbackRcommendDetailHander', true);

navEventHandler();

function navEventHandler() {
	$nav_item.click(function(e) {
		e.preventDefault();
		
		var index = $nav_item.index($(this));
		$nav_item.removeClass('curr');
		$(this).addClass('curr');
		$list.find('li').addClass('none').eq(index).removeClass('none');
	});
}

function callbackRcommendDetailHander(data) {
	if (data.code == 0) {
		$('#cover').html('<img src="'+ data.ib +'" />');
		$('#info').find('h2').text(data.n).end()
				  .find('p').text((data.bc || '') + '  ' + data.pd);
		
		if (!data.has) {
			$('#info').addClass('nonav');
			$('#nav').addClass('nonav');
			$('#detail-list').addClass('nonav');
		}
		// 本期内容
		if (data.rde) {
			$('#content').append(data.rde).removeClass('none');
		}
		// 栏目介绍
		if (data.rds) {
			$('#intro').append(data.rds).removeClass('none');
		}
		
		// 参与办法
		if (data.ade) {
			$('#method').append(data.ade).removeClass('none');
		}
		
		// 参与规则
		if (data.ads) {
			$('#rule').append(data.ads).removeClass('none');
		}
		
		if (data.ws) {
			$('#winners').append(data.ws).removeClass('none');
		}
		
	}
}