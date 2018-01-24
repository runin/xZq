(function($) {
	
	H.comment = {
		$content: $(".main"),
		$commentsWrapper: $('.barrage-wrapper'),
		$comments: $(".comments"),
		$inputWrapper: $(".comment-input-wrapper"),
		$input: $('#comment-input-text'),
		$submit: $('#submit'),
		$topic: $('.comment-topic'),
		$commentSuccess: $('.comment-success'),

		$tabRule: $('#rule'),
		$tabScore: $('#score'),
		
		$popBox: $(".pop-box"),

		pageSize: 50,
		maxid: 0,
		lastCommnet: '',

		init: function() {
			this.heightFn();
			this.openFn();
			//this.resize();
			this.bindBtn();
			getResult('api/comments/room',{
				ps : this.pageSize,
				maxid : this.maxid
			},'callbackCommentsRoom');
			
		},
		heightFn: function() {//计算高度
			var wh = $(window).height();
			$("body,.main-box,.pop-bg:before,.comment-box").css("height",wh);
		},
		openFn: function() {
			this.$popBox.removeClass("none");
			$(".comment-box").addClass("in-up");
			this.gohomeFn();
		},
		gohomeFn: function() {//返回
			$(".gohome").tap(function() {
				$(".comment-box").removeClass("in-up").addClass("out-down");
				setTimeout(function() {
					$(".pop-box").addClass("none");
					$(".comment-box").removeClass("out-down");
				},500);
			});
		},
		initComments: function(data){
			if(!W.barrage){
				this.initBarrage();
			}
			this.fillComments(data);
		},

		initBarrage: function(){
			W.barrage = this.$comments.barrage({ fontColor: ["FFFFFF"] });
			W.barrage.start(1);
		},

		fillComments: function(data){
			if(data.maxid){
				this.maxid = data.maxid;
			}
			
			for(var i in data.items){

				var t = simpleTpl();
				t._($('#tmpl_barrage').tmpl({
					'src': data.items[i].hu,
					'content': data.items[i].co
				}));

				W.barrage.pushMsg(t.toString());
			}
		},

		bindBtn: function(){ 
			$("#send").tap(function(e) {
				e.preventDefault();
				var val = H.comment.$input.val();
				if(val.length > 0){
					H.comment.lastCommnet = val;
					showLoading();
					getResult('api/comments/save',{
						co: encodeURIComponent(val),
                        op: openid,
                        tid: 'uuid',
                        ty: 2,
                        nickname: nickname ? encodeURIComponent(nickname) : "",
                        headimgurl: headimgurl ? headimgurl : ""
					},'callbackCommentsSave');
				}else{
					alert('内容不能为空哦~');
				}
			});
		},

		submitSuccess: function(){
			showTips('发送成功');
			this.$commentSuccess.removeClass('none');
			setTimeout(function(){
				H.comment.$commentSuccess.addClass('none');
			},1500);

			this.$input.val('');
			var t = simpleTpl();
			t._($('#tmpl_barrage').tmpl({
				'src': headimgurl,
				'content': this.lastCommnet
			}));

			W.barrage.appendMsg(t.toString());
		},

		fillTopic: function(data){
			if(data.items.length > 0){
				this.$topic.find('a')
					   .text(data.items[0].t)
					   .attr('href', data.items[0].c);

				this.$topic.find('.topic-img')
						   .attr('src', data.items[0].av)
						   .removeClass('none');

				this.$content.css('background-image','url("' + data.items[0].im + '")');
			}
		},

		resize: function(){
			var originWidth = this.$content.attr('origin-width');
			var originHeight = this.$content.attr('origin-height');
			var xRatio = originWidth / $(window).width();
			var yRatio = originHeight / $(window).height();
			var commentWrapperHeight = parseInt(this.$commentsWrapper.css('height'),10);
			var commentWrapperWidth = parseInt(this.$commentsWrapper.css('width'),10);
			var inputHeight = parseInt(this.$inputWrapper.css('height'),10);
			this.$comments.css('height',commentWrapperHeight - (inputHeight||0)).css('width',commentWrapperWidth);

			this.$commentSuccess.css({
				top : ($(window).height() - 70) / 2,
				left : ($(window).width() - 110) / 2
			});

			this.$input.val('');
		}
	};

	W.callbackCommentsRoom = function(data) {
		if(data.code == 0){
			H.comment.initComments(data);
		}

		setTimeout(function(){
			getResult('api/comments/room',{
				ps : H.comment.pageSize,
				maxid : H.comment.maxid,
			},'callbackCommentsRoom');
		}, 5000);
	};

	W.callbackCommentsSave = function(data){  
		hideLoading();
		if(data.code == 0){
			H.comment.submitSuccess();
		}else{
			alert('网络错误，请稍后重试');
		}
	};
	W.callbackCommentsTopicInfo = function(data){
		if(data.code == 0){
			H.comment.fillTopic(data);
		}
	}

	//H.comment.init();

})(Zepto);