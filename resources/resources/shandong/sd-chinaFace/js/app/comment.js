(function(){
	// 弹幕_S
	H.send = 
	{   
		$comments: $('#comments'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		REQUEST_CLS: 'requesting',
		init: function() {
			var me = this;
			me.resize();
			H.comment.init();
			me.event();
		},
		resize: function(){
			var me = this;
			var width = $(window).width();
			var height = $(window).height();

			$("header").height(height*0.45);
			$(".answer").height(height*0.45 - 120);
			$('#article').css('height', height*0.10);
			me.$comments.css({
				'width': width,
				'height': height*0.45
			});

			$(".container").css({
				'width': width,
				'height': height
			});
			var h= headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/avatar.png';
			$("#head_img").attr("src", h);
		},
		btn_animate: function(str,calback){
			str.addClass('flipInY');
			setTimeout(function(){
				str.removeClass('flipInY');
			},150);
		},
		event: function() {
			var me = this;
			$("#zhi").tap(function(e){
				e.preventDefault();
				me.btn_animate($(this));
				H.dialog.knowledge.open("zhi");
			});
			$("#shi").tap(function(e){
				e.preventDefault();
				me.btn_animate($(this));
				H.dialog.knowledge.open("shi");
			});
			$("#ku").tap(function(e){
				e.preventDefault();
				me.btn_animate($(this));
				H.dialog.knowledge.open("ku");
			});
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
                        tid:null,
                        ty: 2,
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
                        	showTips('发射成功');
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/avatar.png';
                            barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-cor">'+filterXSS(comment)+'</div></div>');
                            $('.isme').parent('div.comment_item').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                        showTips("评论失败");
                    }
                });
				
			});
	     }
	};
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
                url : domain_url + "api/comments/room"+dev,
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
	                    	var hmode = "<div class='c_head_img'><img src='./images/avatar.png' class='c_head_img_img' /></div>";
		                    if (items[i].hu) {
		                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img' /></div>";
		                    }
		                    barrage.pushMsg(hmode + filterXSS(items[i].co));
	                    }
	                } else {
	                	return;
	                }
                }
            });
        }
	};
})(Zepto);

