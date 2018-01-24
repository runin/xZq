(function($) {
    H.lottery = {
        dec: 0,
        times: 0,
        nowTime: null,
        roundData: null,
        isToLottey: true,
        repeat_load: true,
        repeat_load4Port: true,
        lotteryTime: getRandomArbitrary(1,1),
        lotteryPrizeList : ["0","1","2","3","4","5"],
        recordTime: Math.ceil(40000*Math.random() + 100000),
        leftCountPrize: Math.ceil(3000*Math.random() + 2000),
        firstRecordTime: Math.ceil(25000*Math.random() + 10000),
        randomAwardDataTime: 80 * 1000,
        isCanRoll: false,
        safeMode: false,
        allRecord_Init: 0,
        leftCountPrize_init: 0,
        endType: 0,
        init : function(){
            var me = this;
            me.event();
            me.lotteryRound_port();
            me.allRecord_port();
            me.tttj();
        },
        event: function() {
            var me = this;
            $('.icon-start').click(function(e) {
                e.preventDefault();
               
                if (H.lottery.safeMode) {
                    if(H.lottery.isCanRoll){
                        H.lottery.isCanRoll = false;
                    } else {
                        me.honey_tips();
                        return;
                    }
                    H.lottery.lottery_point(null);
                } else {
                    if(H.lottery.isCanRoll){
                        H.lottery.isCanRoll = false;
                    } else {
                        me.honey_tips();
                        return;
                    }
                    if(H.lottery.endType != 2) {

                        me.honey_tips();
                        return;
                    }
                    H.lottery.times++;
                    if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                        H.lottery.isToLottey = true;
                    }
                    if(!openid || openid=='null' || H.lottery.isToLottey == false ){
                        H.lottery.lottery_point(null);
                    }else{
                        H.lottery.lotteryLuck_port();
                    }
                    H.lottery.isToLottey = true;
                }
            });
            $('#btn-rule').click(function(e) {
                e.preventDefault();
                if ($("#btn-rule").hasClass('requesting')) {
                    return;
                }
                $("#btn-rule").addClass('requesting');
                shownewLoading();
                H.dialog.rule.open();
            });
            $("#btn-reserve").click(function(e) {
				e.preventDefault();
				var reserveId = $(this).attr('data-reserveid');
				var date = $(this).attr('data-date');
				if (!reserveId || !date) {
					return;
				};
                window['shaketv'] && shaketv.reserve_v2({
                        tvid:yao_tv_id,
                        reserveid:reserveId,
                        date:date},
                    function(d){
                });
			});
        },
      // 检查该互动是否配置了预约功能
		prereserve: function() {
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/program/reserve/get',
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackProgramReserveHandler',
                success : function(data) {
                    if (!data.reserveId) {
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve_v2({
                            tvid:yao_tv_id,
                            reserveid:data.reserveId,
                            date:data.date},
                        function(resp){
                            if (resp.errorCode == 0) {
                                $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
                }
            });
		},
        honey_tips: function() {
            var rollFlag;
            if (!$('.countdown').hasClass('wobble')) {
                $('.countdown').addClass('wobble');
                clearTimeout(rollFlag);
                rollFlag = setTimeout(function() {
                    $('.countdown').removeClass('wobble');
                }, 1000);
            }
        },
        init_port: function() {
            var b = self.setInterval(function(){ H.lottery.leftDayCountLimitPrize_port(); }, H.lottery.leftCountPrize);
            var a = self.setInterval(function() { H.lottery.allRecord_port(); }, H.lottery.recordTime);
            H.lottery.allRecord_Init = a;
            H.lottery.leftCountPrize_init = b;
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
                        me.safeMode = false;
                        me.nowTime = timeTransform(data.sctm);
                        var nowTimeStamp = new Date().getTime();
                        me.dec = nowTimeStamp - data.sctm;
                        me.roundData = data;
                        me.currentPrizeAct(data);
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.lotteryRound_port();
                            }, 500);
                        } else {
                            me.safeModeWheel();
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    me.safeModeWheel();
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
            }
            H.lottery.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0) {          	
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et, nowTimeStr) >= 0) {  //如果最后一轮结束
                    H.lottery.endType = 3;
                    H.lottery.change();
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    H.lottery.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >= 0){
                        H.lottery.nowCountdown(prizeActList[i]);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){;
                        H.lottery.beforeCountdown(prizeActList[i]);
                        return;
                    }
                }
            }else{
                H.lottery.change();
                return;
            }
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            H.lottery.isCanRoll = false;
            H.lottery.endType = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.lottery.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html('距抽奖开始还有');
            H.lottery.count_down('<span class="fetal-H">%H%时</span>%M%分%S%秒');
            $('.countdown').removeClass('hidden');
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            H.lottery.isCanRoll = true;
            H.lottery.endType = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.lottery.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html("距抽奖结束还有");
            H.lottery.count_down('<span class="fetal-H">%H%时</span>%M%分%S%秒');
            $(".countdown").removeClass("hidden");
            H.lottery.index ++;
            if (H.lottery.repeat_load4Port) {
                H.lottery.repeat_load4Port = false;
                H.lottery.init_port();
            }
            hidenewLoading();
        },
        change: function(){
                H.lottery.isCanRoll = false;
                $(".countdown-tip").html('本期摇奖已结束，请下期再来');
                $('.detail-countdown').html("");
                $(".countdown").removeClass("hidden");
                $('.count').animate({'opacity':'0'}, 500, function(){
                    $('.count').addClass('none');
                    $('.count').empty();
                });
                H.lottery.allRecord_Init = window.clearInterval(H.lottery.allRecord_Init);
                H.lottery.leftCountPrize_init = window.clearInterval(H.lottery.leftCountPrize_init);
                H.lottery.recordTime = H.lottery.leftCountPrize = H.lottery.firstRecordTime = H.lottery.randomAwardDataTime = 86400000;
                hidenewLoading();
        },
        safeModeWheel: function() {
            var me = this;
            hidenewLoading();
            me.safeMode = true;
            me.isCanRoll = true;
            me.endType = 2;
            $('.info-box').addClass('none');
        },
        count_down: function(timeTPL) {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : timeTPL, // 还有...结束
                    stpl : timeTPL, // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
               			if (H.lottery.endType == 1) {  
                        		  //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                            if(!H.lottery.isTimeOver){
                                H.lottery.isTimeOver = true;
                                $('.countdown-tip').html('请稍后');
                                shownewLoading(null,'请稍后...');
                                setTimeout(function() {
                                    H.lottery.nowCountdown(H.lottery.pal[H.lottery.index]);
                                }, 1000);
                            }
                        } else if (H.lottery.endType == 2) {
                            	//距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                            if(!H.lottery.isTimeOver){
                                H.lottery.isTimeOver = true;
                                if(H.lottery.index >= H.lottery.pal.length){
                                    H.lottery.change();
                                    H.lottery.endType = 3;
                                    return;
                                }
                                $('.countdown-tip').html('请稍后');
                                shownewLoading(null,'请稍后...');
                                H.lottery.beforeCountdown(H.lottery.pal[H.lottery.index]);   
                            }
                        } else{
                            H.lottery.isCanRoll = false;
                        } 	
                    },
                    sdCallback :function(){
                        H.lottery.isTimeOver = false;
                    }
                });
            });
        },
        lotteryLuck_port: function(){
            var me = this;
            var sn = new Date().getTime()+'';
            me.lotteryTime = getRandomArbitrary(1,1);
            me.times = 0;
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
            	lw.run(2);
            }
        },
        allRecord_port: function() {
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        leftDayCountLimitPrize_port: function() {
            getResult('api/lottery/leftDayCountLimitPrize', {}, 'callbackLeftDayCountLimitPrizeHandler');
        },
        scroll: function(options) {
            $('.award-list').each(function(i) {
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
                        $(me).find('ul').animate({'margin-top': '-25px'}, delay, function() {
                            $(me).find('ul li:first').appendTo($ul)
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                };
            });
        },
        tttj: function() {
            $('#tttj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
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

    W.callbackLotteryAllRecordHandler = function(data) {
        if(data.result){
            var list = data.rl;
            if(list && list.length > 0) {
                var con = "";
                for(var i = 0 ; i<list.length; i++){
                    con += "<li class='list" + i + "'>" + (list[i].ni || "匿名用户") + "中了" + list[i].pn + "</li>";
                };
                var len = $(".award-list").find("li").length;
                if(len >= 500) {
                    $(".award-list").find("ul").html(con);
                }else{
                    $(".award-list").find("ul").append(con);
                }
                $(".award-list").removeClass('transparent').animate({'opacity':'1'}, 300);
                H.lottery.scroll();
            }
        }
    };

    W.callbackLeftDayCountLimitPrizeHandler = function(data) {
        if(data&&data.result) {
            var oldLeftCountPrize = parseInt($(".count label").text());
            if(oldLeftCountPrize >= data.lc || oldLeftCountPrize == 0){
                $(".count label").html(data.lc);
                if(data.lc == 0){
                    $(".count").animate({'opacity':'0'}, 500, function() {
                        $(".count").addClass('none');
                    });
                }else{
                    $(".count").removeClass("none").animate({'opacity':'1'}, 300);
                }
            }
        } else {
            $(".count").animate({'opacity':'0'}, 500, function() {
                $(".count").addClass('none');
            });
        }
    };

    W.commonApiPromotionHandler = function(data) {
        if (data.code == 0 && data.desc && data.url) {
            $('#tttj').removeClass('none').find('p').text(data.desc || '');
            $('#tttj').click(function(e) {
                e.preventDefault();
                if ($("#btn-rule").hasClass('requesting')) {
                    return;
                }
                $("#btn-rule").addClass('requesting');
                shownewLoading(null, '请稍后...');
                location.href = data.url
            });
        } else {
            $('#tttj').remove();
        };
    };
})(Zepto);

$(function() {
    H.lottery.init();
});
