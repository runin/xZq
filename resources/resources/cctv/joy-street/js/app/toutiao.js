(function($) {
	
	H.toutiao = {
		$make : $('#make'),
		$dialog : $('#make_dialog'),
		
		init: function() {
			H.rule.init();
			
			this.resize();
			this.bindBtn();

			var auid = getQueryString('auid');
			if(auid){
				// 查看文章
				getResult('api/newsdiy/look/' + auid, null,'callbackNewsDiyLookHandler');
			}else{
				// 生成文章
				var name = nickname;
				if(!name){
					name = '匿名用户';
				}

				getResult('api/newsdiy/get', {
					openid : openid,
					name : name
				} ,'callbackNewsDiyGetHandler');
			}
		},

		initToutiao: function(data){
			$('#title').html(data.t);
			$('#img').attr('src', data.i).removeClass('none');
			$('#content').html(data.ct);
			$('#detail').html(data.pt + ' 来自：'+data.s+' '+data.c+'评论');
		},

		bindBtn: function(){
			this.$make.click(function(){
				H.toutiao.$dialog.removeClass('none');
				$('body,html').scrollTop(0);
				$('body').css('height', $(window).height());
			});

			$('#submit').click(function(){
				var value = $.trim($('#input').val());
				if(value.length <= 0){
					alert('姓名不能为空哦');
					return ;
				}

				getResult('api/newsdiy/get', {
					openid : openid,
					name : value
				}, 'callbackNewsDiyGetHandler');
			});
		},

		redirect: function(data){
			var query = "";
			var key = 'cb41faa22e731e9b';
			var value = getQueryString(key);
			if(value){
				query = "&" + key + "=" + value;
			}

			location.href = './toutiao.html?auid=' + data.id + query;
		},

		resize: function(){
			$('.toutiao-dialog-wrapper').css('height', $(window).height());
			$('.main-content').css('min-height', $(window).height());
		}
	};

	W.callbackNewsDiyGetHandler = function(data){
		if(data.code == 0){
			H.toutiao.redirect(data);
		}
	};

	W.callbackNewsDiyLookHandler = function(data){
		if(data.code == 0){
			H.toutiao.initToutiao(data);
		}
	}

	H.toutiao.init();

})(Zepto);