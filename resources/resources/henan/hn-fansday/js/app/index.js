
(function($){
	H.index = {
		dec : 0,
		nowTime : "",
		pal:[],
		type:0,
		index:0,
		repeatCheck:false,
		jump_url : "",
		init : function(){
			this.refreshDec();
			this.current_time();
		},
		event_handler : function(){
			$("#join").click(function(e){
				e.preventDefault();
				toUrl(H.index.jump_url);
			});
			$("#rule").click(function(e){
				e.preventDefault();
				H.dialog.rule.open();
			});
		},
		set_jump_cookie : function(){
			//如果是第一次进入
			if(!$.fn.cookie("firstEnter")){
				//设置cookie
				$.fn.cookie("firstEnter","flag",{expires:1})
				$(".container").removeClass("none");
				this.event_handler();
			}else{
				toUrl(H.index.jump_url);
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
                            var nowTime = Date.parse(new Date());
                            H.index.dec = nowTime - data.t;
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
                        H.index.nowTime = timeTransform(data.sctm);
                        var nowTime = Date.parse(new Date());
                        H.index.dec = (nowTime - data.sctm);
                        H.index.currentPrizeAct(data);
                        H.index.set_jump_cookie();
                    }else{
                        H.index.change();
                    }
                },
                error : function(xmlHttpRequest, error) {
                    H.index.change();
                }
            });
        },
		currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.index.nowTime,
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
            H.index.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    H.index.type = 3;
                    H.index.change();
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        H.index.index = i;
                        H.index.nowCountdown(prizeActList[i]);
                        hidenewLoading();

                        return;
                    }
                    // 据下次摇奖开始
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        H.index.index = i;
                        H.index.beforeShowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                }
            }else{
                H.index.change();
            }
        },   // 距下次摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            H.index.type = 1;
            if( H.index.index == 0){
            	 H.index.jump_url="yaoyiyao.html";
            }else{
            	 H.index.jump_url="star.html";
            }
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.index.dec;
            $(".countdown-tip").html('距摇奖开启还有 ');
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.index.count_down();
            H.index.repeatCheck = true;
            hideLoading();
        },
        // 距本轮摇奖结束倒计时
        nowCountdown: function(pra){
            H.index.type = 2;
            H.index.jump_url="yaoyiyao.html";
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.index.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            $(".countdown-tip").html("距摇奖结束还有");
            H.index.count_down();
            H.index.index ++;
            H.index.repeatCheck = true;
            hideLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + '时'+'%M%' + '分' + '%S%' + '秒', // 还有...结束
                    stpl : '%H%' + '时'+'%M%' + '分' + '%S%' + '秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.index.repeatCheck){
                            H.index.repeatCheck = false;
                            shownewLoading();
                            if(H.index.type == 1){
                                //距下次摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                H.index.nowCountdown(H.index.pal[H.index.index]);
                            }else if(H.index.type == 2){
                                //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
                                if(H.index.index >= H.index.pal.length){
                                    // 如果已经是最后一轮摇奖倒计时结束 则显示 今日摇奖结束
                                    H.index.change();
                                    H.index.type = 3;
                                    return;
                                }
                                H.index.beforeShowCountdown(H.index.pal[H.index.index]);
                            }
                        }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        change: function(){
            hidenewLoading();
            H.index.type = 3;
            $(".countdown-tip").html("今日摇奖结束");
            toUrl("end.html")
        }
        
	}
})(Zepto);


$(function(){
	H.index.init();
});

