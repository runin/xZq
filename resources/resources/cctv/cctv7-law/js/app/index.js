(function($) {
	H.index = {
		init: function() {
			this.event();
			imgReady("images/join-title.png",this.ready);
			
		},
		event: function() {
			$("#btn-rule").click(function(e) {
				e.preventDefault();
				if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				H.dialog.rule.open();
			});
			$("#btn-join").click(function(e) {
				e.preventDefault();
				if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				shownewLoading();
				toUrl('yao.html');
			});
		},
		ready : function(){
			$(".join-title").addClass("showme");
			$(".btn-group").removeClass("bounceInUp").addClass("bounceInUp");
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});