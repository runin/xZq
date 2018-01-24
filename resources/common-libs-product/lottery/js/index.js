(function($) {
	
	H.index = {
		$canvas: $('#canvas'),
		$btn_lottery: $('#lottery-btn'),
		init: function() {
			var me = this;
			this.$canvas.lottery({
				colors: [ '#FFE327', '#FFFF98', '#FBE69F' ],
				texts: [ "iPhone", "iPad", "现金券", "音响", "茶杯", "U盘", "电影票" ],
				images: [ "images/1.png", "images/2.png", "images/3.png", "images/4.png", "images/5.png", "images/6.png", "images/7.png" ],
				btn_needle: me.$btn_lottery,
				canvas_size: 270,
				font_size: 16,
				image_size: 45,
				outsideRadius: 130,
				textRadius: 105,
				imageRadius: 98
			});
		}
			
	};
	
})(Zepto);

$(function() {
	H.index.init();
});