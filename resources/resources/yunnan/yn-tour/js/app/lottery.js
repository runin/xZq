(function($) {
    H.lottery = {
        dec: 0,
        times: 0,
        isToLottey: false,
        lotteryTime: getRandomArbitrary(1,1),
        lotteryPrizeList : ["0","1","2","3","4","5","6","7"],
        type: 0,
        wxCheck:false,
        nowTime : null,
        init : function(){
            var me = this;

            me.lotteryRound_port();
            me.event();
        },
        event: function() {
            var me = this;
            $('.icon-start').click(function(e) {
                e.preventDefault();
                if($(this).hasClass("requesting")){
                	return;
                }
                $(this).addClass("requesting")
                H.lottery.times++;
                if(H.lottery.times % H.lottery.lotteryTime == 0){
                    H.lottery.isToLottey = true;
                }
                if(!openid || openid=='null' || H.lottery.isToLottey == false||H.lottery.type!=2 ){
                    H.lottery.lottery_point(null);
                }else{
	                if(!H.lottery.wxCheck){
	                    setTimeout(function(){
	                       H.lottery.lottery_point(null);
	                    }, 2000);
	                    return;
	                }
                    H.lottery.lotteryLuck_port();
                }
                H.lottery.isToLottey = false;
            });
            $('.join-btn').click(function(e) {
                e.preventDefault();
                shownewLoading();
                window.location.href = $(this).attr("data-href")
            });
            $(".outer").click(function(e){
				e.preventDefault();
				shownewLoading();
				window.location.href = $(".outer").attr("data-href");
			})
			getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },

        lotteryRound_port: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.result == true){
                    	H.lottery.nowTime = timeTransform(data.sctm);
                        me.currentPrizeAct(data);
                    }else{
               			H.lottery.type = 0;
                    }
                },
                error : function(xmlHttpRequest, error) {
                 	H.lottery.type = 0;
                }
            });
        },
        currentPrizeAct: function(data) {
            //获取抽奖活动
            var me = this, nowTimeStr = H.lottery.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [];
            var day = nowTimeStr.split(" ")[0];
            if(prizeActListAll && prizeActListAll.length > 0) {
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    prizeActList.push(prizeActListAll[i]);
                };
	            prizeLength = prizeActList.length;
	            if(prizeActList.length > 0) {          	
	                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et, nowTimeStr) >= 0) {  //如果最后一轮结束
	                    H.lottery.type = 3;
	                    return;
	                }
	                for ( var i = 0; i < prizeActList.length; i++) {
	                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
	                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
	                    H.lottery.index = i;
	                    hidenewLoading();
	                    //在活动时间段内且可以抽奖
	                    if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >= 0){
	                    	//config微信jssdk
                			H.lottery.wxConfig();
	                        H.lottery.type = 2;
	                        return;
	                    }
	                    if(comptime(nowTimeStr,beginTimeStr) > 0){;
	                        H.lottery.type = 1;
	                        return;
	                    }
	                }
	            }else{
	                H.lottery.type = 0;
	                return;
	            }
	        }else{
	        	 H.lottery.type = 0;
	             return;
	        }
            
        },
         wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'mp/jsapiticket' + dev,
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
        lotteryLuck_port: function(){
            var me = this;
            var sn = new Date().getTime()+'';
            me.lotteryTime = getRandomArbitrary(1,1);
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck' + dev,
                data: { oi: openid , sn : sn},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                timeout: 10000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data&&data.result){
                        if(data.sn == sn){
                            sn = new Date().getTime()+'';
                            H.lottery.lottery_point(data);
                        }else{
                        	sn = new Date().getTime()+'';
                        	H.lottery.lottery_point(null);
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
        lottery_point : function(data){
            awards = this.lotteryPrizeList;
            var lw = new luckWheel({
                items: awards,
                callback: function() {
					H.dialog.lottery.open(data);
                }
            });
            if(data&&data.result&&data.pt!=0){
            	var runNum =data.px;
            	lw.run(runNum);
            }else{
            	lw.run(1);
            }
        },
    };
	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			var jumpUrl = data.url;
			$(".ddtj").html(data.desc);
			$(".outer").attr("data-href",jumpUrl).removeClass("none");
		}else{
			$(".outer").addClass("none");
		}
	};
    W.luckWheel = function(opt) {
        var wheelRepeat = 9, durationTime = 16000;
        var _opt = {
            // 奖项列表
            items : [],
            // 时间长度
            duration : durationTime,
            // 重复转圈次数
            repeat : wheelRepeat,
            // 回调函数
            callback : function() {
            }
        };

        for ( var key in _opt) {
            this[key] = opt[key] || _opt[key];
        }

        this.run = function(v) {
            var me = this, bingos = [], len = this.items.length;
            var index = parseInt(v), amount = 360 / len, fix = amount / 5;
            var low = index * amount + fix,
                top = (index + 1) * amount - fix,
                range = top - low,
                turnTo = low + getRandomArbitrary(0, range + 1);
            $("#btn-wheel").rotate({
                angle : 0,
                animateTo : turnTo + this.repeat * 360,
                duration : this.duration,
                callback : function() {
                    me.callback(index);
                }
            });
        };
    };
})(Zepto);

$(function() {
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
