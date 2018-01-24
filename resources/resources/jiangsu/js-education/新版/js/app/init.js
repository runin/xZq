(function($) {
	
	H.init = {
		shareData: null,

		init: function(){
			this.versionCheck();
		},

		versionCheck: function(){
			$.ajax({
		        type : "get",
		        url : domain_url + "api/common/versioncheck",
		        dataType : "jsonp",
		        jsonp : "callback",
		        jsonpCallback : "commonApiVersionHandler",
		        success : function(data) {
		            if (!data.result){
		                location.href = data.redirect;
		                return false;
		            }
		            H.init.shareData = data;
		            H.init.baseAuth();
		        },
		        error : function(){
		        	H.init.baseAuth();
		        }
		    });
		},

		baseAuth: function(){
			holdfunAuth(function(){
				H.init.initShare();
				H.init.config();
			});
		},

		config: function(){
			getResult('api/channelhome/config', null, 'callbackChannelhomeConfigHandler');
		},

		configCallback: function(data){

			// 初始化菜单
			if(H.nav && H.nav.init && data.funs){
				H.nav.init(data.funs);
			}

			// 初始化title
			setTitle(data.ti);

			// 初始化logo
			$('#head_logo').css("backgroundImage","url('"+data.icon+"')");
			
			// 初始化footer

			// 初始化头像名称
			H.init.userinfoAuth(data.apid);
		},

		userinfoAuth: function(appid){
			mpAuth(appid, function(){
				H.init.inited();
			})
		},

		inited: function(){
			H.index.init();
			H.jifen.init();
			H.sign.init();
			H.rank.init();
			H.award.init();
		},

		initShare: function(){
			var data = H.init.shareData;
			share_img = data.si ? data.si : '';
            share_title = data.st ? data.st : '';
            share_desc = data.sd ? data.sd : '';
            window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, H.init.getUrl());
		},

		getUrl: function () {
		    var href = window.location.href;
		    href = href.replace(/[^\/]*\.html/i, 'index.html');

		    href = add_param(href, 'resopenid', hex_md5(openid), true);
		    href = add_param(href, 'from', 'share', true);

		    href = add_param(href, 'openid', null, true);
		    href = add_param(href, 'headimgurl', null, true);
		    href = add_param(href, 'nickname', null, true);

		    return H.init.add_yao_prefix(href);
		},

		add_yao_prefix: function (url) {
		    return 'http://yao.qq.com/tv/entry?redirect_uri=' + encodeURIComponent(url);
		}

	};

	W.callbackChannelhomeConfigHandler = function(data){
		if(data && data.code==0) {
			H.init.configCallback(data);
		}else{
			W.inited();
		}
	};
	
	H.init.init();

})(Zepto);