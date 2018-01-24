(function($) {

	H.share = {
		$shareBtn : $('.share-btn'),
		$backBtn : $('.back'),

		$imgRatio : 800 / 533,
		
		init: function(){
			H.rule.init();
			
			this.resize();
			this.bindBtns();

			uid = getQueryString('uid');

			if(uid){
				showLoading();
				getResult('api/linesdiy/record/' + uid, null, 'callbackLinesDiyRecordHandler');	
			}else{
				// FIXME 显示图片错误
			}

			this.$shareBtn.removeClass('none');
			this.$backBtn.removeClass('none');
		},

		fillPic: function(data){
			$('#demo_img').attr('src', data.ib);
			$('#holder').text(data.jd);
			$('.main-content').removeClass('hide');
		},

		bindBtns: function(){
			this.$shareBtn.click(function(){
				$(this).text('右上角你懂的');
			});

			$('.back').click(function(){
				var query = "";
				var key = 'cb41faa22e731e9b';
				var value = getQueryString(key);
				if(value){
					query = "?" + key + "=" + value;
				}

				location.href = "zuji-make.html" + query;
			});
		},

		resize: function(){
			$('.main-content').css('min-height', $(window).height());
			$('.make-dialog-wrapper').css('height', $(window).height());

			var imgHeight = ($(window).width() - 16) / this.$imgRatio;

			var bottom = ($(window).height() - imgHeight) / 2;
			$('.share-img').css('bottom' , bottom);

			$('.share-wrapper').css('bottom', bottom - 40);
		}
	};

	W.callbackLinesDiyRecordHandler = function(data){
		hideLoading();
		if(data.code == 0){
			H.share.fillPic(data);
		}
	}

	H.share.init();

})(Zepto);