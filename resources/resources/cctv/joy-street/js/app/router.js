(function($) {

	H.router = {
		timeOffset : 0,
		currentDate : '',
		roundData : null,
		currentRound : 0,
		interval : null,
		intervalStart : 0,
		intervalEnd : 0,
		isActive : false,
		isIndex : true,

		$countDown : $('.countdown'),

		init: function(){
			getResult('api/lottery/round?ran=' + Math.random(), {}, 'callbackLotteryRoundHandler');
			
		},

		bindClick: function(){
			this.$countDown.click(function(){
				if($(this).hasClass('active')){
					var query = "";
					var key = 'cb41faa22e731e9b';
					var value = getQueryString(key);
					if(value){
						query = "?" + key + "=" + value;
					}

					location.href = "./index.html" + query;
				}
			});
		},

		initCountDown: function(data){
			var now = new Date();
			this.timeOffset = data.sctm - now.getTime();
			
			if(data.la.length > 0){
				this.currentDate = data.la[0].pd;
			}

			this.roundData = data.la;
			this.currentRound = this.getCurrentRound();

			if(location.href.indexOf('index') >= 0 || location.href.indexOf('.html') < 0 ){
				this.isIndex = true;
				this.bindClick();
			}else{
				this.isIndex = false;
				this.bindClick();
			}
			if(this.currentRound >= 0){
				if(this.isIndex){
					if(this.isCurrentRoundActive()){
						this.isActive = true;
						this.updateIndexCountDown(true);
					}else{
						this.isActive = false;
						this.updateIndexCountDown(false);
					}
					H.index.init();
				}else{
					if(this.isCurrentRoundActive()){
						this.isActive = true;
						this.updateOtherCountDown(true);
					}else{
						this.isActive = false;
						this.updateOtherCountDown(false);
					}
				}
			}else{
				this.end();
			}

			
		},

		getCurrentRound: function(){
			var now = new Date().getTime() + this.timeOffset;
			for(var i in this.roundData){
				var nst = this.roundData[i].nst;
				if( now < timestamp(nst) ){
					if(i == this.roundData.length){
						return -1
					}
					return i;
				}
			}
			return -1;
		},

		isCurrentRoundActive: function(){
			var now = new Date().getTime() + this.timeOffset;
			var et = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].et;
			var st = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].st;
			if( timestamp(et) > now && timestamp(st) < now ){
				return true;
			}else{
				return false;
			}
		},


		updateIndexCountDown: function(isActive){
			this.isActive = isActive;
			if( this.currentRound == -1 || (this.currentRound == this.roundData.length - 1 && !isActive) ){
				this.end();
				clearInterval(this.interval);
				return ;
			}

			if(isActive){
				this.$countDown.html('距离本轮轮结束还有<span class="time">00:00</span>');
				var start = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].st;
				var end = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].et;
			}else{
				this.toRandom();
				
				this.$countDown.html('距离下一轮开始还有<span class="time">00:00</span>');
				this.$countDown.removeClass('active');
				var start = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].et;
				var end = this.roundData[this.currentRound].nst;
			}

			this.intervalStart = timestamp(start);
			this.intervalEnd = timestamp(end);
			clearInterval(this.interval);
			this.interval = setInterval(function(){
				var nowTime = new Date().getTime() + H.router.timeOffset;
				var sT = isNaN(H.router.intervalStart) ? 0 : H.router.intervalStart - nowTime;
				var eT = isNaN(H.router.intervalEnd) ? 0 : H.router.intervalEnd - nowTime;

				if (sT >= 0) {
					// 即将开始
					H.router.showTime(sT, '%M%:%S%');
				} else if (eT >= 0) {
					//正在进行
					H.router.showTime(eT, '%M%:%S%');
				} else {
					// 结束
					if(isActive){
						H.router.updateIndexCountDown(false);
					}else{
						H.router.startNextRound();
					}
				}
			}, 100);
		},

		updateOtherCountDown: function(isActive){
			this.isActive = isActive;
			if( this.currentRound == -1 || (this.currentRound == this.roundData.length - 1 && !isActive) ){
				this.end();
				clearInterval(this.interval);
				return ;
			}

			if(isActive){
				this.$countDown.html('距离本轮结束还有<span class="time">00:00</span>');
				this.$countDown.addClass('active');
				var start = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].st;
				var end = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].et;
			}else{
				this.$countDown.html('距离下一轮开始还有<span class="time">00:00</span>');
				this.$countDown.removeClass('active');
				var start = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].et;
				var end = this.roundData[this.currentRound].nst;
			}

			this.intervalStart = timestamp(start);
			this.intervalEnd = timestamp(end);
			clearInterval(this.interval);
			this.interval = setInterval(function(){
				var nowTime = new Date().getTime() + H.router.timeOffset;
				var sT = isNaN(H.router.intervalStart) ? 0 : H.router.intervalStart - nowTime;
				var eT = isNaN(H.router.intervalEnd) ? 0 : H.router.intervalEnd - nowTime;

				if (sT >= 0) {
					// 即将开始
					H.router.showTime(sT, '%M%:%S%');
				} else if (eT >= 0) {
					//正在进行
					H.router.showTime(eT, '%M%:%S%');
				} else {
					// 结束
					if(isActive){
						H.router.updateOtherCountDown(false);
					}else{
						H.router.startNextRound();
					}
				}
			}, 100);
		},

		showTime: function(rT, showTpl){
			var s_ = Math.round((rT % 60000) / 100);
			s_ = H.router.subNum(H.router.dateNum(Math.round(s_ / 1000 * 100)));
			var m_ = H.router.subNum(H.router.dateNum(Math.floor((rT % 3600000) / 60000)));
			var h_ = H.router.subNum(H.router.dateNum(Math.floor((rT % 86400000) / 3600000)));
			var d_ = H.router.subNum(H.router.dateNum(Math.floor(rT / 86400000)));
			this.$countDown.find('.time').html(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_));
		},

		subNum: function(num){
			numF = num.toString().substring(0,1);
			numS = num.toString().substring(1,num.length);
			return num = "<label>"+ numF + "</label><label>" + numS + '</label>';
		},

		dateNum: function(num) {
			return num < 10 ? '0' + num : num;
		},

		startNextRound: function(){
			this.currentRound++;
			if(this.currentRound >= this.roundData.length){
				this.end();
				return ;
			}

			if(this.isIndex){
				this.updateIndexCountDown(true);
			}else{
				this.updateOtherCountDown(true);
			}
			
		},

		end: function(){
			this.$countDown.text('今天的活动已经全部结束啦');
			this.$countDown.removeClass('active');
			if(location.href.indexOf('index') >= 0 || location.href.indexOf('.html') < 0 ){
				this.toRandom();
			}
		},

		toRandom: function(){

			// 如果有红包显示，则不跳转
			var hasHongbao = false;
			$('.hongbao-wrapper').each(function(){
				if(!$(this).hasClass('none')){
					hasHongbao = true;
				}
			});
			if(hasHongbao){
				return;
			}

			var rand = Math.floor(Math.random() * 3);

			var query = "";
			var key = 'cb41faa22e731e9b';
			var value = getQueryString(key);
			if(value){
				query = "?" + key + "=" + value;
			}
			
			var target = '';
			if(rand == 0){
				target = './comment.html' + query;
			}else if(rand == 1){
				target = './zuji-view.html' + query;
			}else{
				target = './toutiao.html' + query;
			}

			location.href = target;
		}
	};

	W.callbackLotteryRoundHandler = function(data) {
		hideLoading();
		if (data.result == true) {
			H.router.initCountDown(data);
		}else{
			H.router.end();
		}
	};

	H.router.init();

})(Zepto);
