(function($) {

	H.view = {
		$viewList : $('.view-list'),
		$tabView : $('.nav-view'),
		$tabMake : $('.nav-make'),


		init: function(){
			H.rule.init();
			
			this.resize();
			this.bindBtns();

			getResult('api/linesdiy/record/list',{}, 'callbackLinesDiyRecordListHandler');

		},

		fillList: function(data){

			var t = simpleTpl();
			for(var i in data.items){
				if(!data.items[i].ib){
					continue;
				}

				t._('<li>')
					._('<img src="'+ data.items[i].ib +'" />')
					._('<section class="text">')
						._('<p>'+ data.items[i].jd +'</p>')
					._('</section>')
				._('</li>');
			}

			this.$viewList.html(t.toString());
		},

		submitSuccess: function(data){
			H.make.$makeInput.val('');
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
		},

		resize: function(){
			$('.main-content').css('min-height', $(window).height());
		}
	};

	W.callbackLinesDiyRecordListHandler = function(data){
		if(data.code == 0){
			H.view.fillList(data);
		}else{
			alert('网络错误，请刷新重试');
		}
	};

	H.view.init();

})(Zepto);