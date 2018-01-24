(function($) {

	H.indexcountdown = {
		timeOffset : 0,
		roundData : null,
		currentRound : 0,
		interval : null,
		intervalStart : 0,
		intervalEnd : 0,
		$cdw: $('#mcdw'),
		$cd: $('#mcd'),

		init: function(){
			getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler');					
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
			
			if($.isFunction(W.indexRoundLoaded)){
				W.indexRoundLoaded();
			}
		},

		updateCountDown: function(){
			var start = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].st;
			var end = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].et;
			this.intervalStart = timestamp(start);
			this.intervalEnd = timestamp(end);
			clearInterval(this.interval);
			this.interval = setInterval(function(){
				var nowTime = new Date().getTime() + H.indexcountdown.timeOffset;
				var sT = isNaN(H.indexcountdown.intervalStart) ? 0 : H.indexcountdown.intervalStart - nowTime;
				var eT = isNaN(H.indexcountdown.intervalEnd) ? 0 : H.indexcountdown.intervalEnd - nowTime;

				if (sT >= 0) {
					// 即将开始
					if($.isFunction(W.indexRoundToStart)){
						W.indexRoundToStart(sT);
					}
				} else if (eT >= 0) {
					//正在进行
					if($.isFunction(W.indexRounding)){
						W.indexRounding(eT);
					}
				} else {
					// 结束
					H.indexcountdown.startNextRound();
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
			if($.isFunction(W.indexRoundAllEnd)){
				W.indexRoundAllEnd();
			}
		},
	};

	W.callbackLotteryRoundHandler = function(data) {
		if (data.result == true) {
			H.indexcountdown.initCountDown(data);
		}else{
			H.indexcountdown.end();
		}
	};

	W.indexRoundLoaded = function(){
		
	};

	W.indexRoundToStart = function(timeLeft){
		H.indexcountdown.$cdw.removeClass('none');
		H.indexcountdown.$cd.html(showTime(timeLeft, "%H%:%M%:%S%"));
	};

	W.indexRounding = function(timeLeft){
		location.href = 'yao.html';	
	};

	W.indexRoundAllEnd = function(){
		
	};

	H.indexcountdown.init();

})(Zepto);


