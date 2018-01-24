(function($) {
	H.talk = {
		topicId: getQueryString('tid'),
		$pvtotal: $('#pvtotal'),
		$loadmore: $('#loadmore'),
		topicPage: 1,
		cmtPage: 2,
		pageSize: 10,
		cmtPageSize: 20,
		range: 180,
		totalheight: 0,
		canLoadMore: false,
		filterType: getQueryString('fs') || 0,
			/*window['shaketv'] && shaketv.wxShare(headimgurl+"/"+yao_avatar_size, nickname+"分享育儿心得",title, H.talk.getShareUrl(openid));*/
		init: function() {
			if(getQueryString('st')=="true" &&getQueryString('openid')){//
				var title = "《超级育儿师》";
				var headimgurl = $.fn.cookie(mpappid + '_headimgurl');
				window['shaketv'] && shaketv.wxShare(headimgurl+"/"+yao_avatar_size, nickname+"分享育儿心得",title, H.talk.getShareUrl(openid));
			}
			
			var href = window.location.href;
			if (href.indexOf('talk.html') > -1) {
				this.topicId = null;
			} 
			if (href.indexOf('subject.html') > -1) {
				this.topicId = null;
			} else if (href.indexOf('comments.html') > -1 && !this.topicId) {
				window.location.href = 'subject.html';
				return;
			}
			
			$('#main').removeClass('none');
			var headimgurl = $.fn.cookie(mpappid + '_headimgurl');
			$('#avatar').find('img').attr('src', headimgurl ? (headimgurl + '/' + yao_avatar_size) : './images/lottery.png');
			$('#myname').text($.fn.cookie(mpappid + '_nickname') || '匿名');
			
			H.scroll.init();
			this.resize();
			this.addStyle();
			var realopenid = getQueryString("realopenid");
			var tid = getQueryString("tid");
				if (realopenid == null || realopenid == "" || typeof(realopenid) == "undefined")
			{	
				if (this.topicId) {
				this.fillTopic();
				} else {
				this.fillTopics(true);
				}
				
			}else{
				
				this.fillTopics(true);
			}
			
			this.updatepv();
			this.event();
			H.openjs.init();
			window['shaketv'] && shaketv.subscribe(follow_shaketv_appid, function(returnData){
				//alert('shaketv subscribe: ' + JSON.stringify(returnData));
			});
		},
		getShareUrl:function(stuuid){
			var url = window.location.href;
			url = add_param(url.replace(/[^\/]*\.html/i, 'subject.html'), 'realopenid', hex_md5(openid), true);
			url = add_param(url, 'realopenid', openid, true);
			url = delQueStr(url, "stuuid");
			url = delQueStr(url, "openid");
//			url = delQueStr(url, "headimgurl");
			url = delQueStr(url, "nickname");
			url = delQueStr(url, "st");
			url = delQueStr(url, "stuuid");
	/*		alert(url);*/
			return add_yao_prefix(url);
			
		},event: function() {
			var me = this,
				$body = $('body');
			//delegate方法，用来绑定某个（某类）对象下的子对象，为子对象绑定方法
			$('#content').delegate('.comment', 'click', function(e) {
				var name = $(this).find('a'). text(),
					cmtId = $(this).attr('data-id'),
					topicId = $(this).closest('.topic').attr('data-id');
				me.comment(name, topicId, cmtId);
			}).delegate('.btn-cmt', 'click', function(e) {
				e.preventDefault();
				var $topic = $(this).closest('.topic'),
					name = $topic.siblings('.nickname').text(),
					topicId = $topic.attr('data-id'),
					cmtId = '';
				me.comment(name, topicId, cmtId);
			}).delegate('.btn-zan', 'click', function(e) {
				e.preventDefault();
				if ($(this).hasClass('zaned')) {
					return;
				}
				if (!openid) {
					alert('无法获得您的头像和昵称，暂无法点赞。请您重新进入后授权获取');
					return;
				}
				var $me = $(this),
					zan = parseInt($me.text()) || 0,
					topicId = $me.closest('.topic').attr('data-id');
				$me.addClass('zaned animated').find('span').text(zan + 1);
				getNewResult({
					url: 'twoSessions/friends/topics/praise',
					data: {
						uid: topicId,
						op: openid,
						dev:'wzz-superchild'
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
			}).delegate('.voices', 'click', function(e) {
				e.preventDefault();
				var $tg = $(this),
					$audio = $(this).find('audio');
				if ($tg.hasClass('scale')) {
					return;
				}
				$tg.addClass('scale');
				$audio.get(0).play();
				$audio.on('playing', function() {
					console.log('playing')
				}).on('ended', function() {
					console.log('ended');
					$audio.get(0).pause();
					$tg.removeClass('scale');
				});
			});
			$('#btn-filter').click(function(e) {
				e.preventDefault();
				
				$('#filter-items').toggleClass('none');
			});
				$('#btn-back').click(function(e) {
				e.preventDefault();
				window.location.href = 'talk.html';
			});
			$body.click(function(e) {
				if (me.topicId) {
					return;
				}
				if (!$(e.target).hasClass('btn-filter')) {
					$('#filter-items').addClass('none');
				}
				var $tg = $(e.target);
				if ($tg.hasClass('c-box') || $tg.closest('.c-box').length > 0) {
					return;
				}
				$('#input-cmt').blur();
				$body.removeClass('body-cmt');
			});
			$('#btn-top').click(function(e) {
				e.preventDefault();
				H.scroll.$scroll.scrollToElement($('#wrapper').get(0), 200);
			});
			$('#btn-send').click(function(e) {
				var $input = $('#input-cmt'),
					cmt = $.trim($input.val()),
					tid = $input.attr('data-tid'),
					cid = $input.attr('data-cid'),
					nickname = $.fn.cookie(mpappid + '_nickname');
				if (!openid) {
					alert('无法获得您的头像和昵称，暂无法评论。请您重新进入后授权获取');
					return;
				}
				if (!cmt) {
					alert('先说点什么吧~');
					$input.focus();
					return;
				}
				if (cmt.length > 200) {
					alert('评论贵精不贵多哦~')
					$input.focus();
					return;
				}
				getNewResult({
					url: 'comments/save',
					data: {
						co: encodeURIComponent(cmt),
						op: openid,
						tid: tid,
						ty: 1,
						pa: cid,
						dev:'wzz-superchild',
						nickname: encodeURIComponent(nickname),
						headimgurl: $.fn.cookie(mpappid + '_headimgurl')
					},
					loading: true,
					jsonpCallback: 'callbackCommentsSave',
					bindUI: $(this),
					complete: function(data) {
						$('body').removeClass('body-cmt');
						var $topic = $('#msg-' + tid),
							$btncmt = $topic.find('.btn-cmt'),
							cmtCount = parseInt($btncmt.text()),
							name = $input.attr('data-name'),
							replyTxt = cid ? ('回复<a>'+ name +'</a>') : '',
							comment = '<li class="comment c-box" data-id="'+ data.tid +'"><a>'+ (nickname || '匿名') +'</a>'+ replyTxt +':<span>'+ cmt +'</span></li>';
						$topic.find('ul').append(comment).closest('.comments').removeClass('none');
						$btncmt.find('span').text(cmtCount + 1);
					},
					success: function(data) {
						if (data.code != 0) {
							alert(data.message);
						}
					}
				});
			});

			$(document).on('touchmove', function(e) {
				e.preventDefault();
			});
		},
		audioReady: function($audio) {
			if ($audio && $audio.length > 0) {
				$audio.on('loadedmetadata', function() {
					console.log('audio data...')
					$(this).siblings('span').text(Math.ceil($(this).get(0).duration) + "'");
					$(this).get(0).pause();
				});
			}
		},
		comment: function(name, topicId, cmtId) {
			if (!openid) {
				alert('无法获得您的头像和昵称，暂无法评论。请您重新进入后授权获取');
				return;
			}
			$('body').addClass('body-cmt');
			var $input = $('#cmt-box').find('input').val(''); 
			$input.attr('data-tid', topicId).attr('data-cid', cmtId)
					   .attr('data-name', name)
					   .attr('placeholder', '回复' + name + ':');
			
			setTimeout(function() {
				$input.focus();
			}, 200);
		},
		updatepv: function() {
			var me = this;
			//this.getpv();
			setInterval(function() {
				//me.getpv();
			}, 5000);
		},
		getpv: function() {
			var me = this;
			window.callbackCountServicePvHander = function(data) {};
			getNewResult({
				url: 'log/serpv',
				jsonpCallback: 'callbackCountServicePvHander',
				success: function(data) {
					window['pvnum'] = data.c || 1;
					var num = me.format(window['pvnum'] + '');
					me.$pvtotal.length > 0 && me.$pvtotal.text(num).closest('.pv').removeClass('none');
					window['shaketv'] && shaketv.wxShare(share_img, H.share.getTitle(), share_desc, H.share.getUrl());
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
							.body-cmt .main { height: '+ (height ) +'px; }\
							.preview-img { width: '+ width * 0.3 +'px; height: '+ width * 0.3 +'px; }\
							.imgs-col-1 .preview-img { width: '+ width * 0.5 +'px; height: '+ width * 0.5 +'px; }\
							.imgs-col-4 { width: '+ width * 0.7 +'px; }\
						</style>';
			$('head').append(style);
		},
		fillTopic: function() {
			var me = this;
			window.callbackTwoSessionsFriendsTopicsDetailHandler = function(data) {};
			getNewResult({
				url: 'twoSessions/friends/topics/detail',
				data: {
					uid: me.topicId,
					ps: me.cmtPageSize,
					dev:'wzz-superchild'
				}, 
				loading: true, 
				jsonpCallback: 'callbackTwoSessionsFriendsTopicsDetailHandler',
				success: function(data) {
					if (data.code != 0) {
						return;
					}
					var $tpl = $('<ul>'+ me.topicTpl([data]) +'</ul>');
					$tpl.find('li').removeClass('none');
					$('#content').prepend($tpl);
					me.audioReady($tpl.find('audio'));
					$('#input-cmt').attr('placeholder', '回复'+ data.p +':').attr('data-tid', data.uid);
					$('body').addClass('body-cmt');
					H.scroll.$scroll.refresh();
					me.canLoadMore = (data.comments || []).length >= me.cmtPageSize;
					var title = "《超级育儿师》";
					window['shaketv'] && shaketv.wxShare(headimgurl+"/"+yao_avatar_size, nickname+"分享育儿心得",title, H.talk.getShareUrl(openid));
					/*window['shaketv'] && shaketv.wxShare(share_img, H.share.getTitle(), share_desc, H.share.getUrl());*/
				}
			});
		},
		fillTopics: function(loading, complete) {
			var me = this;
		var realopenid = getQueryString("realopenid");
			if (realopenid == null || realopenid == "" || typeof(realopenid) == "undefined"){
			getNewResult({
				url: 'twoSessions/friends/topics/selfrecord',
				data: {
					page: me.topicPage,
					ps: me.pageSize,
					op: openid,
					/*fs: me.filterType,*/
					dev:'wzz-superchild'
				}, 
				loading: loading, 
				jsonpCallback: 'callbackTwoSessionsFriendsTopicsSelfHandler',
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
						me.audioReady($tpl.find('audio'));
					}
					
					me.canLoadMore = len >= me.pageSize;
					if (me.topicPage == 1 || len > 0) {
						H.scroll.$scroll.refresh();
					}
					var title = "《超级育儿师》";
					window['shaketv'] && shaketv.wxShare(headimgurl+"/"+yao_avatar_size, nickname+"分享育儿心得",title, H.talk.getShareUrl(openid));
				}
			});
			}else{
				getNewResult({
				url: 'twoSessions/friends/topics/selfrecord',
				
				data: {
					page: me.topicPage,
					ps: me.pageSize,
					op: realopenid,
					/*fs: me.filterType,*/
					dev:'wzz-superchild'
				}, 
				loading: loading, 
				jsonpCallback: 'callbackTwoSessionsFriendsTopicsSelfHandler',
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
						me.audioReady($tpl.find('audio'));
					}
					
					me.canLoadMore = len >= me.pageSize;
					if (me.topicPage == 1 || len > 0) {
						H.scroll.$scroll.refresh();
					}
				}
			});
			}
		},
		fillCmt: function(topicId, complete) {
			var me = this;
			getNewResult({
				url: 'comments/twoSessions/friend/topics',
				data: {
					anyUid: topicId,
					page: me.cmtPage,
					ps: me.cmtPageSize,
					dev:'wzz-superchild'
				}, 
				jsonpCallback: 'callbackCommentsTwoSessionsHandler',
				complete: function(data) {
					complete && complete(data);
				},
				success: function(data) {
					me.cmtPage ++;
					if (data && data.items) {
						me.canLoadMore = data.items.length >= me.cmtPageSize;
						
						$('#msg-' + topicId).find('ul').append(me.cmtDetailTpl(data.items));
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
							
							t._(this.cmtTpl(comments, items[i].uid, items[i].cc));
							
						t._('</div>')
					._('</div>')
				._('</li>');
			}
			return t.toString();
		},
		cmtTpl: function(items, topicId, cmtCount) {
			var t = simpleTpl(),
				items = items || [],
				rest = cmtCount - 5,
				hasMore = rest > 0 ?  'hasmore' : '',
				len = items.length;
			t._('<div class="comments '+ hasMore + (len == 0 ? 'none' : '') + '">')
				._('<ul>');
					for (var i = 0; i < len; i ++) {
						var replyTxt = items[i].pna ? ('回复<a>'+ items[i].pna +'</a>') : '';
						if (this.topicId || (!this.topicId && i < 5)) {
							t._('<li class="comment c-box" data-id="'+ items[i].uid +'"><a>'+ items[i].na +'</a>'+ replyTxt +':<span>'+ items[i].co +'</span></li>');
						}						
					}
				t._('</ul>')
				._('<a href="comments.html?tid='+ topicId +'" class="btn-more">更多'+ rest +'条回复...</a>')
			._('</div>');
				
			return t.toString();
		},
		cmtDetailTpl: function(items) {
			var t = simpleTpl(),
				items = items || [];

			for (var i = 0, len = items.length; i < len; i ++) {
				var replyTxt = items[i].pna ? ('回复<a>'+ items[i].pna +'</a>') : '';
				t._('<li class="comment c-box" data-id="'+ items[i].uid +'"><a>'+ items[i].na +'</a>'+ replyTxt +':<span>'+ items[i].co +'</span></li>');
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
					appId: mpappid
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
						appId: mpappid,	
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
	
	H.share = {
		getUrl: function() {
			var href = window.location.href;
			href = add_param(href, 'resopenid', hex_md5(openid), true);
			href = add_param(href, 'from', 'share', true);
			return add_yao_prefix(href);
		},
		getTitle: function() {
			var nickname = $.trim($('.nickname').eq(0).text());
			if (H.talk.topicId && nickname) {
				nickname = nickname.split(' ')[0];
				return '我在和'+ nickname +'共议国事，还有'+ (window['pvnum'] || 1) +'人在一起探讨，你不加入？';
			} else {
				return '我已经和'+ (window['pvnum'] || 1) +'人一起加入了央视两会解码群策群力讨论，快来看看吧！';
			}
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
				if (H.talk.canLoadMore && (this.directionY == 1 && this.y < (this.maxScrollY + 30)) && $pullup.hasClass('hidden')) {
					$pullup.removeClass('hidden');
					if (H.talk.topicId) {
						H.talk.fillCmt(H.talk.topicId, function() {
							$pullup.addClass('hidden');
						});
					} else {
						H.talk.fillTopics(false, function() {
							$pullup.addClass('hidden');
						});
					}
			    }
			});
		}

	};
	
})(Zepto);
$(function() {
	H.talk.init();
	if (openid) {
		recordUserPage(openid, $('title').html(), "");
	}
});
