(function($) {
    H.lottery = {
        ruuid : 0,
        $rule_close: $('.rule-close'),
        $btnRule: $('#btn-rule'),
        isLottery :false,
        nowTime :null,
        //是否能摇奖
        isCanShake:true,
        times:0,
        thank_times:0,
        isToLottey:true,
        //没有倒计时在进行，不能摇
        isTimeOver:false,
        //非摇奖时间，不能摇
        isLotteryTime:false,
        first: true,
        lotteryTime:getRandomArbitrary(3,6),
        yaoBg:[],
        init : function(){
        	H.lottery.shake();
        	var rp = getQueryString("rp");
			if(rp != "" && rp != null){
				H.dialog.rptip.open("领取成功");
			}
            this.event();
			this.current_time();//判断节目
            this.shake();//摇奖
        	H.lottery.red_record();
            setInterval(function(){
            	H.lottery.red_record();
           },10000);
        },
        event: function() {
            var me = this;
		    $('.go').click(function(){
				window.location.href = "http://mall.chinayanghe.com/m";
		    });
            this.$btnRule.click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$('body').delegate('#test', 'click', function(e) {
				e.preventDefault();
				me.wxCheck = true;
				me.lotteryTime = 1;
				me.shake_listener();
			});
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
   	//滚动
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
						$(me).find('ul').animate({'margin-top': '-50px'}, delay, function() {
							$(me).find('ul li:first').appendTo($ul)
							$(me).find('ul').css({'margin-top': '0'});
						});
					}, 3000);
				};
			});
		},
   //随机文案
      textMath: function() {//随机文案
            if(textList.length >0){
                var i = Math.floor((Math.random()*textList.length));;
                $(".textb").text(textList[i]);
            }
        },
     //摇奖具体 
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
	          recordUserOperate(openid, "家庭剧场摇奖页", "tv_anhui_superchild");
	          recordUserPage(openid, "家庭剧场摇奖页", 0);
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
     		 $('.jiu').addClass("an-rollin");
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
		//获得滚动信息记录
		red_record: function(){
			getResult('api/lottery/allrecord', {su:3}, 'callbackLotteryAllRecordHandler');
		},
		//判断节目		
        current_time: function(){
		     getResult('api/lottery/round',{openid:openid},'callbackLotteryRoundHandler',true);
		},
		downloadImg: function(){
			var t = simpleTpl();
			for(var i = 0;i < H.lottery.yaoBg.length;i++){
				t._('<img src="'+H.lottery.yaoBg[i]+'" style="width:0px;heigth:0px;">')
			}
			$("body").append(t.toString());
		},
		//获取抽奖活动
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
       //本期摇奖已结束，请等待下期
       change: function(){
        	H.lottery.isCanShake = false;
        	$(".countdown").removeClass("none");
			$(".countdown-tip").html('请等待下期!');

			$(".time").html('本期摇奖已结束！');
			$('.detail-countdown').html("");
        },
      //状态  
        do_count_down: function(endTimeStr,nowTimeStr,isStart){
        	if(isStart){
                H.lottery.isLotteryTime = true;
//				$(".countdown-tip").html('距离摇奖结束还有');
			$(".time").html('距离摇奖结束还有');
        	}else{
                H.lottery.isLotteryTime = false;
//  			$(".countdown-tip").html('距离摇奖开启还有');
    			$(".time").html('距离摇奖开启还有');
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
        //摇奖动作
        drawlottery:function(){

        	showLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck' + dev,
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
        //摇后跳转
        fill : function(data){
            setTimeout(function() {
                $(".home-box").removeClass("yao");
            },300);
        	if(data == null || data.result == false || data.pt == 0){ 		
        		$("#audio-a").get(0).pause();
                $(".texta").addClass("none");
//              H.lottery.textMath();
				H.dialog.noprize.open();			
                $(".textb").removeClass("none");
				$(".textb").addClass("yaonone-text").show();
				return;
        	}
        	if(data.pt == 4){
				$("#audio-a").get(0).pause();
				$("#audio-b").get(0).play();//中奖声音
        		H.dialog.redpaperImg.open(data);
    			return;
    		}
            // 微信组件下发的红包
            if(data.pt == 16) {
                shaketv.hongbao({
                    userid: openid,
                    lottery_id: data.lottery_id,
                    noncestr: data.noncestr,
                    sign: data.sign,
                    captcha: ''
                },function(d){
                    if (d.errorCode == 0) {

                        var name = data.rn? data.rn:nickname;
                        var ph = data.ph? data.ph:'';
                        var ad = data.ad? data.ad:'';

                        getResult('api/lottery/award', {
                            oi: openid,
                            rn:encodeURIComponent(name),
                            ad:encodeURIComponent(ad),
                            ph: ph
                        }, 'callbackLotteryAwardHandler', true, null,true); 
                        H.lottery.isCanShake = true;
                    }else {
                        H.dialog.noprize.open();
                    }
                }); 
                H.lottery.isLotteryTime = true;
                return;                
            }
        	if(data.pt == 9){//外链奖品
				H.dialog.hh.open(data);
    			return;
    		}
        	
        	if(data.pt == 2){
        		H.dialog.tiantiantaojin.open(data);
    			return;
    		}
            H.dialog.lottery.open();
            H.dialog.lottery.update(data);
         
        },
       //摇奖与抽奖见的链接
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
	}
	
	W.callbackLotteryAllRecordHandler = function(data){
		if(data.result){
			var list = data.rl;
			if(list && list.length>0){
				var con = "";
				for(var i = 0 ; i<list.length; i++){
					if(list[i].ni.length>=5){
						var l1=list[i].ni.substring(0,1);
						var l2=list[i].ni.substr(-1);
						list[i].ni=l1+"**"+l2;
					}
					con +="<li><div class='win-name'>"+(list[i].ni || "匿名用户")+"中了<div class='win-gift'>"+list[i].pn+"</div></div></li>";
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
    W.callbackLotteryAwardHandler = function(data) {
        if (data.result) {
            H.lottery.isCanShake = true;
            return;
        } else {
            showTips('亲，服务君繁忙~ 稍后再试哦!');
        }
    };
})(Zepto);

$(function() {
    H.lottery.init();
});
