/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		from: getQueryString('from'),
		now_time : null,
		istrue : true,
		leftCount:0,//本次活动用户剩余抽奖次数
		width : $('.detail-countdown').width(),
		init: function () {
			this.event_handler();
			this.leftActivityCount();
			this.prereserve();
		},
		event_handler : function() {
			var me = this;
			$('#btn-begin').click(function(e) {
				e.preventDefault();
				return;
			});
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$("#btn-reserve").click(function(e) {
				e.preventDefault();
				
				var reserveId = $(this).attr('data-reserveid');
				if (!reserveId) {
					return;
				}
				shaketv.reserve(yao_tv_id, reserveId, function(data){});
			});
			
		},
		current_time: function(){
			   getResult('api/lottery/round','callbackLotteryRoundHandler',true);
		},
		//检查用户在当前活动中的剩余抽奖次数
		leftActivityCount:function(){
			   getResult('api/lottery/leftLotteryCount',{oi:openid},'callbackLotteryleftLotteryCountHandler',true);
		},
		// 检查该互动是否配置了预约功能
		prereserve: function() {
			var me = this;
			$.ajax({
				type : 'GET',
				async : true,
				url : domain_url + 'program/reserve/get',
				data: {},
				dataType : "jsonp",
				jsonpCallback : 'callbackProgramReserveHandler',
				success : function(data) {
					if (!data.reserveId) {
						return;
					}
					// yao_tv_id: 微信为电视台分配的id
					window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function(resp){
						if (resp.errorCode == 0) {
							$("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId);
						}
					});
				}
			});
		},
		change : function(){
			 $('.detail-countdown').height(H.index.width*157*0.64/366);
			 $('.detail-countdown').css({"background":"url(images/join.png) no-repeat center","background-size":"64%","margin-top":'16px',"text-indent":"-99999px"});
		     $('.detail-countdown').attr("href","baoliao.html").removeClass("hidden");
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
					 H.index.change();
					 return;
			    }
				    //如果最后一轮还没结束但是抽奖次数没了
				if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].st,nowTimeStr) >= 0&&comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr)<= 0&&H.index.leftCount<=0){
					  H.index.change();
					 return;
			    }
				for ( var i = 0; i < prizeActList.length; i++) {
					var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
					var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
					//在活动时间段内且可以抽奖
					if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0&&H.index.leftCount>0){
						 showLoading();
						 $(".detail-countdown").html('抽奖开启');
						 setTimeout(function(){
		        	       toUrl("lottery.html");
		        	    },getRandomArbitrary(1, 4)*1000);
						return;
					}
					if(comptime(nowTimeStr,beginTimeStr) > 0){
						$tips.html('距离抽奖开启还有');
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
						return;
					}
					
				}
			}else{
				H.index.change();
				return;
			}
		},
		// 倒计时
		count_down : function() {
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">小时</label>' + '%M%' + '<label class="dian">分</label>' + '%S%'+'<label class="dian">秒</label>', // 还有...结束
					stpl : '%H%' + '<label class="dian">小时</label>' + '%M%' + '<label class="dian">分</label>' + '%S%'+'<label class="dian">秒</label>', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.index.istrue){
							H.index.istrue = false;
							$(".detail-countdown").addClass("none");
							$(".time-tips").html('抽奖开启')
							showLoading();
						    setTimeout(function(){
						    	toUrl("lottery.html");
						    },2000);
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
			H.index.change();
		}
	}

	
})(Zepto);                             

$(function(){
	H.index.init();
});


