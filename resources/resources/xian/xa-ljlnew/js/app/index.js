/**
 * 直播60分-首页
 */
(function($) {
	H.index = {
		from: getQueryString('from'),
		now_time : null,
		istrue : true,
		leftCount:0,//本次活动用户剩余抽奖次数
		canLottery: false,
		time: 0,
		defaulttime: 5,
		interval: null,
		first: true,
		url:"",
		init: function () {
			this.event_handler();
			this.leftActivityCount();
		},
		event_handler : function() {
			var me = this;
			$('.index-btn').click(function(e) {
				e.preventDefault();
				if(H.index.canLottery){
					H.index.canLottery = false;
					if(openid == null || openid == ''){
						H.dialog.prize.open();
						H.dialog.prize.thanks();
						return;
					}
					//getResult('api/lottery/luck', {oi: openid}, 'callbackLotteryLuckHandler', true);
					showLoading();
			        $.ajax({
			            type : 'GET',
			            async : false,
			            url : domain_url + 'api/lottery/luck',
			            data: { oi: openid },
			            dataType : "jsonp",
			            jsonpCallback : 'callbackLotteryLuckHandler',
			            complete: function() {
			                hideLoading();
			            },
			            success : function(data) {
			            },
			            error : function() {
			                H.dialog.prize.open();
							H.dialog.prize.thanks();
			             }
			         });
				}
			});
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				
				H.dialog.rule.open();
			});
			$('#btn-gift').click(function(e) {
				e.preventDefault();
				toUrl("gift.html");
			});
		},
		countdown: function(){
			   H.index.canLottery = false;
			   H.index.time = H.index.defaulttime;
			   $(".countdown").text(H.index.time);
				 $(".lottery").addClass("none");
			   $(".countdown").removeClass("none");
			   H.index.interval = setInterval(function(){
				   if(H.index.time > 0){
					   H.index.time--;
					   $(".countdown").text(H.index.time);
				   }else if(H.index.time == 0){
						H.index.canLottery = true;
					   $(".lottery").removeClass("none");
					   $(".countdown").addClass("none");
					   clearInterval(H.index.interval);
				   }
			   }, 1000)
		},
		current_time: function(){
			getResult('api/lottery/round','callbackLotteryRoundHandler',true);
		},
		//检查用户在当前活动中的剩余抽奖次数
		leftActivityCount:function(){
			   getResult('api/lottery/leftLotteryCount',{oi:openid},'callbackLotteryleftLotteryCountHandler',true);
		},
		lottery : function(){
			H.index.canLottery = true;
			 $(".lottery").removeClass("none");
			 $(".lotteryed").addClass("none");
			 $(".count-time").addClass("none");
			 if(!H.index.first){
				 //H.index.countdown();
			 }else{
				 H.index.first = false; 
			 }
		},
		count : function(){
			H.index.canLottery = false;
			$(".count-time").removeClass("none");
			$(".lottery").addClass("none");
			 $(".lotteryed").addClass("none");
		},
		end : function(){
			H.index.canLottery = false;
			$(".lotteryed").removeClass("none");
			$(".lottery").addClass("none");
			$(".detail-countdown").addClass("none");
			$(".count-time").addClass("none");
		},
		
		currentPrizeAct:function(data){
			
			//获取抽奖活动
			var prizeActListAll = data.la,
				prizeLength = 0,
				nowTimeStr = H.index.now_time,
				$tips = $(".time-tips"),
				prizeActList = [],
				me = this;
			var day = nowTimeStr.split(" ")[0];
			if(prizeActListAll&&prizeActListAll.length>0){
				for ( var i = 0; i < prizeActListAll.length; i++) {
					if(prizeActListAll[i].pd == day){
						prizeActList.push(prizeActListAll[i]);
					}
			    }
			}
			prizeLength = prizeActList.length;
			if(prizeActList.length >0){
				//如果最后一轮结束
				if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
					H.index.end();
					 return;
			    }
				    //如果最后一轮还没结束但是抽奖次数没了
				if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].st,nowTimeStr) >= 0&&comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr)<= 0&&H.index.leftCount<=0){
					  H.index.end();
					 return;
			    }
				for ( var i = 0; i < prizeActList.length; i++) {
					var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
					var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
					//在活动时间段内且可以抽奖
					if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0&&(H.index.leftCount>0)){
						 H.index.lottery();
						return;
					}
					if(comptime(nowTimeStr,beginTimeStr) > 0){
						$tips.html('距离抽奖还有');
						var beginTimeLong = timestamp(beginTimeStr);
		    			var nowTime = Date.parse(new Date())/1000;
		            	var serverTime = timestamp(nowTimeStr);
		    			if(nowTime > serverTime){
		    				beginTimeLong += (nowTime - serverTime);
		    			}else if(nowTime < serverTime){
		    				beginTimeLong -= (serverTime - nowTime);
		    			}
						$('.detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
						H.index.count_down();
						H.index.count();
						return;
					}
					
				}
			}else{
				H.index.end();
				return;
			}
		},
		// 倒计时
		count_down : function() {
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.index.istrue){
							H.index.istrue = false;
							showLoading();
						    setTimeout(function(){
						    	H.index.lottery();
								hideLoading();
						    },1000);
						}	
					},
					sdCallback :function(){
					}
				});
			});
		}
	}
	
	W.callbackLotteryleftLotteryCountHandler = function(data){
		if(data.result == true){
		 	H.index.leftCount = data.lc;
		 	H.index.current_time();//档查询抽奖剩余次数回调成功后,再执行抽奖活动 
		}
	}
	
	W.callbackLotteryRoundHandler = function(data){
		if(data.result == true){
			H.index.now_time = timeTransform(data.sctm);
			H.index.currentPrizeAct(data);
		}else{
			H.index.end();
		}
	}
	
	W.callbackLotteryLuckHandler = function(data){
		if(data.result  && data.pt != null){
			H.index.url = data.ru;
			H.dialog.prize.open();
			H.dialog.prize.update(data);
		}else{
			H.dialog.prize.open();
			H.dialog.prize.thanks();
		}
	};
})(Zepto);                             

$(function(){
	$("body").css("height",$(window).height());
	H.index.init();
});


