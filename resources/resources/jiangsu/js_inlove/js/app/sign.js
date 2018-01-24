(function($) {
	H.lottery = {
		canJump: true,
		wxCheck: false,
		isError: false,
		isCanShake: true,
	};
	H.sign = {
		dec: 0,
		dom: null,
		puid: '',
		signNum: 12,
		isCanClick: true,
		init: function () {
			this.event();
			this.wxConfig();
			showLoading(null, '签到查询中');
			getResult('api/sign/round',{}, 'callbackSignRoundHandler');
		},
		wxConfig: function() {
			$.ajax({
				type: 'GET',
				async: true,
				url: domain_url + 'mp/jsapiticket' + dev,
				data: {appId: shaketv_appid},
				dataType: "jsonp",
				jsonpCallback: 'callbackJsapiTicketHandler',
				timeout: 1e4,
				complete: function() {
				},
				success: function(data) {
					if(data.code == 0){
						var url = window.location.href.split('#')[0];
						var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
						var timestamp = Math.round(new Date().getTime()/1000);
						var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
						//权限校验
						wx.config({
							debug: false,
							appId: shaketv_appid,
							timestamp: timestamp,
							nonceStr:nonceStr,
							signature:signature,
							jsApiList: [
								"addCard",
								"checkJsApi"
							]
						});
					}
				},
				error: function(xmlHttpRequest, error) {
				}
			});
		},
		event: function() {
			var _this = this;
			$('body').delegate('.btn-hs', 'touchend', function(e) {
				e.preventDefault();
				_this.dom = $(this);
				if ($(this).hasClass('signed')) {
					showTips('本期已签到！<br>签到时间：' + $(this).attr('data-sgt'));
					return;
				}
				var nowTime = new Date((new Date().getTime() - _this.dec));
				if (nowTime >= $(this).attr('data-st')*1 && nowTime < $(this).attr('data-et')*1) {
					showLoading(null, '签到中...');
					getResult('api/sign/signed',{
						yoi: openid,
						auid: $(this).attr('data-id')
					}, 'callbackSignSignedHandler');
				} else if (nowTime >= $(this).attr('data-et')*1) {
					showTips('签到失败，当期节目已播完TOT');
				} else {
					showTips('签到未开始<br>签到时间：' + timeTransform($(this).attr('data-st')*1));
				}
				console.log('当前时间：' + new Date((new Date().getTime() - _this.dec)));
			}).delegate('.btn-gift', 'touchend', function(e) {
				e.preventDefault();
				if ($(this).hasClass('geted')) {
					showTips('活动期间内只能抽一次哦~');
					return;
				}
				if ($(this).hasClass('off')) {
					showTips('还没有集齐所有签到，继续加油吧~');
					return;
				} else {
					_this.signLottery();
				}
			});
		},
		signLottery: function() {
			var _this = this;
			this.isCanClick = false;
			showLoading(null, '抽奖中...');
			$.ajax({
				type: 'GET',
				async: false,
				url: domain_url + 'api/lottery/exec/luck4Sign' + dev,
				data: { matk: matk },
				dataType: "jsonp",
				jsonpCallback: 'callbackLotteryLuck4SignHandler',
				timeout: 5e3,
				complete: function() {
				},
				success: function(data) {
					if (data.flow && data.flow == 1) {
						_this.change();
						return;
					}
					if (data.result) {
						H.dialog.box.open(data);
						setTimeout(function(){
							_this.isCanClick = true;
						}, 1e3);
						$('.btn-gift').addClass('off geted');
						saveData('signLottery', true);
					} else {
						_this.change();
					}
				},
				error: function() {
					_this.change();
				}
			});
		},
		signFill: function(items) {
			var _this = this;
			var data = items.sort(function(a, b) {
				var aTime = new Date(a.st.replace(/-/g, '/')).getTime();
				var bTime = new Date(b.st.replace(/-/g, '/')).getTime();
				return aTime - bTime;
			});

			var tpl = '';
			for (var i = 0; i < _this.signNum; i++) {
				if (data[i]) {
					tpl += '<a href="javascript:;" class="btn-hs off s' +  data[i].uid + '" data-id="' + data[i].uid + '" data-st="' + new Date(data[i].st.replace(/-/g, '/')).getTime() + '" data-et="' + new Date(data[i].et.replace(/-/g, '/')).getTime() + '">' + (data[i].t || '敬请期待') + '</a>'
				}
				//  else {
				// 	tpl += '<a href="javascript:;" class="btn-hs off">未开始</a>'
				// }
			}
			$('.xinBox').html(tpl).append('<a href="javascript:;" class="btn-gift db off">立即摇奖</a>');
			getResult('api/sign/myrecord',{ yoi: openid }, 'callbackSignMyRecordHandler');

			_this.signNum = items.length;
			$('.title p').html('连续签到' + _this.signNum + '次，即可获得精美礼品一份');
		},
		isCanLottery: function() {
			if (this.signNum == $('.signed').length) {
				$('.btn-gift').removeClass('off');
			}
			if (getData('signLottery')) {
				$('.btn-gift').addClass('off geted');
			}
		},
		change: function() {
			var _this = this;
			hideLoading();
			showTips('恭喜您，获得再来一次<br>快去抽奖吧');
			setTimeout(function(){
				_this.isCanClick = true;
			}, 1e3);
		},
	};

	W.callbackSignRoundHandler = function(data) {
		var _this = H.sign;
		if (data.code == 0 && data.items) {
			if (data.cud >= new Date(data.pet.replace(/-/g, '/')).getTime()) {
				showLoading('活动已结束');
				return;
			}
			_this.dec = new Date().getTime() - data.cud;
			_this.puid = data.puid;
			_this.signNum = data.kts;
			_this.signFill(data.items);
		}
	};

	W.callbackSignMyRecordHandler = function(data) {
		var _this = H.sign;
		hideLoading();
		if (data.code == 0 && data.items) {
			for (var i in data.items) {
				$('.s' + data.items[i].aid).removeClass('off').addClass('signed').attr('data-sgt', data.items[i].t);
			}
			_this.isCanLottery();
		}
	};

	W.callbackSignSignedHandler = function(data) {
		var _this = H.sign;
		hideLoading();
		switch (data.code) {
			case '0':
				showTips('恭喜您，签到成功！');
				_this.dom.removeClass('off').addClass('signed').attr('data-sgt', timeTransform(new Date((new Date().getTime() - _this.dec))));
				break;
			case '2':
				showTips('本次您已经签到过！');
				_this.dom.removeClass('off').addClass('signed');
				break;
			default:
				showTips('签到失败，请刷新页面重试~');
		}
		_this.isCanLottery();
	};
})(Zepto);

$(function(){
	H.sign.init();
	wx.ready(function () {
		wx.checkJsApi({
			jsApiList: [
				'addCard'
			],
			success: function (res) {
				var t = res.checkResult.addCard;
				if(t && !H.lottery.isError){
					H.lottery.wxCheck = true;
				}
			}
		});
	});

	wx.error(function(res){
		H.lottery.isError = true;
	});
});