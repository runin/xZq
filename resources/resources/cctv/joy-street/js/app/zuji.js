(function($) {

	H.make = {
		$makeList : $('.make-list'),
		$makeDialog : $('.make-dialog-wrapper'),
		$makeImg : $('#demo_img'),
		$makeInput : $('#input'),
		$makeUid : $('#uid'),
		$makeSubmit : $('#submit'),
		$holder : $('#holder'),

		$tabView : $('.nav-view'),
		$tabMake : $('.nav-make'),


		init: function(){
			H.rule.init();
			
			this.resize();
			this.bindBtns();
			getResult('api/linesdiy/info',{}, 'callbackLinesDiyInfoHandler');
		},

		fillList: function(data){
			var t = simpleTpl();
			for(var i in data.gitems){
				t._('<li uid="'+ data.gitems[i].uid +'" data-collect="true" data-collect-flag="joy-street-zuji-make-list" data-collect-desc="喜乐街 足迹-图片选择">')
					._('<img src='+ data.gitems[i].ib +' />')
				._('</li>')
			}

			this.$makeList.html(t.toString());

			this.$makeList.find('li').click(function(){
				H.make.$makeImg.attr('src', $(this).find('img').attr('src'));
				H.make.$makeUid.val($(this).attr('uid'));
				H.make.$makeDialog.removeClass('none');

				$('body,html').scrollTop(0);
			});
		},

		submitSuccess: function(data){
			var query = "";
			var key = 'cb41faa22e731e9b';
			var value = getQueryString(key);
			if(value){
				query = "&" + key + "=" + value;
			}

			H.make.$makeInput.val('');
			location.href = "./zuji-share.html?uid="+data.ruid+"&toShare=true" + query;
		},

		bindBtns: function(){
			var query = "";
			var key = 'cb41faa22e731e9b';
			var value = getQueryString(key);
			if(value){
				query = "?" + key + "=" + value;
			}

			this.$tabView.click(function(){
				location.href = './zuji-view.html' + query;
			});

			this.$tabMake.click(function(){
				location.href = './zuji-make.html' + query;
			});

			this.$makeSubmit.click(function(){

				var value = $.trim(H.make.$makeInput.val());
				if(value.length <= 0){
					alert('请输入文字内容');
					return;
				}

				getResult('api/linesdiy/save',{
					'yoi' : openid,
					'tuid' : H.make.$makeUid.val(),
					'wxnn' : encodeURIComponent(nickname),
					'wximg' : headimgurl,
					'jsdt' : encodeURIComponent(value)
				}, 'callbackLinesDiySaveHandler');
			});

			this.$makeInput.bind('input', function(){
				H.make.$holder.text($(this).val());
			});

			this.$makeDialog.find('.dialog-close').click(function(){
				$(this).parent().parent().addClass('none');
			});
		},

		resize: function(){
			$('.main-content').css('min-height', $(window).height());
			$('.make-dialog-wrapper').css('height', $(window).height());
			$('.make-list').css('min-height', $(window).height() - 95);
		}
	};

	W.callbackLinesDiyInfoHandler = function(data){
		if(data.code == 0){
			H.make.fillList(data);
		}else{
			alert('网络错误，请刷新重试');
		}
	};

	W.callbackLinesDiySaveHandler = function(data){
		if(data.code == 0){
			H.make.submitSuccess(data);
		}else{
			alert('生成失败，请稍后重试');
		}
	}

	H.make.init();

})(Zepto);