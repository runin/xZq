 var wxData = {
        "appId": busiAppId,
        "imgUrl": share_img,
        "link": window.location.href.split("#")[0],
        "desc": share_desc,
        "title": share_title
   };
(function($) {
		H.wxChat = {
			localId: "",
			serverId: "",
			init: function() {
				window.jsApiTicketCallBackHandler = function(data) {};
				$.ajax({
					type: 'GET',
					url: business_url + 'wx/jsTicket/'+busiAppId,
					data: {
					},
					async: true,
					dataType: 'jsonp',
					jsonpCallback: 'jsApiTicketCallBackHandler',
					success: function(data) {
						if (!data.result) {
							return;
						}
						var timestamp = Math.round(new Date().getTime()/1000),
    	                    nonceStr = "df51d5cc9bc24d5e86d4ff92a9507361",
							url = window.location.href.split('#')[0],
							signature = hex_sha1('jsapi_ticket=' + data.jsapiTicket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);

						wx.config({
							debug: true,
							appId: busiAppId,
							timestamp: timestamp,
							nonceStr: nonceStr,
							signature: signature,
							jsApiList: [
								'onMenuShareTimeline',
								'onMenuShareAppMessage',
								'onMenuShareQQ',
								'onMenuShareWeibo',
								'hideMenuItems',
								'showMenuItems',
								'hideOptionMenu',
								'showOptionMenu'
							]
						});
						wx.ready(function(){
							alert("beigin");
							H.wxChat.MenuShare(wxData);
							H.wxChat.MenuToFriend(wxData);
						});
						// 1 判断当前版本是否支持指定 JS 接口，支持批量判断	
					},
					error: function(xhr, type) {
						alert('获取微信授权失败！');
					}
				});
			},
			checkJsApi:function()
			{
					wx.checkJsApi({
							jsApiList: [
									'onMenuShareTimeline',
									'onMenuShareAppMessage',
									'onMenuShareQQ',
									'onMenuShareWeibo',
									'hideMenuItems',
									'showMenuItems',
									'hideOptionMenu',
									'showOptionMenu'
								],
								success: function(res) {
									alert(JSON.stringify(res));
									
								}
					});
			},
			MenuShare: function(wxData) {
				wx.onMenuShareTimeline({
					title: wxData.title,
					link: wxData.link,
					imgUrl: wxData.imgUrl,
					trigger: function(res) {
					// alert('用户点击分享到朋友圈');
					},
					success: function(res) {
						// alert('已分享');
					},
					cancel: function(res) {
						// alert('已取消');
					},
					fail: function(res) {
						alert(JSON.stringify(res));
					}
				})
			  },
			  // 分享给朋友
			MenuToFriend: function(wxData) { 
				wx.onMenuShareAppMessage({
				   title: wxData.title,
				   desc: wxData.desc,
				   link: wxData.link, 
				   imgUrl:wxData.imgUrl, 
				   success: function (res) {
				 		//alert("ok");
				    }
				 });
			},
			// 获取地理位置
			getLocation:function()
			{
				wx.getLocation({
				    success: function (res) {
				        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
				        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
				        var speed = res.speed; // 速度，以米/每秒计
				        var accuracy = res.accuracy; // 位置精度
				        alert("latitude : "+latitude+"--longitude : "+longitude+"--speed : "+speed+"--accuracy : "+accuracy);
				    }
				});
			}
		}
})(Zepto)

$(function() {
		H.wxChat.init();
});

