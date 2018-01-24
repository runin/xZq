/**
 * 江苏新闻眼日常版-话题投票页
 */
(function($) {
	H.comments = {
		$main : $('#main'),
		quizInfoUuid :null,
		attrUuid :null,
		shopAddress :null,
		shopImg :null,
		isTrue :true,
		isquiz :true,
		isend:true,
		init : function(){
			var me = this;
			me.quizInfo();	
			me.lotteryInfo();
		},
		//查询答题接口
		quizInfo : function() {
			getResult('tour/quiz/index/'+openid, {}, 'tourIndexHandler',true);
		},
		lotteryInfo :function(){
			getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler',true);
		},
		bindClick :function(){
			$(".select").find("span").each(function(){
				$(this).click(function(){
					if($(this).hasClass("requesting")){
						return;
					}
					$(".btn").addClass("requesting");
					H.comments.attrUuid = $(this).attr("select-uuid")
					H.comments.fill_masking();
				});
			});
		},
		fill_masking : function(){
			getResult('tour/quiz/answer', {openid:openid,quizInfoUuid :H.comments.quizInfoUuid,attrUuid:H.comments.attrUuid}, 'tourAnswerHandler',true);
		},
		tongji_canvas: function(target) {
			var canvas = document.getElementById(target);
			var ctx = canvas.getContext("2d");
			var fixRatio = window.devicePixelRatio || 1;
			var W = canvas.width;// fixRatio
			var H = canvas.height; //fixRatio
			var me = '#' + target;
			var percent = $(me).attr('data-percent') || 0;
			var incolor = $(me).attr('data-incolor') || '#d4c59c';
			var outcolor = $(me).attr('data-outcolor') || '#ebdebb';
			var percentcolor = $(me).attr('data-percentcolor') || 'rgba(255,0,0,.45)';
			var bgcolor = $(me).attr('data-bgcolor') || '#FFF';
			var fontcolor = $(me).attr('data-fontcolor') || '#000';
			var deg=0,new_deg=0,dif=0
			var loop,re_loop,text,text_w;
		   function init(){
				var r = deg*Math.PI/180;
					ctx.clearRect(0,0,W,H);
					ctx.beginPath();
					ctx.arc(W/2,H/2,W/2,0,Math.PI*2,false);
					ctx.fillStyle = '#2cbb21';//填充颜色,默认是黑色
					ctx.fill();
					ctx.beginPath();
					ctx.strokeStyle = '#ff5c95';
					ctx.lineWidth=W/2;
					ctx.arc(W/2,H/2,W/4,0-90*Math.PI/180,r-90*Math.PI/180,false);
					ctx.stroke();
					ctx.closePath();
			}
			function draw(){
				new_deg = Math.round((percent/100) * 360);
				dif = new_deg-deg;
				loop = setInterval(circle,800/dif);
			}
			function circle(){
				if(deg == new_deg){
					clearInterval(loop);
				}
				if(deg < new_deg){
					deg++;
				} else {
					clearInterval(loop);
				}
				init();
			}
			draw();
		},
		//抽奖倒计时
		currentPrizeAct:function(data){
			//获取抽奖活动
			var prizeActList = data.la,
				prizeLength = prizeActList.length,
				nowTimeStr =data.sctm/1000,
				me = this,
				$tips = $(".time-tips");
				//如果最后一轮结束
	        if(timestamp(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et)<= nowTimeStr){	
	        	$(".tips").removeClass("none");
	        	$tips.removeClass("none");
	        	$tips.html('今日抽奖已结束');
				$('.detail-countdown').addClass('none');
				return;
	        }
			for ( var i = 0; i < prizeActList.length; i++) {
				var beginTimeStr = timestamp(prizeActList[i].pd+" "+prizeActList[i].st);
				var endTimeStr = timestamp(prizeActList[i].pd+" "+prizeActList[i].et);
				if(beginTimeStr <= nowTimeStr&&endTimeStr > nowTimeStr){
					showLoading();
					toUrl("yaoyiyao.html");	
					return;
				}
				//活动开始前倒计时
				if(beginTimeStr > nowTimeStr){
					
					var beginTimeLong = beginTimeStr;
	    			var nowTime = Date.parse(new Date())/1000;
	            	var serverTime = nowTimeStr;
	    			if(nowTime > serverTime){
	    				beginTimeLong += (nowTime - serverTime);
	    			}else if(nowTime < serverTime){
	    				beginTimeLong -= (serverTime - nowTime);
	    			}
	    		    $(".tips").removeClass("none");
					$tips.removeClass("none");
					$tips.html('距离抽奖开启还有');
					$('.detail-countdown').removeClass("none").attr('etime',beginTimeLong);
					H.comments.count_down_lottery();
					return;
				}
			}
		},
		//答题倒计时
		currentQuizAct:function(data){
			//获取答题活动
			var quiz = data.quizinfo,
				prizeLength = quiz.length,
				nowTimeStr =timestamp(data.tm),
				me = this,
				$tips = $(".time-tips");
				if(quiz != null && quiz.length >0){
					//如果最后一轮结束
			        if(timestamp(quiz[prizeLength-1].qe)<= nowTimeStr){
			        	var me = this, t = simpleTpl();
						var $progress = $('#progress');
						var sumCount = quiz[prizeLength-1].nb +quiz[prizeLength-1].na;
				    	var rightCount = quiz[prizeLength-1].nb +quiz[prizeLength-1].nr;				    
				    	var sumPer = Math.floor((rightCount/sumCount) * 100);
						//参与过
						$(".tips").addClass("none")
						if(!quiz[prizeLength-1].qf){
							//且答对
							if(quiz[prizeLength-1].qff){
								$("#progress").find("h2").html("恭喜您答对了,超过50%网友答对问题，即可为此产品成功砍价，分享给好友一起加油吧！");
							}else{
								$("#progress").find("h2").html("抱歉您答错了,超过50%网友答对问题，即可为此产品成功砍价，分享给好友一起加油吧！");
							}
						}else{
							$("#progress").find("h2").html("本次活动已结束");
						}
							t._('<div class="progress">')
								  ._('<span class="rate">')	
									  ._('<canvas id="tj"  data-percent="'+sumPer+'"></canvas>')
								  ._('</span>')
								  ._('<ul>')
									  ._('<li><i class="dot"></i>参加总人数<label>'+sumCount+'</label>人</li>')
									  ._('<li><i class="dot right"></i>答对人数<label>'+rightCount+'('+sumPer+'%)</label>人</li>')
								  ._('</ul>')
							  ._('</div>')
							  ._('<div class="shop">')
									._('<img src="'+quiz[prizeLength-1].qi+'" />')
									._('<a class="btn shop-btn none" data-collect="true" data-collect-flag="tv-travel-shop-btn" data-collect-desc="旅游囤购节购买返回首页">立即<br/>购买</a>')
						      ._('</div>');
					  
					    $(".progressInfo").html(t.toString());
					    $(".shop").height($(window).width()*575/640);
					    $(".shop-btn").removeClass("none").click(function(e){
					    	e.preventDefault();
					    	showLoading();
					    	window.location.href = quiz[prizeLength-1].ql;
					    });
					    $progress.removeClass("none");
					    $("#sup").addClass("none")
					    var rateWidth = $(".rate").width();
					    $(".rate").height(rateWidth);
					    $("#tj").attr("width",rateWidth);
					    $("#tj").attr("height",rateWidth);
					    H.comments.tongji_canvas('tj');
					    return;
			       }
					
					for ( var i = 0; i < quiz.length; i++) {
						var beginTimeStr = timestamp(quiz[i].qb);
						var endTimeStr = timestamp(quiz[i].qe);
						//在答题时间段内
						if(beginTimeStr <= nowTimeStr&&endTimeStr > nowTimeStr){
							var me = this, t = simpleTpl(), $currentQuiz = $('#sup');
							var isCan = quiz[i].qf;
							var selectArr =quiz[i].qa;
							var rightUid = quiz[i].qr;
					 	    var endTimeLong = endTimeStr;
			    			var nowTime = Date.parse(new Date())/1000;
			            	var serverTime = nowTimeStr;
			            	H.comments.shopAddress = quiz[i].ql;
					 	    H.comments.shopImg = quiz[i].qi;
			    			if(nowTime > serverTime){
			    				endTimeLong += (nowTime - serverTime);
			    			}else if(nowTime < serverTime){
			    				endTimeLong -= (serverTime - nowTime);
			    			}
					 	    $('.ecountdown').attr('etime',endTimeLong);
							H.comments.count_down_quize();
							//在答题时间段且已经参与过
							if(!isCan){
								var $progress = $('#progress');
								var sumCount = quiz[i].nb +quiz[i].na;
						    	var rightCount = quiz[i].nb +quiz[i].nr;
						    	var sumPer = Math.floor((rightCount/sumCount) * 100);
								if(quiz[i].qff){
									$("#progress").find("h2").html("恭喜您答对了,超过50%网友答对问题，即可为此产品成功砍价，分享给好友一起加油吧！");
								}else{
									$("#progress").find("h2").html("抱歉您答错了,超过50%网友答对问题，即可为此产品成功砍价，分享给好友一起加油吧！");
								}
								t._('<div class="progressInfo">')
								    ._('<h2></h2>')
									._('<div class="progress">')
										  ._('<span class="rate">')	
											  ._('<canvas id="tj" data-percent="'+sumPer+'"></canvas>')
										  ._('</span>')
										  ._('<ul>')
											  ._('<li><i class="dot"></i>参加总人数<label>'+sumCount+'</label>人</li>')
											  ._('<li><i class="dot right"></i>答对人数<label>'+rightCount+'('+sumPer+'%)</label>人</li>')
										  ._('</ul>')
									  ._('</div>')
									  ._('<div class="shop">')
											._('<img src="'+H.comments.shopImg+'" />')
											._('<a class="btn shop-btn none"  data-collect="true" data-collect-flag="tv-travel-shop-btn" data-collect-desc="旅游囤购节返回首页">支付<br/>定金</a>')
								      ._('</div>')
							     ._('</div>');
							     $(".progressInfo").html(t.toString());
							     $(".shop").height($(window).width()*575/640);
							     $(".shop-btn").removeClass("none").click(function(e){
							    	e.preventDefault();
							    	showLoading();
							    	window.location.href = H.comments.shopAddress;
							    });
							    $progress.removeClass("none");
							    $("#sup").addClass("none")
							    var rateWidth = $(".rate").width();
							    $(".rate").height(rateWidth);
							    $("#tj").attr("width",rateWidth);
							    $("#tj").attr("height",rateWidth);
							    H.comments.tongji_canvas('tj');
							    return;
							}else{
								//在答题时间段内还没有参与
								H.comments.quizInfoUuid = quiz[i].qu;
								t._('<div class="sup" quiz-uuid ='+quiz[i].qu+'>')
									._('<p>'+quiz[i].qt+'</p>')
							       	._('<div class="select">')
									._('</div>')
								._('</div>');
								$currentQuiz.html(t.toString());
								t = simpleTpl();
								for(var i = 0, len = selectArr.length; i<len; i++){
							       	t._('<span class="btn" select-uuid='+selectArr[i].au +' data-collect="true" data-collect-flag="tv-travel-daily-answer-select'+i+'-btn data-collect-desc="旅游囤购节返回首页">'+selectArr[i].ai+'</span>')
							     }
								$currentQuiz.find($(".select")).html(t.toString());
								$(".result").addClass("none");
								$(".answer").removeClass("none");
								$(".answer").height($(".answer").width()*0.94*447/603);
								H.comments.bindClick(rightUid);	
								return;
							}
						}
						//答题活动未开始前倒计时
						if(beginTimeStr > nowTimeStr){
							$(".result").addClass("none");
							$(".answer").removeClass("none");
							$(".answer").height($(".answer").width()*0.94*447/603);
							$(".answer").html("<h1>活动尚未开始</h1>");
							var beginTimeLong = beginTimeStr;
			    			var nowTime = Date.parse(new Date())/1000;
			            	var serverTime = nowTimeStr;
			    			if(nowTime > serverTime){
			    				beginTimeLong += (nowTime - serverTime);
			    			}else if(nowTime < serverTime){
			    				beginTimeLong -= (serverTime - nowTime);
			    			}
							$('.bcountdown').attr('etime',beginTimeLong);
							H.comments.count_down_quizb();
							return;
						}
					}			
		 }
      },
		// 倒计时
		count_down_lottery : function() {
			//抽奖倒计时
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.comments.isTrue){
							H.comments.isTrue = false;
							$(".tips").removeClass("none");
							var $tips = $(".time-tips");
							$tips.removeClass("none");
						    $tips.html('抽奖开启');
						    $('.detail-countdown').addClass("none");
						    setTimeout(function(){
						    	showLoading();
						    	toUrl("yaoyiyao.html");
						    }, 2000);
						}
					},
					sdCallback :function(){
					}
				});
			});
		},
		count_down_quizb : function() {
			//答题倒计时
			$('.bcountdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.comments.isquiz){
							H.comments.isquiz = false;
						    setTimeout(function(){
						    	H.comments.quizInfo();
						    }, 2000);
						}
					},
					sdCallback :function(){
					}
				});
			});
		},
		count_down_quize : function() {
			//答题倒计时
			$('.ecountdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.comments.isend){
							H.comments.isend = false;
						    setTimeout(function(){
						    	H.comments.quizInfo();
						    }, 2000);
						}
					},
					sdCallback :function(){
					}
				});
			});
		},
		
	};
    W.callbackLotteryRoundHandler = function(data){
    	if(data.result){
    		H.comments.currentPrizeAct(data);
    	}else{
    		$(".tips").removeClass("none");
    		$(".time-tips").removeClass("none").html("抽奖未开启");
    	}
    }
	W.tourIndexHandler = function(data){
		if(data.code == 0){
			H.comments.currentQuizAct(data)	
		}else{
			$(".result").addClass("none");
			$(".answer").removeClass("none");
			$(".answer").height($(".answer").width()*0.94*447/603);
		    $(".answer").html("<h1>活动尚未开始</h1>")
		}
	};
	W.tourAnswerHandler = function(data){
		if(data.code == 0){
			var sumCount = data.nb +data.na,
				rightCount = data.nb +data.nr,
				sumPercent = 0,
			    t = simpleTpl(), 
			    $progress = $('#progress');
			    sumPer = Math.floor((rightCount/sumCount) * 100);
			if(data.ar){
				$progress.find("h2").html("恭喜您答对了,超过50%网友答对问题，即可为此产品成功砍价，分享给好友一起加油吧！");
			}else{
				$progress.find("h2").html("抱歉您答错了,超过50%网友答对问题，即可为此产品成功砍价，分享给好友一起加油吧！");
			}
		
			t._('<div class="progressInfo">')
					._('<h2></h2>')
					._('<div class="progress">')
						._('<span class="rate">')	
							._('<canvas id="tj" data-percent="'+sumPer+'"></canvas>')
						._('</span>')
					._('<ul>')
						 ._('<li><i class="dot"></i>参加总人数<label>'+sumCount+'</label>人</li>')
						 ._('<li><i class="dot right"></i>答对人数<label>'+rightCount+'('+sumPer+'%)</label>人</li>')
						._('</ul>')
					._('</div>')
					._('<div class="shop">')
						._('<img src="'+H.comments.shopImg+'" />')
						._('<a class="btn shop-btn none"  data-collect="true" data-collect-flag="tv-travel-shop-btn" data-collect-desc="旅游囤购节购买按钮">立即<br/>购买</a>')
					._('</div>')
				._('</div>');
			$(".progressInfo").html(t.toString());
			$(".shop").height($(window).width()*575/640);
			$(".shop-btn").removeClass("none").click(function(e){
				e.preventDefault();
				showLoading();
				window.location.href = H.comments.shopAddress;
			});
			$("#sup").addClass("none")
			$progress.removeClass("none");
			var rateWidth = $(".rate").width();
			$(".rate").height(rateWidth);
			$("#tj").attr("width",rateWidth);
			$("#tj").attr("height",rateWidth);
			H.comments.tongji_canvas('tj');
			$(".btn").removeClass("requesting");
		}
	}
})(Zepto);
$(function(){
	H.comments.init();
});