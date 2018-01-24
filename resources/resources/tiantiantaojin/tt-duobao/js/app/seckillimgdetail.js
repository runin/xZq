(function($) {
	H.seckillimgdetail = {	
		uuid:getQueryString("data_uuid"),
		init:function()
		{
			var me = this;
			//me.beforeShowCountdown();
			me.detailImageGet();
		},
		detailImageGet:function()
		{
			var me = this;
			getResult("seckill/detail", {infouid: me.uuid }, "callBackSeckillDetailHandler", true);
		},
	}
	W.callBackSeckillDetailHandler=function(data)
	{
		if(data.result)
		{
			$(".img-content").html(data.desc);
		}
		else
		{
			showTips("暂无图形简介");
		}
	};
})(Zepto);

$(function() {
	H.seckillimgdetail.init();
});