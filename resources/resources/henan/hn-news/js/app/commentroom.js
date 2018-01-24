(function($) {
	
	H.commentroom = {
		$commentroomsWrapper: $('.commentroom-wrapper'),
		$commentrooms: $(".commentrooms"),
		$list: $(".commentrooms .commentrooms-list"),
		$inputWrapper: $(".commentrooms-input-wrapper"),
		$input: $('#commentroom_input'),
		$submit: $('#commentroom_submit'),

		curPage: 1,
		pageSize: 10,
		lastCommnet: '',
		totalHeight: 0,
		scrollerHeight: 0,
		isNewHeight: false,
		isLoading: false,
		isNoMore: false,
		praisedUid: 0,
		topicId: '',
		bannerRatio: 1242 / 785,

		init: function() {
			this.resize();
			this.bindBtn();
			this.getList(this.curPage);
			this.curPage++;
			
		},

		// 话题组件调用
		initTopic: function(topicId){
			H.commentroom.topicId = topicId;
			H.commentroom.init();
		},

		getList: function(page){
			H.commentroom.isLoading = true;
			getResult('api/comments/list',{
				page: page,
				ps : this.pageSize,
				op: openid,
				dt: 1,
				zd: 0,
				anys: H.commentroom.topicId
			},'callbackCommentsList');
		},

		initcommentrooms: function(data){
			
			if(data.items.length < this.pageSize){
				this.isNoMore = true;
			}

			var t = simpleTpl();
			for(var i in data.items){
				t._($('#tmpl_commentroom').tmpl({
					'name': data.items[i].na,
					'src': data.items[i].hu,
					'content': data.items[i].co,
					'praised': data.items[i].isp == false ? '' : 'praised',
					'uid': data.items[i].uid,
					'pc': data.items[i].pc
				}));
			}
			this.$list.append(t.toString());
			this.bindPraise();

			if(this.isNoMore){
				this.$list.append('<section class="citem-no-more"></section>');
			}

			this.isNewHeight = true;
		},

		bindPraise: function(){
			this.$list.find('.citem-praise').unbind('click');
			this.$list.find('.citem-praise').bind('click', function(){
				if(!$(this).hasClass('praised')){
					showLoading(null, '点赞发送中');
					H.commentroom.praisedUid = $(this).attr('uid');
					getResult('api/comments/praise', {
						uid : $(this).attr('uid'),
						op : openid
					}, 'callbackCommentsPraise');
				}
			});
		},

		bindBtn: function(){
			this.$submit.click(function(){
				var val = H.commentroom.$input.val();
				if(val.length > 0){
					H.commentroom.lastCommnet = val;
					showLoading();

					var option = {
						co: encodeURIComponent(val),
                        op: openid,
                        tid: 'uuid',
                        ty: 2,
                        nickname: nickname ? encodeURIComponent(nickname) : "",
                        headimgurl: headimgurl ? headimgurl : ""
					}

					if(H.commentroom.topicId != ''){
						option.ty = 1;
						option.tid = H.commentroom.topicId;
					}else{
						option.ty = 2;
					}

					getResult('api/comments/save', option, 'callbackCommentsSave');
				}else{
					alert('内容不能为空哦~');
				}
			});
			
			this.$commentrooms.scroll(function(){
			    var srollPos = H.commentroom.$commentrooms.scrollTop();
			    if(H.commentroom.isNewHeight){
			    	H.commentroom.isNewHeight = false;
			    	H.commentroom.scrollerHeight = H.commentroom.$list.height();
			    }

				if (H.commentroom.scrollerHeight - H.commentroom.totalHeight - srollPos < 10 && !H.commentroom.isLoading && !H.commentroom.isNoMore) {
					H.commentroom.getList(H.commentroom.curPage);
					H.commentroom.curPage++;
			    }

			    return false;
			});
		},

		submitSuccess: function(data){
			showTips('发送成功');
			var value = this.$input.val();
			this.$input.val('');
			
			$('.citem-no-more').addClass('none');
			var t = simpleTpl();
			
			t._($('#tmpl_commentroom').tmpl({
				'name': nickname ? nickname : '匿名用户',
				'src': headimgurl ? headimgurl : './images/avatar.jpg',
				'content': value,
				'praised': 0,
				'uid': data.uid,
				'pc': 0
			}));
			this.$list.append(t.toString());
			this.bindPraise();
			
			// console.log($('.commentrooms').length);
			$('.commentrooms')[0].scrollTop = $('.commentrooms-list').height();
		},

		resize: function(){
			var width = $(window).width();
			var height = $(window).height();

			var bannerHeight = width / this.bannerRatio;
			var topbarHeight = 40;
			var commentHeight = height - bannerHeight - topbarHeight - 5;

			this.$commentroomsWrapper.css({
				height: commentHeight
			});
			
			this.totalHeight = commentHeight - 44;
			this.$commentrooms.css('height', this.totalHeight).css('width',width);
			this.$input.val('');
		}
	};

	H.topic = {
		$cover: $('#comment_cover'),
		init: function(){
			getResult('api/comments/topic/round',{}, 'callbackCommentsTopicInfo');
		},

		initTopic: function(data){
			if(data.items.length > 0){
				this.$cover.attr('src', data.items[0].im);	
			}
		}
	};

	W.callbackCommentsTopicInfo = function(data){
		if(data.code == 0 && data.items){
			H.topic.initTopic(data);
			H.commentroom.initTopic(data.items[0].uid);
		}else{
			showTips('暂无话题');
		}
	};

	W.callbackCommentsList = function(data) {
		H.commentroom.isLoading = false;
		if(data.code == 0){
			H.commentroom.initcommentrooms(data);
		}else{
			if($('.citem-no-more').length == 0){
				H.commentroom.$list.append('<section class="citem-no-more"></section>');	
			}
		}
	};

	W.callbackCommentsSave = function(data){
		hideLoading();
		if(data.code == 0){
			H.commentroom.submitSuccess(data);
		}else{
			alert('网络错误，请稍后重试');
		}
	};

	W.callbackCommentsPraise = function(data){
		hideLoading();
		if(data.code == 0){
			showTips('点赞成功');
			$item = H.commentroom.$list.find('.citem-praise[uid="'+H.commentroom.praisedUid+'"] .pc-num');
			var num = parseInt($item.html(), 10);
			$item.html(++num).parent().addClass('praised');
			$item.parents('.citem').addClass('praised');
		}else{
			showTips('网络不给力，请稍后重试');
		}
	};

	$(function(){
		H.topic.init();
	});

})(Zepto);