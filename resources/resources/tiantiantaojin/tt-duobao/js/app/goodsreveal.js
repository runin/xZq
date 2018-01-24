(function($) {
	H.goodsreveal = {
		isTimeOver:[],
		type:[],
		dec:0,
		timeInterval:[],
		timeError:[],
		init:function()
		{
			var me = this;
				//me.event();
				me.newOpen(true);
				$(window).scrollTop(0);
				
		},
		 // 最新揭晓
        newOpen:function(loading)
		{
			getResult("indianaPeriod/newOpen",{appId:busiAppId,size:30},"indianaPeriodNewOpenCallBackHandler",loading)
		},
		// 揭奖失败倒计时
		errorDeal:function()
		{
			var me = this;
			for(var i=0;i<me.timeError.length;i++)
			{
				if(me.timeError[i])
				{
					if(me.timeInterval[i])
					{
						return;
					}
					me.timeInterval[i] = setInterval(function()
					{
						me.newOpen(false);
					}, 4000);
				}
				else
				{
					clearInterval(me.timeInterval[i]);
				}
			}
		},
		// 商品倒计时
		getGoodsTime:function(data)
		{
			var me = this;
			var t = simpleTpl();
			var t1 = simpleTpl();
			var dataItem = data.item;
			for(var i=0;i<dataItem.length;i++)
			{
			
				// 十元专区
    			if(dataItem[i].syflag)
    			{
    				visible="visible";
    			}
    			else
    			{
    				visible="none";
    			}

				t._('<li>')
				._('<div class="tt-goods grey-click-bg" data-id="'+ dataItem[i].uuid+'" data-collect="true" data-collect-desc="最新揭晓('+dataItem[i].pname+')" data-collect-flag="reveal'+dataItem[i].uuid+'">')
				._('<div class="tt-goods-img">')
				._('<i class="ico ico-label ico-special '+visible+'"></i>')
                ._('<img src="'+dataItem[i].simg+'">')
                ._('</div>')
                ._('<div class="tt-goods-infor">')
                ._('<p class="goods-name">'+dataItem[i].pname+'</p>')
                ._('<p class="font12"><span class="txt-grey">期号：</span>'+dataItem[i].period+'</p></div>')

                if(dataItem[i].staus)
                {
                	H.goodsreveal.type[i]=1;
                	H.goodsreveal.isTimeOver[i]=true;
                	if(new Date().getTime()>(timestamp(dataItem[i].lotterytime)+H.goodsreveal.dec))
					{
						t._('<div class="countdown">')
		                ._('<p class="ico-countdown">')
		                ._('<i></i>即将揭晓</p>')
		                ._('<p class="txt-red" style="padding:2px;font-size:24px">努力揭晓中</p>') 
		                ._('</div> </div></li>')
		                me.timeError[i] = true;
		                console.log(i);
		                me.errorDeal();

					}
					else
					{
						if(me.timeInterval[i])
						{
							clearInterval(me.timeInterval[i]);
						}
						t._('<div class="countdown">')
		                ._('<p class="ico-countdown">')
		                ._('<i></i>即将揭晓</p>')
		                ._('<p class="detail-countdown" etime="'+(timestamp(dataItem[i].lotterytime)+H.goodsreveal.dec)+'"></p>')
		                ._('</div> </div></li>')   
					}
	 				
                }
                else if(data.now <= timestamp(dataItem[i].lotterytime))
				{
					H.goodsreveal.type[i]=1;
                	H.goodsreveal.isTimeOver[i]=true;

	 				t._('<div class="countdown ">')
	                ._('<p class="ico-countdown">')
	                ._('<i></i>即将揭晓</p>')
	                ._('<p class="detail-countdown" etime="'+(timestamp(dataItem[i].lotterytime)+H.goodsreveal.dec)+'"></p>')
	                ._('</div> </div></li>')   
				}
				else
                {
                	me.timeError[i] = false;
                	if(me.timeInterval[i])
					{
						clearInterval(me.timeInterval[i]);
					}
					if(dataItem[i].winnum)
					{
						t._('<div class="result">')
		                ._('<p class="font12"><span class="txt-grey">获得者：</span><span class="txt-blue">'+dataItem[i].nk+'</span></p>')
		                ._('<p class="font12"><span class="txt-grey">幸运号码：</span><strong class="txt-red">'+dataItem[i].winnum+'</strong></p>')
		                ._('<p class="font12"><span class="txt-grey">参与人次：</span><strong class="txt-red">'+dataItem[i].jcount+'</strong></p>')
		                ._('<p class="font12"><span class="txt-grey">揭晓时间：</span>'+dataItem[i].lotterytime.split(" ")[0]+'</p>')
		                ._('</div>')
					}
					else
					{	
						t._('<div class="result">')
		                ._('<p class="font12 txt-red" style="overflow:auto;white-space:inherit;">商品未开奖，参与者参与所消费的元宝已退回余额。请到个人中心查看</p></p>')
		    
		                ._('<p class="font12"><span class="txt-grey">揭晓时间：</span>'+dataItem[i].lotterytime.split(" ")[0]+'</p>')
		                ._('</div>')

					}
					
                }    
            }

            $(".goods-list ul").empty();
            $(".goods-list ul").append(t.toString());
           
           // 调用倒计时函数
            H.goodsreveal.count_down();
           $(".tt-goods").tap(function(e)
           {
 			    var data_uid= $(this).attr("data-id");
				toUrl("./goodsview.html?goods_id=" + data_uid);
           });
		},
		event:function()
		{
			
		},
        // 开奖开启倒计时
        count_down: function() {
        	var meOut = this;
            $('.detail-countdown').each(function(index,el) {
                var $me = $(this);
                $(this).countDown({
                    etpl: '%M%' + ':' + '%S%' + '.'+'%ms%', // 还有...结束
                    stpl: '%M%' + ':' + '%S%' + '.'+'%ms%', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                          if(!H.goodsreveal.isTimeOver[index] && H.goodsreveal.type[index]==1) {
                                H.goodsreveal.isTimeOver[index] = true;
                          }
                          else if(H.goodsreveal.type[index] == 2)
                          {
                          		return;
                          }
                          else
                          {
                          	    H.goodsreveal.type[index] = 2;
            	                meOut.newOpen(false);
                          	   
                          }
                                
                    },
                    sdCallback: function() {
                        H.goodsreveal.isTimeOver[index] = false;
                    }
                });
            });
        },
	};

	/*===================================
		最新揭晓数据页
	====================================*/
	W.indianaPeriodNewOpenCallBackHandler=function(data)
	{
		if(data.result)
		{
			H.goodsreveal.dec =  new Date().getTime() - data.now; 
			H.goodsreveal.getGoodsTime(data);

		}
	}
	
})(Zepto);

$(function() {
	H.goodsreveal.init();
});