(function($) {
    


	H.game = {
		$bg : $('.game'),
		$player : $('#player'),
		$lostDialog : $('#lost_dialog'),
		$rpDialog : $('#rp_dialog'),
		$award: $('#award'),
		$awardTips: $('#award_tips'),
		$dice: $('#dice'),
		$fixCountDown: $('#fixed_count_down'),
		$handTips: $('#hand_tips'),
		$diceBgm: $('#dice_bgm'),
        $success_dialog:$('#success_dialog'),

		$lastLotteryCookieKey: 'lastLottery',



		/*
		* 游戏配置
		*/
		stepPosition: [
			[230,100],
			[50,290],
			[230,490],
			[50,750],
			[230,1130]
		],

		/*
		* 游戏变量
		*/
		// 背景默认宽度
		orginWidth: 320,
		orginHeight: 1204,
		// 屏幕拉伸程度
		widthScale: 1,
		currentStep: 1,
		totalStep: 5,
		shakeEvent: null,

		init: function(){
			this.resize();
			this.initDialog();
			this.initMap();

			var rp = getQueryString('rp');
			if(rp){
				var top = $(window).scrollTop() + ($(window).height() - 300) / 2;
				this.$rpDialog.removeClass('none');
				this.$rpDialog.find('.dialog').css('top',top);
			}
		},

		initShake: function(){
			this.shakeEvent = new Shake({
			    threshold: 7,
			    timeout: 1000
			});

			W.addEventListener('shake',shakeOccur, false);
		},

		luckCallback: function(data){
			// save cookies
			$.fn.cookie(this.$lastLotteryCookieKey, (new Date().getTime()) + H.index.timeOffset );
			
			setTimeout(function(){
				var dice = H.game.$dice.find('.dice').removeClass('run');
				if(!data.result){
					dice.addClass('face3');
				}else if(data.pt == 2){
					dice.addClass('face3');
				}else if(data.ip == 1){
					dice.addClass('face4');
				}else{
					if(data.pv > 0){
						// 前进
						dice.addClass('face1');

					}else{
						// 后退
						dice.addClass('face2');
					}
				}
			},1000);

			setTimeout(function(){
				H.game.afterLuck(data);
			},1800);
		},

		afterLuck: function(data){
			
			if(!data.result){
				// 如果是非抽奖时间，则提示落水	
				this.resetDice();			
				this.over();

			}else if(data.pt == 2){
				// 如果返回积分，则提示落水
				this.resetDice();
				this.over();
			}else{
				// 前进或者后退
				if(data.ip == 1){
					this.resetDice();
					this.win();
				}else{
					this.resetDice();
					this.currentStep = data.cr;
					this.playerMove(this.currentStep);
				}

			}
		},

		resetDice: function(){
			this.$dice.removeClass('in');
			this.$dice.find('.dice').removeClass('face1')
									.removeClass('face2')
									.removeClass('face3')
									.removeClass('face4');
		},

		playerMove: function(n){
			this.$player.removeClass('hide');
			this.$player.css({
				'-webkit-transform' : "translate(" + this.stepPosition[n-1][0] * this.widthScale + "px, " + this.stepPosition[n-1][1] + "px)"
			});

			setTimeout(function(){
				H.game.afterMove();
			},400);

			this.animScroll(this.stepPosition[n-1][1] + 275);
		},

		animScroll: function(top){
			W.step = 25;
			W.t = 0;
			W.orginTop = $(window).scrollTop();
			W.distance = top - W.orginTop;

			W.scrollInterval = setInterval(function(){
				$('body,html').scrollTop(W.orginTop + W.distance * ((W.t / W.step)) );
				W.t++;
				if(W.t > W.step){
					clearInterval(W.scrollInterval);
				}
			}, 1);
		},


		afterMove: function(){
			this.shakeEvent.start();	
			if(this.currentStep > 1 && this.currentStep < this.totalStep){
				this.$handTips.removeClass('none');	
			}
		},

		start: function(){
			this.initShake();
			this.playerMove(this.currentStep);
			this.show321();

			H.game.$fixCountDown.removeClass('none');
		},	

		win: function(){
			this.$awardTips.html('恭喜您，闯关成功！');
			this.$award.removeClass('gray');
			this.playerMove(this.totalStep);

			this.reset();
		},

		reset: function(){
			this.currentStep = 1;
			this.$fixCountDown.addClass('none');
			this.shakeEvent.stop();
			this.$handTips.addClass('none');
		},

		over: function(){
			var top = $(window).scrollTop() + ($(window).height() - 300) / 2;
			this.$lostDialog.removeClass('none');

			this.$lostDialog.find('.dialog').css('top',top);
			this.$player.addClass('hide');
			setTimeout(function(){
				H.game.$player.css('-webkit-transform','none');
			},1000);
			
			this.$awardTips.text('到达终点，抽取大奖！');

			this.reset();
		},

		finalLuckCallback: function(data){
			if(!data.result){
				alert('很遗憾没有中奖哦，请再接再厉吧');
				this.$award.addClass('gray');
				this.$awardTips.text('到达终点，抽取大奖！');
				return;
			}

			if(data.pt == 9){
				if( (data.ru && data.ru.indexOf('chediandian') >= 0) ||(data.ru && data.ru.indexOf('app.ly.com') >= 0)){
					var top = ($(window).height() - 470) / 2;
					$('#dui_hongbao_dialog .hongbao-tips-img img').attr('src', data.pi);
					$('#dui_hongbao_dialog .hongbao-tips-name').text(data.pn);
					$('#dui_hongbao_dialog .tips-name').text(data.pn);
					$('#dui_hongbao_dialog .dialog').css('top',top);
					$('#dui_hongbao_dialog').removeClass('none');
					$('#dui_hongbao_dialog').data('aw', data.aw);
					$('#dui_hongbao_dialog').data('ru', data.ru);
				}else{
					var top = ($(window).height() - 470) / 2;
					$('#tttj_hongbao_dialog .hongbao-tttj-img img').attr('src', data.pi);
					$('#tttj_hongbao_dialog .tips-name').text(data.pn);
					$('#tttj_hongbao_dialog .dialog').css('top',top);
					$('#tttj_hongbao_dialog').removeClass('none');
					$('#tttj_hongbao_dialog').data('aw', data.aw);
					$('#tttj_hongbao_dialog').data('ru', data.ru);
				}
				
			}else if(data.pt == 4){
				var top = $(window).scrollTop() + ($(window).height() - 370) / 2;
				$('#cash_hongbao_dialog .hongbao-tips-cash p').text('￥' + Math.floor(data.pv / 100) + '.00' );
				$('#cash_hongbao_dialog .tips-name').text(data.pn);

				$('#cash_hongbao_dialog .dialog').css('-webkit-transform','translate(0,' + top + 'px)');
				$('#cash_hongbao_dialog').removeClass('none');
				$('#cash_hongbao_dialog').click(function(){
					location.href = data.rp;
				});
			}else{
				alert('很遗憾没有中奖哦，请再接再厉吧');
				this.$award.addClass('gray');
				this.$awardTips.text('到达终点，抽取大奖！');
			}
		},

		getPaySignType:function(mobile,pz,timestamp){
			var key =  "91quible4lfwm0za";
			var channel = '50';
			var sign = mobile+""+pz+""+channel+""+timestamp+""+key;
			var md5SignValue = hex_md5(sign).toUpperCase();
			return md5SignValue;
		},

		tttjSignType: function(mobile, type, score, name, source, timestamp){
			var key = "az0mwfl4elbiuq19";
			var sign = mobile+""+type+""+score+""+name+""+source+""+timestamp+key;
			var md5SignValue = hex_md5(sign).toUpperCase();
			return md5SignValue;
		},

		showDice: function(){
			this.$dice.removeClass('none');
			var center = $(window).width() / 2;
			this.$dice.css({
				left : center - 40,
				top : '-200px'
			});
			
			this.$dice.addClass('in').find('.dice').addClass('run');

			this.$diceBgm[0].play();
		},

		initDialog: function(){
			this.$lostDialog.find('.dialog-close').click(function(){
				H.game.$lostDialog.addClass('none');
				H.game.animScroll(0);
			});

			this.$lostDialog.find('.big-btn').click(function(){
				H.game.$lostDialog.addClass('none');
				H.game.animScroll(0);
			});

			this.$rpDialog.find('.dialog-close').click(function(){
				H.game.$rpDialog.addClass('none');
				H.game.animScroll(0);
			});

			this.$rpDialog.find('.big-btn').click(function(){
				H.game.$rpDialog.addClass('none');
				H.game.animScroll(0);
			});

            this.$success_dialog.find(".success-submit").click(function(){
            	if(is_android()){
            		window.location.href ="http://a.app.qq.com/o/simple.jsp?pkgname=com.integralmall";	
            	}else{
            		window.location.href ="https://itunes.apple.com/us/app/tian-tian-yao/id1023688703?l=zh&ls=1&mt=8";	
            	}
            });

            
            this.$success_dialog.find('.success_bg').css({
            	'height' : $(window).width() * 631 / 389
            });


            $('#tttj_hongbao_dialog .hongbao_submit').click(function(){
            
				if($(this).hasClass('disabled')){
					return;
				}

				var mobile = $('#tttj_hongbao_dialog .hongbao_tel').val();
				if (!/^\d{11}$/.test(mobile) || mobile == null || mobile == "") {
					alert('这手机号，可打不通...');
					$('#tttj_hongbao_dialog .hongbao_tel').focus();
					return false;
				}
				$(this).addClass('disabled');

				var pz = $('#tttj_hongbao_dialog').data('aw');
				var timestamp = new Date().getTime();
				var md5SignValue = H.game.tttjSignType(mobile,0,pz,'','男生女生向前冲',timestamp);
				H.game.$success_dialog.find(".success-body .score").text(pz);
				H.game.$success_dialog.find(".success_tips_mobile").text(mobile);

				$.ajax({
				    type: "get",
				    url:$('#tttj_hongbao_dialog').data('ru'),
				    dataType: "jsonp",
				    jsonp: "callback",
				    jsonpCallback: "callbackTttjAppScoreHandler",
				    data: {
				        phoneNum: mobile,
				        score: pz,
				        type: 0,
				        name:"",
				        source: '男生女生向前冲',
				        timestamp: timestamp,
				        sign:md5SignValue,
				        jsonp:true
				    },
				    success:function(data){
				         if(data.code=="GOOD"){
				            $('#tttj_hongbao_dialog').addClass('none');
				           	H.game.$success_dialog.removeClass('none');
				         }else{
				           alert(data.content);
				         }
				    }
				});
			});


			$('#dui_hongbao_dialog .hongbao_submit').click(function(){
				var mobile = $('#dui_hongbao_dialog .hongbao_tel').val();
				if (!/^\d{11}$/.test(mobile) || mobile == null || mobile == "") {
					alert('这手机号，可打不通...');
					$('#dui_hongbao_dialog .hongbao_tel').focus();
					return false;
				}
				var pz = $('#dui_hongbao_dialog').data('aw');
				var timestamp = new Date().getTime();
				var md5SignValue = H.game.getPaySignType(mobile,pz,timestamp);
				window.location.href = $('#dui_hongbao_dialog').data('ru') +"?mobile="+mobile+"&value="+pz+"&channel=50&timestamp="+timestamp+"&sign="+md5SignValue;
            
			});

		},

		initMap: function(){
			for(var i in this.stepPosition){
				this.$bg.append('<section id="star'+i+'" class="star">'+ ( parseInt(i,10)+1 ) +'</section>');
				this.$bg.find('#star' + i).css({
					left : this.stepPosition[i][0] * this.widthScale,
					top : this.stepPosition[i][1]
				});
			}

			$('.obstacle').each(function(){
				var left = $(this).css('left');
				$(this).css('left', parseInt(left,10) * H.game.widthScale);
			});

			if(headimgurl){
				$('.myAvatar').attr('src',headimgurl + '/0');	
			}

			this.$award.click(function(){
				if(!$(this).hasClass('gray')){
					showLoading();
					var loadingTop = $(window).scrollTop();
					$('.spinner').css('-webkit-transform', 'translate(0,'+loadingTop+'px)');
					getResult('api/lottery/luck',{
						oi : openid
					},'callbackLotteryLuckHandler');
				}else{
					alert('还没有获得抽奖机会哦');
				}
			});

			this.$handTips.css({
				'left' : ($(window).width() - 100) / 2 ,
				'top' : ($(window).height() - 100) / 2 
			});
			
		},

		resize: function(){
			this.widthScale = $(window).width() / this.orginWidth;
		},

		show321:function(){
			$('#s321_dialog').removeClass('none');
			setTimeout(function(){
				$('#s3').removeClass('none').addClass('in');
			},50);
			
			setTimeout(function(){
				$('#s3').addClass('none').removeClass('in');
				$('#s2').removeClass('none').addClass('in');
			},1050);

			setTimeout(function(){
				$('#s2').addClass('none').removeClass('in');
				$('#s1').removeClass('none').addClass('in');
			},2050);

			setTimeout(function(){
				$('#s1').addClass('none').removeClass('in');
				$('#sgo').removeClass('none').addClass('in');
			},3050);

			setTimeout(function(){
				$('#sgo').addClass('none').removeClass('in');
				$('#s321_dialog').addClass('none');
				
				H.game.shakeEvent.start();
				H.game.$handTips.removeClass('none');
			},4050);
		}

	};
	
	H.index = {
		$game: $('.game'),
		$title: $('header .title img'),
		$bg : $('.game'),
		$apply: $('#toApply'),
		$applyDialog: $('#toApply_dialog'),
		$score: $('#toScore'),
		$scoreDialog: $('#toScore_dialog'),
		$start: $('#start'),
		$countDown: $('.count-down'),
		$bgm: $('#bgm'),

		timeOffset: 0,
		roundData: null,
		currentRound: 0,
		totalRound: 0,
		hasChance: true,
		interval: null,
		intervalStart: null,
		intervalEnd: null,

		init: function() {
			this.resize();
			this.initBgm();
			H.game.init();
			H.apply.init();
			H.score.init();
			getResult('api/lottery/round',{
				at : 4
			},'callbackLotteryRoundHandler');

			getResult('api/common/promotion',{
				oi : openid
			}, 'commonApiPromotionHandler');
			
		},

		gameInfoInit: function(data){
			var now = new Date();
			this.timeOffset = data.sctm - now.getTime();
			this.roundData = data.la;

			this.currentRound = this.getCurrentRound();
			if(this.currentRound < 0){
				// 当天活动已结束
				this.end();
			}else{
				if(this.isCurrentRoundActive()){
					this.$start.removeClass('gray');
					this.updateCountDown(true);
				}else{
					this.$start.addClass('gray');
					this.updateCountDown(false);
				}
			}
			this.initStart();
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

		updateCountDown: function(isActive){
			
			if(this.currentRound == this.roundData.length - 1 && !isActive){
				this.end();
				clearInterval(this.interval);
				return ;
			}

			if(isActive){
				this.$countDown.html('距离本轮结束还有<span class="time">00:00</span>');
				var st = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].st;
				var nst = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].et;

				this.$start.removeClass('gray');
			}else{
				this.$countDown.html('距离下一轮开始还有<span class="time">00:00</span>');
				var st = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].et;
				var nst = this.roundData[this.currentRound].nst;

				this.$start.addClass('gray');
			}

			this.intervalStart = timestamp(st);
			this.intervalEnd = timestamp(nst);
			clearInterval(this.interval);
			this.interval = setInterval(function(){
				var nowTime = new Date().getTime() + H.index.timeOffset;
				var sT = isNaN(H.index.intervalStart) ? 0 : H.index.intervalStart - nowTime;
				var eT = isNaN(H.index.intervalEnd) ? 0 : H.index.intervalEnd - nowTime;

				if (sT >= 0) {
					// 即将开始
					H.index.showTime(sT, '%H%:%M%:%S%');
				} else if (eT >= 0) {
					//正在进行
					H.index.showTime(eT, '%H%:%M%:%S%');
				} else {
					// 结束
					if(isActive){
						H.index.updateCountDown(false);
					}else{
						H.index.startNextRound();
					}
				}
			}, 100);
		},

		showTime: function(rT, showTpl){
			var s_ = Math.round((rT % 60000) / 100);
			s_ = H.index.subNum(H.index.dateNum(Math.round(s_ / 1000 * 100)));
			var m_ = H.index.subNum(H.index.dateNum(Math.floor((rT % 3600000) / 60000)));
			var h_ = H.index.subNum(H.index.dateNum(Math.floor((rT % 86400000) / 3600000)));
			var d_ = H.index.subNum(H.index.dateNum(Math.floor(rT / 86400000)));
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

			this.updateCountDown(true);
		},

		end: function(){
			this.$start.addClass('gray');
			this.$countDown.text('今天的活动已经全部结束啦');
		},


		initStart: function(){

			this.$start.click(function(){
				if(!$(this).hasClass('gray')){
					H.game.start();
					$(this).addClass('gray');
				}
			});

			var lastLotteryTime = $.fn.cookie(H.game.$lastLotteryCookieKey);

			var st = this.roundData[this.currentRound].pd + ' ' + this.roundData[this.currentRound].st;
			if(lastLotteryTime && lastLotteryTime > timestamp(st) ){
				this.$start.addClass('gray');
			}

		},

		resize: function(){
			this.$bg.css({
				'width': $(window).width(),
				'background-size': $(window).width() + 'px 1204px' 
			}).removeClass('none');

			$('.dialog-wrapper').bind('touchmove',function(){
				return false;
			});

			$('.dialog-wrapper').click(function(){
				if(!$(this).hasClass('noClose')){
					$(this).addClass('none');
				}
			});

			$('.dialog').click(function(){
				if(!$(this).parent().hasClass('noClose')){
					return false;	
				}
			});

			$('.dialog .hongbao-close').click(function(){
				$(this).parent().parent().parent().addClass('none');
				H.game.$award.addClass('gray');
				H.game.$awardTips.text('到达终点，抽取大奖！');
			});

			$('.dialog-wrapper').css('height', '1649px');
			this.$title.addClass('in');
		},

		initBgm: function(){
			$('body').bind('touchstart',function(){
				H.index.$bgm[0].play();
			});
		}
	};

	H.apply = {
		$dialog: $('#toApply_dialog'),
		$open: $('#toApply'),
		$submit: $('#apply_submit'),
		$close: $('#toApply_dialog .dialog-close'),
		init: function(){

			this.$open.click(function(){
				location.href = './apply.html';
			});

			this.$close.click(function(){
				H.apply.$dialog.addClass('none');
			});

			this.$submit.click(function(){

			});
		}
	};
	

	H.score = {
		$dialog: $('#toScore_dialog'),
		$open: $('#toScore'),
		$close: $('#toScore_dialog .dialog-close'),
		$list: $('.score-list'),
		$myRank: $('.myRank'),
		$myScore: $('.myScore'),

		init: function(){

			this.$open.click(function(){
				$('.dialog-wrapper').addClass('none');
				H.score.$dialog.removeClass('none');

				var top = $(window).scrollTop() + ($(window).height() - 400) / 2;
				H.score.$dialog.find('.dialog').css('top',top);

				getResult('api/lottery/integral/rank/self',{
					oi : openid
				},'callbackIntegralRankSelfRoundHandler', true);

				getResult('api/lottery/integral/rank/top10',{

				},'callbackIntegralRankTop10RoundHandler');
				
			});

			this.$close.click(function(){
				H.score.$dialog.addClass('none');
			});

		},

		fillTop10: function(data){
			var t = simpleTpl();
			for(var i in data.top10){
				t._('<li>')
					._('<section class="avatar">')
						._('<img src="./images/avatar.jpg">')
					._('</section>')
					._('<section class="score-detail">')
						._('<p>积分值：'+data.top10[i].in+' 排名：'+data.top10[i].rk+'</p>')
					._('</section>')
				._('</li>');
			}
			this.$list.html(t.toString());
		},

		fillMyRank: function(data){
			this.$myScore.text(data.in);
			this.$myRank.text(data.rk);
		},

		loadFail: function(){
			alert('网络错误，请稍后重试');
			this.$dialog.addClass('none');
		},
	};

	W.callbackLotteryRoundHandler = function(data) {
		if(data.result){
			H.index.gameInfoInit(data);
		}else{
			alert('网络错误，请刷新页面');
		}
	};

	W.shakeOccur = function(){
		H.game.showDice();
		H.game.shakeEvent.stop();
		H.game.$handTips.addClass('none');
		getResult('api/lottery/luck4chanllenge',{
			oi: openid
		},'callbackLotteryLuck4chanllengeHandler')
	};

	W.callbackLotteryLuck4chanllengeHandler = function(data){
		H.game.luckCallback(data);
	};

	W.callbackLotteryLuckHandler = function(data){
		hideLoading();
		H.game.finalLuckCallback(data);
	};


	W.callbackIntegralRankSelfRoundHandler = function(data){
		hideLoading();
		if(data.result){
			H.score.fillMyRank(data);
		}else{
			alert('网络错误，请稍后重试');
		}
	};

	W.callbackIntegralRankTop10RoundHandler = function(data){
		if(data.result){
			H.score.fillTop10(data);
		}
	};

	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			$('#tttj').html(data.desc).removeClass('none');
			$('#tttj').click(function(){
				location.href = data.url;
			});
		}else{
			$('#tttj').addClass('none');
		}
	};

	H.index.init();

})(Zepto);
