(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnRule: $('#btn-rule'),
		$btnYao: $('#btn-yao'),
		$btnCos: $('#btn-cos'),
		$btnReserve: $('#btn-reserve'),
		init: function() {
	
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
			var me = this;	
			me.$btnRule.click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			me.$btnYao.click(function(e) {
				e.preventDefault();
				toUrl('yaoyiyao.html');
			});
			me.$btnCos.click(function(e) {
				e.preventDefault();
				toUrl('photo.html');
			});
			me.$btnReserve.click(function(e) {
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
                });
			});
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});