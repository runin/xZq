
(function($) {
	H.secKillPay = {
		orderNo:getQueryString("orderNo"),
		$submit:$(".pay-submit"),

		$payButton:$(".pay-button"),
		requestFlag:true,
		init:function()
		{
			var me = this;
				
				//me.dataFill();
				me.detailOrderInfor();
		},
		detailOrderInfor:function()
		{
			var me = this;
			getResult("seckorder/detail",{orderNo:me.orderNo},"seckOrderDetailCallBackHandler",true);
		},
		event:function()
		{
			 var me = this;
			 this.$submit.on("click",function(){
			 	me.$payButton.html("支付中<span class='sp1'></span><span class='sp2'></span><span class='sp3'></span>");
				showLoading();
				if(me.requestFlag)
				{
					me.requestFlag=false;
				}
				else
				{
					return
				}
				$.ajax({
			        type:"GET",
			        dataType:"jsonp",
			        jsonp: "callback",
			        url: business_url + "seckill/pay",
			        jsonpCallback:'seckillOrderPayCallBackHandler',
			        data: {
			            orderNo:me.orderNo 	 
                     },
                    complete: function() {
			           
			        },
                    success:function(data)
                    {
                    	if(data.result)
                    	{
                    	 
                    	  	toUrl("./seckillsuccess.html?orderNo=" + data.orderNo);
                    	}
                    	else
                    	{
                    		hideLoading();
                    		showTips(data.message);
                    		setInterval(function()
                    		{
                    			me.requestFlag=true;
                    			me.$payButton.text("确认支付");	
                    		},500)
                    	}

                    }
    			  })
			});
		},
		dataFill:function(data)
		{
			var me = this;
			$(".pay-content").find(".goods-name").text(data.pn);
			$(".pay-content .goods-times").find("strong").text(data.jc);
			$(".pay-content .pay-pocket").find("strong").text(data.account);
			$(".pay-main").removeClass("none");
			me.event();
		}
	}
	W.seckOrderDetailCallBackHandler=function(data)
	{
		if(data.result)
		{
			H.secKillPay.dataFill(data);
		}
	}
		
})(Zepto);

$(function() {
	H.secKillPay.init();
});