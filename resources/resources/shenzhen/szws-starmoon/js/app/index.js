
(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnRule: $('#btn-rule'),
		$btnJoin: $('#btn-join'),
		$btnReserve: $('#btn-reserve'),
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
			//var current = 0, randomNum = Math.random() * 10 + 50, exp = new Date();
			//exp.setTime(exp.getTime() + 0.1*60*60*1000);
			//if($.fn.cookie(mpappid + '_load')){
			//	$('.load-percent').html('好故事即将开始...100%');
			//	current = 100;
			//	setTimeout(function() {
			//		$('header, .content').removeClass('none');
			//		$('.load-box').animate({'opacity':'0'}, 0, function() {
			//			$(this).addClass('none');
			//		});
			//	}, 800);
			//}else{
			//	var loadTime = setInterval(function(){
			//		current = 100;
			//		//$('.load-percent').html('好故事即将开始...' + current + '%');
			//		if(current == 100) {
			//			clearInterval(loadTime);
			//			$('header, .content').removeClass('none');
			//			$('.load-box').animate({'opacity':'0'}, 0, function() {
			//				$(this).addClass('none');
			//			});
			//		}
			//	},randomNum);
			//	$.fn.cookie(mpappid + '_load', 'true', {expires: exp});
			//};
			//$('header, .content').addClass('none');
			//$('html').css({
			//	'height': winH,
			//	'width': winW
			//});
			//$('.item-animate').removeClass('none').addClass('animated');
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
				url : domain_url + 'program/reserve/get' +dev,
				data: {},
				dataType : "jsonp",
				jsonpCallback : 'callbackProgramReserveHandler',
				success : function(data) {
					if (!data.reserveId) {
						return;
					}
					window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function(resp){
						if (resp.errorCode == 0) {
							me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId);
						}
					});
				}
			});
		},
		event: function() {
			this.$btnRule.click(function(e) {
				e.preventDefault();
				
				H.dialog.rule.open();
			});
			this.$btnJoin.click(function(e) {
				toUrl('answer.html');
			});
			
			this.$btnReserve.click(function(e) {
				e.preventDefault();
				var reserveId = $(this).attr('data-reserveid');
				if (!reserveId) {
					return;
				};
				shaketv.reserve(yao_tv_id, reserveId, function(data){
				});
			});
		}
	}
})(Zepto);

$(function() {
	H.index.init();
});