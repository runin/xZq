(function($) {
    H.lottery = {
    	pra : null,
    	istrue: false,
        $rule_close: $('.rule-close'),
        isCanShake:false,//是否可以摇一摇
        isToLottey:true,//是否调接口
        isTimeOver:false,//是否抽奖结束
        nowTime : null,
        repeat_load : true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        istrue:true,
        first: true,
        times : 0,
        jifenUid : null,
//      thankshow:[],
		yaoBg:null,
        wxCheck :false,
        isError :false,
        isAllEnd : false,
        type : null,
        dec : 0,
        index : 0,
        istrue : true,
        lotteryTime:getRandomArbitrary(1,5),//每隔几次调接口
        init : function(){
        	var me = this;
            me.event();
			me.current_time();
            me.shake();
            me.account_num();
        	me.red_record();
//      	H.lottery.thankshow();
        	me.jifen();
        	me.refreshDec();
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
            $("#btn-postCard").click(function(e){
            	e.preventDefault()
            	toUrl("postcard.html");
            });
			$("#btn-rank").click(function(e) {
				e.preventDefault();
				H.dialog.rank.open();
				
			});
        },
        refreshDec:function(){
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000*5*Math.random() + 60000*3);
            setInterval(function(){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/common/time',
                    data: {},
                    dataType : "jsonp",
                    jsonpCallback : 'commonApiTimeHandler',
                    timeout: 11000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.t){
                            var nowTime = Date.parse(new Date());
                            H.lottery.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
//      thankshow :function(){
//      	 getResult('api/linesdiy/info', {oi: openid}, 'callbackLinesDiyInfoHandler',true);
//      },
        jifen :function(){
        	 getResult('api/comments/topic/round', {oi: openid}, 'callbackCommentsTopicInfo',true);
        },
		scroll: function(options) {
			$('.marquee').each(function(i) {
				var me = this, com = [], delay = 1000;
				var len  = $(me).find('li').length;
				var $ul = $(me).find('ul');
				var hei = $(me).find('ul li').height();
				if (len == 0) {
					$(me).addClass('hidden');
				} else {
					$(me).removeClass('hidden');
				}
				if(len > 1) {
					com[i] = setInterval(function() {
						
						$(me).find('ul').animate({'margin-top': -hei+'px'}, delay, function() {
							$(me).find('ul li:first-child').appendTo($ul)
							$(me).find('ul').css({'margin-top': '0'});
						});
					}, 3000);
				};
			});
		},
        shake_listener: function() {
	        recordUserOperate(openid, "平凡的世界摇奖页", "tv_hebie_world");
	        recordUserPage(openid, "平凡的世界摇奖页", 0);
	       	if(!H.lottery.isCanShake){
	       		return; 
            }
	       	if(H.lottery.type != 2) {
	       		return;
	       	}
	       	H.lottery.isCanShake = false;
            H.lottery.times++;
            if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                H.lottery.isToLottey = false;
            }
            
	        if(!$(".home-box").hasClass("yao")) {
	          	$(".yao-text").removeClass("yaonone-text");
//				$("#audio-a").get(0).play();
				$("#audio-a").get(0).play();
                $(".m-t-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,-100px)'
                });
                $(".m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,100px)'
                });
                setTimeout(function(){
                    $(".m-t-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                    $(".m-f-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                }, 700);
				$(".home-box").addClass("yao");
	        }else{
	          	return;
	        }
	        if(!openid || openid=='null' || H.lottery.isToLottey == false ){
	            setTimeout(function(){
	            	H.lottery.fill(null);//摇一摇
	            }, 1000);
	        }else{
//	        	 if(!H.lottery.wxCheck){
//                  //微信config失败
//                  setTimeout(function(){
//                      H.lottery.fill(null);//摇一摇
//                  }, 2000);
//                  return;
//              }
	            setTimeout(function(){
	        	  H.lottery.award();
	            }, 1000);
	        }
	        H.lottery.isToLottey = true;
        },
		red_record: function(){
			getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
		},
            //查抽奖活动接口
        current_time: function(){
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round',
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                	hidenewLoading();
                    if(data.result == true){
                        H.lottery.nowTime = timeTransform(data.sctm);
                        var nowTime = Date.parse(new Date())/1000;
                        var serverTime = timestamp(H.lottery.nowTime);
                        // 计算服务器时间和本地时间的差值，并存储
                        H.lottery.dec = (nowTime - serverTime);
                        H.lottery.currentPrizeAct(data);
                        $(".downContTime").removeClass("none");
                    }else{
                        if(H.lottery.repeat_load){
                            H.lottery.repeat_load = false;
                            setTimeout(function(){
                                H.lottery.current_time();
                            },500);
                        }else{
                        	$(".text-tip").html("活动尚未开始");
                        	$(".downContTime").addClass("none");
                        	$(".time-text").removeClass("hidden");
                        	
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                	$(".text-tip").html("活动尚未开始");
                    $(".downContTime").addClass("none");
                    $(".time-text").removeClass("hidden");
                }
            });
        },
        currentPrizeAct:function(data){
           //获取抽奖活动
            var prizeActList = data.la,
                prizeLength = prizeActList.length,
                nowTimeStr = H.lottery.nowTime
                me = this;
                H.lottery.yaoBg = prizeActList[0].bi;
                H.lottery.pra = prizeActList;
            if(H.lottery.yaoBg){
            	$(".home-box-bg").css({
	            	"background" : "url("+H.lottery.yaoBg+") no-repeat center",
	            	"background-size" : "cover"
	            })
            }
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                	H.lottery.type = 3;
                   	H.lottery.change();
                    return;
                }
                //config微信jssdk
                //H.lottery.wxConfig();
                //第一轮摇奖开始之前，显示倒计时
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                    	H.lottery.index = i;
                        H.lottery.nowCountdown(prizeActList[i]);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                    	H.lottery.index = i;
 						H.lottery.beforeShowCountdown(prizeActList[i]);
                        return;
                    }

                }
            }else{
               $(".time-text").html('敬请期待!')
                return;
            }
        },
              // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            H.lottery.isCanShake = false;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
 			beginTimeLong += H.lottery.dec;
            $(".text-tip").html('距摇奖开启还有 ');
            $('.downContTime').attr('etime',beginTimeLong);
            $(".time-text").removeClass("hidden");
            H.lottery.count_down();
            H.lottery.istrue = true;
            H.lottery.type = 1;
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            H.lottery.isCanShake = true;
            H.lottery.isLottery = true ;
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
      		beginTimeLong += H.lottery.dec;
            $('.downContTime').attr('etime',beginTimeLong);
            $(".text-tip").html("距本轮摇奖结束还有");
            H.lottery.count_down();
            H.lottery.istrue = true;
            $(".time-text").removeClass("hidden");
            H.lottery.type = 2;
            H.lottery.index ++;
            hidenewLoading();
        },
        count_down : function() {
            $('.downContTime').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%'+'时'+'%M%' + '分' + '%S%'+'秒', // 还有...结束
                    stpl : '%H%'+'时'+'%M%' + '分' + '%S%'+'秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        // isTimeOver 用来进行重复判断默认为false，第一次进入之后变为true
                       
                        if(H.lottery.istrue){
                        	H.lottery.istrue = false;
                        	if (H.lottery.type == 1) {              
                                    H.lottery.nowCountdown(H.lottery.pra[H.lottery.index]);
                            } else if (H.lottery.type == 2) {
                                   //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
	                            if(H.lottery.index >= H.lottery.pra.length){
	                                // 如果已经是最后一轮摇奖倒计时结束 则显示 今日摇奖结束
	                                H.lottery.change();
	                                H.lottery.type = 3;
	                                return;
	                            }
	                           
	                            H.lottery.beforeShowCountdown(H.lottery.pra[H.lottery.index]);
                            } 
                        }
                            
                    },
                    sdCallback :function(){
//                  	H.lottery.istrue = true;
                    }
                });
            });
        },
         //查询当前参与人数
        account_num: function(){
		       getResult('log/serpv ', {}, 'callbackCountServicePvHander');
		},
		    
        change: function(){
        	H.lottery.isCanShake = false;
			$(".time-text").html('本期摇奖已经结束!').removeClass("hidden");
        },
        award :function(){
        	var me = this;
            var sn = new Date().getTime()+'';
            me.lotteryTime = getRandomArbitrary(1,5);
            me.times = 0;
            shownewLoading();
             $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: { oi: openid ,sau : H.lottery.jifenUid, sn : sn},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.result){
                        if(data.sn == sn){
                            sn = new Date().getTime()+'';
                            H.lottery.fill(data);
                        }else{
                        	sn = new Date().getTime()+'';
                        	H.lottery.fill(null);
                        }
                    }else{
                        sn = new Date().getTime()+'';
                        H.lottery.fill(null);
                    }
                },
                error : function() {
                    sn = new Date().getTime()+'';
                    H.lottery.fill(null);
                }
            });
        },
        fill : function(data){
            setTimeout(function() {
	            $(".home-box").removeClass("yao");
	        },500);
        	if(data == null || data.result == false){
        		$("#audio-a").get(0).pause();
        		$(".yao-text").addClass("yaonone-text");
		        $("#audio-a").get(0).pause();
		       // $("#audio-c").get(0).play();//不中奖声音
				 setTimeout(function() {
	                H.lottery.isCanShake = true;
	            },500);
				return;
        	}else{
        		if(data.pt == 0){
        			$(".yao-text").addClass("yaonone-text");
		        	$("#audio-a").get(0).pause();
		        	//$("#audio-c").get(0).play();//不中奖声音
					setTimeout(function() {
		                H.lottery.isCanShake = true;
		            },500);
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
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            getResult("mp/jsapiticket", {
                appId: shaketv_appid
            }, 'callbackJsapiTicketHandler', false);
        }
    };
	W.callbackJsapiTicketHandler = function(data) {
        var url = window.location.href.split('#')[0];
        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
        var timestamp = Math.round(new Date().getTime()/1000);
        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
        //权限校验
        wx.config({
            debug: true,
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
	W.callbackCountServicePvHander = function(data){
		if(data.code == 0){
			$(".num").html(data.c).removeClass("hidden");
			$(".spon").removeClass("none");
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
    wx.ready(function () {
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
    });

    wx.error(function(res){ 
        H.lottery.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});
