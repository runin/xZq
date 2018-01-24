(function($) {
	
	H.comment = {
		$content: $(".content"),
		$comments: $(".comments"),
		$input: $('#input'),
		$submit: $('#submit'),

		pageSize: 50,
		maxid: 0,
		lastCommnet: '',

		init: function() {
			this.resize();
			this.bindBtn();
			getResult('api/comments/room',{
				ps : this.pageSize,
				maxid : this.maxid,
			},'callbackCommentsRoom');

			getResult('api/common/promotion',{
				oi : openid
			}, 'commonApiPromotionHandler');
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
					getResult('api/comments/save',{
						co: encodeURIComponent(val),
                        op: openid,
                        ty: 2,
                        nickname: nickname ? encodeURIComponent(nickname) : "",
                        headimgurl: headimgurl ? ( headimgurl + '/0' ) : ""
					},'callbackCommentsSave',true);
				}else{
					alert('内容不能为空哦~');
				}
			});
		},

		submitSuccess: function(){
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

			W.barrage.pushMsg(t.toString());
		},

		resize: function(){
			this.$content.css('height',$(window).height()).removeClass('none');
			this.$comments.css('height',$(window).height() - 69 -24).css('width',$(window).width());
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

	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			$('#tttj').html(data.desc).removeClass('none');
			$('#tttj').click(function(){
				location.href = data.url;
			});
		}else{
			$('#tttj').addClass('none');
		}
	};

	H.comment.init();

})(Zepto);