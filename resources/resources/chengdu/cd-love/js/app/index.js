/**
 * 成都深夜快递-首页
 */
(function($) {
	H.index = {
		from: getQueryString('from'),
		actUid : null,
		timer : 2000,
		$count_des : $(".count-des"),
		$from : $('#from'),
		$index : $('#index'),
		$lottery : $('#lottery'),
		isCount : true,
		now_time : null,
		expires : {expires: 30},
		init : function() {
			$("body").css("height",$(window).height());
			//this.share_mask();
			this.event_handler();
			this.count_down();
			this.current_time();
			this.userCount();
		},
		share_mask : function(){
			var me = this;
				var nowTimeStr = dateformat(new Date(),'yyyy-MM-dd hh:mm:ss');
				var beginTimeStr = dateformat(new Date(),'yyyy-MM-dd') + program_begin_time;
				var endTimeStr = dateformat(new Date(),'yyyy-MM-dd') + program_end_time;
				var shareCookie = $.fn.cookie('share_cookie');
				
				if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >=0 && me.from != 'share'){
					me.$index.removeClass('none');
					return;
				}else if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >=0 && me.from == 'share' && shareCookie != null){
						$.fn.cookie('share_cookie','share',me.expires);
						me.$index.removeClass('none');
						return;
				}
				
				me.$from.removeClass('none');
				setTimeout(function(){
					$("#share-copyright").addClass("none");
					me.$from.addClass('rotate');
					setTimeout(function(){
						me.$index.removeClass('none');
						me.$from.addClass('none');
					},me.timer);
				},4000);
				$.fn.cookie('share_cookie','share',me.expires);
		},
		event_handler : function() {
			var me = this;
			$('#activity').click(function(e) {
				e.preventDefault();
				if(openid != null){
					toUrl('comments.html');
				}
			});
			$('#lottery').click(function(e) {
				e.preventDefault();
				if(H.index.$lottery.attr("disabled") != 'disabled' && openid != null){
					H.index.$lottery.attr("disabled","disabled");
					H.lottery.lottery(me.actUid,1);
				}
			});
			$('#try').click(function(e) {
				e.preventDefault();
				me.$from.addClass('rotate');
				setTimeout(function(){
					me.$index.removeClass('none');
					me.$from.addClass('none');
				},me.timer);
			});
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
						if(H.index.isCount){
							showLoading();
							setTimeout(function(){
								hideLoading();
								H.index.current_time();
							},1000);
						}
					},
					sdCallback :function(){
						var h1 = $('.detail-countdown label:nth-child(1)'),
							h2 = $('.detail-countdown label:nth-child(2)'),
							h3 = $('.detail-countdown label:nth-child(3)');

						if (h1.text() == 0 && h2.text() == 0){
							h1.hide();
							h2.hide();
							h3.hide();
						}
					}
				});
			});
		},
		userCount: function(){
			getResultAsync('express/themecomment/usercount', {}, 'callbackUserCountHandler',true);
		},
		current_time: function(){
			getResult('express/themecomment/time', {}, 'callbackTimeHandler');
		},
		checkActivity : function(){
			//获取抽奖活动
			var prizeActList = prizeAct.activity,
				prizeLength = prizeAct.activity.length,
				nowTimeStr = H.index.now_time,
				me = this;

			if(comptime(nowTimeStr,prizeActList[0].ap+" "+prizeActList[0].ab) > 0){
				H.index.$count_des.html('距离下次抢红包还剩');
				me.$lottery.attr('disabled','disabled').addClass("none");
				$("#lottery-time").removeClass("none").addClass("wait-marg").find("span").addClass("wait-lot");
				$('#detail-countdown').attr('stime',timestamp(nowTimeStr)).attr('etime',timestamp(prizeActList[0].ap+" "+prizeActList[0].ab));
				this.actUid = prizeActList[0].au;
				return;
			}
			if(comptime(prizeActList[prizeLength-1].ap+" "+prizeActList[prizeLength-1].ae,nowTimeStr) > 0){
				H.index.$count_des.html('今日抢红包已结束，明天再来吧');
				me.$lottery.attr('disabled','disabled').addClass("none");
				$("#lottery-time").removeClass("none").addClass("wait-marg").find("span").addClass("wait-lot");
				$('#detail-countdown').addClass('none');
				me.isCount = false;
				me.$lottery.attr('disabled','disabled').addClass('btn-begined');
				return;
			}

			for ( var i = 0; i < prizeActList.length; i++) {
				var beginTimeStr = prizeActList[i].ap+" "+prizeActList[i].ab;
				var endTimeStr = prizeActList[i].ap+" "+prizeActList[i].ae;
				if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >=0){
					this.actUid = prizeActList[i].au;
					getResult('express/haslottery', {openid:openid,actUid:prizeActList[i].au}, 'expressHasLotteryHandler');
					return;
				}else if(comptime(nowTimeStr,beginTimeStr) >= 0){
					H.index.$count_des.html('距离下次抢红包还剩');
					me.$lottery.attr('disabled','disabled').addClass("none");
					$("#lottery-time").removeClass("none").addClass("wait-marg").find("span").addClass("wait-lot");
					$('#detail-countdown').attr('stime',timestamp(nowTimeStr)).attr('etime',timestamp(beginTimeStr));
					if(i< prizeActList.length -1){
						this.actUid = prizeActList[i+1].au;
					}
					return;
				}
			}
		}
	}

	W.expressHasLotteryHandler = function(data){
		if(data.code == 0){
			var prizeActList = prizeAct.activity;
			var index = null;
			var nowTimeStr = H.index.now_time;
			for ( var i = 0; i < prizeActList.length; i++) {
				if(H.index.actUid == prizeActList[i].au){
					index = i;
					break;
				}
			}
			if(data.result){
				if(index >= (prizeActList.length-1)){
					H.index.$count_des.html('今日抢红包已结束，明天再来吧');
					H.index.$lottery.attr('disabled','disabled').addClass("none");
					$("#lottery-time").removeClass("none").addClass("wait-marg").find("span").addClass("wait-lot");
					$('#detail-countdown').addClass('none');
					H.index.isCount = false;
					H.index.$lottery.attr('disabled','disabled');
				}else{
					H.index.$count_des.html('距离下次抢红包还剩');
					H.index.$lottery.attr('disabled','disabled').addClass("none");
					$("#lottery-time").removeClass("none").addClass("wait-marg").find("span").addClass("wait-lot");
					$('#detail-countdown').attr('stime',timestamp(nowTimeStr)).attr('etime',timestamp(prizeActList[index+1].ap+" "+prizeActList[index+1].ab));
					H.index.actUid = prizeActList[index+1].au;
				}
			}else{
				H.index.$count_des.html('距离此次抢红包结束还剩');
				H.index.$lottery.removeAttr('disabled').removeClass('none');
				$("#lottery-time").addClass("none").removeClass("wait-marg").find("span").removeClass("wait-lot");
				$('#detail-countdown').attr('stime',timestamp(nowTimeStr)).attr('etime',timestamp(prizeActList[index].ap+" "+prizeActList[index].ae));
				H.index.actUid = prizeActList[index].au;
			}
		}
	}
	
	W.callbackUserCountHandler = function(data){
		if(data.code == 0){
			$("#user-count").text(data.ucount);
		}
	}
	
	W.callbackTimeHandler = function(data){
		H.index.now_time = data.tm;
		H.index.checkActivity();
	}
})(Zepto);
$(function(){
	H.index.init();
});
