/**
 * 老三热线--答题页
 */
(function($){
    H.answer = {
        $question: $("#question"),
        nowTime: null,
        yaoNowTime :null,
        dec: 0,//服务器时间与本地时间的差值
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        yao_repeat_load : true,
        index: 0, // 当前答题活动在 list 中的下标
        yao_index : 0,// 抽奖活动下标
        type: 2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        yao_type:0,
        pal: [],// 答题活动list
        yao_pal : [],//抽奖活动list
        repeatCheck: true,
        yaoRepeatCheck : true,
        quid: '',
        checkedParams :"",
        rightParams :"",
        markJump : getQueryString("markJump"),
        crossLotteryCanCallback:false,
        crossLotteryFlag:false,
        proHeight : 0,
        proSec : '',
        probar :$(".progress i"),
        showSec :$(".yao-detail-countdown"),
        wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        account_timer : null,//排行榜定时器
        stRepeat : true,
        isinit:false,
        isret:false,
        isLeft:false,
        lastXPos:0,
        lastYPos:0,
        notMove:true,
        cx:330,
        cy:330,
        init: function(){        
            var me = this;
            this.current_time();
            this.yao_current_time();
            H.answer.account_num();
            setInterval(function(){
            	H.answer.account_num();
            },Math.random(1,4)*1000+10000)
            this.account_person();
            this.event();
            this.ddtj();
            getResult('api/collectcard/activity/round', {matk: matk}, 'callbackCollectCardRoundHandler');
        },
        ddtj : function(){
            getResult('api/common/promotion', {oi:openid}, 'commonApiPromotionHandler',true);
        },
        toucha: function (obj) {
            var me = this;
            obj.on("touchstart", function (ts) {
                if (ts.targetTouches.length == 1) {
                    ts.preventDefault();
                    var touch = ts.targetTouches[0];
                }
                var constx = touch.pageX;
                var consty = touch.pageY;
                obj.on("touchmove", function (e) {
                    e.preventDefault();
                    e = e.changedTouches[0];
                    if(!me.isret){
                        if((e.pageX < 40 && e.pageX >= 0 ) && (e.pageY < 40 && e.pageY >= 0 )){
                            me.notMove = true;
                        }else{
                            me.notMove = false;}
                        me.cx = e.pageX;
                        me.cy = e.pageY;
                        if(me.isLeft){
                            $(this).css({"-webkit-transform":'translate(' + (me.cx-constx-($(window).width() * .9 - 60)) + 'px,' + (me.cy-consty + me.lastYPos) + 'px)'});
                        }else{
                            $(this).css({"-webkit-transform":'translate(' + (me.cx-constx) + 'px,' + (me.cy-consty + me.lastYPos) + 'px)'});
                        }
                    }
                }).one("touchend", function () {
                    me.isret = true;
                    if(me.notMove == true){
                        toUrl('plot.html');
                    }
                    var endXPos = null,endYPos = null;
                    if((me.cx-constx < -($(window).width() * .3)) || (me.cx-constx+me.lastXPos) <-($(window).width() *.4)){
                        endXPos = -($(window).width() * .9 - 60);
                        me.isLeft = true;
                    }else {
                        endXPos = 0;
                        if(!me.notMove){
                            me.isLeft = false;
                        }
                    }
                    if((me.cy- 35) < ($(window).height() * .1)){
                        endYPos = ($(window).height() * .1);
                    }else if((me.cy) > ($(window).height() * .9 - 60)){
                        endYPos = ($(window).height() * .9 - 60);
                    }else {
                        endYPos = me.cy - 35;
                    }
                    if(me.notMove == true){
                        toUrl('plot.html');
                    }else{
                        $("#btn-plot").animate({"-webkit-transform":'translate(' + endXPos + 'px,' + endYPos + 'px)'},300,'ease-out',function () {
                            me.isret = false;
                            $("#btn-plot").off();
                            me.toucha(obj);
                            me.notMove = true;
                        });
                        me.lastXPos = endXPos;
                        me.lastYPos = endYPos;
                    }
                })
            });
        },
         //查询当前参与答题的好友榜单
        account_person: function(){
		    getResult('api/question/rank/partake', {yoi :openid}, 'callbackQuestionRankPartakeHandler',false,$(".body"),true);
		},
            //查询当前参与人数
        account_num: function(){
		    getResult('api/common/servicedaypv', {}, 'commonApiSDPVHander',false,$(".body"),true);
		},
        refreshDec:function(){
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000*5*Math.random() + 60000*3);
            setInterval(function(){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/common/time' + dev,
                    data: {},
                    dataType : "jsonp",
                    jsonpCallback : 'commonApiTimeHandler',
                    timeout: 11000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.t){
                            var nowTime = new Date().getTime();
                            H.answer.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {}
                });
            },dely);
        },
        question_record: function(){
            getResult("api/question/record",{yoi: openid, quid: H.answer.quid},'callbackQuestionRecordHandler',false);
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
        yao_current_time: function(){
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
                        H.answer.yaoNowTime = timeTransform(data.sctm);
                        H.answer.yaoCurrentPrizeAct(data);
                    }else{
                        if( H.answer.yao_repeat_load){
                            H.answer.yao_repeat_load = false;
                            setTimeout(function(){
                                H.answer.yao_current_time();
                            },500);
                        }else{
                        	H.answer.safeMode();
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                     H.answer.safeMode();
                }
            });
        },
        safeMode : function(){
        	  hidenewLoading();
        	  H.answer.yao_type = 3;
        	  $(".icon-gift").removeClass("wobble").removeClass("lucking").removeClass("beforeluck").find("img").attr("src","images/icon-grey-gift.png");
        	  $(".progress").addClass("grey-progress").find('i').css('height','100%');
        	  $(".yao-countdown").removeClass("hidden");
        },
  		yaoCurrentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.answer.yaoNowTime,
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
            	H.answer.yao_pal = prizeActList;
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
                        me.yaoCrossCountdown(prizeActList[prizeLength - 1].nst);
                    } else {
                        H.answer.yao_type = 3;
	                    H.answer.safeMode();
                    }
                    return; 
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        me.yao_index = i;
                        me.probar.animate({"height":"100%"},500);
                        if(me.markJump&&me.markJump == 'yaoClick'){
                        	me.yaoNowCountdown(prizeActList,i);
                        }else{
                        	toUrl('yao.html');
                        }
                        hidenewLoading();
                        return;
                    }
                    // 据下次摇奖开始
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                       me.yao_index = i;
                       me.yaoBeforeShowCountdown(prizeActList,i);
                       hidenewLoading();
                       return;
                    }
                }
            }else{
                H.answer.safeMode();
            }
        },
          //初始化进度条
        init_progress : function(pra,index){
        	var me = this;
        	
        	var beginTimeStr = pra[index].pd+" "+pra[index].st;
            var beginTimeLong = timestamp(beginTimeStr);
            var endTimeStr = '';
            if(index >0){
            	endTimeStr = pra[index-1].pd+" "+pra[index-1].et;
            }else{
            	endTimeStr = pra[index].pd+ " "+"00:00:00";
            }
            var endTimeLong = timestamp(endTimeStr);
            me.proHeight = $(".progress").height();
            me.proSec = (beginTimeLong - endTimeLong)/1000;
        },
        // 距下次摇奖开启倒计时
        yaoBeforeShowCountdown: function(pra,index) {
        	var me = this;
            me.yao_type = 1;
            var beginTimeStr = pra[index].pd+" "+pra[index].st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $(".icon-gift").removeClass("wobble").removeClass("lucking").addClass("beforeluck");
            me.init_progress(pra,index);
            $(".yao-countdown-tip").html('距摇奖开启还有 ');
            $('.yao-detail-countdown').attr('stime',beginTimeLong).removeClass("hidden");
            me.yao_count_down();
            $('.yao-countdown').removeClass('hidden');
            me.yaoRepeatCheck = true;
            hidenewLoading();
        },
        // 距本轮摇奖结束倒计时
        yaoNowCountdown: function(pra,i){
        	var me = this;
            me.yao_type = 2; 
            me.probar.css({"height":"100%"});
            $(".icon-gift").removeClass("beforeluck").addClass("rollIn").addClass("lucking");
            setTimeout(function(){
            	 $(".icon-gift").removeClass("rollIn");
            	 $(".icon-gift").addClass("wobble");
            },2000)
            var endTimeStr = pra[i].pd+" "+pra[i].et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.yao-detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
            $(".yao-countdown-tip").html("距摇奖结束还有");
            me.yao_count_down();
            $(".yao-countdown").removeClass("hidden");
            me.yao_index ++;
            me.yaoRepeatCheck = true;
            hidenewLoading();
        },
        // 跨天摇奖开启倒计时
        yaoCrossCountdown: function(nextTime) {
            var me = this;
            $(".icon-gift").removeClass("wobble").removeClass("lucking").addClass("beforeluck");
            me.crossLotteryFlag = false;
            me.crossLotteryCanCallback = true;
            me.yao_type = 1;
            var beginTimeLong = timestamp(nextTime);
            beginTimeLong += me.dec;
            $('.yao-detail-countdown').attr('stime',beginTimeLong).removeClass("hidden");
            $(".yao-countdown-tip").html('距本轮摇奖开始还有');
            me.count_down();
            $('.yao-countdown').removeClass('hidden');
            me.yaoRepeatCheck = true;
            hidenewLoading();
        },
        yao_count_down : function() {
            $('.yao-detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%SS%'+'s' , // 还有...结束
                    stpl : '%SS%'+'s', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                    	if(H.answer.yaoRepeatCheck){
	                        H.answer.yaoRepeatCheck = false;
	                        $(".yao-countdown-tip").html("请稍后");
	                        $('.yao-detail-countdown').addClass("hidden");
	                        if(H.answer.yao_type == 1){
	                        	if(H.answer.crossLotteryCanCallback){
	                        		var delay = Math.ceil(1000*Math.random() + 500);
                                    H.answer.crossLotteryCanCallback = false;                                 
                                    shownewLoading(null, '请稍后...');
                                    setTimeout(function(){
                                        H.answer.yao_current_time();
                                    }, delay);
                                    return;
	                        	}
	                        	if(!H.dialog.isOpen){
	                            	shownewLoading(null, '请稍后...');
	                            	setTimeout(function(){
	                            		toUrl("yao.html");
	                            	},2000)
		                        }else{
		                        	//距下次摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
	                            	H.answer.yaoNowCountdown(H.answer.yao_pal,H.answer.yao_index);
		                        } 
	                        }else if(H.answer.yao_type == 2){
	                            //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
	                            if(H.answer.yao_index >= H.answer.yao_pal.length){
	                            	//跨天倒计时
	                            	if(H.answer.crossLotteryFlag){
	                            		 H.answer.yaoCrossCountdown(H.answer.yao_pal[H.answer.yao_pal.length - 1].nst);
	                            	}else{
	                            		// 如果已经是最后一轮摇奖倒计时结束 
		                                H.answer.yao_type = 3;
		                                H.answer.safeMode();
	                            	}
	                            	return;
	                             }
	                             H.answer.yaoBeforeShowCountdown(H.answer.yao_pal,H.answer.yao_index);
	                         }
	                    }
                    },
                    sdCallback :function(){
   
                    },
                    stCallback : function(){          
                    	var me = H.answer;
                    	if(me.stRepeat){
                    		me.probar.animate({"height":me.proHeight-me.proHeight/me.proSec*parseInt(me.showSec.html())+'px'},500,function(){
                    			me.stRepeat = false;
                    		})
                    	}else{
                    		me.probar.css("height",me.proHeight-me.proHeight/me.proSec*parseInt(me.showSec.html())+'px');
                    	}
                    	
                    }
                });
            });
        },
        event: function(){
            var me = H.answer;
            $("dl").delegate('dd.item', 'click', function(e) {
                e.preventDefault();
                if(me.$question.find("dl").hasClass('disabled')){
                	$(".countdown").addClass("shake");
                	setTimeout(function(){
                		$(".countdown").removeClass("shake");
                	},1000)
                    return;
                }
                if(me.$question.find("dl.item").hasClass('unclick')){
                    return;
                }
                $(this).addClass("selected").siblings("dd").removeClass("selected");
                $(this).addClass("pulse");
                me.checkedParams = $(this).attr('data-auid');
                setTimeout(function(){
                	shownewLoading(null,"验证答案中");
                	getResult("api/question/answer",{
	                    yoi: openid,
	                    suid: me.quid,
	                    auid: me.checkedParams
	                },'callbackQuestionAnswerHandler',false);
                },1000)  
            });
            $(".yao-countdown").delegate('.lucking', 'click', function(e) {
                e.preventDefault();
                toUrl('yao.html');
            });
            $(".yao-countdown").delegate('.beforeluck', 'click', function(e) {
                e.preventDefault();
                var tip = $(".yao-detail-countdown").html()+"之后点击礼盒开启摇奖";
                showTips(tip);
            });
            $("#btn-plot").click(function(e) {
                e.preventDefault();
                toUrl('plot.html');
            });
            $(".btn-act").click(function(e) {
                e.preventDefault();
                toUrl('act.html');
            });
        },
        //查询题目信息
        current_time: function(){
            var me = H.answer;
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/question/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackQuestionRoundHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.code == 0){
                        me.nowTime = timeTransform(parseInt(data.cud));
                        var nowTime = new Date().getTime();
                        var serverTime = parseInt(data.cud);
                        me.dec = nowTime - serverTime;
                        me.currentPrizeAct(data);
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.current_time();
                            },500);
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {}
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeLength = 0,
                nowTimeStr = H.answer.nowTime,
                prizeActList = data.qitems,
                me = H.answer;
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].qet,nowTimeStr) >= 0){
                    me.index = prizeLength-1;
                    me.type = 3;
                    me.spellQuestion(prizeActList, prizeLength-1);
                    me.change();
                    return;
                }
                 H.answer.wxConfig();
                //如果第一轮未开始
                if(comptime(prizeActList[0].qst,nowTimeStr) < 0){
                    me.index = 0;
                    me.spellQuestion(prizeActList, 0);
                    me.beforeShowCountdown(prizeActList, 0);
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].qst;
                    var endTimeStr = prizeActList[i].qet;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        me.nowCountdown(prizeActList, i);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.beforeShowCountdown(prizeActList, i);
                        return;
                    }
                }
            }else{
                me.change();
                return;
            }
        },
        // 答题开启倒计时
        beforeShowCountdown: function(pra, index) {
            var me = H.answer,
                beginTimeStr = pra[index].qst;
            me.$question.find("dl").addClass('disabled');
            clearInterval(me.account_timer);
            me.account_timer = null;
            me.type = 1;
            me.repeatCheck = true;
            me.countdown_domShow(beginTimeStr,"距本轮答题开启还有", pra, index);
        },
        // 答题结束倒计时
        nowCountdown: function(pra, index){
            var me = H.answer,
                endTimeStr = pra[index].qet;
            me.account_person();
 			me.account_timer = setInterval(function(){
 				me.account_person();
 			},Math.random(1,4)*10000+50000)
            me.type = 2;
            me.$question.find("dl").removeClass('disabled');
            me.countdown_domShow(endTimeStr,"距本轮答题结束还有", pra, index);
            me.index ++;
        },
        countdown_domShow: function(time, word, pra, index){
            var me = H.answer,
                timeLong = timestamp(time);
            timeLong += me.dec;
            $('.detail-countdown').attr('etime',timeLong);
            $(".countdown-tip").html(word);
            me.count_down();
            $('.items-count').removeClass('none');
            $('.loading').addClass('none');
            $(".countdown").removeClass("none");
            me.repeatCheck = true;
            me.spellQuestion(pra, index);
        },
        // 倒计时
        count_down : function() {
            $('.detail-countdown').each(function() {
                var me = H.answer;
                $(this).countDown({
                    etpl : '<label class="hour">%H%</label>' + '<span>时</span>' + '<label>%M%</label>' + '<span>分</span>' + '<label>%S%</label>' + '<span>秒</span>' , // 还有...结束
                    stpl : '<label class="hour">%H%</label>' + '时:' + '<label>%M%</label>' + '分' + '<label>%S%</label>'+ '秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        // repeatCheck 用来进行重复判断默认为true，第一次进入之后变为false
                        if(me.repeatCheck){
                            me.repeatCheck = false;
                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                me.nowCountdown(me.pal, me.index);
                            }else if(me.type == 2){
                                //距摇奖结束倒计时结束后显示距离下轮摇奖开始倒计时
                                if(me.index >= me.pal.length){
                                    me.type = 3;
                                     me.change();
                                    return;
                                }
                                me.beforeShowCountdown(me.pal, me.index);
                            }
                        }
                    },
                    sdCallback :function(){
                        me.repeatCheck = true;
                    }
                });
            });
        },
        change: function(){
            var me = H.answer;
            clearInterval(me.account_timer);
            me.account_timer = null;
            $(".countdown").removeClass("none").html('本期答题抽奖已结束，请等待下期!');
            me.$question.find("dl").addClass('disabled');
        },
        spellQuestion: function(qitems, index){
            var me = H.answer; t = simpleTpl();
            me.quid = qitems[index].quid;
            me.rightParams = qitems[index].qriu;
            t._('<dt data-quid="'+ qitems[index].quid +'">'+ qitems[index].qt +'</dt>');
            t._('<dd class="qus-img"><div><p class=""></p><img src="images/qus-default.jpg" data-src="'+qitems[index].bi+'" onerror="$(\'.qus-img\').addClass(\'none\')"  onload="$(this).attr(\'src\',\''+qitems[index].bi+'\');$(\'.qus-img p\').addClass(\'splash\')"/></div></dd>');
                $.each(qitems[index].aitems, function(i,aitem){
                    t._('<dd data-sec="'+(i*0.5)+'" data-auid="'+ aitem.auid +'" class="unClick item item-'+aitem.auid+'">'+ aitem.at +'</dd>');
                });
            $('dl').html(t.toString());
            me.question_record();
        },
        drawlottery: function(){
            var me = H.answer;
            var sn = new Date().getTime()+'';
            recordUserOperate(openid, "答题正确调用抽奖接口", "doLottery");
            shownewLoading(null,"抽奖中");
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck4Vote' + dev,
                data: {
                    matk: matk,
                    sn: sn
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuck4VoteHandler',
                timeout: 11000,
                complete: function() {
                    sn = new Date().getTime()+'';
                    hidenewLoading();
                },
                success : function(data) {
                	if(data &&data.flow && data.flow == 1){
                        H.dialog.thank.open()
                        return;
                    }
                    if(data && data.result&&data.pt!==0 && data!== null){
                        if(data.sn == sn){
                           H.dialog.lottery.open(data)
                        }else{
                        	H.dialog.thank.open()
                        }
                    }else{
                    	H.dialog.thank.open();
                    }
                },
                error : function(xmlHttpRequest, error) {
                	H.dialog.thank.open();
                }
            });
        }
    };
    W.callbackQuestionRecordHandler = function(data) {
        var me = H.answer;
        if (data.code == 0) {
            if (data.anws) {
            	if(data.rs&&data.rs == 2){
	        		me.$question.find("dd.item-"+data.anws).addClass("right");
	                me.$question.find("dl").addClass('disabled');
	            }else{
	            	me.$question.find("dd.item-"+me.rightParams).addClass("right");
	            	me.$question.find("dd.item-"+data.anws).addClass("wrong");
	                me.$question.find("dl").addClass('disabled');
	            }
            }else{
            	if(me.type == 2){
            		me.$question.find("dl").removeClass('disabled');
            	}
            	
            }
        }else {
            if(me.type == 2){
            	me.$question.find("dl").removeClass('disabled');
            }
        } 	
        $('#question').removeClass('none');
   		$("dd.item").each(function(i){
         	$(this).css({
			    '-webkit-animation-name': 'fadeInUp',
				'animation-name': 'fadeInUp',
				'-webkit-animation-duration': '1s',
				'animation-duration': '1s',
				'-webkit-animation-fill-mode': 'both',
				'animation-fill-mode': 'both',
				'-webkit-animation-delay':  $(this).attr('data-sec')+'s',
				'animation-delay': $(this).attr('data-sec')+'s'
		    });
        }) 
        setTimeout(function(){
        	$("dd.item").css({
        		'-webkit-animation':null,
        		'animation':null,
        		'opacity' :"1"
        	}).removeClass("unClick")
        },(parseInt($("dd.item:last-child").attr('data-sec'))+1)*1000)
        
    };
    W.callbackQuestionAnswerHandler = function (data){
    	hidenewLoading();
        var me = H.answer;
        if (data.code == 0) {
            me.$question.find("dd.item-"+me.rightParams).addClass("right").removeClass("selected");
            me.$question.find("dd.item").removeClass("selected");
            me.$question.find("dl").addClass('disabled');
            if(data.rs == 1){//答错题
            	me.$question.find("dd.item-"+me.checkedParams).addClass("wrong").removeClass("selected");
                showTips("抱歉！答错了");
            }else if(data.rs == 2){//答对题
            	if(!H.answer.wxCheck){
                    H.dialog.thank.open(); 
                }else{
                	me.drawlottery();
         	}
                
            }
        }
    };
    W.commonApiSDPVHander = function(data){
		if(data.code == 0){
			$(".count").html("参与人数:<span>"+data.c+"</span>");
			$(".count").removeClass("none");
		}else{
			$(".count").addClass("none");
		}
	};
	W.callbackQuestionRankPartakeHandler = function(data){
		if(data&&data.result == 0){
			var t = simpleTpl();
			for(var i=0,len = data.rank.length;i<len;i++ ){
				t._('<label data-sec='+(i*0.2)+'><img src="'+(data.rank[i].hi?(data.rank[i].hi+'/'+yao_avatar_size) : "images/icon-head.jpg")+'"></label>')
			}
			$(".heads").html(t.toString());
			$(".friend").removeClass("none");
			$(".heads label").each(function(i){
         	$(this).css({
			    '-webkit-animation-name': 'slideInRight',
				'animation-name': 'slideInRight',
				'-webkit-animation-duration': '.5s',
				'animation-duration': '.5s',
				'-webkit-animation-fill-mode': 'both',
				'animation-fill-mode': 'both',
				'-webkit-animation-delay':  $(this).attr('data-sec')+'s',
				'animation-delay': $(this).attr('data-sec')+'s'
		    });
        })
		}else{
			$(".friend").addClass("none");
		}
	};
    W.commonApiPromotionHandler = function(data){
        var me = H.answer;
        if(data.code == 0){
            // me.toucha($("#btn-plot"));
            $("#btn-plot").removeClass('hidden').animate({"-webkit-transform":'translate(0,260px)'},300,'ease-out',function () {
                me.isret = false;
                me.lastYPos = 260;
                me.notMove = true;
            });
        }else{
            $("#btn-plot").addClass('hidden');
        }
            
    };
    W.callbackCollectCardRoundHandler = function(data){
        if (data.result) {
            var nowTimeStr = timeTransform(parseInt(data.cud)),
                beginTimeStr = data.st,
                endTimeStr = data.et;
            if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0) $('.btn-act').removeClass('none');
        }
    };
})(Zepto);
$(function(){
    H.answer.init();
     wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.answer.isError){
                    H.answer.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });

    wx.error(function(res){
        H.answer.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});