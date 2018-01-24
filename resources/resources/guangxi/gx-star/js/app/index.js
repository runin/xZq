(function($) {
	H.index = {
		init: function() {
			this.event();
		},
        current_time: function(){
            getResult('api/lottery/round','callbackLotteryRoundHandler',true);
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
			$("#btn-rule").click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$("#btn-join").click(function(e) {
				e.preventDefault();
				
				if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				shownewLoading();
				toUrl('talk.html');
			});
			$("#btn-reserve").click(function(e) {
				e.preventDefault();
				var reserveId = $(this).attr('data-reserveid');
				var date = $(this).attr('data-date');
				if (!reserveId || !date) {
					return;
				}
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
	};
})(Zepto);

$(function() {
	H.index.init();
});