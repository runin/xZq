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
        lotteryTime:getRandomArbitrary(1,5),
        yaoBg:[],
        canJump:true,
        isLotteryTime:false,
        wxCheck:false,
        isError:false,
        dec: 0,
        firstEndTime: '',
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
            if (!H.lottery.isLotteryTime) {
                //非摇奖时间，不能摇
                return;
            }
            if(H.lottery.isCanShake){
                H.lottery.isCanShake = false;
            }else{
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
		downloadImg: function(){
			var t = simpleTpl();
			for(var i = 0;i < H.lottery.yaoBg.length;i++){
				t._('<img src="'+H.lottery.yaoBg[i]+'" style="width:0px;heigth:0px;">')
			}
			$("body").append(t.toString());
		},
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActList = data.la,
                prizeLength = 0,
                nowTimeStr = timeTransform(data.sctm),
                me = this;
            //config微信jssdk
            me.wxConfig();
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.change();
                    return;
                }
                if(comptime(prizeActList[0].pd+" "+prizeActList[0].st,nowTimeStr) < 0){
                    var startTime = prizeActList[0].pd+" "+prizeActList[0].st;
                    me.isFirst = true;
                    me.firstEndTime = prizeActList[0].pd+" "+prizeActList[0].et;
                    me.do_count_down(startTime,false);
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        if(prizeActList[i].bi.length>0){
                            me.yaoBg = prizeActList[i].bi.split(",");
                        }
                        me.do_count_down(endTimeStr,true);
                        me.initCount();
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.change();
                        return;
                    }
                }
            }else{
                me.change();
            }
        },
        initCount: function(){
            H.lottery.account_num();
            setInterval(function(){
                H.lottery.account_num();
            },7000);
            H.lottery.red_record();
            setInterval(function(){
                H.lottery.red_record();
            },10000);
            H.lottery.leftPrizeCount();
            setInterval(function(){
                H.lottery.leftPrizeCount();
            },5000);
        },
        do_count_down: function(endTimeStr,isStart){
            if(isStart){
                H.lottery.isLotteryTime = true;
                $(".countdown-tip").html('距离摇奖结束还有');
            }else{
                H.lottery.isLotteryTime = false;
                $(".countdown-tip").html('距离摇奖开启还有');
            }
            var endTimeLong = timestamp(endTimeStr);
            endTimeLong += H.lottery.dec;
            $('.detail-countdown').attr('etime',endTimeLong);
            H.lottery.count_down();
            $(".countdown").removeClass("none");
            hidenewLoading();
            H.lottery.canJump = true;
        },
        change: function(){
            H.lottery.isCanShake = false;
            $(".countdown").removeClass("none");
            $(".countdown-tip").html('请稍候...');
            shownewLoading(null, '请稍后...');
            $('.detail-countdown').html("");
            toUrl('vote.html');
        },
        // 倒计时
		count_down : function() {
			$('.detail-countdown').each(function() {
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {

                        if(H.lottery.canJump){
                                H.lottery.canJump = false;
                                if(H.lottery.isFirst){
                                    H.lottery.isFirst = false;
                                    $(".countdown-tip").html('请稍候...');
                                    shownewLoading(null, '请稍后...');
                                    setTimeout(function(){
                                        H.lottery.do_count_down(H.lottery.firstEndTime,true);
                                        H.lottery.initCount();
                                    },1000);
                                    return;
                                }else{
                                    shownewLoading(null, '请稍后...');
                                    H.lottery.change();
                                }
                            }
					},
					sdCallback :function(){
					}
				});
			});
		},
        drawlottery:function(){
            var me = this;
            var sn = new Date().getTime()+'';
            shownewLoading();
            me.lotteryTime = getRandomArbitrary(1,4);
            me.times = 0;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: { oi: openid, sn: sn },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                complete: function() {
                    hideLoading();
                },
                success : function(data) {
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
