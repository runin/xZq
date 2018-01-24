(function($) {
	
	H.about = {
		$cover: $('#cover'),
		page: 1,
		pageSize: 10,
		total: 0,
		loadmore : true,
		init: function() {
			
			//列表
			getList(true);
		    
		    this.event_handler();
		    
		   /* var height = $(window).height();
			$('.main').css('minHeight', height);*/
		},
		
		event_handler: function() {
			$('.btn-loadmore').click(function(e) {
				e.preventDefault();

				var loadCls = 'loading';
				if ($(this).hasClass(loadCls)) {
					return;
				}
				$(this).addClass(loadCls);
				H.about.page ++;
				getList();
			});
			$('.rank-close').click(function(e){
				e.preventDefault();
				$('.masking-box').addClass('none');
				$('#ui-audio').addClass('none');
				$('#ui-arrows').removeClass('none');
				$('#ui-share').removeClass('none');
				$('.wrapper').removeClass('none');
			});
		},
		
		add_items: function(data) {
			var items = data.items || [],
				len = items.length,
				t = simpleTpl();
				item = [
							{
								"an": "城",
								"ci": "薛保勤",
								"qu": "赵 麟",
								"chang": "雷 佳"
							},
							{
								"an": "西门外的雨",
								"ci": "孙 浩",
								"qu": "孙 浩",
								"chang": "孙 浩"
							},
							{
								"an": "大西安",
								"ci": "陈维东",
								"qu": "陈丽春",
								"chang": "王潇/刘小洁"
							},
							{
								"an": "长安月",
								"ci": "李宏天",
								"qu": "龚佩燕",
								"chang": "苏  华"
							},
							{
								"an": "西安是首歌",
								"ci": "祁  越",
								"qu": "张  林",
								"chang": "郝  萌"
							},
							{
								"an": "梦中的西安",
								"ci": "新  明",
								"qu": "周  澎",
								"chang": "周  澎"
							},
							{
								"an": "西安梦",
								"ci": "蒋  平",
								"qu": "夏正华",
								"chang": "王海天"
							},
							{
								"an": "世界的西安",
								"ci": "王海天",
								"qu": "刘续红",
								"chang": "张  喆"
							},
							{
								"an": "西安，我对你太熟了",
								"ci": "海  鹏",
								"qu": "曹  博",
								"chang": "捌零年代"
							},
							{
								"an": "八水润西安",
								"ci": "徐亚非",
								"qu": "陈大明",
								"chang": "郝 萌"
							}
						];
			this.total = data.ac;

			for (var i = 0; i < item.length; i++) {
				t._('<div class="ui-movie movie">')
					._('<div class="num"><label>'+ (i+1) +'</label></div>')
					._('<div class="cover"><span>'+ (item[i].an || '') +'</span></div>')
					._('<div class="content">')
						._('<div class="ci">作词：<span>'+ (item[i].ci || '') +'</span></div>')
						._('<div class="qu">作曲：<span>'+ (item[i].qu || '') +'</span></div>')
						._('<div class="chang">演唱：<span>'+ (item[i].chang || '') +'</span></div>')
					._('</div>')
					._('<div class="heart" id="heart'+ i +'"></div>')
				._('</div><div class="clear"></div>');
			}
			$('#ui-list').html(t.toString());
			for (var i = 0; i < len; i++) {
				var strPayment = items[i].an, vn = items[i].vn;
				switch (strPayment){
					case "城":
						$('#heart0').text(vn); break;
					case "西门外的雨":
						$('#heart1').text(vn); break;
					case "大西安":
						$('#heart2').text(vn); break;
					case "长安月":
						$('#heart3').text(vn); break;
					case "西安是首歌":
						$('#heart4').text(vn); break;
					case "梦中的西安":
						$('#heart5').text(vn); break;
					case "西安梦":
						$('#heart6').text(vn); break;
					case "世界的西安":
						$('#heart7').text(vn); break;
					case "西安，我对你太熟了":
						$('#heart8').text(vn); break;
					case "八水润西安":
						$('#heart9').text(vn); break;
					default:
						$('#heart'+ i).text('-')
				}
			};
			$('#ui-movies').removeClass('none');
		}
	};
	
	W.getList = function(showloading) {
		getResult('vote/rank', {
			page: H.about.page,
			pageSize: H.about.pageSize
		}, 'rankHandler', true);
	};
	
	W.rankHandler = function(data) {
		if (data.code != 0) {
			return;
		}

		var callbackHumorRePage = data;



		$('.btn-loadmore').removeClass('loading');

		var $loadmore = $('.btn-loadmore');

		if (data.items.length < H.about.pageSize) {
			$loadmore.addClass('none');
		} else {
			$loadmore.removeClass('none');
		}
		H.about.add_items(callbackHumorRePage);	};
	
})(Zepto);