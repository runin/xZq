(function($) {
	
	H.dialog = {
		
		init: function() {
		},

		open: function(id){
			$('#' + id).removeClass('none');
		},

		close: function(id){
			$('#' + id).addClass('none');
		}
	};

	H.dialog.init();

})(Zepto);
