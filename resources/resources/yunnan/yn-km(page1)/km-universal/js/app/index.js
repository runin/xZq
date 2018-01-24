(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnJoin: $('#btn-join'),
		$btnReserve: $('#btn-reserve'),
		$btnRule: $('#btn-rule'),
		$btnCls: $('#btn-close'),
		init: function() {
			var winW = $(window).width(),
				winH = $(window).height();
			$('html').css({
				'width': winW,
				'height': winH
			});
			this.event();
			//this.prereserve();
		},
		event: function() {
	
			this.$btnJoin.click(function(e) {
				$('#btn-join').removeClass("bounceInUp");
				$('.join-img').addClass("rotateOutUpLeft");
				toUrl('yaoyiyao.html');

				setTimeout(function()
				{
					// window.location.href = "http://yhq.yuanbenyun.net/Coupon/ReceiveCoupon?from=groupmessage&isappinstalled=0";
				}, 1000);

			});
			this.$btnRule.click(function(e) {
				e.preventDefault();
				$(".black").css({"display":"block","-webkit-animation":"secup 0.4s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
					$(".black").css({"-webkit-animation":"","opacity":"0.6"});
				});
				$(".logo").css({"display":"block","-webkit-animation":"popup 0.4s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
					$(".logo").css({"-webkit-animation":""});
				});
			});
			this.$btnCls.click(function(e) {
				e.preventDefault();
				$(".black").css({"-webkit-animation":"secdown 0.4s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
					$(".black").css({"-webkit-animation":"","display":"none","opacity":"0"});
				});
				$(".logo").css({"-webkit-animation":"popdown 0.4s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
					$(".logo").css({"-webkit-animation":"","display":"none"});
				});
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
	};
})(Zepto);

$(function() {
	H.index.init();
});