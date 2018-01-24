/**
 *评论抽奖页
 */
(function($) {
	H.comments = {
		$main : $('#main'),
		commActUid:null,
		now_time : null,
		expires: {expires: 7},
		request_cls: 'requesting',
		check: null,
		lotteryCount:0,
		beginflag : true,
		endflag : true,
		init : function(){
			var me = this;
			me.countLottery();
			me.event_handler();
		},
		event_handler: function() {
			var me = this;

			$(".rule").click(function(e){
				e.preventDefault();
				H.dialog.rule.open();
			});
		
			$(".gift-list").click(function(e){
				e.preventDefault();
				toUrl("gift.html");
			});
			$("#lottery-time").click(function(e){
				e.preventDefault();
				H.comments.award();
			});

		},
		countLottery :function(){
			getResult('api/lottery/leftLotteryCount',{oi:openid} ,'callbackLotteryleftLotteryCountHandler',true);
		},
		current_time: function(){
			  getResult('api/lottery/round',{} ,'callbackLotteryRoundHandler',true);
		},
		currentPrizeAct:function(data){
			//获取抽奖活动
			var prizeActList = data.la,
				prizeLength = prizeActList.length,
				nowTimeStr = timeTransform(data.sctm),
				me = this,
				$lottery_time_tips = $(".time-tips");
			//最后一轮结束
			if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr)>= 0){
				$('.page-a').addClass('none');
				$('.page-b').removeClass('none');
				$lottery_time_tips.html('今日抽奖已结束，明天再来吧');
				return;
			}
			//最后一轮未结束但是抽奖次数为0
			if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].st,nowTimeStr) >= 0&&comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr)<= 0&&H.comments.lotteryCount<=0){
				$('.page-a').addClass('none');
				$('.page-b').removeClass('none');
				$lottery_time_tips.html('今日抽奖已结束,明天再来吧');
				return;
			}
			for ( var i = 0; i < prizeActList.length; i++) {
				var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
				var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
				//抽奖未开启
				if(comptime(nowTimeStr, beginTimeStr) >= 0){
					$lottery_time_tips.html('距离下次抽奖开始还有：');
					var beginTimeLong = timestamp(beginTimeStr);
					var nowTime = Date.parse(new Date())/1000;
					var serverTime = timestamp(nowTimeStr);
					if(nowTime > serverTime){
						beginTimeLong += (nowTime - serverTime);
					}else if(nowTime < serverTime){
						beginTimeLong -= (serverTime - nowTime);
					}
					$('.detail-countdown').removeClass("none").attr('etime',beginTimeLong);
					$('.page-a').addClass('none');
					$('.page-b').removeClass('none');
					H.comments.begin_count_down();
					return;
				//如果抽奖开启
				}else if( comptime(nowTimeStr, endTimeStr) > 0&&comptime(nowTimeStr, beginTimeStr) < 0&&H.comments.lotteryCount>0){
					var endTimeLong = timestamp(endTimeStr);
					var nowTime = Date.parse(new Date())/1000;
					var serverTime = timestamp(nowTimeStr);
					if(nowTime > serverTime){
						endTimeLong += (nowTime - serverTime);
					}else if(nowTime < serverTime){
						endTimeLong -= (serverTime - nowTime);
					}
					$('.end-detail-countdown').removeClass("none").attr('etime',endTimeLong);
					$('.page-b').addClass('none');
					$('.page-a').removeClass('none');
					H.comments.end_count_down();
					$(".end-time-tips").html('距离抽奖结束还有：');
					return;
				}
			}
		},
		// 倒计时
		begin_count_down : function() {
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.comments.beginflag){
							H.comments.beginflag = false;
							$(".time-tips").html('抽奖开启');
							setTimeout(function(){								
								H.comments.countLottery();
							},2000)
						}
					},
					sdCallback :function(){
					}
				});
			});
		},
		// 倒计时
		end_count_down : function() {
			$('.end-detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.comments.endflag){
							H.comments.endflag = false;
							$(".end-time-tips").html('本轮抽奖结束');
							setTimeout(function(){
								H.comments.countLottery();
							},2000)
							
						}
					},
					sdCallback :function(){
					}
				});
			});
		},
		award :function(){
        	shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: { oi: openid},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    H.dialog.lottery.open();
                    H.dialog.lottery.update(data);
                },
                error : function() {
                    H.dialog.lottery.open();
                    H.dialog.lottery.update(data);
                }
            });
        }
	};

	W.callbackLotteryleftLotteryCountHandler = function(data){
		if(data.result == true){
			H.comments.lotteryCount = data.lc;
			H.comments.current_time();
		}else{
			$('.page-b').addClass('none');
			$('.page-a').removeClass('none');
			$("#lottery-tip").html("活动尚未开始,敬请期待");
		}
	};
	W.callbackLotteryRoundHandler = function(data){
		if(data.result == true){
			H.comments.currentPrizeAct(data);
		}else{
			$('.page-a').addClass('none');
			$('.page-b').removeClass('none');
			$("#lottery-tip").html("活动尚未开始,敬请期待");
		}
	};
})(Zepto);
$(function(){
	H.comments.init();
});