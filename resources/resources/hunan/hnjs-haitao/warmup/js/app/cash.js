(function($) {
	
	H.cash = {
		$wrapper: $('.cash-wrapper'),
		
		init: function() {
			this.bindBtns();
			this.resize();
		},

		show: function(data){
			var data = JSON.parse(data);
			var htmlTpl = H.cash.$wrapper.find('.hongbao-title').html();
			
			H.cash.$wrapper.find('.hongbao-title').html(htmlTpl.replace("%XXXXX%", data.pn));
			H.cash.$wrapper.find('.hongbao-cash img').attr('src', data.pi);

			var preDot = Math.floor(data.pv / 100);
			var afterDot = data.pv - preDot * 100 ;

			H.cash.$wrapper.find('.hongbao-cash-value').html(preDot + '.' + afterDot);
			H.cash.$wrapper.find('.hongbao-click').attr('href', data.rp);
			H.cash.$wrapper.parent().removeClass('none');
		},

		bindBtns: function(){
			H.cash.$wrapper.find('.hongbao-close').click(function(){
				H.event.handle(H.cash.$wrapper.attr('onCashClose'));
				H.cash.$wrapper.parent().addClass('none');
			});

			H.cash.$wrapper.find('.hongbao-click').click(function(){
				H.event.handle(H.cash.$wrapper.attr('onCashOk'));
				H.cash.$wrapper.parent().addClass('none');
			});

			$('#rp_dialog .hongbao-close').click(function(){
				$('#rp_dialog').addClass('none');
			});

			$('#rp_dialog .hongbao-click').click(function(){
				$('#rp_dialog').addClass('none');
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
