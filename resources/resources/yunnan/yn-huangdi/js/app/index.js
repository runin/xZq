(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnRule: $('#btn-rule'),
		$btnJoin: $('#btn-join'),
		$btnReserve: $('#btn-reserve'),
		$load_box: $('.load-box'),
		
		init: function() {
			var me = this,
				winW = $(window).width(),
				winH = $(window).height();
			if (!openid) {
				$('.join-box').addClass('none');
				return;
			} else {
				$('.join-box').removeClass('none');
			}
		
			 $('html').css({
			 	'height': winH,
			    'width': winW
			 });
			  //推门动画触发区域
			this.$load_box.click(function(e) {
				$('.load-doorleft').addClass('left-door-turn');
				$('.load-doorright').addClass('right-door-turn');
				 setTimeout(function() {
					$('.load-box').addClass('none');
					$('.load-doorleft').removeClass('left-door-turn');
					$('.load-doorright').removeClass('right-door-turn');
				  }, 1500);
				
				$('header, .content').removeClass('none');
				// 分享时的引导层
				if (H.index.from) {
				    setTimeout(function() {
					H.dialog.guide.open();
				  }, 1000);
			   }
			   else
			   {
			   	 $('.img-join').addClass('side-expand');
			   }
			});

			$('.item-animate').removeClass('none').addClass('animated');
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
			this.$btnRule.click(function(e) {
				e.preventDefault();
				$(this).addClass('pop-opacity');
				H.dialog.rule.open();
			});
			this.$btnJoin.click(function(e) {
				$(this).addClass('pop-scale');
				toUrl('answer.html');
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
	}
})(Zepto);

$(function() {
	H.index.init();
});