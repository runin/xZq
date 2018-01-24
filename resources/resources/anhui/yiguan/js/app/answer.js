(function($) {
	
	H.answer = {
		tid: '',
		$article: $('#article'),
		$question: $('#question'),
		$answered: $('#answered'),
		$timebox: $('#time-box'),
		$answerTip: $('#answer-tip'),
		$btnRank: $('#ranking'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		$btnRule: $('#btn-rule'),
		$total: $('#total'),
		STARTING_CLS: 'starting',
		STARTED_CLS: 'started',
		ENDED_CLS: 'ended',
		REQUEST_CLS: 'requesting',
		currTime: new Date().getTime(),
		
		init: function() {
			if (!openid) {
				window.location.href = 'index.html';
				return;
			}
			H.utils.resize();
			
			getResult('yiguan/info', {
				yoi: openid
			}, 'callbackYiguanInfo', true, null, true);
			
			this.event();
			
			H.comment.init();
			
			this.updatepv();
			
			// 预约本剧
			this.prereserve();
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
			
			this.$article.css('background-image', 'url('+ data.bm +')');
			this.currTime = timestamp(data.cut);
			this.tid = data.tid;
			
			t._('<ul>');
				for (var i = 0; i < length; i ++) {
					t._('<li data-qcode="'+ qitems[i].qcode +'" data-ruid="'+ qitems[i].ruid +'" data-stime="'+ timestamp(qitems[i].qst) +'" data-etime="'+ timestamp(qitems[i].qet) +'" id="question-'+ qitems[i].quid +'" data-quid="'+ qitems[i].quid +'">')
						._('<dl>')
							._('<dt>'+ qitems[i].qt +'</dt>');
							
							var aitems = qitems[i].aitems || [];
							for (var j = 0, jlen = aitems.length; j < jlen; j ++) {
								t._('<dd><a href="#" class="q-item" data-auid="'+ aitems[j].auid +'" data-collect="true" data-collect-flag="ah-answer-answer" data-collect-desc="答题页面-答案按钮">'+ aitems[j].at +'</a></dd>');
							}
							
						t._('</dl>')
					._('</li>');
				}
			t._('</ul>');
			
			this.$question.html(t.toString());
			
			this.progress();
		},
		
		progress: function() {
			var me = this;
			this.$question.find('li').each(function() {
				var $me = $(this),
					result = $me.attr('data-ruid');

				$me.progress({
					cTime: me.currTime,
					stpl : '<span>%H%</span><i>:</i><span>%M%</span><i>:</i><span>%S%</span>',
					callback: function(state) {
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
								me.$timebox.addClass('none').siblings('h4').html('本期答题活动已结束，请等待下期答题<a href="#" class="btn-reserve" id="btn-reserve" data-collect="true" data-collect-flag="ah-answer-reservebtn" data-collect-desc="答题页面-预约本剧按钮">预约本剧</a>');
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
				getResult('yiguan/answer', {
					yoi: openid,
					auid: $(this).attr('data-auid')
				}, 'callbackYiguanAnswer', true);
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
					alert('请先说点什么吧');
					me.$inputCmt.removeClass('error').addClass('error').focus();
					return;
				} else if (len > 20) {
					alert('观点字数超出了20字');
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
						nickname: nickname ? encodeURIComponent($.fn.cookie(shaketv_appid + '_nickname')) : "",
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
							barrage.appendMsg(comment);
							me.$inputCmt.removeClass('error').val('');
							return;
						}
						alert(data.message);
					}
				});
				
			});
		},
		
		answered: function(data) {
			// data.rs === 1 答对了
			this.$question.addClass('none');
			this.$answered.removeClass('none').addClass(data.rs === 1 ? '' : 'error');
			if (data.rs === 1) {
				H.dialog.lottery.open();
			}
			var $question = this.$getQuestion(data.quid);
			if ($question) {
				$question.attr('data-qcode', data.rs);
			}
		},
		
		$getQuestion: function(quid) {
			return $('#question-' + quid);
		},
		
		// 是否配置了预约节目
		prereserve: function() {
			var me = this;
			$.ajax({
				type : 'GET',
				async : true,
				url : domain_url + 'program/reserve/get',
				data: {},
				dataType : "jsonp",
				jsonpCallback : 'callbackProgramReserveHandler',
				success : function(data) {
					if (!data.reserveId) {
						return;
					}
					window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function(resp){
						if (resp.errorCode == 0) {
							me.$answered.find('h4').addClass('reserved').attr('data-reserveid', data.reserveId);
						}
					});
				}
			});
		}
		
	};
	
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
				jsonpCallback : 'callbackCommentsRoom',
				success : function(data) {
					if (data.code != 0) {
						return;
					}
					me.maxid = data.maxid;
					var items = data.items || [];
					for (var i = 0, len = items.length; i < len; i ++) {
						barrage.pushMsg(items[i].co);
					}
				}
			});
		}
	};
	
	H.utils = {
		$header: $('header'),
		$wrapper: $('article'),
		$comments: $('#comments'),
		resize: function() {
			var height = $(window).height();
			this.$header.css('height', height * 0.38);
			this.$wrapper.css('height', height * 0.62);
			this.$comments.css('height', height * 0.62 - 50);
			$('body').css('height', height);
		}	
	};

	// 显示题目
	W.callbackYiguanInfo = function(data) {
		if (data.code == 0) {
			H.answer.fill(data);			
		}
	};
	
	// 答题
	W.callbackYiguanAnswer = function(data) {
		if (data.code == 0) {
			H.answer.answered(data);
			return;
		}
		alert(data.message);
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

