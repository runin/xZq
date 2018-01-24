var orderNo=getQueryString("orderNo");
var pname=getQueryString("pname");
var count=getQueryString("count");
(function($) {
	H.goodspay = {
		$submit:$(".pay-submit"),
		init:function()
		{
			var me = this;
				me.event();
				//me.dataFill();
				me.detailOrderInfor();
		},
		detailOrderInfor:function()
		{
			getResult("indianaPeriod/detailorder",{orderNo:orderNo},"indianaPeriodDetailOrderCallBackHandler",true);
		},
		event:function()
		{
			 var me = this;
			 this.$submit.on("click",function(){
			 	$(".pay-button").html("支付中<span class='sp1'></span><span class='sp2'></span><span class='sp3'></span>");
				showLoading();
				$.ajax({
			        type:"GET",
			        dataType:"jsonp",
			        jsonp: "callback",
			        url: business_url + "indianaPeriod/pay",
			        jsonpCallback:'indianaPeriodPayCallBackHandler',
			        data: {
			            orderNo:orderNo 	 
                     },
                    complete: function() {
			            me.$submit.off();
			        },
                    success:function(data)
                    {

                    	if(data.result)
                    	{
                    	 
                    	  toUrl("./gdsbuysuccess.html?orderNos=" + data.orderNo);
                    	}
                    	else
                    	{
                    		hideLoading();
                    		showTips(data.message);
                    		setInterval(function()
                    		{
                    			me.event();
                    			$(".pay-button").text("确认支付");	
                    		},500)
                    	}

                    }
    			  })
			});
		},
		dataFill:function(data)
		{
			$(".pay-content").find(".goods-name").text(data.jt);
			$(".pay-content .goods-times").find("strong").text(data.jc);
			$(".pay-content").find(".gold-account").text(data.jc+"元宝");
			$(".pay-content .pay-pocket").find("strong").text(data.account);
			$(".pay-content .li-first").css("padding-right",$(".goods-times").width()+20);
			// 点击流
			if(data.proUuid)
			{
				$(".pay-submit").attr("data-collect-desc","夺宝-支付("+data.jt+")");
				$(".pay-submit").attr("data-collect-flag","pay"+data.proUuid);
			}
			
		}
	}
	W.indianaPeriodDetailOrderCallBackHandler=function(data)
	{
		if(data.result)
		{
			H.goodspay.dataFill(data);
		}
	}
		
})(Zepto);

$(function() {
	H.goodspay.init();
});