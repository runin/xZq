/**
 * 社区春晚-首页
 */
(function($) {
	H.index = {
		init : function(){
			this.event();
			this.imgReady(index_bg);
		},
		imgReady : function(index_bg) {
			var width = document.documentElement.clientWidth;
			$('body').css('background', '#9F020B url('+ index_bg +') no-repeat');
			$('body').css('background-size',  width + 'px auto');
			/*$('body').css('background-size',  'auto ' + document.documentElement.clientHeight + 'px');*/

		},
		event: function() {
			$("#btn-begin").click(function(e){
				e.preventDefault();
				if(openid){
					getResult('syparty/index', {
						qid : surveyInfoUuid
					}, 'callIndexHander');
				}
			});
			$("#comments").click(function(e){
				toUrl("comments.html");
			});
		}
	};

	W.callIndexHander = function(data){
		if(data.code == 0){
			toUrl("lottery.html");
		}else{
			alert(data.message);
			return;
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});

