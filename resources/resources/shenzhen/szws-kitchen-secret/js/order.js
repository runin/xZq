/*
 * 预约
 *
 */
 
(function() {
	H.order = {
		$divId: $("#order"),
		$reserveId: null,
		$dateT: null,
		init: function() {
			H.order.orderFn();
			H.order.orderBnt();
		},
		orderFn: function() {
			$.ajax({
				type: 'GET',
                async: true,
				url: domain_url + "program/reserve/get",
				dataType: "jsonp",
				data: {},
				jsonpCallback: 'callbackProgramReserveHandler',
				success: function(data) {
					if (!data.reserveId) {
						H.order.$divId.hide();//当没有预约的时候隐藏预约按钮
                        return;
                    }else {
                        H.order.$divId.show();
                        H.order.$reserveId = data.reserveId;
						H.order.$dateT = data.date;
                        window['shaketv'] && shaketv.preReserve_v2({tvid:yao_tv_id, reserveid:data.reserveId, date:data.date}, function(resp) {
							if (resp.errorCode == 0) {}
                        });
                    }
				}
			});
		},
		orderBnt: function() {
			H.order.$divId.click(function() {
				if(!H.order.$reserveId) {
					return;
				}
				shaketv.reserve_v2({tvid:yao_tv_id, reserveid:H.order.$reserveId, date:H.order.$dateT},function(data) {});
			});
		}
	};
	H.order.init();
})(Zepto);