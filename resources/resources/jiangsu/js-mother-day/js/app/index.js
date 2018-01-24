/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		from: getQueryString('from'),
		init: function () {
			var me = this;
			var width = $('.enter-btn').width();
			$('.enter-btn').height(width*320/532);	
			if (me.from) {
				setTimeout(function () {
					H.dialog.guide.open();
				}, 800);
			}
			if(!openid){
				$('#btn-begin').click(function(e) {
					e.preventDefault();
					return;
				});
				$('#btn-pocket').click(function(e) {
					e.preventDefault();
					return;
				});
	        
	            showLoading($("body"));		        
			}else{
				  me.event_handler();
			}	
		},
		event_handler : function() {
			
			var me = this;
			$('#btn-begin').click(function(e) {
				e.preventDefault();
				toUrl("lottery.html");
				return;
			});
			$('#btn-pocket').click(function(e) {
				e.preventDefault();
				toUrl("gift.html");
				return;
			});
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
		
		    
		},
	}
})(Zepto);

$(function(){
	H.index.init();
});


