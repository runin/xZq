// 获取本期uuid
var uuid=getQueryString("goods_id");

// 购买最大数量变量
var maxNum;
(function($) {
	H.goodsbuy = {
		$submit:$(".btn-submit"),
		checkflag:true,
		init:function()
		{
			var me = this;
				//me.event();
				me.periodDetail();
				
		},
		// 获取本期活动详情
		periodDetail:function()
		{
			getResult("indianaPeriod/detail",{appId:busiAppId,qid:uuid},"indianaPeriodDetailCallBackHandler",true);
		},
		event:function(punit)
		{
			var me = this;
			
			this.$submit.on("click",function(){

				var paycount = $(".rp-count").text();
				
                if (parseInt(paycount)==0) {

					showTips("您还没有选择数量");
					return;
				}else if(!me.checkflag)
				{
					return;
				};
				// $(".btn-submit").text("提交中...");
				$(".btn-submit").html("提交中<span class='sp1'></span><span class='sp2'></span><span class='sp3'></span>");
				showLoading();

				// 调用订单详情
				$.ajax({
			        type:"GET",
			        dataType:"jsonp",
			        jsonp: "callback",
			        url: business_url + "indianaPeriod/submitOrder",
			        jsonpCallback:'indianaPeriodSubmitOrderCallBackHandler',
			        data: {
			            appId: busiAppId,
			            openid: openid,
			            qid:uuid,
			            paycount:paycount,
			            nk:encodeURI((nickname?nickname:"匿名")),
			            hi:headimgurl     	 
                     },
                    complete: function() {
			           me.$submit.off();
			        },
                    success:function(data)
                    {
                    	if(data.result)
                    	{
                    		if(data.wxPayFlag)
		                    {
		                    	location.href=data.payUrl+"&prefix="+window.location.href.substr(0,window.location.href.indexOf('goodsbuy.html'));
		                    }
		                    else
		                    {
		                    	 toUrl("./goodspayxx.html?orderNo=" + data.ordreNo+"&pname="+data.pname+"&count="+data.count);
		                    }
                    		
                    	}
                    	else
                    	{
                    		hideLoading();
                    		showTips(data.message);
                    		setTimeout(function(){
                    			me.event();
								$(".btn-submit").text("提交");
                    		}, 500);
                    	}
                    }
    			  })
			});

			$("#db-num").blur(function(){
				if(me.check())
				{
					me.checkflag = true;
					var db_value = $("#db-num").val()
					if(parseInt(db_value)>maxNum)
					{
						showTips("已超本期最多人次");
						db_value = maxNum;
						$("#db-num").val(maxNum);
					}
					else if(parseInt(db_value)<1)
					{
						me.checkflag = false;
						db_value = 0;
					}
					if(db_value % punit !=0 )
					{
						db_value = Math.ceil(db_value / punit) * punit;
					}
					$("#db-num").val(db_value);
					$(".rp-count,.gold-count").text(db_value);
				}
				else
				{   
					me.checkflag = false;
					$("#db-num").focus();
				}
			   
			});
			
			// 数量处理
			$(".dm-count-chose a").tap(function(){
					var name = $(this).attr("id");
					switch(name)
					{
						 //增加商品
						case "db-increase":
						      me.checkflag = true;
					          var db_value=$(this).prev().val();
					         if(!me.check())
					         {
					         	return;
					         }
						     if(db_value>=maxNum)
						     {
						     	showTips("已超本期最多人次");
						     	db_value = maxNum;
						     }
						     else
						     {
						     	db_value = parseInt(db_value)+1*punit;
						     }
						     
					         $(this).prev().val(db_value);
					         $(".rp-count,.gold-count").text(db_value);
					         break;
					    //减少商品
					    case "db-reduce":
					         me.checkflag = true;
					        var db_value=$(this).next().val();
					        if(!me.check())
					        {
					        	return;
				            }
					        if(parseInt(db_value) >= 1*punit)
					        {
					        	num = parseInt(db_value)-1*punit;
					        }
					        else
					        {
					        	num = 0;	
					        	me.checkflag = false;
					        }	
					        $(this).next().val(num);
					        $(".rp-count,.gold-count").text(num);
					        break;
					    default:
					    	break;

					}
			    });
            },
		// 	$(".db-increase").click(function(){
		// 		    me.checkflag = true;
		// 			var db_value=$(this).prev().val();
		// 			    if(!me.check())
		// 			    {
		// 			    	return;
		// 			    }
		// 				if(db_value>=maxNum)
		// 				{
		// 					showTips("已超本期最多人次");
		// 					db_value = maxNum;
		// 				}
		// 				else
		// 				{
		// 					db_value = parseInt(db_value)+1;
		// 				}
						
		// 			    $(this).prev().val(db_value);
		// 			    $(".rp-count,.gold-count").text(db_value);
		// 		});
		// 		//减少商品
		// 	$(".db-reduce").click(function(){
		// 		me.checkflag = true;
		// 		var db_value=$(this).next().val();
		// 		if(!me.check())
		// 		{
		// 			return;
		// 	     }
		// 		if(parseInt(db_value) >= 1)
		// 		{
		// 			num = parseInt(db_value)-1;
		// 		}
		// 		else
		// 		{
		// 			num = 0;	
		// 			me.checkflag = false;
		// 		}	
		// 		$(this).next().val(num);
		// 		$(".rp-count,.gold-count").text(num);
		// 	})
		// },
		check:function()
		{
			var num = $("#db-num").val();
				num= $.trim(num);
			if(/^0$/.test(num))
			{
				return true;
			}
			if(!/^[1-9][0-9]*$/.test(num) || parseInt(num)<0)
			{
				showTips("请输入正确的数量")
				return false;
			}
			else
			{
				return true;
			}
			return true;
		}
	}
	// 获取本期详细活动
	W.indianaPeriodDetailCallBackHandler=function(data)
	{
		if(data.result)
		{  
			var residue = data.qjp-data.qjc;
			var pinit = 1;
			if(data.qstep)
			{
				pinit = data.qstep?data.qstep:"1";
				pinit = parseInt(pinit);
				H.goodsbuy.event(pinit);
			}else if(data.qdefault)
			{
				pinit = data.qdefault?data.qdefault:"1";
				if(pinit>=residue)
				{
					pinit=residue;
				}
				pinit = parseInt(pinit);
				H.goodsbuy.event(1);
			}else
			{
				H.goodsbuy.event(1);
			}
      
			
			$(".tt-goods .tt-goods-img").find("img").attr("src",data.psi);
			$(".tt-goods").find(".periods-id").text("(第"+data.qpq +"期)  ");
			$(".tt-goods").find(".goods-name").text(data.ppn);
			$(".tt-goods .left-rp").find("strong").text(data.qjp);
			$(".tt-goods .right-rp").find("strong").text(residue);
			
			if(data.ppuuid)
			{
				// 点击流
				$(".tt-goods-submit").attr("data-collect-desc","夺宝-提交订单("+data.ppn+")");
				$(".tt-goods-submit").attr("data-collect-flag","order"+data.ppuuid);
			}
			
			$("#db-num").val(pinit);
			$(".rp-count,.gold-count").text(pinit);
			
			maxNum = residue;
		}
		else
		{
			showTips("网络在开小差哦...请稍后再试");
		}
	}

})(Zepto);

$(function() {
	H.goodsbuy.init();
});