(function($){
	H.answer = {
		$answerCountdown: $("#answer-countdown"),
		$answer: $(".answer"),
		nowTime: null,
		dec: 0,//服务器时间与本地时间的差值
		repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
		index: 0, // 当前答题活动在 list 中的下标
		type: 2,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
		pal: [],// 抽奖活动list
		repeatCheck: true,
		quid: '',//当前题目uuid
		init: function(){
			this.event();
			this.current_time();
			var height = $(window).height(), width = $(window).width();
			$('body').css({
				'width': width,
				'height': height
			});
		},
		btn_animate: function(str,calback){
			str.addClass('flipInY');
			setTimeout(function(){
				str.removeClass('flipInY');
			},200);
		},
		event: function(){
			var me = H.answer;
			$("#go-lottery").click(function(e){
				e.preventDefault();
				me.btn_animate($(this));
				toUrl('lottery.html');
			});
			$("dl").delegate('dd', 'click', function(e) {
				e.preventDefault();
				me.checkedParams = $(this).attr('data-auid');
				getResult("api/question/answer",{
					yoi: openid,
					suid: me.quid,
					auid: me.checkedParams
				},'callbackQuestionAnswerHandler',true);
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
					//test
					//data = callbackQuestionRoundHandlerData;
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
						}else{
							me.change();
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
					me.change(prizeActList[prizeLength-1], prizeLength-1);
					return;
				}
				//如果第一轮未开始
				if(comptime(prizeActList[0].qst,nowTimeStr) < 0){
					me.index = 0;
					me.beforeShowCountdown(prizeActList[0], 0);
					me.$answerCountdown.find('.items-count').addClass('none');
					me.$answerCountdown.find('.loading').removeClass('none').html('答题未开始！');
					me.$answerCountdown.removeClass("none");
					return;
				}
				for ( var i = 0; i < prizeActList.length; i++) {
					var beginTimeStr = prizeActList[i].qst;
					var endTimeStr = prizeActList[i].qet;
					me.index = i;
					hidenewLoading();
					//在活动时间段内且可以抽奖
					if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
						me.nowCountdown(prizeActList[i], i);
						return;
					}
					if(comptime(nowTimeStr,beginTimeStr) > 0){
						me.beforeShowCountdown(prizeActList[i], i);
						return;
					}
				}
			}else{
				me.change();
				return;
			}
		},
		// 摇奖开启倒计时
		beforeShowCountdown: function(pra, index) {
			var me = H.answer,
				beginTimeStr = pra.qst;
			me.type = 1;
			me.repeatCheck = true;
			me.$answerCountdown.find('.items-count').addClass('none');
			me.$answerCountdown.find('.loading').removeClass('none');
			me.countdown_domShow(beginTimeStr,"距离下次答题还有", pra, index);
			me.$answer.addClass("vertical-align-center");
		},
		// 摇奖结束倒计时
		nowCountdown: function(pra, index){
			var me = H.answer,
				endTimeStr = pra.qet;

			me.type = 2;
			me.countdown_domShow(endTimeStr,"距答题结束还有", pra, index);
			me.index ++;
			me.$answer.removeClass("vertical-align-center");
		},
		countdown_domShow: function(time, word, pra, index){
			var me = H.answer,
				timeLong = timestamp(time);
			timeLong += me.dec;
			me.$answerCountdown.find('.detail-countdown').attr('etime',timeLong);
			me.$answerCountdown.find(".countdown-tip").html(word);
			me.count_down();
			me.$answerCountdown.find('.items-count').removeClass('none');
			me.$answerCountdown.find('.loading').addClass('none');

			if(word == "距答题结束还有"){
				me.$answerCountdown.addClass("none");

				shownewLoading();
				$.ajax({
					type : 'GET',
					async : false,
					url : domain_url + 'api/question/record' + dev,
					data: {
						yoi: openid,
						quid: pra.quid
					},
					dataType : "jsonp",
					jsonpCallback : 'callbackQuestionRecordHandler',
					complete: function() {
						hidenewLoading();
					},
					success : function(data) {
						if (data.code == 0) {
							if (data.anws) {
								me.nextQuestion_check();
							} else {
								me.spellQuestion(pra, index);
							}
						}else{
							me.spellQuestion(pra, index);
						}
					}
				});
			}else{
				me.$answerCountdown.removeClass("none");
			}
			me.repeatCheck = true;
		},
		// 倒计时
		count_down : function() {
			var me = H.answer;
			me.$answerCountdown.find('.detail-countdown').each(function() {
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						// canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
						// 当前有中奖弹层弹出时 canJump = false; 不能跳转
						// 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
						// repeatCheck 用来进行重复判断默认为true，第一次进入之后变为false
						me.nextQuestion_check();
					},
					sdCallback :function(){
						me.repeatCheck = true;
					}
				});
			});
		},
		change: function(list, index){
			var me = H.answer;
			me.$answer.addClass("vertical-align-center");
			me.$answerCountdown.find('.items-count').addClass('none');
			me.$answerCountdown.find('.loading').removeClass('none');
			me.$answerCountdown.removeClass("none").html('本期答题已结束，请等待下期!');
		},
		nextQuestion_check: function(){
			var me = H.answer,
				$loading = $(".loading"),
				$items_count = $('.items-count');

			if(me.repeatCheck){
				me.repeatCheck = false;
				$items_count.addClass('none');
				$loading.removeClass('none');
				if(me.type == 1){
					//距摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
					me.nowCountdown(me.pal[me.index], me.index, false);
				}else if(me.type == 2){
					//距摇奖结束倒计时结束后显示距离下轮摇奖开始倒计时
					if(me.index >= me.pal.length){
						me.change(me.pal[me.pal.length-1], me.pal.length-1);
						me.type = 3;
						return;
					}
					me.beforeShowCountdown(me.pal[me.index], me.index, true);
				}
			}
		},
		spellQuestion: function(qitems, index){
			var me = H.answer; t = simpleTpl();
			me.quid = qitems.quid;
			t._('<dt data-quid="'+ qitems.quid +'">'+ qitems.qt +'</dt>');
			$.each(qitems.aitems, function(i,aitem){
				t._('<dd data-auid="'+ aitem.auid +'" class="">'+ aitem.at +'</dd>');
			});
			$('dl').html(t.toString());
		}
	};

	W.callbackQuestionAnswerHandler = function (data){
		var me = H.answer;
		if (data.code == 0) {
			if(data.rs == 1){//答错题
				showTips("亲，答错了，知识库要更新咯~", 2000);
			}else if(data.rs == 2){//答对题
				showTips("太机智啦，一下子就答对了~", 2000);
			}
			$(".showTips").one("webkitAnimationEnd", function () {
				$(this).removeClass("rubberBand");
			});
			setTimeout(function(){
				me.nextQuestion_check();
			},2000);
		}
	};
})(Zepto);

