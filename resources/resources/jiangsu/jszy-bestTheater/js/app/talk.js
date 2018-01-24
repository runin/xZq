(function($) {
	H.talk = {
		$loadmore: $('#loadmore'),
		topicPage: 1,
		cmtPage: 2,
		pageSize: 10,
		cmtPageSize: 20,
		canLoadMore: false,
		filterType: getQueryString('fs') || 0,
		init: function() {					
			$('#main').removeClass('none');
			H.scroll.init();			
			this.resize();		

			this.fillTopics();
		},
		resize: function() {
			var height = $(window).height();
			$('body').css('height', height);
		},	
		fillTopics: function(loading, complete) {
			var me = this;
			getNewResult({
				url: 'twoSessions/friends/topics/list',
				data: {
					fs: me.filterType,
					page: me.topicPage,
					ps: me.pageSize,
					op: openid,
					dev:'wzz-superchild'
					
				}, 
				loading: loading, 
				jsonpCallback: 'callbackTwoSessionsFriendsTopicsHandler',
				complete: function(data) {
					complete && complete(data);
				},
				success: function(data) {
					
					me.topicPage ++;
					var items = data.items || [],
						len = items.length;
					if (len > 0) {
						var $content = $('#content'),
							$ul = $content.find('ul.topics'),
							$tpl = $(me.topicTpl(items));
						
						if ($ul.length == 0) {
							$content.prepend('<ul class="topics"></ul>');
						}
						$content.find('ul.topics').append($tpl);
						/*me.audioReady($tpl.find('audio'));*/
					}
					
					me.canLoadMore = len >= me.pageSize;
					if (me.topicPage == 1 || len > 0) {
						H.scroll.$scroll.refresh();
					}
					H.scroll.$scroll.refresh();
				}
			});
		},
		
	
		

		
		topicTpl: function(items) {
			var t = simpleTpl(),
				items = items || [];
			
			for (var i = 0, len = items.length; i < len; i ++) {
				var zaned = localStorage['zanedid-' + items[i].uid] ? 'zaned' : '',
					images = items[i].ims ? items[i].ims.split(',') : [],
					imgCount = images.length,
					comments = items[i].comments || [];
				
				t._('<li class="no-border">')
					._('<a class="cnt-left"><img src="'+ items[i].a +'" /></a>')
					._('<div class="cnt-right">')
						._('<a class="nickname">'+ items[i].p +'</a>')
			._('<div class="topic" id="msg-'+ items[i].uid +'" data-id="'+ items[i].uid +'">')
							._('<div class="words">'+ items[i].t +'</div>')
							._('<div class="imgs imgs-col-'+ imgCount +'">');
								for (var j = 0; j < imgCount; j ++) {
									t._('<a href="#" class="preview-img" data-src="'+ images[j] +'" style="background: url('+ images[j] +') no-repeat center center;background-size:cover;"></a>');
								}	
							t._('</div>');
							
							if (items[i].vos) {
								t._('<div class="voices no-border">')
									._('<i class="icon-voice"></i>')
									._('<span></span>')
									._('<audio preload="auto" class="audio none" src="'+ items[i].vos +'"></audio>')
								._('</div>');
							}
							
							t._('<div class="ctrl">')
								._('<a href="#" class="btn-zan '+ zaned +'"><i></i><span>'+ items[i].pc +'</span></a>')
								._('<a href="#" class="btn-cmt c-box"><i></i><span>'+ items[i].cc +'</span></a>')
							._('</div>');
							
							/*t._(this.cmtTpl(comments, items[i].uid, items[i].cc));*/
							
						t._('</div>')
					._('</div>')
				._('</li>');
			}
			
			return t.toString();
		},
		
	};
	
	
	
	
	H.scroll = {
		$scroll: null,
		pullUpEl: null, 
		generatedCount: 0,
		init: function() {
			var me = this,
				$pullup = $('#loadmore');
			
			this.$scroll = new IScroll('#main', {
				hScroll: false, 
			    bounce: false,
				mouseWheel: true,
				click: true,
				useTransition: true
			});
			
			this.$scroll.on('scrollEnd',function() {
				if (H.talk.canLoadMore && (this.directionY == 1 && this.y < (this.maxScrollY + 30)) && $pullup.hasClass('hidden')) {
					$pullup.removeClass('hidden');
						H.talk.fillTopics(false, function() {
							$pullup.addClass('hidden');
						});
					
			    }
			});
		}

	};
	
})(Zepto);

$(function() {
	H.talk.init();
});
