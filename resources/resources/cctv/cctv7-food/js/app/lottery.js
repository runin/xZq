/**
 * 食尚大转盘-抽奖
 */
(function($) {
    H.lottery = {
        ruuid : 0,
        $rule_close: $('.rule-close'),
        isLottery :false,
        nowTime :null,
        isCanShake:true,
        times:0,
        isToLottey:true,
        first: true,
        lotteryTime:getRandomArbitrary(5,9),
        yaoBg:[],
        canJump:true,
        init : function(){
            this.event();
			this.current_time();
            this.shake();
            H.lottery.account_num();
            setInterval(function(){
            	 H.lottery.account_num();
            },5000);
        	H.lottery.red_record();
            setInterval(function(){
            	H.lottery.red_record();
           },10000);
            H.lottery.leftPrizeCount();
            setInterval(function(){
            	H.lottery.leftPrizeCount();
            },5000);
            this.ddtj();
        },
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
        event: function() {
            $("#test").click(function(e){
            	H.lottery.shake_listener();
            });
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
		
		scroll: function(options) {
			$('.marquee').each(function(i) {
				var me = this, com = [], delay = 1000;
				var len  = $(me).find('li').length;
				var $ul = $(me).find('ul');
				if (len == 0) {
					$(me).addClass('none');
				} else {
					$(me).removeClass('none');
				}
				if(len > 1) {
					com[i] = setInterval(function() {
						$(me).find('ul').animate({'margin-top': '-20px'}, delay, function() {
							$(me).find('ul li:first').appendTo($ul)
							$(me).find('ul').css({'margin-top': '0'});
						});
					}, 3000);
				};
			});
		},
		imgMath: function() {//随机背景
			if(H.lottery.yaoBg.length >0){
				var i = Math.floor((Math.random()*H.lottery.yaoBg.length));;
				$("body").css("backgroundImage","url('"+H.lottery.yaoBg[i]+"')");
			}
		},
        textMath: function() {//随机文案
            if(textList.length >0){
                var i = Math.floor((Math.random()*textList.length));;
                $(".textb").text(textList[i]);
            }
        },
        shake_listener: function() {
	            if(H.lottery.isCanShake){
	            	H.lottery.isCanShake = false;
	            }else{
	              return;
	            }
	          recordUserOperate(openid, "cctv7时尚大转盘摇手机", "cctv7-food-shake");
	          recordUserPage(openid, "cctv7时尚大转盘摇手机", 0);
	          H.lottery.times++;
	
	          if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
	        	  H.lottery.isToLottey = false;
	          }
	          if(!$(".home-box").hasClass("yao")) {
				$("#audio-a").get(0).play();
      		    H.lottery.imgMath();
  	          $(".textb").removeClass("yaonone-text");
				$(".home-box").addClass("yao");
	          }
	          if(!openid || openid=='null' || H.lottery.isToLottey == false){
	            setTimeout(function(){
	            	H.lottery.fill(null);//摇一摇
	            }, 1500);
	          }else{
	        	  H.lottery.drawlottery();
	          }
	          H.lottery.isToLottey = true;
        },
        //查询当前参与人数
        account_num: function(){
		       getResult('log/serpv ', {}, 'callbackCountServicePvHander');
		},
		//查询最新20条中奖记录
		red_record: function(){
			getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
		},
		//查询业务当前抽奖活动有限制奖品剩余数量
		leftPrizeCount:function(){
			getResult('api/lottery/leftDayCountLimitPrize',{},'callbackLeftDayCountLimitPrizeHandler');
		},
		
       //查抽奖活动接口
        current_time: function(){
		     getResult('api/lottery/round', 'callbackLotteryRoundHandler',true);
		},
		downloadImg: function(){
			var t = simpleTpl();
			for(var i = 0;i < H.lottery.yaoBg.length;i++){
				t._('<img src="'+H.lottery.yaoBg[i]+'" style="width:0px;heigth:0px;">')
			}
			$("body").append(t.toString());
		},
        currentPrizeAct:function(data){
        	//获取抽奖活动
			var prizeActListAll = data.la,
				prizeLength = 0,
				nowTimeStr = H.lottery.nowTime,
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
					 H.lottery.change();
					 return;
			    }
				for ( var i = 0; i < prizeActList.length; i++) {
					var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
					var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
					//在活动时间段内且可以抽奖
					if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        if(prizeActList[i].bi.length>0){
                            H.lottery.yaoBg = prizeActList[i].bi.split(",");
                        }
						H.lottery.downloadImg();
						H.lottery.isLottery = true ;
						var beginTimeLong = timestamp(endTimeStr);
		    			var nowTime = Date.parse(new Date())/1000;
		            	var serverTime = timestamp(nowTimeStr);
		    			if(nowTime > serverTime){
		    				beginTimeLong += (nowTime - serverTime);
		    			}else if(nowTime < serverTime){
		    				beginTimeLong -= (serverTime - nowTime);
		    			}
						$('.detail-countdown').attr('etime',beginTimeLong);
						H.lottery.count_down();
						$(".countdown").removeClass("none");
						return;
					}
					if(comptime(nowTimeStr,beginTimeStr) > 0){
						H.lottery.change();
						return;
					}
					
				}
			}else{
				H.lottery.change();
				return;
			}
        },
        change: function(){
		    toUrl("enter.html");
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
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        if(H.lottery.canJump){
                            H.lottery.canJump = false;
                            H.lottery.change();
                        }
					},
					sdCallback :function(){
					}
				});
			});
		},
        drawlottery:function(){
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
                    H.lottery.lottery_point(data);
                },
                error : function() {
                    H.lottery.lottery_point(null);
                }
            });
        },
        isShow : function($target, isShow){
            var $target = $('.' + $target);
            $target.removeClass('none');
            isShow ? $target.show() : $target.hide();
        },
        fill : function(data){
            setTimeout(function() {
                $(".home-box").removeClass("yao");
            },300);
        	if(data == null || data.result == false || data.pt == 0){
        		$("#audio-a").get(0).pause();
        		$("#audio-c").get(0).play();//不中奖声音
                $(".texta").addClass("none");
                H.lottery.textMath();
                $(".textb").removeClass("none");
				$(".textb").addClass("yaonone-text").show();
				H.lottery.isCanShake = true;
				return;
        	}else{
        		$("#audio-a").get(0).pause();
        		$("#audio-b").get(0).play();//中奖声音
        	}
            H.dialog.lottery.open();
            H.dialog.lottery.update(data);
         
        },
        lottery_point : function(data){
              setTimeout(function(){
                  H.lottery.fill(data);
              }, 1000);
        }
    };

    W.callbackLotteryRoundHandler = function(data){
		if(data.result == true){
			H.lottery.nowTime = timeTransform(data.sctm);
			H.lottery.currentPrizeAct(data);
		}else{
			H.lottery.change();
		}
	};
	
	W.callbackCountServicePvHander = function(data){
		if(data.code == 0){
			$(".count label").html(data.c);
			$(".count").removeClass("hidden");
		}
	}
	
	W.callbackLotteryAllRecordHandler = function(data){
		if(data.result){
			var list = data.rl;
			if(list && list.length>0){
				var con = "";
				for(var i = 0 ; i<list.length; i++){
					con +="<li>"+(list[i].ni || "匿名用户")+"中了"+list[i].pn+"</li>";
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
	}

	W.callbackLeftDayCountLimitPrizeHandler = function(data){
		if(data.result){
			$(".rednum").find("span").text(data.lc);
            if(data.lc == 0){
                $(".rednum").addClass("none");
            }else{
                $(".rednum").removeClass("none");
            }
        }
    }

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
        } else {
            $('#ddtj').remove();
        };
    }
})(Zepto);

$(function() {
    H.lottery.init();
});
