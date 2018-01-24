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
				$(this).css('font-size', parseInt(size, 10) / H.resize.widthRatio);
			});

			$('.line-height-resize').each(function(){
				var lineHeight = $(this).css('line-height');
				$(this).css('line-height', parseInt(lineHeight, 10) / H.resize.heightRatio + 'px');
			});


			$('.wrapper').each(function(){
				var dataX = $(this).attr('data-x');
				var dataY = $(this).attr('data-y');

				var oldWidth = parseInt($(this).css('width'),10);
				var oldHeight = parseInt($(this).css('height'),10);

				$(this).css({
					'left' : dataX / H.resize.widthRatio,
					'top' : dataY / H.resize.heightRatio,
					'width' : oldWidth / H.resize.widthRatio,
					'height' : oldHeight / H.resize.heightRatio,
					'position' : 'absolute'
				});

				if($(this).hasClass('preserve-ratio')){
					var leftOffser = oldWidth / H.resize.widthRatio - oldHeight / H.resize.heightRatio;
					if(leftOffser < 0){
						leftOffser = 0;
					}
					var preservedWidth = Math.min(oldWidth / H.resize.widthRatio, oldHeight / H.resize.heightRatio);
					var preservedHeight = preservedWidth;
					$(this).css({
						'width' : preservedWidth,
						'height' : preservedHeight,
						'left' : dataX / H.resize.widthRatio + leftOffser / 2
					});
				}
			});

			$('.wrapper[onItemClick]').click(function(){
				H.event.handle($(this).attr('onItemClick'));
			});

			$('[percent="true"]').each(function(){
				var parent = $(this).parents('.wrapper');
				var width = parseInt(parent.css('width'), 10);
				var height = parseInt(parent.css('height'), 10);

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
				var height = parseInt($(this).css('height'), 10);
				$(this).css('height', height / H.resize.heightRatio);
			});

			$('.copyright').each(function(){
				var bottom = parseFloat($(this).css('bottom'));
				$(this).css('bottom' , bottom / H.resize.heightRatio);
			});

			$('[data-href]').click(function(){
				location.href = $(this).attr('data-href');
			});
		},

		attr: function(element, attrs){
			var $element = $(element);
			var cssObj = {};
			for(var i in attrs){
				var ratio = 1;
				attrs[i] = attrs[i].toString();
				if(attrs[i].indexOf('top') >= 0 || attrs[i].indexOf('bottom') >= 0 || attrs[i].indexOf('height') >= 0 || attrs[i].indexOf('line-height') >= 0){
					ratio = H.resize.heightRatio;
				}else{
					ratio = H.resize.widthRatio;
				}
				cssObj[attrs[i]] = parseInt($element.css(attrs[i]), 10) / ratio + 'px';
			}
			$element.css(cssObj);
		}
	};

	H.resize.init();

})(Zepto);
