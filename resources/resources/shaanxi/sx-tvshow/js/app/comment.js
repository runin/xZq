(function($){
	// 弹幕_S
	H.send = {   
		$comments: $('.comment-assist'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		REQUEST_CLS: 'requesting',
		allRecordTime: Math.ceil(4000*Math.random() + 10000),
		nowTime :null,
        type:2, //判断倒计时形式 1为抽奖开始之前，2为抽奖正在进行 默认为2 ,3为今日抽奖已结束,0未查到抽奖活动轮次信息
        dec:0,
        index:0,
        repeatCheck:true,//倒计时重复回调开关
        pal:null,
        crossLotteryCanCallback:false,
        crossLotteryFlag:false,
        on :false,//霸屏开启为true,
        baNum:3,
        baItems :[],
		init: function() {
			var me = this;
			me.current_time();
			me.resize();
			me.fill_sign();
			H.sign.init();
			H.comment.init();
			me.event();
            me.cor_bg();
            me.cor_count();
            setInterval(function(){
            	 H.send.cor_count();
            },Math.ceil(4000*Math.random() + 5000));
		},
		cor_bg : function(){
			getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler');
		},
		fill_sign : function(){
			$(".head_img").attr("src", headimgurl || "images/danmu-head.jpg");
			$(".nikcName").text(nickname||"匿名用户");
		},
		cor_count : function(){
			getResult('api/comments/count',{},'callbackCommentsCount');
		},
		resize :function(){
			var me = this;
			var width = $(window).width();
			var height = $(window).height();
			me.$comments.css('width', width);
			me.$comments.css('height',height - $("header").height()-54);
			$(".container").width(width);
			$(".container").height(height);
			H.send.baNum =Math.floor($("#baping").height()/40) -2;
			
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
                            H.se.dec = (nowTime - data.t);
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
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
                        H.send.nowTime = timeTransform(data.sctm);
                        var nowTime = Date.parse(new Date());
                        H.send.dec = (nowTime - data.sctm);
                        H.send.currentPrizeAct(data);
                    }else{
                        H.send.change();
                    }
                },
                error : function(xmlHttpRequest, error) {
                      H.send.change();
                }
            });
        },
        //活动结束
        end: function(){
        	H.send.isCanShake = false;
            H.send.type = 3;
            $(".countdown-tip").html("本期摇奖已结束");
            $(".detail-countdown").addClass("hidden");
            $(".countdown").removeClass("hidden");
            hidenewLoading();
        },
        //接口返回false，没有查到抽奖活动
        change: function(){
            H.send.isCanShake = false;
            H.send.type = 0;
            $(".countdown-tip").html("更多精彩，敬请期待");
            $(".detail-countdown").addClass("hidden");
            $(".countdown").removeClass("hidden");
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
            	H.send.pal = prizeActList;
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
                        me.crossCountdown(prizeActList[prizeLength - 1].nst);
                    } else {
                        H.send.type = 3;
	                    H.send.end();
                    }
                    return; 
                }
                //config微信jssdk
                
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        H.send.index = i;
                        toUrl("yao.html");
                        //H.send.nowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                    // 据下次摇奖开始
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        H.send.index = i;
                        H.send.beforeShowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                }
            }else{
                H.send.change();
            }
        },
		beforeShowCountdown: function(pra) {
        	var me = this;
            me.type = 1;
            me.isCanShake = false;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $(".countdown-tip").html('距摇奖开启还有 ');
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
            me.count_down();
            $('.countdown').removeClass('hidden');
            me.repeatCheck = true;
            hidenewLoading();
        },
        // 距本轮摇奖结束倒计时
        nowCountdown: function(pra){
        	var me = this;
            me.type = 2;
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
            $(".countdown-tip").html("距摇奖结束还有");
            me.count_down();
            $(".countdown").removeClass("hidden");
            me.index ++;
            me.repeatCheck = true;
            hidenewLoading();
        },
        // 跨天摇奖开启倒计时
        crossCountdown: function(nextTime) {
            var me = this;
            me.crossLotteryFlag = false;
            me.crossLotteryCanCallback = true;
            me.type = 1;
            var beginTimeLong = timestamp(nextTime);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
            $(".countdown-tip").html('距本轮摇奖开始还有');
            me.count_down();
            $('.countdown').removeClass('hidden');
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
                    	if(H.send.repeatCheck){
	                        H.send.repeatCheck = false;
	                        $(".countdown-tip").html("请稍后");
	                        $('.detail-countdown').addClass("hidden");
	                        if(H.send.type == 1){
	                        	if(H.send.crossLotteryCanCallback){
	                        		var delay = Math.ceil(1000*Math.random() + 500);
                                    H.send.crossLotteryCanCallback = false;                                 
                                    shownewLoading(null, '请稍后...');
                                    setTimeout(function(){
                                        H.send.current_time();
                                    }, delay);
                                    return;
	                        	}
	                        	toUrl("yao.html");
	                            //距下次摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
	                           // H.send.nowCountdown(H.send.pal[H.send.index]);
	                        }else if(H.send.type == 2){
	                        	
	                            //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
	                            if(H.send.index >= H.send.pal.length){
	                            	//跨天倒计时
	                            	if(H.send.crossLotteryFlag){
	                            		 H.send.crossCountdown(H.send.pal[H.send.pal.length - 1].nst);
	                            	}else{
	                            		// 如果已经是最后一轮摇奖倒计时结束 
		                                H.send.type = 3;
		      							H.send.end();
	                            	}
	                            	return;
	                             }
	                             H.send.beforeShowCountdown(H.send.pal[H.send.index]);
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
			$("#btn-jump").click(function(e){
				e.preventDefault();
				toUrl("http://ike365.com/app/index.php?i=42&c=entry&id=409&do=index&m=joza_cjcj");
			})
			$("#btn-turn").click(function(e){
				e.preventDefault();
				if(parseInt($(".jfNum").html())<= 0){
					if($(this).hasClass("tiping")){
						return;
					}
					$(this).addClass("tiping");
					H.send.showdiatips("积分不够哦",3000);
					return;
				}
				if($(this).hasClass("waiting")){
					H.send.showdiatips("霸屏不能太频繁哦",3000);
					return;
				}
				$(this).toggleClass("on");
				if($(this).hasClass("on")){
					$("#input-comment").attr("placeholder","开启霸屏模式，5积分/条");
					H.send.on = true;
				}else{
					$("#input-comment").attr("placeholder","说说你的看法吧~~");
					H.send.on = false;
				}
			})
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
				if(H.send.on&&$("#btn-turn").hasClass("on")){
					$.ajax({
	                    type : 'GET',
	                    async : false,
	                    url : domain_url + 'api/screen/save'+dev,
	                    data: {
	                        co: encodeURIComponent(comment),
	                        oi: openid,
	                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
	                        headimgurl: headimgurl ? headimgurl : ""
	                    },
	                    dataType : "jsonp",
	                    jsonpCallback : 'callbackCommentsScreenSave',
	                    complete: function() {
	                        hidenewLoading();
	                    },
	                    success : function(data) {
	                        me.$btnCmt.removeClass(me.REQUEST_CLS);
	                        if (data.code == 0) {
	                        	var t = simpleTpl();
	                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/danmu-head.jpg';
	                            for(var i = 0;i< H.send.baNum;i++){
	                            	t._('<div class="bacor"><div class="cor"><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-cor">'+comment+'</div></div></div>');
	                            }
	                             $("#baping").append("<div class='ba meBa shake'>"+t.toString()+"</div>");
	                            me.$inputCmt.removeClass('error').val('');
	                            H.sign.query_jf();
	                            $("#btn-turn").removeClass("on").addClass("waiting")
	                            $("#input-comment").attr("placeholder","说说你的看法吧~~");
	                            H.send.on = false;
	                            setTimeout(function(){
	                            	 $("#btn-turn").removeClass("waiting");
	                            },30000)
	                            setTimeout(function(){
	                            	$("#baping").find(".meBa").remove();
	                            },2000)
	                            return;
	                        }
	                        showTips("霸屏失败");
	                    }
	                });
				}else{
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
	                        if (data.code == 0) {
	                        	showTips('发送成功');
	                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/danmu-head.jpg';
	                            barrage.appendMsg('<div class="cor"><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-cor">'+comment+'</div></div>');
	                            $('.isme').parent('div').addClass('me');
	                            me.$inputCmt.removeClass('error').val('');
	                            H.sign.query_jf();
	                            return;
	                        }
	                        showTips("发送失败");
	                    }
	                });
				}
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
			me.baping();
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
        },
        baping: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + "api/screen/barrage"+dev,
                data: {
                    ps: me.pageSize,
                    maxid: me.baMaxid 
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsScreenBarrage',
                complete : function(){
                	
                },
                success : function(data) {
	                if (data.code == 0) {
	                    var h = "images/danmu-head.jpg";
	                    me.baMaxid = data.maxid;
	                    localStorage.baMaxid = data.maxid;
	                    var items = data.items || [];
	                    for (var i = 0, len = items.length; i < len; i++) {
	                        if(items[i].op!= hex_md5(openid)){
	                        	H.send.baItems.push(items[i]);
	                        }
	                    }
	                    H.comment.bapingFlash(H.send.baItems)
	                }else{
	                	setTimeout(function(){
		                	H.comment.baping();
		                },5000);
	                }
                },
                error:function(){
                	setTimeout(function(){
		                H.comment.baping();
		            },5000);
                }
            });
        },
        bapingFlash :function(baItems){
        	if(baItems&&baItems.length > 0){
        		var id = baItems.length-1,current = baItems[id],t = simpleTpl();
	            var h= current.hu ? current.hu + '/' + yao_avatar_size : 'images/danmu-head.jpg';
	            for(var i = 0;i< H.send.baNum;i++){
	                t._('<div class="bacor"><div class="cor"><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-cor">'+current.co+'</div></div></div>');
	            }
	            $("#baping").append("<div class='ba otherBa shake' id='otherBa"+id+"'>"+t.toString()+"</div>").removeClass("hidden");
	            var timmer = setTimeout(function(){
	               baItems.pop();
	               H.comment.bapingFlash(baItems)
	               setTimeout(function(){
		               $("#otherBa"+id).before().remove();
		           },500)
	            },1500)
        	}else{
        		 H.comment.baping();
        	}
        }
	};
	W.commonApiSPVHander = function(data){
		if(data.code == 0){
			var num = String(data.c);
			var t = "";
			for(var i = 0;i< num.length;i++){
			   t = t + "<label>"+num[i]+"</label>";
			}
			$(".count span").html(t);
			$(".count").removeClass("hidden");
		}
	};
	window.callbackLinesDiyInfoHandler = function(data){
		if(data&&data.code == 0&&data.gitems){
			$(".cor-assist").css({
				"background": "url("+data.gitems[0].is+") no-repeat center", 
		   		"background-size": "cover"
			})
		}
	}
	window.callbackCommentsCount = function(data){
		if(data&&data.code == 0){
			$(".cor-count").html("参与人数："+data.tc+"人");
		}
	}
})(Zepto);

$(function(){
	H.send.init();
});