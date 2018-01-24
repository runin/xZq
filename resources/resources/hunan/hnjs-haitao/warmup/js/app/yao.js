/*
 * Author: Alex Gibson
 * https://github.com/alexgibson/shake.js
 * License: MIT license
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(global, global.document);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(global, global.document);
    } else {
        global.Shake = factory(global, global.document);
    }
} (typeof window !== 'undefined' ? window : this, function (window, document) {

    'use strict';

    function Shake(options) {
        //feature detect
        this.hasDeviceMotion = 'ondevicemotion' in window;

        this.options = {
            threshold: 15, //default velocity threshold for shake to register
            timeout: 1000 //default interval between events
        };

        if (typeof options === 'object') {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.options[i] = options[i];
                }
            }
        }

        //use date to prevent multiple shakes firing
        this.lastTime = new Date();

        //accelerometer values
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;

        //create custom event
        if (typeof document.CustomEvent === 'function') {
            this.event = new document.CustomEvent('shake', {
                bubbles: true,
                cancelable: true
            });
        } else if (typeof document.createEvent === 'function') {
            this.event = document.createEvent('Event');
            this.event.initEvent('shake', true, true);
        } else {
            return false;
        }
    }

    //reset timer values
    Shake.prototype.reset = function () {
        this.lastTime = new Date();
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;
    };

    //start listening for devicemotion
    Shake.prototype.start = function () {
        this.reset();
        if (this.hasDeviceMotion) {
            window.addEventListener('devicemotion', this, false);
        }
    };

    //stop listening for devicemotion
    Shake.prototype.stop = function () {
        if (this.hasDeviceMotion) {
            window.removeEventListener('devicemotion', this, false);
        }
        this.reset();
    };

    //calculates if shake did occur
    Shake.prototype.devicemotion = function (e) {
        var current = e.accelerationIncludingGravity;
        var currentTime;
        var timeDifference;
        var deltaX = 0;
        var deltaY = 0;
        var deltaZ = 0;

        if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
            this.lastX = current.x;
            this.lastY = current.y;
            this.lastZ = current.z;
            return;
        }

        deltaX = Math.abs(this.lastX - current.x);
        deltaY = Math.abs(this.lastY - current.y);
        deltaZ = Math.abs(this.lastZ - current.z);

        if (((deltaX > this.options.threshold) && (deltaY > this.options.threshold)) || ((deltaX > this.options.threshold) && (deltaZ > this.options.threshold)) || ((deltaY > this.options.threshold) && (deltaZ > this.options.threshold))) {
            //calculate time in milliseconds since last shake registered
            currentTime = new Date();
            timeDifference = currentTime.getTime() - this.lastTime.getTime();

            if (timeDifference > this.options.timeout) {
                window.dispatchEvent(this.event);
                this.lastTime = new Date();
            }
        }

        this.lastX = current.x;
        this.lastY = current.y;
        this.lastZ = current.z;

    };

    //event handler
    Shake.prototype.handleEvent = function (e) {
        if (typeof (this[e.type]) === 'function') {
            return this[e.type](e);
        }
    };

    return Shake;
}));

(function($) {

	H.router = {
		timeOffset : 0,
		roundData : null,
		currentRound : 0,
		interval : null,
		intervalStart : 0,
		intervalEnd : 0,

		init: function(){
			showLoading();
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
				var nowTime = new Date().getTime() + H.router.timeOffset;
				var sT = isNaN(H.router.intervalStart) ? 0 : H.router.intervalStart - nowTime;
				var eT = isNaN(H.router.intervalEnd) ? 0 : H.router.intervalEnd - nowTime;

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
					H.router.startNextRound();
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

	W.callbackLotteryRoundHandler = function(data) {
		if (data.result == true) {
			H.router.initCountDown(data);
		}else{
			H.router.end();
		}
	};

	H.router.init();

})(Zepto);

(function($) {

	H.yao = {
		$bg : $('.yao-wrapper'),
		$coverTop : $('#cover_top'),
		$coverBottom : $('#cover_bottom'),
		$audioWin : $('#audio_win'),
		$audioShake : $('#audio_shake'),
		$leftCount: $('.left-chance-count'),
		$tips: $('.tips'),
		
		// 背景图长宽比
		bgRatio : 320 / 200,

		// tips垂直位置占比
		tipsPos : 130 / 251.5,
		tipsHeight : 100 / 419,

		shakeEvent: null,
		bgArgs: null,
		isReturned : true,
		leftCount: 0,

		init: function(data){
			this.resize();
			this.initShake();

			this.leftCount = parseInt(data.lc, 10);
			this.$leftCount.html(this.leftCount).parent().removeClass('none');
			
			if(H.router.roundData[H.router.currentRound] && H.router.roundData[H.router.currentRound].bi){
				this.bgArgs = H.router.roundData[H.router.currentRound].bi.split(',');
				preloadimages(this.bgArgs);	
			}


			if(getQueryString('rp') != '') {
				$('#rp_dialog').removeClass('none');
			};

			this.randomBg();
		},

		luckCallback: function(data){


			if(data.result == false){
				H.yao.winNothing();
				H.event.handle(H.yao.$bg.attr('onWinNothing'));
			}

			if(data.pt == 0){
				H.event.handle(H.yao.$bg.attr('onWinNothing'));
			}else if(data.pt == 1){
				H.event.handle(H.yao.$bg.attr('onWinShiWu'), JSON.stringify(data));
			}else if(data.pt == 2){
				H.yao.winNothing();
				H.event.handle(H.yao.$bg.attr('onWinJiFen'), JSON.stringify(data));
			}else if(data.pt == 4){
				H.yao.$audioWin[0].play();
				H.event.handle(H.yao.$bg.attr('onWinCash'), JSON.stringify(data));
			}else if(data.pt == 5){
				H.event.handle(H.yao.$bg.attr('onWinDuiHuan'), JSON.stringify(data));
			}else if(data.pt == 9){
				H.event.handle(H.yao.$bg.attr('onWinWaiLian'), JSON.stringify(data));
			}else {
				H.yao.winNothing();
				H.event.handle(H.yao.$bg.attr('onWinNothing'));
			}

			H.yao.leftCount = H.yao.leftCount - 1;
			if(H.yao.leftCount <= 0){
				H.yao.shakeEvent.stop();
				H.yao.$leftCount.parent().html('今天的摇奖机会已经用完啦');
				H.yao.$tips.addClass('none');
			}else{
				H.yao.$leftCount.html(H.yao.leftCount)	
			}
		},

		winNothing: function(){
			var textList = [
			    '摇不中啊，换个姿势再摇一次！',
			    '人生最重要的两个字是坚持，继续摇吧！',
			    '太可惜你长的太帅，红包被你亮瞎眼了',
			    '一大批红包正在袭来，抓紧摇啊！',
			    '太可惜了，竟然与红包擦肩而过',
			    '多摇几次，一定能中的！',
			    '不是故意不给中，摇奖姿势要纠正',
			    '太遗憾了，换只手吧，再摇一摇'
			];
			var i = Math.random() * textList.length
			H.yao.$tips.html(textList[Math.floor(i)]).removeClass('none');
		},

		randomBg: function(){
			if(this.bgArgs && this.bgArgs.length > 0){
				this.bgArgs = H.router.roundData[H.router.currentRound].bi.split(',');
				var rand = Math.floor(Math.random() * this.bgArgs.length);
				if(this.bgArgs[rand] == ""){
					this.$bg.css('background-image','url("./images/bg-hide-default.jpg")');
				}else{
					this.$bg.css('background-image','url(' + this.bgArgs[rand] + ')');	
				}
			}else{
				this.$bg.css('background-image','url("./images/bg-hide-default.jpg")');
			}
		},

		initShake: function(){
			this.shakeEvent = new Shake({
			    threshold: 8,
			    timeout: 1000
			});
			W.addEventListener('shake',shakeOccur, false);
		},

		resize: function(){

			width = $('.yao-wrapper').width();
			height = $('.yao-wrapper').height();

			$('.tips-container').css({
				'top' : height / 2 * H.yao.tipsPos
			});

			var bgHeight = width / this.bgRatio;
			this.$bg.css({
				'background-position-y' : (height - bgHeight) / 2 + 1,
				'background-size' : width + 'px'
			}).removeClass('none');
		}
	};

	W.shakeOccur = function(){
		H.yao.$audioShake[0].play();
		
		var heightMove = $('.yao-wrapper').width() / H.yao.bgRatio / 2 - 2;
		 H.yao.$coverTop.css({
		 	'-webkit-transform': 'translate(0px,-'+heightMove+'px)',
		 	'border-width' : '5px',
		 	'box-shadow' : '0px 1px 10px #44241A'
		 });

		 H.yao.$coverBottom.css({
		 	'-webkit-transform': 'translate(0px,'+heightMove+'px)',
		 	'border-width' : '5px',
		 	'box-shadow' : '0px 1px 10px #44241A'
		 });

		setTimeout(function(){

			if(H.yao.isReturned == true){
				H.yao.isReturned = false;
				getResult('api/lottery/luck',{
					oi: openid
				},'callbackLotteryLuckHandler');
			}

			 H.yao.$coverTop.css({
			 	'-webkit-transform': 'translate(0px,0px)',
			 });

			 H.yao.$coverBottom.css({
			 	'-webkit-transform': 'translate(0px,0px)',
			 });

			 setTimeout(function(){

			 	 H.yao.$coverTop.css({
				 	'border-width' : '0px',
				 	'box-shadow' : 'none'
				 });

				 H.yao.$coverBottom.css({
				 	'border-width' : '0px',
				 	'box-shadow' : 'none'
				 });

				 H.yao.randomBg();

			 }, 150);

		},800);
		
	};

	W.callbackLotteryLuckHandler = function(data){
		H.yao.isReturned = true;
		hideLoading();
		H.yao.luckCallback(data);
	};

	W.roundLoaded = function(){
		getResult('api/lottery/leftLotteryCount',{
			oi: openid
		}, 'callbackLotteryleftLotteryCountHandler');
	};

	W.callbackLotteryleftLotteryCountHandler = function(data){
		hideLoading();
		if(data.result && data.lc > 0){
			H.yao.init(data);
		}else{
			location.href= "./index.html";
		}
	}

	W.roundToStart = function(timeLeft){
		H.event.handle(H.yao.$bg.attr('onCountDownToStart'), timeLeft);
		
		if(H.yao.canShake){
			H.yao.canShake = false;
			if(H.yao.shakeEvent){
				H.yao.shakeEvent.stop();
			}
		}
	};

	W.rounding = function(timeLeft){

		H.event.handle(H.yao.$bg.attr('onCountDown'), timeLeft);
		
		if(!H.yao.canShake){
			if(H.yao.shakeEvent){
				H.yao.canShake = true;
				H.yao.shakeEvent.start();
			}
		}
	};

	W.roundAllEnd = function(){
		H.event.handle(H.yao.$bg.attr('onCountDownEnd'));

		if(H.yao.canShake){
			H.yao.canShake = false;
			if(H.yao.shakeEvent){
				H.yao.shakeEvent.stop();
			}
		}
	};


})(Zepto);