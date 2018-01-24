(function($) {
	
	H.didi = {
		$body: $('body'),
		
		init: function() {
			if (!openid) {
				window.location.href = 'index.html';
				return;
			}
			getResult('yiguan/count', {
				yoi: openid
			}, 'callbackYiguanCount', true);
		}	
			
	};
	
	W.callbackYiguanCount = function(data) {
		if (data.code == 0) {
			H.didi.$body.removeClass('none');
			return;
		}
		alert(data.message);
		window.location.href = 'index.html';
	};
	
})(Zepto);

$(function() {
	H.didi.init();
});