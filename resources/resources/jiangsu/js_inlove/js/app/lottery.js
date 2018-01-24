(function($) {
	H.lottery = {
		dec: 0,
		type: 2,
		index: 0,
		endType: 1,
		pal: null,
		nowTime: null,
		roundData: null,
		nextPrizeAct: null,
		canJump: true,
		wxCheck: false,
		isError: false,
		lastRound: false,
		isToLottey: true,
		isCanShake: false,
		isTimeOver: false,
		recordFirstload: true,
		crossLotteryFlag: false,
		crossLotteryCanCallback: false,
		imgList: [],
		$lotteryCountdown: $("#lottery-countdown"),
		init: function() {
			this.wxConfig();
			this.initComponent();
			this.lotteryRound_port();
			W.addEventListener('shake', H.lottery.shake_listener, false);
			document.onkeydown = function(event) {
				var e = event || window.event || arguments.callee.caller.arguments[0];
				if (e && e.keyCode==13) {
					H.lottery.wxCheck = true;
					H.lottery.shake_listener();
				}
			}
			$('body').css('overflow', 'hidden');
		},
		lotteryRound_port: function() {
			var _this = this;
			showLoading();
			$.ajax({
				type: 'GET',
				async: false,
				url: domain_url + 'api/lottery/round' + dev,
				data: {},
				dataType: "jsonp",
				jsonpCallback: 'callbackLotteryRoundHandler',
				timeout: 1e4,
				complete: function() {
				},
				success: function(data) {
					if(data.result){
						_this.dec = new Date().getTime() - data.sctm;
						_this.nowTime = timeTransform(data.sctm);
						_this.roundData = data;
						_this.currentPrizeAct(data);
					}else{
						_this.change();
					}
				},
				error: function(xmlHttpRequest, error) {
					_this.change();
				}
			});
		},
		shake_listener: function() {
			// H.lottery.wxCheck = true;
			var _this = H.lottery;
			if(_this.isCanShake){
				_this.isCanShake = false;
				_this.canJump = false;
			}else{
				return;
			}
			if (_this.type != 2) return;
			_this.isToLottey = true;
			$('.thanks-tips').html('');
			if(!$(".lottery-wrap").hasClass("yao")) {
				$("#audio-a").get(0).play();
				$(".main-top").css({
					'-webkit-transition': '-webkit-transform .2s ease',
					'-webkit-transform': 'translate3d(0,-175px,0)'
				});
				$(".main-foot").css({
					'-webkit-transition': '-webkit-transform .2s ease',
					'-webkit-transform': 'translate3d(0,175px,0)'
				});
				setTimeout(function(){
					$(".main-top").css({
						'-webkit-transform': 'translate3d(0,0,0)',
						'-webkit-transition': '-webkit-transform .5s ease'
					});
					$(".main-foot").css({
						'-webkit-transform': 'translate3d(0,0,0)',
						'-webkit-transition': '-webkit-transform .5s ease'
					});
				}, 1e3);
				$(".lottery-wrap").addClass("yao");
			}
			showLoading(null, '抽奖中...');
			if(!openid || this.isToLottey == false) {
				setTimeout(function(){
					_this.fill(null);//摇一摇
				}, 1e3);
			} else {
				if(!_this.wxCheck) {
					 //微信config失败
					 setTimeout(function(){
						 _this.fill(null);//摇一摇
					 }, 1e3);
					 return;
				}
				setTimeout(function(){
					_this.drawlottery();
				}, 1e3);
			}
			_this.isToLottey = true;
		},
		fillRandomBg: function() {//随机背景
			if(this.imgList.length > 0){
				var i = Math.floor((Math.random() * this.imgList.length));
				$('.lottery-wrap').css({"background":"url('" + this.imgList[i] + "') no-repeat center center","background-size":"100% auto"});
			}
		},
		red_record: function(){
			getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
		},
		downloadImg: function(){
			var me = this, t = simpleTpl();
			if($(".loadimg")) $(".loadimg").remove();
			for(var i in me.imgList) t._('<img class="preload loadimg" src="' + me.imgList[i] + '">');
			$('.lottery-wrap').append(t.toString());
		},
		currentPrizeAct:function(data){
			//获取抽奖活动
			var me = this,
				nowTimeStr = this.nowTime,
				prizeActListAll = data.la,
				prizeLength = 0,
				prizeActList = [],
				day = nowTimeStr.split(" ")[0];

			// 判断是否为跨天摇奖 配置文件中crossdayLimit跨天摇奖阀值，默认2h
			var lastLotteryEtime = prizeActListAll[prizeActListAll.length - 1].pd + ' ' + prizeActListAll[prizeActListAll.length - 1].et;
			var lastLotteryNtime = prizeActListAll[prizeActListAll.length - 1].nst;
			var crossDay = timeTransform(new Date().setDate(new Date(lastLotteryEtime).getDate() + 1)).split(" ")[0];
			var minCrossDay = crossDay + ' 00:00:00';
			var maxCrossDay = timeTransform(new Date(minCrossDay).getTime() + crossdayLimit);
			if(comptime(lastLotteryNtime, minCrossDay) <= 0 && comptime(lastLotteryNtime, maxCrossDay) >= 0) {
				me.crossLotteryFlag = true;
			} else {
				me.crossLotteryFlag = false;
			}

			if(prizeActListAll&&prizeActListAll.length>0){
				for ( var i = 0; i < prizeActListAll.length; i++) {
					if(prizeActListAll[i].pd == day){
						prizeActList.push(prizeActListAll[i]);
					}
				}
			}
			me.pal = prizeActList;
			prizeLength = prizeActList.length;

			//如果最后一轮结束
			if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
				if (me.crossLotteryFlag) {
					me.type = 1;
					me.crossCountdown(prizeActList[prizeLength - 1].nst);
				} else {
					me.type = 3;
					me.endType = 3;
					me.change();
				}
				return;
			}
			//如果第一轮未开始
			if(comptime(prizeActList[0].pd + " " + prizeActList[0].st,nowTimeStr) < 0){
				me.beforeCountdown(prizeActList[0]);
				return;
			}
			//config微信jssdk
			for ( var i = 0; i < prizeActList.length; i++) {
				var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
				var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
				me.index = i;
				hideLoading();
				//在活动时间段内且可以抽奖
				if(comptime(nowTimeStr, beginTimeStr) <= 0 && comptime(nowTimeStr, endTimeStr) >= 0){
					if(i < prizeActList.length - 1){
						var nextBeginTimeStr = prizeActList[i + 1].pd + " " + prizeActList[i + 1].st;
						if(comptime(endTimeStr, nextBeginTimeStr) <= 0){
							me.endType = 2;
							// 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
							me.lastRound = false;
							me.nextPrizeAct = prizeActList[i+1];
						} else {
							// 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
							me.endType = 1;
						}
					}else{
						// 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
						me.endType = 3;
						me.lastRound = true;
					}
					me.nowCountdown(prizeActList[i]);
					return;
				}
				if(comptime(nowTimeStr, beginTimeStr) > 0){
					me.beforeCountdown(prizeActList[i]);
					return;
				}
			}
		},
		initComponent: function(){
			var _this = this;
			this.red_record();
			setInterval(function(){ _this.red_record(); }, Math.ceil(40000*Math.random() + 100000));
		},
		// 摇奖开启倒计时
		beforeCountdown: function(prizeActList) {
			this.change();
			// var me = this;
			// me.isCanShake = false;
			// me.type = 1;
			// var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
			// var beginTimeLong = timestamp(beginTimeStr);
			// beginTimeLong += me.dec;
			// me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
			// me.$lotteryCountdown.find(".countdown-tip").html('距离摇奖开始还有');
			// me.count_down();
			// me.$lotteryCountdown.removeClass('none');
			// if(prizeActList.bi.length > 0){
			// 	me.imgList = prizeActList.bi.split(",");
			// }
			// me.downloadImg();
			hideLoading();
		},
		// 摇奖结束倒计时
		nowCountdown: function(prizeActList){
			var me = this;
			me.isCanShake = true;
			me.type = 2;
			var endTimeStr = prizeActList.pd+" "+prizeActList.et;
			var beginTimeLong = timestamp(endTimeStr);
			beginTimeLong += me.dec;
			me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
			me.$lotteryCountdown.find(".countdown-tip").html("距摇奖结束还有");
			me.count_down();
			me.$lotteryCountdown.removeClass('none');
			me.index++;
			me.canJump = true;
			if(prizeActList.bi.length > 0){
				me.imgList = prizeActList.bi.split(",");
			}
			me.downloadImg();
			hideLoading();
		},
		// 跨天摇奖开启倒计时
		crossCountdown: function(nextTime) {
			this.change();
			// var me = this;
			// me.isCanShake = false;
			// me.crossLotteryFlag = false;
			// me.crossLotteryCanCallback = true;
			// me.type = 1;
			// var beginTimeLong = timestamp(nextTime);
			// beginTimeLong += me.dec;
			// me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
			// me.count_down();
			hideLoading();
		},
		count_down: function() {
			var me = this;
			me.$lotteryCountdown.find('.detail-countdown').each(function() {
				$(this).countDown({
					etpl: '<span class="fetal-H">%H%' + '</span><label>:</label><span class="fetal-H">' + '%M%' + '</span>:<span class="fetal-H">' + '%S%' + '</span>', // 还有...结束
					stpl: '<span class="fetal-H">%H%' + '</span><label>:</label><span class="fetal-H">' + '%M%' + '</span>:<span class="fetal-H">' + '%S%' + '</span>', // 还有...开始
					sdtpl: '',
					otpl: '',
					otCallback: function() {
						if(me.canJump){
							if (me.crossLotteryCanCallback) {
								if(!me.isTimeOver){
									var delay = Math.ceil(1000*Math.random() + 500);
									me.isTimeOver = true;
									me.crossLotteryCanCallback = false;
									me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
									showLoading(null, '请稍后...');
									setTimeout(function(){
										me.lotteryRound_port();
									}, delay);
								}
							} else {
								if(me.type == 1){
									//距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
									if(!me.isTimeOver){
										me.isTimeOver = true;
										me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
										showLoading(null,'请稍后...');
										setTimeout(function() {
											me.nowCountdown(me.pal[me.index]);
										}, 1000);
									}
								}else if(me.type == 2){
									//距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
									if(!me.isTimeOver){
										me.isTimeOver = true;
										if(me.index >= me.pal.length){
											if (me.crossLotteryFlag) {
												me.type = 1;
												me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
												showLoading(null,'请稍后...');
												setTimeout(function() {
													me.crossCountdown(me.pal[me.pal.length - 1].nst);
												}, 1000);
											} else {
												me.type = 3;
												me.change();
											}
											return;
										}
										me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
										showLoading(null,'请稍后...');
										var i = me.index - 1;
										if(i < me.pal.length - 1){
											var endTimeStr = me.pal[i].pd + " " + me.pal[i].et;
											var nextBeginTimeStr = me.pal[i + 1].pd + " " + me.pal[i + 1].st;
											if(comptime(endTimeStr,nextBeginTimeStr) <= 0){
												// 有下一轮并且下一轮的开始时间和本轮的结束时间重合
												me.endType = 2;
											} else {
												// 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
												me.endType = 1;
											}
										}
										setTimeout(function(){
											if(me.endType == 2){
												me.nowCountdown(me.pal[me.index]);
											}else if(me.endType == 1){
												me.beforeCountdown(me.pal[me.index]);
											} else {
												me.change();
											}
										},1000);
									}
								}else{
									me.isCanShake = false;
								}
							}
						}else{
							me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
						}
					},
					sdCallback: function(){
						me.isTimeOver = false;
					}
				});
			});
		},
		drawlottery: function() {
			var me = this, sn = new Date().getTime()+'';
			$.ajax({
				type: 'GET',
				async: false,
				url: domain_url + 'api/lottery/exec/luck' + dev,
				data: { matk: matk , sn: sn},
				dataType: "jsonp",
				jsonpCallback: 'callbackLotteryLuckHandler',
				timeout: 10000,
				complete: function() {
				},
				success: function(data) {
					if(data.flow && data.flow == 1){
						sn = new Date().getTime()+'';
						me.fill(null);
						return;
					}
					if(data.result){
						if(data.sn == sn){
							sn = new Date().getTime()+'';
							me.fill(data);
						}
					}else{
						sn = new Date().getTime()+'';
						me.fill(null);
					}
				},
				error: function() {
					sn = new Date().getTime()+'';
					me.fill(null);
				}
			});
		},
		fill: function(data) {
			this.fillRandomBg();
			$(".lottery-wrap").removeClass("yao");
			if(data == null || data.result == false || data.pt == 0){
				$("#audio-a").get(0).pause();
				this.thanks();
				return;
			}else{
				$("#audio-a").get(0).pause();
				$("#audio-b").get(0).play();    //中奖声音
			}

			if (data.pt == 1) {//1:实物奖品
				H.dialog.shiwuLottery.open(data);
			} else if (data.pt == 7) {//7:电子卡券
				H.dialog.wxcardLottery.open(data);
			} else if (data.pt == 9) {//9:外链领取奖品
				H.dialog.linkLottery.open(data);
			} else {
				this.thanks();
			}
			
			// if (data.pt == 1 || data.pt == 7 || data.pt == 9) {
			// 	H.dialog.box.open(data);
			// } else {
			// 	this.thanks();
			// }
		},
		thanks: function() {
			hideLoading();
			this.canJump = true;
			this.isCanShake = true;
			if (thanks_tips) {
				var tips = thanks_tips[getRandomArbitrary(0, thanks_tips.length)]
			} else {
				var tips = '未中奖，继续摇';
			}
			$('.thanks-tips').html(tips).addClass('show');
			setTimeout(function(){
				$('.thanks-tips').removeClass('show');
			}, 800);
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
		scroll: function() {
			$('.marquee').each(function(i) {
				var _that = this, list = [], delay = 1000;
				var len = $(_that).find('li').length;
				var $ul = $(_that).find('ul');
				if (len == 0) {
					$(_that).addClass('none');
				} else {
					$(_that).removeClass('none');
				}
				if(len > 1) {
					list[i] = setInterval(function() {
						$ul.animate({'margin-top': '-40px'}, delay, function() {
							$ul.find('li:first').appendTo($ul)
							$ul.css({'margin-top': '0'});
						});
					}, 3000);
				};
			});
		},
		change: function() {
			this.isCanShake = false;
			this.$lotteryCountdown.hide();
			toUrl('main.html?t=' + new Date().getTime());
			hideLoading();
		}
	};

	W.callbackLotteryAllRecordHandler = function(data){
		if(data.result){
			var list = data.rl;
			if(list && list.length > 0){
				var con = "";
				for(var i = 0 ; i < list.length; i++){
					var username = (list[i].ni || "匿名用户");
					if (username.length >= 9) {
						username = username.substring(0, 8) + '...';
					}
					con += "<li><span>" + username + "中了 <label>" + list[i].pn + "</label></label></span></li>";
				}
				var len = $(".marquee").find("li").length;
				if(len >= 500){
					$(".marquee").find("ul").html(con);
				}else{
					$(".marquee").find("ul").append(con);
				}
				if(H.lottery.recordFirstload){
					H.lottery.recordFirstload = false;
					H.lottery.scroll();
				}
				$(".marquee").animate({'opacity':'1'}, 500, function(){$(".marquee").removeClass("hidden");});
			}
		}
	};
})(Zepto);

$(function() {
	H.lottery.init();
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