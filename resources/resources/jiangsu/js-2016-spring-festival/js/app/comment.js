(function($) {
	H.comment = {
		$commentScrolling: $(".index-comment-list"),
		$comments: $(".comment-list-wrapper"),
		$list: $("#comment_list"),
		$input: $('#comment_input'),
		$submit: $('#comment_submit'),
		$tabs: $('.nav-list-item'),
		$tmplComment: $('#tmpl_comment'),
		$tmplVoice: $('#tmpl_voice'),
		$tmplCommentEmpty: $('#tmpl_comment_empty'),

		curPage: 1,
		pageSize: 50,
		lastCommnet: '',
		lastType: 'text',
		totalHeight: 0,
		scrollerHeight: 0,
		isNewHeight: false,
		isLoading: false,
		isNoMore: false,
		praisedUid: 0,
		topicId: '',
		curDt: 1,
		curTab: 0,

		init: function() {
			this.resize();
			this.bindBtn();

			H.comment.fillCache(openid + LS_KEY_COMMENT_CACHE_QU);
			this.getList(this.curPage);
		},

		// 话题组件调用
		initTopic: function(topicId){
			H.comment.topicId = topicId;
			H.comment.init();
		},

		fillCache: function(key){
			var cache = localStorage.getItem(key);
			if(cache){
				try{
					var data = JSON.parse(cache);
					H.comment.initcomments(data);
					H.comment.$commentScrolling[0].scrollTop = 0;		
				}catch(e){
					console.log('error');
				}
			}
		},

		getList: function(page){
			H.comment.isLoading = true;
			if(H.comment.curTab == 2){
				// 时序贴
				getResult('api/comments/list', {
					page : page
				}, 'callbackCommentsApiList', null, null, null, 15000, function(){
					
				});
			}else if(H.comment.curTab == 1){
				// 好友帖
				getResult('api/comments/friends', {
					page : page,
					oi : openid
				}, 'callbackCommentsApiFriends', null, null ,null ,15000 , function(){
					
				});
			}else{
				// 精品帖
				getResult('api/comments/highQuality',{
					page: page
				},'callbackCommentsApiHighQuality', null, null, null , 15000, function(){
					
				});
			}
		},

		initcomments: function(data){
			
			if(data.items.length < this.pageSize){
				this.isNoMore = true;
			}
			var t = simpleTpl();
			for(var i in data.items){
				var isPraised = localStorage.getItem(openid + LS_KEY_COMMENT_PRAISED_PREFIX + data.items[i].uid);
				if(typeof(data.items[i].co) == 'object'){
					// 语音
					var voiceItem = data.items[i].co;
					var duration = Math.floor(voiceItem.duration / 1000);

					var size = duration / 30 * 100;
					if(size < 20){
						size = 20;
					}else if(size >= 90){
						size = 90;
					}

					if(isPraised && data.items[i].pc == 0){
						data.items[i].pc = 1;
					}


					t._(H.comment.$tmplVoice.tmpl({
						'name': data.items[i].na,
						'src': data.items[i].hu,
						'content': data.items[i].co,
						'praised': isPraised ? 'praised' : '',
						'uid': data.items[i].uid,
						'pcshow': (H.comment.curTab == 1) ? 'none' : '',
						'pc': data.items[i].pc,
						'duration': (duration == 0 ? 1 : duration) + '\"',
						'vid': voiceItem.serverId,
						'size': 'width: ' + size + '%',
						'length': voiceItem.duration,
						'vip': data.items[i].sc > 0 ? '' : 'none'
					}));
				}else{

					if(isPraised && data.items[i].pc == 0){
						data.items[i].pc = 1;
					}
					// 文字
					t._(H.comment.$tmplComment.tmpl({
						'name': xssEscape(data.items[i].na),
						'src': data.items[i].hu,
						'content': xssEscape(data.items[i].co),
						'praised': isPraised ? 'praised' : '',
						'uid': data.items[i].uid,
						'pcshow': (H.comment.curTab == 1) ? 'none' : '',
						'pc': data.items[i].pc,
						'vip': data.items[i].sc > 0 ? '' : 'none'
					}));
				}
			}

			if(H.comment.curPage == 1){
				this.$list.empty();				
			}

			this.$list.append(t.toString());
			this.bindPraise();
			this.bindVoice();
			this.isNewHeight = true;
			H.comment.emptyComments();
		},

		emptyComments: function(){
			if(this.$list.find('.comment-list-item').length == 0){
				this.$list.html(H.comment.$tmplCommentEmpty.tmpl());
			}else{
				this.$list.find('.comment-list-empty').remove();
			}
		},

		bindPraise: function(){
			this.$list.find('.comment-list-agree').unbind('tap');
			this.$list.find('.comment-list-agree').tap( function(){
				if(!$(this).parents('.comment-list-item').hasClass('praised')){
					showLoading(null, '点赞发送中');
					H.comment.praisedUid = $(this).attr('uid');
					getResult('api/comments/praise', {
						uid : $(this).attr('uid'),
						oi : openid
					}, 'callbackCommentsApiPraise', null, null, null, 15000, function(){
						hideLoading();
						showTips('点赞成功');
						$item = H.comment.$list.find('.comment-list-agree[uid="'+H.comment.praisedUid+'"] .comment-list-mark');
						var num = parseInt($item.html(), 10);
						$item.html(++num).parent().addClass('praised');
						$item.parents('.comment-list-item').addClass('praised');

						localStorage.setItem(openid + LS_KEY_COMMENT_PRAISED_PREFIX + H.comment.praisedUid, true);
					});
				}
			});
		},

		bindVoice: function(){
			this.$list.find('.comment-voice-detail').unbind('tap');
			this.$list.find('.comment-voice-detail').tap( function(){
				var curItem = this
				var vid = $(curItem).attr('data-vid');
				H.voice.playVoice(vid);

				H.comment.$list.find('.comment-voice-detail').removeClass('active');
				$(curItem).addClass('active');
				var timeOut = $(this).attr('data-len');
				setTimeout(function(){
					$(curItem).removeClass('active');
				}, timeOut);
			});
		},

		bindBtn: function(){
			this.$submit.tap(function(){
				var val = H.comment.$input.val();
				if(val.length > 0){
					H.comment.lastType = 'text';
					H.comment.lastCommnet = val;
					showLoading();

					var option = {
						co: encodeURIComponent(val),
                        oi: openid,
                        nn: nickname ? encodeURIComponent(nickname) : "",
                        hu: headimgurl ? headimgurl : ""
					}

					getResult('api/comments/save', option, 'callbackCommentsApiSave', null, null, null, 15000, function(){
						hideLoading();
						if(H.comment.lastType == 'text'){
							H.comment.submitSuccess({uid:0});
						}else{
							H.voice.submitVoiceSuccess({uid:0});	
						}
					});
				}else{
					alert('内容不能为空哦~');
				}
			});
			
			this.$commentScrolling.scroll(function(){
			    var srollPos = H.comment.$commentScrolling.scrollTop();

			    if(H.comment.isNewHeight){
			    	H.comment.isNewHeight = false;
			    	H.comment.scrollerHeight = H.comment.$list.height();
			    }

				if (H.comment.scrollerHeight - H.comment.totalHeight - srollPos < 20 && !H.comment.isLoading && !H.comment.isNoMore) {
					H.comment.getList(H.comment.curPage);
			    }

			    return false;
			});

			$('#btn_time').tap(function(){
				H.comment.$tabs.removeClass('active');
				$(this).addClass('active');
				H.comment.$list.empty();

				H.comment.curPage = 1;
				H.comment.curTab = 2;
				
				H.comment.isNoMore = false;
				H.comment.getList(H.comment.curPage);

				H.comment.fillCache(openid + LS_KEY_COMMENT_CACHE_TIME);
			});

			$('#btn_friend').tap(function(){
				H.comment.$tabs.removeClass('active');
				$(this).addClass('active');
				H.comment.$list.empty();

				H.comment.curPage = 1;
				H.comment.curTab = 1;
				H.comment.isNoMore = false;
				H.comment.getList(H.comment.curPage);

				H.comment.fillCache(openid + LS_KEY_COMMENT_CACHE_FRIEND);
			});

			$('#btn_zan').tap(function(){
				H.comment.$tabs.removeClass('active');
				$(this).addClass('active');
				H.comment.$list.empty();
				
				H.comment.curPage = 1;
				H.comment.curTab = 0;
				
				H.comment.isNoMore = false;
				H.comment.getList(H.comment.curPage);

				H.comment.fillCache(openid + LS_KEY_COMMENT_CACHE_QU);
			});

		},

		submitSuccess: function(data){
			showTips('发送成功');
			var value = this.$input.val();
			this.$input.val('');
			
			var t = simpleTpl();
			
			t._(H.comment.$tmplComment.tmpl({
				'name': nickname ? nickname : '匿名用户',
				'src': headimgurl ? headimgurl : './images/avatar.jpg',
				'content': value,
				'praised': 0,
				'uid': data.uid,
				'pcshow': (H.comment.curTab == 1) ? 'none' : '',
				'pc': 0,
				'vip': 'none'
			}));

			if(H.comment.curTab == 0){
				this.$list.append(t.toString());
				this.$commentScrolling[0].scrollTop = 99999;	
			}else{
				this.$list.prepend(t.toString());
				this.$commentScrolling[0].scrollTop = 0;
			}
			

			this.bindPraise();
			H.comment.emptyComments();
		},

		resize: function(){
			H.comment.totalHeight = parseFloat(H.comment.$commentScrolling.css('height'));
		}
	};

	H.topic = {
		$topicContent: $('#topic_content'),

		init: function(){
			getResult('api/comments/topic/round',{}, 'callbackCommentsTopicInfo', null, null, null, 15000, function(){
				H.topic.initDefaultTopic();
				H.comment.init();
			});
		},

		initTopic: function(data){
			if(data.items.length > 0){
				H.topic.$topicContent.text(data.items[0].t);
			}else{
				H.topic.initDefaultTopic();
			}
		},

		initDefaultTopic: function(){
			H.topic.$topicContent.text(defaultTopic);
		}
	};

	W.callbackCommentsTopicInfo = function(data){
		if(data.code == 0 && data.items){
			H.topic.initTopic(data);
			H.comment.initTopic(data.items[0].uid);
		}else{
			H.topic.initDefaultTopic();
			H.comment.init();
		}
	};
	 

	W.callbackCommentsApiSave = function(data){
		hideLoading();
		if(data.code == 0){
			if(H.comment.lastType == 'text'){
				H.comment.submitSuccess(data);
			}else{
				H.voice.submitVoiceSuccess(data);	
			}
			
		}else{
			alert('网络错误，请稍后重试');
		}
	};

	W.callbackCommentsApiPraise = function(data){
		hideLoading();
		if(data.code == 0){
			showTips('点赞成功');
			$item = H.comment.$list.find('.comment-list-agree[uid="'+H.comment.praisedUid+'"] .comment-list-mark');
			var num = parseInt($item.html(), 10);
			$item.html(++num).parent().addClass('praised');
			$item.parents('.comment-list-item').addClass('praised');

			localStorage.setItem(openid + LS_KEY_COMMENT_PRAISED_PREFIX + H.comment.praisedUid, true);
		}else{
			showTips('大家点赞热情太高啦，请稍后再试~');
		}
	};

	W.callbackCommentsApiHighQuality = function(data){
		H.comment.isLoading = false;
		if(data.code == 0){
			if(H.comment.curPage == 1){
				localStorage.setItem(openid + LS_KEY_COMMENT_CACHE_QU, JSON.stringify(data));
			}

			H.comment.initcomments(data);
			H.comment.curPage++;
		}else{
			H.comment.emptyComments();
		}
	};

	W.callbackCommentsApiFriends =  function(data){
		H.comment.isLoading = false;
		if(data.code == 0){
			if(H.comment.curPage == 1){
				localStorage.setItem(openid + LS_KEY_COMMENT_CACHE_FRIEND, JSON.stringify(data));
			}

			H.comment.initcomments(data);
			H.comment.curPage++;
		}else{
			H.comment.emptyComments();
		}
	};

	W.callbackCommentsApiList = function(data) {
		H.comment.isLoading = false;
		if(data.code == 0){
			if(H.comment.curPage == 1){
				localStorage.setItem(openid + LS_KEY_COMMENT_CACHE_TIME, JSON.stringify(data));
			}

			H.comment.initcomments(data);
			H.comment.curPage++;
		}else{
			H.comment.emptyComments();
		}
	};

})(Zepto);