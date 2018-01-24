<template>
	<section id="main-vue">
<!-- 		<keep-alive include="Home">
			<router-view v-if="isLoading"></router-view>
		</keep-alive> -->
		<keep include="Home">
			<router-view v-if="isLoading"></router-view>
		</keep>
<!-- 		<section include="Home">
			<router-view v-if="isLoading"></router-view>
		</section> -->
    <section v-if="isWelcome">
		  <section class="container" :style="'background: url(' + coverIMG + ') no-repeat center center;background-size: cover;'" v-if="isCover" v-tap="{ methods:enterHome }">
    </section>
      <!-- 			<section class="footer">
				<img class="tvlogo" :src="tvlogoIMG">
				<p>{{copyRight}}</p>
			</section> -->
		</section>
		<section class="loadbox" :style="mainStyle" v-if="!isReady || isError">
			<section class="key-tips" v-if="!isReady && !isError">正在加载，请稍等</section>
			<section class="key-tips erroring" v-if="isError">网络不太给力，请稍后重试</section>
		</section>
	</section>
</template>

<script>

import config from '../assets/config.js'

export default{
	name: 'app',
	data(){
		return {
			eu: null,
			isReady: false,
			isError: false,
      isWelcome: false,
			isCover: false,
			isLoading: false,
			tvlogoIMG: null,
			mainStyle: {},
			timeFlag: null,
			copyRight: null,
			coverIMG: null,
			isWXReady: false,
		}
	},
	methods: {
		enterHome: function() {
			var _this = this;
			_this.isCover = false;
			_this.isLoading = true;
			clearTimeout(_this.timeFlag);
			_this.timeFlag = null;
		},
		getParams: function() {
			var url = window.location.href;
			var theRequest = new Object();
			var start = url.indexOf("?");
			if (start != -1) {
				var str = url.substr(start + 1);
				var strs = str.split("&");
				for (var i = 0; i < strs.length; i++) {
					if (strs[i].split("=")[1]) theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
				};
			}
			return theRequest;
		},
		getBaseInfo: function() {
			var _this = this;
			this.$http.jsonp(config.host + config.base, {params: {eu: this.eu.split('&')[0]}, jsonp: 'cb'}).then((response)=>{
				// console.log(response);
				if (response.data && response.data.code == 0) {
					var data = response.data;
					this.copyRight = data.cr;
					this.tvlogoIMG = data.lg;
					this.coverIMG = data.pt;

					window.news_eu = data.eu;
					window.news_logo = data.lg;
					window.news_cover = data.cr;
					window.news_av = data.av;
					window.news_appid = data.ad;
					window.news_title = data.tt;
					setTitle(news_title);
					if (isWeixin()) {
						// 微信授权
						var vuePath = location.protocol + '//' + location.host + location.pathname + location.hash;
						// console.log(vuePath);
						var param = {};
						param['hash'] = encodeURIComponent(location.hash);
						var callbackurl = 'http://nmportal.yibo.so/nportal/api/mp/auth/snsapi_userinfo?cbp=' + encodeURIComponent(vuePath) + '&param=' + encodeURIComponent(JSON.stringify(param));
						this.toAuth(data.ad, 'userinfo', callbackurl);
					} else {
						this.isReady = true;
						if(this.isWelcome){
              this.isCover = true;
              this.timeFlag = setTimeout(function(){
                _this.isCover = false;
                _this.isLoading = true;
              }, 3e3);
            }else{
              _this.isCover = false;
              _this.isLoading = true;
            }

					}
				} else {
					_this.isError = true;
					_this.isReady = false;
				}
			}, (response)=>{
				console.error('新闻矩阵信息获取失败');
				console.error(JSON.stringify(response));
			});
		},
		toAuth: function(appid, type, callbackurl) {
			var _this = this;
			var LOCAL_PARAM = {};
			var _params = _this.getParams();

			if (_params['hash']) {
				var hash = _params['hash'];
			} else {
				var hash = null;
			}

			window.openid = localStorage.getItem(news_appid + '_' + news_eu + '_openid_' + VERSION) || _params['uu'];
			window.matk = localStorage.getItem(news_appid + '_' + news_eu + '_matk_' + VERSION) || _params['uc'];
			window.avatar = localStorage.getItem(news_appid + '_' + news_eu + '_avatar_' + VERSION) || _params['hi'];
			window.nickname = localStorage.getItem(news_appid + '_' + news_eu + '_nickname_' + VERSION) || _params['nn'];

			if (!openid || !matk || !avatar || !nickname) {
				if (type == 'userinfo') {
					window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + encodeURIComponent(callbackurl) + "&response_type=code&scope=snsapi_userinfo&state=" + this.eu + "#wechat_redirect";
				} else {
					window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + encodeURIComponent(callbackurl) + "&response_type=code&scope=snsapi_base&state=" + this.eu + "#wechat_redirect";
				}
			} else {
				localStorage.setItem(news_appid + '_' + news_eu + '_openid_' + VERSION, openid);
				localStorage.setItem(news_appid + '_' + news_eu + '_matk_' + VERSION, matk);
				localStorage.setItem(news_appid + '_' + news_eu + '_avatar_' + VERSION, avatar);
				localStorage.setItem(news_appid + '_' + news_eu + '_nickname_' + VERSION, nickname);
				localStorage.setItem(news_appid + '_' + news_eu + '_euid_' + VERSION, this.eu);

				setTimeout(function(){
					if (hash) location.hash = decodeURIComponent(hash);
			        if (openid || matk || avatar || nickname) {
			        	window.location.href = location.protocol + '//' + location.host + location.pathname + location.hash;
			        }
					_this.isReady = true;
          if(this.isWelcome){
            this.isCover = true;
            this.timeFlag = setTimeout(function(){
              _this.isCover = false;
              _this.isLoading = true;
            }, 3e3);
          }else{
            _this.isCover = false;
            _this.isLoading = true;
          }
				}, 100);
			}
		}
	},
	created: function() {
		var _this = this;
		this.mainStyle = {
			'width' : $(window).width() + 'px',
			'height' : $(window).height() + 'px'
		};

		if ($.fn.cookie('useId') == 'holdfun') {
			$('body').addClass('isApp');
		} else {
			$('body').removeClass('isApp');
		}
		
		if (isWeixin()) {
			$.ajax({
				type: 'GET',
				async: true,
				url: config.jsapiticket,
				data: { appid: 'wxc0caca12c7a33384' },
				dataType: "jsonp",
				jsonpCallback: 'callbackJsapiTicketHandler',
				timeout: 10000,
				complete: function() {},
				success: function(data) {
					if (data.result) {
						var url = window.location.href.split('#')[0];
						var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
						var timestamp = Math.round(new Date().getTime() / 1000);
						var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
						wx.config({
							debug: false,
							appId: 'wxc0caca12c7a33384',
							timestamp: timestamp,
							nonceStr: nonceStr,
							signature: signature,
							jsApiList: [
								'onMenuShareTimeline',
								'onMenuShareAppMessage',
								'onMenuShareQQ',
								'hideOptionMenu',
								'showOptionMenu',
								'hideMenuItems',
								'showMenuItems'
							],
							success: function(res) {
							}
						});
						wx.ready(function(){
						});
						wx.error(function(){
						});
					}
				},
				error: function(xmlHttpRequest, error) {
					console.error('jsapiticket获取失败');
					console.error(JSON.stringify(xmlHttpRequest));
				}
			});
		}
	},
	mounted () {
    if (this.$route.path.indexOf(';H5') >= 0) {
      this.eu = this.$route.params.eu.slice(0,-3) || news_eu;
      this.isWelcome = false;
    }else {
      this.eu = this.$route.params.eu || news_eu;
      this.isWelcome = false;
    }
		news_eu = this.eu;
		if (!this.$route.params.eu) this.$router.push('/' + this.eu);
		this.getBaseInfo();
	}
}

</script>

<style scoped>
#main-vue {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #f8f8f8;
}
.container {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	overflow: hidden;
}
.footer {
	position: fixed;
	width: 100%;
	left: 0px;
	bottom: 5vh;
	text-align: center;
	font-size: 0;
	padding: 10px 0;
}
.footer .tvlogo {
	position: relative;
	display: inline-block;
	height: 32px;
	top: 9px;
	margin-right: 6px;
}
.footer p {
	color: #FFF;
	height: 16px;
	line-height: 16px;
	font-size: 15px;
	display: inline-block;
	letter-spacing: 2px;
	padding-left: 2px;
}
.loadbox {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	overflow: hidden;
}
.key-tips {
	position: absolute;
	width: 100%;
	left: 0;
	bottom: 12vh;
	font-size: 16px;
	text-align: center;
	color: #333;
}
.key-tips.erroring {
	color: rgba(50,216,255,.8);
}
.isApp #main-vue {
	padding-top: 64px;
}
</style>