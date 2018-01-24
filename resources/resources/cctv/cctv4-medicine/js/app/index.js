(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnRule: $('#btn-rule'),
		$btnAnswer: $('#btn-answer'),
		$btnReserve: $('#btn-reserve'),
		$btnSign: $('#btn-sign'),
		guide: true,
		init: function() {
			if (!openid) {
				$('.join-box').addClass('none');
				return;
			} else {
				$('.join-box').removeClass('none');
			};
			this.event();
			this.prereserve();
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
			this.$btnAnswer.click(function(e) {
				e.preventDefault();
				toUrl('answer.html');
			});
			this.$btnSign.click(function(e) {
				e.preventDefault();
				toUrl('lottery.html');
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
	};
})(Zepto);

$(function() {
	H.index.init();
});