(function($) {
    H.lottery = {
        ruuid : 0,
        $rule_close: $('.rule-close'),
        $btnRule: $('#btn-rule'),
        isLottery :false,
        nowTime :null,
        wxCheck:false,
		isError:null,
        isCanShake:true,
        times:0,
        thank_times:0,
        isToLottey:true,
        isTimeOver:false,
        isLotteryTime:false,
        first: true,
        lotteryTime:getRandomArbitrary(1,2),
        pidJson:{},
        yaoBg:[],
        pidArr:[], //存放直接领奖活动中的奖品uuid
        przDateStr:null,
        init : function(){
        	var rp = getQueryString("rp");
			if(rp != "" && rp != null){
				H.dialog.rptip.open("领取成功");
			}
            this.event();
			this.current_time();
            this.shake();
            this.getPrizesids();
			this.link();
        	H.lottery.red_record();
            setInterval(function(){
            	H.lottery.red_record();
           },10000);
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
               	  	showLoading();
               	  	setTimeout(function(){
               	  		 H.lottery.drawlottery();
               	  	},getRandomArbitrary(1, 3)*1000) 
                  } 
               }else{
               		return;
               }
                
            });
            
            this.$btnRule.click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
            // $("#test").click(function(e){
            //     e.preventDefault();
            // 	H.lottery.shake_listener();
            // });
           	// $('#confirm').click(function(e) {
            //     e.preventDefault();
            //     H.dialog.lottery.open();
            //     $('#not-lott').addClass('none');
           	// });
        },
        getPrizesids:function(){
        	getResult('api/lottery/prizes', {
        		at:5
        	}, 'callbackLotteryPrizesHandler');
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
	          recordUserOperate(openid, "山东卫视继承者们摇奖页", "tv_sdtv_jczm");
	          recordUserPage(openid, "山东卫视继承者们摇奖页", 0);
	          H.lottery.times++;
	
	         if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
	        	  H.lottery.isToLottey = false;
	          }
