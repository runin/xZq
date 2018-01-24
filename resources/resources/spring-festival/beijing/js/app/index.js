(function() {
	
	H.index = {
		
		init: function() {
			var bg = './images/bg.jpg';
			showLoading();
			imgReady(bg, function() {
				hideLoading();
				
				$('html').css('backgroundImage', 'url('+ bg +');');
			});
			
			this.subscribe();
		},
		
		// 一键关注
		subscribe: function() {
			window['shaketv'] && shaketv.subscribe(weixin_appid, function(returnData){});
		}
	};
	
})(Zepto);

$(function() {
	H.index.init();
});