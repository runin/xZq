通过微信摇电视userinfo接口获取用户头像与昵称开发流程：

1、需要提前向微信人员报备，他们开通特定时间段的授权节目，我方才可以在这个时间段内调用官方提供的脚本API获取用户头像与昵称信息。
2、授权时段由微信人员后台添加，我方提交互动时，不能通过现有的管理台API提交，只能到微信摇电视管理台上，在微信人员添加的授权时段节目下手工添加一个互动。（切记，否则通过管理API提交，会把微信人员开的授权时段节目给覆盖掉，这样我们提交的节目是没有用的。）
3、先通过我们后台接口查询用户是否已经获取并保存了头像、昵称在我方平台数据中，接口是：com.zq.tv.portal.view.me.user.UserController.userinfo(String, HttpServletResponse)
4、如果在我方平台中已经存在了用户的头像、昵称则不需要去调用微信提供的脚本API了，如果我方平台中没有，则需要调用微信脚本API获取
5、具体的获取步骤请参考官网上的说明文档。（请一定详阅，并特别注意用户头像路径问题）
6、最后需要后台调用获取最终今年的接口我已经开发并测试了，接口是：com.zq.tv.portal.view.me.weixin.ShakeTvController.userinfo(String, String, String, HttpServletResponse)

完整的测试样例代码：
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, width=device-width, target-densitydpi=medium-dpi, user-scalable=no">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<meta name="format-detection" content="telephone=no">
	<title>用户授权信息测试</title>	
	<script src="http://yaotv.qq.com/shake_tv/include/js/lib/zepto.1.1.4.min.js"></script>
	<script src="http://yaotv.qq.com/shake_tv/include/js/jsapi_authorize.js"></script>
</head>
<body>
	
	<div>
		<h3 id="h3-nickname"></h3>
	</div>
	<div>
		<img id="img-head" />
	</div>
	<script>	
	
	(function($) {
		shaketv.authorize("wx59a1798e6ac10244","userinfo",function(d){
			alert(d.errorCode + ":"+d.errorMsg + " code:"+d.code);
			 //获得code之后，因secretkey在js中使用会有泄露的风险，所以请通过后台接口获取token、解密code
			 if(d.errorCode == 0){
				$.ajax({
					type : "get",
					async : false,
					url : "http://yaotv.holdfun.cn/portal/shaketv/userinfo?cuuid=a8d6d67c9d2d40439cba35ccba790fc5&code="+d.code,
					dataType : "jsonp",
					jsonp : "callback",
					jsonpCallback : "callbackHandler",
					success : function(data) {
						alert(data);
						alert(data.nickname);
						alert(data.headimgurl);
						$("#h3-nickname").html(data.nickname);
						$("#img-head").attr("src", data.headimgurl+"/0");
					},
					error : function() {
					}
				});
			 }
		});
})(Zepto);
	</script>
</body>
</html>