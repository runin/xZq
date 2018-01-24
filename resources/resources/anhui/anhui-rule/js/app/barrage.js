(function($) {
	H.barrage = {
		tid: '',
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		$total: $('#total'),
		$btnFunny: $('.funny-box img'),
		REQUEST_CLS: 'requesting',
		init: function() {
			this.loadImg();
			this.topic();
			this.event();
			this.updatepv();
			this.jump();
		},
		loadImg: function(){
			var imgs = [
				"images/funny/funny1.png",
				"images/funny/funny2.png",
				"images/funny/funny3.png",
				"images/barrage-top.png",
				"images/barrage-game.png"
			];
			loadImg = function () {
				for (var i = 0; i < imgs.length; i++) {//图片预加载
					var img = new Image();
					img.style = "display:none";
					img.src = imgs[i];
					img.onload = function () {
						$("body").animate({'opacity':'1'}, 100);
					}
				}

			};
			loadImg();
            setTimeout(function(){
                H.utils.resize();
            },2000);

		},
		jump: function(){
			getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
		},
		updatepv: function() {
			getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
			setInterval(function() {
				getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
			}, 5000);
		},
		topic:function(){
			getResult("api/comments/topic/round",{},"callbackCommentsTopicInfo",true);
		},
		event: function() {
			var me = this;
			
			this.$btnCmt.click(function(e) {
				e.preventDefault();

				if ($(this).hasClass(me.REQUEST_CLS)) {
					return;
				}
				var comment = $.trim(me.$inputCmt.val()) || '',
					comment = comment.replace(/<[^>]+>/g, ''),
					len = comment.length;

				if (len < 1) {
					showTips('请先说点什么吧');
					me.$inputCmt.focus();
					return;
				} else if (len > 15) {
					showTips('字数超出了20字');
					me.$inputCmt.focus();
					return;
				}

				$(this).addClass(me.REQUEST_CLS);

				shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'comments/save'+dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: me.tid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(shaketv_appid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        me.$btnCmt.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
							showTips('发射成功');
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
							barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment">'+comment+'</div></div>');
							$('.isme').parent('div').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
						showTips("评论失败");
			}
                });

			});

			this.$btnFunny.click(function(e) {
				e.preventDefault();
				if ($(this).hasClass(me.REQUEST_CLS)) {
					return;
				}
				$(this).addClass(me.REQUEST_CLS);
				var funny = $(this).attr('data-item') || '/:funny1';
				shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'comments/save'+dev,
                    data: {
                        co: encodeURIComponent(funny),
                        op: openid,
                        tid: me.tid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(shaketv_appid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        me.$btnFunny.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
							showTips('发射成功');
                            var nfunny = funny.replace('/:','');
							var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
							barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="funnyshow"><img src="./images/funny/' + nfunny + '.png" border="0" /></div>');
							//$('.isme').parent('div').addClass('me');
			                return;
                        }
						showTips("评论失败");
                    }
                });
			});
			$("#game-go").click(function(e){
				e.preventDefault();
				toUrl("game.html");
			});
		}
		
	};

	W.callbackCommentsTopicInfo = function(data){
		if(data.code == 0){
			var item = data.items[0];
			H.barrage.tid = item.uid;
		}
	};
	
	// 弹幕_S
	H.comment = {
		timer: 5000,
		maxid: 0,
		pageSize: 10,
		$comments: $('#comments'),
		init: function() {
			var me = this;
			W['barrage'] = this.$comments.barrage();
			setTimeout(function(){
				W['barrage'].start(1);
				setInterval(function() {
					me.flash();
				}, me.timer);
			}, 1000);
		},

		flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'comments/room'+dev,
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
                    if (data.code != 0) {
                        return;
                    }
                    me.maxid = data.maxid;
                    var items = data.items || [], umoReg = '/:';
                    for (var i = 0, len = items.length; i < len; i ++) {
                    	if ((items[i].co).indexOf(umoReg) >= 0) {
                    		var funny = items[i].co;
                    		var nfunny = funny.replace('/:','');
			                barrage.appendMsg('<div class="c_head_img"><img class="c_head_img_img" src="' + (items[i].hu ? (items[i].hu + "/" + yao_avatar_size) : "./images/danmu-head.jpg") + '" /></div>'+'<div class="funnyshow"><img src="./images/funny/' + nfunny + '.png" border="0" /></div>');
						} else {
                    		barrage.pushMsg("<div class='c_head_img'><img class='c_head_img_img' src='" + (items[i].hu ? (items[i].hu + '/' + yao_avatar_size) : './images/danmu-head.jpg') + " '/></div><div class='comment'>"+items[i].co+"</div>");
                    	};
                    }
                }
            });
        }
	};
	// 弹幕_E
	
	H.utils = {
		$header: $('header'),
		$wrapper: $('#article'),
		$comments: $('#comments'),
		$ctrls: $('#ctrls'),
		resize: function() {
			var zwinH = $(window).height(),
				headerH = this.$header.height() + 30,
				ctrlshH = this.$ctrls.height(),
				barrageH = 0;
			barrageH = zwinH - headerH - ctrlshH;
			this.$comments.css({
				'height': Math.round(barrageH)
			});
			this.$wrapper.css({
				'height': Math.round(barrageH)
			}).removeClass("none");

			$('body').css('height', zwinH);
			$(".head_img").attr("src",headimgurl+ '/' + yao_avatar_size||"images/danmu-head.jpg");
            H.comment.init();
		}	
	};
	
	W.callbackCountServicePvHander = function(data) {
		if (data.code == 0) {
			H.barrage.$total.text(data.c);
		}
	};

	W.commonApiPromotionHandler = function(data){
		if (data.code == 0 && data.desc && data.url) {
			$('.ddtj').text(data.desc || '');
			$("#ddtj").tap(function(){
				shownewLoading();
				location.href = data.url;
			});
			$('#ddtj').removeClass("visibility");
		} else {
			$('#ddtj').remove();
		}
	};
	
})(Zepto);


