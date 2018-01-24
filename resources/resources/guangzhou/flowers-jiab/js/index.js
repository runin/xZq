(function($) {
	
	H.index = {
		init: function() {
			H.utils.resize();
			H.weixin.init();
		}
	};
	
	H.sign = {
		init: function() {
			H.utils.resize();
			H.weixin.init();
			
			getResult('live/activity/sign', {
				ac: sign_activity_code,
				oi: openid
			}, 'callbackLiveActivitySign', true);
		}
	};
	
	H.weixin = {
		init: function() {
			$(document).wx({
				"img_url" : share_img,
		        "desc" : share_desc,
		        "title" : share_title,
		        "url": share_url
			});
		}
	};
	
	H.utils = {
		$main: $('#main'),
		resize: function() {
			var me = this,
				width = $(window).width(),
				height = $(window).height(),
				main_bg = 'images/bg.jpg';
			
			this.$main.css('minHeight', height).css('height', height);
			showLoading();
			imgReady(main_bg, function() {
				hideLoading();
				me.$main.css('background-image', 'url('+ main_bg +')');
			});
		}
	};
	
	// 签到
	W.callbackLiveActivitySign = function(data) {};
	
})(Zepto);

H.index.init();