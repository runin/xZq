(function($) {
	
	H.index = {
		$paint: $('#paint'),
		$cover: $('#cover'),
		
		init: function() {
			var me = this;
			this.$paint.addClass('zshow');
			setTimeout(function() {
				me.$cover.removeClass('none');
			}, 1000);
			var lottery = new Lottery(this.$paint.get(0), 'images/paint.jpg', 'image', $(window).width(), $(window).height(), function() {
				me.$paint.removeClass('zshow');
				setTimeout(function() {
					me.$paint.addClass('none');
					me.$cover.removeClass('none');
				}, 1500);
			});
			lottery.init();
		}	
			
	};
	
})(Zepto);

$(function() {
	H.index.init();
});