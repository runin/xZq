(function($) {

	H.countdown = {
		timeOffset : 0,
		roundData : null,
		currentRound : 0,
		interval : null,
		intervalStart : 0,
		intervalEnd : 0,
		allBeginTime: 0,
		curPercent: 0,
		isSliding: false,
		isFirstRounding: true,
		isYaoActive : false,
		serverOffset : 0,

		$barCountdown : $('#bar_countdown .bar-blink-wrapper'),
		$barBlink : $('#bar_countdown .bar-blink'),
		$timeLeft : $('#tips_timeleft'),

		$yaoHour : $('#yao_countdown_hour'),
		$yaoHour2 : $('#yao_countdown_hour2'),
		$yaoMin : $('#yao_countdown_min'),
		$yaoMin2 : $('#yao_countdown_min2'),
		$yaoSec : $('#yao_countdown_sec'),
		$yaoSec2 : $('#yao_countdown_sec2'),

		$btnYao: $('#btn_yao'),
		$indexBar: $('#index .index-countdown'),

		init: function(){
			H.index.init();
			getResult('api/common/time', null, 'commonApiTimeHandler', null, null, null, 15000, function(){
				$('#cover').addClass('none');
				$('.page-wrapper').removeClass('none');
				H.guide.init();
				H.countdown.end();
				$('.bar-tips-dialog p').text('距下轮摇奖开始还有5分钟');
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
					if(H.countdown.currentRound <= 0){
						// FIX ME 第一轮，倒计时10分钟
						var total = 10 * 60 * 1000;
					}else{
						var total = H.countdown.intervalStart - timestamp(H.countdown.roundData[H.countdown.currentRound - 1].pd + ' ' + H.countdown.roundData[H.countdown.currentRound - 1].et);
					}

					if($.isFunction(W.roundToStart)){
						W.roundToStart(sT, total);
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

		showYaoTime: function(rT){
			var s_ = Math.round((rT % 60000) / 100);
		    s_ = dateNum(Math.round(s_ / 1000 * 100)).toString();
		    var m_ = dateNum(Math.floor((rT % 3600000) / 60000)).toString();
		    var h_ = dateNum(Math.floor((rT % 86400000) / 3600000)).toString();
		    var d_ = dateNum(Math.floor(rT / 86400000)).toString();
		    
		    if(s_ == '60'){
		    	s_ = '59';
		    }
		    
		    H.countdown.$yaoHour.text(h_.substring(0,1));
		    H.countdown.$yaoHour2.text(h_.substring(1,h_.length));
		    H.countdown.$yaoMin.text(m_.substring(0,1));
		    H.countdown.$yaoMin2.text(m_.substring(1,m_.length));
		    H.countdown.$yaoSec.text(s_.substring(0,1));
		    H.countdown.$yaoSec2.text(s_.substring(1,s_.length));
		}
	};

	W.commonApiTimeHandler = function(data){
		H.countdown.serverOffset = new Date().getTime() - data.t;
		$('#cover').addClass('none');
		$('.page-wrapper').removeClass('none');
		H.guide.init();
	};

	W.callbackLotteryRoundHandler = function(data) {
		if (data.result == true) {
			H.countdown.initCountDown(data);	
		}else{
			H.countdown.end();
		}
	};

	W.roundLoaded = function(){
		H.countdown.isYaoActive = false;
		H.yao.init();
	};

	W.roundToStart = function(timeLeft, total){
		H.countdown.isYaoActive = false;
		H.countdown.isFirstRounding = true;

		if(H.router.curSlide == 'yao'){
			H.router.slideTo('index');
			H.countdown.$barCountdown.css({
				width : '8%'
			});
		}
		
		if(total < timeLeft){
			// 节目未开始
			var percent = 0;
		}else{
			var percent = (total - timeLeft) / total;
		}
		percent += 0.01;
		if( percent - H.countdown.curPercent > 0.05 ){
			if(percent < 0.08){
				percent = 0.08;
			}
			if(percent > 1){
				percent = 1;
			}
			H.countdown.curPercent = percent;
			H.countdown.$barCountdown.css({
				width : H.countdown.curPercent * 100 + '%'
			});

			if(percent > 0.96){
				H.countdown.$barBlink.addClass('none');
			}else{
				H.countdown.$barBlink.removeClass('none');
			}
		}

		H.countdown.$timeLeft.html(showTime(timeLeft, '%H%:%M%:%S%'));

		H.countdown.$btnYao.removeClass('dh-wobble');
		H.countdown.$indexBar.removeClass('active');
	};

	W.rounding = function(timeLeft){

		H.countdown.isYaoActive = true;

		if(H.router.curSlide == 'index' && H.countdown.isFirstRounding){
			H.countdown.isFirstRounding = false;
			H.router.slideTo('yao');
		}

		H.countdown.$barCountdown.css({
			width : '100%'
		});
		
		H.countdown.$barBlink.addClass('none');

		H.countdown.curPercent = 0;
		
		H.countdown.showYaoTime(timeLeft);

		H.countdown.$btnYao.addClass('dh-wobble');
		H.countdown.$indexBar.addClass('active');
	};

	W.roundAllEnd = function(){
		H.countdown.isYaoActive = false;
		H.index.$countDownTips.find(".bar-tips-dialog p").html('本期抽奖已经全部结束了');

		if(H.router.curSlide == 'yao'){
			H.router.slideTo('index');
			H.countdown.$barCountdown.css({
				width : '8%'
			});
		}

		H.countdown.$btnYao.removeClass('dh-wobble');
		H.countdown.$indexBar.removeClass('active');
	};

})(Zepto);