(function($) {
    H.rockpacket = {
    		$particleActive : $(".particle-active"),
    		$btnRule : $(".btn-rule"),
    		$rockBegin : $(".rock-begin"),
    		init: function()
    		{
    			var wid = $(window).width();
    			var lef = (wid-88)/2;
          var imgrdw = (wid-20);
          $(".img-round").css({"width":imgrdw,"height":imgrdw*0.96});
          
    			this.$btnRule.css("left",lef);
          this.$rockBegin.addClass("pop-skew");

    			var me =this;
    			//调用用户日志
    			me.userlog();
    			//调用ajax 加载数据
    			//me.DataShow();
    			//效果展示
    			me.showStyle();
				  //触发的事件
    			me.event();

    		},
    		//调用ajax 加载数据
    		DataShow:function()
    		{
    			getResult({ url: business_url + "mpAccount/mobile/winnerRecord/query/"+busiAppId+"/"+type});
    		},

    		//点击返回到主菜单
    		event:function()
    		{   
           
			    this.$btnRule.on('click',function(){
			    	    H.dialog.rule.open();
			       });
			    this.$rockBegin.on('click',function(e){
			     	  e.preventDefault();
              $(".img-round").addClass("shaking");
               var num = Math.random()*2+3;
               if(count>0)
               {
                  if(num > 4)
                  {
                    setTimeout(function(){
                    H.dialog.rockPize.open();
                    H.music.audioStop();
                    H.music.audioZj();
                    },700);
                  }
                  else
                  {
                    setTimeout(function(){
                     showTips("很可惜没有中奖");
                     $(".img-round").removeClass("shaking");
                    },700); 
                    count--;
                    $(".index-title span").text("还有"+count);         
                  }
               }
               else
               {
                  $(".index-title").text("您今天摇奖机会已用完");
               }      
			    });
    		},
    		showStyle:function()
    		{
          $(".money-right").addClass("popturn")
    			setInterval(function()
    			{
	    			if(!$(".money-right").hasClass("popturn"))
	    			{
	    				$(".money-right").addClass("popturn");
	    			}
	    			else
	    			{
	    				$(".money-right").removeClass("popturn");
	    			};
    			},5000);	
  
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
        
})(Zepto);

$(function(){
	 H.rockpacket.init();
});
