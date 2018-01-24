/**
 * 零距离-首页
 */
(function($) {

	H.index = {
		from: getQueryString('from'),
		$btnReserve: $('#btn-reserve'),
		init: function () 
		{
			$('img.logo').addClass("index-bounce");
			$('footer img').addClass("bounce-btn");	
			setTimeout(function()
			{
				$('img.logo').removeClass("index-bounce");
				$('footer img').removeClass("bounce-btn");	
			}, 1000);
			this.event();
			this.prereserve();
		},
		//预约功能
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
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				$('#btn-rule').addClass('flash');
				setTimeout(function()
				{
				   $('#btn-rule').removeClass('flash')
					H.dialog.rule.open();
				}, 800);
				
			});
			$('#btn-join').click(function(e) {
				e.preventDefault();
				    $('#btn-join').addClass('tada');
				setTimeout(function()
				{
					$('#btn-join').removeClass('tada');
				},1000);
				toUrl("yiyao.html");
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
		}	
	}
	
})(Zepto);                             

$(function(){
	$("body").css("height",$(window).height());
	H.index.init();
});


