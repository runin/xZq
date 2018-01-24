(function($){
  	H.activity = {
  		dec:0,
  		nowTime:null,
  		repeat_load : true,
  		pra:[],
  		index:null,
  		istrue:true,
  		type: 0,
  	    roundIndex : null,
  	    countTime : baseCounts,//点击的秒数
  	    canClick : false,//是否可以点击
  	    clickCounts : 0,//点击的次数
  	    prized : false,//是否中过奖
  	    luckData : null,//中奖的数据
  	    wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        recordTime : 0,
        tipTimmer : null,
        queryRecordtime : null,
        lotteryTime :getRandomArbitrary(1,1),
        istoLottery : true,
  		init : function(){
			H.dialog.tip.open();
			this.event_handler();
			this.gameTimeInfo();
			this.account_num();
			this.ddtj();
			
  		},
  		ddtj : function(){
  			getResult('api/common/promotion', {oi:openid}, 'commonApiPromotionHandler',false);
  		},
  		   //查询当前参与人数
        account_num: function(){
		    getResult('api/common/servicepv', {}, 'commonApiSPVHander',false);
		},
  		event_handler : function() {
			var me = this;
			 $(".ddtj").click(function(e){
				e.preventDefault();
				shownewLoading();
				window.location.href = $(".ddtj").attr("data-href");
			})
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				if (!$(this).hasClass('request')) {
					$(this).addClass('request');
					H.dialog.rule.open();
					setTimeout(function(){
						$("#btn-rule").removeClass('request');
					}, 1000);
				}
				return;
			});
			$('#btn-person').click(function(e) {
				e.preventDefault();
			    toUrl("prize.html")
				return;
			});
			$('#btn-click').click(function(e) {
				e.preventDefault();
				var me = H.activity
			    if(!me.canClick){
			    	return ;
			    }else{
			    	me.clickCounts++
			    	me.pluse();
			        if(!me.wxCheck){
	                    return;
	                }
			    	if(me.clickCounts > baseClickCounts && !me.prized){
			    		if(me.clickCounts%me.lotteryTime == 0&&H.activity.istoLottery == true){
			    			me.tolottery();
			    		}else{
			    			return;
			    		}
			    	}else{
			    		 return;
			    	}
			    }
				return;
			});
		    $(".turn-box").click(function(e){
			    e.preventDefault();
				if($(this).hasClass("slideOut")){
					$(this).removeClass("slideOut").addClass("slideIn");
				}else{
					$(this).removeClass("slideIn").addClass("slideOut");
				}
			});
			$(".turn-box a").click(function(e){
			    e.preventDefault();
			    e.stopPropagation();
				toUrl("comment.html");
			});
		},
		pluse : function(){
	        var t = simpleTpl(),tips = "你有机会上屏哦~~";
			if($(".pluse").length > 0){
				$(".pluse").remove();
			}
			t._('<section class="pluse"><span>+1</span></section>')
			$(".screen1").append(t.toString());
			$(".pluse").addClass("slideOutUp");
			setTimeout(function(){
				$(".pluse").remove();
			},1000)
     	},
		flashTip : function(){
			var me = this;
			$(".hand").removeClass("none");
			$(".btn-click").addClass("slideInLeft");
			$(".click-tip").removeClass("none").addClass("slideOutRight");
			this.tipTimmer = setInterval(function(){
				if($(".btn-click").hasClass("slideInLeft")){
					$(".btn-click").removeClass("slideInLeft").addClass("slideOutRight");
					$(".click-tip").removeClass("slideOutRight").addClass("slideInLeft");
				}else{
					$(".btn-click").removeClass("slideOutRight").addClass("slideInLeft");
					$(".click-tip").removeClass("slideInLeft").addClass("slideOutRight");
				}
			},8000)
		},
		clearTip : function(){
			var me = this;
			clearInterval(this.tipTimmer);
			$(".hand").addClass("none");
			$(".btn-click").removeClass("slideInLeft").removeClass("slideOutRight");
			$(".click-tip").removeClass("slideInLeft").removeClass("slideOutRight");
			$(".click-tip").addClass("none");
		},
		tolottery:function(){
           var me = this;
           H.activity.istoLottery = false;
           H.activity.lotteryTime = getRandomArbitrary(1,1);
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck4Partake' + dev,
                data: { matk: matk},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryluck4PartakeHandler',
                timeout: 11000,
                complete: function() {
                   H.activity.istoLottery = true;
                   hidenewLoading();
                },
                success : function(data) {
                    if(data.flow && data.flow == 1){
                        return;
                    }
                    if(data.result){
	                    if(data.pt != 0){
	                         me.prized = true;
	                         me.luckData = data;
	                    }else{
	                         return;
	                    } 
                    }else{
                     	return;
                    }
                },
                error : function(xhr, errorType, error) {
                    return;
                }
            });
        },
  		refreshDec:function(){
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000*5*Math.random() + 60000*3);
            setInterval(function(){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/common/time'+dev,
                    data: {},
                    dataType : "jsonp",
                    jsonpCallback : 'commonApiTimeHandler',
                    timeout: 11000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.t){
                            var nowTime = Date.parse(new Date());
                            H.activity.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'mp/jsapiticket',
                data: {appId: shaketv_appid},
                dataType : "jsonp",
                jsonpCallback : 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
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
                    }

                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
		gameTimeInfo : function(){
			shownewLoading()
			 $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round'+dev,
                data: {at:8},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 11000,
				complete: function() {
                },
                success : function(data) {
                	hidenewLoading();
                    if(data.result == true){
                    	//服务器时间
                        H.activity.nowTime = timeTransform(data.sctm);
                        //本地时间
                        var nowTime = Date.parse(new Date());
                        var serverTime = timestamp(H.activity.nowTime);
                        // 计算服务器时间和本地时间的差值，并存储
                        H.activity.dec = (nowTime - serverTime);
                        H.activity.gameTime(data);
                     
                    }else{
                        if(H.activity.repeat_load){
                            H.activity.repeat_load = false;
                            setTimeout(function(){
                                H.activity.gameTimeInfo();
                            },500);
                         //接口返回false
                        }else{
                        	H.activity.gameTimeError();	
                        }
                    }
                },
                //接口出错
                error : function(xmlHttpRequest, error) {
                	H.activity.gameTimeError();
                }	
			})
		},
		gameTimeError : function(){
			hidenewLoading();
			$(".yao-btn").removeClass("none");
 			$(".time-tip").html("抢屏幕抽大奖，敬请期待");
 			$(".screen2").addClass("none");
        	$(".screen1").removeClass("none");
        	H.activity.flashTip();
 			$(".time").removeClass("none");
		},
		//查抽奖活动接口
        gameTime:function(data){
           //获取抽奖活动
            var prizeActList = data.la,
                prizeLength = prizeActList.length,
                nowTimeStr = H.activity.nowTime,
                me = this;
                me.pra = prizeActList;
            if(prizeLength >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                   	me.gameOver();
                   	me.roundIndex = prizeLength-1;
                   	me.gameRes(0,true);	
                    return;
                }
                //config微信jssdk
                H.activity.wxConfig();
                //第一轮摇奖开始之前，显示倒计时
                me.refreshDec();
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                    	me.index = i;
                    	me.roundIndex = i;
                    	me.countTime = parseInt(prizeActList[me.roundIndex].bi)||baseCounts; 
                        me.countTime = me.checkTime(beginTimeStr);
                        if(me.index >=prizeLength-1){
	                    	me.gameOver();
			            }else{
			             	me.index++;
		                	me.nowCountdown(prizeActList[me.index]);
			            }
                        //在设置的点击时间段里
			             if(me.countTime>0){
			                 me.gameStart(me.countTime)
			             }else{
			             	H.activity.recordTime = 0;
			             	me.gameRes(0,true);
			             }	
			           
                    	return;
                    }
                    //抽奖开始前倒计时
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                    	me.index = i;
                    	me.roundIndex = i;
                        if(me.roundIndex == 0){
			        		H.activity.canClick = false;
			        		$(".screen2").addClass("none");
			        		$(".screen1").removeClass("none");
			        		H.activity.flashTip();
			        		H.activity.lyTips();
			        	}else{
			        		H.activity.recordTime = 0;
			        		me.gameRes(0,true);
			        	}
 						me.nowCountdown(prizeActList[H.activity.index]);
                        return;
                    }

                }
            }else{
               $(".time-text").html('敬请期待!');
                return;
            }
        },
        nowCountdown: function(pra){
        	var me = this;
        	H.activity.type = 1;
            var beginTimeStr = pra.pd+" "+pra.st;
	        var beginTimeLong = timestamp(beginTimeStr);
	        beginTimeLong += H.activity.dec;
	      	$('.downContTime').attr('etime',beginTimeLong);
            $(".time-tip").html("距下轮抢屏幕还有");
            H.activity.count_down();
            H.activity.istrue = true;
            hidenewLoading();
        },
        count_down : function() {
            $('.downContTime').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '<label>%H%</label>'+'时'+'<label>%M%</label>' + '分' + '<label>%S%</label>'+'秒', // 还有...结束
                    stpl : '<label>%H%</label>'+'时'+'<label>%M%</label>' + '分' + '<label>%S%</label>'+'秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.activity.istrue){
                        	H.activity.istrue = false;
                        	H.activity.roundIndex = H.activity.index;
                        	H.activity.countTime = parseInt(H.activity.pra[H.activity.index].bi)||baseCounts; 
                        	H.activity.gameStart(H.activity.countTime);
                        	if(H.activity.index >=H.activity.pra.length-1){
		                    	H.activity.gameOver();
				            }else{
		                    	H.activity.index++;
		                    	H.activity.nowCountdown(H.activity.pra[H.activity.index]);
		                    }	               
                      	}       
                    },
                    sdCallback :function(){

                    }
                });
            });
        },

        checkTime : function(bt){
        	var nowTimeLong = Date.parse(new Date());
        	var beginTimeLong = timestamp(bt)
        	var checkNum = H.activity.countTime - Math.floor((nowTimeLong - beginTimeLong)/1000);
        	if( 0 < checkNum && checkNum < H.activity.countTime){
        		return checkNum;
        	}else{
        		return 0;
        	}
        },        
        gameOver:function(){
 			$(".time-tip").html("关注下期抢屏幕抽大奖");
 			$(".time").removeClass("none");
 			$(".screen-side").addClass("none");
        },
        gameStart : function(count){
        	H.activity.canClick = true;
        	H.activity.prized = false;
            H.activity.luckData = null;
        	$(".screen2").addClass("none");
        	$(".screen1").removeClass("none");
        	clearTimeout(H.activity.queryRecordtime);
        	H.activity.clearTip();
        	$(".time-box").addClass("none");
        	 H.activity.lyTips();
        	if(count>0){
        		
        		var endCount = count;
        		$("#countTime").html(count);
        		var counTimer = setInterval(function(){
        			$("#audio").get(0).pause();
        			$("#audio").attr("src","");
        			if(count >=0){
        				$("#audio").attr("src","images/ding.mp3").get(0).play();
        				$("#countTime").html(count);
        				$(".screen-side").removeClass("none");
        			}else{
        				clearInterval(counTimer);
        				$("#audio").attr("src","");
		        		if(H.activity.prized){
		        			H.dialog.lottery.open(H.activity.luckData);
		        		}else{
		        			H.dialog.erweima.open();	
		        		}
		        		$(".time-box").removeClass("none");
		        		H.activity.canClick = false;
		        		H.activity.recordTime = 0;
		        		$(".screen2").find("label").addClass("none");
		        		H.activity.gameRes(2000,true)
        				$(".screen-side").addClass("none");
        				$("#countTime").html("0")
		        		$(".screen1").addClass("none");
		        		$(".screen2").removeClass("none");
        			}
        			count--;
        		},1000)
        	};
        },
        gameRes : function(time,show){
        	var me = this;
        	if(show && show == true){
   				H.activity.tip_text($(".screen2"),"数据正计算中,请稍后",false);
        	}
        	if(time > 0){
        		me.queryRecordtime =setTimeout(function(){
	        		getResult("api/lottery/record4Partake",{oi:openid},"callbackLotteryRecord4PartakeHandler");
	        	},time)
        	}else{
        		getResult("api/lottery/record4Partake",{oi:openid},"callbackLotteryRecord4PartakeHandler");
        	}
        	
        },
        lyTips : function(nickname){
        	var t = simpleTpl(),tips = "你有机会上屏哦~~";
        	if(!nickname){
        		tips = "你有机会上屏哦~~"	
			}else{
				tips = nickname+'上屏了';
			}
			if($(".lyTips").length > 0){
				$(".lyTips").remove();
			}
			t._('<section class="lyTips"><span>' + tips+ '</span></section>')
			$(".sec-b").append(t.toString());
			$(".lyTips").addClass("tada");
       } ,
       tip_text: function (contain, str, hide) {
       	   if (hide && hide == true) {
                setTimeout(function () {
                    contain.find(".tip1").remove();
                }, 100);
            }else{
            	var t = simpleTpl();
	            t._('<span class="tip1">' + str + '</span>');
	            contain.append(t.toString());
	            $(".tip1").show();
            }  
       },
	};
	W.commonApiPromotionHandler =  function(data){
		if(data.code == 0){
			var jumpUrl = data.url;
			$(".ddtj-text").html(data.desc);
			$(".ddtj").attr("data-href",jumpUrl).removeClass("none");
		}else{
			$(".ddtj").addClass("none");
		}
	};
	W.commonApiSPVHander = function(data){
		if(data.code == 0){
			var num = String(data.c);
			var t = "";
			for(var i = 0;i< num.length;i++){
			   t = t + "<label>"+num[i]+"</label>";
			}
			$(".count span").html(t);
			$(".count").removeClass("hidden");
		}
	};
  	W.callbackLotteryRecord4PartakeHandler = function(data){
  		H.activity.recordTime ++;
  		if(data&&data.result){
			var nickName = data.rn || data.ni|| "匿名用户";
			$(".screen2").find("label img").attr("src",data.hi || "images/danmu-head.jpg").attr("onerror","$(this).attr(\"src\",\"images/danmu-head.jpg\")");
			$(".screen2").find("label span").html(nickName );
			$(".screen2").find("label").removeClass("none");
		  	$(".screen2").find("p").html(nickName+"中了"+data.pn+"一"+data.pu).addClass("zimu").removeClass("none");
			$(".screen1").addClass("none");
			$(".screen2").removeClass("none");
			H.activity.lyTips(nickName);
			H.activity.tip_text($(".screen2"),"数据正计算中,请稍后",true);
  		}else{
	  		$(".screen2").removeClass("none");
			$(".screen1").addClass("none");
			if(H.activity.recordTime >3){
				H.activity.tip_text($(".screen2"),"数据正计算中,请稍后",true);
				H.activity.lyTips();
				$(".screen1").removeClass("none");
				H.activity.flashTip();
				$(".screen2").addClass("none");
				return;
			}else{
				H.activity.gameRes (2000,false);
			}	
		}
  	}
 })(Zepto)
 $(function() {
    H.activity.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.activity.isError){
                    H.activity.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });

    wx.error(function(res){
        H.activity.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});
