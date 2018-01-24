(function($) {
	
	H.index = {
		init: function() {
			window.callbackMpJsapiTicketHandler = function(data) {};
			$.ajax({
				type: 'GET',
				url: domain_url + 'api/mp/auth/jsapiticket',
				data: {
					mpappid: mpappid
				},
				async: true,
				dataType: 'jsonp',
				jsonpCallback: 'callbackMpJsapiTicketHandler',
				success: function(data){
					if (!data.result) {
						return;
					}
					var nonceStr = 'da7d7ce1f499c4795d7181ff5d045760',
						timestamp = Math.round(new Date().getTime()/1000),
						url = window.location.href.split('#')[0],
						signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
					wx.config({
						debug: true,
						appId: mpappid,   
						timestamp: timestamp,
						nonceStr: nonceStr,
						signature: signature,
						jsApiList: [
							'chooseWXPay'
						]
					});
				},
				error: function(xhr, type){
					 alert('获取微信授权失败！');
				}
			});
		}
	};
	
	H.index.init();
	
	$("#pay-btn").click(function(){
		wx.ready(function() {
			//wx.config成功
		   //执行业务代码
		   pay();
		});
	});
	
})(Zepto);


window.callbackJsjdkPayHandler = function(data) {};

function pay(){
	$.ajax({
		type: 'GET',
		url: domain_url + 'jsjdk/mp/pay/order/pay',
		data: {
			mpAppId: mpappid,
			mpOpenid: openid
		},
		async: true,
		dataType: 'jsonp',
		jsonpCallback: 'callbackJsjdkPayHandler',
		success: function(data){
			var nonce_str = data.nonce_str;
			var prepay_id = data.prepay_id;
			var time_stamp = data.time_stamp;
			var sign_type = data.sign_type;
			var paySign = data.paySign;
			wx.chooseWXPay({
			    timestamp: time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
			    nonceStr: nonce_str, // 支付签名随机串，不长于 32 位
			    package: "prepay_id=" + prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
			    signType: sign_type, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
			    paySign: paySign, // 支付签名
			    success: function (res) {
			        // 支付成功后的回调函数
			    },
			    fail: function(res){
				},
				complete: function(res){
				}
			});
		},
		error: function(xhr, type){
			 alert('支付失败！');
		}
	});
	
}