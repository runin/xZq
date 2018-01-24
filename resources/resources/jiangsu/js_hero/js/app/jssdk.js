(function($) {
	H.jssdk = {
	    wxIsReady: false,
	    loadWXconfig: 5,
	    init: function(flag){
	        this.ready(flag);
	        this.wxConfig();
	    },
	    ready: function(flag) {
	        var me = this;
	        wx.ready(function () {
	            wx.checkJsApi({
	                jsApiList: [
                    	'getNetworkType',
                        'addCard',
                        'startRecord',
                        'stopRecord',
                        'onVoiceRecordEnd',
                        'playVoice',
                        'stopVoice',
                        'onVoicePlayEnd',
                        'uploadVoice',
                        'downloadVoice',
	                    'onMenuShareTimeline',
	                    'onMenuShareAppMessage',
	                    'hideAllNonBaseMenuItem',
	                    'onMenuShareQQ',
	                    'onMenuShareWeibo',
	                    'hideMenuItems',
	                    'showMenuItems',
	                    'hideOptionMenu',
	                    'showOptionMenu'
	                ],
	                success: function (res) {
	                    me.wxIsReady = true;
	                }
	            });
                me.getNetworkType();
				me.hideMenuList();
				wx.hideOptionMenu();
				wx.hideAllNonBaseMenuItem();
		        
	            if ('off' != flag) me.showMenuList(shareData);
	        });
	        wx.error(function(res){
	            me.wxIsReady = false;
	            if (me.loadWXconfig == 0) {
	                setTimeout(function(){
	                    me.loadWXconfig--;
	                    H.jssdk.init();
	                }, 5000);
	            }
	        });
	    },
	    wxConfig: function(){
	        $.ajax({
	            type: 'GET',
	            async: true,
                url: domain_url + 'mp/jsapiticket' + dev,
                data: {appId: mpappid},
	            dataType: "jsonp",
	            jsonpCallback: 'callbackJsapiTicketHandler',
	            timeout: 10000,
	            complete: function() {
	            },
	            success: function(data) {
	                if(data.code == 0){
	                    var url = window.location.href.split('#')[0];
	                    var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
	                    var timestamp = Math.round(new Date().getTime()/1000);
	                    var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
	                    wx.config({
	                        debug: false,
	                        appId: mpappid,
	                        timestamp: timestamp,
	                        nonceStr:nonceStr,
	                        signature:signature,
	                        jsApiList: [
	                        	'getNetworkType',
		                        'addCard',
		                        'startRecord',
		                        'stopRecord',
		                        'onVoiceRecordEnd',
		                        'playVoice',
		                        'stopVoice',
		                        'onVoicePlayEnd',
		                        'uploadVoice',
		                        'downloadVoice',
	                            'onMenuShareTimeline',
	                            'onMenuShareAppMessage',
	                            'hideAllNonBaseMenuItem',
	                            'onMenuShareQQ',
	                            'onMenuShareWeibo',
	                            'hideMenuItems',
	                            'showMenuItems',
	                            'hideOptionMenu',
	                            'showOptionMenu'
	                        ]
	                    });
	                }
	            },
	            error: function(xmlHttpRequest, error) {
	            }
	        });
	    },
	    menuShare: function(data) {
	        var me = this;
	        wx.onMenuShareTimeline({
	            title: data.title,
	            desc: data.desc,
	            link: getUrl(data.link),
	            imgUrl: data.imgUrl,
	            trigger: function(res) {
	            },
	            success: function(res) {
	                me.shareSuccess();
	            },
	            cancel: function(res) {
	                me.shareFail();
	            },
	            fail: function(res) {
	                me.shareFail();
	            }
	        })
	    },
	    menuToFriend: function(data) {
	        var me = this;
	        wx.onMenuShareAppMessage({
	            title: data.title,
	            desc: data.desc,
	            link: getUrl(data.link),
	            imgUrl: data.imgUrl,
	            success: function(res) {
	            },
	            cancel: function(res) {
	            },
	            fail: function(res) {
	            }
	        });
	    },
	    hideMenuList: function() {
	        wx.hideMenuItems({
	            menuList: [
	                "menuItem:share:timeline",
	                "menuItem:share:qq",
	                "menuItem:copyUrl",
	                "menuItem:openWithQQBrowser",
	                "menuItem:openWithSafari",
	                "menuItem:share:email"
	            ],
	            success:function (res) {
	            },
	            fail:function (res) {
	            }
	        });
	    },
	    showMenuList: function(data) {
	        var me = this;
	        wx.showMenuItems({
	            menuList: [
	                "menuItem:share:appMessage",
	                "menuItem:share:timeline",
	                "menuItem:favorite",
	                "menuItem:copyUrl",
	                "menuItem:share:email"
	            ],
	            success:function (res) {
	                me.menuToFriend(data);
	                me.menuShare(data);
	            },
	            fail:function (res) {
	            }
	        });
	    },
	    shareSuccess: function() {
	    },
	    shareFail: function() {
	    },
    	getNetworkType: function() {
			wx.getNetworkType({
				success: function (res) {
					if (res.networkType == 'wifi') {
                        H.tv.init();
					}
				}
			});
    	}
	};
})(Zepto);

H.jssdk.init();