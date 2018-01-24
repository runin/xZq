(function($) {

	H.index = {
		$bg : $('.main'),
		$coverTop : $('#cover_top'),
		$coverBottom : $('#cover_bottom'),
		$hongbaos : $('.hongbao'),
		$hongbaoClicks : $('.hongbao-click'),
		$hongbaoClicksWrapper : $('.hongbao-click-wrapper'),
		$hongbaoTips : $('.tips-hongbao'),
		$xianjin : $('#xianjin'),
		$jifen : $('#jifen'),
		$ticket : $('#ticket'),
		$audioWin : $('#audio_win'),
		$audioShake : $('#audio_shake'),
		
		// 红包图片长宽比
		hongbaoRatio : 553 / 804,

		// 背景图长宽比
		bgRatio : 320 / 200,

		// 圆圈文字垂直位置占比
		clickWrapperPos : 0.58,

		// tips垂直位置占比
		tipsPos : 130 / 251.5,
		tipsHeight : 100 / 419,


		shakeEvent: null,
		bgArgs: null,
		adTitleNo: 1006,
		adLinkNo: 1007,
		isReturned : true,

		init: function(){
			H.rule.init();

			this.resize();
			this.bindBtn();
			this.initShake();
			if(H.router.isActive){
				this.shakeEvent.start();
			}

			getResult('api/ad/get',{
				areaNo : this.adLinkNo
			}, 'callbackAdGetHandler');

			getResult('api/lottery/leftLimitPrize',{
				at : 1
			},'callbackLeftLimitPrizeHandler');
			
			this.bgArgs = H.router.roundData[H.router.currentRound].bi.split(',');
			preloadimages(this.bgArgs);
			
			var rp = getQueryString('rp');
			if(rp){
				$('#success').removeClass('none');
			}

		},

		bindBtn: function(){
			
			$('.hongbao-close').click(function(){
				$(this).parent().parent().addClass('none');
				H.index.shakeEvent.start();
				return false;
			});

			$('#success_ok').click(function(){
				$('#success').addClass('none');
				H.index.shakeEvent.start();
			});

			$('#jifen_submit').click(function(){
				H.index.awardSuccess();
			});

		},

		randomBg: function(){
			if(this.bgArgs.length > 0){
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

		luckCallback: function(data){
			if(data.result == false){
				// 未中奖
				return;
			}

			if(data.pt == 4){
				this.shakeEvent.stop();
				// 现金红包
				this.$audioWin[0].play();
				this.$xianjin.removeClass('none');
				this.$xianjin.find('.hongbao').click(function(){
					location.href = data.rp;
				});
				this.$xianjin.find('.hongbao-num span').text(Math.floor(data.pv/100) + '.00');

			}else if(data.pt == 2){
				this.shakeEvent.stop();
				// 积分
				this.$audioWin[0].play();
				this.$jifen.removeClass('none');
				this.$jifen.find('.hongbao-jifen img').attr('src', data.pi);

				this.fillUserInfo(data);

			}else if(data.pt == 5){
				this.shakeEvent.stop();
				// 兑换码
				this.$audioWin[0].play();
				this.$ticket.removeClass('none');

				this.$ticket.find('.hongbao-ticket img').attr('src', data.pi);
				$('#code').text('兑换码 : ' + data.cc);
				$('#ticket_submit').attr('href', data.ru);

			}else {
				// 未中奖
				return;
			}
		},

		linkCallback: function(data){
			if(data.ads.length > 0){
				var linkUrl = '<a href="javascript:void(0);" data-collect="true" data-collect-flag="joy-street-index-ad" data-collect-desc="喜乐街 首页广告">' + data.ads[0].c + '</a>';
				$('.hongbao-link').html(linkUrl).removeClass('none');
				$('#qrcode .qrcode-img').attr('src', data.ads[0].p);
				$('.hongbao-link').click(function(){
					$('#qrcode').parent().removeClass('none');
				});
			}
		},

		awardSuccess: function(){
			this.$jifen.addClass('none');
			$('#success').removeClass('none');
		},

		fillUserInfo: function(data){
			if(data && data.rn){
				$('#name').val(data.rn);
			}

			if(data && data.ad){
				$('#add').val(data.ad);
			}

			if(data && data.ph){
				$('#tel').val(data.ph);
			}
		},


		resize: function(){

			width = $(window).width();
			height = $(window).height();

			this.$coverTop.css({
				'height' : height / 2,
				'background-size' : width + 'px ' + height/2 + 'px'
			});

			this.$coverBottom.css({
				'height' : height / 2,
				'background-size' : width + 'px ' + height/2 + 'px'
			});

			var hongbaoHeight = width * 0.9 / this.hongbaoRatio;
			this.$hongbaos.css({
				'height' : hongbaoHeight,
				'top' : (height - hongbaoHeight) / 2
			});

			this.$hongbaoClicksWrapper.css({
				'top' : hongbaoHeight * H.index.clickWrapperPos
			});

			$('.hongbao-click').css({
				'height' : hongbaoHeight * H.index.tipsHeight + 'px',
				'line-height' : hongbaoHeight * H.index.tipsHeight + 'px'
			});

			$('.tips-container').css({
				'top' : hongbaoHeight / 2 * H.index.tipsPos
			});


			var bgHeight = width / this.bgRatio;
			this.$bg.css({
				'background-position-y' : (height - bgHeight) / 2 + 1,
				'background-size' : width + 'px'
			}).removeClass('none');

		}
	};


	W.shakeOccur = function(){
		H.index.$audioShake[0].play();
		
		var heightMove = $(window).width() / H.index.bgRatio / 2 - 2;

		 H.index.$coverTop.css({
		 	'-webkit-transform': 'translate(0px,-'+heightMove+'px)',
		 	'border-width' : '5px',
		 	'box-shadow' : '0px 1px 10px #44241A'
		 });

		 H.index.$coverBottom.css({
		 	'-webkit-transform': 'translate(0px,'+heightMove+'px)',
		 	'border-width' : '5px',
		 	'box-shadow' : '0px 1px 10px #44241A'
		 });

		setTimeout(function(){

			if(H.index.isReturned == true){
				H.index.isReturned = false;
				getResult('api/lottery/luck',{
					oi: openid,
					sau : H.router.currentDate
				},'callbackLotteryLuckHandler');
			}

			 H.index.$coverTop.css({
			 	'-webkit-transform': 'translate(0px,0px)',
			 });

			 H.index.$coverBottom.css({
			 	'-webkit-transform': 'translate(0px,0px)',
			 });

			 setTimeout(function(){

			 	 H.index.$coverTop.css({
				 	'border-width' : '0px',
				 	'box-shadow' : 'none'
				 });

				 H.index.$coverBottom.css({
				 	'border-width' : '0px',
				 	'box-shadow' : 'none'
				 });

				 H.index.randomBg();

			 }, 150);

		},800);
		
	};

	W.callbackLotteryLuckHandler = function(data){
		H.index.isReturned = true;
		hideLoading();
		H.index.luckCallback(data);
	};

	W.callbackAdGetHandler = function(data){
		if(data.code == 0){
			H.index.linkCallback(data);
		}
	};

	W.callbackLeftLimitPrizeHandler = function(data){
		if(data.result == true){
			if(data.lc > 0){
				H.index.$hongbaoTips.removeClass('none');
			}else{
				H.index.$hongbaoTips.addClass('none');
			}
			H.index.$hongbaoTips.text('还剩'+ data.lc +'个红包');
		}
		setTimeout(function(){
			getResult('api/lottery/leftLimitPrize',{
				at : 1
			},'callbackLeftLimitPrizeHandler');
		}, 5000);
	};

})(Zepto);