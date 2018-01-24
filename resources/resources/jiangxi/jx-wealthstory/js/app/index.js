
(function($)
{
	H.index={
            currentActUuid:"",
		init:function()
		{
		   var me = this,
		       width = $(window).width(),
			   height= $(window).height(),
			   paddingTop =400*width/640;
			   $(".main").css("padding-top",paddingTop);
			   $(".main-cont").show();
			   $('body').height(height);
			   me.eventhander();
			   
		},
		eventhander:function()
		{
			$("#btn-begin").click(function(e){
				 e.preventDefault();
				if(openid == "" || openid == null){
					return;
				}
				$("#btn-begin").addClass("rotate-Out");
				$("#btn-begin").css({"-webkit-animation-name":"rotateOut","-webkit-animation-iteration-count":"1","-webkit-animation-duration": ".6s"});
				$("#btn-begin").on("webkitAnimationEnd", function () {
					$("#btn-begin").css({"-webkit-animation":"","display":"none"});
			     });
				toUrl("yiyao.html");
	        });
			$("#btn-rule").click(function(e){
				e.preventDefault();
				$('#btn-rule').addClass('tada');
                setTimeout(function()
                {
                	H.dialog.rule.open();
                    $('#btn-rule').removeClass('tada');
                },1000);
				if(openid == "" || openid == null){
					return;
				}
				
			});
	
		}
	
	}

})(Zepto);

$(function() {
	H.index.init();
});
    