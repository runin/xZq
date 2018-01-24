;(function($) {

	H.loading = {
		percent: 0,
		$stage: $('#stage_loading'),
		$loadingBar: $('#loading_bar'),

		init: function(){
			this.resize();
			PIXI.loader.add(gameConfig.assetsToLoader);
	    	PIXI.loader.load(function(){
	    		H.loading.$loadingBar.find('p').html('加载完成');
	    		setTimeout(function(){
	    			H.loading.$stage.addClass('none');
	    			H.index.init();
	    			H.record.init();
	    			H.info.init();
	    			H.rule.init();
	    			H.rank.init();
	    		},200);
	    	});
		},

		resize: function(){
			var height = $(window).height();
			this.$stage.css('height', height);
			this.$stage.removeClass('none');
			this.$loadingBar.css('top', (height - 70) / 2).removeClass('none');
			this.$stage.css('opacity', 1);
		}
	};

	H.index = {
		$stage: $('#stage_index'),
		$stages: $('.stage'),
		$play: $('#stage_index .play-btn'),
		$ruleDialog: $('#rule_dialog'),
		$rankDialog: $('#rank_dialog'),
		$bgm: $('#bgm'),
		
		game: null,
		awardList: null,
		lastScore: 0,
		isRestart: false,

		init: function(){
			this.resize();
			this.bindBtns();
			getResult('api/lottery/leftLotteryCount',{
				'oi': openid
			}, 'callbackLotteryleftLotteryCountHandler');
		},

		start: function(){
			showNewLoading();
			getResult('api/lottery/prizes',{at: 5},'callbackLotteryPrizesHandler');
		},

		initAward: function(data){
			this.awardList = data.pa;
		},

		startGame: function(value){
			this.$bgm[0].play();
			if(!this.isRestart){
				H.index.$stage.animate({opacity: 0}, 1300, 'ease');
				$('#stage_main').removeClass('none');
				$('.crop-animate-wrapper').html($('.crop.valid').last()[0]);

				setTimeout(function(){
					$('.crop-animate-wrapper .crop').css({
						'-webkit-transform': 'translate(0px,-400px)'
					});
					setTimeout(function(){
						H.index.$stage.addClass('none');
			            H.index.game = new Game();
		              	H.index.game.start({
		              		maxScore:value,
		              		endCallBack:function(score){
		              			H.index.endGame(score);
		                	}
		                });
					 },1000);
				},300);
			}else{
				H.index.game.reStart({
					maxScore:value
				});
			}
		},

		restartGame: function(){
			this.isRestart = true;
			getResult('api/lottery/luck',{
				oi: openid
			},'callbackLotteryLuckHandler');
		},

		endGame: function(score){
			this.lastScore = score;

			$('.crop-animate-wrapper .crop').removeClass('valid').css({
				'-webkit-transform': 'translate(0px,-0px)',
				'background-image': 'url(./images/icon-corn-disabled.png)'
			});
			H.index.$stage.append($('.crop-animate-wrapper .crop')[0]);

			showNewLoading();
		    getResult('api/lottery/award',{
			    oi : openid,
			    nn : encodeURIComponent(nickname),
			    hi : headimgurl,
			    pv : score
		    },'callbackLotteryAwardHandler');

			H.index.$stage.append($('.crop-animate-wrapper .crop')[0]);
		},

		show: function(){
			this.$stage.removeClass('none');
			this.$stage.animate({opacity: 1}, 1300, 'ease');
		},

		updateLotteryCount: function(data){
			$('#stage_index .crop').css('background-image', 'url(./images/icon-corn-disabled.png)').removeClass('valid');
			if(data.lc > 0){
				this.$play.removeClass('disabled');
				this.$play.find('img').attr('src', './images/icon-play.png');
				for(var i = 0; i < data.lc; i++){
					if($('#stage_index .crop').eq(i).length > 0){
						$('#stage_index .crop').eq(i).css('background-image', 'url(./images/icon-corn.png)').addClass('valid');
					}else{
						break;
					}
				}
				$('.again').removeClass('none');
			}else{
				this.$play.addClass('disabled');
				this.$play.find('img').attr('src', './images/icon-play-disabled.png');
				$('.again').addClass('back').removeClass('none');
				$('.again').css('background-image', 'url(./images/btn-again-back.png)');
			}
		},

		resize: function(){
			var width = $(window).width();
			var height = $(window).height();
			var originWidth = 640;
			var originHeight = 1009;
			var xRatio = originWidth / width;
			var yRatio = originHeight / height;

			this.$stages.css({
				'width': width,
				'height': height
			});

			$('.stage-item').each(function(){
				var width = $(this).attr('data-width') / xRatio;
				var height = $(this).attr('data-height') / yRatio;
				$(this).css({
					'left' : $(this).attr('data-left') / xRatio,
					'top' : $(this).attr('data-top') / yRatio,
					'width' : width,
					'height' : height
				});
				if($(this).attr('data-src')){
					$(this).css({
						'background-image' : 'url(' + $(this).attr('data-src') + ')' ,
						'background-size': width+ 'px ' + height + 'px'
					});
				}
			});

			this.$stage.css({
				'background-image': 'url(./images/bg-index.jpg)',
				'background-size': width+ 'px ' + height + 'px'
			});

			H.rule.$ruleDialog.find('.content').css('height', height * 0.7 - 120 - 20 );

			var dialogHeight = H.rank.$rankDialog.find('.dialog').css('height');
			H.rank.$rankDialog.find('.dialog').css('top', (height - parseInt(dialogHeight))/2 );

			var dialogHeight = H.info.$infoDialog.find('.dialog').css('height');
			H.info.$infoDialog.find('.dialog').css('top', (height - parseInt(dialogHeight))/2 );

			var ticketHeight = H.win.$ticket.css('height');
			H.win.$ticket.css('line-height', ticketHeight);

			$('#stage_main').css({
				'width': width,
				'height': height,
				'background-image' : 'url(./images/bg-game.jpg)' ,
				'background-size': width+ 'px ' + height + 'px'
			});

			this.show();
		},

		bindBtns: function(){

			this.$play.tap(function(){
				if($(this).hasClass('disabled')){
					alert('今天的游戏次数已经用完啦~');
					return;
				}
				H.index.start();
			});

			$('.again').tap(function(){
				if($(this).hasClass('back')){
					$('#stage_main').addClass('none');
					H.index.show();
				}else{
					H.index.restartGame();
				}
				$(this).parent('.dialog-wrapper').addClass('none');
			});
		}
	};

	H.win = {
		$dialog: $('#win_dialog'),
		$error: $('#error_dialog'),
		$ticket: $('#win_dialog .ticket'),
		$tt: $('#win_dialog .tt'),
		$pd: $('#win_dialog .pd'),

		show: function(data){
			$('.again').addClass('none');

			if(data.tt && data.pd){
				this.$tt.html(data.aw);
				this.$pd.html(data.pd);
			}else{
				this.$tt.html('恭喜你，');
				this.$pd.html('获得' + data.pn + '1' + data.pu);
			}
			this.$ticket.html('<img src="./images/icon02.png" />');
			this.$dialog.removeClass('none');

			getResult('api/lottery/leftLotteryCount',{
				'oi': openid
			}, 'callbackLotteryleftLotteryCountHandler');

			$('.apply').click(function(){
				location.href = data.ru;
			});
		},

		collectError: function(){
			this.$error.find('.last-scroe').html(H.index.lastScore);
			this.$error.removeClass('none');
		},

		collect: function(score){
			var rangeStr = "";
			var awardIndex = 0;
			
			if(H.index.awardList[awardIndex]){
				getResult('api/lottery/collect',{
					oi : openid,
					pu : H.index.awardList[awardIndex].id
				},'callbackLotteryCollectHandler');
			}else{
				this.collectError();
			}
			
		}
	};

	H.lost = {
		$dialog: $('#lost_dialog'),
		show: function(){
			$('.again').addClass('none');
			this.$dialog.removeClass('none');

			getResult('api/lottery/leftLotteryCount',{
				'oi': openid
			}, 'callbackLotteryleftLotteryCountHandler');
		}
	};

	H.record = {
		$stage: $('#stage_record'),
		$open: $('#stage_index .record-btn'),
		$back: $('#stage_record .back-btn'),
		$list: $('#stage_record .record-list'),
		init: function(){
			this.resize();
			this.bindBtns();
		},
		show: function(){
			this.$stage.removeClass('none');
			this.$stage.animate({opacity: 1}, 1300, 'ease');

			getResult('api/lottery/record',{
				oi: openid,
				pt: 11
			},'callbackLotteryRecordHandler');
		},

		fillList: function(data){
			if(data.result){
				var listHtml = "";
				for(var i in data.rl){
					var startTime = data.rl[i].sa.split(' ');
					var endTime = data.rl[i].ea.split(' ');
					var timeStr = "";
					if(startTime[0] && endTime[0]){
						timeStr = '有效期：' + startTime[0] + ' ~ ' + endTime[0];
					}else{
						timeStr = '';
					}
					
					listHtml += '<li><p>'+data.rl[i].pn+'</p><p class="record-code">兑换码：'+data.rl[i].cc+'</p><p class="deadline">'+timeStr+'</p></li>';
				}
	    		this.$list.html(listHtml);
	    	}else{
	    		listHtml = '<li class="placehoder"><p>&nbsp;</p><p class="record-code">暂无中奖纪录哦</p></li>';
	    		this.$list.html(listHtml);
	    	}
		},

		bindBtns: function(){
			this.$back.tap(function(){
				H.record.$stage.addClass('none');
				H.record.$stage.css('opacity', 0);
				H.index.show();
			});

			this.$open.tap(function(){
				H.index.$stage.addClass('none');
				H.index.$stage.css('opacity', 0);
				H.record.show();
			});
		},
		resize: function(){
			this.$stage.css({
				'height': 'auto',
				'min-height': $(window).height()
			});
		}
	};

	H.rule = {
		isLoaded: false,
		$ruleDialog: $('#rule_dialog'),
		$ruleOpen: $('#stage_index .rule'),
		init: function(){
			this.$ruleDialog.find('.icon-close').tap(function(){
				H.rule.hideDialog();
			});

			this.$ruleOpen.tap(function(){
				H.rule.show();
			});
		},

		show: function(){
			if(this.isLoaded){
				this.showDialog();
			}else{
				showNewLoading();
				getResult('api/common/rule',null, 'commonApiRuleHandler');	
			}
		},

		showDialog: function(){
			H.rule.$ruleDialog.removeClass('none');
			H.rule.$ruleDialog.find('.dialog').addClass('r-rule');
		},

		hideDialog: function(){
			H.rule.$ruleDialog.find('.dialog').addClass('g-rule');
			setTimeout(function(){
				H.rule.$ruleDialog.addClass('none');
				H.rule.$ruleDialog.find('.dialog').removeClass('g-rule').removeClass('r-rule');
			}, 500);
		}
	};

	H.info = {
		$infoDialog: $('#info_dialog'),
		$submit: $('#submit'),

		init: function(){
			this.$infoDialog.find('.icon-close').tap(function(){
				H.info.hideDialog();
			});

			this.$submit.tap(function(){
				var token = $('#token').val();
                var name = $.trim($('#name').val());
                var tel = $.trim($('#tel').val());

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

                getResult('api/user/edit',{
                    oi : openid,
                    tk : token,
                    nn : encodeURIComponent(nickname),
                    hi : headimgurl,
                    ph : tel,
                    rn : encodeURIComponent(name)
                },'callbackUserEditHandler'); 
			});

			getResult('api/user/info',{
                oi : openid
            }, 'callbackUserInfoHandler');
		},

		show: function(){
			this.$infoDialog.removeClass('none');
		},

		hideDialog: function(){
			H.info.$infoDialog.find('.dialog').addClass('g-rule');
			setTimeout(function(){
				H.info.$infoDialog.addClass('none');
				H.info.$infoDialog.find('.dialog').removeClass('g-rule').removeClass('r-rule');
			}, 500);
		},

		fillUserData: function(data){
			$('#token').val(data.tk);
            $('#name').val(data.rn ? data.rn : '');
            $('#tel').val(data.ph ? data.ph : '' );
		}
	},

	H.rank = {
		$rankDialog: $('#rank_dialog'),
		$rankOpen: $('#stage_index .rank-btn'),
		$avatar: $('#rank_dialog .rank-self-avatar img'),
		$name: $('#rank_dialog .rank-self-detail h2'),
		$score: $('#rank_dialog .rank-self-detail .detail-score'),
		$rank: $('#rank_dialog .rank-self-detail .detail-rank'),
		$list: $('#rank_dialog .rank-list ul'),
		$info: $('#rank_dialog .rank-userinfo-btn a'),

		init: function(){
			this.$rankDialog.find('.icon-close').tap(function(){
				H.rank.hideDialog();
			});

			this.$rankOpen.tap(function(){
				H.rank.show();
			});

			this.$info.tap(function(){
				H.rank.$rankDialog.addClass('none').removeClass('g-rule').removeClass('r-rule');
				H.info.show();	
			});

		},
		show: function(){
			showNewLoading();
			getResult('api/lottery/integral/total/rank/self', {oi:openid}, 'callbackIntegralTotalRankSelfRoundHandler');
			getResult('api/lottery/integral/total/rank/top10', {oi:openid}, 'callbackIntegralTotalRankTop10Handler');
		},

		showDialog: function(){
			H.rank.$rankDialog.removeClass('none');
			H.rank.$rankDialog.find('.dialog').addClass('r-rule');
		},

		hideDialog: function(){
			H.rank.$rankDialog.find('.dialog').addClass('g-rule');
			setTimeout(function(){
				H.rank.$rankDialog.addClass('none');
				H.rank.$rankDialog.find('.dialog').removeClass('g-rule').removeClass('r-rule');
			}, 500);
		}
	};

	W.commonApiRuleHandler = function(data){
		hideNewLoading();
		if(data.code == 0){
			H.rule.isLoaded = true;
			H.rule.$ruleDialog.find('.content').html(data.rule);
			H.rule.showDialog();
		}else{
			H.rule.hideDialog();
		}
	};

	W.callbackIntegralTotalRankTop10Handler = function(data){
		if(data.result){
			var t = simpleTpl();
            for(var i in data.top10){
                t._('<li>')
                    ._('<span class="list-num">')
                            ._(data.top10[i].rk)
                    ._('</span>')
                    ._('<span class="list-name">')
                        ._(data.top10[i].nn ? data.top10[i].nn : '匿名用户' )
                    ._('</span>')
                    ._('<span class="list-count">')
                        ._(data.top10[i].in)
                    ._('</span>')
                ._('</li>');
            }
            H.rank.$list.html(t.toString());
		}
	};

	W.callbackIntegralTotalRankSelfRoundHandler = function(data){
		hideNewLoading();
		if(data.result){
			H.rank.$avatar.attr('src', headimgurl ? headimgurl : './images/icon-avatar.png');
			H.rank.$name.text(nickname);
			H.rank.$score.text('我的积分：' + (data.in ? data.in : 0));
			H.rank.$rank.text('我的排名：' + (data.rk ? data.rk : '100+'));
			H.rank.showDialog();
		}
	};

	W.callbackLotteryleftLotteryCountHandler = function(data){
		if(data.result){
			H.index.updateLotteryCount(data);
		}
	};

	W.callbackLotteryPrizesHandler = function(data){
		if(data.result){
			H.index.initAward(data);
			getResult('api/lottery/luck',{
				oi: openid
			},'callbackLotteryLuckHandler');
		}else{
			hideNewLoading();
			alert('网络错误，请刷新重试');
		}
	};

	W.callbackLotteryLuckHandler = function(data){
		hideNewLoading();
		if(data.result){
			H.index.startGame(data.pv);
		}else{
			alert('网络错误，请刷新重试');
		}
	};

	// 领取积分
	W.callbackLotteryAwardHandler = function(data){
		hideNewLoading();
		if(data.result){
			if(H.index.lastScore > 199){
				H.win.collect(H.index.lastScore);
			}else{
				H.lost.show();
			}			
		}else{
			H.lost.show();
		}
		
	};

	// 领取兑换码奖品
	W.callbackLotteryCollectHandler = function(data){
		if(data.result == 0){
			H.win.show(data);
		}else{
			H.win.collectError();
		}
	};

	W.callbackLotteryRecordHandler = function(data){
		H.record.fillList(data);	
	};

	W.callbackUserInfoHandler = function(data){
        if(data.result){
            H.info.fillUserData(data);    
        }
    };

	W.callbackUserEditHandler = function(data){
        if(data.result){
            alert('填写成功！');
            H.info.hideDialog();
        }else{
            alert('网络错误，请刷新重试');
        }
    };

	H.loading.init();

})(Zepto);