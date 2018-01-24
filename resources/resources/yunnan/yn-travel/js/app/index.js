(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnRule: $('#btn-rule'),
		$btnAnswer: $('#btn-answer'),
		$btnDeclaration: $('#btn-declaration'),
		$btnReserve: $('#btn-reserve'),
		guide: true,
		init: function() {
			if (!openid) {
				$('.join-box').addClass('none');
				return;
			} else {
				$('.join-box').removeClass('none');
			};
			this.event();
			this.loadShare();
			this.loadResize();
			this.prereserve();
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
		event: function() {
			this.$btnRule.click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			this.$btnAnswer.click(function(e) {
				e.preventDefault();
				toUrl('answer.html');
			});
			this.$btnDeclaration.click(function(e) {
				e.preventDefault();
				toUrl('declaration.html');
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
		loadResize: function() {
			var winW = $(window).width(),
				winH = $(window).height();
			$('html, body, .main').css({
				'height': winH,
				'width': winW
			});
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});