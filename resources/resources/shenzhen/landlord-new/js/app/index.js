(function($) {
	
	H.index = {
		activity_uuid:null,
		result : "",
		rtuid : "",
		ontv : null,
		isreload : getQueryString("isreload"),
		init: function() {
			if(this.isreload == "true"){
				$(".wrapper").addClass("none");
			}else{
				setTimeout(function(){
					$(".wrapper").addClass("none");
				}, 3000)
			}
			this.event_handler();
			this.integral();
			this.info();
		},
		event_handler: function(){
			$("#reward").click(function(e){
				e.preventDefault();
				if($(this).attr("disabled") == "disabled"){
					return;
				}
				getResult('landnew/lottery', {openid:openid,qiu:H.index.rtuid,actu:H.index.activity_uuid}, 'landNewLotteryHandler', true);
				
			});
			$(".btn-rule").click(function(e){
				e.preventDefault();
				H.dialog.rule.open();
			});
			$("#btn-ontv").click(function(e){
				e.preventDefault();
				H.dialog.ontv.open();
			});
			$("#pages").click(function(e){
				e.preventDefault();
				setTimeout(function(){
					$(".wrapper").addClass("none");
					$(".cwr-ctrl").removeClass("none");
				},300);
				
			});
			
			$("#submit-answer").click(function(e){
				var flag = true ;
				e.preventDefault();
				if(!openid){
					return;
				}
				$(".test-item").each(function(){
					var me = $(this);
					if(!me.find("span").hasClass("select")){
					    flag = false;
						return;
					}else{
						flag = true;
					}
					
				});
				if(flag){
					$(".test-item").each(function(){
						var res = 0;
						var me = $(this);
						if(me.attr("data-rt").indexOf(me.find(".select").attr("data-uuid")) != -1 ){
							res = 1;
						}else{
							res = 2;
						}
						H.index.result += me.attr("data-uuid")+","+me.find(".select").attr("data-uuid")+","+res+";";
					});
					getResult('landnew/answer', {openid:openid, result:H.index.result, actu:H.index.activity_uuid}, 'landNewAnswerHandler', true);		
				}else{
					alert("请选择你认为正确的答案");
				}
			});
		},
		
		// 倒计时
        count_down: function () {
        	$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function(state) {
						if(state === 3){
							showLoading();
							setTimeout(function(){
								hideLoading();
								location.reload(true);
							},1000);
						}
					}
				});
			});
        },
		integral: function(){
			getResult('user/'+openid+'/integral', {}, 'callbackUserIntegralHandler', true);
		},
		info: function(){
			getResult('landnew/index/'+openid, {}, 'landNewIndexHandler', true);
		},
		answer_tpl: function(data){
			var t = simpleTpl();
			for(var i = 0;i < data.quizinfo.length; i++){
				var quiz = data.quizinfo[i];
				t._('<div class="test-item" data-uuid="'+quiz.qu+'" data-rt="'+quiz.qr+'">')
					._('<p class="test-title">'+quiz.qt+' </p>');
					for(var j = 0; j < quiz.qa.length; j++){
						var attr = quiz.qa[j];
						t._('<span class="attr" data-uuid="'+attr.au+'">'+attr.av+'</span>')
					}
				t._('</div>');
			}
			return t.toString();
		},
		percent_tpl: function(data){
			var t = simpleTpl();
			for(var i = 0;i < data.quizinfo.length; i++){
				var quiz = data.quizinfo[i];
				var right_quiz = "";
				var sumCount = quiz.jc == 0?1:quiz.jc;
				var sumPercent = 0;
				for(var j = 0; j < quiz.qa.length; j++){
					var attr = quiz.qa[j];
					if(quiz.qr.indexOf(quiz.qa[j].au) != -1){
						right_quiz += quiz.qa[j].av+" ";
					}
				}
				t._('<p class="test-title">'+quiz.qt+' <span class="right-answer">'+right_quiz+'</span></p>')
				._('<ul class="resultli">')
				for(var j = 0; j < quiz.qa.length; j++){
					var attr = quiz.qa[j];
					var percent = (attr.ac/sumCount * 100).toFixed(0);
					if(j == quiz.qa.length-1){
						percent = (100.00 - sumPercent).toFixed(0);
					}
					t._("<li>")
						._('<label>'+attr.av+'</label>')
						._('<i class="support-pro"><span style="width:'+percent+'%"></span></i>')
						._('<span class="percent">'+percent+'%</span>')
					._("</li>");
					sumPercent += percent * 1;
				}
				t._("</ul>");
			}
			return t.toString();
		},
		bind_click: function(){
			$(".attr").click(function(){
				$(this).parent().find("span").removeClass("select");
				$(this).addClass("select");
			});
		}
	};
	W.callbackUserIntegralHandler = function(data){
		if(data.code == 0){
			$("#integral").text(data.result);
		}
	}
	
	W.landNewIndexHandler = function(data){
		if(data.code != 1){
			H.index.ontv = data.ad;
			H.index.activity_uuid = data.au;
			if(data.code == 0){
				$("#answer-items").html(H.index.answer_tpl(data));
				H.index.bind_click();
				$("#answer-content").removeClass("none");
			}else if (data.code == 2){
				// 节目结束 可以抽奖
				$("#answer-result").html(H.index.percent_tpl(data));
				$("#prize-num").text((data.pn<0?0:data.pn)+"次");
				if(data.pn <= 0){
					$("#reward").addClass("none");
				}
				if(data.jr){
					if(data.jr.length >= data.pn&&data.pn>0){
						H.index.rtuid =data.jr[data.jr.length-data.pn].qu;
					}	
				}
				$("#percent-content").removeClass("none");
			}else if (data.code == 4){
				// 答过题，抽奖时间未到
				$("#answer-result").html(H.index.percent_tpl(data));
				$("#reward").text("等待开奖");
				$("#reward").attr("disabled","disabled");
				$("#num-tip").addClass("none");
				$("#percent-content").removeClass("none");
				var beginTimeStr = data.ab;
                var beginTimeLong = timestamp(beginTimeStr);
    			var nowTime = Date.parse(new Date())/1000;
            	var serverTime = timestamp(data.tm);
    			if(nowTime > serverTime){
    				beginTimeLong += (nowTime - serverTime);
    			}else if(nowTime < serverTime){
    				beginTimeLong -= (serverTime - nowTime);
    			}
				$('.detail-countdown').attr('etime',beginTimeLong);
				H.index.count_down();
			}else if (data.code == 3){
				// 今天活动未开始 显示上一期结果题目 可以抽奖
				$("#answer-result").html(H.index.percent_tpl(data));
				$("#prize-num").text(data.pn+"次");
				if(data.pn <= 0){
					$("#reward").addClass("none");
				}
				$("#percent-content").removeClass("none");
			}
		}
	}
	W.landNewAnswerHandler = function(data){
		if(data.code == 0){
			toUrl("index.html?isreload=true");
		}
	};
	W.landNewLotteryHandler = function(data){
		H.dialog.lottery.open();
		H.dialog.lottery.update(data);
	};
	
})(Zepto);

$(function() {
	H.index.init();
});
