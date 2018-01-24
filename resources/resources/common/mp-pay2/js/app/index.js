(function($) {
	
	window.callbackShopMallOrderSubmitOrder = function(data) {};
	
	$("#buy-btn").click(function(){
		$.ajax({
			type: 'GET',
			url: domain_url + 'api/shop/order/submit',
			data: {
				yo: openid,
				ph: '18664902112',
				qt: 1,
				tid : '08128af241c94bf981c831efab3774fb',
				pt : '2',
			},
			async: true,
			dataType: 'jsonp',
			jsonpCallback: 'callbackShopMallOrderSubmitOrder',
			success: function(data){
				if(data.code == 0){
					location.href = data.redirectUrl;
				}else{
					alert('下单失败！');
				}
			},
			error: function(xhr, type){
				 alert('下单失败！');
			}
		});
	});
})(Zepto);