;(function($) {
	
	H.loading = {//加载素材
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
	
	var classId = {
		$playBtn: $("#play-btn"),
		$cornCon: $(".corn-con").find("span"),
		$coverBg: $(".cover-bg"),
		$gamesAgain: $(".games-again"),
		$stageMain: $(".stage_main")
	};
	
	H.index = {
		$ing:false,
		$href:"",
		game: null,
		init: function() {
			H.index.leftLotteryCount();
		},
		startGame: function() {//游戏开始
			H.index.game = new Game();
			H.index.game.start({
				maxScore:199,
				endCallBack:function(score){
					H.index.endGame(score);
				}
			});
		},
		endGame: function(score) {//结束游戏
		},
		playFn: function() {//开始玩游戏
			classId.$playBtn.unbind("click").click(function() {
				if($(this).hasClass("not")) {
					return;
				}
				H.index.$ing = true;
				H.index.leftLotteryCount();
				H.index.startGame();
			});
		},
		leftLotteryCount: function() {//查询用户当前抽奖活动的剩余抽奖次数
			getResult('api/lottery/leftLotteryCount',{'oi': openid}, 'callbackLotteryleftLotteryCountHandler');
		},
		lotteryLuck: function() {//业务抽奖活动抽奖
		    H.index.lotteryHtml();
			getResult('api/lottery/luck',{oi: openid},'callbackLotteryLuckHandler');
		},
		lotteryAward: function() {//领取奖品
			getResult('api/lottery/award',{oi: openid},'callbackLotteryAwardHandler');
		},
		lotteryHtml: function(data) {
			var t = simpleTpl();
			t._('<section class="pop-bg">')
			t._('<div class="lottery-text"></div>')
			t._('<div class="lottery-img"></div>')
			t._('<div class="lottery-ewm none"></div>')
			t._('<div class="lottery-cut none">（请截图并妥善保存兑换码在商家处领取)</div>')
			t._('<a href="javascript:void(0)" class="again-btn" id="again-btn"></a>')
			t._('</section>')
			$("body").append(t.toString());
			this.againFn();
		},
		againFn: function() {
			//$("body").delegate("#again-btn", "click", function() {});
			$("#again-btn").unbind("click").click(function() {
				H.index.lotteryAward();
			});
		}
		
	};
	
	// 业务抽奖活动抽奖
	W.callbackLotteryLuckHandler = function(data){
		if(data && data.result){
			var pt = data.pt;
			$(".lottery-text").html(data.tt);
			$(".lottery-img").css("background-image","url('"+data.pi+"')");
			if(pt==0) {//谢谢参与
			}
			if(pt==4) {//现金红包
				H.index.$href = data.rp;
			}
			if(pt==5) {//兑换码奖品
				$(".lottery-ewm").html("兑换码:"+data.cc).removeClass("none");
				$(".lottery-cut").removeClass("none");
			}
			if(pt==9) {//外链奖品
				H.index.$href = data.ru;
			}
			
		}else{
			$(".lottery-text").html("哎呀，啥都没抽到~");
			$(".lottery-img").css("background-image","url('images/xiexie.png)");
		}
	};
	
	// 领取奖品
	W.callbackLotteryAwardHandler = function(data){
		if(data && data.result){
			H.index.leftLotteryCount();
			$(".pop-bg").remove();
		}
	};
	// 查询用户当前抽奖活动的剩余抽奖次数
	W.callbackLotteryleftLotteryCountHandler = function(data){
		if(data && data.result){
			var l = data.lc;
			if(l>0) {
				if(H.index.$ing) {
					classId.$gamesAgain.addClass("none");
				}
				classId.$playBtn.removeClass("not");
				classId.$gamesAgain.removeClass("none");
				classId.$stageMain.removeClass("none");
				H.index.playFn();
				
				if(l==3) {
					classId.$cornCon.removeClass("not");
				}
				if(l==2) {
					classId.$cornCon.not(":first-child").removeClass("not");
				}
				if(l==1) {
					classId.$cornCon.not(":nth-child(1)").not(":nth-child(2)").removeClass("not");
				}
			}else {
				classId.$playBtn.addClass("not");
				classId.$cornCon.addClass("not");
				classId.$coverBg.addClass("not");
			}
		}else {
			classId.$playBtn.addClass("not");
			classId.$cornCon.addClass("not");
			classId.$coverBg.addClass("not");
			classId.$gamesAgain.removeClass("none");
		}
	};

	H.loading.init();

})(Zepto);