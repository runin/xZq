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
		$stageMain: $("#stage_main"),
		$stageLoading: $("#stage_loading"),
		$playBtn: $("#play-btn"),
		$loadingBar: $("#loading_bar"),
		$cornCon: $(".corn-con").find("span"),
		$coverBg: $(".cover-bg"),
		$gamesAgain: $(".games-again"),
		$ruleBtn: $(".rule-btn"),
		$inGames: $("#in-games"),
		$bgm: $('#bgm'),
		$mycardBtn: $(".mycard-btn")
	};
	
	H.index = {
		$ing:false,
		$href:"",
		game: null,
		$zhong:false,
		$value: 199,
		init: function() {
			this.goGames();
			this.ruleFn();
			this.mycardFn();
		},
		goGames: function() {
			classId.$inGames.click(function(e) {
				e.preventDefault();
				classId.$coverBg.addClass("none");
				classId.$gamesAgain.removeClass("none");
				H.index.playFn();
				H.index.leftLotteryCount();
			});
		},
		startGame: function() {//游戏开始
            classId.$stageMain.removeClass("none");
            classId.$stageLoading.addClass("none");
            classId.$loadingBar.addClass("none");
            classId.$coverBg.addClass("none");
            classId.$gamesAgain.addClass("none");
			classId.$bgm[0].play();
		    if(!H.index.$ing) {
				H.index.$ing = true;
				H.index.game = new Game();
				H.index.game.start({
					maxScore:H.index.$value,
					endCallBack:function(score){
						H.index.endGame(score);
					}
				});
			}else {
				H.index.game.reStart({
					maxScore:H.index.$value
				});
			}
		},
		endGame: function(score) {//结束游戏
		    H.index.lotteryLuck();
		},
		playFn: function() {//开始玩游戏
			classId.$playBtn.unbind("click").click(function(e) {
				e.preventDefault();
				if($(this).hasClass("not")) {
					showTips("今天的游戏次数已经用完啦~");
					return;
				}
				H.index.startGame();
			});
		},
		ruleHtml: function() {//游戏规则
		    var t = simpleTpl();
			t._('<section class="pop-bg">')
			t._('<div class="rule-con rule-a">')
			t._('<a href="javascript:void(0)" class="rule-close"></a>')
			t._('<div class="rule-text">')
			t._('<div id="rule-data"></div>')
			t._('<div class="rule-img"><img src="images/icon-rule-image.png" /></div>')
			t._('</div>')
			t._('</div>')
			t._('</section>')
			$("body").append(t.toString());
			this.closeFn(".rule-close",".pop-bg");
            getResult('api/common/rule',{}, 'commonApiRuleHandler');
		},
		ruleFn: function() {//游戏规则
		    classId.$ruleBtn.unbind("click").click(function(e) {
				e.preventDefault();
				H.index.ruleHtml();
			});
		},
		mycardFn: function() {//中奖记录
		    classId.$mycardBtn.unbind("click").click(function(e) {
				e.preventDefault();
				var t = simpleTpl();
				t._('<section class="mycard-bg">')
				t._('<div class="mycard-con">')
				t._('<ul id="mycard-list">')
				t._('</ul>')
				t._('</div>')
				t._('<a href="javascript:void(0)" class="return-btn">返 回</a>')
				t._('</section>')
				$("body").append(t.toString());
				getResult("api/lottery/record",{oi:openid, pt:11},"callbackLotteryRecordHandler");
			});
			this.mycardClose();
		},
		mycardClose: function() {
			$("body").delegate(".return-btn", "click", function(e) {
				e.preventDefault();
				$(".mycard-bg").remove();
			});
		},
		leftLotteryCount: function() {//查询用户当前抽奖活动的剩余抽奖次数
			getResult('api/lottery/leftLotteryCount',{oi: openid}, 'callbackLotteryleftLotteryCountHandler');
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
			$("#again-btn").unbind("click").click(function(e) {
				e.preventDefault();
				$(".pop-bg").remove();
				if(H.index.$zhong) {
					H.index.lotteryAward();
					return;
				}
				H.index.leftLotteryCount();
			});
		},
		closeFn: function(a,b) {
			$(a).click(function(e) {
				e.preventDefault();
				$(".rule-con").removeClass("rule-a").addClass("rule-b");
				setTimeout(function() {
					$(b).remove();
				},800);
			});
		}
		
	};
	
	// 业务抽奖活动抽奖
	W.callbackLotteryLuckHandler = function(data){
		if(data && data.result){
			H.index.$zhong=true;
			H.index.$href = "";
			var pt = data.pt;
			$(".lottery-text").html(data.tt);
			$(".lottery-img").css("background-image","url('"+data.pi+"')");
			if(pt==0) {//谢谢参与
			}
			if(pt==4) {//现金红包
				H.index.$href = data.rp;
			}
			if(pt==9) {//外链奖品
				H.index.$href = data.ru;
			}
			if(pt==11) {//自有兑换码奖品
				$(".lottery-ewm").html("兑换码:"+data.cc).removeClass("none");
				$(".lottery-cut").removeClass("none");
			}
			
		}else{
			$(".lottery-text").html("哎呀，啥都没抽到~");
			$(".lottery-img").css("backgroundImage","url('images/xiexie.png')");
		}
	};
	
	// 业务规则
	W.commonApiRuleHandler = function(data){
		if(data && data.code==0){
			$("#rule-data").html(data.rule);
		}
	};
	// 中奖记录
	W.callbackLotteryRecordHandler = function(data){
		var t = simpleTpl();
		if(data && data.result){
			var rl = data.rl;
			for(var i=0,leg=rl.length; i<leg; i++) {
				t._('<li>')
				t._('<i></i>')
				t._('<h2>'+rl[i].lt+'</h2>')
				t._('<div class="mycard-info">')
				t._('<p>'+rl[i].pn+'</p>')
				if(rl[i].cc) {
					t._('<p>兑换码：'+rl[i].cc+'</p>')
				}
				t._('</div>')
				t._('</li>')
			}
			$("#mycard-list").empty().append(t.toString());
		}else {
			t._('<span class="mycard-not">啥都没有哦~</span>')
			$(".mycard-con").empty().append(t.toString());
		}
		
	};
	// 领取奖品
	W.callbackLotteryAwardHandler = function(data){
		if(data && data.result){
			if(H.index.$href !=""){
				window.location.href = H.index.$href;
				return;
			}
			H.index.$zhong=false;
			H.index.leftLotteryCount();
		}
	};
	// 查询用户当前抽奖活动的剩余抽奖次数
	W.callbackLotteryleftLotteryCountHandler = function(data){
		function endGames() {
			classId.$bgm[0].pause();
			H.index.$ing=false;
			classId.$stageMain.addClass("none");
			classId.$playBtn.addClass("not");
			classId.$cornCon.addClass("not");
			classId.$coverBg.addClass("none");
			classId.$gamesAgain.removeClass("none");
		};
		if(data && data.result){
			var l = data.lc;
			if(l>0) {
				classId.$playBtn.removeClass("not");
				classId.$gamesAgain.removeClass("none");
				if(l==3) {
					classId.$cornCon.removeClass("not");
				}
				if(l==2) {
					classId.$cornCon.addClass("not").not(":first-child").removeClass("not");
				}
				if(l==1) {
					classId.$cornCon.addClass("not").not(":nth-child(1)").not(":nth-child(2)").removeClass("not");
				}
				if(H.index.$ing) {
					H.index.startGame();
				}
			}else {
				endGames();
			}
		}else {
			endGames();
		}
	};

	H.loading.init();

})(Zepto);