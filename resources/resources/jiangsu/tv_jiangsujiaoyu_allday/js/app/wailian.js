(function($) {
	
	H.wailian = {
		$wrapper: $('.wailian-wrapper'),
		
		init: function() {
			this.bindBtns();
			this.resize();
		},

		show: function(data){

			var data = JSON.parse(data);
			H.wailian.$wrapper.find('.hongbao-wailian img').attr('src', data.pi);
			H.wailian.$wrapper.find('.hongbao-click').attr('href', data.ru);
			H.wailian.$wrapper.parent().removeClass('none');
		},

		bindBtns: function(){
			H.wailian.$wrapper.find('.hongbao-close').click(function(){
				H.event.handle(H.wailian.$wrapper.attr('onWailianClose'));
				H.wailian.$wrapper.parent().addClass('none');
			});

			H.wailian.$wrapper.find('.hongbao-click').click(function(){
				H.wailian.$wrapper.parent().addClass('none');
			});
		},

		resize: function(){
			var title = H.wailian.$wrapper.find('.hongbao-title');
			H.resize.attr(title, ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom']);
		}

	};

	H.wailian.init();

})(Zepto);
