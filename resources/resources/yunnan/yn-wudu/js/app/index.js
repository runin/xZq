(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnRule: $('#btn-rule'),
		$btnJoin: $('#btn-join'),
		$btnReserve: $('#btn-reserve'),
		init: function() {
			var winW = $(window).width(),
				winH = $(window).height();
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
				}
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
			
			if (openid) {
				this.$btnJoin.attr('href', 'answer.html');
			} else {
				this.$btnJoin.addClass('disabled');
			}
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});