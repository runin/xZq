(function($) {
	
	H.yao = {
		$bg : $('.main'),
		$coverTop : $('#cover_top'),
		$coverBottom : $('#cover_bottom'),
		$audioWin : $('#audio_win'),
		$audioShake : $('#audio_shake'),
		$countDown : $('.countdown'),
		$hongbaoTips : $('.tips-hongbao'),
		$tips : $('#luck_tips'),

		// 背景图长宽比
		bgRatio : 320 / 200,
		hongbaoRatio : 557 / 882,
		hongbaoTextRatio : 90 / 882,
		hongbaoImghRatio : 270 / 882,
		hongbaoMoneyRatio : 440 / 882,
		hongbaoMoneyClickRatio : 671 / 882,

		tipsRatio : 440 / 800,
		isActive : true,
		isReturned : true,
		bgArgs : null,

		shakeEvent : null,
		roundData : null,

		canShake : false,

		init: function() {
			this.resize();
			this.bindBtn();
			this.initShake();
	
			this.bgArgs = H.router.roundData[H.router.currentRound].bi.split(',');
			preloadimages(this.bgArgs);

			var rp = getQueryString('rp');
			if(rp){
				$('#hongbao_rp').removeClass('none');
			}

			getResult('api/common/promotion',{
				oi : openid
			},'commonApiPromotionHandler');
		},

		bindBtn: function(){
			$('.hongbao-close').click(function(){
				$(this).parent().parent().addClass('none');
				H.yao.shakeEvent.start();
				return false;
			});

			$('#success_ok').click(function(){
				$('#success').addClass('none');
				H.yao.shakeEvent.start();
			});

			$('#hongbao_ok').click(function(){
				var name = $.trim($('#name').val());
				var tel = $.trim($('#tel').val());
				var add = $.trim($('#add').val());

				if(!tel){
					alert("手机号码不能为空");
					return;
				}else if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(tel)){
				    alert('这个手机号可打不通...');
				    return;
				}

				if(name.length <= 0){
					alert('请填写姓名');
					return;
				}

				if(add.length <= 0){
					alert('请填写收货地址');
					return;
				}

				$('#name_confirm').text('联系人：'+name);
				$('#tel_confirm').text('联系号码：'+tel);
				$('#add_confirm').text('收货地址：'+add);
				$('#ticket').addClass('none');
				$('#ticket_confirm').removeClass('none');

			});

			$('#hongbao_submit').click(function(){
				var name = $.trim($('#name').val());
				var tel = $.trim($('#tel').val());
				var add = $.trim($('#add').val());

				getResult('api/lottery/award',{
					oi : openid,
					nn : encodeURIComponent(nickname),
					hi : headimgurl,
					ph : tel,
					ad : encodeURIComponent(add),
					rn : encodeURIComponent(name)
				},'callbackLotteryAwardHandler');

			});

			$('#hongbao_back').click(function(){
				$('#ticket_confirm').addClass('none');
				$('#ticket').removeClass('none');
			});

			$('#hongbao_rp .hongbao-click').click(function(){
				$('#hongbao_rp').addClass('none');
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
				this.luckFail();
				return;
			}

			if(data.pt == 1){
				this.shakeEvent.stop();
				// 实物奖品
				this.$audioWin[0].play();
				this.fillUserInfo(data);

				$('#ticket .hongbao-title p').text('恭喜您，获得' + data.pn + data.pt + data.pu);
				$('.hongbao-ticket img').attr('src', data.pi);
				
				$('#ticket').removeClass('none');
			}else if(data.pt == 4){
				this.shakeEvent.stop();
				// 红包奖品
				this.$audioWin[0].play();
				$('.hongbao-cash span').html(Math.floor(data.pv / 100) + '.00');
				$('#hongbao .hongbao-click').attr('href', data.rp);

				$('#hongbao').removeClass('none');
			}else {
				// 未中奖
				this.luckFail();
				return;
			}
		},

		luckFail: function(){
			var lostTips = [
				'加油，还差一点就中奖了',
				'可惜，红包就在近在咫尺了啊',
				'哎，下一次就是人品爆发的时候',
				'啊呀，再来一次！'
			];
			var ran = Math.floor( Math.random() * 4 );
			this.$tips.text(lostTips[ran]);
		},

		luckWait: function(){
			var lostTips = [
				'抢红包 抢大奖 和家人一起摇一摇'
			];
			this.$tips.text(lostTips[0]);
		},

		fillUserInfo: function(data){
			if(data && data.rn){
				$('#name').val(data.rn);
			}

			if(data && data.ph){
				$('#tel').val(data.ph);
			}

			if(data && data.ad){
				$('#add').val(data.ad);
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
			alert('领取成功！');
			$('#ticket_confirm').addClass('none');
			this.shakeEvent.start();
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
			var width = $(window).width();
			var height = $(window).height();

			this.$coverTop.css({
				'height' : height / 2,
				'background-size' : width + 'px ' + height/2 + 'px'
			});

			this.$coverBottom.css({
				'height' : height / 2,
				'background-size' : width + 'px ' + height/2 + 'px'
			});

			var bgHeight = width / this.bgRatio;
			$('.main').css({
				'height': height,
				'background-position-y' : (height - bgHeight) / 2 + 1,
				'background-size' : width + 'px'
			}).removeClass('none');


			var hongbaoHeight = width * 0.9 / this.hongbaoRatio;
			if(hongbaoHeight > height){
				hongbaoHeight = height;
			}
			$('.hongbao').css({
				'height' : hongbaoHeight,
				'top' : (height - hongbaoHeight) / 2
			});

			var tipsHeight = width * this.tipsRatio;
			$('#luck_tips').css('top',tipsHeight);

			$('.hongbao-title').css({
				'padding-top' : hongbaoHeight * this.hongbaoTextRatio
			});

			$('.hongbao-ticket').css({
				'padding-top' : hongbaoHeight * this.hongbaoImghRatio
			});

			$('.hongbao-cash').css({
				'top' : hongbaoHeight * this.hongbaoMoneyRatio
			});

			$('#hongbao .hongbao-click-wrapper').css({
				'position' : 'absolute',
				'top' : hongbaoHeight * this.hongbaoMoneyClickRatio
			});

			$('#hongbao_rp .hongbao-click-wrapper').css({
				'position' : 'absolute',
				'top' : hongbaoHeight * this.hongbaoMoneyClickRatio
			});
		}
	};

	W.shakeOccur = function(){
		H.yao.$audioShake[0].play();
		H.yao.luckWait();
		
		var heightMove = $(window).width() / H.yao.bgRatio / 2 - 2;

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
					oi : openid
				}, 'callbackLotteryLuckHandler');
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

	W.callbackLotteryAwardHandler = function(data){
		H.yao.awardSuccess();
	};


	W.roundLoaded = function(){
		H.yao.init();
	};

	W.roundToStart = function(timeLeft){
		H.yao.$hongbaoTips.html('提醒您，距离下次抢红包还有：');
		H.yao.$countDown.html(showTime(timeLeft, '<p class="time"><span>%H%</span>小时<span>%M%</span>分<span>%S%</span>秒</p>'));

		if(H.yao.canShake){
			H.yao.canShake = false;
			H.yao.shakeEvent.stop();
		}
	};

	W.rounding = function(timeLeft){
		H.yao.$hongbaoTips.html('距离本轮抢红包结束还有：');
		H.yao.$countDown.html(showTime(timeLeft, '<p class="time"><span>%H%</span>小时<span>%M%</span>分<span>%S%</span>秒</p>'));

		if(!H.yao.canShake){
			H.yao.canShake = true;
			H.yao.shakeEvent.start();
		}
	};

	W.roundAllEnd = function(){
		H.yao.$hongbaoTips.html('本期摇旅游结束了');
		H.yao.$countDown.html('请明天再来~');

		if(H.yao.canShake){
			H.yao.canShake = false;
			H.yao.shakeEvent.stop();
		}
	};

	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			$('#tttj').html(data.desc).attr('href', data.url).removeClass('none');
		}else{
			$('#tttj').addClass('none');
		}
	};


})(Zepto);