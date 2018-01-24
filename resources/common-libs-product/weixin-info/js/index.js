(function($) {
	
	H.index = {
		expires: {expires: 7},
		
		init: function() {
			if (!openid || !nickname) {
				return;
			}
		}
		
	};
	
})(Zepto);

$(function() {
	H.index.init();
});