
$(function() {
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
			var cc = items[i].cc?items[i].cc:undefined;
			 if(cc!=undefined){
			 	if(cc.indexOf(',') != -1){
			 		cc = cc.split(",");
					var ccstr ="";
					for(var n = 0;n< cc.length;n++){
						ccstr += "<p>"+cc[n]+"</p>";
					}
					t._('<li>')
						._('<div class="gift-icon"></div>')
						._('<div class="gift-time">'+ items[i].lt +'</div>')
						._('<div class="gift-content">')
							._('<p>奖品名称：'+ items[i].pn +'</p>')
							._('<div >'+ ccstr +'</div>')
						._('</div>')
					._('</li>');
			 	}
			 }
		}
		$('#gift-timeline').append(t.toString()).closest('.list').removeClass('none');
	}else {
		$(".list").append('<p class="empty">暂时没有奖品记录</P>');
		return;
	}
}