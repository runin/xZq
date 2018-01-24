(function($) {
    H.lottery = {
        ruuid: 0,
        guid: getQueryString('guid') || '',
        $rule_close: $('.rule-close'),
        isLottery: false,
        nowTime: null,
        isCanShake: true,
        times: 0,
        thank_times: 0,
        isToLottey: true,
        isTimeOver: false,
        isLotteryTime: false,
        first: true,
        lotteryTime: getRandomArbitrary(3,6),
        yaoBg:[],
        canJump: true,
        init : function(){
        	var me = this;
        	if (me.guid == '') {
        		toUrl('vote.html');
        		return;
        	} else {
        		getResult('api/voteguess/isvote', {
        			yoi: openid,
        			guid: me.guid
        		}, 'callbackVoteguessIsvoteHandler', false, null, true);
        	}
            me.event();
			me.current_time();
            me.shake();
            me.resize();
            me.updatepv();
			me.ddtj();
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
               	  	shownewLoading();
               	  	setTimeout(function(){
               	  		 H.lottery.drawlottery();
               	  	},getRandomArbitrary(1, 3)*1000);
                  } 
               }else{
               		return;
               }
            });
            $("#test").click(function(e){
            	H.lottery.shake_listener();
            });
        },
        updatepv: function() {
            getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
            setInterval(function() {
                getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
            }, 5000);
        },
        resize: function() {
        	var winW = $(window).width(),
        		winH = $(window).height();
        	$('body').css({
        		'width': winW,
        		'height': winH
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
						$(me).find('ul').animate({'margin-top': '-26px'}, delay, function() {
							$(me).find('ul li:first').appendTo($ul)
							$(me).find('ul').css({'margin-top': '0'});
						});
					}, 3000);
				};
			});
		},
		imgMath: function() {//随机背景
			if(H.lottery.yaoBg.length >0){
				var i = Math.floor((Math.random()*H.lottery.yaoBg.length));;
				$("body").css("backgroundImage","url('"+H.lottery.yaoBg[i]+"')");
			}
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
	        		toUrl('vote.html');
					return;
				}
	        	if (!H.lottery.isLotteryTime) {
	        		//非摇奖时间，不能摇
	        		toUrl('vote.html');
	        		return;
	        	}
	            if(H.lottery.isCanShake){
	            	H.lottery.isCanShake = false;
	            }else{
	              return;
	            }
	          recordUserOperate(openid, "为母校而战摇一摇", "tv_dongnan_fight_school");
	          recordUserPage(openid, "为母校而战摇一摇", 0);
	          H.lottery.times++;
	
	          if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
	        	  H.lottery.isToLottey = false;
	          }
	          if(!$(".home-box").hasClass("yao")) {
  	          	$(".textb").removeClass("yaonone-text");
				$("#audio-a").get(0).play();
				$(".home-box").addClass("yao");
				H.lottery.imgMath();
	          }
	          if(!openid || openid=='null' || H.lottery.isToLottey == false){
	            setTimeout(function(){
	            	H.lottery.fill(null);//摇一摇
	            }, 1300);
	          }else{
	            setTimeout(function(){
	        	  H.lottery.drawlottery();
	            }, 1300);
	          }
	          H.lottery.isToLottey = true;
        },
		red_record: function(){
			getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
		},
        current_time: function(){
		     getResult('api/lottery/round', 'callbackLotteryRoundHandler', true);
		},
		downloadImg: function(){
			var t = simpleTpl();
			for(var i = 0;i < H.lottery.yaoBg.length;i++){
				t._('<img src="'+H.lottery.yaoBg[i]+'" style="width:0px;heigth:0px;">')
			}
			$("body").append(t.toString());
		},
        currentPrizeAct:function(data){
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
                        };
                        H.lottery.downloadImg();
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
			toUrl('vote.html');
        },
        do_count_down: function(endTimeStr,nowTimeStr,isStart){
        	if(isStart){
                H.lottery.isLotteryTime = true;
				$(".countdown-tip").html('距离摇奖结束还有&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        	}else{
				toUrl('vote.html');
                H.lottery.isLotteryTime = false;
    			$(".countdown-tip").html('距离摇奖开启还有&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
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
						if(!H.lottery.canJump){
                            return;
                        }else{
							if(!H.lottery.isTimeOver){
								H.lottery.isTimeOver = true;
								$(".countdown-tip").html('');
								shownewLoading(null,'请稍后...');
								var delay = Math.ceil(2500*Math.random() + 1700);
							    setTimeout(function(){
									hidenewLoading();
							    	getResult('api/lottery/round', 'callbackLotteryRoundHandler',true);
							    	}, delay);
							}
                            H.lottery.change();
                            H.lottery.canJump = false;
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
            },50);
        	if(data == null || data.result == false || data.pt == 0){
        		$("#audio-a").get(0).pause();
                $(".texta").addClass("none");
                H.lottery.textMath();
                $(".textb").removeClass("none");
				$(".textb").addClass("yaonone-text").show();
				H.lottery.isCanShake = true;
				return;
        	}else{
        		$("#audio-a").get(0).pause();
        		$("#audio-b").get(0).play();
        	}
            H.dialog.lottery.open();
            H.dialog.lottery.update(data);
         
        },
        lottery_point : function(data){
        	H.lottery.fill(data);
        },
		ddtj: function() {
			$('#ddtj').addClass('none');
			getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
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

	W.callbackCountServicePvHander = function(data) {
        if (data.code == 0) {
        	$('.nowpv').removeClass('none').find('label').text(data.c);
        }
    };

	W.callbackLotteryAllRecordHandler = function(data){
		if(data.result){
			var list = data.rl;
			if(list && list.length > 0){
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

	W.callbackVoteguessIsvoteHandler = function(data) {
		if (data.code == 0) {
			if (!data.so) {
				toUrl('vote.html');
			};
		} else {
			toUrl('vote.html');
		}
	};

	W.commonApiPromotionHandler = function(data){
		if (data.code == 0 && data.desc && data.url) {
			$('.ddtj').attr('href', (data.url || '')).removeClass('none');
		} else {
			$('.ddtj').remove();
		};
	};
})(Zepto);

$(function() {
    H.lottery.init();
});
