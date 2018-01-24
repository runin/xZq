(function($) {
	H.answer = {
		init: function() {
			getResult('api/article/list', {}, 'callbackArticledetailListHandler',true);	
			$(".back-btn").click(function(e){
				e.preventDefault();
				toUrl("join.html");
			});
		},
		
	}
	W.callbackArticledetailListHandler = function(data){
		if(data.code == 0){
			var art = data.arts[0];
			var uuid = art.uid;
			console.log(1);
			getResult('api/article/detail', {uuid:uuid}, 'callbackArticledetailDetailHandler',true);	
		}
	};
	W.callbackArticledetailDetailHandler = function(data){
		if(data.code == 0){
			var t = simpleTpl();
			t._('<header>')
				._('<img src="'+data.img +'" />')
			._('</header>')
			._('<section class="word-con">'+ data.i+'</section>')
			._('<footer>')
				._('<div class="data"><span>'+data.c +'</span><span>'+ data.sc+'</span></div>')
				._('<div class="data-info"><span>'+data.st +'</span><span>'+ data.t+'</span></div>')
			._('</footer>');
			$(".his-con").html(t.toString()).removeClass("none");
		}
	}
})(Zepto);

$(function() {
	H.answer.init();
});