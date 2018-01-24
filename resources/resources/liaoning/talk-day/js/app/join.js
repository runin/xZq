/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		init: function () {
			this.event_handler();
		},
		event_handler : function() {
			$(".title-logo img").attr("src","images/logo.png")
			$(".title-logo img").get(0).onload = function(){
				var me = this;
				$('.title-logo').addClass("showme");		
			}
			$(".btn-history").click(function(e){
				e.preventDefault();
				$(this).addClass("bounceInDownJoin");
				setTimeout(function(){
					$(this).removeClass("bounceInDownJoin")
				},1000);
				toUrl("history.html")
				
			});
			$(".btn-weather").click(function(e){
				e.preventDefault();
				$(this).addClass("bounceInDownJoin");
				setTimeout(function(){
					$(this).removeClass("bounceInDownJoin")
				},1000);
				toUrl("weather.html")
				
			});
			$(".btn-person").click(function(e){
				e.preventDefault();
				$(this).addClass("bounceInDownJoin");
				setTimeout(function(){
					$(this).removeClass("bounceInDownJoin")
				},1000);
				toUrl("user.html")
				
			});
			$(".btn-stage").click(function(e){
				e.preventDefault();
				toUrl("password.html");
				
			});
			$(".btn-reserve").click(function(e){
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
                });
			});
			
		},
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
		}
	}

})(Zepto);                             

$(function(){
	H.index.init();
});


