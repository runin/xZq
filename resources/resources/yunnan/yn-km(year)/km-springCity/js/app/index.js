(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnJoin: $('#btn-join'),
		$btnReserve: $('#btn-reserve'),
		$btnRule: $('#btn-rule'),
		
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
			$(".join-img").on("webkitAnimationEnd",function()
			{
				$(".index-join").addClass("fadeIn").removeClass("none");
				$(".index-rule").addClass("fadeIn").removeClass("none");
				
			});
			this.$btnJoin.click(function(e) {
				$(this).addClass("joinscale-btn").removeClass("fadeIn");
				$(this).on("webkitAnimationEnd",function()
				{
					toUrl('yaoyiyao.html');
				})

			});
			this.$btnRule.click(function(e) {
				H.dialog.rule.open();
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
		},

	};
})(Zepto);

$(function() {
	H.index.init();
});