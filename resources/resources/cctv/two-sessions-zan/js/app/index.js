(function($) {
	
	H.index = {
		topicId: getQueryString('tid'),
		$pvtotal: $('#pvtotal'),
		$loadmore: $('#loadmore'),
		topicPage: 1,
		pageSize: 10,
		range: 180,
		totalheight: 0,
		canLoadMore: false,
		filterType: getQueryString('fs') || 0,
		
		init: function() {
			$('#filter').find('a').eq(this.filterType).addClass('curr');
			
			H.scroll.init();
			
			this.resize();
			this.addStyle();
			
			this.fillTopics(true);
			
			this.updatepv();
			this.event();
			
			H.openjs.init();

			window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, share_url);
			window['shaketv'] && shaketv.subscribe(weixin_appid, function(returnData){
				//alert('shaketv subscribe: ' + JSON.stringify(returnData));
			});
		},
		
		event: function() {
			var me = this,
				$body = $('body');
			
			$('#content').delegate('.btn-zan', 'click', function(e) {
				e.preventDefault();
				
				if ($(this).hasClass('zaned')) {
					return;
				}
				
				var $me = $(this),
					zan = parseInt($me.find('em').text()) || 0,
					topicId = $me.closest('.topic').attr('data-id');
				
				$me.addClass('zaned animated').find('span').html('你是<em>'+ (zan + 1) +'</em>个赞');
				getResult({
					url: 'twoSessions/friends/topics/praise',
					data: {
						uid: topicId,
						op: openid
					},
					loading: false,
					jsonpCallback: 'callbackTwoSessionsFriendsTopicsPraiseHandler',
					success: function(data) {
						if (data.code == 0) {
							localStorage['zanedid-' + topicId] = true;
							return;
						}
						alert(data.message);
					}
				});
			}).delegate('.preview-img', 'click', function(e) {
				e.preventDefault();
				
				var $me = $(this), 
					topicId = $(this).closest('.topic').attr('data-id'), 
					imgs = window['imgs-' + topicId];
				
				if (!imgs) {
					imgs = [];
					$me.closest('.imgs').find('.preview-img').each(function() {
						imgs.push($(this).attr('data-src'));
					});
					window['imgs-' + topicId] = imgs;
				}

				wx.ready(function () {
					wx.previewImage({
						current: $me.attr('data-src'),
						urls: imgs
					 });
				});
			});
			
			$('.filter-item').click(function(e) {
				e.preventDefault();
				
				var $content = $('#content');
				if ($content.hasClass('loading')) {
					return;
				}
				me.filterType = $(this).attr('data-fs');
				me.topicPage = 1;
				me.currItem(me.filterType);
				
				$('#topics').html('');
				H.scroll.$scroll.refresh();
				
				me.fillTopics(true);
			});
			
			$('#btn-top').click(function(e) {
				e.preventDefault();
				
				H.scroll.$scroll.scrollToElement($('#wrapper').get(0), 200);
			});
			
			$(document).on('touchmove', function(e) {
				e.preventDefault();
			});
			
		},
		
		currItem: function(index) {
			$('#filter').find('.filter-item').removeClass('curr');
			$('#filter-' + index).addClass('curr');
		},
		
		updatepv: function() {
			var me = this;
			
			this.getpv();
			setInterval(function() {
				me.getpv();
			}, 5000);
		},
		
		getpv: function() {
			var me = this;
			window.callbackCountServicePvHander = function(data) {};
			getResult({
				url: 'log/serpv',
				jsonpCallback: 'callbackCountServicePvHander',
				success: function(data) {
					window['pvnum'] = data.c || 1;
					var num = me.format(window['pvnum'] + '');
					me.$pvtotal.length > 0 && me.$pvtotal.text(num).closest('.pv').removeClass('none');
				}
			});
		},
		
		resize: function() {
			var height = $(window).height();
			$('body').css('height', height);
		},
		
		addStyle: function() {
			var height = $(window).height(),
				width = $(window).width() - 20 - 60,
				style = '<style>\
							.main { height: '+ height +'px; }\
							.preview-img { width: '+ width * 0.3 +'px; height: '+ width * 0.3 +'px; }\
							.imgs-col-1 .preview-img { width: '+ width * 0.5 +'px; height: '+ width * 0.5 +'px; }\
							.imgs-col-4 { width: '+ width * 0.7 +'px; }\
						</style>';
			$('head').append(style);
		},
		
		fillTopics: function(loading, complete) {
			var me = this, $content = $('#content');
			
			$content.addClass('loading');
			getResult({
				url: 'twoSessions/friends/topics/list',
				data: {
					fs: me.filterType,
					page: me.topicPage,
					ps: me.pageSize,
					op: openid
				}, 
				loading: loading, 
				jsonpCallback: 'callbackTwoSessionsFriendsTopicsHandler',
				complete: function(data) {
					complete && complete(data);
					$content.removeClass('loading');
				},
				success: function(data) {
					me.topicPage ++;
					
					var items = data.items || [],
						len = items.length;
					
					if (len > 0) {
						var $ul = $content.find('ul.topics');
						
						if ($ul.length == 0) {
							$content.prepend('<ul class="topics" id="topics"></ul>');
						}
						$content.find('ul.topics').append(me.topicTpl(items));
					}
					
					me.canLoadMore = len >= me.pageSize;
					if (me.topicPage == 1 || len > 0) {
						H.scroll.$scroll.refresh();
					}
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
							t._('</div>')
							._('<div class="ctrl">')
								._('<a href="#" class="btn-zan '+ zaned +'"><i></i><span>已有<em>'+ items[i].pc +'</em>个赞</span></a>')
							._('</div>');
							
						t._('</div>')
					._('</div>')
				._('</li>');
			}
			
			return t.toString();
		},
		
		format: function(num) {
			return (num + '').replace(/(\d)(?=(\d{3})+$)/g, "$1,");  
		}
	};
	
	H.openjs = {
		init: function() {
			window.callbackJsapiTicketHandler = function(data) {};
			$.ajax({
				type: 'GET',
				url: domain_url + 'mp/jsapiticket',
				data: {
					appId: shaketv_appid
				},
				async: true,
				dataType: 'jsonp',
				jsonpCallback: 'callbackJsapiTicketHandler',
				success: function(data){
					if (data.code !== 0) {
						return;
					}
					
					var nonceStr = 'F7SxQmyXaFeHsFOT',
						timestamp = new Date().getTime(),
						url = window.location.href.split('#')[0],
						signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);

					wx.config({
						debug: false,
						appId: shaketv_appid,	
						timestamp: timestamp,
						nonceStr: nonceStr,
						signature: signature,
						jsApiList: [
							'previewImage'
						]
					});
				},
				error: function(xhr, type){
					// alert('获取微信授权失败！');
				}
			});
		}	
		
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
				if (H.index.canLoadMore && (this.directionY == 1 && this.y < (this.maxScrollY + 30)) && $pullup.hasClass('hidden')) {
					$pullup.removeClass('hidden');
					
					H.index.fillTopics(false, function() {
						$pullup.addClass('hidden');
					});
			    }
			});
		}

	};
	
})(Zepto);

var init = function() {
	H.index.init();
	
	if (openid) {
		recordUserPage(openid, $('title').html(), "");
	}
};