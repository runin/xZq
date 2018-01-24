(function($){
	H.popshare={		
		 $paysubmit:$(".pay-submit"),
         $redBtn:$(".redBtn"),
         $container: $('body'),
         $share: $('.share'),
         
		init:function()
		{
			this.event();
			this.open();
		},
		open: function() {
            var winW = $(window).width(),
            	winH = $(window).height(),
           		shareW = winW * 0.94,
				shareH = shareW * 1.32,
				shareT = (winH - shareH) / 2 - 30,
				shareL = (winW - shareW) / 2;
				$('.share-dialog').css({
					'width': shareW,
					'height': shareH,
					'top': shareT,
					'left': shareL
			});
            $("section.modal").animate({'opacity':'1'}, 500);
			$("section.modal").removeClass("none");
        },
        event: function() {
            var me = this;
            me.$redBtn.on("click",function()
            {
               	$(this).closest(".modal").find(".share").removeClass("none");
            });
            me.$share.click(function () {
	            $(this).addClass("none");
	        });
        },
	};
	H.popshare.init();
})(Zepto)