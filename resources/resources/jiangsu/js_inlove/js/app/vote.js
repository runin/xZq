(function($) {
	H.lottery = {
		canJump: true,
		wxCheck: false,
		isError: false,
		isCanShake: true,
	};
	H.vote = {
		time: 60,
		guid: '',
		clickNum: 0,
		maxClick: 150,
		maxHeight: 160,
		timeFlag: null,
		isCanClick: true,
		id: getQueryString('id'),
		init: function () {
			var _this = this;
			this.reset();
			this.event();
			if (!this.id) {
				toUrl('main.html');
				return;
			}
			getResult('api/voteguess/inforoud',{}, 'callbackVoteguessInfoHandler', true);
			getResult('api/common/promotion',{ oi: openid }, 'commonApiPromotionHandler', true);
			this.wxConfig();
			setTimeout(function(){
				if (!getData('firstLottery_' + _this.id)) {
					saveData('firstLottery_' + _this.id, true);
					_this.voteLottery();
				}
			}, 3e3);
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
			$('body').delegate('.btn-vote', 'touchstart', function(e) {
				e.preventDefault();
				$(this).attr('style', 'transform:scale(.85,.85)');
				$('.heart').attr('style', 'transform:scale(1.05,1.05)');
			});
			$('body').delegate('.btn-vote', 'touchend', function(e) {
				e.preventDefault();
				$(this).attr('style', 'transform:scale(1.05,1.05)');
				$('.heart').attr('style', 'transform:scale(.98,.98)');
				if (_this.isCanClick) {
					if (!_this.clickNum) _this.calcTime();
					_this.add();
					_this.loveVote();
					saveData(_this.id, (getData(_this.id) || 0) * 1 + 1)
				}
			});
		},
		add: function() {
			this.clickNum++;
			if (this.clickNum >= this.maxClick) {
				this.lottery();
			} else {
				$('.heart p').css('height', (this.maxHeight / this.maxClick) * this.clickNum + 'px');
			}
		},
		reset: function() {
			$('.total').html(this.time);
			clearInterval(this.timeFlag);
			this.timeFlag = null;
			this.clickNum = 0;
			$('.heart p').removeAttr('style');
		},
		calcTime: function() {
			var _this = this;
			var clickNum = $('.total').text() * 1;
			$('.total').text(--clickNum);
			this.timeFlag = setInterval(function(){
				if (clickNum <= 0) {
					clearInterval(_this.timeFlag);
					_this.timeFlag = null;
					_this.lottery();
					return;
				}
				$('.total').text(--clickNum);
			}, 1e3);
		},
		lottery: function() {
			this.voteLottery();
			// alert('点击了' + this.clickNum + '次，幸运值：' + (this.clickNum / this.maxClick * 100).toFixed(1) + '%。快去抽奖');
			this.reset();
		},
		voteLottery: function() {
			var _this = this;
			this.isCanClick = false;
			showLoading(null, '抽奖中...');
			$.ajax({
				type: 'GET',
				async: false,
				url: domain_url + 'api/lottery/exec/luck4Vote' + dev,
				data: { matk: matk },
				dataType: "jsonp",
				jsonpCallback: 'callbackLotteryLuck4VoteHandler',
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
					} else {
						_this.change();
					}
				},
				error: function() {
					_this.change();
				}
			});
		},
		change: function() {
			var _this = this;
			hideLoading();
			showTips('很遗憾，未中奖TOT<br>可能是幸运值不够，再来一次！');
			setTimeout(function(){
				_this.isCanClick = true;
			}, 1e3);
		},
		loveCount: function() {
			getResult('api/voteguess/groupplayertickets',{ groupUuid: this.guid }, 'callbackVoteguessGroupplayerticketsHandler');
		},
		loveVote: function() {
			getResult('api/voteguess/guessplayer',{
				yoi: openid,
				guid: this.guid,
				pluids: this.id,
			}, 'callbackVoteguessGuessHandler');
			$('.num label').html($('.num label').html() * 1 + 1);
		}
	};

	W.callbackVoteguessInfoHandler = function(data) {
		var _this = H.vote;
		if (data.code == 0 && data.items) {
			var sTime = new Date(data.pst).getTime();
			var eTime = new Date(data.pet).getTime();
			if (data.cud <= sTime || data.cud >= eTime) {
				toUrl('main.html');
				return;
			}
			for (var a in data.items) {
				for (var i in data.items[a].pitems) {
					if (data.items[a].pitems[i].pid == _this.id) {
						_this.guid = data.items[a].guid;
						$('.main').append('<img class="host host-l pa" src="' + data.items[a].pitems[i].im + '"><img class="host host-r pa" src="' + data.items[a].pitems[i].im2 + '">')
						_this.loveCount();
						setInterval(function(){
							_this.loveCount();
						}, 10e3);
						return;
					}
				}
			}
		}
	};

	W.callbackVoteguessGroupplayerticketsHandler = function(data) {
		var _this = H.vote;
		if (data.code == 0 && data.items) {
			for (var i in data.items) {
				if (_this.id == data.items[i].puid) {
					$('.num label').html(data.items[i].cunt * 1 + (getData(_this.id) || 0) * 1);
					return;
				}
			}
		}
	};

	W.commonApiPromotionHandler = function(data) {
		if (data.code == 0 && data.url) {
			$('.head').append('<a href="' + data.url + '" class="btn-more">' + (data.desc || '更多惊喜') + '</a>')
		}
	};

	W.callbackVoteguessGuessHandler = function(data) {};
})(Zepto);

$(function(){
	H.vote.init();
	H.time.init();
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