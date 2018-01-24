(function($) {
    H.lottery = {
    	pra : null,
    	istrue: true,
        isCanShake:false,//是否可以摇一摇
        isToLottey:true,//是否调接口
        isTimeOver:false,//是否抽奖结束
        nowTime : null,
        repeat_load : true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        first: true,
        times : 0,
		yaoBg:[],
        wxCheck :false,
        isError :false,
        type : null,
        dec : 0,
        index : 0,
        leftCountPrize_init:null,
        lotteryTime:getRandomArbitrary(1,3),//每隔几次调接口
        allRecord_Init:null,
        roundIndex : 0,
        yaonum:0,
        totalnum:50,
        countKey:"44d176f36e164967a2c5b586c55eff9d-tv_henantv_fans-d29dfc6d43664bf089a787d2f8d94159",
        ticket:"",
        canJump:true,
        rp:getQueryString("rp"),
        init : function(){
        	var me = this;
            me.event();
			me.current_time();
            me.shake();
            me.account_num();
        	me.init_port();
        	me.refreshDec();
            me.initYaoNum();
            if(me.rp){
                showTips("领取成功");
            }
        },
        event: function() {
            var me = this;
            $("#test").click(function(e){
            	H.lottery.shake_listener();
            });
        },
        initYaoNum: function(){
            var me = this;
            var numCookie = $.fn.cookie(openid+"-yaonum");
            if(numCookie){
                me.yaonum = parseInt(numCookie);
            }else{
                me.yaonum = 0;
            }
            if(me.yaonum >= me.totalnum){
                //变换文案
                $(".yao-tip").text("太棒了，您已积满能量，孩子们获得了一本图书");
            }
            var percent = parseInt(me.yaonum/me.totalnum*100);
            $(".percent").text(percent);
            var windowWidth = $(window).width();
            var left = windowWidth*0.23 + windowWidth*0.59*(me.yaonum/me.totalnum);
            $(".percent").css({"left":left+"px"});
            $(".progress-bar").css({"width":percent+"%"});
            $(".yao-tip").removeClass("none");
            $(".progress").removeClass("none");
            $(".percent").removeClass("none");
            $(".coca").removeClass("none");
        },
        incrYaoNum:function(){
            var me = this;
            if(me.yaonum >= me.totalnum){
                return;
            }else{
                me.yaonum ++;
                $.fn.cookie(openid+"-yaonum",me.yaonum,{express:1});
                var percent = parseInt(me.yaonum/me.totalnum*100);
                $(".percent").text(percent);
                var windowWidth = $(window).width();
                var left = windowWidth*0.23 + windowWidth*0.59*(me.yaonum/me.totalnum);
                $(".percent").css({"left":left+"px"});
                $(".progress-bar").css({"width":percent+"%"});
                if(me.yaonum >= me.totalnum){
                    //变换文案
                    $(".yao-tip").text("太棒了，您已积满能量，孩子们获得了一本图书");
                }
                getResult("api/servicecount/incrcount",{key:me.countKey},"callbackServiceCountIncrHandler");
            }
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
                            H.lottery.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
        ad_show : function(){
        	$(".ad-randow").remove();
        	var t = simpleTpl(),n = {"1":[7,8,9],"2":[10,11,12]},name =  {"1":["跨境哥","微信电影票","微信话费"],"2":["燕蔻美颜","大众点评","亿动电商"]};
        	var index = getRandomArbitrary(1,3);
        	t._('<ul class="ad-randow">');
        	for (var i= 0;i<3;i++) {
        		t._('<li><span><img src="images/spon/spon'+n[index][i]+'.jpg" /></span><label>'+name[index][i]+'</label></li>')
        	}
        	t._('</ul>');
        	$(".ad-list").append(t.toString());
        	var adW = $(".ad-list").width();
        	$(".ad-list").find("li").css({
        		"width":Math.floor(adW/3)
        	});
        	$(".ad-list").find("li span").css({
        		"background":"url(images/spon/ad-load.jpg) no-repeat",
        		"background-size":"cover"
        	});
        	$(".ad-show").removeClass("hidden").addClass("dispshow");

        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
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

						$(me).find('ul').animate({'margin-top': -hei+'px'}, delay, function(){
							$(me).find('ul li:first-child').appendTo($ul);
							$(me).find('ul').css({'margin-top': '0'});
						});
					}, 3000);
				}
			});
		},
        shake_listener: function() {
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
            recordUserOperate(openid, "摇奖", "shakeLottery");
	        if(!$(".home-box").hasClass("yao")) {
	          	$(".yao-text").removeClass("yaonone-text");
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
                H.lottery.incrYaoNum();
	        }else{
	          	return;
	        }
	        if(!openid || openid=='null' || H.lottery.isToLottey == false ){
	            setTimeout(function(){
	            	H.lottery.fill(null);//摇一摇
	            }, 1000);
	        }else{
	        	if(!H.lottery.wxCheck){
                    //微信config失败
                    setTimeout(function(){
                        H.lottery.fill(null);//摇一摇
                    }, 2000);
                    return;
                }
                shownewLoading();
	            setTimeout(function(){

	        	  H.lottery.award();
	            }, 500);
	        }
	        H.lottery.isToLottey = true;
        },
        init_port: function() {
        	var random =  Math.ceil(2000*Math.random() + 3000);
        	var randomInterval_a =  Math.ceil(3000*Math.random() + 5000);
        	var randomInterval_b =  Math.ceil(2000*Math.random() + 8000);
            setTimeout(function() { H.lottery.allRecord_port(); }, random);
            var a = self.setInterval(function(){ H.lottery.leftDayCountLimitPrize_port(); }, randomInterval_a);
            var b = self.setInterval(function() { H.lottery.allRecord_port(); }, randomInterval_b);
            H.lottery.allRecord_Init = a;
            H.lottery.leftCountPrize_init = b;
        },
         //查询当前参与人数
        account_num: function(){
		       getResult('api/common/servicepv', {}, 'commonApiSPVHander');
		},
		leftDayCountLimitPrize_port: function() {
            getResult('api/lottery/leftDayCountLimitPrize', {}, 'callbackLeftDayCountLimitPrizeHandler');
        },
		allRecord_port: function(){
			getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
		},
            //查抽奖活动接口
        current_time: function(){
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round'+dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 11000,
                complete: function() {
                	hidenewLoading();
                },
                success : function(data) {

                    if(data.result == true){
                        H.lottery.nowTime = timeTransform(data.sctm);
                        var nowTime = new Date().getTime();
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
                	hidenewLoading();
                    $(".ad-show").removeClass("hidden");
                    $(".downContTime").addClass("none");
                    $(".time-text").addClass("hidden");
                }
            });
        },
        qus_info : {
        	items : [
        		{
        			"qus":"题目1",
        			"right":"0",
        			"sec":[
        				"A：妖怪，还我爷爷",
        				"B：我还会回来的",
        				"C：我信了你的邪"
        			]
        		},
        		{
        			"qus":"题目2",
        			"right":"2",
        			"sec":[
        				"A：鸟",
        				"B：鸡",
        				"C：虫"
        			]
        		},
        		{
        			"qus":"题目3",
        			"right":"0",
        			"sec":[
        				'<img src="images/qus/sec1.png"/>',
        				'<img src="images/qus/sec2.png"/>',
        				'<img src="images/qus/sec3.png"/>'
        			]
        		}
        	]
        },
        fill_qus : function(index){
        	$(".qus-show").html();
        	var item =[1,2,3];
        	var qusIndex = $.inArray(index,item);
        	if(qusIndex!=-1){
        		var t = simpleTpl(),me = this,qusItem = me.qus_info.items[qusIndex],rigntIndex = qusItem.right;
			    for(var i = 0,len = qusItem.sec.length;i < len;i++){
			        t._('<span class="sec-'+i+'">'+qusItem.sec[i]+'</span>')
			    }
			    $(".qus-box .section").html(t.toString());
				$(".sec-"+rigntIndex).addClass("right");
				$(".qus-show").removeClass("hidden").addClass("dispshow");
			    this.bindBtns();
        	}else{
        		$(".qus-show").removeClass("dispshow").addClass("hidden");
        		H.lottery.isCanShake = true;
        	}
        },
        bindBtns : function(){
        	$('.qus-box span').click(function(e){
                e.preventDefault();
                if($(this).hasClass("done")){
                	return;
                }
               $('.qus-box span').removeClass("wrong");
               if($(this).hasClass("right")){
                	showTips("您答对了,赶快去摇大奖");
                	$(this).addClass("well-done");
                	$.fn.cookie('qus-'+H.lottery.roundIndex ,"answered");
                	$('.qus-box span').addClass("done");
                	setTimeout(function(){
	                	H.lottery.isCanShake = true;
	                	$(".qus-show").removeClass("dispshow").addClass("disphide");
	                	setTimeout(function(){
	                		$(".qus-show").removeClass("disphide").addClass("hidden");
	                	},1000)
                	},2000)

               }else{
               	 $(this).addClass("wrong");
               	 showTips("您答错了,请继续作答");
               }

            });
        },
        currentPrizeAct:function(data){
           //获取抽奖活动
            var prizeActList = data.la,
                prizeLength = prizeActList.length,
                nowTimeStr = H.lottery.nowTime,
                me = this;
                H.lottery.pra = prizeActList;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                	H.lottery.type = 3;
                   	H.lottery.change();
                    return;
                }
                //config微信jssdk
                H.lottery.wxConfig();
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
                $(".time-text").html('敬请期待!');
            }
        },
        imgMath: function() {//随机背景
            if(H.lottery.yaoBg.length >0){
                var i = Math.floor((Math.random()*H.lottery.yaoBg.length));
                $(".home-box-bg").css({"backgroundImage":"url('"+H.lottery.yaoBg[i]+"')",
                "background-size" : "100% 100%"});
            }
        },
        downloadImg: function(){
            if($(".preImg")){
                $(".preImg").remove();
            }
            var t = simpleTpl();
            for(var i = 0;i < H.lottery.yaoBg.length;i++){
                t._('<img class="preImg" src="'+H.lottery.yaoBg[i]+'" style="width:0px;heigth:0px;">')
            }
            $("body").append(t.toString());
        },
              // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            H.lottery.isCanShake = false;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
 			beginTimeLong += H.lottery.dec;
            if(pra.bi.length>0){
                H.lottery.yaoBg = pra.bi.split(",");
            }
            $(".text-tip").html('距摇奖开启还有 ');
            $('.downContTime').attr('etime',beginTimeLong);
            H.lottery.count_down();
            $(".time-text").removeClass("hidden");
           	H.lottery.ad_show();
            $(".qus-show").removeClass("dispshow").addClass("disphide");
            setTimeout(function(){
            	 $(".qus-show").addClass("hidden").removeClass("disphide");
            },1000)
            H.lottery.type = 1;
             H.lottery.istrue = true;
            hidenewLoading();
            H.lottery.downloadImg();
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            H.lottery.isLottery = true ;
             H.lottery.roundIndex = H.lottery.index;
            var endTimeStr = pra.pd+" "+pra.et;
            var endTimeLong = timestamp(endTimeStr);
      		endTimeLong += H.lottery.dec;
            if(pra.bi.length>0){
                H.lottery.yaoBg = pra.bi.split(",");
            }
            $('.downContTime').attr('etime',endTimeLong);
            $(".text-tip").html("距本轮摇奖结束还有");
            H.lottery.count_down();
            $(".time-text").removeClass("hidden");
            $(".ad-show").removeClass("dispshow").addClass("hidden");
            if($.fn.cookie('qus-'+H.lottery.roundIndex )&&$.fn.cookie('qus-'+H.lottery.roundIndex) == "answered"){       
	            $(".qus-show").addClass("hidden").removeClass("dispshow");
            	H.lottery.isCanShake = true;
			}else{
				H.lottery.isCanShake = false;
				H.lottery.fill_qus(H.lottery.roundIndex );
			}
            H.lottery.type = 2;
            H.lottery.istrue = true;
            H.lottery.index ++;
            hidenewLoading();
            H.lottery.downloadImg();
        },
        count_down : function() {
            $('.downContTime').each(function() {
                $(this).countDown({
                    etpl : '<label>%H%</label>'+'时'+'<label>%M%</label>' + '分' + '<label>%S%</label>秒', // 还有...结束
                    stpl : '<label>%H%</label>'+'时'+'<label>%M%</label>' + '分' + '<label>%S%</label>秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                    	$(".text-tip").html("请稍后");
	 					if(H.lottery.canJump){
	 						H.lottery.canJump = false;
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
			                        H.lottery.isCanShake = false;
			                        toUrl("star.html");  
	                        } 
	                     }
                            
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        
      
        change: function(){
        	H.lottery.isCanShake = false;
			$(".time-text").html('本期摇奖已经结束!').removeClass("hidden");
			toUrl("end.html");
			
        },
        award :function(){
        	var me = this;
            var sn = new Date().getTime()+'';
            me.lotteryTime = getRandomArbitrary(1,3);
            me.times = 0;
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
             $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck' + dev,
                data: { oi: openid , sn : sn},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    hidenewLoading();
                    if(data.flow && data.flow == 1){
                        me.lotteryTime = getRandomArbitrary(3,6);
                        me.times = 0;
                        sn = new Date().getTime()+'';
                        H.lottery.lottery_point(null);
                        return;
                    }
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
                    hidenewLoading();
                    sn = new Date().getTime()+'';
                    H.lottery.fill(null);
                }
            });
        },
        fill : function(data){
            setTimeout(function() {
	            $(".home-box").removeClass("yao");
                $("#audio-a").get(0).pause();
                H.lottery.imgMath();
	        },500);
        	if(data == null || data.result == false || data.pt == 0){
        		$(".yao-text").addClass("yaonone-text");
				 setTimeout(function() {
	                H.lottery.isCanShake = true;
	            },500);
        	}else if(data.pt == 16){
                shownewLoading();
                if(!H.lottery.wxCheck){
                    //谢谢参与
                    $(".yao-text").addClass("yaonone-text");
                    setTimeout(function () {
                        H.lottery.isCanShake = true;
                    }, 500);
                    return;
                }
                //裂变红包
                shaketv.hongbao({
                    userid:openid,
                    lottery_id:data.lottery_id,
                    noncestr:data.noncestr,
                    sign:data.sign
                },function(data) {
                    hidenewLoading();
                    if (data.errorCode == 0) {
                        // 判断是否需要验证码
                        if(data.captcha){
                            //谢谢参与
                            $(".yao-text").addClass("yaonone-text");
                            setTimeout(function () {
                                H.lottery.isCanShake = true;
                            }, 500);
                        }else{
                            setTimeout(function () {
                                H.lottery.isCanShake = true;
                            }, 500);
                            getResult('api/lottery/award', {
                                oi: openid,
                                hi: headimgurl,
                                nn: nickname
                            }, 'callbackLotteryAwardHandler');
                        }
                    } else {
                        //谢谢参与
                        $(".yao-text").addClass("yaonone-text");
                        setTimeout(function () {
                            H.lottery.isCanShake = true;
                        }, 500);
                    }
                    H.lottery.doConfig();
                });
            }else{
                $("#audio-b").get(0).play();//中奖声音
                H.lottery.isCanShake = false;
                H.dialog.lottery.open();
                H.dialog.lottery.update(data);
        	}
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            getResult("mp/jsapiticket", {
                appId: shaketv_appid
            }, 'callbackJsapiTicketHandler', false);
        },
        doConfig: function(){
            var me = this;
            var timeStamp = Math.round(new Date().getTime()/1000);
            var url = window.location.href.split('#')[0];
            var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
            var signature = hex_sha1('jsapi_ticket=' + me.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timeStamp + '&url=' + url);
            //权限校验
            wx.config({
                debug: false,
                beta: true,
                appId: shaketv_appid,
                timestamp: timeStamp,
                nonceStr:nonceStr,
                signature:signature,
                jsApiList: [
                    "addCard",
                    "checkJsApi",
                    "getRecevieBizHongBaoRequest"
                ]
            });
        }
    };
	W.callbackJsapiTicketHandler = function(data) {
        H.lottery.ticket = data.ticket;
        H.lottery.doConfig();
    };
	W.commonApiSPVHander = function(data){
		if(data.code == 0){
			$(".num").html(data.c).removeClass("hidden");
			$(".spon").removeClass("none");
		}
	};
	
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
	W.callbackLeftDayCountLimitPrizeHandler = function(data) {
        if(data.result) {
            var oldLeftCountPrize = parseInt($(".prize-count label").text());
            if(oldLeftCountPrize >= data.lc || oldLeftCountPrize == 0){
                $(".prize-count label").html(data.lc);
                if(data.lc == 0){
                    $(".prize-count").animate({'opacity':'0'}, 500, function() {
                        $(".prize-count").addClass('none');
                    });
                }else{
                    $(".prize-count").removeClass("none").animate({'opacity':'1'}, 300);
                }
            }
        } else {
            $(".prize-count").animate({'opacity':'0'}, 500, function() {
                $(".prize-count").addClass('none');
            });
        }
    };

    W.callbackLotteryAwardHandler = function(data){

    };
    W.callbackServiceCountIncrHandler = function(data){

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
                'addCard',
                'getRecevieBizHongBaoRequest'
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
    });
});
