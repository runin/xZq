$(function() {

	$("#hid_appId").val(getQueryString("appid"));
	$("#hid_accessToken").val(getQueryString("accessToken"));
	$("#hid_openid").val(getQueryString("mpOpenid"));
	$("#hid_oid").val(getQueryString("oid"));

	$("#address").click(function() {
		WeixinJSBridge.invoke('editAddress', {
			"appId" : getAppId(), // 公众号名称，由商户传入
			"scope" : "jsapi_address",
			"signType" : getSignType(), // 微信签名方式:1.sha1
			"addrSign" : getEditAddressRequestAddrSign(),// 签名
			"timeStamp" : oldTimeStamp, // 时间戳
			"nonceStr" : oldNonceStr
		}, function(res) {
			if (res && res.err_msg == "edit_address:ok") {
				$("#address_detail").empty().html(res.proviceFirstStageName + res.addressCitySecondStageName + res.addressCountiesThirdStageName + res.addressDetailInfo);
			}
		});
	})
});

function wxpay() {
	$('#weixinPay').removeAttr("href");
	$('#weixinPay').empty().html("正在支付");
	$.post("http://test.holdfun.cn/portal/mp/pay/order/pay", {
		mpOpenid : $("#hid_openid").val(),
		oid : $("#hid_oid").val(),
		uid : 111
	}, function(data) {
		if (data.code == 0) {
			prepayId = data.prepay_id;
			key = data.key;
			WeixinJSBridge.invoke('getBrandWCPayRequest', {
				"appId" : getAppId(), // 公众号名称，由商户传入
				"timeStamp" : getTimeStamp(), // 时间戳
				"nonceStr" : getNonceStr(), // 随机串
				"package" : getPrepayId(),// 扩展包
				"signType" : getPaySignType(), // 微信签名方式:md5
				"paySign" : getPaySign()
			// 微信签名
			}, function(res) {
				if (res.err_msg == "get_brand_wcpay_request:ok") {
					// 异步后台确认到底是否成功支付了
					alert(" 支付成功！");
				} else {
					$('#weixinPay').attr("href", "javascript:wxpay();");
					$('#weixinPay').empty().html("我要支付");
					alert(" 支付失败！");
				}
				// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
				// 因此微信团队建议，当收到ok返回时，向商户后台询问是否收到交易成功的通知，若收到通知，前端展示交易成功的界面；若此时未收到通知，商户后台主动调用查询订单接口，查询订单的当前状态，并反馈给前端展示相应的界面。
			});
		}else{
			alert(data.message);
		}
	}, "json");
}