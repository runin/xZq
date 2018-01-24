/**
 * 抽奖
 */
(function($) {
    H.lottery = {
        nowTime :null,
        isCanShake:true,
        times:0,
        isToLottey:true,
        first: true,
        lotteryTime:getRandomArbitrary(1,3),
        yaoBg:[],
        canJump:true,
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
        init : function(){
            this.refreshDec();
            this.current_time();
            this.event();
            this.shake();
            this.red_record();
            this.ddtj();	
        },
        ddtj : function(){
  			getResult('api/common/promotion', {oi:openid}, 'commonApiPromotionHandler',true);
  		},
        event: function() {
            $("#test").click(function(e){
                H.lottery.shake_listener();
            });
            $(".ddtj-box").click(function(e){
				e.preventDefault();
				shownewLoading();
				window.location.href = $(this).attr("data-href");
			})
             $("#btn-prize").click(function(e){
               	e.preventDefault();
               	if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				shownewLoading();
				H.lottery.isCanShake = false;
               	H.dialog.prize_record.open();
            });
            $("#btn-jump").click(function(e){
               	e.preventDefault();
               	if($(this).hasClass("requesting")){
					return;
				}
			    $(this).addClass("requesting");
                shownewLoading();
                window.location.href = "http://tv.cctv.com/lm/xcfzjc";
                setTimeout(function(){
                	 $("#btn-jump").removeClass("requesting")
                },2000);
                return;
            });
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        scroll: function() {
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
                            $(me).find('ul li:first').appendTo($ul)
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
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
        //查抽奖活动接口
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
        //接口返回false，没有查到抽奖活动
        change: function(){
            hidenewLoading();
            H.lottery.isCanShake = false;
            H.lottery.type = 0;
            $(".countdown-tip").html("更多精彩，敬请期待");
            $(".detail-countdown").addClass("none");
            $(".countdown").removeClass("none");
        },
        //接口报错，安全模式
        safeMode: function(){
            hidenewLoading();
            H.lottery.isCanShake = true;
            H.lottery.type = 2;
            $(".countdown").addClass("none");
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
            	H.lottery.wxConfig();
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    if (me.crossLotteryFlag) {
                        me.type = 1;
                        me.crossCountdown(prizeActList[prizeLength - 1].nst);
                    } else {
                        H.lottery.type = 3;
	                    toUrl("end.html");
                    }
                    return; 
                }
                //config微信jssdk
                
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
        // 距下次摇奖开启倒计时
        beforeShowCountdown: function(pra) {
        	var me = this;
            me.type = 1;
            me.isCanShake = false;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $(".countdown-tip").html('距摇奖开启还有 ');
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
            if(pra.bi.length>0){
                me.yaoBg = pra.bi.split(",");
            }
            me.downloadImg();
            //如果弹层是打开的则不能摇
            if(!me.isOpen){
            	me.isCanShake = true;
            }
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("none");
            $(".countdown-tip").html("距摇奖结束还有");
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
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("none");
            $(".countdown-tip").html('距本轮摇奖开始还有');
            me.count_down();
            $('.countdown').removeClass('none');
            me.repeatCheck = true;
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + ':'+'%M%' + ':' + '%S%' + '', // 还有...结束
                    stpl : '%H%' + ':'+'%M%' + ':' + '%S%' + '', // 还有...开始
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
	                            		// 如果已经是最后一轮摇奖倒计时结束 跳到结束页
		                                H.lottery.type = 3;
		      							if(H.lottery.canJump){
		      								toUrl("end.html");
		      							}
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
        imgMath: function() {//随机背景
            if(H.lottery.yaoBg.length >0){
                var i = Math.floor((Math.random()*H.lottery.yaoBg.length));
                $("body").css({
                	"backgroundImage":"url('"+H.lottery.yaoBg[i]+"')",
                	"background-repeat": "no-repeat",
					"background-size": "100% auto",
					"background-position": "center center"
				});
            }
        },
        shake_listener: function() {
        	//如果弹层打开着
            if(H.dialog.isOpen){
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
            if(!$(".home-box").hasClass("yao")) {
                $("#audio-a").get(0).play();
                $(".yao-cool-tips").removeClass("yaonone-text");
                $(".home-box .m-t-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,-76px)'
                });
                $(".home-box .m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,76px)'
                });
                setTimeout(function(){
                    $(".home-box .m-t-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .7s ease'
                    });
                    $(".home-box .m-f-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .7s ease'
                    });
                }, 1200);
                $(".home-box").addClass("yao");
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
        	//查询最新20条中奖记录
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        downloadImg: function(){
            $(".preImg").remove();
            var t = simpleTpl();
            for(var i = 0;i < H.lottery.yaoBg.length;i++){
                t._('<img class="preImg" src="'+H.lottery.yaoBg[i]+'" style="width:0px;heigth:0px;">')
            }
            $("body").append(t.toString());
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
                url : domain_url + 'api/lottery/luck'+dev,
                data: { oi: openid , sn : sn},
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
        textMath: function() {//随机文案
            var me = this;
            if(textList.length >0){
                var i = Math.floor((Math.random()*textList.length));
                return textList[i];
            }
        },
        luckResult : function(data){
        	setTimeout(function(){
        		setTimeout(function() {
	                $(".home-box").removeClass("yao");
	                H.lottery.imgMath();
	            },300);
	            if(data == null || data.result == false || data.pt == 0){
	                $("#audio-a").get(0).pause();
	                H.dialog.thank.open(H.lottery.textMath());
	                return;
	            }else{
	                $("#audio-a").get(0).pause();
	                $("#audio-b").get(0).play();//中奖声音
	                H.dialog.lottery.open(data);
	            }
        	},2000)
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
			$(".ddtj").removeClass("none");
		}else{
			$(".ddtj").addClass("none");
		}
    }
})(Zepto);


$(function() {
    shownewLoading();
   
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