;(function($) {
	H.lottery = {
		dec: 0,
		type: 2,
		index: 0,
		endType: 1,
		pal: null,
		nowTime: null,
		pingFlag: null,
		roundData: null,
		nextPrizeAct: null,
		canJump: true,
		safeFlag: false,
		lastRound: false,
		isTimeOver: false,
		repeat_load: true,
		crossLotteryFlag: false,    //跨天摇奖倒计时标识  true为有跨天摇奖 false为没有跨天摇奖
		crossLotteryCanCallback: false,
		$lotteryCountdown: $("#lottery-countdown"),
		init: function() {
			this.event();
			this.lotteryRound_port();
		},
		event: function() {
			var me = this;
            me.$lotteryCountdown.click(function(e){
                e.preventDefault();
                if($(this).find(".countdown-tip").html() == "距离摇奖结束还有"){
                    toUrl('yao.html');
                }
            });
		},
		btn_animate: function(str,calback){
			str.addClass('flipInY');
			setTimeout(function(){
				str.removeClass('flipInY');
			},150);
		},
		ping: function() {
			var me = this;
			$.ajax({
				type: 'GET',
				async: false,
				url: domain_url + 'api/common/time' + dev,
				data: {},
				dataType: "jsonp",
				jsonpCallback: 'commonApiTimeHandler',
				timeout: 10000,
				complete: function() {
				},
				success: function(data) {
					if(data.t){
						me.safeLotteryMode('off');
					}
				},
				error: function(xmlHttpRequest, error) {
				}
			});
		},
		checkPing: function() {
			var me = this, delay = Math.ceil(60000*2*Math.random() + 60000*1);
			me.pingFlag = setTimeout(function(){
				clearTimeout(me.pingFlag);
				me.ping();
				me.checkPing();
			}, delay);
		},
		lotteryRound_port: function() {
			var me = this;
			shownewLoading();
			$.ajax({
				type: 'GET',
				async: false,
				url: domain_url + 'api/lottery/round' + dev,
				data: {},
				dataType: "jsonp",
				jsonpCallback: 'callbackLotteryRoundHandler',
				timeout: 10000,
				complete: function() {
				},
				success: function(data) {
					if(data.result == true){
						me.nowTime = timeTransform(data.sctm);
						var nowTimeStemp = new Date().getTime();
						me.dec = nowTimeStemp - data.sctm;
						me.roundData = data;
						me.currentPrizeAct(data);
					}else{
						if(me.repeat_load){
							me.repeat_load = false;
							setTimeout(function(){
								me.lotteryRound_port();
							},500);
						}else{
							me.change();
						}
					}
				},
				error: function(xmlHttpRequest, error) {
					me.safeLotteryMode('on');
				}
			});
		},
		safeLotteryMode: function(flag) {
			var me = this;
			if (flag == 'on') {//抽奖轮次接口出错
				me.checkPing();
				me.$lotteryCountdown.addClass('none');
				$('.fail-tips').removeClass('none');
				me.safeFlag = true;
			} else if (flag == 'off') {
				clearTimeout(me.pingFlag);
				me.pingFlag = null;
				me.lotteryRound_port();
				me.$lotteryCountdown.removeClass('none');
				$('.fail-tips').addClass('none');
				me.safeFlag = false;
			} else {
				me.safeLotteryMode('off');
			};
			hidenewLoading();
		},
		currentPrizeAct:function(data){
			//获取抽奖活动
			var me = this, nowTimeStr = this.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [], day = nowTimeStr.split(" ")[0];
			// 判断是否为跨天摇奖 配置文件中crossdayLimit跨天摇奖阀值，默认2h
			var lastLotteryEtime = prizeActListAll[prizeActListAll.length - 1].pd + ' ' + prizeActListAll[prizeActListAll.length - 1].et;
			var lastLotteryNtime = prizeActListAll[prizeActListAll.length - 1].nst;
			var crossDay = timeTransform(new Date().setDate(new Date(lastLotteryEtime).getDate() + 1)).split(" ")[0];
			var minCrossDay = crossDay + ' 00:00:00';
			var maxCrossDay = timeTransform(new Date(minCrossDay).getTime() + crossdayLimit);
			if(comptime(lastLotteryNtime, minCrossDay) <= 0 && comptime(lastLotteryNtime, maxCrossDay) >= 0) {
				me.crossLotteryFlag = true;
			} else {
				me.crossLotteryFlag = false;
			}

			if(prizeActListAll&&prizeActListAll.length>0){
				for ( var i = 0; i < prizeActListAll.length; i++) {
					if(prizeActListAll[i].pd == day){
						prizeActList.push(prizeActListAll[i]);
					}
				}
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
						me.change();
					}
					return;
				}
				//如果第一轮未开始
				if(comptime(prizeActList[0].pd + " " + prizeActList[0].st,nowTimeStr) < 0){
					me.beforeCountdown(prizeActList[0]);
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
				me.safeLotteryMode('on');
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
			me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
			me.$lotteryCountdown.find(".countdown-tip").html('距离摇奖开始还有');
			me.count_down();
			me.$lotteryCountdown.removeClass('none');
			hidenewLoading();
		},
		// 摇奖结束倒计时
		nowCountdown: function(prizeActList){
			var me = this;
			me.type = 2;
			var endTimeStr = prizeActList.pd+" "+prizeActList.et;
			var beginTimeLong = timestamp(endTimeStr);
			beginTimeLong += me.dec;
			me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
			me.$lotteryCountdown.find(".countdown-tip").html("距离摇奖结束还有");
			me.count_down();
			me.$lotteryCountdown.removeClass('none');
			me.index++;
			me.canJump = true;
			hidenewLoading();
			if(getQueryString('markJump') == "yaoClick"){
				return;
			}
			toUrl("yao.html");
		},
		// 跨天摇奖开启倒计时
		crossCountdown: function(nextTime) {
			var me = this;
			me.crossLotteryFlag = false;
			me.crossLotteryCanCallback = true;
			me.type = 1;
			var beginTimeLong = timestamp(nextTime);
			beginTimeLong += me.dec;
			me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
			me.$lotteryCountdown.find(".countdown-tip").html('距离摇奖开始还有');
			me.count_down();
			me.$lotteryCountdown.removeClass('none');
			hidenewLoading();
		},
		count_down: function() {
			var me = this;
			me.$lotteryCountdown.find('.detail-countdown').each(function() {
				$(this).countDown({
					etpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...结束
					stpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...开始
					sdtpl: '',
					otpl: '',
					otCallback: function() {
						if(me.canJump){
							if (me.crossLotteryCanCallback) {
								if(!me.isTimeOver){
									var delay = Math.ceil(1000*Math.random() + 500);
									me.isTimeOver = true;
									me.crossLotteryCanCallback = false;
									me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
									shownewLoading(null, '请稍后...');
									setTimeout(function(){
										me.lotteryRound_port();
									}, delay);
								}
							} else {
								if(me.type == 1){
									//距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
									if(!me.isTimeOver){
										me.isTimeOver = true;
										me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
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
												shownewLoading(null,'请稍后...');
												setTimeout(function() {
													me.crossCountdown(me.pal[me.pal.length - 1].nst);
												}, 1000);
											} else {
												me.type = 3;
												me.change();
											}
											return;
										}
										me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
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
												me.change();
											}
										},1000);
									}
								}
							}
						}else{
							me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
						}
					},
					sdCallback: function(){
						me.isTimeOver = false;
					}
				});
			});
		},
		change: function() {
			var me = H.lottery;
			me.$lotteryCountdown.removeClass('none').find(".countdown-tip").html('本期摇奖已结束！');
			me.$lotteryCountdown.find('.detail-countdown').html("");
			hidenewLoading();
		}
	};
})(Zepto);
var crossdayLimit = 2 * 60 * 60 * 1000;	//跨天摇奖判断阀值，默认为2小时。单位ms
$(function() {
	H.barrage.init();
	H.lottery.init();
});