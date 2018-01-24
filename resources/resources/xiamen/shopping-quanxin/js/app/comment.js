/**
 * 购物提问
 */
(function($) {

	H.comment = {
		$submit : $('#submit'),
		$input : $('#input'),
		$askList : $('.ask-list ul'),
		$more : $('.more'),

		uid: getQueryString('ituid'),
		pageSize : 50,
		maxid : 0,
		minid : 0,

		lastContent : '',

		init: function() {
			this.resize();
			getResult('api/comments/room/?rand=' + Math.random(), {
				ps: this.pageSize,
				anys: this.uid,
				maxid: this.maxid
			}, 'callbackShopMallItemDetail', true);



			this.$submit.click(function(){
				var content = $.trim(H.comment.$input.val());
				if(content.length <= 0){
					alert('提问不能为空哦');
					return;
				}

				H.comment.lastContent = content;
				getResult('api/comments/save/', {
					co: encodeURIComponent(content),
					op: openid,
					tid: H.comment.uid,
					ty: 1,
					nickname: encodeURIComponent(nickname),
					headimgurl: headimgurl
				}, 'callbackCommentsSave', true);
			});

			this.$more.click(function(){
				getResult('api/comments/pervious/', {
					ps: H.comment.pageSize,
					anys: H.comment.uid,
					minid: H.comment.minid
				}, 'callbackCommentsPervious', true);
			});
		},

		initComment: function(data){
			console.log(data)
			this.maxid = data.maxid;
			this.minid = data.minid;
			var t = simpleTpl();
			for(var i in data.items){
				t._('<li>')
					._('<section class="avatar">');
					if(data.items[i].hu){
						t._('<img src="'+data.items[i].hu+'">');
					}else{
						t._('<img src="./images/avatar.jpg">');
					}
					t._('</section>')
					._('<section class="detail">');
						if(data.items[i].na){
							t._('<h2>'+data.items[i].na+'<span class="time"></span></h2>');
						}else{
							t._('<h2>匿名用户<span class="time"></span></h2>');
						}
						t._('<p>'+data.items[i].co+'</p>')
					._('</section>')
				._('</li>')
			}

			if(data.items.length >= this.pageSize){
				this.$more.removeClass('none');
			}else{
				this.$more.addClass('none');
			}

			this.$askList.append(t.toString());


		},

		submitSuccess: function(){
			var t = simpleTpl();
			t._('<li>')
				._('<section class="avatar">');
				if(headimgurl){
					t._('<img src="'+headimgurl+'">');
				}else{
					t._('<img src="./images/avatar.jpg">');
				}
				t._('</section>')
				._('<section class="detail">');
					if(nickname){
						t._('<h2>'+nickname+'<span class="time"></span></h2>');
					}else{
						t._('<h2>匿名用户<span class="time"></span></h2>');
					}
					t._('<p>'+this.lastContent+'</p>')
				._('</section>')
			._('</li>')

			this.$askList.prepend(t.toString());
			this.$input.val('');
			$('.empty').addClass('none');
			$('.main').scrollTop(0);
		},

		emptyComment: function(){
			var html = "<li class='empty'><section>暂时没有提问哦</section></li>"
			this.$askList.append(html);
		},

		resize: function(){
			var height = $(window).height() - 49;
			$('.main').css('height',height);
			$('.main').find('.ask-list').css('min-height',height - 60);
		}
	};

	W.callbackCommentsRoom = function(data) {
		if (data.code == 0) {
			H.comment.initComment(data);
		}else{
			H.comment.emptyComment();
		}
	};

	W.callbackCommentsSave = function(data){
		if(data.code == 0){
			H.comment.submitSuccess();
		}else{
			alert('网络错误，请稍后重试');
		}
	};

	W.callbackCommentsPervious = function(data){
		if (data.code == 0) {
			H.comment.initComment(data);
		}else{
			H.comment.$more.addClass('none');
		}
	};

	H.comment.init();

})(Zepto);