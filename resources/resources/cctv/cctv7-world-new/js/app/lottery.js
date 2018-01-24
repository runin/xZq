/**
 * 食尚大转盘-抽奖
 */
(function($) {
    H.lottery = {
        isLottery :false,
        nowTime :null,
        isCanShake:true,
        times:0,
        isToLottey:true,
        first: true,
        isFirst:false,
        lotteryTime:getRandomArbitrary(1,3),
        yaoBg:[],
        canJump:true,
        isLotteryTime:false,
        wxCheck:false,
        isError:false,
        dec: 0,
        firstEndTime: '',
        pal: [],
        type: 2,
        index : 0,
        allRecordTime : 7000,
        init : function(){
            this.event();
			this.current_time();
            this.shake();
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
				}
			});
		},
		imgMath: function() {//随机背景
			if(H.lottery.yaoBg.length >0){
				var i = Math.floor((Math.random()*H.lottery.yaoBg.length));;
				$("body").css("backgroundImage","url('"+H.lottery.yaoBg[i]+"')");
			}
		},
        shake_listener: function() {
            if(H.lottery.isCanShake){
                H.lottery.isCanShake = false;
            }else{
              return;
            }
            if (H.lottery.type != 2) {
                //非摇奖时间，不能摇
                return;
            }
          recordUserOperate(openid, "cctv7乡村大世界摇手机", "cctv7-world-shake");
          recordUserPage(openid, "cctv7乡村大世界摇手机", 0);
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
              if(!H.lottery.wxCheck){
                  //微信config失败
                  setTimeout(function(){
                      H.lottery.fill(null);//摇一摇
                  }, 1500);
                  return;
              }
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
		     getResult('api/lottery/round',{}, 'callbackLotteryRoundHandler');
		},
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeLength = 0,
                nowTimeStr = H.lottery.nowTime,
                prizeActList = data.la,
                me = this;
            H.lottery.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    H.lottery.type = 3;
                    H.lottery.change('port');
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
                        },me.allRecordTime);
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
        // 距下次摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            H.lottery.type = 1;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.lottery.dec;
            $(".countdown-tip").html('距摇奖开启还有 ');
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.lottery.count_down();
            $('.countdown').removeClass('none');
            H.lottery.repeatCheck = true;
            hidenewLoading();
        },
        // 距本轮摇奖结束倒计时
        nowCountdown: function(pra){
            H.lottery.type = 2;
            H.lottery.isCanShake = true;
            if(pra.bi.length>0){
                H.lottery.yaoBg = pra.bi.split(",");
            }
            H.lottery.downloadImg();
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.lottery.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            $(".countdown-tip").html("距摇奖结束还有");
            H.lottery.count_down();
            $(".countdown").removeClass("none");
            H.lottery.index ++;
            H.lottery.repeatCheck = true;
            hidenewLoading();
        },
        // 跨天摇奖开启倒计时
        nextCountdown: function(nextTime) {
            H.lottery.isCanShake = false;
            H.lottery.type = 4;
            var beginTimeLong = timestamp(nextTime);
            beginTimeLong += H.lottery.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html('距下轮投票开始还有');
            H.lottery.count_down();
            $(".countdown").removeClass("none");
            H.lottery.repeatCheck = true;
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + ':' +'%M%' + ':' + '%S%', // 还有...结束
                    stpl : '%H%' + ':' +'%M%' + ':' + '%S%', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.lottery.repeatCheck){
                            H.lottery.repeatCheck = false;
                            shownewLoading(null,"请稍候...");
                            if(H.lottery.type == 1){
                                //距下次摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                H.lottery.nowCountdown(H.lottery.pal[H.lottery.index]);
                            }else if(H.lottery.type == 2){
                                //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
                                if(H.lottery.index >= H.lottery.pal.length){
                                    // 如果已经是最后一轮摇奖倒计时结束 则显示 今日摇奖结束
                                    H.lottery.change('port');
                                    H.lottery.type = 3;
                                    return;
                                }
                                H.lottery.beforeShowCountdown(H.lottery.pal[H.lottery.index]);
                            }else if(H.lottery.type == 4){
                                H.lottery.current_time();
                            }
                        }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        change: function(data){
            if (data) {
                if (H.lottery.nowTime || H.lottery.pal) {
                    var prizeLength = 0,
                        day = parseInt(H.lottery.nowTime.split(" ")[0].split("-")[2]);
                    prizeLength = H.lottery.pal.length;
                    var lastLotteryTime = parseInt(H.lottery.pal[prizeLength - 1].nst.split("-")[2]);
                    if (day == lastLotteryTime) {
                        H.lottery.change(null);
                    } else {
                        H.lottery.nextCountdown(H.lottery.pal[prizeLength - 1].nst);
                    }
                } else {
                    H.lottery.change(null);
                }
            } else {
                hidenewLoading();
                H.lottery.isCanShake = false;
                H.lottery.type = 3;
                $(".countdown").html("今日摇奖结束");
                $(".countdown").removeClass("none");
                toUrl("end.html");
            }
        },
        downloadImg: function(){
            $(".preImg").remove();
            var t = simpleTpl();
            for(var i = 0;i < H.lottery.yaoBg.length;i++){
                t._('<img class="preImg" src="'+H.lottery.yaoBg[i]+'" style="width:0px;heigth:0px;">')
            }
            $("body").append(t.toString());
        },
        drawlottery:function(){
            var me = this;
            var sn = new Date().getTime()+'';
            shownewLoading();
            me.lotteryTime = getRandomArbitrary(1,3);
            me.times = 0;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck' + dev,
                data: { oi: openid, sn: sn },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                complete: function() {
                    hideLoading();
                },
                success : function(data) {
                    if(data.flow && data.flow == 1){
                        me.lotteryTime = getRandomArbitrary(3,6);
                        me.times = 0;
                        sn = new Date().getTime()+'';
                        H.lottery.lottery_point(null);
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            H.lottery.lottery_point(data);
                        }
                    }else{
                        sn = new Date().getTime()+'';
                        H.lottery.lottery_point(null);
                    }
                },
                error : function() {
                    sn = new Date().getTime()+'';
                    H.lottery.lottery_point(null);
                }
            });
        },
        fill : function(data){
            setTimeout(function() {
                $(".home-box").removeClass("yao");
            },300);
        	if(data == null || data.result == false || data.pt == 0){
        		$("#audio-a").get(0).pause();
                H.dialog.thanks.open();
				return;
        	}else{
        		$("#audio-a").get(0).pause();
        		$("#audio-b").get(0).play();//中奖声音
        	}
            H.dialog.lottery.open(data);
         
        },
        lottery_point : function(data){
              setTimeout(function(){
                  H.lottery.fill(data);
              }, 1000);
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            getResult("mp/jsapiticket", {
                appId: shaketv_appid
            }, 'callbackJsapiTicketHandler', false);
        }
    };

    W.callbackLotteryRoundHandler = function(data){
		if(data.result == true){
            H.lottery.nowTime = timeTransform(data.sctm);
			var nowTimeStemp = new Date().getTime();
            H.lottery.dec = nowTimeStemp - data.sctm;
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
    }

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').attr('href', (data.url || '')).removeClass('none');
        } else {
            $('#ddtj').remove();
        };
    }
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
})(Zepto);

$(function() {
    var hei = $(window).height();
    $("body").css("height",hei+"px");
    if(is_android()){
        $(".main-top").css("height",(hei/2+0.5)+"px");
        $(".main-foot").css("height",(hei/2+0.5)+"px");
    }
    shownewLoading();
    //执行业务代码
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
    });

    wx.error(function(res){
        H.lottery.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});
