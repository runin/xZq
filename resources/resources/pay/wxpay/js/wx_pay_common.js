// 商户公共函数，开始-----------------------------------------------------------------------
function getQueryString(name) {
	var currentSearch = decodeURIComponent(location.search.slice(1));
	if (currentSearch != '') {
		var paras = currentSearch.split('&');
		for ( var i = 0, l = paras.length, items; i < l; i++) {
			items = paras[i].split('=');
			if (items[0] === name) {
				return items[1];
			}
		}
		return '';
	}
	return '';
};

function getAppId() {
	return $("#hid_appId").val();// 深圳市东启商贸有限公司AppID
}
function getAccessToken() {
	return $("#hid_accessToken").val();
}
function getSignType() {
	return "sha1";
}
function getPaySignType() {
	return "MD5";
}
function getCurrentUrl() {
	return window.location.href;
}
function getTimeStamp() {
	var timestamp = new Date().getTime();
	var timestampstring = timestamp.toString();// 一定要转换字符串
	oldTimeStamp = timestampstring;
	return timestampstring;
}
function getNonceStr() {
	var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var maxPos = $chars.length;
	var noceStr = "";
	for ( var i = 0; i < 32; i++) {
		noceStr += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	oldNonceStr = noceStr;
	return noceStr;
}

var oldTimeStamp;// 记住timestamp，避免签名时的timestamp与传入的timestamp时不一致
var oldNonceStr; // 记住nonceStr,避免签名时的nonceStr与传入的nonceStr不一致
var prepayId,wh,key,goods,oid; 
// 商户公共函数，结束-----------------------------------------------------------------------

// 共享收货地址函数，开始-------------------------------------------------------------------
// 获取微信共享地址请求时的加密串
function getEditAddressRequestAddrSign() {
	var addressRequestkeyvaluestring = "accesstoken=" + getAccessToken().toString() + "&appid=" + getAppId().toString() + "&noncestr=" + getNonceStr().toString() + "&timestamp="
			+ getTimeStamp().toString() + "&url=" + getCurrentUrl().toString();
	var addrSign = CryptoJS.SHA1(addressRequestkeyvaluestring).toString();
	return addrSign;
}
// 共享收货地址函数，结束-------------------------------------------------------------------

// 微信支付函数，开始-----------------------------------------------------------------------

// 下面是app进行签名的操作：
function getPrepayId() {
	return "prepay_id=" + prepayId;
}
function getKey() {
	return key;
}

function getPaySign() {
	var appid = getAppId().toString();
	var nonce_str = oldNonceStr;
	var packageStr = getPrepayId();
	var signType = getPaySignType();
	var time_stamp = oldTimeStamp;
	// 首先第一步：对原串进行签名，注意这里不要对任何字段进行编码。这里是将参数按照key=value进行字典排序后组成下面的字符串,在这个字符串最后拼接上key=XXXX。由于这里的字段固定，因此只需要按照这个顺序进行排序即可。
	var signString = "appId=" + appid + "&nonceStr=" + nonce_str + "&package=" + packageStr + "&signType=" + signType + "&timeStamp=" + time_stamp + "&key=" + getKey();
	var md5SignValue = ("" + CryptoJS.MD5(signString)).toUpperCase();
	return md5SignValue;
}
// 微信支付函数，结束-----------------------------------------------------------------------
