$(function() {
	FastClick.attach(document.body);
	$('body').delegate('.main-item', 'click', function(e) {
		window.location.href = $(this).data('url');
	});

	$('#info-wrapper').click(function(e) {
		e.preventDefault();
		
		window.location.href = 'user.html';
	});
});

var $weather = $('#weather'),
	$credits = $('#info-wrapper'),
	$guide = $('#guide'),
	$hdrecommend = $('#hd-recommend'),
	$jiemu = $('#jiemu');

imgReady(main_bg, function() {
	var win_width = $(window).width();
	
	$('body').css('background', 'url('+ main_bg +') no-repeat center 0, -webkit-linear-gradient(top, #C3373D 0%, #DE3434 20%, #DE3434 100%) no-repeat center 245px');
	$('body').css('background-size', win_width + 'px auto');
	$('html').css('background-color', '#DE3434');
	// 天气
	getResult("weather", {stationuuid: stationUuid}, 'callbackWeatherHandler');

	// 积分
	getResult("user/" + openid + "/channelUuid/"+ channelUuid +"/integral", {}, 'callbackUserjfHandler');

	getResult('index/cards/' + channelUuid, {}, 'callbackEnterActHandler', true);

	// 节目推荐
	getResult('index/recommend', {cuid: channelUuid}, 'callbackRcommendHander');
});

function callbackWeatherHandler(data) {
	if (data.code == 0) {
		$weather.find('.date').text(data.rd);
		$weather.find('.temp').text(data.low && data.high ? data.low + '/' + data.high + '℃' : '');
		$weather.find('img').attr('src', data.wimg ? (data.wimg) : '');
		$weather.removeClass('hidden').addClass('weather-animation');
	}
}

function callbackUserjfHandler(data) {
	if (data.code == 0) {
		$credits.removeClass('hidden');
		$credits.find('.credits').text(data.jf || 0);
	}
}

function callbackRcommendHander(data) {
	var t = simpleTpl(),
		items = data.items || [];
	for(var i = 0, len = items.length; i < len; i++) {
		var imgPath = i == 0 && items.length >= 3 ? items[i].bp : items[i].is;
		var url = 'detail.html?uid=' + items[i].uid;
		t._('<li>')
			._('<a class="img" href="javascript:toUrl(\''+ url +'\')" data-collect="true" data-collect-flag="portal-main-jiemu" data-collect-desc="首页推荐 '
					+ items[i].n +'"><img src="'+ imgPath + '" /></a>')
			._('<a class="title ellipsis" href="detail.html?uid='+ items[i].uid +'">'+ items[i].pd +'</a>')
			._('<p>'+ items[i].n +'</p>')
		._('</li>');
	}
	$jiemu.prepend(t.toString()).closest('.jiemu').removeClass('none');
}

function callbackEnterActHandler(data) {
	var yaoUrl = null;
	// 互动推荐
	if (data.lastac && data.lastac.code == 0) {
		var $yao = $('#yao'), item = data.lastac,
			$span = $yao.find('.title span'),
			$label = $yao.find('.title label');
		
		$yao.find('.time').attr('stime', timestamp(item.pd + ' ' + item.bt))
						  .attr('etime', timestamp(item.pd + ' ' + item.et))
						  .countDown({
							  sdtpl: '互动进行中', 
							  otpl: '互动已结束',
							  stCallback: function() {
								  $label.text('即将开始');
							  },
							  sdCallback: function() {
								  $label.text('进行中');
							  },
							  otCallback: function() {
								  $label.text('已结束');
							  }
						  });
		$yao.find('.title span').text(item.an || '');
		$yao.data('url', item.ul);
		yaoUrl = item.ul;
		$yao.removeClass('none');
	}
	
	// 正在播出
	if (data.todayGuide && data.todayGuide.code == 0) {
		var today = data.todayGuide,
			items = today.items || [], 
			now = '', after = '';
		
		for (var i = 0, len = items.length; i < len; i++) {
			if (items[i]) {
				if (items[i].t == 1) {
					$guide.find('.now').text(items[i].n || '')
				} else {
					$guide.find('.later').text(items[i].n || '')
				}
			}
		}
		$guide.removeClass('none');
	}
	
	// 第3个卡片
	if (data.acts.code == 0) {
		var t = simpleTpl(),
			items = data.acts.items || [];
		
		for ( var i = 0, len = items.length; i < len; i ++) {
			//如果互动倒计时跳转链接与此推荐节目的链接地址相同，则不显示
			if(yaoUrl == items[i].ul){
				continue;
			}
			t._('<div class="main-item event" data-url="'+ items[i].ul +'" data-collect="true" data-collect-flag="portal-main-acts" data-collect-desc="首页卡片 '+ items[i].tt +'">')
				._('<div class="item-content">')
					._('<img src="'+ items[i].img +'" />')
					._('<p class="desc">'+ (items[i].bt || '&nbsp;') +'</p>')
					._('<p class="large title">'+ (items[i].tt || '&nbsp;') +'</p>')
					._('<p class="time">'+ (items[i].st || '&nbsp;') +'</p>')
				._('</div>')
			._('</div>')
		}
		$('#acts').html(t.toString()).removeClass('none');
		
	}
	
	var timer = 5, step = 900;
	$('.item-content').each(function() {
		var $this = $(this);

		timer += step;
		(function(time) {
			setTimeout(function() {
				$this.addClass('scale');
			}, time);
		})(timer);
	});
}