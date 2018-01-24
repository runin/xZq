/**
		*	加载场景
		*/
		function LoadingStage(){};
		LoadingStage.prototype = {
			percent : 0,
			show : function(){
				$(".stage").hide();
				$(".preloading").hide();
				$("body").css("background","black");
				$("#stage_loading").show();
				loader = new PIXI.AssetLoader(GAME.getConfig()["assetsToLoader"]);
				loader.onComplete = function(){
					$("#loading_bar").html("Loading... (100%)");
					GAME.coverStage.show();
				}
				loader.onProgress = function(data){
					GAME.loadingStage.percent += Math.floor(100 / GAME.getConfig()['assetsToLoader'].length);
					$("#loading_bar").html("Loading... (" + GAME.loadingStage.percent + "%)");
				}
				loader.load();
			}
		};
		
		
		/**
		*	封面场景
		*/
		function CoverStage(){};
		CoverStage.prototype = {
			running : false,
			counter : 0,
			show : function(){
				this.stage = new PIXI.Stage();
				$("#stage_loading").fadeOut(800);
				$("#main").show();
				GAME.renderer = PIXI.autoDetectRenderer(GAME.exactWidth,GAME.exactHeight);
				$("#main").html(GAME.renderer.view);
				this.initBackground();
				this.initBtns();
				this.resize();
				requestAnimFrame(coverAnimate);
				this.running = true;

				if(_czc){
					_czc.push(['_trackEvent', '资源等待时间' , '资源等待时间' , navigator.userAgent + "-" + GAME.uid , new Date().getTime() - resLoadingTime]);
				}
				
				GAME.curStage = GAME.coverStage;
			},
			
			resize : function(){
				this.background.scale.x = this.background.scale.y = GAME.ratio;
				this.star1.scale.x = this.star1.scale.y = GAME.ratio;
				this.star2.scale.x = this.star2.scale.y = GAME.ratio;
				this.star3.scale.x = this.star3.scale.y = GAME.ratio;
				this.logo.scale.x = this.logo.scale.y = GAME.ratio;
				this.logo.position.y = 100 * GAME.ratio;
				this.logo.position.x = GAME.exactWidth / 2;
				
				this.btnStart.scale.x = this.btnStart.scale.y = GAME.ratio;
				this.btnStart.position.x = GAME.exactWidth / 2;
				this.btnStart.position.y = 532  * GAME.ratio;
			},
			
			initBackground : function(){
				this.background = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/cover.jpg'));
				this.star1 = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/star1.png'));
				this.star1.alpha = 0;
				this.star2 = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/star2.png'));
				this.star2.alpha = 0;
				this.star3 = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/star3.png'));
				this.star3.alpha = 0;
				this.logo = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/icon-logo.png'));
				this.logo.anchor.x = 0.5;
				this.stage.addChild(this.background);
				this.stage.addChild(this.star1);
				this.stage.addChild(this.star2);
				this.stage.addChild(this.star3);
				this.stage.addChild(this.logo);
			},
			
			initBtns : function(){
				this.btnStart = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/btn-start.png'));
				this.btnStart.anchor.x = 0.5;
				this.btnStart.interactive = true;
				this.stage.addChild(this.btnStart);

				this.btnStart.mouseup = this.btnStart.tap = function(data){
					GAME.descriptionStage.show();
					this.alpha = 1;
					this.stage.visible = false;
					GAME.coverStage.running = false;
					this.stage.removeStageReference();
					
					if(_czc){_czc.push(['_trackEvent', '标题页开始点击' , '标题页开始点击' , navigator.userAgent + "-" + GAME.uid]);}
				}
				
				this.btnStart.touchend = this.btnStart.mouseupoutside = this.btnStart.touchendoutside = function(data){
					this.alpha = 1;
				}
				
				this.btnStart.mousedown = this.btnStart.touchstart = function(data){
					this.alpha = 0.5;
				}
				
			},
			
			updateStars : function(){
				this.star1.alpha = Math.abs(Math.sin(this.counter * 6));
				this.star2.alpha = Math.abs(Math.cos(this.counter * 4));
				this.star3.alpha = Math.abs(Math.cos(this.counter * 5));
			},
			
			update : function(){
				if(this.running){
					GAME.renderer.render(this.stage);
					this.counter += 0.01;
					this.updateStars();
				}
			},
		};
		
		/**
		*	背景场景
		*/
		function DescriptionStage(){};
		DescriptionStage.prototype = {
				counter : 0,
				running : false,
				show : function(){
					this.stage = new PIXI.Stage();
					this.initBackground();
					this.resize();
					requestAnimFrame(descriptionAnimate);
					this.running = true;
					
					GAME.curStage = GAME.descriptionStage;
				},
				resize: function(){
					this.background.scale.x = this.background.scale.y = GAME.ratio;
					this.star1.scale.x = this.star1.scale.y = GAME.ratio;
					this.star2.scale.x = this.star2.scale.y = GAME.ratio;
					this.star3.scale.x = this.star3.scale.y = GAME.ratio;
					this.border.scale.x = this.border.scale.y = GAME.ratio;
					this.border.position.x = GAME.exactWidth / 2;
					this.border.position.y = 415 * GAME.ratio; 
				},
				initBackground : function(){
					this.background = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/cover.jpg'));
					this.background.interactive = true;
					this.stage.addChild(this.background);
					this.star1 = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/star1.png'));
					this.star1.alpha = 0;
					this.star2 = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/star2.png'));
					this.star2.alpha = 0;
					this.star3 = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/star3.png'));
					this.star3.alpha = 0;
					this.stage.addChild(this.star1);
					this.stage.addChild(this.star2);
					this.stage.addChild(this.star3);
					
					this.border = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/border.png'));
					this.border.anchor.x = 0.5;
					this.border.anchor.y = 0.5;
					this.stage.addChild(this.border);
					
					this.background.mouseup = this.background.tap = function(data){
						if(_czc){_czc.push(['_trackEvent', '背景页进入点击' , '背景页进入点击' , navigator.userAgent + "-" + GAME.uid]);}
						GAME.descriptionStage.end();
					}
				},
				updateStars : function(){
					this.star1.alpha = Math.abs(Math.sin(this.counter * 6));
					this.star2.alpha = Math.abs(Math.cos(this.counter * 4));
					this.star3.alpha = Math.abs(Math.cos(this.counter * 5));
				},
				end : function(){
					this.stage.visible = false;
					this.stage.removeStageReference();
					GAME.descriptionStage.running = false;
					GAME.playingStage.show();
				},
				update : function(){
					if(this.running){
						this.counter += 0.01;
						this.updateStars();
						if(this.counter > 4){
							this.end();
						}
						GAME.renderer.render(this.stage);
					}
				}
		}
		
		/**
		*	分享场景
		*/
		function EndStage(){};
		EndStage.prototype = {
				running : false,
				counter : 0,
				show : function(score,wayToDrop){
					this.running = true;
					this.score = score;
					this.wayToDrop = wayToDrop;
					this.stage = new PIXI.Stage(0x244357);
					this.initBackground();
					this.initScore();
					this.resize();
					GAME.renderer.render(this.stage);
					
					requestAnimFrame(endAnimate);
					
					GAME.curStage = GAME.endStage;
				},
				
				resize : function(){
					this.snows.scale.x = this.snows.scale.y = GAME.ratio;
					this.snows2.scale.x = this.snows2.scale.y = GAME.ratio;
					this.snows2.position.y = -1 * GAME.exactHeight;
					this.snows3.scale.x = this.snows3.scale.y = GAME.ratio;
					this.snows4.scale.x = this.snows4.scale.y = GAME.ratio;
					this.snows4.position.y = -1 * GAME.exactHeight;
					this.background.scale.x = this.background.scale.y = GAME.ratio;
					this.btnRestart.scale.x = this.btnRestart.scale.y = GAME.ratio;
					
					this.btnRestart.anchor.x = 0.5;
					this.btnRestart.position.y = 140 * GAME.ratio;
					this.btnRestart.position.x = GAME.exactWidth / 2;
					
					this.scoreText.position.y = 340 * GAME.ratio;
					this.scoreText.position.x = GAME.exactWidth / 2;
					this.scoreText.scale.x = this.scoreText.scale.y = GAME.ratio;
					this.remark.position.y = 405 * GAME.ratio;
					this.remark.position.x = GAME.exactWidth / 2;
					this.remark.scale.x = this.remark.scale.y = GAME.ratio;
				},
				
				initBackground : function(){
					
					this.snows = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/snow1.png'));
					this.stage.addChild(this.snows);
					
					this.snows2 = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/snow1.png'));
					this.stage.addChild(this.snows2);
					
					this.snows3 = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/snow2.png'));
					this.stage.addChild(this.snows3);
					
					this.snows4 = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/snow2.png'));
					this.stage.addChild(this.snows4);
					
					this.background = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/end.png'));
					this.stage.addChild(this.background);
					
					this.btnRestart = new PIXI.Sprite(PIXI.Texture.fromFrame('./images/btn-restart.png'));
					this.btnRestart.interactive = true;
					this.stage.addChild(this.btnRestart);
					
					this.btnRestart.mouseup = this.btnRestart.tap = function(data){
						this.stage.visible = false;
						this.stage.removeStageReference();
						this.alpha = 1;
						
						GAME.retryTime ++;
						if(_czc){_czc.push(['_trackEvent', '再试一次点击' , '再试一次点击' , navigator.userAgent + "-" + GAME.uid , GAME.retryTime]);}
						GAME.endStage.running = false;
						GAME.playingStage.show();
					}
					
					this.btnRestart.touchend = this.btnRestart.mouseupoutside = this.btnRestart.touchendoutside = function(data){
						this.alpha = 1;
					}
					
					this.btnRestart.mousedown = this.btnRestart.touchstart = function(data){
						this.alpha = 0.5;
					}
				},
				
				initScore : function(){
					this.scoreText = new PIXI.Text(this.score + "米",{font: "65px 微软雅黑", fill: "#fff100"});
					this.scoreText.anchor.x = this.scoreText.anchor.y = 0.5;
					scoreNum = this.score;
					this.stage.addChild(this.scoreText);
					
					if(this.wayToDrop == "thunder"){
						this.remark = new PIXI.Text("你的程序猿被闪电带走了...",{font: "30px 微软雅黑", fill: "white"});
					}else{
						this.remark = new PIXI.Text("你的程序猿被冰雹带走了...",{font: "30px 微软雅黑", fill: "white"});
					}
					
					
					this.remark.anchor.x = this.remark.anchor.y = 0.5;
					this.stage.addChild(this.remark);

					// 微信分享的数据和回调
					WeixinApi.ready(function(Api){
						
						var desc = "";
						
						if(scoreNum < 90){
							desc = "飞了" + scoreNum +　"米后，程序猿的香蕉还是没送出去，简直弱受！！！";
						}else if(scoreNum < 200){
							desc = "哇塞，飞了" + scoreNum +　"米后程序猿的香蕉才掉，简直禽兽！！！";
						}else{
							desc = "飞了" + scoreNum +　"米后，程序猿和香蕉终于掉下来惹！简直神兽！！！";
						}
						
					    wxData = {
					        "imgUrl":'http://bbs.coloros.com/data/oppo/2014/12/23/141931464256235836.jpg',
					        "link": location.href,
					        "desc":desc,
					        "title":"护送程序猿去约会"
					    };
					    
					    var wxTimelineCallbacks = {
					        confirm:function (resp) {
					        	if(_czc){_czc.push(['_trackEvent', '分享到朋友圈' , '分享到朋友圈' , navigator.userAgent + "-" + GAME.uid , scoreNum]);}
					        	location.href = "http://mp.weixin.qq.com/s?__biz=MzAwODAxMjg5Mg==&mid=202543162&idx=1&sn=266c6aa69d14112f00833b1d79443ce3";
					        }
					    };
					    
					    var wxFriendCallbacks = {
					        confirm:function (resp) {
					        	if(_czc){_czc.push(['_trackEvent', '发送给朋友' , '发送给朋友' , navigator.userAgent + "-" + GAME.uid , scoreNum]);}
					        }
					    };
					    Api.shareToFriend(wxData,wxFriendCallbacks);
					    Api.shareToTimeline(wxData,wxTimelineCallbacks);
					});

				},
				
				update : function(){
					if(this.running){
						GAME.renderer.render(this.stage);
						this.counter += 0.01;
						this.updateSnows();
					}
				},
				
				updateSnows : function(){
					this.snows.position.y += 0.3;
					if(this.snows.position.y > GAME.exactHeight){
						this.snows.position.y = -1 * GAME.exactHeight;
					}
					this.snows2.position.y += 0.3;
					if(this.snows2.position.y > GAME.exactHeight){
						this.snows2.position.y = -1 * GAME.exactHeight;
					}
					
					this.snows3.position.y += 0.5;
					if(this.snows3.position.y > GAME.exactHeight){
						this.snows3.position.y = -1 * GAME.exactHeight;
					}
					this.snows4.position.y += 0.5;
					if(this.snows4.position.y > GAME.exactHeight){
						this.snows4.position.y = -1 * GAME.exactHeight;
					}
				}
		}
		
