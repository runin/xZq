$(function() {

	(function($) {

		H.index = {
			points : {},
			cover : $("#cover"),
			main : $("#main"),
			btnEnter : $("#btn_enter"),
			btnShare : $("#share_open"),
			countDown : $("#countDown"),
			topicDetail : $("#topic_detail"),
			commentList : $("#comment_list"),
			commentCount : $("#comment_count"),
			percent : $("#percent"),
			win: $("#point_win"),
			submit: $("#input_submit"),
			input: $("#input_text"),
			share: $("#share_wrapper"),
			redDot: $("#comment_red_dot"),
			submitTips: $("#submit_tips"),

			init : function() {
				H.utils.resize();
				showLoading();
				if (openid) {
					getResult('debate/info', {
						op : openid
					}, 'callbackDebateInfo');
					getResult('debate/transcript', {
						op : openid
					}, 'callbackDebateTranscript');
				}
			},
			initDebate : function(data) {
				$.fn.cookie("myPoint", data.su);
				$.fn.cookie("defaultPoint", data.uid);

				this.initBtns(data);
				this.initPoint(data);
				this.initTopic(data);
				this.initComment(data);
				this.initCommentInput();
				this.saveCookies(data);
			},
			initBtns : function(data) {
				// 进入讨论
				this.btnEnter.click(function() {
					H.index.cover.addClass('fade');
					setTimeout(function() {
						H.index.cover.addClass('none');
						check_nickname();
					}, 2000);
					H.index.main.removeClass('none');
				}).removeClass("none");

				// 快来支持我
				this.btnShare.click(function() {
					H.index.share.removeClass("none");
					H.index.main.addClass("blur");
				});
				
				// 关闭分享
				this.share.click(function(){
					H.index.share.addClass("none");
					H.index.main.removeClass("blur");
				});
				
				// 禁止滚动
				this.share.bind("touchmove",function() {
					return false;
				});


				// 键盘弹出后设置为absolute，防止错位
				this.input.focus(function(){
					$("footer").css("position","absolute");
				});

				this.input.blur(function(){
					$("footer").css("position","fixed");
				});

			},
			initTopic : function(data) {
				this.topicDetail.attr("src", data.img).attr("alt", data.t);
				
				// 如果结果已经公布，则红点提示
				if(($.fn.cookie("lastRedDotTime") < timestamp(data.put)) && data.su && data.wp){
					$.fn.cookie("hasRedDot","true");
				}
				
				if(data.wp){
					// 如果结果已经公布，显示胜出图片
					this.win.removeClass("none").find("img[puid=C"+data.wp+"]").removeClass('none');
				}else{
					// 如果结果未公布，则到公布的时候自动拉取结果
					var current = timestamp(data.cut);
					var publish = timestamp(data.put);
					if(publish > current){
						setTimeout(function(){
							getResult('debate/winpoint/' + $.fn.cookie("defaultPoint"), {}, 'callbackDebateWinpoint');
						},publish - current);
					}
					
				}


			},
			initPoint : function(data) {
				var totalNum = 0;
				// 初始化两个观点
				for ( var i in data.items) {
					if ($("#point" + i).length > 0) {
						$("#point" + i).find(".point-btn").attr("puid",
								data.items[i].uid).attr("supportPuid","C" + data.items[i].uid)
								.text(data.items[i].t);
						
						$("#point" + i).find(".point-slogon").text(
								data.items[i].d);
						
						if ($.fn.cookie("myPoint") == data.items[i].uid) {
							$("#point" + i).addClass('supported');
						}
						
						this.points[data.items[i].uid] = {
							name : $("#point" + i).attr("name"),
							color : $("#point" + i).attr("color")
						}
						
						$("#point_win" + i).attr("puid",
								"C"+data.items[i].uid);
					}
					totalNum += data.items[i].s;
				}
				
				// 初始化中立观点
				this.points[data.uid] = {
					name : "中立",
					color : "FFFFFF"
				}

				// 初始化观点数字
				for ( var i in data.items) {
					if ($("#bar" + i).length > 0 && $("#num" + i).length > 0) {
						var percent = Math.floor(data.items[i].s / totalNum * 100) - 1;
						if(percent < 1){
							percent = 1;
						}
						$("#bar" + i).attr("barpuid","C"+data.items[i].uid).css('width',
								percent + "%");
						$("#num" + i).attr("numpuid","C"+data.items[i].uid).text(data.items[i].s);
					}
				}

				// 根据时间状态绑定投票按钮
				switch (this.getTimeStatus(data)) {
				case 'toStart':
					$(".point-btn").addClass('invalid');
					$(".point-btn").click(function() {
						alert("辩论赛还没开始哦！");
					});
					this.countDown.text("辩论赛还没开始哦");
					break;
				case 'finished':
					$(".point-btn").addClass('invalid');
					$(".point-btn").click(function() {
						alert("辩论赛已经结束了！");
					});
					this.countDown.text("辩论赛已经结束了");
					// 已经结束则显示双方票数
					this.percent.removeClass("none");
					break;
				default:
					if (!$(".point-btn").parent().parent()
							.hasClass("supported")) {
						$(".point-btn").click(function() {
							getResult('debate/support', {
								op : openid,
								puid : $(this).attr('puid')
							}, 'callbackDebateSupport');
						});
					}
					this.initCountDown(data);
				}

				// 已经投票则显示双方票数
				if ($.fn.cookie("myPoint")) {
					this.percent.removeClass("none");
				}
				
				// 拉取实时支持数
				getResult('debate/point', {}, 'callbackDebatePoint');
			},
			initComment : function(data) {
				var anys = "";
				for ( var i in data.items) {
					anys += data.items[i].uid + ";";
				}
				anys = anys + data.uid;
				$.fn.cookie("anys", anys);
				getResult('comments/last', {
					"anys" : anys
				}, 'callbackCommentsLast');
				getResult('comments/count', {
					"anys" : anys
				}, 'callbackCommentsCount');
			},
			initCommentInput: function(){
				this.submit.click(function(){
					if($.trim(H.index.input.val()).length == 0){
						return false;
					}else if($.trim(H.index.input.val()).length > 100){
						alert("评论字数不能超过100个字哦");
						return false;
					}
					
					showLoading();
					getResult('comments/save',{
						'co' : encodeURIComponent(H.index.input.val()),
						'op' : openid,
						'tid': $.fn.cookie("myPoint") ? $.fn.cookie("myPoint") : $.fn.cookie("defaultPoint") ,
						'ty': 4,
						'pa':'',
						'ns':'',
						'na':1,
						'nickname': ($.fn.cookie(shaketv_appid + '_nickname') && $.fn.cookie(shaketv_appid + '_nickname') != "null") ? encodeURIComponent($.fn.cookie(shaketv_appid + '_nickname')) : "",
						'headimgurl': ($.fn.cookie(shaketv_appid + '_headimgurl') && $.fn.cookie(shaketv_appid + '_headimgurl') != "null") ? $.fn.cookie(shaketv_appid + '_headimgurl') : ""
					}, 'callbackCommentsSave');
				});
			},
			afterSubmit: function(){
				this.input.val("");
				this.submitTips.removeClass("show");
				setTimeout(function(){
					H.index.submitTips.addClass("show");
				},0);
			},
			saveCookies : function(data) {
				for ( var i in this.points) {
						$.fn.cookie("point_" + i + "_color",
								this.points[i].color);
						$.fn.cookie("point_" + i + "_name",
								this.points[i].name);
				}
			},

			getTimeStatus : function(data) {
				var start = timestamp(data.pst);
				var end = timestamp(data.pet);
				var current = timestamp(data.cut);
				if (start > current) {
					return "toStart";
				} else if (end < current) {
					return "finished";
				} else {
					return "inProgress";
				}
			},
			
			initCommentList : function(data) {
				var comments = "";
				for ( var i in data.items) {
					comments += "<li style=color:#"
							+ this.points[data.items[i].tid].color + ">"
							+ '<p class="point-tips">('
							+ this.points[data.items[i].tid].name + ')</p>'
							+ '<p class="point-comment">' + data.items[i].co
							+ '</p>' + '</li>';
				}
				this.commentList.html(comments);
				
				H.index.updateCommentListTop("true",100);
			},
			
			updateCommentListTop: function(isInit,timeOut){
				var timeOut = timeOut;
				var top = H.index.commentList.css("top");
				var listHeight = parseInt($("#comment_list").height());
				if(listHeight > 0){
					if(isInit == "true"){
						timeOut = 3000;
						H.index.commentList.css("top",-1 * (listHeight - 280) + "px");
						isInit = "false";
					}else if(parseInt(top,10) >= 0){
						return;
					}else{
						H.index.commentList.css("top",parseInt(top,10) + 28 + "px").addClass("animate");
					}
				}
				setTimeout(function(){
					H.index.updateCommentListTop(isInit, timeOut);
				},timeOut);
			},
			
			updateTotalComment : function(data) {
				if(data.tc != 0){
					this.commentCount.text(data.tc + "人激烈辩论中");
					var defaultPoint = $.fn.cookie("defaultPoint");
					if(!$.fn.cookie("reddot_debate_" + defaultPoint)){
						this.redDot.removeClass("none");
					}
				}else{
					this.commentCount.text("点击查看所有辩论");
				}
				
			},
			
			updateSupport : function(data) {
				$(".point-inner-wrapper").find(
						"[supportPuid=C"+data.puid+"]").parent()
						.parent().addClass("supported");
				this.percent.removeClass("none");
				$.fn.cookie("myPoint",data.puid);
			},
			
			initCountDown : function(data) {
				var result = timestamp(data.put);
				var current = timestamp(data.cut);
				var timeLeft = (result - current) / 1000;
				var text = "";
				if (timeLeft > 3600) {
					text = Math.floor(timeLeft / 3600) + "小时后揭晓结果";
				} else if (timeLeft > 60) {
					text = Math.floor(timeLeft / 60) + "分钟后揭晓结果";
				} else {
					text = timeLeft + "秒后揭晓结果"
				}
				this.countDown.text(text);
			},
			
			updatePoints: function(data){
				var total = 0;
				for(var i in data.items){
					if(this.percent.find("[barpuid=C"+data.items[i].uid+"]")){
						total += data.items[i].s;
					}
				}
				
				for(var i in data.items){
					var percent = Math.floor(data.items[i].s / total * 100) - 1;
					if(percent < 1){
						percent = 1;
					}
					this.percent.find("[barpuid=C"+data.items[i].uid+"]")
						.css('width',percent + "%");
					
					this.percent.find("[numpuid=C"+data.items[i].uid+"]")
						.text(data.items[i].s);
				}
				
				// 拉取实时支持数
				setTimeout(function(){
					getResult('debate/point', {}, 'callbackDebatePoint');
				}, 5000);
			},

			updateResult: function(data){
				this.win.removeClass("none").find("img[puid=C"+data.wp+"]").removeClass('none');
				this.percent.removeClass("none");
				this.countDown.text("辩论赛结果已公布");
			}
		};

		H.zhanji = {
			lotteryCount: 0,
			dialog : $("#zhanji_dialog"),
			btnZhanjiOpen : $("#zhanji_open"),
			btnZhanjiClose : $("#zhanji_close"),
			redDot: $("#zhanji_red_dot"),
			$slogon : $("#dialog_slogon"),
			$tips : $("#lottery-tips"),
			$lotteryBtn : $("#lottery-btn"),
			$numWin : $("#debate_win"),
			$numJoin : $("#debate_join"),
			$percentWin : $("#debate_percent"),
			$score : $("#debate_score"),
			$rank : $("#debate_rank"),
			requestCount: 0,
			
			init : function(data) {
				this.requestCount ++;
				this.lotteryCount = data.lc;
				this.$tips.text("您一共还有" + this.lotteryCount + "次抽奖机会");
				this.$numWin.text(data.hc);
				this.$numJoin.text(data.gc);
				if (data.gc > 0) {
					this.$percentWin.text(Math.floor(data.hc / data.gc * 100) + "%");
				}
				this.$score.text("您现在的积分为" + data.iv + "分");
				if (parseInt(data.iv, 10) > 0 && parseInt(data.rank, 10)) {
					this.$rank.text("您的排名是第" + data.rank + "名！");
				} else {
					this.$rank.text("暂无排名");
				}

				if(this.requestCount >= 1){
					// 查看战绩
					this.btnZhanjiOpen.click(function() {
						H.zhanji.dialog.removeClass('none').bind("touchmove",
								function() {
									return false;
								});
						
						if(H.zhanji.lotteryCount == 0){
							H.zhanji.redDot.addClass("none");
						}
						
						var now = new Date();
						$.fn.cookie("hasRedDot","false");
						$.fn.cookie("lastRedDotTime",now.getTime()); 

						showLoading();
						getResult('debate/transcript', {
							op : openid
						}, 'callbackDebateTranscript');
					});

					// 关闭战绩
					this.btnZhanjiClose.click(function() {
						H.zhanji.dialog.addClass('none');
					});
				}
				
				
				// 立即抽奖
				if (this.lotteryCount > 0) {
					this.$lotteryBtn.removeClass("none");
				}
				

				// 显示红点
				if (this.lotteryCount > 0 || $.fn.cookie("hasRedDot") == "true" ){
					this.redDot.removeClass("none");
				}

			}

		};

		H.utils = {
			$cover : $("#cover"),
			resize : function() {
				var height = $(window).height();
				this.$cover.css("height", height).removeClass("none");
			}
		};

		/** 辩论赛基本信息* */
		W.callbackDebateInfo = function(data) {
			hideLoading();
			if (data.code == 0) {
				H.index.initDebate(data);
			} else {
				alert(data.message);
			}
		};

		/** 战绩榜信息* */
		W.callbackDebateTranscript = function(data) {
			hideLoading();
			if (data.code == 0) {
				H.zhanji.init(data);
			}else{
				alert(data.message);
			}
		};

		/** 赞同观点* */
		W.callbackDebateSupport = function(data) {
			if (data.code == 0) {
				H.index.updateSupport(data);
			} else {
				alert(data.message);
			}
		};

		/** 拉取首页评论* */
		W.callbackCommentsLast = function(data) {
			if (data.code == 0) {
				H.index.initCommentList(data);
			}
		};

		/** 拉取评论总数* */
		W.callbackCommentsCount = function(data) {
			if (data.code == 0) {
				H.index.updateTotalComment(data);
			}
		};
		
		/** 发表评论* */
		W.callbackCommentsSave = function(data){
			hideLoading();
			if(data.code == 0){
				H.index.afterSubmit();
			}else{
				alert(data.message);
			}
		};
		
		/** 实时拉取观点支持数 **/
		W.callbackDebatePoint = function(data){
			if(data.code == 0){
				H.index.updatePoints(data);
			}
		};

		/** 到时间拉取胜利观点 **/
		W.callbackDebateWinpoint = function(data){
			if(data.code ==0){
				H.index.updateResult(data);
			}
		}
	})(Zepto);

	H.index.init();
});
