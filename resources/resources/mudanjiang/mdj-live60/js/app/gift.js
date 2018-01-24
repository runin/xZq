
$(function() {
//  if(headimgurl == null || headimgurl == ''){
//			headImg = 'images/avatar.jpg';
//	}else{
//			headImg = headimgurl + '/' + yao_avatar_size;
//	}
//	if(nickname == null|| nickname == ''){
//		 nickName = "匿名用户";
//	}else{
//		nickName = nickname;
//	}
//	$(".gift-header p:first-child img").attr("src",headImg);
//	$(".gift-header p:last-child span").text(nickName);
	getResult('api/lottery/record', {oi: openid}, 'callbackUserPrizeHandler', true);
	$(".btn-back").click(function(e) {
		e.preventDefault();
		toUrl("index.html");
	});
});


window.callbackLotteryRecordHandler = function(data) {
	if (data.result) {
		var t = simpleTpl(),
			items = data.rl || [],
			len = items.length;
		for (var i = 0; i < len; i ++) {
			var classStatecc = typeof(items[i].cc)=="undefined"?"none":"";
			t._('<li>')
				._('<div class="gift-icon"></div>')
				._('<div class="gift-time">'+ items[i].lt +'</div>')
				._('<div class="gift-content">')
					._('<p>奖品名称：'+ items[i].pn +'</p>')
					._('<p class="'+classStatecc+'">'+ items[i].cc +'</p>')

//					._('<span class="view-detail" data-collect="true" data-collect-flag="jx-jsbb-comments-view" data-collect-desc="查看详情">查看详情 </span>')
				._('</div>')
			._('</li>');
		}
		$('#gift-timeline').append(t.toString()).closest('.list').removeClass('none');
		 $(".view-detail").each(function(){
	    	$(this).click(function(){
	    		H.dialog.rule.open();
	    	});
	   });
	}else {
		$(".list").append('<p class="empty">暂时没有奖品记录</P>');
		return;
	}
}