/**
*	游戏场景
**/
function PlayingStage(){};
PlayingStage.prototype = {
		
		running : false,
		counter : 0,
		fingerOffset : 118,
		hitRadius : 47,
		thunderHitRadius : 36,
		snowSpeed : 1100,
		snowAngleOffset : 0.5,
		snowSpeedOffset : 500,
		snowMaxPerTurn : 5,
		snowWaveDelay : 0.46,
		snowCounter : 0,
		
		thunderSpeed : 1800,
		thunderSpeedOffset : 400,
		thunderMaxSpeed : 2600,
		thunderWaveDelay : 0.72,
		thunderCounter : 0,
		
		backgroundSpeed : 900,
		
		maiSpeed : 900,
		maiLength : 1.4,
		maiComeScore : 80,
		
		counterSpeed : 100,
		
		spriteCache : 100,
		
		show : function(){
			this.stage = new PIXI.Stage();
			this.bgm = $('#myaudio')[0];
			this.bgm.play();
			
			this.monkey = new PIXI.Sprite(PIXI.Texture.fromImage("./images/monkey.png"));
			this.background = new PIXI.Sprite(PIXI.Texture.fromImage("./images/game.jpg"));
			this.scoreContainer = new PIXI.DisplayObjectContainer();
			this.scoreBg = new PIXI.Sprite(PIXI.Texture.fromImage("./images/bg-score.png"));
			this.mai = new PIXI.TilingSprite(PIXI.Texture.fromImage("./images/mai.png"), GAME.exactWidth, GAME.exactHeight * this.maiLength);
			this.obstacleContainer = new PIXI.SpriteBatch();
			
			this.score = new PIXI.Text("0M", {font: "35px 微软雅黑", fill: "#595757"});
			this.scoreNum = 0;
			this.counter = 0;
		 	
			this.snows = [];
			this.thunders = [];
			this.monkey.parentStage = this;
			
			this.stage.visible = true;
			this.running = true;
			this.initPlaying();
			
			GAME.curStage = GAME.playingStage;
		},
		
		end : function(wayToDrop){
			if(GAME.maxScore < this.scoreNum){
				GAME.maxScore = this.scoreNum;
				if(_czc){_czc.push(['_trackEvent', '最高分' , GAME.maxScore , navigator.userAgent + "-" + GAME.uid , this.scoreNum]);}
			}
			if(_czc){_czc.push(['_trackEvent', '击落分数' , this.scoreNum , navigator.userAgent + "-" + GAME.uid , this.scoreNum]);}
			
			this.bgm.pause();
			
			this.running = false;
			this.stage.visible = false;
			this.stage.removeStageReference();
			GAME.endStage.show(this.scoreNum, wayToDrop);
		},
		
		initPlaying : function(){
			this.stage.addChild(this.background);
			this.stage.addChild(this.monkey);
			this.stage.addChild(this.obstacleContainer);
			this.stage.addChild(this.mai);
			
			this.stage.addChild(this.scoreContainer);
			this.scoreContainer.addChild(this.scoreBg);
			this.scoreContainer.addChild(this.score);

			this.resizeItems();
			requestAnimFrame(gameAnimate);
		},
		
		update : function(delay){		
			this.counter += delay;
			this.updateBg(delay);
			this.updateObstacle(delay);
			this.updateScore();
			if(this.running){
				GAME.renderer.render(this.stage);
			}
		},
		
		updateBg : function(delay){
			if(navigator.userAgent.indexOf("Android 4.4.2") > 0){
				return;
			}
			this.background.position.y += this.backgroundSpeed * GAME.ratio * delay;
			if(this.background.position.y > 0 ){
				this.background.position.y  = GAME.exactHeight - 3704 * GAME.ratio;
			}
		},
		
		updateObstacle : function(delay){
			this.updateSnow(delay);
			this.updateThunder(delay);
			this.updateMai(delay);
		},
		
		updateScore : function(){
			this.scoreNum =  Math.floor(this.counter * GAME.getConfig()["scoreSpeed"]);
			this.score.setText(this.scoreNum + "M");
			var offset = Math.floor(Math.log(this.scoreNum ) / Math.log(10));
			this.score.x = (43 - offset * 10) * GAME.ratio;
		},
		updateSnow : function(delay){

			snowNum = this.getNewSnowNum(delay);
			this.addNewSnows(snowNum);

			// 清理无效雪花
			if(this.snows.length > this.spriteCache){
				this.clearArray(this.snows);
			}
			
			// 更新雪花坐标
			for(var i in this.snows){
				this.snows[i].position.y += this.snows[i].speedY * delay;
				this.snows[i].position.x += this.snows[i].speedX * delay;

				// 隐藏飞出雪花
				if(this.snows[i].position.y > GAME.exactHeight + 30 * GAME.ratio){
					this.obstacleContainer.removeChild(this.snows[i]);
					this.snows[i].visible = false;
				}
				
				// 碰撞判断
				if(this.getDistance(this.snows[i],this.monkey) < this.hitRadius * GAME.ratio){
					this.end("show");
				}
			}
		},
		
		addNewSnows : function(num){
			for(var i = 0; i < num ; i++){
				this.addNewSnow();
			}
		},
		
		addNewSnow : function(){
			var newSnow = new PIXI.Sprite(PIXI.Texture.fromImage("./images/snow.png"));
			newSnow.scale.x = newSnow.scale.y = GAME.ratio;
			newSnow.anchor.x = 0.5;
			newSnow.anchor.y = 0.71;
			newSnow.position.x = Math.random() * GAME.exactWidth;
			newSnow.angle = Math.atan((this.monkey.position.y - this.fingerOffset * GAME.ratio - newSnow.position.y) / (this.monkey.position.x - newSnow.position.x));
			newSnow.angle += (Math.random() - 0.5) * this.snowAngleOffset;
			newSnow.speed = this.snowSpeed * GAME.ratio + this.snowSpeedOffset * (Math.random() - 0.5);
			if(Math.sin(newSnow.angle) < 0){
				newSnow.speedY = -1 * newSnow.speed * Math.sin(newSnow.angle);
				newSnow.speedX = -1 * newSnow.speed * Math.cos(newSnow.angle);
				otherAngle = 1 - Math.sin(newSnow.angle) * Math.sin(newSnow.angle);
				newSnow.rotation = Math.asin(Math.sqrt(otherAngle));
			}else{
				newSnow.speedY = newSnow.speed * Math.sin(newSnow.angle);
				newSnow.speedX = newSnow.speed * Math.cos(newSnow.angle);
				otherAngle = 1 - Math.sin(newSnow.angle) * Math.sin(newSnow.angle);
				newSnow.rotation = -1 * Math.asin(Math.sqrt(otherAngle));
			}
			this.obstacleContainer.addChild(newSnow);
			this.snows.push(newSnow);
			newSnow = null;
		},
		
		getNewSnowNum : function(delay){
			this.snowCounter += delay;
			if(this.snowCounter >= this.snowWaveDelay){
				this.snowCounter = 0;
				return Math.min(Math.floor(this.counter), this.snowMaxPerTurn);
			}else{
				return 0;
			}
		},
		
		addNewThunder : function(){
			var newThunder = new PIXI.Sprite(PIXI.Texture.fromImage("./images/thunder.png"));
			newThunder.scale.x = newThunder.scale.y = GAME.ratio;
			newThunder.anchor.x = 0.5;
			newThunder.anchor.y = 0.5;
			newThunder.position.x = Math.random() * GAME.exactWidth;
			newThunder.speed = Math.min(this.thunderSpeed + this.counter * 50,this.thunderMaxSpeed) * GAME.ratio + this.thunderSpeedOffset * (Math.random() - 0.5);
			this.obstacleContainer.addChild(newThunder);
			this.thunders.push(newThunder);
			newThunder = null;
		},
		
		isNewThunderAdd : function(delay){
			this.thunderCounter += delay;
			if(this.thunderCounter >= this.thunderWaveDelay){
				if(0.5 > Math.random()){
					this.thunderCounter = 0;
					return false;
				}else{
					this.thunderCounter = 0;
					return true;
				}
			}else{
				return false;
			}
		},
		updateThunder : function(delay){
			// 新增闪电
			if(this.isNewThunderAdd(delay)){
				this.addNewThunder();
			}

			// 清理无效闪电
			if(this.thunders.length > this.spriteCache){
				this.clearArray(this.thunders);
			}
			
			// 更新闪电坐标
			for(var i in this.thunders){
				this.thunders[i].position.y += this.thunders[i].speed * delay;

				// 隐藏飞出闪电
				if(this.thunders[i].position.y > GAME.exactHeight + 30 * GAME.ratio){
					this.obstacleContainer.removeChild(this.thunders[i]);
					this.thunders[i].visible = false;
				}
				
				// 碰撞判断
				if(this.isThunderHit(this.thunders[i],this.monkey)){
					this.end("thunder");
				}
			}
		},
		
		isThunderHit : function(thunderSprite,spriteA){
			pointArray = [
				[31,-129],
				[-31,129],
				[0,0],
				[-37,15],
				[37,-15],
				[0,53],
				[0,-53]
			];
			for(var i in pointArray){
				xDistance = thunderSprite.position.x + pointArray[i][0] * GAME.ratio - spriteA.position.x;
				yDistance = thunderSprite.position.y + pointArray[i][1] * GAME.ratio - spriteA.position.y + this.fingerOffset * GAME.ratio;
				distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
				if(distance < this.thunderHitRadius * GAME.ratio){
					return true;
				}
			}
			return false;
		},
		
		updateMai : function(delay){
			
			switch(this.mai.status){
			
			case 'none':
				// 判断雾霾是否应出现
				if(this.isMaiComing()){
					this.mai.position.y = -1 * GAME.exactHeight * this.maiLength;
					this.mai.status = 'comming';
				}
				break;
			case 'comming':
				// 更新雾霾坐标
				this.mai.position.y += this.maiSpeed * GAME.ratio * delay;
				if(this.mai.position.y >= GAME.exactHeight){
					this.mai.status = 'none';
				}
				break;
			}
			
		},
		
		isMaiComing : function(){
			if(this.scoreNum == this.maiComeScore){
				return true;
			}else if(this.scoreNum > this.maiComeScore){
				return (Math.random() % 0.9 > 0.89 && 0.2 > Math.random());
			}else{
				return false;
			}
		},
		
		// 清理不可见元素
		clearArray : function(array){
			var tmpArray = array;
			array = [];
			for(var i in tmpArray){
				if(tmpArray[i].visible){
					array.push(tmpArray[i]);
				}
			}
			tmpArray = null;
		},
		
		
		bindMonkeyTouchEvent : function(){
			this.monkey.mousedown = this.monkey.touchstart = function(data){
				if(GAME.playingStage.running){
					this.newPosData = data;
					this.isDraging = true;
				}
			};
			
			this.monkey.mouseup = this.monkey.mouseupoutside = this.monkey.touchend = this.monkey.touchendoutside = function(data){
				if(GAME.playingStage.running){
					this.newPosData = data;
					this.isDraging = false;
				}
			};
			
			this.monkey.mousemove = this.monkey.touchmove = function(data){
				if(GAME.playingStage.running && this.isDraging){
					this.newPosData = data;
					this.parentStage.monkeyMoving(data);
				}
			};
		},
		
		monkeyMoving : function(data){
			var newPosition = data.getLocalPosition(this.background.parent);
			if(newPosition.y >= 120 * GAME.ratio && newPosition.y <= GAME.exactHeight && newPosition.x >= 0 && newPosition.x <= GAME.exactWidth){
				this.monkey.position.x = newPosition.x;
				this.monkey.position.y = newPosition.y;
			}
			
		},
		
		getDistance : function(SpriteA, SpriteB){
			xDistance = SpriteA.position.x - SpriteB.position.x;
			yDistance = SpriteA.position.y - SpriteB.position.y + this.fingerOffset * GAME.ratio;
			return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
		},
		
		resizeItems : function(){
			this.initBg();
			this.initScore();
			this.initMonkey();
		},
		
		resize : function(){
			this.end();
		},
		
		initBg : function(){
			this.background.position.y = GAME.exactHeight - 3704 * GAME.ratio;
			this.background.scale.x = this.background.scale.y = GAME.ratio;
			this.mai.position.y = -1 * GAME.exactHeight * this.maiLength;
			
			this.mai.status = 'none';
			
		},
		
		initScore : function(){
			this.scoreContainer.position.x = 457 * GAME.ratio;
			this.scoreContainer.position.y = 30 * GAME.ratio;
			this.score.position.y = 45 * GAME.ratio;
			this.score.position.x = 43 * GAME.ratio;
			this.scoreBg.scale.x = this.scoreBg.scale.y = GAME.ratio;
			this.score.scale.x = this.score.scale.y = GAME.ratio;
			this.score.setText("");
		},
		
		initMonkey : function(){
			this.monkey.anchor.x = 0.5;
			this.monkey.anchor.y = 1.2;
			this.monkey.position.x = GAME.exactWidth / 2;
			this.monkey.position.y = GAME.exactHeight * 0.8;
			this.monkey.scale.x = this.monkey.scale.y = GAME.ratio;
			this.monkey.interactive = true;
			this.bindMonkeyTouchEvent();
		}
};

