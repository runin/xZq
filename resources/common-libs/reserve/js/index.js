(function($) {
	H.index = {
		$btnReserve: $('#btn-reserve'),
		init: function() {
			
			this.event();
			this.prereserve();
			
		},
		
		// 检查该互动是否配置了预约功能
		prereserve: function() {
			var me = this;
			$.ajax({
				type : 'GET',
				async : true,
				url : domain_url + 'program/reserve/get',
				data: {},
				dataType : "jsonp",
				jsonpCallback : 'callbackProgramReserveHandler',
				success : function(data) {
					if (!data.reserveId) {
						return;
					}
					// yao_tv_id: 微信为电视台分配的id
					window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function(resp){
						if (resp.errorCode == 0) {
							me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId);
						}
					});
				}
			});
		},
		
		event: function() {
			this.$btnReserve.click(function(e) {
				e.preventDefault();
				
				var reserveId = $(this).attr('data-reserveid');
				if (!reserveId) {
					return;
				}
				shaketv.reserve(yao_tv_id, reserveId, function(data){});
			});
			
		}
			
	};
})(Zepto);

$(function() {
	H.index.init();
});