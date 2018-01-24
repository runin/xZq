(function($) {
	H.index = {
		$go: $('.go'),
		$btnReserve: $('#btn-reserve'),
		init: function() {this.event();
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
			var me = H.index;
			$(".btn-rule").click(function(e) {
				e.preventDefault();
				me.btn_animate($(this));
				//H.dialog.rule.open();
				toUrl("info.html");
			});
			this.$go.one("click",function(e) {
				e.preventDefault();
				me.btn_animate($(this));
				toUrl('vote.html');
			});
			this.$btnReserve.click(function(e) {
				e.preventDefault();
				me.btn_animate($(this));
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
		btn_animate: function(str){
			str.addClass('flipInY');
			setTimeout(function(){
				str.removeClass('flipInY');
			},200);
		}
	};
})(Zepto);

$(function() {
	H.index.init();
});