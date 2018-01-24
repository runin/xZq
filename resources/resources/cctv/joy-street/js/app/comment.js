(function($) {
	
	H.comment = {
		$content: $(".main"),
		$comments: $(".comments"),
		$input: $('#input'),
		$submit: $('#submit'),
		$topic: $('.comment-topic'),
		$commentSuccess: $('.comment-success'),

		$tabRule: $('#rule'),
		$tabScore: $('#score'),

		pageSize: 50,
		maxid: 0,
		lastCommnet: '',

		init: function() {
			H.rule.init();
			
			this.resize();
			this.bindBtn();
			getResult('api/comments/room',{
				ps : this.pageSize,
				maxid : this.maxid,
			},'callbackCommentsRoom');

			getResult('api/comments/topic/round',null,'callbackCommentsTopicInfo');
			
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
				t._('<section class="bitem">')
					._('<section class="bitem-img">');
						if(data.items[i].hu){
							t._('<img src="'+data.items[i].hu+'" onerror="this.src=\'./images/avatar.jpg\'" />');
						}else{
							t._('<img src="./images/avatar.jpg" />');
						}
					t._('</section>')
					._('<section class="bitem-content">')
						._('<p>'+data.items[i].co+'</p>')
					._('</section">')
				._('</section>');

				W.barrage.pushMsg(t.toString());
			}
		},

		bindBtn: function(){
			this.$submit.click(function(){
				var val = H.comment.$input.val();
				if(val.length > 0){
					H.comment.lastCommnet = val;
					showNewLoading();
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
			this.$commentSuccess.removeClass('none');
			setTimeout(function(){
				H.comment.$commentSuccess.addClass('none');
			},1500);

			this.$input.val('');
			var t = simpleTpl();
			t._('<section class="bitem new">')
				._('<section class="bitem-img">');
					if(headimgurl){
						t._('<img src="'+headimgurl+'/0" onerror="this.src=\'./images/avatar.jpg\'" />');
					}else{
						t._('<img src="./images/avatar.jpg" />');
					}
				t._('</section>')
				._('<section class="bitem-content">')
					._('<p>'+this.lastCommnet+'</p>')
				._('</section">')
			._('</section>');

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
			this.$content.css('height',$(window).height()).removeClass('none');
			this.$comments.css('height',$(window).height() - 45 - 70).css('width',$(window).width());

			this.$commentSuccess.css({
				top : ($(window).height() - 70) / 2,
				left : ($(window).width() - 110) / 2
			});
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
		hideNewLoading();
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

	H.comment.init();

})(Zepto);