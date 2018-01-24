(function($) {
	H.record = {
		beginTime:null,
		init: function() {
			var winW = $(window).width(),
				winH = $(window).height();
			$('html').css({
				'width': winW,
				'height': winH
			});
			this.event();
			this.getDate();
		},
		event: function() {
	
			$('.btn-back').click(function(e) {
				toUrl("yaoyiyao.html");

			});
			
		},
		dataList:function(data)
		{	
			t = simpleTpl();
			for(var i=0;i < data.length;i++)
			{
				t._('<li>')
				._('<div>')
				._('<img src="'+data[i].pi+'">')
				._('</div>')
				._('<p>中奖日期：'+data[i].lt.substr(0,10)+'</p>')
				._('</li>')
			}
			$(".record-list ul").append(t.toString());

		},
		getDate:function(time)
		{
			var dayTime = timeTransform(new Date().getTime()).split(" ")[0];
			getResult("api/lottery/record",{oi:openid,pt:"1",bd:dayTime},"callbackLotteryRecordHandler",true);
		},
	};
	W.callbackLotteryRecordHandler=function(data)
	{
		if(data.result)
		{
			H.record.dataList(data.rl);
		}
		else
		{
			showTips("今日暂无中奖纪录");
		}
	}
})(Zepto);

$(function() {
	H.record.init();
});