$("body").css({
	"width": $(window).width() + "px",
	"height": $(window).height() + "px"
});
(function($){
	H.vote = {
		//抽奖
		nowTime:"",
		dec:0,
		endType: 0,
		type: 0,
		index: 0,
		isTimeOver: false,
		$lotteryCountdown: $("#lottery-countdown"),
		lastRound: false,
		nextPrizeAct: null,
		crossLotteryFlag: false,    //跨天摇奖倒计时标识  true为有跨天摇奖 false为没有跨天摇奖
		crossLotteryCanCallback: false,
		markJump: getQueryString("markJump"),
		canJump: false,
		// 投票
		count:0,
		cunt:0,
		voteRepeatCheck: true,
		repeatCheck: true,
		voteCountType: 0,
		voteCurrentIndex: 0,
		voteItemList: [],
		voteSwiper: null,
		voteItemStatus: [],
		// 弹幕
		commentsList: new Array(),
		ZDcommentsList: new Array(),
		selfCommentsList: new Array(),
		REQUEST_CLS: 'requesting',
		$inputCmt: $('#input-comment'),
		clsList: ["pink","red","blue","green","brown"],
		maxid:0,
		commentsMaxNum: 0,
		init : function(){
			var me = this;
            var height = document.body.clientHeight - 140;
			me.commentsMaxNum = parseInt(height/35);
			me.disDouble();
			me.current_time();
			// me.initVote();
			me.event();
			me.getComments();
			setInterval(function(){
				me.getComments();
			},10000);
			setTimeout(function () {
				me.showComments();
			},1000);
			setTimeout(function () {
				me.getZDComments();
			},8000);
			// me.initVoteNum();
			// setInterval(function () {
			// 	me.initVoteNum();
			// },10000);
		},
		disDouble:function(){
			// 禁用iPhone双击事件
			var agent = navigator.userAgent.toLowerCase();        //检测是否是ios
			var iLastTouch = null;                                //缓存上一次tap的时间
			if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0)
			{
				document.body.addEventListener('touchend', function(event)
				{
					var iNow = new Date().getTime();
					iLastTouch = iLastTouch || iNow + 1 /** 第一次时将iLastTouch设为当前时间+1 */ ;
					var delta = iNow - iLastTouch;
					if (delta < 500 && delta > 0)
					{
						event.preventDefault();
						return false;
					}
					iLastTouch = iNow;
				}, false);
			}
		},
		event: function () {
			var me = this;
			// $(".border").tap(function(){
			// 	var heart = getRandomArbitrary(1,7);
			// 	var cls = getRandomArbitrary(1,5);
			// 	$(".hart-list").append("<div class='heart"+heart+" f"+cls+"' id='heart"+me.count+"'></div>");
			// 	me.count++;
			// 	$(".num").text(me.count);
			// 	var li = $(".hart-list").find("div").length;
			// 	if(li >= 50){
			// 		$(".hart-list").empty();
			// 	}
			// 	getResult('api/servicecount/incrcount', {
			// 		key: tongjiKey
			// 	}, 'callbackServiceCountIncrHandler');
			// });
			$(".inp,.apply-btn,.swiper-button-next,.swiper-button-prev,.swiper-button-disabled").tap(function (e) {
				e.stopPropagation();
			});
			$("body").delegate("over","click",function(e){
				e.stopPropagation();
			});
			$("#submit").tap(function(e) {
				e.stopPropagation();
				e.preventDefault();
				if ($(this).hasClass(me.REQUEST_CLS)) {
					return;
				}
				var comment = $.trim(me.$inputCmt.val()) || '',
					comment = comment.replace(/<[^>]+>/g, ''),
					len = comment.length;

				if (len < 1) {
					showTips('请先说点什么吧');
					me.$inputCmt.removeClass('error').addClass('error');
					return;
				} else if (len > 30) {
					showTips('字数不能超过30哦');
					me.$inputCmt.removeClass('error').addClass('error');
					return;
				}
				$(this).addClass(me.REQUEST_CLS);
				shownewLoading(null,'发送中...');
				$.ajax({
					type : 'GET',
					async : false,
					url : domain_url + 'api/comments/save'+dev,
					data: {
						co: encodeURIComponent(comment),
						op: openid,
						ty: 1,
						nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						headimgurl: headimgurl ? headimgurl : ""
					},
					dataType : "jsonp",
					jsonpCallback : 'callbackCommentsSave',
					complete: function() {
						hidenewLoading();
					},
					success : function(data) {
						$("#submit").removeClass(me.REQUEST_CLS);
						if(data.code == 0) {
							showTips('发送成功');
							var cls = getRandomArbitrary(0,5);
							var na = nickname ? nickname : "匿名";
							var t = new simpleTpl();
							t._('<li><div class="'+me.clsList[cls]+'"><span class="ni">' + filterXSS(na) + '：</span><span class="con">' + filterXSS(comment) + '</span></div></li>');
							$("#comments_content").append(t.toString());
							var n = $("#comments_content").find("li").length;
							if(n >= 6){
								$("#comments_content").find("li").first().remove();
							}
							me.$inputCmt.removeClass('error').val('');
							me.selfCommentsList.push(data.uid);
							return;
						}
						showTips("发送失败");
					}
				});
			});
			$(".guess-btn").click(function(e){
				e.preventDefault();
				e.stopPropagation();
				if($(this).hasClass("voted")){
					showTips("您已经竞猜过");
					return;
				}else if($(this).hasClass("over")){
					showTips("竞猜时间已过");
					return;
				}else if($(this).hasClass("waiting")){
					showTips("竞猜还未开始，请稍候");
					return;
				}
				var guid = me.voteItemList[me.voteCurrentIndex].guid;
				var pItems = me.voteItemList[me.voteCurrentIndex].pitems;
				var no_puid = '',ok_puid = '';
				for(var i = 0; i < pItems.length; i++){
					if(pItems[i].re == 1){
						ok_puid = pItems[i].pid;
					}else{
						no_puid = pItems[i].pid;
					}
				}
				$("#vote-dialog").find(".vote-ok").attr("guid",guid).attr("puid",ok_puid);
				$("#vote-dialog").find(".vote-no").attr("guid",guid).attr("puid",no_puid);
				$("#vote-dialog").removeClass("none");
			});
			$(".vote-ok").click(function(e){
				var guid = $(this).attr("guid");
				var puid = $(this).attr("puid");
				$.ajax({
					type : 'GET',
					async : false,
					url : domain_url + 'api/voteguess/guessplayer' + dev,
					data: {
						yoi: openid,
						guid: guid,
						pluids: puid
					},
					dataType : "jsonp",
					jsonpCallback : 'callbackVoteguessGuessHandler',
					timeout: 15000,
					complete: function() {
					},
					success : function(data) {
						showTips("竞猜成功");
						localStorage.setItem("isvote-"+guid,puid);
						$(".guess-btn").attr("class","guess-btn voted");
						$(".vote-countdown-tip").html('距竞猜结果揭晓还有 ');
						$('.vote-countdown').removeClass("hide");
						$("#vote-dialog").addClass("none");
					},
					error : function(xmlHttpRequest, error) {
						me.end();
					}
				});
			});
			$(".vote-no").click(function(e){
				var guid = $(this).attr("guid");
				var puid = $(this).attr("puid");
				$.ajax({
					type : 'GET',
					async : false,
					url : domain_url + 'api/voteguess/guessplayer' + dev,
					data: {
						yoi: openid,
						guid: guid,
						pluids: puid
					},
					dataType : "jsonp",
					jsonpCallback : 'callbackVoteguessGuessHandler',
					timeout: 15000,
					complete: function() {
					},
					success : function(data) {
						showTips("竞猜成功");
						localStorage.setItem("isvote-"+guid,puid);
						$(".guess-btn").attr("class","guess-btn voted");
						$(".vote-countdown-tip").html('距竞猜结果揭晓还有 ');
						$('.vote-countdown').removeClass("hide");
						$("#vote-dialog").addClass("none");
					},
					error : function(xmlHttpRequest, error) {
						me.end();
					}
				});
			});
			$("#lottery-dialog").click(function(e){
				e.preventDefault();
				var sn = new Date().getTime()+'';
				var uuid = $("#lottery-dialog").attr("data-lottery-uid");
				localStorage.setItem("islottery-"+uuid,"lotteryed");
				$.ajax({
					type: 'GET',
					async: false,
					url: domain_url + 'api/lottery/exec/luck4Vote' + dev,
					data: {
						matk: matk ,
						sn: sn
					},
					dataType: "jsonp",
					jsonpCallback: 'callbackLotteryLuck4VoteHandler',
					timeout: 10000,
					complete: function() {
					},
					success: function(data) {
						if(data.flow && data.flow == 1){
							H.dialog.thanks.open(data);
							$("#lottery-dialog").addClass("none");
							return;
						}
						if(data.result){
							if(data.sn == sn){
								sn = new Date().getTime()+'';
								if(data == null || data.result == false || data.pt == 0){
									H.dialog.thanks.open(data);
									$("#lottery-dialog").addClass("none");
									return;
								}else{
									$("#audio-b").get(0).play();    //中奖声音
								}
								me.showDialog(data);
								$("#lottery-dialog").addClass("none");
							}
						}else{
							sn = new Date().getTime()+'';
							H.dialog.thanks.open(data);
							$("#lottery-dialog").addClass("none");
						}
					},
					error: function() {
						sn = new Date().getTime()+'';
						H.dialog.thanks.open(data);
						$("#lottery-dialog").addClass("none");
					}
				});
			});
		},
		showDialog: function(data){
			var meDialog = H.dialog;
			switch (data.pt){
				case 1://实物奖品
					meDialog.shiwuLottery.open(data);
					break;
				case 2://积分奖品
					meDialog.jfLottery.open(data);
					break;
				case 4://现金红包
					meDialog.redbagLottery.open(data);
					break;
				case 5://兑换码
					meDialog.duiHuanMaLottery.open(data);
					break;
				case 7://卡劵奖品
					meDialog.wxcardLottery.open(data);
					break;
				case 9://外链奖品
					meDialog.linkLottery.open(data);
					break;
				default://谢谢参与
					meDialog.thanks.open(data);
			}
		},
		current_time: function(){
			var me = this;
			$.ajax({
				type : 'GET',
				async : false,
				url : domain_url + 'api/lottery/round' + dev,
				data: {},
				dataType : "jsonp",
				jsonpCallback : 'callbackLotteryRoundHandler',
				timeout: 15000,
				complete: function() {
				},
				success : function(data) {
					if(data.result == true){
						me.nowTime = timeTransform(data.sctm);
						var nowTime = new Date().getTime();
						me.dec = (nowTime - data.sctm);
						me.currentPrizeAct(data);
					}else{
						me.end();
					}
				},
				error : function(xmlHttpRequest, error) {
					me.end();
				}
			});
		},
		//活动结束
		end: function(){
			$(".countdown-tip").html("本期摇奖已结束");
			$(".detail-countdown").addClass("hidden");
			$(".tolottery-btn").addClass("none");
			$(".countdown").removeClass("none");

		},
		currentPrizeAct:function(data){
			//获取抽奖活动
			var me = this, nowTimeStr = this.nowTime, prizeLength = 0, prizeActList = data.la, day = nowTimeStr.split(" ")[0];
			// 判断是否为跨天摇奖 配置文件中crossdayLimit跨天摇奖阀值，默认2h
			var lastLotteryEtime = prizeActList[prizeActList.length - 1].pd + ' ' + prizeActList[prizeActList.length - 1].et;
			var lastLotteryNtime = prizeActList[prizeActList.length - 1].nst;
			var crossDay = timeTransform(new Date().setDate(new Date(lastLotteryEtime).getDate() + 1)).split(" ")[0];
			var minCrossDay = crossDay + ' 00:00:00';
			var maxCrossDay = timeTransform(new Date(minCrossDay).getTime() + crossdayLimit);
			if(comptime(lastLotteryNtime, minCrossDay) <= 0 && comptime(lastLotteryNtime, maxCrossDay) >= 0) {
				me.crossLotteryFlag = true;
			} else {
				me.crossLotteryFlag = false;
			}
			me.pal = prizeActList;
			prizeLength = prizeActList.length;
			if(prizeActList.length > 0){
				//如果最后一轮结束
				if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
					if (me.crossLotteryFlag) {
						me.type = 1;
						me.crossCountdown(prizeActList[prizeLength - 1].nst);
					} else {
						me.type = 3;
						me.endType = 3;
						me.end();
					}
					return;
				}
				for ( var i = 0; i < prizeActList.length; i++) {
					var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
					var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
					me.index = i;
					hidenewLoading();
					//在活动时间段内且可以抽奖
					if(comptime(nowTimeStr, beginTimeStr) <= 0 && comptime(nowTimeStr, endTimeStr) >= 0){
						if(i < prizeActList.length - 1){
							var nextBeginTimeStr = prizeActList[i + 1].pd + " " + prizeActList[i + 1].st;
							if(comptime(endTimeStr, nextBeginTimeStr) <= 0){
								me.endType = 2;
								// 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
								me.lastRound = false;
								me.nextPrizeAct = prizeActList[i+1];
							} else {
								// 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
								me.endType = 1;
							}
						}else{
							// 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
							me.endType = 3;
							me.lastRound = true;
						}
						me.nowCountdown(prizeActList[i]);
						return;
					}
					if(comptime(nowTimeStr, beginTimeStr) > 0){
						me.beforeCountdown(prizeActList[i]);
						return;
					}
				}
			}else{
				me.end();
				return;
			}
		},
		// 摇奖开启倒计时
		beforeCountdown: function(prizeActList) {
			var me = this;
			me.type = 1;
			var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
			var beginTimeLong = timestamp(beginTimeStr);
			beginTimeLong += me.dec;
			me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty().removeClass("none");
			me.$lotteryCountdown.find(".countdown-tip").html('距离摇奖开始还有');
			me.count_down();
			$(".tolottery-btn").addClass("none");
			me.$lotteryCountdown.removeClass('none');
			me.canJump = true;
			hidenewLoading();
		},
		// 摇奖结束倒计时
		nowCountdown: function(prizeActList){
			var me = this;
			me.type = 2;
			var endTimeStr = prizeActList.pd+" "+prizeActList.et;
			var beginTimeLong = timestamp(endTimeStr);
			beginTimeLong += me.dec;
			me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty().removeClass("none");
			me.$lotteryCountdown.find(".countdown-tip").html("距离摇奖结束还有");
			me.count_down();
			me.$lotteryCountdown.removeClass('none');
			// me.$lotteryCountdown.addClass("hide");
			$(".tolottery-btn").removeClass("none");
			if(me.markJump != "yaoClick"){
				location.href = "lottery.html";
			}else{
				me.markJump = '';
			}
			me.index++;
			me.canJump = true;
			hidenewLoading();
		},
		// 跨天摇奖开启倒计时
		crossCountdown: function(nextTime) {
			var me = this;
			me.crossLotteryFlag = false;
			me.crossLotteryCanCallback = true;
			me.type = 1;
			var beginTimeLong = timestamp(nextTime);
			beginTimeLong += me.dec;
			me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty().removeClass("none");
			me.$lotteryCountdown.find(".countdown-tip").html('距本轮摇奖开始还有');
			me.count_down();
			$(".tolottery-btn").addClass("none");
			me.$lotteryCountdown.removeClass('none');
			me.canJump = true;
			hidenewLoading();
		},
		count_down: function() {
			var me = this;
			me.$lotteryCountdown.find('.detail-countdown').each(function() {//摇奖页倒计时
				$(this).countDown({
					etpl : '<label>%M%</label>' + '<span>分</span>' + '<label>%S%</label>' + '秒', // 还有...结束
					stpl : '<label>%M%</label>' + '<span>分</span>' + '<label>%S%</label>' + '秒', // 还有...开始
					sdtpl: '',
					otpl: '',
					otCallback: function() {
						if(me.canJump){
							me.canJump = false;
							if (me.crossLotteryCanCallback) {
								if(!me.isTimeOver){
									var delay = Math.ceil(1000*Math.random() + 500);
									me.isTimeOver = true;
									me.crossLotteryCanCallback = false;
									me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
									me.$lotteryCountdown.find('.detail-countdown').addClass("none");
									shownewLoading(null, '请稍后...');
									setTimeout(function(){
										me.current_time();
									}, delay);
								}
							} else {
								if(me.type == 1){
									//距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
									if(!me.isTimeOver){
										me.isTimeOver = true;
										me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
										me.$lotteryCountdown.find('.detail-countdown').addClass("none");
										shownewLoading(null,'请稍后...');
										setTimeout(function() {
											me.nowCountdown(me.pal[me.index]);
										}, 1000);
									}
								}else if(me.type == 2){
									//距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
									if(!me.isTimeOver){
										me.isTimeOver = true;
										if(me.index >= me.pal.length){
											if (me.crossLotteryFlag) {
												me.type = 1;
												me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
												me.$lotteryCountdown.find('.detail-countdown').addClass("none");
												shownewLoading(null,'请稍后...');
												setTimeout(function() {
													me.crossCountdown(me.pal[me.pal.length - 1].nst);
												}, 1000);
											} else {
												me.type = 3;
												me.end();
											}
											return;
										}
										me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
										me.$lotteryCountdown.find('.detail-countdown').addClass("none");
										shownewLoading(null,'请稍后...');
										var i = me.index - 1;
										if(i < me.pal.length - 1){
											var endTimeStr = me.pal[i].pd + " " + me.pal[i].et;
											var nextBeginTimeStr = me.pal[i + 1].pd + " " + me.pal[i + 1].st;
											if(comptime(endTimeStr,nextBeginTimeStr) <= 0){
												// 有下一轮并且下一轮的开始时间和本轮的结束时间重合
												me.endType = 2;
											} else {
												// 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
												me.endType = 1;
											}
										}
										setTimeout(function(){
											if(me.endType == 2){
												me.nowCountdown(me.pal[me.index]);
											}else if(me.endType == 1){
												me.beforeCountdown(me.pal[me.index]);
											} else {
												me.end();
											}
										},1000);
									}
								}else{
									me.end();
								}
							}
						}else{
							me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
							me.$lotteryCountdown.find('.detail-countdown').addClass("none");
						}
					},
					sdCallback: function(){
						me.isTimeOver = false;
					},
					stCallback : function(){}
				});
			});
		},
		initVote: function(){
			var me = this;
			$.ajax({
				type : 'GET',
				async : false,
				url : domain_url + 'api/voteguess/inforoud' + dev,
				data: {},
				dataType : "jsonp",
				jsonpCallback : 'callbackVoteguessInfoHandler',
				timeout: 15000,
				complete: function() {
				},
				success : function(data) {
					if(data.code == 0){
						me.voteRound(data);
					}
				},
				error : function(xmlHttpRequest, error) {
				}
			});
		},
		voteRound:function(data){
			//获取抽奖活动
			var itemLength = 0,
				nowTimeStr = timeTransform(data.cud * 1),
				itemList = data.items,
				me = this;
			me.voteItemList = itemList;
			if(itemList.length >0){
				itemLength = itemList.length;
				var t = new simpleTpl();
				for ( var i = 0; i < itemLength; i++) {
					t._('<div class="swiper-slide"><img src="' + itemList[i].img + '"></div>');
					me.voteItemStatus.push("waiting");
				}
				$(".swiper-wrapper").html(t.toString());
				me.voteSwiper = new Swiper ('.swiper-container', {
					pagination: '.swiper-pagination',
					nextButton: '.swiper-button-next',
					prevButton: '.swiper-button-prev',
					onSlideChangeEnd: function(swiper){
						$(".guess-btn").attr("class","guess-btn "+me.voteItemStatus[swiper.activeIndex]);
					}
				});
				//如果最后一轮抽奖时间结束
				if(comptime(itemList[itemLength-1].put,nowTimeStr) >= 0){
					me.voteEnd();
					return;
				}
				for ( var i = 0; i < itemLength; i++) {
					var beginTimeStr = itemList[i].gst;
					var endTimeStr = itemList[i].get;
					var resultTimeStr = itemList[i].put;
					//在某一轮开始投票到结果公布时间段内
					if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,resultTimeStr) >=0){
						//在某一轮开始投票到结束投票时间段内
						if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
							// 距离投票结束倒计时
							me.voteCurrentIndex = i;
							//先判断是否投过票
							me.isVote(i,itemList[i].guid);
							return;
						}
						// 距离抽奖结束倒计时
						me.voteCurrentIndex = i;
						me.isLottery(i,itemList[i].guid);
						return;
					}
					// 据下次活动开始
					if(comptime(nowTimeStr,beginTimeStr) > 0){
						me.voteCurrentIndex = i;
						me.voteSwiper.slideTo(i, 500, false);
						me.voteBeforeCountdown(beginTimeStr);
						return;
					}
					// 当前投票结束
					me.voteItemStatus[i] = "over";
				}
			}else{
				me.voteEnd();
			}
		},
		//投票活动结束
		voteEnd: function(){
			var me = this;
			for ( var i = 0; i < me.voteItemList.length; i++) {
				me.voteItemStatus[i] = "over";
			}
			$(".vote-countdown-tip").html("本期投票已结束");
			$(".vote-detail-countdown").addClass("hidden");
			$(".vote-countdown").addClass("hide");
			$(".vote-countdown").removeClass("none");
			$(".guess-btn").attr("class","guess-btn over");
			me.voteSwiper.slideTo(me.voteItemList.length, 500, false);
		},
		// 距下轮投票开启
		voteBeforeCountdown: function(time) {
			var me = this;
			var beginTimeLong = timestamp(time);
			beginTimeLong += me.dec;
			$(".vote-countdown-tip").html('距下轮投票开启还有 ');
			$('.vote-detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
			me.voteRepeatCheck = true;
			me.voteCountType = 1;
			$(".guess-btn").attr("class","guess-btn waiting");
			me.vote_count_down();
			$(".vote-countdown").addClass("hide");
			$('.vote-countdown').removeClass('none');
		},
		// 距本轮投票结束倒计时
		voteNowCountdown: function(time, type){
			var me = this;
			var beginTimeLong = timestamp(time);
			beginTimeLong += me.dec;
			if(type == 1){
				$(".vote-countdown-tip").html('距竞猜结果揭晓还有 ');
			}else{
				$(".vote-countdown-tip").html('距本轮竞猜结束还有 ');
				$(".vote-countdown").addClass("hide");
			}
			$('.vote-detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
			me.voteRepeatCheck = true;
			me.voteCountType = 2;
			me.vote_count_down();
			$('.vote-countdown').removeClass('none');
		},
		// 距下轮竞猜开始还有
		voteLotteryCountdown: function(time){
			var me = this;
			var beginTimeLong = timestamp(time);
			beginTimeLong += me.dec;
			$(".vote-countdown-tip").html('距下轮竞猜开始还有 ');
			$('.vote-detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
			me.voteRepeatCheck = true;
			me.voteCountType = 3;
			me.vote_count_down();
			$('.vote-countdown').removeClass('none');
		},
		vote_count_down : function() {
			var me = this;
			$('.vote-detail-countdown').each(function() {
				$(this).countDown({
					etpl : '<label>%M%</label>' + ':' + '<label>%S%</label>' + '', // 还有...结束
					stpl : '<label>%M%</label>' + ':' + '<label>%S%</label>' + '', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(me.voteRepeatCheck) {
							me.voteRepeatCheck = false;
							$(".vote-countdown-tip").html("请稍后");
							$('.vote-detail-countdown').addClass("hidden");
							var nextTime = '';
							if(me.voteCountType == 1){
								var nextGuid = me.voteItemList[me.voteCurrentIndex].guid;
								//距下次投票开始倒计时结束后显示距离本轮投票结束倒计时
								me.isVote(me.voteCurrentIndex, nextGuid);
							}else if(me.voteCountType == 2){
								//距本轮投票结束倒计时结束后显示距离本轮抽奖结束倒计时
								var nextGuid = me.voteItemList[me.voteCurrentIndex].guid;
								me.isLottery(me.voteCurrentIndex, nextGuid);
							}else if(me.voteCountType == 3){
								//距本轮抽奖结束倒计时结束后显示距离下轮投票结束倒计时
								if(me.voteCurrentIndex == (me.voteItemList.length - 1)){
									me.voteEnd();
								}else{
									me.voteCurrentIndex ++;
									var nextGuid = me.voteItemList[me.voteCurrentIndex].guid;
									me.isVote(me.voteCurrentIndex, nextGuid);
								}
							}
						}
					},
					sdCallback :function(){
					}
				});
			});
		},
		isVote: function(i,uuid){
			var me = this;
			// 先在本地缓存判断
			var sta = localStorage.getItem("isvote-"+uuid);
			if(sta && sta != ""){
				//投过票
				me.voteItemStatus[i] = "voted";
				me.voteNowCountdown(me.voteItemList[i].get,1);
			}else{
				// 没投过票
				me.voteItemStatus[i] = "voteOk";
				me.voteNowCountdown(me.voteItemList[i].get,0);
			}
			$(".guess-btn").attr("class","guess-btn "+me.voteItemStatus[i]).removeClass("none");
			me.voteSwiper.slideTo(i, 500, false);
		},
		isLottery: function(i,uuid){
			var me = this;
			// 先在本地缓存判断
			var lotsta = localStorage.getItem("islottery-"+uuid);
			if(!lotsta || lotsta != "lotteryed"){
				// 没抽过奖
				// 判断是否投过票
				var stat = localStorage.getItem("isvote-"+uuid);
				if(stat && stat != ""){
					//投过票
					// 判断是否竞猜正确
					var pitems = me.voteItemList[i].pitems,isCorrect = false;
					for (var j = 0; j < pitems.length; j++){
						if(pitems[j].re == 1 && pitems[j].pid == stat){
							isCorrect = true;
						}
					}
					if(isCorrect){
						// 如果竞猜正确出现抽奖弹层
						$("#lottery-dialog").removeClass("none").attr("data-lottery-uid",uuid);
						setTimeout(function(){
							$(".vote-box").addClass("tada");
						},1000);
					}else{
						localStorage.setItem("islottery-"+uuid,"lotteryed");
						// 竞猜错误
						H.dialog.fail.open();
					}
				}
				// 判断是否是最后一轮
				if(i == (me.voteItemList.length - 1)){
					me.voteEnd();
					return;
				}
				me.voteItemStatus[i] = "over";
			}else{
				// 判断是否是最后一轮
				if(i == (me.voteItemList.length - 1)){
					me.voteEnd();
					return;
				}
				me.voteItemStatus[i] = "voted";
			}
			$(".guess-btn").attr("class","guess-btn "+me.voteItemStatus[i]).removeClass("none");
			me.voteLotteryCountdown(me.voteItemList[i].put);
		},
		initVoteNum: function () {
			var me = this;
			$.ajax({
				type : 'GET',
				async : false,
				url : domain_url + 'api/servicecount/getcount' + dev,
				data: {
					key: tongjiKey
				},
				dataType : "jsonp",
				jsonpCallback : 'callbackServiceCountGetHandler',
				timeout: 15000,
				complete: function() {
				},
				success : function(data) {
					if(data.result && data.c){
						if(data.c >= me.count){
							me.count = data.c;
							$(".num").text(me.count);
							$(".vote-num").removeClass("none");
						}
					}
				},
				error : function(xmlHttpRequest, error) {
				}
			});
		},
		getComments: function () {
			var me = this;
			$.ajax({
				type : 'GET',
				async : false,
				url : domain_url + 'api/comments/room' + dev,
				data: {
					ps: 50,
					maxid: me.maxid
				},
				dataType : "jsonp",
				jsonpCallback : 'callbackCommentsRoom',
				timeout: 15000,
				complete: function() {
				},
				success : function(data) {
					if(data.code == 0){
						var items = data.items;
						if(items && items.length > 0){
							me.maxid = data.maxid;
							for(var i = items.length-1; i >= 0; i--){
								if($.inArray(items[i].uid, me.selfCommentsList) < 0){
									me.commentsList.push(items[i]);
								}
							}
						}
					}
				},
				error : function(xmlHttpRequest, error) {
				}
			});
		},
		getZDComments: function () {
			var me = this;
			$.ajax({
				type : 'GET',
				async : false,
				url : domain_url + 'api/comments/list' + dev,
				data: {
					page: 1,
					ps: 50,
					zd: 1
				},
				dataType : "jsonp",
				jsonpCallback : 'callbackCommentsList',
				timeout: 15000,
				complete: function() {
				},
				success : function(data) {
					if(data.code == 0){
						var items = data.items;
						if(items && items.length > 0){
							for(var i = 0; i < items.length; i++){
								me.ZDcommentsList.push(items[i]);
							}
							setInterval(function(){
								if(me.commentsList.length > 0){
									var i = getRandomArbitrary(0,items.length);
									me.commentsList.push(me.ZDcommentsList[i]);
								}
							},8000);
						}
					}
				},
				error : function(xmlHttpRequest, error) {
				}
			});
		},
		showComments: function () {
			var me = this;
			setInterval(function () {
				if(me.commentsList.length > 0){
					var t = new simpleTpl();
					var cls = getRandomArbitrary(0,5);
					var cmt = me.commentsList.shift();
					t._('<li><div class="'+me.clsList[cls]+'"><span class="ni">' + filterXSS(cmt.na) + '：</span><span class="con">' + filterXSS(cmt.co) + '</span></div></li>');
					$("#comments_content").append(t.toString());
					var n = $("#comments_content").find("li").length;
					if(n >= me.commentsMaxNum){
						$("#comments_content").find("li").first().remove();
					}
				}
			},500);
		}
	};
	W.callbackServiceCountIncrHandler = function (data) {};

})(Zepto);
$(function(){
	H.vote.init();
});