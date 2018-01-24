(function($) {
	
	H.countdown = {
		$content: $('.countdown-wrapper p'),
		
		formatStr: '',
		
		init: function(){
			this.$content.html('');
			var format = this.$content.attr('format');
			this.formatStr = '<p class="time"><span>'+format+'</span></p>';
		},
		
		update: function(data){
			var data = JSON.parse(data);
			var format = H.countdown.formatStr;

			if(data.format){
				format = data.format;
			}

			if(data.timeLeft){
				H.countdown.$content.removeClass('none').html(showTime(data.timeLeft, format));
			}
		},

		hide: function(){
			H.countdown.$content.addClass('none');
		}
	};
	
	H.countdown.init();
	
})(Zepto);