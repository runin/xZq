/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		from: getQueryString('from'),
		index_logo: "images/logo.png",
		now_time : null,
		istrue : true,
		init: function () {
			this.event_handler();
		},
		event_handler : function() {
			var me = this;
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$(".yao").click(function(e) {
				e.preventDefault();
				toUrl("yaoyiyao.html");
			});
			$(".listen").click(function(e) {
				e.preventDefault();
				toUrl("listen.html");
			});
			$(".quiz").click(function(e) {
				e.preventDefault();
				toUrl("quiz.html");
			});
			$(".photo").click(function(e) {
				e.preventDefault();
				toUrl("photo.html");
			});
		},
	}
	
})(Zepto);

$(function(){
	H.index.init();
});


