(function($) {
	
	H.about = {
		$cover: $('#cover'),
		page: 1,
		pageSize: 5,
		total: 0,
		loadmore : true,
		init: function() {
			
			//列表
			getList(true);
		    
		    this.event_handler();
		    
		    var height = $(window).height();
			$('.main').css('minHeight', height);
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
		},
		
		add_items: function(data) {
			var items = data.items || [],
				len = items.length,
				t = simpleTpl();
			
			this.total = data.ac;
			for (var i = 0; i < len; i++) {
				t._('<div class="ui-movie movie" data-guid="'+ items[i].au +'" data-collect="true" data-collect-flag="food-annual-about-ph'+ i +'" data-collect-desc="年度美食-排行榜">')
	        		._('<div class="cover"><img src="'+ items[i].ai +'"></div>')
	        		._('<div class="content">')
	        			._('<h3><span> '+ (items[i].an || '') +'</span></h3>')
						._('<p>'+ items[i].vn +'</p>')
	        		._('</div>')
	        	._('</div>');
			}
			$('#ui-list').append(t.toString());
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
		H.about.add_items(callbackHumorRePage);

		$('.movie').click(function(e) {
			var au = $(this).attr('data-guid');
			window.location.href = 'info.html?au=' + au;
		});
	};
	
})(Zepto);
$(function(){
	H.about.init();
});