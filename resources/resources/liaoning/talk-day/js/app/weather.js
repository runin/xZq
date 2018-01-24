/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
	
		init: function () {
			$(".back-btn").click(function(e){
				e.preventDefault();
				toUrl("join.html");
			});
			getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler',true);	
		},
		event_handler : function() {
		
		}
	};
	W.callbackLinesDiyInfoHandler = function(data){
		
		if(data.code == 0){
			var art = data.gitems[0];
			if(!art.ib){
				$("#wea-img").addClass("none");
			}else{
				$("#wea-img").attr("src",art.ib).removeClass("none");
			}
			
			$("#main").append(art.info).removeClass("none");
		}
	};
})(Zepto);                             

$(function(){
	H.index.init();
});


