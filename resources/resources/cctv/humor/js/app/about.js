(function($) {
	
	H.about = {
		guid: getQueryString('guid'),
		$cover: $('#cover'),
		page: 1,
		pageSize: 10,
		total: 0,
		init: function() {
			getResult('common/activtyRule/' + serviceNo, {}, 'callbackRuleHandler', true, $('#ui-rule'));
			
			getResult('humor/replay?guid=' + this.guid, {}, 'callbackHumorReplay', true);
			
			// 视频列表
			getList(true);
		    
		    this.event_handler();
		    
		    var height = $(window).height();
			$('.main').css('minHeight', height);
		},
		
		event_handler: function() {
			$('#ui-movies').delegate('.movie', 'click', function(e) {
				var guid = $(this).attr('data-guid');
				window.location.href = 'about.html?guid=' + guid;
			});
		},
		
		update_video: function(data) {
			$('#desc').text(data.t || '');
			$('#page').attr('data-title', data.t || '').attr('data-guid', this.guid);
			$('#title').find('span').text(data.da || '');

			if (!data.vul) {
				return;
			}
			var width = this.$cover.width(), 
				height = this.$cover.height(),
				url = add_param(data.vul, 'width', width, true);
				url = add_param(url, 'height', height, true);
			
			this.$cover.find('iframe').attr('src', url);
		},
		
		add_items: function(data) {
			var items = data.items || [],
				len = items.length,
				t = simpleTpl();
			
			this.total = data.ac;
			for (var i = 0; i < len; i++) {
				t._('<div class="ui-movie movie" data-guid="'+ items[i].guid +'" data-collect="true" data-collect-flag="cctv1-about-tomovie" data-collect-desc="家庭幽默重播页面-进入视频播放">')
	        		._('<div class="cover"></div>')
	        		._('<div class="content">')
	        			._('<h3>《CCTV家庭幽默大赛》<span>'+ items[i].da +'</span></h3>')
						._('<p>'+ (items[i].t || '') +'</p>')
	        		._('</div>')
	        	._('</div>');
			}
			$('#ui-list').append(t.toString());
			$('#ui-movies').removeClass('none');
		}
	};
	
	W.getList = function(showloading) {
		getResult('humor/repage', {
			tsuid: stationUuid,
			page: H.about.page,
			pageSize: H.about.pageSize
		}, 'callbackHumorRePage', true);
	};
	
	W.callbackHumorRePage = function(data) {
		if (data.code != 0) {
			return;
		}
		H.about.add_items(data);
	};
	
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			$('#ui-rule').html(data.rule).removeClass('none');
		}
	};
	
	W.callbackHumorReplay = function(data) {
		H.about.update_video(data);
	};
	
})(Zepto);

H.about.init();