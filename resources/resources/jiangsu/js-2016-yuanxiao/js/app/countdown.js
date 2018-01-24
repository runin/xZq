(function($) {

	H.countdown = {
		timeOffset : 0,
		roundData : null,
		currentRound : 0,
		interval : null,
		intervalStart : 0,
		intervalEnd : 0,

		init: function(){
			getResult('api/lottery/round4callback',{
				at : 11
			}, 'callbackVipLotteryRoundHandler', null, null, null, null, function(){
				H.rolling.roundError();
			});		
		},

		initCountDown: function(data){
			var now = new Date();
			this.timeOffset = data.sctm - now.getTime();
			this.roundData = data.la;
			
			this.currentRound = this.getCurrentRound();
			if(this.currentRound >= 0){
				this.updateCountDown();	
			}else{
				this.end();
			}
			
			if($.isFunction(W.roundLoaded)){
				W.roundLoaded();
			}
		},

		updateCountDown: function(){
			var start = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].st;
			var end = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].et;
			this.intervalStart = timestamp(start);
			this.intervalEnd = timestamp(end);
			clearInterval(this.interval);
			this.interval = setInterval(function(){
				var nowTime = new Date().getTime() + H.countdown.timeOffset;
				var sT = isNaN(H.countdown.intervalStart) ? 0 : H.countdown.intervalStart - nowTime;
				var eT = isNaN(H.countdown.intervalEnd) ? 0 : H.countdown.intervalEnd - nowTime;

				if (sT >= 0) {
					// 即将开始
					if($.isFunction(W.roundToStart)){
						W.roundToStart(sT);
					}
				} else if (eT >= 0) {
					//正在进行
					if($.isFunction(W.rounding)){
						W.rounding(eT);
					}
				} else {
					// 结束
					H.countdown.startNextRound();
				}
			}, 100);
		},

		startNextRound: function(){
			this.currentRound++;
			if(this.currentRound >= this.roundData.length){
				this.end();
				return ;
			}
			this.updateCountDown();
		},

		getCurrentRound: function(){
			var now = new Date().getTime() + this.timeOffset;
			for(var i in this.roundData){
				var et = this.roundData[i].pd + ' ' + this.roundData[i].et;
				if( now < timestamp(et) ){
					return i;
				}
			}
			return -1;
		},

		end: function(){
			if($.isFunction(W.roundAllEnd)){
				W.roundAllEnd();
			}
		},
	};

	W.callbackVipLotteryRoundHandler = function(data) {
		if (data.result == true) {
			H.countdown.initCountDown(data);
		}else{
			H.countdown.end();
		}
	};

	W.roundLoaded = function(){
		H.rolling.init();
	};

	W.roundToStart = function(timeLeft){
		H.rolling.toStart(timeLeft);
	};

	W.rounding = function(timeLeft){
		H.rolling.begin(timeLeft);
	};

	W.roundAllEnd = function(){
		H.rolling.allEnd();
	};

	H.countdown.init();

})(Zepto);


