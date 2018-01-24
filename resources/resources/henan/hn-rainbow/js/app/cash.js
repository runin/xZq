(function($) {
	
	H.cash = {
		$wrapper: $('.cash-1-wrapper'),
		
		init: function() {
			if(getQueryString('rp') != ''){
				showTips('领取成功');
			}
			
			this.bindBtns();
			this.resize();
		},

		show: function(data){
			var data = JSON.parse(data);
			if (data.tt) {
			    H.cash.$wrapper.find('.hongbao-text').html(data.tt);
			}
			H.cash.$wrapper.find('.hongbao-cash .hongbao-img').attr('src', data.pi);

			var preDot = Math.floor(data.pv / 100);
			var afterDot = data.pv - preDot * 100 ;
			if(afterDot < 10){
				afterDot = '0' + afterDot;
			}

			H.cash.$wrapper.find('.hongbao-cash-value').html(preDot + '.' + afterDot);
			H.cash.$wrapper.find('.hongbao-btn').attr('href', data.rp);
			H.cash.$wrapper.parent().removeClass('none');
		},

		bindBtns: function(){
			H.cash.$wrapper.find('.hongbao-close').click(function(){
				H.event.handle(H.cash.$wrapper.attr('onCashClose'));
				H.cash.$wrapper.parent().addClass('none');
			});

			H.cash.$wrapper.find('.hongbao-btn').click(function(){
				H.event.handle(H.cash.$wrapper.attr('onCashOk'));
				H.cash.$wrapper.parent().addClass('none');
			});
		},

		resize: function(){
			var title = H.cash.$wrapper.find('.hongbao-title');
			var paddingTop = parseInt(title.css('padding-top'), 10) / H.resize.heightRatio;
			var paddingBottom = parseInt(title.css('padding-bottom'), 10) / H.resize.heightRatio;
			var marginTop = parseInt(title.css('margin-top'), 10) / H.resize.heightRatio;
			var marginBottom = parseInt(title.css('margin-bottom'), 10) / H.resize.heightRatio;
			title.css({
				'padding-top': paddingTop,
				'padding-bottom': paddingBottom,
				'margin-top': marginTop,
				'margin-bottom': marginBottom
			});
		}

	};

	H.cash.init();

})(Zepto);
