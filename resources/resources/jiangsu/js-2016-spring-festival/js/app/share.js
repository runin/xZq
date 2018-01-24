(function ($) {

    H.share = {
    	shareData: null,
    	
        init: function () {
        	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
	            WeixinJSBridge.on('menu:share:appmessage', function(argv) {
	                WeixinJSBridge.invoke('sendAppMessage', {
	                    "img_url": H.share.shareData.image,
	                    "link": H.share.shareData.link,
	                    "desc": H.share.shareData.content,
	                    "title": H.share.shareData.title
	                }, function (res) {
	                    if(res.err_msg == 'send_app_msg:confirm'){
	                    	showTips(H.share.shareData.successTips);
	                    	H.cardUnlock.$guide.addClass('none');
	                    	H.cardUnlocking.$guide.addClass('none');
	                    	H.cardSend.$guide.addClass('none');
	                    }
	                })
	            });

	            WeixinJSBridge.on('menu:share:timeline', function (argv) {
	                WeixinJSBridge.invoke('shareTimeline', {
	                    "img_url": H.share.shareData.image,
	                    "img_width": "480",
	                    "img_height": "480",
	                    "link": H.share.shareData.link,
	                    "desc": H.share.shareData.content,
	                    "title": H.share.shareData.title
	                }, function (res) {
	                    if(res.err_msg == 'share_timeline:ok'){
	                    	showTips(H.share.shareData.successTips);
	                    	H.cardUnlock.$guide.addClass('none');
	                    	H.cardUnlocking.$guide.addClass('none');
	                    	H.cardSend.$guide.addClass('none');
	                    }
	                });
	            });
	        }, false);

			H.share.commonShare();
        },

        commonShare: function(pv){
        	if(!pv){
        		H.share.shareData = {
	                "image": headimgurl,
	                "link": H.share.getCommonUrl(),
	                "content": '我是' + nickname + '，正在2016年江苏卫视传递幸福。我在朋友圈，你在哪儿？',
	                "title": '多一个刷朋友圈，少一个跳广场舞',
	                "successTips": '分享成功'
	            }
        	}else{
        		H.share.shareData = {
	                "image": headimgurl,
	                "link": H.share.getCommonUrl(),
	                "content": '我是' + nickname + '，我是2016年江苏卫视第' + pv + '个传递幸福的人，我在朋友圈，你在哪儿？',
	                "title": '多一个刷朋友圈，少一个跳广场舞',
	                "successTips": '分享成功'
	            }
        	}
        },

        unlockShare: function(cardData, left){
        	var ud = cardData.ud;
        	H.share.shareData = {
                "image": headimgurl,
                "link": H.share.getUnlockUrl(ud),
                "content": '盼你们如南方人盼暖气，我与明星距离只剩最后一步，快来帮我解锁卡片！',
                "title": '【还差'+left+'人】江苏卫视春晚，没你怎么玩？',
                "successTips": '解锁请求发送成功'
            }
        },

        cardShare: function(video, cover, text, voice, star, duration){
        	H.share.shareData = {
                "image": headimgurl,
                "link":  H.share.getSendUrl(video,cover, text, voice, duration),
                "content": '即使我们相隔千里，但我对你的思念和祝愿，从未停止...',
                "title": star + '与' + nickname + '给您发来新年祝福',
                "successTips": '贺卡发送成功'
            }
        },

        fuShare: function(ud, roi){
        	H.share.shareData = {
                "image": headimgurl,
                "link": H.share.getFuUrl(ud, roi),
                "content": '盼你们如南方人盼暖气，我与明星距离只剩最后一步，快来帮我解锁卡片！',
                "title": '江苏卫视春晚，没你怎么玩？',
            }
        },

        getCommonUrl: function(){
		    var href = window.location.href;

		    href = href.replace(/[^\/]*\.html/i, 'index.html');

		    href = add_param(href, 'resopenid', hex_md5(openid), true);
		    href = add_param(href, 'from', 'share', true);

		    href = add_param(href, 'openid', null, true);
		    href = add_param(href, 'headimgurl', null, true);
		    href = add_param(href, 'nickname', null, true);
		    href = add_param(href, 'send', null, true);
		    href = add_param(href, 'ud', null, true);
		    href = add_param(href, 'roi', null, true);

		    return add_yao_prefix(href);
        },

        getUnlockUrl: function(ud){
		    var href = window.location.href;

		    href = href.replace(/[^\/]*\.html/i, 'unlock.html');

		    href = add_param(href, 'resopenid', hex_md5(openid), true);
		    href = add_param(href, 'from', 'share', true);
		    href = add_param(href, 'ud', ud, true);
		    href = add_param(href, 'roi', openid, true);

		    href = add_param(href, 'openid', null, true);
		    href = add_param(href, 'headimgurl', null, true);
		    href = add_param(href, 'nickname', null, true);
		    href = add_param(href, 'send', null, true);
		    console.log(href);
		    return add_yao_prefix(href);
		},

		getSendUrl: function(video, cover, text, voice, duration){
			var href = window.location.href;

		    href = href.replace(/[^\/]*\.html/i, 'index.html');

		    href = add_param(href, 'resopenid', hex_md5(openid), true);
		    href = add_param(href, 'from', 'share', true);
		    href = add_param(href, 'nn', (nickname ? nickname : null), true);
		    href = add_param(href, 'hd', (headimgurl ? headimgurl : null), true);
		    href = add_param(href, 'vi', video, true);
		    href = add_param(href, 'co', cover, true);
		    href = add_param(href, 'te', (text ? text : null), true);
		    href = add_param(href, 'voi', (voice ? voice : null), true);
		    href = add_param(href, 'du', (duration ? duration : null), true);
		    href = add_param(href, 'send', 1, true);
		    
		    href = add_param(href, 'openid', null, true);
		    href = add_param(href, 'headimgurl', null, true);
		    href = add_param(href, 'nickname', null, true);
		    href = add_param(href, 'ud', null, true);
		    href = add_param(href, 'roi', null, true);
		    console.log(href);
		    return add_yao_prefix(href);
		},

		getFuUrl: function(ud, roi){
			var href = window.location.href;

		    href = href.replace(/[^\/]*\.html/i, 'unlock.html');

		    href = add_param(href, 'resopenid', hex_md5(openid), true);
		    href = add_param(href, 'from', 'share', true);
		    href = add_param(href, 'ud', ud, true);
		    href = add_param(href, 'roi', roi, true);

		    href = add_param(href, 'openid', null, true);
		    href = add_param(href, 'headimgurl', null, true);
		    href = add_param(href, 'nickname', null, true);
		    href = add_param(href, 'send', null, true);
		    console.log(href);
		    return add_yao_prefix(href);
		}
    };

    H.share.init();

})(Zepto);