var lastTime = 0;
function gameAnimate(time){
	if(GAME.playingStage.running){
		var passed = time - lastTime;
		if(passed >　100){
			passed = 100;
		}
		if(navigator.userAgent.indexOf("Android 4.4.2") > 0){
			GAME.playingStage.update(passed * 0.00045);
		}else{
			GAME.playingStage.update(passed * 0.0006);
		}
		
		lastTime = time;
		requestAnimFrame(gameAnimate);
	}
}

function coverAnimate(){
	if(GAME.coverStage.running){
		requestAnimFrame(coverAnimate);
		GAME.coverStage.update();
	}
}


function endAnimate(){
	if(GAME.endStage.running){
		requestAnimFrame(endAnimate);
		GAME.endStage.update();
	}
}

function descriptionAnimate(){
	if(GAME.descriptionStage.running){
		requestAnimFrame(descriptionAnimate);
		GAME.descriptionStage.update();
	}
}


var scoreNum = 0;
var resLoadingTime = new Date().getTime();
var uid = $.cookie('uid');
if(!uid){
	uid = Math.floor(Math.random() * 10000000);
	$.cookie('uid',uid);
}
	
function Game(){
	this.config = {
		// 背景速率
		backgroundSpeed:10,
		
		// 分数增长速率
		scoreSpeed:10,
		
		// 碰撞判断半径
		crashRadius:100,
		
		// 画布大小
		canvasWidth:640,
		canvasHeight:1009,
		
		// 加载资源

		assetsToLoader : [
			"./images/cover.jpg",
			"./images/star1.png",
			"./images/star2.png",
			"./images/star3.png",
			"./images/snow1.png",
			"./images/snow2.png",
			"./images/icon-logo.png",
			"./images/btn-start.png",
			"./images/bg-score.png",
			"./images/monkey.png",
			"./images/snow.png",
			"./images/thunder.png",
			"./images/game.jpg",
			"./images/end.png",
			"./images/btn-restart.png",
			"./images/mai.png",
			"./images/border.png"]
	},
	this.loadingStage = new LoadingStage();
	this.coverStage = new CoverStage();
	this.playingStage = new PlayingStage();
	this.endStage = new EndStage();
	this.descriptionStage = new DescriptionStage();
};

