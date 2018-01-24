(function($) {
	H.index = {
		from: getQueryString('from'),
        $btn_join: $('.index-btn'),
        $btnReserve: $('#btn-reserve'),
		init: function() {
			this.eventHander();
		},
		eventHander:function()
		{
			var that = this;
			that.$btn_join.on("click",function()
			{	
				toUrl("comments.html");
			});
		},
		prereserve: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/program/reserve/get'+dev,
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
	}
})(Zepto);

$(function() {
	H.index.init();
});