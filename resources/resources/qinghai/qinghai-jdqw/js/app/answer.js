(function($) {
	H.answer = {
		tid: '',
		$article: $('#article'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		$total: $('#count'),
		STARTING_CLS: 'starting',
		QUEdata:"",
		isCanShake: false,
		times: 0,
		delyask:5000,
		isToLottey:true,
		haslink:false,
		lotteryTime:getRandomArbitrary(1,5),
		yaoBg: [],
		repeat_load:true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
		index:0, // 当前抽奖活动在 list 中的下标
		pal:[],// 抽奖活动list
		dec:0,//服务器时间与本地时间的差值
		type:2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
		wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
		isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
		TIMETRUE_CLS: true,
		LIMITTIMEFALSE_CLS: false,
		currTime: new Date().getTime(),
		headMix: Math.ceil(8*Math.random()),
		
		init: function() {
			if (!openid) {
				return false;
			};
			getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
			H.utils.resize();
			this.event();
			H.comment.init();
			//H.answer.updatepv();
			this.current_time();
		},
		updatepv: function() {
			getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
			setInterval(function() {
				getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
			}, 5000);
		},
		account_num: function(){
		       getResult('log/serpv ', {}, 'callbackCountServicePvHander');
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
							//var nowTime = Date.parse(new Date());
							//H.answer.dec = data.t - nowTime;
							var nowTime = new Date().getTime();
							H.answer.dec = nowTime - data.t;
						}
					},
					error : function(xmlHttpRequest, error) {
					}
				});
			},dely);
			$('body').css({
				'width': $(window).width(),
				'height': $(window).height()
			})
		},
		current_time: function(){
			var me = H.answer;
			me.delyask += 10000;
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
						/*me.nowTime = timeTransform(data.sctm);
						 var nowTime = Date.parse(new Date())/1000;
						 var serverTime = timestamp(me.nowTime);
						 me.dec = (serverTime - nowTime);*/

						me.nowTime = timeTransform(data.sctm);
						var nowTime = new Date().getTime();
						var serverTime = data.sctm;
						//console.log('s='+me.nowTime);
						//console.log('n='+timeTransform(nowTime));
						me.dec = nowTime - serverTime;
						me.currentPrizeAct(data);
					}else{
						if(me.repeat_load){
							me.repeat_load = false;
							setTimeout(function(){
								me.current_time();
							},500);
						}else{
							me.change();
							//me.wxCheck = false;
							//me.isToLottey = false;
							//me.isCanShake = true;
						}
					}
				},
				error : function(xmlHttpRequest, error) {
					setTimeout(function () {
						me.current_time();
					}, me.delyask);
					//me.wxCheck = false;
					//me.isToLottey = false;
					//me.isCanShake = true;
				}
			});
		},
		currentPrizeAct:function(data){
			//获取抽奖活动
			var prizeActListAll = data.la,
				prizeLength = 0,
				nowTimeStr = H.answer.nowTime,
				$tips = $(".time-tips"),
				prizeActList = [],
				me = H.answer;
			var day = nowTimeStr.split(" ")[0];
			if(prizeActListAll&&prizeActListAll.length>0){
				for ( var i = 0; i < prizeActListAll.length; i++) {
					if(prizeActListAll[i].pd == day){
						prizeActList.push(prizeActListAll[i]);
					}
				}
			}
			me.pal = prizeActList;
			prizeLength = prizeActList.length;
			if(prizeActList.length >0){
				//如果最后一轮结束
				if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
					me.type = 3;
					me.change();
					return;
				}
				//config微信jssdk
				//me.wxConfig();
				for ( var i = 0; i < prizeActList.length; i++) {
					var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
					var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
					me.index = i;
					hidenewLoading();
					//在活动时间段内且可以抽奖
					if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
						if(prizeActList[i].bi.length>0){
							me.yaoBg = prizeActList[i].bi.split(",");
						}
						//me.initCount();
						me.nowCountdown(prizeActList[i]);
						return;
					}
					if(comptime(nowTimeStr,beginTimeStr) > 0){
						me.beforeShowCountdown(prizeActList[i]);
						return;
					}
				}
			}else{
				me.change();
				return;
			}
		},
		// 摇奖开启倒计时
		beforeShowCountdown: function(pra) {
			var me = H.answer,
				beginTimeStr = pra.pd+" "+pra.st,
				beginTimeLong = timestamp(beginTimeStr);

			me.type = 1;
			beginTimeLong += me.dec;
			$(".countdown-tip").html('距摇奖开启还有 ');
			$('.detail-countdown').attr('etime',beginTimeLong);
			$(".gotoluck").addClass("none");
			me.count_down();
			$('.countdown').removeClass('none');
			me.isCanShake = false;
		},
		// 摇奖结束倒计时
		nowCountdown: function(pra){
			var me = H.answer,
				endTimeStr = pra.pd+" "+pra.et,
				beginTimeLong = timestamp(endTimeStr);
			me.type = 2;
			beginTimeLong += me.dec;
			$('.detail-countdown').attr('etime',beginTimeLong);
			$(".countdown-tip").html("距摇奖结束还有");
			me.count_down();
			$('.countdown').addClass('none');
			$(".gotoluck").removeClass("none");
			if(me.haslink == false){
				$(".gotoluck").one("click", function () {
					toUrl("yao.html");
				});
				me.haslink = true;
			}
			me.index ++;
			me.isCanShake = true;
		},
		// 倒计时
		count_down : function() {
			$('.detail-countdown').each(function() {
				var me = H.answer;
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(me.type == 1){
							//距摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
							me.nowCountdown(me.pal[me.index]);
						}else if(me.type == 2){
							//距摇奖结束倒计时结束后显示距离下轮摇奖开始倒计时
							if(me.index >= me.pal.length){
								me.change();
								me.type = 3;
								return;
							}
							me.beforeShowCountdown(me.pal[me.index]);
						}
					},
					sdCallback :function(){
					}
				});
			});
		},
		change: function(){
			H.answer.isCanShake = false;
			$(".countdown").removeClass("none").html('摇奖结束');
			$(".countdown").removeClass("none").css("right","-70px");
			$(".gotoluck").addClass("none");
			//H.answer.$textb.addClass("none");
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
				} else if (len > 20) {
					showTips('观点字数超出了20字');
					me.$inputCmt.removeClass('error').addClass('error');
					return;
				}
				
				$(this).addClass(me.REQUEST_CLS);

				shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save'+dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: me.tid,
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
                        	showTips('发射成功', null, 800);
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
                            barrage.appendMsg('<div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div>'+comment);
                            $('.isme').parent('div').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                    }
                });
				
			});


		}
	};
	
	// 弹幕_S
	H.comment = {
		timer: 5000,
		maxid: 0,
		pageSize: 50,
		$comments: $('#comments'),	
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
                url : domain_url + "api/comments/room?temp=" + new Date().getTime()+$dev,
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
	                if (data.code == 0) {
	                    me.maxid = data.maxid;
	                     var items = data.items || [], umoReg = '/:';
	                    for (var i = 0, len = items.length; i < len; i++) {
	                    	if ((items[i].co).indexOf(umoReg) >= 0) {
	                    		var funny = items[i].co;
	                    		var nfunny = funny.replace('/:','');
				                barrage.appendMsg('<div class="c_head_img"><img src="' + (items[i].hu ? (items[i].hu + "/" + yao_avatar_size) : "./images/danmu-head.jpg") + '" /></div>'+'<img class="funnyimg" src="./images/funny/' + nfunny + '.png" border="0" />');
	                    	}else{
	                    		var hmode = "<div class='c_head_img'><img src='./images/danmu-head.jpg' class='c_head_img_img' /></div>";
		                        if (items[i].hu) {
		                            hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img' /></div>";
		                        }
		                        if (i < 5) {
		                            $.fn.cookie('default_comment' + i, hmode + items[i].co, expires_in);
		                        }
		                        barrage.pushMsg(hmode + items[i].co);
	                    	}
	                    }
	                } else {
	                	return;
	                }
                }
            });
        }
	};
	// 弹幕_E
	
	H.utils = {
		$header: $('header'),
		$wrapper: $('article'),
		$comments: $('#comments'),
		resize: function() {
			var height = $(window).height();
			var winW = $(window).width();
			this.$header.css('height', Math.round(winW * 0.3));
			this.$wrapper.css('height', Math.round(height - (winW * 0.3)));
			this.$comments.css('height', Math.round(height - (winW * 0.3)- 50));
			$('body').css('height', height);
		}	
	};
	
	W.callbackQuestionAnswerHandler = function(data) {
		if (data.code == 0) {
			H.answer.answered(data);
			return;
		}
		showTips(data.message);
	};
	W.callbackCountServicePvHander = function(data) {
		if (data.code == 0) {
			H.answer.$total.html("目前人数：  "+data.c);
		}
	};
	W.commonApiPromotionHandler = function(data){
		var me = H.answer;
		if(data.code == 0){
			if(data.url && data.desc){
				$(".outer").text(data.desc).attr('href', data.url).removeClass('none');
			}
		}
	};

})(Zepto);

$(function() {
	H.answer.init();
});