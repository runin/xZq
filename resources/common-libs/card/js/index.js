(function($) {
	
	H.index = {
		$paint: $('#paint'),
		$cover: $('#cover'),
		
		init: function() {
			var me = this,
				Img = new Image();
				Img.src = 'images/paint.jpg';
			this.$paint.addClass('zshow');
			var lottery = new Lottery(this.$paint.get(0), 'images/paint.jpg', 'image', $(window).width(), $(window).height(), function() {
				me.$paint.removeClass('zshow');
				setTimeout(function() {
					me.$paint.addClass('none');
					me.$cover.removeClass('none');
				}, 1500);
			});

			Img.onerror =function (){ alert('亲,服务器君很忙,休息一下再试吧'); };
			Img.onload = function (){
				lottery.init();
				setTimeout(function() {
					me.$cover.removeClass('none');
				}, 1500);
			}
		}
	};
	
})(Zepto);

$(function() {
	H.index.init();
});