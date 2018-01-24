/**
 * 乡村大世界-结束页
 */
(function($) {
    H.end = {
        init: function () {
            this.event_handler();
            this.prereserve();
            this.pre_img();
        },
        event_handler : function() {
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
                        if(d.errorCode == 0){
                            $("#btn-reserve").addClass('none');
                        }
                    });
            });

        },
        pre_img : function(){
        	 getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler');
        },
        // 检查该互动是否配置了预约功能
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
        }
    }

	window.callbackLinesDiyInfoHandler = function(data){
		hidenewLoading();
		if(data&&data.code == 0&&data.gitems&&data.gitems[0].ib){
			$(".pre-img").find("img").attr("src",data.gitems[0].ib);
			$(".info").find(".name").html(data.gitems[0].t);
			$(".info").find(".intro").html(data.gitems[0].info);
			$(".pre").removeClass("none");
		}else{
			$(".pre").addClass("none");
		}
	}
})(Zepto);

$(function(){
    H.end.init();
});


