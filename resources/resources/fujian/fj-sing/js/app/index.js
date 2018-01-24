(function($) {
	H.index = {
		from: getQueryString('from'),
		nowTime: null,
		init: function() {
			this.event();
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
                                $('#btn-reserve').removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
				}
			});
		},
		event: function() {
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$('#index-record').click(function(e) {
				e.preventDefault();
				H.dialog.record.open();
			});
			$('#index-join').click(function(e) {
				e.preventDefault();
				if(H.lottery.indexFlag==2)
				{
					$('#index-join').addClass("scaleShow");
					setTimeout(function()
					{
						$('#index-join').removeClass("scaleShow");
					    $("#yaoyiyao").removeClass('none');
					}, 640);
					
					var height = $(window).height(),
					    width = $(window).width();
					$('.modal').css({ 'width': width, 'height': height });
					$('.yaoyiyao-dialog').css(
					{
						"height":height*0.60,
						"width":width*0.9,
						"top":height*0.2,
						"left":"50%",
						"margin-left":-width*0.45
					});
					$('.back-index').css("top",height*0.82);
					H.lottery.isCanShake = true;
					H.lottery.shake();
				}
				
			});
			$('#yao-close').click(function(e) {
				e.preventDefault();

				$(this).closest("section").addClass("none");
				$(".yao-cool-tips").removeClass("none-tips");
				$(".yao-cool-tips").addClass("none");
				H.lottery.isCanShake = false;

			});
			$('#yao-back-index').click(function(e) {
				e.preventDefault();
				$(this).closest("section").addClass("none");
				toUrl("index.html");

			});
			$('#btn-lottery').click(function(e) {
				e.preventDefault();
				toUrl('lottery.html');
			});
			$('#btn-reserve').click(function(e) {
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
                            $('#btn-reserve').addClass('none');
                        }
                    });
			});
		}
		
	};

})(Zepto);

$(function() {
	H.index.init();
});