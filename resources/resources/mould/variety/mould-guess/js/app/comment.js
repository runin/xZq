(function($){
	// 弹幕_S
	H.send = {   
		$comments: $('.comment-assist'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		REQUEST_CLS: 'requesting',
		allRecordTime: Math.ceil(4000*Math.random() + 10000),
		nowTime :null,
        type:2, //判断倒计时形式 1为抽奖开始之前，2为抽奖正在进行 默认为2 ,3为今日抽奖已结束或者未查到抽奖活动轮次信息
        guess_type :0,//判断倒计时形式 1为竞猜开始之前，2为竞猜正在进行 默认为2 ,3为今日竞猜已结束或者未查到竞猜活动轮次信息
        dec:0,
        index:0,
        guess_index:0,
        repeatCheck:true,//倒计时重复回调开关
        repeatGuessCheck : true,
        repeatPubCheck : true,
        pal:null,
        crossLotteryCanCallback:false,
        crossLotteryFlag:false,
        guess_crossLotteryCanCallback:false,
        guess_crossLotteryFlag:false,
        on :false,//霸屏开启为true,
        baNum:3,
        baItems :[],
        repeat_load : true,
        repeat_guess_load : true,
        lottery_pra : null,
        voteguess_pra : null,
        res :'',//0、待定   1、胜出   2、淘汰
        resT :'',
        markJump : getQueryString("markJump"),
		init: function() {
			var me = this;
			me.refreshDec();
			me.current_time();
			me.voteguess();
			me.event();
		},
		refreshDec:function(){
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
                            H.send.dec = (nowTime - data.t);
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
        showCountdown : function(data){
        	var me = H.send;
        	var d = $.extend({
        		countType : '',
        		timeLong : '',
        		countText:'',
        		stCallBack : '',
        		etCallBack : '',
        		ctCallBack :'',
        		repeatCheck : '',
        		countDown : '',
        		$tip : "",	
        		index:"",
        	},data)
        	if(d.countType == 'beforeCountDown'){
        		d.stCallBack&&d.stCallBack();
        	}else if(d.countType == 'nowCountDown'){
        		d.etCallBack&&d.etCallBack();
        	}else if(d.countType == 'crossCountdown'){
        		d.ctCallBack&&d.ctCallBack();
        	}
        	d.$tip.find(".countdown-tip").html(d.countText);
	        d.$tip.find('.detail-countdown').attr('etime',d.timeLong).removeClass("hidden");
	        d.$tip.removeClass('hidden');
        	d.countDown();
            var repeatCheck = d.repeatCheck
            me[repeatCheck] = true;
            if(d.countType == 'nowCountDown'){
        		var index = d.index;
        		me[index]++;
        	}
            hidenewLoading();
            
        },
        voteguess: function(){
            var me = H.send;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/voteguess/inforoud' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackVoteguessInfoHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.code == 0){
                        me.nowTime = timeTransform(parseInt(data.cud));
                        var nowTimeStamp = new Date().getTime();
                        me.dec = nowTimeStamp - parseInt(data.cud);
                        me.periodUuid = data.pid;
                        me.currentGuessAct(data);
                    }else{
                        if(me.repeat_guess_load){
                            me.repeat_guess_load = false;
                            setTimeout(function(){
                                me.voteguess();
                            },500);
                        }else{
                             H.send.change("更多精彩，敬请期待",$(".guessCountdown"));
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                	 H.send.change("更多精彩，敬请期待",$(".guessCountdown"));
                }
            });
        },
        guess_d : function(countType){
        	var me = H.send;
        	return {
	        	countType: countType,
	            timeLong : "",
        		stCallBack : function(pra){
        			me.guess_type = 1;
        			this.countText = '竞猜尚未开始',
        			this.timeLong = timestamp(me.voteguess_pra[me.guess_index].gst)+ me.dec;
        			me.spell_guess(me.voteguess_pra,me.guess_index);
        		},
        		etCallBack : function(pra){
        			me.guess_type = 2;
        			this.countText = '竞猜开始',
        			this.timeLong = timestamp(me.voteguess_pra[me.guess_index].get)+ me.dec;
        			$(".guess-item").addClass("starting").removeClass("unstart");
        			if(!$(".guess-item").hasClass("guessed")){
        				$(".btn-vote").removeClass("disabled");
        			}else{
        				me.showBars(me.voteguess_pra[me.guess_index].guid);
        			}
        			$(".guessCountdown").find(".tip-box").addClass("hidden");
        		},
        		repeatCheck :　'repeatGuessCheck',
        		countDown : me.guess_count_down,
        		$tip : $(".guessCountdown"),
        		index : "guess_index"
	        }
        },
        currentGuessAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.items,
                prizeLength = 0,
                nowTimeStr = H.send.nowTime,
                prizeActList = [],
                me = this,
                day = nowTimeStr.split(" ")[0];
            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].gst.split(" ")[0] == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            if(prizeActList.length >0){
            	me.voteguess_pra = prizeActList;
	            prizeLength = prizeActList.length;
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].get,nowTimeStr) >= 0){
                	me.guess_index = prizeLength-1;
                	me.res = prizeActList[prizeLength-1].info;
                    me.guess_type = 3;
                    me.spell_guess(me.voteguess_pra,me.guess_index);
					me.change("本期竞猜结束",$(".guessCountdown"))
                    return; 
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].gst;
                    var endTimeStr = prizeActList[i].get;
                    me.guess_index = i;
                    me.res = prizeActList[i].info;
                    me.resT = prizeActList[i].put;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        me.showCountdown(me.guess_d("nowCountDown"));
                        me.spell_guess(me.voteguess_pra,i);
                        hidenewLoading();
                        return;
                    }
                    // 据下次竞猜开始
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.showCountdown(me.guess_d("beforeCountDown"));
                        hidenewLoading();
                        return;
                    }
                }
            }else{
               H.send.change("更多精彩，敬请期待",$(".guessCountdown"));
            }
        },
        guess_count_down : function() {
        	var that = H.send;
           $(".guessCountdown").find('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + ':'+'%M%' + ':' + '%S%' + '', // 还有...结束
                    stpl : '%H%' + ':'+'%M%' + ':' + '%S%' + '', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                    	if(that.repeatGuessCheck){
	                        that.repeatGuessCheck = false;
	                        $(".guessCountdown").find(".countdown-tip").html("请稍后");
	                        if(that.guess_type == 1){
	                            that.showCountdown(that.guess_d("nowCountDown"));
	                        }else if(that.guess_type == 2){
	                            //距本轮竞猜结束倒计时结束后显示距离下次竞猜开始倒计
	                            if(that.guess_index >= that.voteguess_pra.length){
	                            	//如果已经是最后一轮竞猜倒计时结束 
		                            that.guess_type = 3;
		      						that.change("本轮竞猜已结束",$(".guessCountdown"));
	                            	return;
	                             }
	                            that.showCountdown(that.guess_d("beforeCountDown"));
	                         }
	                    }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        spell_guess:function(pra,i){
        	var me = this,t = simpleTpl();
        	var items = pra[i].pitems;
        	t._('<div class="guess-item" data-uuid="'+pra[i].guid+'">')
	        	._('<div class="guess-img"><img src="'+pra[i].img+'"></div>')
				._('<div class="guess-vote none">')
					for(var n =0; n <items.length;n++ ){
						t._('<a href="#" class="btn-vote" data-re="'+items[n].in+'" id="btn-'+items[n].pid +'" data-collect="true" data-collect-flag="comment-sign-btn" data-collect-desc="'+pra[i].t+''+items[n].ni+'按钮">'+items[n].ni+'</a>')
					}
				t._('</div>')
			._('</div>');
			$("#progress").empty();
        	me.res = pra[i].info;
        	me.resT = pra[i].put;
			$("#guess").empty().html(t.toString()).removeClass("none");
			me.guess_progress(pra[i].guid);
        },
        guess_progress :function(guid){
        	var me = this;
        	$.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/voteguess/isvote' + dev,
                data: {yoi:openid,guid:guid},
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessIsvoteHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                 		if(data.so){
                 			$(".guess-item").addClass("guessed");
                 			$("#btn-"+data.so).addClass("selected");
                 		}else{
                 			me.hide_comment();
                 			$(".guess-item").removeClass("guessed");
                 			$(".btn-vote").removeClass("selected").removeClass("disabled");
                 		}
                 		me.guess_pro_handle(guid);
                    }else{
                        $(".btn-vote").removeClass("selected").removeClass("disabled");
                    }
                },
                error : function(xmlHttpRequest, error) {
                   
                }
            });
        },
        guess_pro_handle : function(guid){
        	var me =this;
            if(me.guess_type == 1){
            	$(".guess-item").addClass("unstart").removeClass("starting").removeClass("none");
            	$(".guess-vote").removeClass("none");
            	$(".btn-vote").addClass("disabled");
            	$(".guessCountdown").find(".tip-box").removeClass("hidden");
            }else if(me.guess_type == 2){
            	$(".guess-item").addClass("starting").removeClass("unstart").removeClass("none");
            	if(!$(".guess-item").hasClass("guessed")){
            		$(".guess-vote").removeClass("none");
            		$(".guessCountdown").find(".tip-box").addClass("hidden");
            	}else{
            		$(".guessCountdown").find(".countdown-tip").html("您猜该选手将会"+$(".selected").html()+"，等待结果揭晓。<br /> 竞猜成功即可抽奖。");
            		$(".guessCountdown").find(".tip-box").removeClass("hidden");
					me.showBars(guid);
				}
            }else if(me.guess_type == 3){
            	me.showBars(guid);
            	$(".guess-item").addClass("end").removeClass("unstart").removeClass("starting").removeClass("none");
            }  
            me.bindBtn(guid);
            me.pub_result(guid,me.res);
        },
        bindBtn:function(guid){
        	var me = this;
        	$(".btn-vote").click(function(e){
				e.preventDefault();
				var $this = $(this);
				if($(".guess-item").hasClass("unstart")){
					$(".guessCountdown").addClass("shake");
					setTimeout(function(){
						$(".guessCountdown").removeClass("shake");
					},1000);
					return;
				}
				if($(".guess-item").hasClass("guessed")){
					return;
				}
				if($(this).hasClass("disabled")){
					return
				}
				if($(this).hasClass("requesting")){
					return;
				}
				$this.addClass("requesting");
				setTimeout(function(){
					$this.removeClass("requesting");
					$this.addClass("selected");
					var pluids = $this.attr('id').split("-")[1];
					$.ajax({
		                type : 'GET',
		                async : false,
		                url : domain_url + 'api/voteguess/guessplayer' + dev,
		                data: {yoi:openid,guid:guid,pluids:pluids},
		                dataType : "jsonp",
		                jsonpCallback : 'callbackVoteguessGuessHandler',
		                timeout: 11000,
		                complete: function() {
		                },
		                success : function(data) {
		                    if(data.code == 0){
		                 		showTips("竞猜成功");
		                 		$(".guess-item").addClass("guessed");
		                 		$(".guessCountdown").find(".countdown-tip").html("您猜该选手将会"+$(".selected").html()+"，等待结果揭晓。<br /> 竞猜成功即可抽奖。");
			            		$(".guessCountdown").find(".tip-box").removeClass("hidden");
								me.showBars(guid);
		                    }else{
		                       showTips("竞猜失败")
		                    }
		                },
		                error : function(xmlHttpRequest, error) {
		                   
		                }
		            });
				},1000)
				
				
				
			});
        },
        showBars :function(guid){
        	var me = this;
        	$.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/groupplayertickets' + dev,
                data: {groupUuid:guid},
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessGroupplayerticketsHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                    	$(".guess-vote").addClass("none");
                    	var t = simpleTpl(),count = 0,width = $(".pro-item"),len = data.items.length,acountPer = 0;
                    	for(var i = 0;i<len;i++){
                    		count = count+parseInt(data.items[i].cunt);
                    	}
                 		for(var i = 0;i<len;i++){
                 			var $curr_item = $("#btn-"+data.items[i].puid),curr_pecent = 0;
                 			if(count <= 0){
	                    		curr_pecent = 0;
	                    		acountPer = 0;
	                    	}else{
	                    		curr_pecent = parseInt((data.items[i].cunt/count*100).toFixed(0));	 
	                    		if(i == len-1){
	                 				curr_pecent = 100 - acountPer;
	                 			}else{
	                 				acountPer += curr_pecent;
	                 			}
	                    	}           
                 			t._('<div class="pro-item"><label class="pro-tip">'+$curr_item.html()+'</label><span class="pro-bar" data-per="'+curr_pecent+'"></span><label class="percent">'+curr_pecent+'%</label></div>')
                 		}
                 		$("#progress").empty().html(t.toString())
                 		$(".pro-item").each(function(){
                 			$(this).find(".pro-bar").animate({'width':$(this).width()*0.65*$(this).find(".pro-bar").attr("data-per")/100})
                 		});
                 	    me.show_comment();
                    }else{
                       
                    }
                },
                error : function(xmlHttpRequest, error) {
                   
                }
            });
        },
        show_comment : function(){
        	$(".cor-assist").height($(".guess-img").height()).removeClass("none");
	        $("#article").removeClass("none");
	        H.comment.init();
        },
        hide_comment : function(){
             $(".cor-assist").addClass("none");
             $(".cor-assist").find("#comments").html(" ");
             $(".article").addClass("none");
        },
       pub_d : function(countType){
        	var me = H.send;
        	return {
	        	countType: countType,
	            timeLong : "",
        		stCallBack : function(pra){
        		},
        		etCallBack : function(pra){
        			this.countText = '竞猜结果公布倒计时',
        			this.timeLong = timestamp(me.resT)+ me.dec;
        		},
        		repeatCheck :　'repeatPubCheck',
        		countDown : me.pub_count_down,
        		$tip : $(".pub-countDown")
	        }
        },
        pub_result : function(guid,res){
        	var me = this;
            if(comptime(H.send.nowTime,me.resT) > 0){
                 me.showCountdown(me.pub_d("nowCountDown"));
            }else{
            	me.show_result(guid);
            }
        },
        show_result : function(guid){
        	var me = this;
        	if( me.res == 0){
        		$(".guess-img").addClass("wait");
        	}else if( me.res == 1){
        		$(".guess-img").addClass("win");
        	} else if( me.res == 2){
        		$(".guess-img").addClass("quit");
        	}
        	$(".guess-vote").addClass("none");
        	if(!$(".guess-item").hasClass("end")){
        		if($(".guess-item").hasClass("guessed")){
					if($(".selected").attr("data-re") == me.res){
						$(".guessCountdown").find(".countdown-tip").html('恭喜竞猜成功！<a class="btn-lottery" href="tiger.html?source=vote" id="btn-lottery" data-collect="true" data-collect-flag="guess-right-lottery-btn" data-collect-desc="发表评论按钮">立即抽奖</a>');
						$(".guessCountdown").find(".tip-box").removeClass("hidden");
					}else{
						$(".guessCountdown").find(".countdown-tip").html('很遗憾竞猜失败');
						$(".guessCountdown").find(".tip-box").removeClass("hidden");
					}
			    }else{
			    	me.showBars(guid);
			    	$(".guessCountdown").find(".countdown-tip").html('竞猜结果已经揭晓');
					$(".guessCountdown").find(".tip-box").removeClass("hidden");
				}
        	}else{
        		$(".guessCountdown").find(".countdown-tip").html('本轮竞猜已结束');
				$(".guessCountdown").find(".tip-box").removeClass("hidden");
        	}
  
        },
        pub_count_down : function() {
        	var that = H.send;
             $('.pub-countDown').find('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + ':'+'%M%' + ':' + '%S%' + '', // 还有...结束
                    stpl : '%H%' + ':'+'%M%' + ':' + '%S%' + '', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                    	if(that.repeatPubCheck){
	                        that.repeatPubCheck = false;
	                      	that.show_result($(".guess-item").attr("data-uuid"));
	                    }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        current_time: function(){
        	var me = H.send;
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
                        me.nowTime = timeTransform(data.sctm);
                        var nowTime = Date.parse(new Date());
                        me.dec = (nowTime - data.sctm);
                        me.currentPrizeAct(data);
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.current_time();
                            },500);
                        }else{
                            me.change("更多精彩，敬请期待",$(".countdown"));
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                      me.change("更多精彩，敬请期待",$(".countdown"));
                }
            });
        },
        //接口返回false，没有查到抽奖活动
        change: function(text,$tip){
            H.send.isCanShake = false;
            H.send.type = 3;
            $tip.find($(".countdown-tip")).html(text);
            $tip.find($(".detail-countdown")).addClass("hidden");
            $tip.removeClass("hidden");
            $(".icon-hand img").removeClass("wobble");
            hidenewLoading();
        },
  		currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.send.nowTime,
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
            	me.lottery_pra = prizeActList;
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
                       me.showCountdown(me.lottery_d("crossCountdown"));
                    } else {
                        me.type = 3;
	                    me.change("本期摇奖已结束",$(".countdown"));
                    }
                    return; 
                }
                for ( var i = 0; i < prizeActList.length; i++) { 
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    me.index = i;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        if(me.markJump&&me.markJump == 'yaoClick'){
                        	 me.showCountdown(me.lottery_d("nowCountDown"));
                        }else{
                        	toUrl('yao.html');
                        }
                        hidenewLoading();
                        return;
                    }
                    // 据下次摇奖开始
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        me.showCountdown(me.lottery_d("beforeCountDown"));
                        hidenewLoading();
                        return;
                    }
                }
            }else{
                H.send.change("更多精彩，敬请期待",$(".countdown"));
            }
        },
        lottery_d : function(countType){
        	var me = H.send;
        	return {
	        	countType: countType,
	            timeLong : "",
        		stCallBack : function(pra){
        			me.type = 1;
//	            	me.isCanShake = false;
        			this.countText = '距离摇奖开始还有',
        			this.timeLong = timestamp(me.lottery_pra[me.index].pd+" "+me.lottery_pra[me.index].st)+ me.dec;
        			$(".icon-hand img").removeClass("wobble");
        		},
        		etCallBack : function(pra){
        			me.type = 2;
//	            	me.isCanShake = true;
        			this.countText = '距离摇奖结束还有',
        			this.timeLong = timestamp(me.lottery_pra[me.index].pd+" "+me.lottery_pra[me.index].et)+ me.dec;
        			$(".icon-hand img").addClass("wobble");
        		},
        		ctCallBack :function(pra){
        			me.type = 1;
//	            	me.isCanShake = false;
	            	me.crossLotteryFlag = false;
            		me.crossLotteryCanCallback = true;
        			this.countText = '距离摇奖开始还有',
        			this.timeLong = timestamp(me.lottery_pra[me.index].nst)+ me.dec;
        			$(".icon-hand img").removeClass("wobble");
        		},
        		repeatCheck :　'repeatCheck',
        		countDown : me.count_down,
        		$tip : $(".countdown"),
        		index:"index"
	        }
        },
        
        count_down : function() {
        	var that = H.send;
             $(".countdown").find('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + ':'+'%M%' + ':' + '%S%' + '', // 还有...结束
                    stpl : '%H%' + ':'+'%M%' + ':' + '%S%' + '', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                    	if(that.repeatCheck){
	                        that.repeatCheck = false;
	                        $(".countdown").find(".countdown-tip").html("请稍后");
	                        $(".countdown").find('.detail-countdown').addClass("hidden");
	                        if(that.type == 1){
	                        	if(H.send.crossLotteryCanCallback){
	                        		var delay = Math.ceil(2000*Math.random() + 500);
                                    H.send.crossLotteryCanCallback = false;                                 
                                    shownewLoading(null, '请稍后...');
                                    setTimeout(function(){
                                        that.current_time();
                                    }, delay);
                                    return;
	                        	}
	                        	toUrl("yao.html");
	                            //距下次摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
	                           //  that.showCountdown(that.lottery_d("nowCountDown"));
	                        }else if(that.type == 2){
	                            //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
	                            if(that.index >= that.lottery_pra.length){
	                            	//跨天倒计时
	                            	if(that.crossLotteryFlag){
	                            		that.showCountdown(that.lottery_d("crossCountdown"));
	                            	}else{
	                            		// 如果已经是最后一轮摇奖倒计时结束 
		                                that.type = 3;
		      							that.change("本期摇奖已结束",$(".countdown"));
	                            	}
	                            	return;
	                             }
	                            that.showCountdown(that.lottery_d("beforeCountDown"));
	                         }
	                    }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
		event: function() {
			var me = this;
			this.$btnCmt.click(function(e) {
				e.preventDefault();
				if ($(this).hasClass(me.REQUEST_CLS)) {
					return;
				}
				var comment = $.trim(me.$inputCmt.val()) || '',
					comment = comment.replace(/<[^>]+>/g, ''),
					len = comment.length;
					
				if (len < 1) {
					showTips('请先说点什么吧');
					me.$inputCmt.removeClass('error').addClass('error');
					return;
				} else if (len > 16) {
					showTips('字数不能超过16哦');
					me.$inputCmt.removeClass('error').addClass('error');
					return;
				}
				$(this).addClass(me.REQUEST_CLS);
				shownewLoading(null,'发送中...');
				$.ajax({
	                type : 'GET',
	                async : false,
	                url : domain_url + 'api/comments/save'+dev,
	                data: {
	                    co: encodeURIComponent(comment),
	                    op: openid,
	                    tid:null,
	                    ty: 1,
	                    nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
	                    headimgurl: headimgurl ? headimgurl : ""
	                },
	                dataType : "jsonp",
	                jsonpCallback : 'callbackCommentsSave',
	                complete: function() {
	                    hidenewLoading();
	                },
	                success : function(data) {
	                    me.$btnCmt.removeClass(me.REQUEST_CLS);
	                    if(data.code == 0) {
	                        showTips('发送成功');
	                        var h= headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/danmu-head.jpg';
	                        barrage.appendMsg('<div class="cor"><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-cor">'+comment+'</div></div>');
	                        $('.isme').parent('div').addClass('me');
	                        me.$inputCmt.removeClass('error').val('');
	                        return;
	                     }
	                    showTips("发送失败");
	                }
	            });
			});
			$("#btn-sign").click(function(e){
				e.preventDefault();
				toUrl('sign.html');
			});
			$(".countdown .tip-box").click(function(e){
				e.preventDefault();
				toUrl('yao.html');
			});
	    },
	    showdiatips : function(tip,time){
	    	$(".dia-tip").html(tip).addClass("bounceIn");
	    	setTimeout(function(){
	    		$(".dia-tip").html("").removeClass("bounceIn");
	    		$("#btn-turn").removeClass("tiping");
	    	},time||2000)
	    }
	};
	H.comment = {
		timer: 5000,
		maxid: 0,
		pageSize: 50,
		$comments: $('#comments'),	
		baMaxid : localStorage.baMaxid || 0,
		init: function() {
			var me = this;
			W['barrage'] = this.$comments.barrage();
			W['barrage'].start(1);
			setInterval(function() {
				me.flash();
			}, me.timer);
		},
		flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + "api/comments/room"+dev,
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
	                if (data.code == 0) {
	                  var h = "images/danmu-head.jpg";
	                    me.maxid = data.maxid;
	                     var items = data.items || [], umoReg = '/:';
	                    for (var i = 0, len = items.length; i < len; i++) {
	                    	var hmode = '<div class="c_head_img"><img src="./images/danmu-head.jpg" class="c_head_img_img" /></div>';
		                    if (items[i].hu) {
		                        hmode = '<div class="c_head_img"><img src="' + items[i].hu + '/64" onerror="javascript:this.src=\'images/danmu-head.jpg\'" class="c_head_img_img" /></div>';
		                    }
		                    barrage.pushMsg(hmode + items[i].co); 
	                    }
	                } else {
	                	return;
	                }
                }
            });
        }
	};
})(Zepto);

$(function(){
	H.send.init();
});