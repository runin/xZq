(function($) {
	H.vote = {
		actUuid: '',
		collectAnswer: '',
		rightAnswer:'',
		currTime: new Date().getTime(),
		$question: $('.answer-box .item ul'),
		$timebox: $('.time-box'),
		$timer: $('.timer'),
		STARTING_CLS: 'starting',
		STARTED_CLS: 'started',
		ENDED_CLS: 'ended',
		REPEAT_CLS: 'repeat',
		TIMETRUE_CLS: true,
		isEnd : false,
		LIMITTIMEFALSE_CLS: false,
		flag:false,
		init: function() {
			var me = this;
			if (!openid) {
				me.loadError('活动还未开始，敬请期待~');
				return false;
			};
			me.updateQuestion();
			me.event();
		},
		event: function() {
			var me = this;
			$('#btn-go2index').click(function(e) {
				e.preventDefault();
				toUrl('index.html');
			});
		},
		updateQuestion: function() {
			getResult('api/question/info', {yoi: openid}, 'callbackQuestionInfoHandler', true, null, true);
		},
		fillContent: function(data) {
			var me = this, t = simpleTpl(),
				qitems = data.qitems || [],
				length = qitems.length;
			me.currTime = timeTransform(data.cut);
			me.actUuid = data.tid;
			for (var i = 0; i < length; i ++) {
				if (qitems[i].rs != null) {
					// qcode 1-错 2-对 0-未答题
					var qcode = qitems[i].rs;
				} else {
					var qcode = 0;
				};
				if (qitems[i].anws != null) {
					var ruid = qitems[i].anws;
				} else {
					var ruid = 0;
				};
				t._('<li data-qriu="'+ qitems[i].qriu +'" data-qcode="'+ qcode +'" data-ruid="'+ ruid +'" data-stime="'+ timestamp(qitems[i].qst) +'" data-etime="'+ timestamp(qitems[i].qet) +'" id="question-'+ qitems[i].quid +'" data-quid="'+ qitems[i].quid +'" >')
					._('<p>'+ qitems[i].qt +'</p>')
					._('<div class="dorA">')
						var aitems = qitems[i].aitems || [];
						for (var j = 0, jlen = aitems.length; j < jlen; j ++) {
							t._('<a class="q-item" href="#" id="answer-'+ aitems[j].auid +'" data-auid="'+ aitems[j].auid +'" data-collect="true" data-collect-flag="tv-xian-ljl-vote-item-btn" data-collect-desc="投票页-选项按钮"><i></i>'+ aitems[j].at +'</a>')
						}
					t._('</div>')
					._('<div class="dorB none">')
						var aitems = qitems[i].aitems || [];
						for (var l = 0, llen = aitems.length; l < llen; l ++) {
							t._('<span id="show-'+ aitems[l].auid +'" data-auid="'+ aitems[l].auid +'"><i></i>'+ aitems[l].at +'</span>')
						}
					t._('</div>')
				._('</li>')
			}
			me.$question.html(t.toString());
			me.progress(data.cut);
			me.itemBtnclick();
		},
		fillAnswer: function(data) {
			var me = this, $thisQ = this.getQuestion(data.suid);
			if (data.rs === 2) {
				H.dialog.fudai.open();
				me.TIMETRUE_CLS = true;
			} else if (data.rs === 1) {
				H.dialog.voteWrong.open();
				me.TIMETRUE_CLS = true;
				if (me.LIMITTIMEFALSE_CLS) {
					me.TIMETRUE_CLS = true;
					me.LIMITTIMEFALSE_CLS = true;
				} else {
					setTimeout(function() {
						me.TIMETRUE_CLS = true;
						me.LIMITTIMEFALSE_CLS = true;
					}, answer_delaytimer);
				};
			};
			if ($thisQ) {
				$thisQ.attr('data-qcode', data.rs);
			};
			$('.q-item').removeClass(me.REPEAT_CLS);
			$thisQ.find('.dorB span').removeClass('selected')
			$('#show-' + me.collectAnswer).addClass('selected');
			$thisQ.find('.dorA').addClass('none');
			$thisQ.find('.dorB').removeClass('none');
		},
		getQuestion: function(quid) {
			return $('#question-' + quid);
		},
		getAnswer: function(quid) {
			return $('#answer-' + quid);
		},
		itemBtnclick: function() {
			var me = this;
			$('.q-item').click(function(e) {
				e.preventDefault();
				if ($(this).hasClass(me.REPEAT_CLS)) {
					showTips('这道题您已经答过了!')
					return;
				};
				$(".q-item").find("i").removeClass("selected");
				$(this).find("i").addClass("selected");
				me.collectAnswer = $(this).attr('data-auid');
				getResult('api/question/answer', {
					yoi: openid,
					suid: $(this).parent('.dorA').parent('li').attr('data-quid'),
					auid: me.collectAnswer
				}, 'callbackQuestionAnswerHandler', true);
				
				me.TIMETRUE_CLS = false;
				$(this).addClass(me.REPEAT_CLS);
			});
			$('.dorB span').click(function(e) {
				e.preventDefault();
				showTips('这道题您已经答过了!');
				return;
			});
		},
		fixLocaltime: function(serverTime){
			var time, nowTime = Date.parse(new Date());
            if(nowTime > serverTime){
                time += (nowTime - serverTime);
            }else if(nowTime < serverTime){
                time -= (serverTime - nowTime);
            };
            return time;
        },
		progress: function(data) {
			var me = this, server_time = new Date(data).getTime(), itemLength = this.$question.find('li').length;
			//每道题
			this.$question.find('li').each(function() {
				var $me = $(this), result = $me.attr('data-ruid');
				$me.progress({
					cTime: data,
					stpl : '<div class="detail-countdown"><p>%H%</p>' + '<label class="dian">时</label>' + '<p>%M%</p>' + '<label class="dian">分</label>' + '<p>%S%</p>'+'<label class="dian">秒</label></div>',
					callback: function(state) {
						if(me.TIMETRUE_CLS) {
							var cls = '';
							switch(state) {
								case 1: 
									cls = me.STARTING_CLS + ' none';	//未开始
									break;
								case 2:
									cls = me.STARTED_CLS;	//正在进行
									break;
								default:
									cls = me.ENDED_CLS + ' none';	//已结束
							};
							$me.removeClass().addClass(cls);
							//答题开始且没有答题
							var $started = me.$question.find('li.' + me.STARTED_CLS).not(function() {
									return parseInt($(this).attr('data-qcode')) !== 0;
								});
							//还未开始
							var $starting = me.$question.find('li.' + me.STARTING_CLS);
							//已经结束
							var $ended = me.$question.find('li.' + me.ENDED_CLS);
						
							//所有答题未开始
							if (itemLength == $starting.length) {
								$('.answer-box .show-box').addClass('hidden');
								me.$timebox.html("距离答题抽奖开始还有"+$starting.eq(0).attr('data-timestr')).removeClass('none');
								return;
							//所有答题结束
							} else if(itemLength == $ended.length){
								me.$timebox.html("本期活动已结束，请等待下期!").removeClass("none");
								$('.answer-box .show-box').addClass('hidden');
								 clearInterval(window.progressTimeInterval);
								return;
							}else {
								$('.answer-box .show-box').removeClass('hidden');
								$('.answer-box .item').removeClass('none');
							}
							//已经开始并且尚未答题
							if ($started.length > 0) {
								$started.eq(0).removeClass('none');
								me.$timebox.html("赶快答题抽大奖哦~").removeClass("none");
							} else {
								//未开
								if ($starting.length > 0) {
									var $prev = $starting.eq(0).prev('li');
									$prev.find(".dorB span").removeClass("selected");
									//用户选择的选项
									if($prev.attr("data-ruid")!=0){
										$("#show-"+$prev.attr("data-ruid")).addClass("selected");
										$("#show-"+$prev.attr("data-qriu")).addClass("right");
									}else if(H.vote.collectAnswer){
										$("#show-"+H.vote.collectAnswer).addClass("selected");
										$("#show-"+$prev.attr("data-qriu")).addClass("right");
									}else{
										$prev.find(".dorB span").removeClass("right");
										$("#show-"+$prev.attr("data-qriu")).addClass("right");
									}
									$prev.find('.dorA').addClass('none');
								    $prev.find('.dorB').removeClass('none');
									me.$timebox.html("距离下轮答题抽奖还有"+$starting.eq(0).attr('data-timestr')).removeClass('none');
								} else if ($me.next('li').length == 0) {
									$me.find(".dorB span").removeClass("selected");
									if($me.attr("data-ruid")!=0){
										$("#show-"+$me.attr("data-ruid")).addClass("selected");
										$("#show-"+$me.attr("data-qriu")).addClass("right");
									}else if(H.vote.collectAnswer){
										$("#show-"+H.vote.collectAnswer).addClass("selected");
										$("#show-"+$me.attr("data-qriu")).addClass("right");
									}else{
										$me.find(".dorB span").removeClass("right");
										$("#show-"+$me.attr("data-qriu")).addClass("right");
									}
									$me.find('.dorA').addClass('none');
									$me.find('.dorB').removeClass('none');
									$me.removeClass("none");
									H.vote.isEnd = true;
									me.$timebox.html("本期活动已结束，请等待下期!").removeClass("none");
								   
								}
							}
						}
					}
				});
			});
		},
		loadError: function(tips) {
			var tips = tips || '活动还未开始，敬请期待~';
			$('.time-box').html(tips).removeClass("none");
			$(".show-box").addClass("hidden");
		}
	};

	W.callbackQuestionInfoHandler = function(data) {
		if (data.code == 0) {
			if (data.qitems) {
				H.vote.tid = data.tid;
				H.vote.fillContent(data);
			} else {
				H.vote.loadError();
			};
		} else {
			H.vote.loadError();
		};
	};
	
	W.callbackQuestionAnswerHandler = function(data) {
		if (data.code == 0) {
			H.vote.fillAnswer(data);
			return;
		} else {
			showTips(data.message);
		};
	};
	
})(Zepto);

$(function() {
	H.vote.init();
});