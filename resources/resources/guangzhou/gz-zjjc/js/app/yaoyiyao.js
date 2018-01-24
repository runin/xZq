(function($) {
    H.lottery = {
        $rule_close: $('.rule-close'),
        isCanShake:false,//是否可以摇一摇
        isToLotteyTimes:0,//摇的次数
        isToLottey:true,//是否调接口
        isTimeOver:false,//是否抽奖结束
        istrue:true,
        first: true,
        bCountDown:false,//是否在倒计时
        eCountDown :false,
        jifenUid : null,
        thankshow:[],
        lotteryTime:getRandomArbitrary(3,5),//每隔几次调接口
        init : function(){
            this.event();
			this.current_time();
            this.shake();
            H.lottery.account_num();
        	H.lottery.red_record();
        	H.lottery.thankshow();
        	H.lottery.jifen();
            setInterval(function(){
            	H.lottery.red_record();
           },10000);
           getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        event: function() {
            var me = this;
            $("#test").click(function(e){
            	H.lottery.shake_listener();
            });
            $("#btn-show").click(function(e){
            	e.preventDefault()
            	toUrl("photo.html");
            });
            $("#btn-cor").click(function(e){
            	e.preventDefault()
            	toUrl("answer.html");
            });
			$(".btn-dan").click(function(e){
				e.preventDefault();
				toUrl("answer.html")
			});
			$(".btn-pai").click(function(e){
				e.preventDefault();
				toUrl("pai.html")
			});
			$(".ranking").click(function(e) {
				e.preventDefault();
				H.dialog.rank.open();
				
			});
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        thankshow :function(){
        	 getResult('api/linesdiy/info', {oi: openid}, 'callbackLinesDiyInfoHandler',true);
        },
        jifen :function(){
        	 getResult('api/comments/topic/round', {oi: openid}, 'callbackCommentsTopicInfo',true);
        },
		scroll: function(options) {
			$('.marquee').each(function(i) {
				var me = this, com = [], delay = 1000;
				var len  = $(me).find('li').length;
				var $ul = $(me).find('ul');
				if (len == 0) {
					$(me).addClass('hidden');
				} else {
					$(me).removeClass('hidden');
				}
				if(len > 1) {
					com[i] = setInterval(function() {
						$(me).find('ul').animate({'margin-top': '-26px'}, delay, function() {
							$(me).find('ul li:first-child').appendTo($ul)
							$(me).find('ul').css({'margin-top': '0'});
						});
					}, 3000);
				};
			});
		},
        shake_listener: function() {
	          recordUserOperate(openid, "云南士兵突击摇奖页", "tv_yunnan_soldier");
	          recordUserPage(openid, "云南士兵突击摇奖页", 0);
	          if(!$(".home-box").hasClass("yao")&&H.lottery.isCanShake) {
  	          	$(".yao-text").removeClass("yaonone-text");
				$("#audio-a").get(0).play();
				$(".home-box").addClass("yao");
	          }else{
	          	return;
	          }
	          H.lottery.isToLotteyTimes++;
	          if(H.lottery.isToLotteyTimes % H.lottery.lotteryTime != 0){
	        	  H.lottery.isToLottey = false;
	          }
	          if(!openid || openid=='null' || H.lottery.isToLottey == false){
	            setTimeout(function(){
	            	H.lottery.fill(null);//摇一摇
	            }, 1000);
	          }else{
	            setTimeout(function(){
	        	  H.lottery.award();
	            }, 1000);
	          }
	          H.lottery.isToLottey = true;
        },
		red_record: function(){
			getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
		},
        current_time: function(){
		     getResult('api/lottery/round',{} ,'callbackLotteryRoundHandler',true);
		},
        currentPrizeAct:function(data){
        //获取抽奖活动
			var prizeActList = data.la,
				prizeLength = prizeActList.length,
				nowTimeStr =data.sctm/1000,
				me = this;
				//如果最后一轮结束
	        if(timestamp(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et)<= nowTimeStr){	
	        	H.lottery.isCanShake = false;
	        	H.lottery.isTimeOver = true;
	        	$(".text-tip").html('今日抽奖已结束').removeClass("hidden");
	        	$(".time-text").removeClass("hidden");
				$('.detail-countdown').addClass('none');
				return;
	        }
			for ( var i = 0; i < prizeActList.length; i++) {
				var beginTimeStr = timestamp(prizeActList[i].pd+" "+prizeActList[i].st);
				var endTimeStr = timestamp(prizeActList[i].pd+" "+prizeActList[i].et);
				//可以抽奖
				if(beginTimeStr <= nowTimeStr&&endTimeStr > nowTimeStr){
					H.lottery.isCanShake = true;
					H.lottery.eCountDown = true;
					var endTimeLong = endTimeStr;
	    			var nowTime = Date.parse(new Date())/1000;
	            	var serverTime = nowTimeStr;
	    			if(nowTime > serverTime){
	    				endTimeLong += (nowTime - serverTime);
	    			}else if(nowTime < serverTime){
	    				endTimeLong -= (serverTime - nowTime);
	    			}
					$(".text-tip").html("距离本次摇奖结束还有").removeClass("hidden");	
					$(".time-text").removeClass("hidden");
					$('.downContTime').attr('etime',endTimeLong);
					H.lottery.istrue = true;
					H.lottery.count_down();
					return;
				}
				//活动开始前倒计时
				if(beginTimeStr > nowTimeStr){
					H.lottery.bCountDown = true;
					H.lottery.isCanShake = false;
					var beginTimeLong = beginTimeStr;
	    			var nowTime = Date.parse(new Date())/1000;
	            	var serverTime = nowTimeStr;
	    			if(nowTime > serverTime){
	    				beginTimeLong += (nowTime - serverTime);
	    			}else if(nowTime < serverTime){
	    				beginTimeLong -= (serverTime - nowTime);
	    			}
					$(".text-tip").html('距离抽奖开启还有').removeClass("hidden");
					$(".time-text").removeClass("hidden");
					$('.downContTime').attr('etime',beginTimeLong);
					H.lottery.istrue = true;
					H.lottery.count_down();
					return;
				}
			}
        },
            // 倒计时
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
                // 当开始倒计时
                if(H.lottery.istrue){
                	H.lottery.istrue = false;
                	//开始倒计时
                	if(H.lottery.bCountDown == true){
                		H.lottery.bCountDown = false;
                		$(".text-tip").html('本轮抽奖开启');
                		$(".yao-text").removeClass("yaonone-text");
	                	setTimeout(function(){
	                		H.lottery.current_time();
	                	},2000);
                	//结束倒计时
                	}else if(H.lottery.eCountDown){
                		H.lottery.eCountDown = false;	
                		$(".text-tip").html('本轮抽奖结束');
                		$(".yao-text").removeClass("yaonone-text");
	                	setTimeout(function(){
	                		H.lottery.current_time();
	                	},2000);
                	}	
                }
                	
              },
              sdCallback :function(){
              }
            });
          });
        },
         //查询当前参与人数
        account_num: function(){
		       getResult('log/serpv ', {}, 'callbackCountServicePvHander');
		},
		    
        change: function(){
        	H.lottery.bCountDown = true
        	H.lottery.isCanShake = false;
			$(".time-text").html('本期节目尚未开始!').removeClass("hidden");
        },
        award :function(){
        	showLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: { oi: openid,sau : H.lottery.jifenUid},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                complete: function() {
                    hideLoading();
                },
                success : function(data) {
                	hideLoading();
                    H.lottery.award_info(data);
                },
                error : function() {
                    H.lottery.award_info(null);
                }
            });
        },
        fill : function(data){
            setTimeout(function() {
                $(".home-box").removeClass("yao");
            },300);
        	if(data == null || data.result == false){
        		$("#audio-a").get(0).pause();
       			if(H.lottery.thankshow.length<1 ){
        			$(".yao-text").addClass("yaonone-text");
		        	$("#audio-a").get(0).pause();
		        	$("#audio-c").get(0).play();//不中奖声音
					H.lottery.isCanShake = true;
					return;
     		    }else{
     		    	  H.lottery.isCanShake = false;
      			      H.dialog.lottery.open();
	           		  H.dialog.lottery.thank();
      		     }
				return;
        	}else{
        		H.lottery.isCanShake = false;
        		if(data.pt == 0){
        				$(".yao-text").addClass("yaonone-text");
		        		$("#audio-a").get(0).pause();
		        		$("#audio-c").get(0).play();//不中奖声音
						H.lottery.isCanShake = true;
						return;
        		}else{
	        		$("#audio-a").get(0).pause();
	        		$("#audio-b").get(0).play();//中奖声音
	        		H.lottery.isCanShake = false;
	        		H.dialog.lottery.open();
	           		H.dialog.lottery.update(data);
	           		return;
        		}
        	}
        },
        award_info : function(data){
        	H.lottery.fill(data);
        }
    };

    W.callbackLotteryRoundHandler = function(data){
		if(data.result == true){
			H.lottery.currentPrizeAct(data);
		}else{
			H.lottery.change();
		}
	};
	
	W.callbackCountServicePvHander = function(data){
		if(data.code == 0){
			$(".count").html("目前参与人数"+data.c).removeClass("hidden");
		}
	}
	
	W.callbackLotteryAllRecordHandler = function(data){
		if(data.result){
			var list = data.rl;
			if(list && list.length>0){
				var con = "";
				for(var i = 0 ; i<list.length; i++){
					con +='<li>'+(list[i].ni || "匿名用户")+'中了'+list[i].pn+'</li>';
				}
				var len = $(".marquee").find("li").length;
				if(len >= 500){
					$(".marquee").find("ul").html(con);
				}else{
					$(".marquee").find("ul").append(con);
				}
				if(H.lottery.first){
					H.lottery.first = false;
					H.lottery.scroll();
				}
				$(".marquee").removeClass("none");
			}
		}
	};
	W.callbackLinesDiyInfoHandler = function(data){
		if(data.code == 0){
			H.lottery.thankshow = data.gitems;
		}else{
			
		}
	};
	W.callbackCommentsTopicInfo = function(data){
		if(data.code == 0){
			H.lottery.jifenUid = data.items[0].uid
		}else{
			
		}
	};
	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			jumpUrl = data.url;
			$(".outer").attr("href",jumpUrl).html(data.desc).removeClass("none");
		}else{
			$(".outer").addClass("none");
		}
	};
})(Zepto);

$(function() {
	 var hei = $(window).height();
    $("body").css("height",hei+"px");
    if(is_android()){
        $(".main-top").css("height",(hei/2+0.5)+"px");
        $(".main-foot").css("height",(hei/2+0.5)+"px");
    }
    H.lottery.init();
});
