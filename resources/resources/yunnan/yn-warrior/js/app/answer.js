(function($) {
	H.answer = {
		tid: '',
		$article: $('#article'),
		$question: $('#question'),
		$answered: $('#answered'),
		$timebox: $('#time-box'),
		$timer: $('.timer'),
		$answerTip: $('#answer-tip'),
		$btnRank: $('#ranking'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		$btnRule: $('#btn-rule'),
		$total: $('#total'),
		$btnFunny: $('.funny-box img'),
		STARTING_CLS: 'starting',
		STARTED_CLS: 'started',
		ENDED_CLS: 'ended',
		REQUEST_CLS: 'requesting',
		REPEAT_CLS: 'repeat',
		TIMETRUE_CLS: true,
		LIMITTIMEFALSE_CLS: false,
		currTime: new Date().getTime(),
		sendFunnyTime:null,
		headMix: Math.ceil(7*Math.random()),
		
		init: function() {
			if (!openid) {
				return false;
			};
			H.utils.resize();
			getResult('yiguan/info', {
				yoi: openid
			}, 'callbackYiguanInfo', true, null, true);
			this.event();
			H.comment.init();
			this.updatepv();
		},
		updatepv: function() {
			getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
			setInterval(function() {
				getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
			}, 5000);
		},
		fill: function(data) {
			var t = simpleTpl(),
				qitems = data.qitems || [],
				length = qitems.length;
			
			// this.$article.css('background-image', 'url('+ data.bm +')');
			this.currTime = timestamp(data.cut);
			this.tid = data.tid;
			
			t._('<ul>');
				for (var i = 0; i < length; i ++) {
					t._('<li data-qcode="'+ qitems[i].qcode +'" data-ruid="'+ qitems[i].ruid +'" data-stime="'+ timestamp(qitems[i].qst) +'" data-etime="'+ timestamp(qitems[i].qet) +'" id="question-'+ qitems[i].quid +'" data-quid="'+ qitems[i].quid +'">')
						._('<dl>')
							._('<dt>'+ qitems[i].qt +'</dt>');
							
							var aitems = qitems[i].aitems || [];
							for (var j = 0, jlen = aitems.length; j < jlen; j ++) {
								t._('<dd><a href="#" class="q-item" data-auid="'+ aitems[j].auid +'" data-collect="true" data-collect-flag="yn-wudu-answer-answer" data-collect-desc="答题页面-答案按钮">'+ aitems[j].at +'</a></dd>');
							}
							
						t._('</dl>')
					._('</li>');
				}
			t._('</ul>');
			
			this.$question.html(t.toString());
			
			this.progress(data.cut);
		},
		server_time: function(serverTime){
			var time, nowTime = Date.parse(new Date());
            if(nowTime > serverTime){
                time += (nowTime - serverTime);
            }else if(nowTime < serverTime){
                time -= (serverTime - nowTime);
            }
            return time;
        },
		progress: function(data) {
			var me = this,
			server_time = new Date(data).getTime();
			this.$question.find('li').each(function() {
				var $me = $(this),
					result = $me.attr('data-ruid');
					
				$me.progress({
					cTime: me.currTime,
					stpl : '<span>%H%</span><span>:</span><span>%M%</span><span>:</span><span>%S%</span>',
					callback: function(state) {
						if(H.answer.TIMETRUE_CLS) {
							var cls = '';
							switch(state) {
								case 1: 
									cls = me.STARTING_CLS + ' none';
									break;
								case 2:
									cls = me.STARTED_CLS;
									break;
								default:
									cls = me.ENDED_CLS + ' none';
							}
							$me.removeClass().addClass(cls);
							
							var $started = me.$question.find('li.' + me.STARTED_CLS).not(function() {
									return parseInt($(this).attr('data-qcode')) !== 2; // 未答题
								}),
								$starting = me.$question.find('li.' + me.STARTING_CLS);
							
							if ($started.length > 0) {
								me.$answered.addClass('none');
								$started.eq(0).removeClass('none');
								me.$question.removeClass('none');
							} else {
								me.$question.addClass('none');
								me.$answered.removeClass('none');
								
								if ($starting.length > 0) {
									// 上一题答错
									var $prev = $starting.eq(0).prev('li');
									if ($prev && parseInt($prev.attr('data-qcode')) === 0) {
										me.$answered.addClass('error');
									} else {
										me.$answered.removeClass('error');
									}
									me.$timebox.html($starting.eq(0).attr('data-timestr'));
								} else if ($me.next('li').length == 0) {
									clearInterval(window.progressTimeInterval);
									me.$timebox.addClass('none').siblings('h4').html("<span class='wait-next'>本期答题活动已结束，请等待下期答题<span>");
								}
							}
						}
					}
				});
			});
		},
		
		event: function() {
			var me = this;

			this.$question.delegate('.q-item', 'click', function(e) {
				e.preventDefault();
				if ($(this).hasClass(me.REPEAT_CLS)) {
					return;
				};

				getResult('yiguan/answer', {
					yoi: openid,
					auid: $(this).attr('data-auid')
				}, 'callbackYiguanAnswer', true);
				H.answer.TIMETRUE_CLS = false;
				$(this).addClass(me.REPEAT_CLS);
			});
			
			this.$btnRule.click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			
			this.$btnRank.click(function(e) {
				e.preventDefault();
				H.dialog.rank.open();
			});
			
			this.$answered.delegate('h4', 'click', function(e) {
				e.preventDefault();
				var reserveId = $(this).attr('data-reserveid');
				if (!reserveId) {
					return;
				}
				shaketv.reserve(yao_tv_id, reserveId, function(data){
					
				});
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
					showTips('请先说点什么吧',4);
					me.$inputCmt.removeClass('error').addClass('error').focus();
					return;
				} else if (len > 20) {
					showTips('观点字数超出了20字',4);
					me.$inputCmt.removeClass('error').addClass('error').focus();
					return;
				}
				
				$(this).addClass(me.REQUEST_CLS);

				showLoading();
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'comments/save',
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
                        hideLoading();
                    },
                    success : function(data) {
                        me.$btnCmt.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                        	showTips('发射成功', null, 800);
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.png';
                            barrage.appendMsg('<img class="isme" src="' + h + '" />'+comment);
                            $('.isme').parent('div').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                        showTips(data.message);
                    }
                });
				
			});

			this.$btnFunny.click(function(e) {
				e.preventDefault();
				
				if ($(this).hasClass(me.REQUEST_CLS)) {
					return;
				}
				var time = new Date().getTime();
				if(H.answer.sendFunnyTime != null && time - H.answer.sendFunnyTime < sendTime){
					showTips('点的太快啦~ 休息下吧!');
					return;
				}else{
					H.answer.sendFunnyTime = time;
					$('.funny-box img').css('-webkit-filter', 'grayscale(100%)');
					setTimeout(function(){
						$('.funny-box img').css('-webkit-filter', 'grayscale(0%)');
					}, sendTime);
				}
				$(this).addClass(me.REQUEST_CLS);
				var funny = $(this).attr('data-item') || '/:funny1';
				showLoading();
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'comments/save',
                    data: {
                        co: encodeURIComponent(funny),
                        op: openid,
                        tid: me.tid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        headimgurl: headimgurl ? $.fn.cookie(mpappid + '_headimgurl') : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        hideLoading();
                    },
                    success : function(data) {
                        me.$btnFunny.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                        	showTips('发射成功', null, 800);
                            var nfunny = funny.replace('/:','');
							var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.png';
			                barrage.appendMsg('<img class="menow" src="' + h + '" />'+'<div class="funnyshow"><img src="./images/funny/' + nfunny + '.png" border="0" /></div>');
			                $('.menow').parent('div').addClass('me').css({'height': '41px'});
			                me.$inputCmt.removeClass('error').val('');
			                return;
                        }
                        showTips(data.message);
                    }
                });
			});
		},
		
		answered: function(data) {
			var me = this;
			// data.rs === 1 答对了
			this.$question.addClass('none');
			this.$answered.removeClass('none').addClass(data.rs === 1 ? '' : 'error');
			if (data.rs === 1) {
				H.answer.TIMETRUE_CLS = true;
				H.dialog.fudai.open();
			} else {
				if (H.answer.LIMITTIMEFALSE_CLS) {
					H.answer.TIMETRUE_CLS = true;
					H.answer.LIMITTIMEFALSE_CLS = true;
				} else {
					$('header').css('overflow', 'visible');
					showLoading($('header'));
					setTimeout(function() {
						hideLoading($('header'));
						$('header').css('overflow', 'hidden');
						H.answer.TIMETRUE_CLS = true;
						H.answer.LIMITTIMEFALSE_CLS = true;
					}, answer_delaytimer);
				}
			}
			$('.q-item').removeClass(me.REPEAT_CLS);
			var $question = this.$getQuestion(data.quid);
			if ($question) {
				$question.attr('data-qcode', data.rs);
			}
		},
		
		$getQuestion: function(quid) {
			return $('#question-' + quid);
		}
		
	};
	
	// 弹幕_S
	H.comment = {
		timer: 5000,
		maxid: 0,
		pageSize: 10,
		$comments: $('#comments'),	
		init: function() {
			var me = this;
			W['barrage'] = this.$comments.barrage();
			setTimeout(function(){
				W['barrage'].start(1);
				setInterval(function() {
					me.flash();
				}, me.timer);
			}, 1000);
		},
		
		flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'comments/room',
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
                    if (data.code != 0) {
                        return;
                    }
                    me.maxid = data.maxid;
                    var items = data.items || [], umoReg = '/:';
                    for (var i = 0, len = items.length; i < len; i ++) {
                    	if ((items[i].co).indexOf(umoReg) >= 0) {
                    		var funny = items[i].co;
                    		var nfunny = funny.replace('/:','');
			                barrage.appendMsg('<img class="ismenow" src="' + (items[i].hu ? (items[i].hu + "/" + yao_avatar_size) : "./images/danmu-head.png") + '" />'+'<div class="funnyshow"><img src="./images/funny/' + nfunny + '.png" border="0" /></div>');
                    	} else {
                    		barrage.pushMsg("<img src='" + (items[i].hu ? (items[i].hu + '/' + yao_avatar_size) : './images/danmu-head.png') + " '/>"+items[i].co);
                    	};
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
			this.$header.css('height', Math.round(height * 0.38));
			this.$wrapper.css('height', Math.round(height * 0.62));
			this.$comments.css('height', Math.round(height * 0.62 - 85));
			$('body').css('height', height);
		}	
	};

	W.callbackYiguanInfo = function(data) {
		if (data.code == 0) {
			H.answer.fill(data);
		}
	};
	
	W.callbackYiguanAnswer = function(data) {
		if (data.code == 0) {
			H.answer.answered(data);
			return;
		}
		showTips(data.message);
	};
	
	W.callbackCountServicePvHander = function(data) {
		if (data.code == 0) {
			H.answer.$total.text(data.c);
		}
	};
	
})(Zepto);

$(function() {
	H.answer.init();
});