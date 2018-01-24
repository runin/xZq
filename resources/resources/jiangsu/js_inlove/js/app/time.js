H.time = {
	dec: 0,
	type: 2,
	index: 0,
	endType: 1,
	pal: null,
	nowTime: null,
	roundData: null,
	nextPrizeAct: null,
	canJump: true,
	lastRound: false,
	isToLottey: true,
	isCanShake: false,
	isTimeOver: false,
	crossLotteryFlag: false,
	crossLotteryCanCallback: false,
	$lotteryCountdown: $(".time"),
	init: function() {
		this.lotteryRound_port();
	},
	lotteryRound_port: function() {
		var _this = this;
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
	// 摇奖开启倒计时
	beforeCountdown: function(prizeActList) {
		this.change();
		var me = this;
		me.isCanShake = false;
		me.type = 1;
		var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
		var beginTimeLong = timestamp(beginTimeStr);
		beginTimeLong += me.dec;
		me.$lotteryCountdown.find('i').attr('etime',beginTimeLong).empty();
		me.$lotteryCountdown.find("p").html('距离摇奖开始还有');
		me.count_down();
		me.$lotteryCountdown.removeClass('none');
		hideLoading();
	},
	// 摇奖结束倒计时
	nowCountdown: function(prizeActList){
		toUrl('lottery.html?t=' + new Date().getTime());
		var me = this;
		me.isCanShake = true;
		me.type = 2;
		var endTimeStr = prizeActList.pd+" "+prizeActList.et;
		var beginTimeLong = timestamp(endTimeStr);
		beginTimeLong += me.dec;
		me.$lotteryCountdown.find('i').attr('etime',beginTimeLong).empty();
		me.$lotteryCountdown.find("p").html("距离摇奖结束还有");
		me.count_down();
		me.$lotteryCountdown.removeClass('none');
		me.index++;
		me.canJump = true;
		hideLoading();
	},
	// 跨天摇奖开启倒计时
	crossCountdown: function(nextTime) {
		this.change();
		var me = this;
		me.isCanShake = false;
		me.crossLotteryFlag = false;
		me.crossLotteryCanCallback = true;
		me.type = 1;
		var beginTimeLong = timestamp(nextTime);
		beginTimeLong += me.dec;
		me.$lotteryCountdown.find('i').attr('etime',beginTimeLong).empty();
		me.count_down();
		hideLoading();
	},
	count_down: function() {
		var me = this;
		me.$lotteryCountdown.find('i').each(function() {
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
								setTimeout(function(){
									me.lotteryRound_port();
								}, delay);
							}
						} else {
							if(me.type == 1){
								//距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
								if(!me.isTimeOver){
									me.isTimeOver = true;
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
											setTimeout(function() {
												me.crossCountdown(me.pal[me.pal.length - 1].nst);
											}, 1000);
										} else {
											me.type = 3;
											me.change();
										}
										return;
									}
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
					}
				},
				sdCallback: function(){
					me.isTimeOver = false;
				}
			});
		});
	},
	change: function() {
		this.isCanShake = false;
		this.$lotteryCountdown.find('p').html('本期摇奖已结束');
		hideLoading();
	}
};