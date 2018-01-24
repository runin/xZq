(function($) {
	$("#pay-btn").click(function() {
		pay();
	});
})(Zepto);

window.callbackUnifiedorderHandler = function(data) {
};

function pay() {
	var orderUuid = getQueryString('oid');
	$.ajax({
		type : 'GET',
		url : domain_url + 'api/mp/unifiedorder',
		data : {
			oid : orderUuid
		},
		async : true,
		dataType : 'jsonp',
		jsonpCallback : 'callbackUnifiedorderHandler',
		success : function(data) {
			var nonce_str = data.nonce_str;
			var prepay_id = data.prepay_id;
			var time_stamp = data.time_stamp;
			var sign_type = data.sign_type;
			var paySign = data.paySign;
			var appid = data.appid;
			var succHtml = data.succHtml;
			var failHtml = data.failHtml;
			WeixinJSBridge.invoke('getBrandWCPayRequest', {
				"appId" : appid, // 公众号名称，由商户传入
				"timeStamp" : time_stamp, // 时间戳
				"nonceStr" : nonce_str, // 随机串
				"package" : "prepay_id=" + prepay_id,// 扩展包
				"signType" : sign_type, // 微信签名方式:md5
				"paySign" : paySign
			// 微信签名
			}, function(res) {
				if (res.err_msg == "get_brand_wcpay_request:ok") {
					// 异步后台确认到底是否成功支付了
					alert(" 支付成功！");
					location.href = succHtml;
				} else {
					alert(" 支付失败！");
					location.href = failHtml;
				}
				// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
				// 因此微信团队建议，当收到ok返回时，向商户后台询问是否收到交易成功的通知，若收到通知，前端展示交易成功的界面；若此时未收到通知，商户后台主动调用查询订单接口，查询订单的当前状态，并反馈给前端展示相应的界面。
			});
		},
		error : function(xhr, type) {
			alert('支付失败！');
		}
	});

}