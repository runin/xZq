/**
 * 零距离-首页
 */
(function($) {

	H.index = {
		from: getQueryString('from'),
		$btnReserve: $('#btn-reserve'),
		flag:true,
		init: function () 
		{
			// var current = 0, randomNum = Math.random() * 10 + 50, exp = new Date();
			// exp.setTime(exp.getTime() + 0.1*60*60*1000);
			// if($.fn.cookie(mpappid + '_load'))
			// {
			// 	H.index.indexLoad();
			// 	$('header, .container,footer').removeClass('none');
			// 	$('.load-box').addClass("none");

			// }else{
				
			// 	$.fn.cookie(mpappid + '_load', 'true', {expires: exp});
			// };
			setTimeout(function() {
					$('header, .container,footer').removeClass('none');
					if(H.index.flag)
					{
						H.index.indexLoad();
					}
					$('.load-box').animate({'opacity':'0'}, 1000, function() {
						$(this).addClass('none');
					});
			 }, 5000);
			this.event();
			this.prereserve();
		},
		//预约功能
		prereserve: function() {
			var me = this;
			$.ajax({
				type : 'GET',
				async : true,
				url : domain_url + 'api/program/reserve/get',
				data: {},
				dataType : "jsonp",
				jsonpCallback : 'callbackProgramReserveHandler',
				success : function(data) {
					
					if (!data.reserveId) {
						return;
					}
                    window['shaketv'] && shaketv.preReserve_v2({
                            tvid:yao_tv_id,
                            reserveid:data.reserveId,
                            date:data.date},
                        function(resp){
                            if (resp.errorCode == 0) {
                                me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                     });
				}
			});
		},
		event: function() {
			$(".load-box").on("touchend",function()
			{
				    $('header, .container,footer').removeClass('none');
				
				    H.index.flag=false;
				    H.index.indexLoad();
					$('.load-box').animate({'opacity':'0'}, 1000, function() { 
						$(this).addClass('none');
					});
			})
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				$('#btn-rule').addClass('flash');
				setTimeout(function()
				{
				   $('#btn-rule').removeClass('flash')
					H.dialog.rule.open();
				}, 800);
				
			});
			$('#btn-join').click(function(e) {
				e.preventDefault();
				$("#btn-join").css({"-webkit-animation-name":"rotateOut","-webkit-animation-iteration-count":"1","-webkit-animation-duration": ".6s"});
				$("#btn-join").on("webkitAnimationEnd", function () {
					$("#btn-join").css({"-webkit-animation":"","display":"none"});
			     });
				toUrl("yaoyiyao.html");
			});
			this.$btnReserve.click(function(e) {
				e.preventDefault();
				var reserveId = $(this).attr('data-reserveid');
				var date = $(this).attr('data-date');
				if (!reserveId || !date) {
					return;
				};
                window['shaketv'] && shaketv.reserve_v2({
                        tvid:yao_tv_id,
                        reserveid:reserveId,
                        date:date},
                    function(d){
                        if(d.errorCode == 0){
                            H.index.$btnReserve.addClass('none');
                        }
                    });
			});
		},
		indexLoad:function()
		{
	

				$('img.logo').addClass("index-bounce");
				$('footer img').addClass("bounce-btn");	
				setTimeout(function()
				{
					$('img.logo').removeClass("index-bounce");
					$('footer img').removeClass("bounce-btn");	
				}, 1000);
		}	
	}
	
})(Zepto);                             

$(function(){
	$("body").css("height",$(window).height());
	H.index.init();
});


