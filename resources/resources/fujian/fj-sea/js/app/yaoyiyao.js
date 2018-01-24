$(function(){
    H.yao = {
        commActUid:null,
        check:null,
        isCanShake : false,
        isTrue :true,
        init : function(){
            var me = this;
            me.current_time();
            me. prize_count();
		    me.shake(); 
        },
        shake: function() {
            W.addEventListener('shake', H.yao.shake_listener, false);
        },
        unshake: function() {
                
        },
        shake_listener: function() {
        	if(!H.yao.isCanShake){
	            return;
	        }
	        H.yao.isCanShake = false;
        	if($(".modal").hasClass("none")||$(".modal").length == 0){
        		recordUserOperate(openid, "旅游卫视摇手机", "fj-group-shake");
        		$(".yao-text p.award-tips").find("span:first-child").removeClass("none");
        		$(".yao-text p.award-tips").find("span:last-child").addClass("none").removeClass("yaonone-text");
                $("#audio-a").get(0).play();//摇声音
                $('.yao-redbao').addClass('bbtimg');
                setTimeout(function(){
                    $('.yaoyiyao').removeClass('bbtimg');
                }, 1000);
                setTimeout(function(){
                	getResult('api/lottery/luck', {oi:openid}, 'callbackLotteryLuckHandler',true);
                }, 1000);               
        	}else{
        		return;
        	}   
         },
        //查询抽奖活动时间段
        current_time: function(){
            getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler',true);
        },
        prize_count : function(){
        	getResult('api/lottery/leftLimitPrize', {}, 'callbackLeftLimitPrizeHandler',true);
        },
		
        currentPrizeAct:function(data){
        //获取抽奖活动
			var prizeActList = data.la,
				prizeLength = prizeActList.length,
				nowTimeStr =data.sctm/1000,
				me = this,
				$tips = $(".time-tips");
				//如果最后一轮结束
	        if(timestamp(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et)<= nowTimeStr){	
	        	$(".tips").removeClass("none");
	        	$tips.removeClass("none");
	        	$tips.html('今日抽奖已结束');
				$('.detail-countdown').addClass('none');
				return;
	        }
			for ( var i = 0; i < prizeActList.length; i++) {
				var beginTimeStr = timestamp(prizeActList[i].pd+" "+prizeActList[i].st);
				var endTimeStr = timestamp(prizeActList[i].pd+" "+prizeActList[i].et);
				//可以抽奖
				if(beginTimeStr <= nowTimeStr&&endTimeStr > nowTimeStr){
					H.yao.isCanShake = true;
					var endTimeLong = endTimeStr;
	    			var nowTime = Date.parse(new Date())/1000;
	            	var serverTime = nowTimeStr;
	    			if(nowTime > serverTime){
	    				endTimeLong += (nowTime - serverTime);
	    			}else if(nowTime < serverTime){
	    				endTimeLong -= (serverTime - nowTime);
	    			}
	    		    $(".tips").removeClass("none");
					$(".text-tip").html("距离本次抢红包结束还有");	
					$('.downContTime').attr('etime',endTimeLong);
					$(".time-text").removeClass("hidden");
					H.yao.count_down();
				}
				//活动开始前倒计时
				if(beginTimeStr > nowTimeStr){
					var beginTimeLong = beginTimeStr;
	    			var nowTime = Date.parse(new Date())/1000;
	            	var serverTime = nowTimeStr;
	    			if(nowTime > serverTime){
	    				beginTimeLong += (nowTime - serverTime);
	    			}else if(nowTime < serverTime){
	    				beginTimeLong -= (serverTime - nowTime);
	    			}
					$(".text-tip").html('距离抽奖开启还有');
					$(".time-text").removeClass("hidden");
					$('.downContTime').attr('etime',beginTimeLong);
					H.yao.count_down();
					return;
				}
			}
        },
        // 倒计时
        count_down : function() {
          $('.downContTime').each(function() {
            var $me = $(this);
            $(this).countDown({
              etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
              stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
              sdtpl : '',
              otpl : '',
              otCallback : function() {
                // 当中奖和倒计时没有waiting属性不自动跳转
                if(istrue){
                	istrue = false;
                	if(!isCanShake){
                		$(".text-tip").html('抽奖开启');
                	}
                	setTimeout(function(){
                		H.yao.current_time();
                	},2000);
                }
              },
              sdCallback :function(){
              }
            });
          });
        }
    };
    W.callbackLotteryRoundHandler = function(data){
	    if(data.result){
	        H.yao.currentPrizeAct(data);
	    }else{
	    	$(".time-text").html("抽奖未开启").removeClass("hidden");
	    }
    };
    W.callbackLeftLimitPrizeHandler = function(data){
	    if(data.result){
	    	$(".prizeCount").text(data.lc);
	    	$(".prize-text").removeClass("hidden");
	    }
    };
    W.callbackLotteryLuckHandler = function(data){
        setTimeout(function(){
            $('.yao-redbao').removeClass('bbtimg');
        }, 600);
        if(data.result&&data.pt != 0){
        	H.dialog.lottery.open();
        	H.dialog.lottery.update(data);
        }else{
        	$(".yao-text p.award-tips").find("span:first-child").addClass("none");
			$(".yao-text p.award-tips").find("span:last-child").removeClass("none").addClass("yaonone-text");
			H.yao.isCanShake = true;
        }
    }
});
$(function(){
	setTimeout(function(){
		H.yao.init();
    }, 1100);
    $('#red').click(function(event) {
       H.yao.shake_listener();
    });
});
