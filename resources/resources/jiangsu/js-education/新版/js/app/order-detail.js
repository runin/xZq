$(function() {

	(function($) {

		H.orderDetail = {

			init : function() {

				$(".detail-wrapper").css('min-height',$(window).height() - 40 - 37 -46);
				$uuid = getQueryString('id');
				if($uuid){
					showLoading();
					getResult('api/mall/order/detail',{
						openid: openid,
						orderUuid: $uuid
					},'callbackMallOrderDetail');
				}else{
					alert('订单不存在');
					location.href = './order.html';
				}
			},

			initDetail: function(data){
				if(data.at){
					$("#time").html(data.at);
				}
				if(data.rl){
					$("#rl").html(data.rl);
				}
				if(data.ad){
					$("#ad").html(data.ad);
				}
				if(data.ph){
					$("#ph").html(data.ph);
				}
				if(data.ii){
					$("#ii").attr('src',data.ii);
				}
				if(data.is){
					$("#is").html(data.is);
				}
				if(data.iuid){
					$("#link").attr('href','./exchange.html?uuid=' + data.iuid);
				}
				if(data.n){
					$("#n").html(data.n);
				}
				if(data.ip){
					$("#ip").html(data.ip);
				}
				if(data.am){
					$("#am").html(data.am);
				}
			}

		};

		W.callbackMallOrderDetail = function(data) {
			hideLoading();
			if (data.code == 0) {
				H.orderDetail.initDetail(data);
			} else {
				alert('订单不存在');
				location.href = './order.html';
			}
		};

	})(Zepto);

	H.orderDetail.init();

});
