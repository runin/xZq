(function($) {
    H.register = { 
        init: function() {
            var me = this;
            $('.index-bg,.theme').width($(window).width());
            me.event();
        },
        event:function()
        {
        	var me = this;
          var base = 5000;
             
        	setInterval(function()
        	{
        		 // var randomNum = parseInt(Math.random()*10+1);
        		 // var countNum = parseInt($('.count-num').text());
             // var summery = countNum + randomNum;
             // $('.count-num').text(summery.toString());
              getResult("loveMoney/api/count",{},"CountPersonCallBackHandler",false);
        	}, 4000);

        	$('.join_img').click(function()
        	{
        		
        		var $mobile = $('.tel-class'),
                     mobile = $.trim($mobile.val());
        		if(!me.check())
        		{
        			return;
        		}
        		getResult("loveMoney/api/play",{appId:busiAppId,openId:openid,telphone:mobile},"playCallBackHandler",true);
        		$(this).addClass('btnbounceOut');
        		setTimeout(function()
        		{
        			$(".join_img").addClass('btnbounceOut');
        		},1000);
        		
        	});
        },
        check:function()
        {
        	     var $mobile = $('.tel-class'),
                     mobile = $.trim($mobile.val());
                  if (!/^\d{11}$/.test(mobile)) 
                  {
                        showTips('这手机号，可打不通...');
                        return false;
                  }
                 return true;
        }
       }
       W.playCallBackHandler =function(data)
       {
       		if(data.code != 1)
       		{
            window.location.href="http://m.iqianjin.com/event/tiyanjin20150910.jsp?utmSource=2596&utm_source=yntv&utm_medium=cps&utm_campaign=yaoyiyao"
       		}
       		else
       		{
       			showTips(data.message)
       		}
       }
       W.CountPersonCallBackHandler = function(data)
       {
          if(data.result)
          {
            $('.count-num').text(data.personCount);
          }
       }

})(Zepto);

$(function() {
    H.register.init();
});