/**
 * 男过女人关-抽奖
 */
(function($) {
    H.index = {
        init : function(){
            this.event();
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
			 $(".btn-join").click(function(e) {
				e.preventDefault();
					if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				toUrl("yao.html");
			});
        }
     }
})(Zepto);

$(function() {
    H.index.init();
});
