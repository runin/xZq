$(function() {
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
			
  	getResult('api/common/promotion', {oi:openid}, 'commonApiPromotionHandler',false);
	W.commonApiPromotionHandler = function(data){
    	if(data.code == 0){
			var jumpUrl = data.url;
			$(".ddtj-text").html(data.desc);
			$(".ddtj-box").attr("data-href",jumpUrl);
			$(".ddtj-before").addClass("whole");
			$(".ddtj").removeClass("none");
			$(".ddtj-box").click(function(e){
				e.preventDefault();
				shownewLoading();
				window.location.href = $(this).attr("data-href");
			})
		}else{
			$(".ddtj").addClass("none");
		}
    }
});