var uuid=getQueryString("goods_id");

(function($) {
	H.goodsimgdetail = {	
		type:1,
		init:function()
		{
			var me = this;
			//me.beforeShowCountdown();
			me.detailImageGet();
		},
		detailImageGet:function()
		{
			getResult("indianaPeriod/detailBimg",{qid:uuid},"indianaPerioddetailBimgCallBackHandler",true);
		},
		event:function()
		{
			
			
		},
	}
	W.indianaPerioddetailBimgCallBackHandler=function(data)
	{
		if(data.result)
		{
			$(".img-content").html(data.ppd);
		}
		else
		{
			showTips("暂无图形简介");
		}
	};
})(Zepto);

$(function() {
	H.goodsimgdetail.init();
});