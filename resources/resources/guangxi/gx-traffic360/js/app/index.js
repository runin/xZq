(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnRule: $('#btn-rule'),
		$btnAnswer: $('#btn-answer'),
		$btnDeclaration: $('#btn-declaration'),
		$btnReserve: $('#btn-reserve'),
		guide: true,
		init: function() {
			$(".join-box").height($(window).width()*0.64*250/367);
			if(!openid){
				shownewLoading();
				return;
			}
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
			this.$btnAnswer.click(function(e) {
				e.preventDefault();
				$(".join-box").addClass("move");
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
		},
	};
})(Zepto);

$(function() {
	H.index.init();
});