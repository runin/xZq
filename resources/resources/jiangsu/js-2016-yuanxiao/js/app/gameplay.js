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
		$play: $('#stage_index #play-btn'),
		$touch: $('#touch'),
		$tangyuan: $('.tangyuan'),
		$bgm: $('#audio_game'),
		
		game: null,
		awardList: null,
		lastScore: 0,
		isRestart: false,

		init: function(){
			this.resize();
			this.bindBtns();
			this.tangyuanAnimate();
		},

		tangyuanAnimate: function(){
			var randTangyuan = Math.floor(Math.random() * 3);
	        var randAnimate = Math.floor(Math.random() * 4);
	        H.index.$tangyuan.eq(randTangyuan).addClass('click-' + randAnimate);

	        setTimeout(function(){
	        	H.index.$tangyuan.removeClass('click-' + randAnimate);
	        	H.index.$tangyuan.eq(randTangyuan).addClass('click-' + randAnimate);
	        	H.index.tangyuanAnimate();
	        }, 2000);
		},

		start: function(){
			H.index.startGame(300);
		},

		startGame: function(value){
			this.$bgm[0].play();

			if(!this.isRestart){
				H.index.$touch.addClass('none');

				if(isAndroid){
					H.index.$stage.addClass('none');
					$('#stage_main').removeClass('none');
					H.index.game = new Game();
	              	H.index.game.start({
	              		maxScore:value,
	              		endCallBack:function(score){
	              			H.index.endGame(score);
	                	}
	                });
				}else{

					H.index.$stage.addClass('open');
					setTimeout(function(){
						H.index.$stage.animate({opacity: 0}, 1300, 'ease');
						$('#stage_main').removeClass('none');

						setTimeout(function(){
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
					}, 1000);
				}
				

			}else{
				H.index.game.reStart({
					maxScore:value
				});
			}
		},

		restartGame: function(){
			this.isRestart = true;
			H.index.startGame(300);
		},

		endGame: function(score){
			this.lastScore = score;
			if(H.index.lastScore > 15){
				H.win.show(H.index.lastScore);
			}else{
				H.lost.show(H.index.lastScore);
			}
		},

		show: function(){
			this.$stage.removeClass('none');
			this.$stage.animate({opacity: 1}, 1300, 'ease');
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
				'background-image': 'url(http://yaotv.qq.com/shake_tv/auto2/2016/02/24fhrcyiktg69bg/bg-game.jpg)',
				'background-size': width+ 'px ' + height + 'px'
			});

			$('#stage_main').css({
				'width': width,
				'height': height,
				'background-image' : 'url(http://yaotv.qq.com/shake_tv/auto2/2016/02/24fhrcyiktg69bg/bg-game.jpg)' ,
				'background-size': width+ 'px ' + height + 'px'
			});

			$('.dialog').css({
				'margin-top' : (height - 207)  / 2
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

			$('.dialog-ok').tap(function(){
				$('.dialog-wrapper').addClass('none');
				H.index.restartGame(300);
			});

			$('.dialog-back').tap(function(){
				location.href = 'index.html?cf=game';
			});
		}
	};

	H.win = {
		$dialog: $('#win_dialog'),
		$num: $('#win_num'),
		lastScore: 0,

		show: function(data){
			showLoading();
			H.win.lastScore = data;
			getResult('api/pet/lqgold', {
				oi: openid,
				gd: 30
			}, 'callbackApiPetLqgold', null, null, null, null, function(){
				hideLoading();
				H.error.$num.text(H.win.lastScore);
				H.error.$dialog.removeClass('none');
			});
			
		}
	};

	W.callbackApiPetLqgold = function(data){
		hideLoading();
		if(data.code == 0){
			H.win.$num.text(H.win.lastScore);
			H.win.$dialog.removeClass('none');
		}else{
			H.error.$num.text(H.win.lastScore);
			H.error.$dialog.removeClass('none');
		}
	}

	H.lost = {
		$dialog: $('#lost_dialog'),
		$num: $('#lost_num'),
		show: function(data){
			this.$num.text(data);
			this.$dialog.removeClass('none');
		}
	};

	H.error = {
		$dialog: $('#error_dialog'),
		$num: $('#error_num'),
		show: function(data){
			this.$num.text(data);
			this.$dialog.removeClass('none');
		}
	};

	H.loading.init();

})(Zepto);