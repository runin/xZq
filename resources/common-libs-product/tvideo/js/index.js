(function($) {
	
	H.index = {
		$video: $('#video'),
		init: function() {
			var url = 'http://v.qq.com/iframe/player.html?vid=m0137rrajuc&auto=0&width=' + this.$video.width() + '&height=' + this.$video.height(); 
			this.$video.html('<iframe src="'+ url +'"></iframe>');
		}	
	
	};
	
})(Zepto);

$(function() {
	H.index.init();
});