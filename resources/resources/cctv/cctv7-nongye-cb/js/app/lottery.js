(function($) {
    H.lottery = {
        ruuid : 0,
        $rule_close: $('.rule-close'),
        isLottery :false,
        nowTime :null,
        isCanShake:true,
        times:0,
        thank_times:0,
        isToLottey:true,
        isTimeOver:false,
        isLotteryTime:false,
        first: true,
        lotteryTime:getRandomArbitrary(3,7),
        isReady:false,
        yaoBg:[],
        lastRound: false,
        canJump: true,
        isError:false,
        wxCheck:false,
        init : function(){
        	var me = this;
            this.event();
			this.current_time();
            this.shake();
            me.account_num();
            setInterval(function(){
                me.account_num();
            },5000);
        	me.red_record();
            setInterval(function(){
            	me.red_record();
			},10000);
			me.leftPrizeCount();
            setInterval(function(){
                me.leftPrizeCount();
            },5000);
            me.ddtj();
            $('.bg-yao, .btn').css('opacity', '1');
            hidenewLoading();
        },
        event: function() {
            var me = this;
            $("#btn-lottery").click(function(e) {
                e.preventDefault();
                if($(this).hasClass("requesting")){
                	return;
                }
               $(this).addClass("requesting");
               if(H.lottery.isLottery){
               	  $(".flash").addClass("flashed");
                  H.lottery.isLottery = false;
               	  if(openid){
               	  	shownewLoading();
               	  	setTimeout(function(){
               	  		 H.lottery.drawlottery();
               	  	},getRandomArbitrary(1, 3)*1000) 
                  } 
               }else{
               		return;
               }
                
            });
            $("#btn-talk").click(function(e){
                e.preventDefault();
				if (!$(this).hasClass('requesting')) {
					$(this).addClass('requesting');
					toUrl('talk.html');
				};
            });
            $("#test").click(function(e){
                e.preventDefault();
            	H.lottery.shake_listener();
            });
        },
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            getResult("mp/jsapiticket", {
                appId: shaketv_appid
            }, 'callbackJsapiTicketHandler', false);
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        account_num: function(){
            getResult('log/serpv ', {}, 'callbackCountServicePvHander');
        },
        leftPrizeCount:function(){
            getResult('api/lottery/leftDayCountLimitPrize',{},'callbackLeftDayCountLimitPrizeHandler');
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
						$(me).find('ul').animate({'margin-top': '-26px'}, delay, function() {
							$(me).find('ul li:first').appendTo($ul)
							$(me).find('ul').css({'margin-top': '0'});
						});
					}, 3000);
				};
			});
		},
        textMath: function() {//随机文案
            if(textList.length >0){
                var i = Math.floor((Math.random()*textList.length));;
                $(".textb").text(textList[i]);
            }
        },
        shake_listener: function() {
        		if (H.lottery.isTimeOver) {
	        		//没有倒计时在进行，不能摇
					return;
				}
	        	if (!H.lottery.isLotteryTime) {
	        		//非摇奖时间，不能摇
	        		return;
	        	}
	            if(H.lottery.isCanShake){
	            	H.lottery.isCanShake = false;
	            }else{
	              return;
	            }
	          recordUserOperate(openid, "每日农经摇一摇", "yao");
	          recordUserPage(openid, "每日农经摇一摇", 0);
	          H.lottery.times++;
	
	          if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
	        	  H.lottery.isToLottey = false;
	          }
	          if(!$(".home-box").hasClass("yao")) {
  	          	$(".textb").removeClass("yaonone-text");
				$("#audio-a").get(0).play();
				$(".home-box").addClass("yao");
	          }
	          if(!openid || openid=='null' || H.lottery.isToLottey == false){
	            setTimeout(function(){
	            	H.lottery.fill(null);//摇一摇
	            }, 1000);
	          }else{
                  if(!H.lottery.wxCheck){
                      //微信config失败
                      setTimeout(function(){
                          H.lottery.fill(null);//摇一摇
                      }, 1000);
                      return;
                  }
	            setTimeout(function(){
	        	  H.lottery.drawlottery();
	            }, 1000);
	          }
	          H.lottery.isToLottey = true;
        },
		red_record: function(){
			getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
		},
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
				if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
					 H.lottery.change();
					 H.lottery.lastRound = true;
					 return;
			    }
				for ( var i = 0; i < prizeActList.length; i++) {
					var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
					var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
					if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        if(prizeActList[i].bi.length>0){
                            H.lottery.yaoBg = prizeActList[i].bi.split(",");
                        }
						H.lottery.do_count_down(endTimeStr,nowTimeStr,true);
						return;
					}
					if(comptime(nowTimeStr,beginTimeStr) > 0){
						H.lottery.do_count_down(beginTimeStr,nowTimeStr,false);
						return;
					}
				}
			}else{
				H.lottery.change();
				return;
			}
        },
        change: function(){
        	H.lottery.isCanShake = false;
        	$(".countdown").removeClass("none");
			$(".countdown-tip").html('本期摇奖已结束，请等待下期!');
			$('.detail-countdown').html("");
			if(H.lottery.canJump && !H.lottery.lastRound){
				toUrl('over.html');
			}
        },
        do_count_down: function(endTimeStr,nowTimeStr,isStart){
        	if(isStart){
                H.lottery.isLotteryTime = true;
				$(".countdown-tip").html('距离摇奖结束还有');
        	}else{
                H.lottery.isLotteryTime = false;
    			$(".countdown-tip").html('距离摇奖开启还有');
        	}
        	var endTimeLong = timestamp(endTimeStr);
			var nowTime = Date.parse(new Date())/1000;
        	var serverTime = timestamp(nowTimeStr);
			if(nowTime > serverTime){
				endTimeLong += (nowTime - serverTime);
			}else if(nowTime < serverTime){
				endTimeLong -= (serverTime - nowTime);
			}
			$('.detail-countdown').attr('etime',endTimeLong);
			H.lottery.count_down();
			$(".countdown").removeClass("none");
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
						if(!H.lottery.isTimeOver){
							H.lottery.isTimeOver = true;
							$(".countdown-tip").html('请稍后...');
							shownewLoading(null, '请稍后...');
							var delay = Math.ceil(2500*Math.random() + 1700);
						    setTimeout(function(){
								hidenewLoading();
						    	getResult('api/lottery/round', 'callbackLotteryRoundHandler',true);
						    }, delay);
						}
						if(H.lottery.canJump && H.lottery.lastRound){
							$(".countdown-tip").html('本期摇奖已结束，请等待下期!');
							H.lottery.canJump = false;
							toUrl('over.html');
                            return;
                        }
					},
					sdCallback :function(){
						H.lottery.isTimeOver = false;
					}
				});
			});
		},
        drawlottery:function(){
        	shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: { oi: openid },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                complete: function() {
                    hidenewLoading();
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
        	if(data == null || data.result == false ){
        		$("#audio-a").get(0).pause();
                $(".texta").addClass("none");
                H.lottery.textMath();
                $(".textb").removeClass("none");
				$(".textb").addClass("yaonone-text").show();
				H.lottery.isCanShake = true;
            	H.dialog.lottery.open(null);
				return;
        	}else{
        		$("#audio-a").get(0).pause();
        		$("#audio-b").get(0).play();//中奖声音
        	}
            H.dialog.lottery.open(data);
         
        },
        lottery_point : function(data){
        	H.lottery.fill(data);
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
	};
	
	W.callbackLotteryAllRecordHandler = function(data){
		if(data.result){
			var list = data.rl;
			if(list && list.length>0){
				var con = "";
				for(var i = 0 ; i<list.length; i++){
					con +="<li><label class='win-name'>"+(list[i].ni || "匿名用户")+"</label>中了<label class='win-gift'>"+list[i].pn+"</label></li>";
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

	W.callbackCountServicePvHander = function(data){
        if(data.code == 0){
            $(".count label").html(data.c);
            $(".count").removeClass("hidden");
        }
    };

	W.callbackLeftDayCountLimitPrizeHandler = function(data){
        if(data.result){
            $(".rednum").find("span").text(data.lc);
            if(data.lc == 0){
                $(".rednum").addClass("none");
            }else{
                $(".rednum").removeClass("none");
            }
        }
    };

	W.callbackJsapiTicketHandler = function(data) {
		var url = window.location.href.split('#')[0];
		var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
		var timestamp = Math.round(new Date().getTime()/1000);
		var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
		//权限校验
		wx.config({
			debug: false,
			appId: shaketv_appid,
			timestamp: timestamp,
			nonceStr:nonceStr,
			signature:signature,
			jsApiList: [
				"addCard",
                "checkJsApi"
			]
		});
    };

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').attr('href', (data.url || '')).html(data.desc).removeClass('none');
        } else {
            $('#ddtj').remove();
        };
    };
})(Zepto);

$(function() {
    shownewLoading();
    //config微信jssdk
    H.lottery.wxConfig();
    wx.ready(function () {
        hidenewLoading();
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.lottery.isError){
                    H.lottery.wxCheck = true;
                }
            }
        });
        //wx.config成功
        //执行业务代码
        H.lottery.init();
    });
    wx.error(function(res){
		//alert(JSON.stringify(res));
        //wx.config失败，重新执行一遍wx.config操作
        H.lottery.isError = true;
    });
});