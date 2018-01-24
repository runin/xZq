(function($) {
	
	H.resize = {
		originHeight : 601.7,
		originWidth : 370.8,

		widthRatio : 0,
		heightRatio : 0,

		init: function() {
			var width = $(window).width();
			var height = $(window).height();

			this.widthRatio = this.originWidth / width,
			this.heightRatio = this.originHeight / height,

			$('.main').css({
				'width': width,
				'height': height,
				'background-size': width + 'px ' + height + 'px'
			});

			$('.dialog-wrapper').css({
				'width': width,
				'height': height,
				'background-size': width + 'px ' + height + 'px'
			});

			$('.font-resize').each(function(){
				var size = $(this).css('font-size');
				$(this).css('font-size', parseFloat(size) / H.resize.widthRatio);
			});

			$('.line-height-resize').each(function(){
				var lineHeight = $(this).css('line-height');
				$(this).css('line-height', parseFloat(lineHeight) / H.resize.heightRatio + 'px');
			});


			$('.wrapper').each(function(){



				var dataX = $(this).attr('data-x');
				var dataY = $(this).attr('data-y');

				var oldWidth = parseFloat($(this).css('width'));
				var oldHeight = parseFloat($(this).css('height'));

				$(this).css({
					'left' : dataX / H.resize.widthRatio,
					'top' : dataY / H.resize.heightRatio,
					'width' : oldWidth / H.resize.widthRatio,
					'height' : oldHeight / H.resize.heightRatio,
					'position' : 'absolute'
				});

			});

			$('.wrapper[onItemClick]').click(function(){
				H.event.handle($(this).attr('onItemClick'));
			});

			$('[percent="true"]').each(function(){
				var parent = $(this).parents('.wrapper');
				var width = parseFloat(parent.css('width'));
				var height = parseFloat(parent.css('height'));

				var percentW = $(this).attr('w-percent');
				var percentH = $(this).attr('h-percent');
				var percentX = $(this).attr('x-percent');
				var percentY = $(this).attr('y-percent');
				
				$(this).css({
					'width': percentW * width,
					'height': percentH * height,
					'line-height': $(this).hasClass('no-line-height') ? 'normal' : percentH * height + 'px',
					'left': percentX * width,
					'top': percentY * height
				});
			});

			$('[ratio="true"]').each(function(){
				var height = parseFloat($(this).css('height'));
				$(this).css('height', height / H.resize.heightRatio);
			});

			$('.main').removeClass('none');
		},

		attr: function(element, attrs){
			var $element = $(element);
			var cssObj = {};
			for(var i in attrs){
				var ratio = 1;
				if(attrs[i].indexOf('top') >= 0 || attrs[i].indexOf('bottom') >= 0 || attrs[i].indexOf('height') >= 0 || attrs[i].indexOf('line-height') >= 0){
					ratio = H.resize.heightRatio;
				}else{
					ratio = H.resize.widthRatio;
				}
				cssObj[attrs[i]] = parseFloat($element.css(attrs[i])) / ratio + 'px';
			}
			$element.css(cssObj);
		}
	};

	H.resize.init();

})(Zepto);
