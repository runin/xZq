
//****//
//***评论***//

+(function($) {
	
	H.comment = {
		$content: $("body"),
		$comments: $(".comments"),
		$input: $('.send_text'),
		$submit: $('.send_btn'),
		$commentSuccess: $('.comment-success'),

		$tabRule: $('#rule'),
		$tabScore: $('#score'),

		pageSize: 50,
		maxid: 0,
		lastCommnet: '',

		init: function() {
			this.htmlFn();
		},
		
		htmlFn: function() {//加载弹幕盒子
			var t = simpleTpl();
			t._('<section class="pop-box">')
			t._('<div class="comment-box in-up">')
			t._('<div class="comments">')

			t._('</div>')
			t._('<div class="comment-form">')
			
			t._('<a href="javascript:void(0);" class="gohome"></a>')
			t._('<input name="ipt-text" type="text" class="comment-input" id="input-text" placeholder="说说你的看法吧~" />')
			t._('<input name="ipt-btn" type="button" id="submit" class="comment-btn" data-collect="true" data-collect-flag="btn-comment" data-collect-desc="说说你的看法吧" />')
			
			t._('</div>')
			t._('</div>')
			t._('</section>')
			$("body").append(t.toString());
			this.gohomeFn();
			this.bindBtn();
			this.heightFn();
			getResult('api/comments/room',{ps : this.pageSize,maxid : this.maxid},'callbackCommentsRoom');
		},
		gohomeFn: function() {
			$(".gohome").click(function() {
				$(".comment-box").removeClass("in-up").addClass("out-down");
				setTimeout(function() {
					$(".pop-box").addClass("none");
					$(".comment-box").removeClass("out-down");
				},500);
			});
		},
		heightFn: function() {//计算高度
			var wh = $(window).height();
			$("body,.main-box,.pop-bg:before,.comment-box").css("height",wh);
		},
		initComments: function(data){
			if(!W.barrage){
				this.initBarrage();
			}
			this.fillComments(data);
		},

		initBarrage: function(){
			W.barrage = $(".comments").barrage({ fontColor: ["FFFFFF"] });
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
			$("#submit").click(function(){ 
				var val = $("#input-text").val();
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

			$("#input-text").val('');
			var t = simpleTpl();
			t._($('#tmpl_barrage').tmpl({
				'src': headimgurl,
				'content': this.lastCommnet
			}));

			//W.barrage.appendMsg(t.toString());
		}
	};

	W.callbackCommentsRoom = function(data) {
		if(data.code == 0){
			H.comment.initComments(data);
		}

		setTimeout(function(){
			getResult('api/comments/room',{ps : H.comment.pageSize,maxid : H.comment.maxid,},'callbackCommentsRoom');
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

	//H.comment.init();

})(Zepto);