Game.prototype = {
	// 难度系数
	degree : 1,
	score: 0,
	maxScore : 0,
	retryTime : 0,
	uid : uid,
	ratio: 1,
	exactWidth:640,
	exactHeight:1009,
	renderer : null,
	curStage : this.coverStage,
	
	getConfig : function(){
		return this.config;
	},

	begin : function(){
		this.resize();
		this.loadingStage.show();   
	},
	
	reStart : function(){
		this.playingStage.reStart();
	},
	
	resize : function(){
		var width = $(window).width();
		var height = $(window).height();
		this.resizeContainer(width,height);
		this.resizeItems();
		
		
	},
	
	resizeGame : function(){
		this.resize();
		this.curStage.resize();
		GAME.renderer.resize(this.exactWidth,this.exactHeight);
	},
	
	resizeContainer : function(windowWidth,windowHeight){
		this.ratio = Math.min(windowWidth / this.getConfig()["canvasWidth"], windowHeight / this.getConfig()["canvasHeight"]);
		this.exactWidth = this.getConfig()["canvasWidth"] * this.ratio;
		this.exactHeight = this.getConfig()["canvasHeight"] * this.ratio;
		$("#container").css("width", this.exactWidth + "px");
		$("#container").css("height", this.exactHeight + "px");
		var canvasWidth = this.getConfig()["canvasWidth"];
		var canvasHeight = this.getConfig()["canvasHeight"];
		$("#container").css("top",windowHeight/2 - (canvasHeight * this.ratio)/2 + "px");
		$("#container").css("left",windowWidth/2 - (canvasWidth * this.ratio)/2 + "px");
	},
	
	resizeItems : function(){
		$("#loading_bar").css("top",GAME.exactHeight / 2 + "px");
	}
	
};
var GAME = new Game();
$(function(){
	GAME.begin();
	$(window).resize(resize)
	window.onorientationchange = resize;
	
	
	WeixinApi.ready(function(Api){
		
		var desc = "真爱至上，穿越冰雹雾霾，护送程序员去约会！";
		
	    wxData = {
	        "imgUrl":'http://bbs.coloros.com/data/oppo/2014/12/23/141931464256235836.jpg',
	        "link": location.href,
	        "desc":desc,
	        "title":"护送程序猿去约会"
	    };
	    
	    var wxTimelineCallbacksInit = {
	        confirm:function (resp) {
	        	if(_czc){_czc.push(['_trackEvent', '分享到朋友圈' , '分享到朋友圈' , navigator.userAgent + "-" + GAME.uid , 0]);}
	        }
	    };
	    
	    var wxFriendCallbacksInit = {
	        confirm:function (resp) {
	        	if(_czc){_czc.push(['_trackEvent', '发送给朋友' , '发送给朋友' , navigator.userAgent + "-" + GAME.uid , 0]);}
	        }
	    };
	    Api.shareToFriend(wxData,wxFriendCallbacksInit);
	    Api.shareToTimeline(wxData,wxTimelineCallbacksInit);
	});
});

function resize(){
	GAME.resizeGame();
}
