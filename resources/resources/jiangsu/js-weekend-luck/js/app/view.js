(function($) {
	H.index = {
		init: function() {
		
			this.event();
		},
		event: function() {
			$("#btn-back").click(function(e) {
				e.preventDefault();
				toUrl('index.html');
			});
	
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});