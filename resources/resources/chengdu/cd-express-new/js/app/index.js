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
		expires : {expires: 30},
		dec : 0,
		actIndex : 0,
		lotteryActList : [],
		repeatCheck : true,
		init : function() {
			var me = this;
			me.share_mask();
			me.event_handler();
			me.current_time();
			me.userCount();
			setInterval(function(){
				me.userCount();
			},5000);
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
				if(!openid){
                	H.dialog.lottery.open();
                	H.dialog.lottery.no_openid();
                	return;
                }
				if(me.$lottery.attr("disabled") != 'disabled'){
					me.$lottery.attr("disabled","disabled");
					me.lottery();
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
		lottery : function(){
			var sn = new Date().getTime()+'';
			showLoading();
			recordUserOperate(openid, "调用抽奖接口", "doLottery");
			$.ajax({
				type : 'GET',
				async : false,
				url : domain_url + 'api/lottery/exec/luck',
				data: { matk: matk, sn: sn },
				dataType : "jsonp",
				jsonpCallback : 'callbackLotteryLuckHandler',
				complete: function() {
					hideLoading();
					H.index.current_time();
				},
				success : function(data) {
					if(data.result){
						if(data.sn == sn){
							H.dialog.lottery.open(data);
							H.dialog.lottery.update(data);
						}
					}else{
						sn = new Date().getTime()+'';
						H.dialog.lottery.open(null);
					}
				},
				error : function() {
					sn = new Date().getTime()+'';
					H.dialog.lottery.open(null);
				}
			});
		},
        // 倒计时
        count_down: function () {
        	$('.detail-countdown').each(function() {
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.index.repeatCheck){
							showLoading();
							H.index.repeatCheck = false;
							H.index.$count_des.html('请稍等...');
							setTimeout(function(){
								H.index.current_time();
							},2000);
						}
					}
				});
			});
        },
		userCount: function(){
			getResult('api/common/servicedayuv ', {}, 'commonApiSDUVHander');
		},
		//查抽奖活动接口
		current_time: function(){
			getResult('api/lottery/round',{}, 'callbackLotteryRoundHandler');
		},
		currentPrizeAct:function(data){
			//获取抽奖活动
			var prizeActList = data.la,
				prizeLength = 0,
				nowTimeStr = timeTransform(data.sctm),
				me = this;
			me.lotteryActList = prizeActList;
			prizeLength = prizeActList.length;
			if(prizeActList.length >0){
				if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
					me.change();
					return;
				}
				for ( var i = 0; i < prizeActList.length; i++) {
					var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
					var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
					if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
						me.actIndex = i;
						me.leftChance();
						return;
					}
					if(comptime(nowTimeStr,beginTimeStr) > 0){
						me.do_count_down(beginTimeStr,false);
						return;
					}
				}
			}else{
				me.change();
			}
		},
		leftChance:function(){
			getResult("api/lottery/leftLotteryCount",{oi:openid},"callbackLotteryleftLotteryCountHandler");
		},
		change:function(){
			H.index.$count_des.html('今日抽奖已结束，明天再来吧');
			H.index.$lottery.attr('disabled','disabled').addClass("none");
			$("#lottery-time").addClass("wait-marg").find("span").addClass("wait-lot");
			$('#detail-countdown').addClass('none');
			H.index.$lottery.attr('disabled','disabled');
			hideLoading();
		},
		do_count_down: function(endTimeStr,isStart){
			if(isStart){
				H.index.isLotteryTime = true;
				H.index.$count_des.html('距离此次抽奖结束还剩');
				H.index.$lottery.removeAttr('disabled').removeClass('none').removeClass('btn-begined').addClass("btn-begin");
				$("#lottery-time").removeClass("wait-marg").find("span").removeClass("wait-lot");
			}else{
				H.index.isLotteryTime = false;
				H.index.$count_des.html('距离下次抽奖开启');
				H.index.$lottery.attr('disabled','disabled').addClass("none");
				$("#lottery-time").addClass("wait-marg").find("span").addClass("wait-lot");
			}
			var endTimeLong = timestamp(endTimeStr);
			endTimeLong += H.index.dec;
			$('.detail-countdown').attr('etime',endTimeLong);
			H.index.count_down();
			$(".countdown").removeClass("none");
			hideLoading();
			H.index.repeatCheck = true;
		}
	};


	W.callbackLotteryRoundHandler = function(data){
		if(data.result == true){
			var nowTimeStemp = new Date().getTime();
			H.index.dec = nowTimeStemp - data.sctm;
			H.index.currentPrizeAct(data);
		}else{
			H.index.change();
		}
	};
	
	W.commonApiSDUVHander = function(data){
		if(data.code == 0){
			$("#user-count").text(data.c);
		}
	};

	W.callbackLotteryleftLotteryCountHandler = function(data){
		if(data.result){
			if(data.lc > 0){
				var endTimeStr = H.index.lotteryActList[H.index.actIndex].pd+" "+H.index.lotteryActList[H.index.actIndex].et;
				H.index.do_count_down(endTimeStr,true);
			}else{
				if(H.index.actIndex < H.index.lotteryActList.length - 1){
					var beginTimeStr = H.index.lotteryActList[H.index.actIndex + 1].pd+" "+H.index.lotteryActList[H.index.actIndex + 1].st;
					H.index.do_count_down(beginTimeStr,false);
				}else{
					H.index.change();
				}
			}
		}
	}
})(Zepto);
$(function(){
	H.index.init();
});
