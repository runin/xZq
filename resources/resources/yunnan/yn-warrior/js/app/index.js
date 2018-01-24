(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnRule: $('#btn-rule'),
		$btnJoin: $('#btn-join'),
		$btnReserve: $('#btn-reserve'),
		$shooter: $('.wrapper'),
		guide: true,
		shoot: true,
		init: function() {
			var winW = $(window).width(),
				winH = $(window).height();
			$('html, .wrapper .wall-after').css({
				'width': winW,
				'height': winH
			});
			$('.item-animate').removeClass('none').addClass('animated');
			this.event();
			this.prereserve();
			this.loadShare();
			// this.loadShoot();
		},
		prereserve: function() {
			var me = this;
			$.ajax({
				type : 'GET',
				async : true,
				url : domain_url + 'program/reserve/get',
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
				if ($(this).hasClass('disabled')) {
					return;
				};
				showLoading();
			});
			
			this.$btnReserve.click(function(e) {
				e.preventDefault();
				var reserveId = $(this).attr('data-reserveid');
				if (!reserveId) {
					return;
				}
				shaketv.reserve(yao_tv_id, reserveId, function(data){
					
				});
			});
			this.$shooter.click(function(e) {
				e.preventDefault();
				if ($('.wrapper').hasClass('run')) {
					return;
				};
				$("#shoot").get(0).play();
				$('.wrapper').addClass('run shoot');
				$('.gun-fire').removeClass('none');
				$('.gun-cross, .gun-tips').addClass('none');
				$('.wall-after').addClass('shoot1');
				setTimeout(function(){
					$('.wall-after').addClass('shoot2');
					setTimeout(function(){
						$('.wall-after').addClass('shoot3');
						$('.gun-fire').addClass('none');
						$('.gun-cross, .gun-tips').removeClass('none');
						$('.wrapper').addClass('fade-zoom-out');
						$("#shoot").get(0).pause();
						setTimeout(function(){
							$('.wrapper').addClass('none').removeClass('run shoot fade-zoom-out');
							$('.wall-after').removeClass('shoot1 shoot2 shoot3');
						}, 2000);
					}, 300);
				}, 400);
			});
			if (openid) {
				this.$btnJoin.attr('href', 'answer.html');
			} else {
				this.$btnJoin.addClass('disabled');
			}
		},
		loadShare: function() {
			var me = this,
				exp = new Date();
			exp.setTime(exp.getTime() + 1*60*60*1000);
			if($.fn.cookie(mpappid + '_guide')){
			}else{
				if (me.from == 'share') {
					H.dialog.guide.open();
					$.fn.cookie(mpappid + '_guide', me.guide, {expires: exp});
				};
			};
		},
		loadShoot: function() {
			var me = this,
				exp = new Date();
			exp.setTime(exp.getTime() + 1*60*60*1000);
			if($.fn.cookie(mpappid + '_shoot')){
				$('.wrapper').addClass('none');
			}else{
				$('.wrapper').removeClass('none');
				$.fn.cookie(mpappid + '_shoot', me.shoot, {expires: exp});
			};
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});