$(function(){
	H.send.init();
	H.answer.init();
});

var callbackQuestionRoundHandlerData = {
	"code": 0,
	"cud": "1452825000000", //2016-01-15 10:30:00
	"tid": "66becf914ea740c79bfba827eadba23c",
	"t": "中国面孔",
	"bm": "",
	"pst": "2016-09-02 11:22:49",
	"pet": "2016-09-02 23:33:17",
	"nex": "2016-09-02 17:33:21",
	"qitems": [
	{
		"quid": "2e9fadb2ab0f47f5857db6d9f93d107f",
		"qt": "1《中国面孔》节目播出的时间是？",
		"ty": 1,
		"bi": "",
		"dc": "",
		"qst": "2016-01-15 10:30:10",
		"qet": "2016-01-15 10:30:20",
		"qriu": "59cffa366c2b4b65a1cc26ec31628e1b",
		"aitems": [
			{
				"auid": "59cffa366c2b4b65a1cc26ec31628e1b",
				"at": "20:00",
				"aimg": ""
			},
			{
				"auid": "8c80c7b7584747b4a9000d7758032da0",
				"at": "21:00",
				"aimg": ""
			}
		]
	},
	{
		"quid": "e8f876ff6b4b42caab7ba62061614c19",
		"qt": "2疯狂猜图模板",
		"ty": 1,
		"bi": "",
		"dc": "",
		"qst": "2016-01-15 10:30:30",
		"qet": "2016-01-15 10:30:40",
		"qriu": "c25bf4ee732740278eabb2fe05eca56c",
		"aitems": [
			{
				"auid": "c25bf4ee732740278eabb2fe05eca56c",
				"at": "grherther",
				"aimg": ""
			},
			{
				"auid": "e5ae6828e1e64179baf2ff49a1ad62bb",
				"at": "herhreh",
				"aimg": ""
			}
		]
	},
	{
		"quid": "5af257932dfe401a9dad3da97cb3ad02",
		"qt": "3lastQuest",
		"ty": 1,
		"bi": "",
		"dc": "",
		"qst": "2016-01-15 10:30:40",
		"qet": "2016-01-15 10:30:50",
		"qriu": "fb59f0de239f4f86a777f3bf81c605aa",
		"aitems": [
			{
				"auid": "fb59f0de239f4f86a777f3bf81c605aa",
				"at": "的飞洒发",
				"aimg": ""
			},
			{
				"auid": "773af51b07e74aa18a6db22e2ec15bc5",
				"at": "v川味观为各位各位",
				"aimg": ""
			}
		]
	}
]
};