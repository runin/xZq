/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		from: getQueryString('from'),
		init: function () {
			this.event_handler();
			this.prereserve();
		},
		event_handler : function() {
			var me = this;
			$('#btn-post').click(function(e) {
				e.preventDefault();
				if (!$(this).hasClass('request')) {
					$(this).addClass('request');
					toUrl("postcard.html");
					setTimeout(function(){
						$(".btn-rule").removeClass('request');
					}, 1000);
				}
				return;
			});
			$('#btn-yao').click(function(e) {
				e.preventDefault();
				if (!$(this).hasClass('request')) {
					$(this).addClass('request');
					toUrl("comment.html");
					setTimeout(function(){
						$(".btn-rule").removeClass('request');
					}, 1000);
				}
				return;
			});
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$("#btn-reserve").click(function(e) {
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
                                $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
				}
			});
		},
	}
	
})(Zepto);                             

$(function(){
	H.index.init();
});