//	          if(H.lottery.thank_times >= 10){
//	        	  H.lottery.isToLottey = false;
//	          }
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
		     getResult('api/lottery/round',{openid:openid},'callbackLotteryRoundHandler',true);
		},
		downloadImg: function(){
			var t = simpleTpl();
			for(var i = 0;i < H.lottery.yaoBg.length;i++){
				t._('<img src="'+H.lottery.yaoBg[i]+'" style="width:0px; ">')
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
							showLoading();
							var delay = Math.ceil(2500*Math.random() + 1700);
						    setTimeout(function(){
								hideLoading();
						    	getResult('api/lottery/round',{openid:openid},'callbackLotteryRoundHandler',true);
						    	}, delay);
						}
						return;
					},
					sdCallback :function(){
						H.lottery.isTimeOver = false;
					}
				});
			});
		},
        drawlottery:function(){
        	showLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck',
                data: { matk: matk},
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
        	if(data == null || data.result == false ){
        		$("#audio-a").get(0).pause();
        		// $("#audio-c").get(0).play();//不中奖声音
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
        	if(data.result){
        		data = is_undefined_null(data);
        	}
        	
        	W.dataPt=data.pt;
        	        	//alert(data.pt);
        	if(data.pt == 4){//现金红包
        		H.dialog.redpaperImg.open(data);
    			return;
    		}else if(data.pt==3){	//车点点
        		H.dialog.chediandian.open(data);
        		return;
        	}else if(data.pt==6){	//谢谢
        		H.dialog.noprize.open(data);
        		return;
        	}
        	else if(data.pt==9){    //同城旅游
        		H.dialog.tongcheng.open(data);
        		return;
        	}else if(data.pt==1){	//沃百富 (实物奖品)
        		H.dialog.wobaifu.open(data);
        		return;
        	}else if(data.pt==2){	//天天淘金 (积分奖品)
        		H.dialog.tiantiantaojin.open(data);
        		return;
        	}else if(data.pt==6){	//天天淘金 (积分奖品)
        		H.dialog.tiantiantaojin.open(data);
        		return;
        	}else if(data.pt == 7){
//      			if(!H.lottery.wxCheck){
//						    //微信config失败
//						  		 //不调用抽奖接口，直接谢谢参与
//						  		 $("#audio-a").get(0).pause();
//				        		// $("#audio-c").get(0).play();//不中奖声音
//				                $(".texta").addClass("none");
//				                H.lottery.textMath();
//				                $(".textb").removeClass("none");
//								$(".textb").addClass("yaonone-text").show();
//								H.lottery.isCanShake = true;
//							return false;
//			 		}
        		
        		
        		H.dialog.cardInfo.open(data);
        		return false;
        	}else if(data.pt == 5){
        		
        			H.dialog.duihuanma.open(data);
        		return false;
        	}
        	
            H.dialog.lottery.open();
            H.dialog.lottery.update(data);
         
        },
        lottery_point : function(data){
        	H.lottery.fill(data);
        	
        },
        
        wx_card:function(data){
				//卡券
				wx.addCard({
				cardList: [{
				cardId: data.ci,
				cardExt: "{\"timestamp\":\""+ data.ts +"\",\"signature\":\""+ data.si +"\"}"
				}],
				
				success: function (res) {
					   // 成功拉取微信卡券页面，并且用户成功领取之后 会回调 success
					   // 用户成功领取之后 可以让其继续 抽奖。
					H.lottery.wxCheck = true; 
					   // 调用领奖接口，改变中奖记录状态为 ”中奖已领取“ 
					getResult('api/lottery/award', {
					oi: openid,
					hi: headimgurl,
					nn: nickname
					}, 'callbackLotteryAwardHandler');
					
					
				},
				
				fail: function(res){
				   // 如果出错， 上报错误信息。
					recordUserOperate(openid, res.errMsg, "card-fail");
					H.lottery.isCanShake = true;
					hideLoading();
				},
				complete:function(){
				   // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
				   // 拉起微信卡券之后 清除 上边的 15秒的 setTimeout();
				clearTimeout(W['to']);
				H.lottery.isCanShake = true;
				hideLoading();
				},
				
				cancel:function(){
				   // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
				H.lottery.isCanShake = true;
				hideLoading();
				}
				});
			},
        
        WxConfig:function(){
			//后台获取jsapi_ticket并wx.config
			getResult("mp/jsapiticket", {
			appId: shaketv_appid    //当前互动所属频道的摇电视 appid ， 如果是要发惊喜连连的卡券 appid 为 ”wx3ba142cf8c3fc698“
			}, 'callbackJsapiTicketHandler', false);
		
        },
		link: function() {
			$('#link-out').addClass('none');
			getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
		}
    };



	// 在回调函数中调用wx.config
		  W.callbackJsapiTicketHandler = function(data) {
				  var url = window.location.href.split('#')[0]; //获取当前页面url
				  var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361'; //生成签名的随机串 这个值就用当前这个字符串就可以，不用更改。
		  		  var timestamp = Math.round(new Date().getTime()/1000); //生成签名的时间戳
		  			// 签名 , 使用 后端返回的 ticket ， URL，timestamp， noceStr 作sha1加密生成签名。具体可参考js-skd的签名算法
		  			// 使用 hex_shal() 方法需引入 sha1.min.js ，见附件。 
		  		  var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
				 //权限校验
				  wx.config({
				   debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，所以 建议在开发测试过程中打开debug（debug:true） ,用来检查config是否ok以及checkJsApi是否成功。正式上线后关闭。
				   appId: shaketv_appid, //当前互动所属频道的摇电视 appid
				   timestamp: timestamp,
				   nonceStr:nonceStr,
				   signature:signature,
				   jsApiList: [ // 需要配置的功能列表
				   "addCard", // 添加卡券功能
				   "checkJsApi" // 判断当前客户端版本是否支持指定JS接口
				   ]
				  });
				  
				  
				    // config信息验证后会执行ready方法，该方法不用显式调用，config之后会自动回调到该方法。同时config方法为异步执行，不影响正常业务代码的执行。
				  wx.ready(function () {
				  // config ready之后调用checkJsApi 来判断当前客户端版本是否支持“addCard”方法。
					  wx.checkJsApi({
					   jsApiList: [
					   'addCard'
					   ],
					   success: function (res) {
							   var t = res.checkResult.addCard;
							   //判断checkJsApi 是否成功 以及 wx.config是否error
							   if(t && !H.lottery.isError){
							    // wxCheck 用来判断config是否成功，已经checkJsApi是否成功。默认为false。
							    H.lottery.wxCheck = true;
							   }
					   }
					  });
				  });
				  
				  
				    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看
				  wx.error(function(res){
					  H.lottery.isError = true;
					  // isError 用来判断config是否进入error 默认为false。
				  });

				  
		  };
    W.callbackLotteryRoundHandler = function(data){
		if(data.result == true){
			H.lottery.WxConfig();
			H.lottery.przDateStr = timeTransformDay(data.sctm);
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
	
	W.callbackLotteryPrizesHandler = function(data){//获取领取活动中的奖品uuid
		if(data.result){
			jsArrSort(data.pa);
			for(var index in data.pa){
				H.lottery.pidArr.push(data.pa[index].id);
				
			}
		}
	};
	W.commonApiPromotionHandler = function(data){
		if (data.code == 0 && data.url) {
			$('#link-out').attr('href', "javascript:void(0);").removeClass('none');
			$('#link-out').click(function(){
				location.href = data.url;
			});
			$('#link-out').find("p").text(data.desc);
		} else {
			$('#link-out').remove();
		}
	};
})(Zepto);

$(function() {
    H.lottery.init();
});
