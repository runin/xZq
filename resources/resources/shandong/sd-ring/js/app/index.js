(function($) {
	H.index = {
		slideTo: getQueryString('rp') || '',
		voiceFlag: true,
		init: function() {
			var me = this, delay = Math.ceil(5000*Math.random() + 1000), winW = $(window).width(), winH = $(window).height();
			this.event();
			this.swiperInit();
			this.showCover();
			$('body').css({
				'width': winW,
				'height': winH
			});
		},
		event: function() {
			var me = this;
			$('.icon-voice').click(function(e) {
				e.preventDefault();
				if (H.index.voiceFlag) {
					H.index.voiceFlag = false;
					var cdVoice = document.getElementById("cd-voice");
					cdVoice.addEventListener('ended',
					function() {
						$('.cd-voice').removeClass('play');
						$('.cd-voice').get(0).pause();
						$('.cd-voice').get(0).currentTime = 0.0;
						$('.icon-voice').removeClass('icon-voice-play');
					},
					false);
				};
				if ($('.cd-voice').hasClass('play')) {
					$('.cd-voice').removeClass('play');
					$('.cd-voice').get(0).pause();
					$('.cd-voice').get(0).currentTime = 0.0;
					$('.icon-voice').removeClass('icon-voice-play');
				} else {
					$('.cd-voice').addClass('play');
					$('.cd-voice').get(0).play();
					$('.icon-voice').addClass('icon-voice-play');
				};
			});
		},
		swiperInit: function() {
			scaleW = window.innerWidth / 320;
			scaleH = window.innerHeight / 480;
			var resizes = document.querySelectorAll('.resize');
			for (var j = 0; j < resizes.length; j++) {
				resizes[j].style.width = parseInt(resizes[j].style.width) * scaleW + 'px';
				resizes[j].style.height = parseInt(resizes[j].style.height) * scaleH + 'px';
				resizes[j].style.top = parseInt(resizes[j].style.top) * scaleH + 'px';
				resizes[j].style.left = parseInt(resizes[j].style.left) * scaleW + 'px';
			};
            H.lottery.init();
			var mySwiper = new Swiper('.swiper-container', {
				direction: 'vertical',
				onSlideChangeEnd: function(swiper) {
					var activeIndex = parseInt(mySwiper.activeIndex);
					if (activeIndex == 0) {
						H.lottery.active = false;
					}else{
						H.lottery.active = true;
					}
				}
			});
			if(getQueryString("slide")&&getQueryString("slide")==1){
				mySwiper.slideTo(1);
			}
		},
		showCover: function() {
			$('.cover1').removeClass('none');
			$('.cover-box .cover1').animate({'opacity':'1','-webkit-transform':'scale(1,1)'}, 1200, function(){
				$('.cover-box .cover1 .slogan, .cover-box .tips, .cover-box .sponsor-logo').animate({'opacity':'1'}, 1000);
			});
		}
	};

   H.lottery = {
        nowTime :null,
        isCanShake:true,
        times:0,
        isToLottey:true,
        first: true,
        lotteryTime:getRandomArbitrary(1,3),
        allRecordTime: Math.ceil(4000*Math.random() + 10000),
        type:2, //判断倒计时形式 1为抽奖开始之前，2为抽奖正在进行 默认为2 ,3为今日抽奖已结束,0未查到抽奖活动轮次信息
        dec:0,
        index:0,
        repeatCheck:true,//倒计时重复回调开关
        pal:null,
        wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        crossLotteryCanCallback:false,
        crossLotteryFlag:false,
        $textb : $(".textb"),
        active : false,
        init : function(){
            this.refreshDec();
            this.current_time();
            this.shake();
            this.red_record();
            this.event();   
        },
        showCard :function(){
        	var me = this;
        	if(localStorage.award&&localStorage.award == 'awarded' &&localStorage.url){
				H.dialog.lottery.open();
			}
        },
        event: function() {
            $("#test").click(function(e){
                H.lottery.shake_listener();
            });
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        scroll: function() {
            // 左滚动
	         $("#marqueen").marqueen({
	            mode: "top",	//滚动模式，top是向上滚动，left是朝左滚动
				container: "#marqueen ul",	//包含的容器
	            row: 1,	//滚动行数
	            speed: 60,	//轮播速度，单位ms
	            fixWidth: 20	//解决Zepto无法计算元素margin，padding在内的width，只有mode=left时有效
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
                            var nowTime = new Date().getTime();
                            H.lottery.dec = (nowTime - data.t);
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
        current_time: function(){
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.result == true){
                        H.lottery.nowTime = timeTransform(data.sctm);
                        var nowTime = Date.parse(new Date());
                        H.lottery.dec = (nowTime - data.sctm);
                        H.lottery.currentPrizeAct(data);
                    }else{
                        H.lottery.change();
                    }
                },
                error : function(xmlHttpRequest, error) {
                     H.lottery.safeMode();
                }
            });
        },
        //活动结束
        end: function(){
        	hidenewLoading();
        	H.lottery.isCanShake = false;
            H.lottery.type = 3;
            $(".wait").removeClass("hidden").animate({"opacity" : "1"},1000);
            $(".home-box").addClass("hidden");
            $(".countdown-tip").html("本期摇奖已结束");
            $(".detail-countdown").addClass("none");
            $(".countdown").removeClass("none");
           
        },
        //接口返回false，没有查到抽奖活动
        change: function(){
            hidenewLoading();
            H.lottery.isCanShake = false;
            H.lottery.type = 0;
            $(".wait").removeClass("hidden").animate({"opacity" : "1"},1000);
            $(".home-box").addClass("hidden");
            $(".countdown-tip").html("本期摇奖已结束");
            $(".detail-countdown").addClass("none");
            $(".countdown").removeClass("none");
            
        },
        //接口报错，安全模式
        safeMode: function(){
            hidenewLoading();
            H.lottery.isCanShake = true;
            H.lottery.type = 2;
             $(".wait").addClass("hidden").animate({"opacity" : "0"},1000);
            $(".countdown").addClass("none");
            $(".home-box").removeClass("hidden");
        },
  		currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.lottery.nowTime,
                prizeActList = [],
                me = this,
                day = nowTimeStr.split(" ")[0];
            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            if(prizeActList.length >0){
            	H.lottery.pal = prizeActList;
	            prizeLength = prizeActList.length;
	              // 判断是否为跨天摇奖 配置文件中crossdayLimit跨天摇奖阀值，默认2h
	            var lastLotteryEtime = prizeActList[prizeLength - 1].pd + ' ' + prizeActList[prizeLength - 1].et;
	            var lastLotteryNtime = prizeActList[prizeLength - 1].nst;
	            var crossDay = timeTransform(new Date().setDate(new Date(lastLotteryEtime).getDate() + 1)).split(" ")[0];
	            var minCrossDay = crossDay + ' 00:00:00';
	            var maxCrossDay = timeTransform(new Date(minCrossDay).getTime() + crossdayLimit);
	            if(comptime(lastLotteryNtime, minCrossDay) <= 0 && comptime(lastLotteryNtime, maxCrossDay) >= 0) {
	                me.crossLotteryFlag = true;
	            } else {
	                me.crossLotteryFlag = false;
	            }
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    if (me.crossLotteryFlag) {
                        me.crossCountdown(prizeActList[prizeLength - 1].nst);
                    } else {
                        H.lottery.type = 3;
	                    H.lottery.end();
                    }
                    return; 
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        H.lottery.index = i;
                        H.lottery.nowCountdown(prizeActList[i]);
                        hidenewLoading();
                        // 可以抽奖的时候再去调用中奖纪录接口
                        setInterval(function(){
                            H.lottery.red_record();
                        },this.allRecordTime);
                        return;
                    }
                    // 据下次摇奖开始
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        H.lottery.index = i;
                        H.lottery.beforeShowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                }
            }else{
                H.lottery.change();
            }
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
                                   'addCard',
                                   "checkJsApi"
                            ]
                        });
                    }

                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        // 距下次摇奖开启倒计时
        beforeShowCountdown: function(pra) {
        	var me = this;
            me.type = 1;
            me.isCanShake = false;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $(".wait").removeClass("hidden").animate({"opacity" : "1"},1000);
            $(".home-box").addClass("hidden");
            $(".countdown-tip").html('距本轮摇奖开始还有  ');
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("none");
            me.count_down();
            $('.countdown').removeClass('none');
            me.repeatCheck = true;
            hidenewLoading();
        },
        // 距本轮摇奖结束倒计时
        nowCountdown: function(pra){
        	var me = this;
            me.type = 2;
            //如果弹层是打开的则不能摇
            if(!H.dialog.isOpen){
            	me.isCanShake = true;
            }

            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $(".wait").addClass("hidden").animate({"opacity" : "0"},1000);
            $(".home-box").removeClass("hidden");
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("none");
            $(".countdown-tip").html("距本轮摇奖结束还有");
            me.count_down();
            $(".countdown").removeClass("none");
            me.index ++;
            me.repeatCheck = true;
            hidenewLoading();
        },
        // 跨天摇奖开启倒计时
        crossCountdown: function(nextTime) {
            var me = this;
            me.isCanShake = false;
            me.crossLotteryFlag = false;
            me.crossLotteryCanCallback = true;
            me.type = 1;
            var beginTimeLong = timestamp(nextTime);
            beginTimeLong += me.dec;
            $(".wait").removeClass("hidden").animate({"opacity" : "1"},1000);
            $(".home-box").addClass("hidden");
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("none");
            $(".countdown-tip").html('距本轮摇奖开始还有 ');
            me.count_down();
            $('.countdown').removeClass('none');
            me.repeatCheck = true;
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + ':'+'%M%' + ':' + '%S%' , // 还有...结束
                    stpl : '%H%' + ':'+'%M%' + ':' + '%S%' , // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                    	if(H.lottery.repeatCheck){
	                        H.lottery.repeatCheck = false;
	                        $(".countdown-tip").html("请稍后");
	                        $('.detail-countdown').addClass("none");
	                        if(H.lottery.type == 1){
	                        	if(H.lottery.crossLotteryCanCallback){
	                        		var delay = Math.ceil(1000*Math.random() + 500);
                                    H.lottery.crossLotteryCanCallback = false;                                 
                                    shownewLoading(null, '请稍后...');
                                    setTimeout(function(){
                                        H.lottery.current_time();
                                    }, delay);
                                    return;
	                        	}
	                            //距下次摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
	                            H.lottery.nowCountdown(H.lottery.pal[H.lottery.index]);
	                        }else if(H.lottery.type == 2){
	                            //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
	                            if(H.lottery.index >= H.lottery.pal.length){
	                            	//跨天倒计时
	                            	if(H.lottery.crossLotteryFlag){
	                            		 H.lottery.crossCountdown(H.lottery.pal[H.lottery.pal.length - 1].nst);
	                            	}else{
	                            		// 如果已经是最后一轮摇奖倒计时结束 
		                                H.lottery.end();
	                            	}
	                            	return;
	                             }
	                            H.lottery.beforeShowCountdown(H.lottery.pal[H.lottery.index]);
	                         }
	                    }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
       shake_listener: function() {
        	//如果弹层打开着
        	if($(".home-box").parents(".swiper-slide").hasClass(".swiper-slide-active")){
        		H.lottery.active = true;
        	}
            if(H.dialog.isOpen||!H.lottery.active){
                return;
            }
            if(H.lottery.type != 2){
                $(".countdown").addClass("shake");
                setTimeout(function(){
                    $(".countdown").removeClass("shake");
                },1000);
                return;
            }
            if(H.lottery.isCanShake){
                H.lottery.isCanShake = false;
            }else{
                return;
            }
            H.lottery.times++;

            if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                H.lottery.isToLottey = false;
            }
            recordUserOperate(openid, "摇奖", "shakeLottery");
            recordUserPage(openid, "摇奖", 0);
            if(!$(".yao-img").hasClass("yao")) {
                $("#audio-a").get(0).play();
                $(".yao-cool-tips").removeClass("yaonone-text");
                $(".yao-img").addClass("yao");
            }
            if(!openid || openid=='null' || H.lottery.isToLottey == false){
                H.lottery.luckResult(null);//摇一摇
            }else{
                if(!H.lottery.wxCheck){
                    H.lottery.luckResult(null);//摇一摇
                    return;
                }
                H.lottery.toLottery();
            }
            H.lottery.isToLottey = true;
        },
       //查询最新20条中奖记录
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        toLottery:function(){
            var me = this;
            var sn = new Date().getTime()+'';
            shownewLoading();
            me.lotteryTime = getRandomArbitrary(1,3);
            me.times = 0;
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck'+dev,
                data: { matk: matk , sn : sn},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                timeout: 11000,
                complete: function() {
                   sn = new Date().getTime()+'';
                   hidenewLoading();
                },
                success : function(data) {
                    if(data.flow && data.flow == 1){
                        me.lotteryTime = getRandomArbitrary(3,6);
                        me.times = 0;
                        H.lottery.luckResult(null);
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            H.lottery.luckResult(data);
                        }else{
	                        H.lottery.luckResult(null);
	                    }
                    }else{
                        H.lottery.luckResult(null);
                    }
                },
                error : function() {
                    H.lottery.luckResult(null);
                }
            });
        },
        luckResult : function(data){
        	setTimeout(function(){
        		setTimeout(function() {
        			 $(".yao-img").removeClass("yao");
	            },500);
	            if(data == null || data.result == false || data.pt == 0){
	                $("#audio-a").get(0).pause();
	                 H.lottery.thanks();
	                return;
	            }else{
	                $("#audio-a").get(0).pause();
	                $("#audio-b").get(0).play();//中奖声音
	                H.dialog.lottery.open(data);
	            }
        	},1500)
        },
        thanks:function(){
            var me = this;
            $("#audio-a").get(0).pause();
            me.$textb.text(me.textMath())
            me.$textb.removeClass("none").css("opacity","0");
            me.$textb.addClass("yaonone-text").show();
            setTimeout(function(){
                me.$textb.removeClass("yaonone-text");
                me.$textb.css("opacity","0");
                if(H.lottery.type == 2){
                	me.isCanShake = true;
                }else{
                	me.isCanShake = false;
                } 
            },2000);
        },
        textMath: function() {//随机文案
            var me = this;
            if(textList.length >0){
                var i = Math.floor((Math.random()*textList.length));
                return textList[i];
            }
        }
    };
     W.callbackLotteryAllRecordHandler = function(data){
    	if(data&&data.result){
			var list = data.rl;
			 if(list && list.length>0){
			     var con = "";
			     for(var i = 0 ; i<list.length; i++){
			       con +="<li><span>"+(list[i].ni || "匿名用户")+"中了"+list[i].pn+"</span></li>";
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
 				$(".marquee").removeClass("hidden");
			  }
		}
    };
    W.commonApiPromotionHandler = function(data){
    	if(data.code == 0){
			var jumpUrl = data.url;
			$(".ddtj-text").html(data.desc);
			$(".ddtj-box").attr("data-href",jumpUrl);
			$(".ddtj-before").addClass("whole");
			$(".ddtj").removeClass("hidden");
		}else{
			$(".ddtj").addClass("hidden");
		}
    };
    W.commonApiSDPVHander = function(data){
		if(data.code == 0){
			$(".count span").html(data.c);
			$(".count").removeClass("hidden");
		}else{
			$(".count").addClass("hidden");
		}
	};
})(Zepto);

$(function() {
	H.index.init();
	//config微信jssdk
    H.lottery.wxConfig();
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
    });

    wx.error(function(res){
        H.lottery.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});