(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnRule: $('#btn-rule'),
		$btnJoin: $('#btn-join'),
		$btnReserve: $('#btn-reserve'),
		CHKINDEX:1,
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
			var current = 0, randomNum = Math.random() * 10 + 50, exp = new Date();
			exp.setTime(exp.getTime() + 0.1*60*60*1000);
			if($.fn.cookie(mpappid + '_load')){
				$('.load-percent').html('好故事即将开始...100%');
				setTimeout(function() {
					$('header, .content').removeClass('none');
					$('.load-box').animate({'opacity':'0'}, 1000, function() {
						$(this).addClass('none');
					});
				}, 800);
			}else{
				var loadTime = setInterval(function(){
					current++;
					$('.load-percent').html('好故事即将开始...' + current + '%');
					if(current == 100) {
						clearInterval(loadTime);
						$('header, .content').removeClass('none');
						$('.load-box').animate({'opacity':'0'}, 1000, function() {
							$(this).addClass('none');
						});
					}
				},randomNum);
				$.fn.cookie(mpappid + '_load', 'true', {expires: exp});
			};
			$('header, .content').addClass('none');
			$('html').css({
				'height': winH,
				'width': winW
			});
			$('.item-animate').removeClass('none').addClass('animated');
			this.event();
			this.prereserve();
			if (this.from) {
				setTimeout(function() {
					H.dialog.guide.open();
				}, 1000);
			}
		},
		prereserve: function() {
			var me = this;
			$.ajax({
				type : 'GET',
				async : true,
				url : domain_url + 'api/program/reserve/get'+dev,
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
				$('#btn-rule').css({"-webkit-animation":"toggle 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).on("webkitAnimationEnd", function () {
					H.dialog.rule.open();
					$(".rule-dialog").css({"-webkit-animation":"dispshow 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("webkitAnimationEnd", function () {
						$('.rule-dialog').css({"-webkit-animation":""});
						$('#btn-rule').css({"-webkit-animation":""});
					});
				});
			});

			this.$btnJoin.click(function(e) {
				e.preventDefault();
				$(this).css({"-webkit-animation":"toggle 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).on("webkitAnimationEnd", function () {
					toUrl('yao.html');
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
		}
	}
})(Zepto);

$(function() {
	H.index.init();
});