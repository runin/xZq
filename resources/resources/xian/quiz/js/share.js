if (window.WeixinJSBridge) {
	init();
} else {
	if (document.addEventListener) {
		document.addEventListener("WeixinJSBridgeReady", init, false);
	} else if (document.attachEvent) {
		document.attachEvent("WeixinJSBridgeReady", init);
		document.attachEvent("onWeixinJSBridgeReady", init);
	}
}
function init() {
	WeixinJSBridge.on("menu:share:appmessage", shareToFriend);
	WeixinJSBridge.on("menu:share:timeline", shareToTimeline);
}
function shareToFriend() {
	WeixinJSBridge.invoke("sendAppMessage", {
		img_url : share_img,
		link : addOpenid(),
		desc : share_desc,
		title : share_group
	}, function(res) {
	});
}
function shareToTimeline() {
	WeixinJSBridge.invoke("shareTimeline", {
		img_url : share_img,
		link : addOpenid(),
		desc : share_desc,
		title : share_title
	}, function(res) {
	});
}

function addOpenid(){
	var url = window.location.href;
	if(url.indexOf("resopenid=") > 0){
		url = replaceParamVal('resopenid',hex_md5(openid));
	}else{
		if (url.indexOf(".html?") > 0) {
			url = url + "&resopenid=" + hex_md5(openid);
		} else {
			url = url + "?resopenid=" + hex_md5(openid);
		}
	}
	return url
}

function replaceParamVal(paramName,replaceWith) {
    var oUrl = this.location.href.toString();
    var re=eval('/('+ paramName+'=)([^&]*)/gi');
    var nUrl = oUrl.replace(re,paramName+'='+replaceWith);
    return nUrl;
}