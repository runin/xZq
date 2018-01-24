(function($) {
   
    H.rockpacket = {
    		$particleActive : $(".particle-active"),
    		init: function()
    		{
    			var me =this;
    			//调用用户日志
    			me.userlog();
    			//调用ajax 加载数据
    			me.DataShow();

				//触发的事件
    			me.event();

    			//页面效果
    			me.styleShow();

    		},
    		//调用ajax 加载数据
    		DataShow:function()
    		{
    			getResult({ url: business_url + "mpAccount/mobile/winnerRecord/query"});
    		},

    		//点击返回到主菜单
    		event:function()
    		{
    			this.$particleActive.on('click',function(){
					window.location.href="http://yaotv.qq.com/shake_tv/auto/8ry9p7ibukakno/index.html";
			    });
    		},

    		//页面动态效果
    		styleShow: function()
    		{
    			//边框效果
    			setInterval(function(){
				if($("#glitterborder").hasClass("glitter-border"))
				{
					$("#glitterborder").removeClass("glitter-border").addClass("glitter-borderafter");
				}
				else
				{
					$("#glitterborder").removeClass("glitter-borderafter").addClass("glitter-border");
				}

				},800);	
				 /*数据滚动区*/
	   			var _wrap=$('ul.mulitline');//定义滚动区域
				setInterval(function(){
					     var _h=$('ul.mulitline > li:first').height();//取得每次滚动高度
					     $('ul.mulitline > li:first').animate({marginTop:-(_h)},600,function(){//通过取负margin值，隐藏第一行
						 $('ul.mulitline').append("<li>"+$('ul.mulitline > li:first').html()+"</li>");
					     $('ul.mulitline > li:first').remove();
					   })
				},1000)//滚动间隔时间取决于_interval

    		},
    		userlog:function()
    		{
    			getResult({ url: business_url + "mpAccount/mobile/user/operate/log/add", callbackAddUserOperateLogHandler: function (data) {
                }, data: {
                    appId: busiAppId,
                    openId: openid,
                    eventDesc: "",
                    eventId: "",
                    isPageLoad: true
                }, showload: false
                });
    		}
        };
        W.callBackQueryWinnerRecord = function(data)
		    {
				if(data.code == 0)
				{
						/**
						 * 实体类一揽
						 * @type {[type]}
						 */
						var objlength=data.result.objPrizes.length;
						var objPrizes = data.result.objPrizes;
						var html = "<li><ul>";
						var imgurl;
						var win = $(window).width();
						var width = (win-304)*0.30;
						for(var i=0;i<objlength;++i)
						{	
							if(i ==0)
							{
								html += '<li class="midcollspace"></li>'
							}
							var idname = "imageprice"+i;
							
							html += '<li><div class="images"><div class="image-prize" id='+idname+'></div><div class="botoomset"></div><span class="price-name">'+objPrizes[i].prize+'被</span>'+'<span class="user-name">'+objPrizes[i].nickName+"<span>领走了</span></span></div>";

							if((i+1)%2 == 0 && i!=0)
							{
								html += '</ul><li><ul><li class="midcollspace"></li>'
							}
							else
							{
								html += '</li><li class="midcollspace"></li>'
							}
						}
						$("#contentimages").find(".image-list").append(html);
						$("#contentimages").find(".midcollspace").css("width",width+'px');
						$("#contentimages").find(".image-list > li:last").remove();
						
						/*
							获取中奖实体图
						 */
						for(var i=0;i<objlength;++i)
						{	
							var idname = "imageprice"+i;
							imgurl = objPrizes[i].prizeImg;
							if(imgurl)
							{
								$("#"+idname).css({"background":"url("+imgurl+")","background-size":"100% 100%;"});
							}
							else
							{
								$("#"+idname).css({"background":"url(./images/rockpacket/prizeimg11.png)","background-size":"100% 100%;"});
							}
							
						}
					}
					if(data.code == 0)
					{

						/**
						 * 小奖一揽
						 * @type {[type]}
						 */
						var objlength=data.result.redPrizes.length;
								var redPrizes = data.result.redPrizes;
								var html = '<ul class="mulitline">';
								var imgurl;
						for(var i=0;i<objlength;++i)
						{   
							html += "<li>";
							//电话加密
							var phoneNum = redPrizes[i].phone.slice(0,3)+"****"+redPrizes[i].phone.slice(7,11);
							html += '<ul class="inline-li"><li>'+redPrizes[i].nickName+'</li>'+'<li>'+phoneNum+'</li>'+'<li>'+redPrizes[i].serviceName+'</li>'+'<li>'+redPrizes[i].prize+'</li></ul>';
							if(redPrizes[i].prize)
							html += "</li>";
						}
						html +="</ul>"
					    $("#contentresult").find(".inner-border").append(html); 
					}

					/*
						活动说明的弹出层
					 */
					$('.pagetitle').on('click',function(){
							H.dialog.rule.open();	
							$('.rule-con span').html(data.result.actDesc);
					});				
		};
    
})(Zepto);

$(function(){
	 H.rockpacket.init();
});
