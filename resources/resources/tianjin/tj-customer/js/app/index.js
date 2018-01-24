/**
 *评论抽奖页
 */
(function($) {
	H.comments = {
		$main : $('#main'),
		commActUid:null,
		now_time : null,
		expires: {expires: 7},
		check: null,
		init : function(){
			var me = this;
			me.current_time();
			me.event_handler();
			
		},
		event_handler: function() {
			var me = this;
			
			$("#rule").click(function(e){
				e.preventDefault();
				H.dialog.rule.open();
			});
			$("#btn-baoliao").click(function(e){
				e.preventDefault();
				toUrl("baoliao.html");
			});
			$("#gift-list").click(function(e){
				e.preventDefault();
				toUrl("gift.html");
			});
			$("#lottery-time").click(function(e){
				e.preventDefault();
				$.fn.cookie("current_act",H.comments.actUid,{expires:1});
				if(!openid){
					H.dialog.lottery.open();
					H.dialog.lottery.update();
					return;
				}
				getResult('tjexpress/lottery', {openid:openid,actUid:H.comments.actUid}, 'expressLotteryHandler',true);
				
			});
		},
		current_time: function(){
			getResult('tjexpress/lotteryactivity', {}, 'expressLotteryActivityHandler',true);
		},
		currentPrizeAct:function(data){
			//获取抽奖活动
			var prizeActList = data.activity,
				prizeLength = data.activity.length,
				nowTimeStr = data.tm,
				me = this,
				$lottery_time_tips = $(".time-tips");
			H.comments.now_time = data.tm;
			var cur_cookie = $.fn.cookie("current_act");

	        if(comptime(prizeActList[prizeLength-1].ap+" "+prizeActList[prizeLength-1].ae,nowTimeStr) >= 0 || cur_cookie == prizeActList[prizeLength-1].au){
				$("#lottery-time").addClass("none");
				$lottery_time_tips.html('今日抽奖已结束，明天再来吧');
				return;
	        }
			for ( var i = 0; i < prizeActList.length; i++) {
				var beginTimeStr = prizeActList[i].ap+" "+prizeActList[i].ab;
				var endTimeStr = prizeActList[i].ap+" "+prizeActList[i].ae;
				H.comments.actUid = prizeActList[i].au;
				if(comptime(nowTimeStr, beginTimeStr) > 0){
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
					$('#lottery-time').addClass('none');
					H.comments.count_down();
					return;
				}else if( comptime(nowTimeStr, endTimeStr) > 0 && cur_cookie != prizeActList[i].au){
					$("#lottery-tip").addClass("none");
					$("#lottery-time").removeAttr('disabled').removeClass('none');
					return;
				}
			}
		},
		// 倒计时
		count_down : function() {
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						$('#lottery-time').removeClass('none');
						$('#lottery-tip').addClass("none");
					},
					sdCallback :function(){
					}
				});
			});
		}
	};

	
	W.expressLotteryActivityHandler = function(data){
		if(data.code == 0){
			H.comments.currentPrizeAct(data);
		}
	};
	
	W.expressLotteryHandler = function(data){
			H.dialog.lottery.open();
			H.dialog.lottery.update(data);
	};
})(Zepto);
$(function(){
	H.comments.init();
});