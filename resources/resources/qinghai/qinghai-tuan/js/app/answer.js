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
		$total: $('#count'),
		STARTING_CLS: 'starting',
		QUEdata:"",
        wxCheck:false,
        isError:false,
		STARTED_CLS: 'started',
		ENDED_CLS: 'ended',
		REQUEST_CLS: 'requesting',
		REPEAT_CLS: 'repeat',
		TIMETRUE_CLS: true,
		LIMITTIMEFALSE_CLS: false,
		$btnFunny: $('.funny-box img'),
		currTime: new Date().getTime(),
		headMix: Math.ceil(8*Math.random()),
		
		init: function() {
			if (!openid) {
				return false;
			};
			H.answer.wxConfig();
			H.utils.resize();
			getResult('api/question/round', {yoi: openid}, 'callbackQuestionRoundHandler', true, null, true);
			// getResult('yiguan/info', {
			// 	yoi: openid
			// }, 'callbackYiguanInfo', true, null, true);
			setInterval(function(){
            	 H.answer.account_num();
            },5000);
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
		account_num: function(){
		       getResult('log/serpv ', {}, 'callbackCountServicePvHander');
		},
		fill: function(data,r) {
			var me = this, t = simpleTpl(),
				qitems = data.qitems || [],
				ritems = r.items || [],
				length = qitems.length;

			me.currTime = timeTransform(parseInt(data.cud));
			me.tid = data.tid;
			t._('<ul>');
			for (var i = 0; i < length; i ++) {
				var qcode = 0;
				var ruid = 123;
				if(ritems.length == 0){
					var qcode = 0;
					var ruid = 123;
				}else {
					for(var a = 0; a < ritems.length; a ++){
						if(ritems[a].quid == qitems[i].quid){
							if (ritems[a].rs) {
								// qcode 1-错 2-对 0-未答题
								var qcode = ritems[a].rs;
							} else {
								var qcode = 0;
							};
							if (ritems[a].anws) {
								var ruid = ritems[a].anws;
							} else {
								var ruid = 0;
							};
						}
					}
				}
					t._('<li data-qcode="'+ qcode +'" data-ruid="'+ ruid +'" data-stime="'+ timestamp(qitems[i].qst) +'" data-etime="'+ timestamp(qitems[i].qet) +'" id="question-'+ qitems[i].quid +'" data-quid="'+ qitems[i].quid +'">')
						._('<dl>')
							._('<dt>'+ qitems[i].qt +'</dt>');
							var aitems = qitems[i].aitems || [];
							for (var j = 0, jlen = aitems.length; j < jlen; j ++) {
								t._('<dd><a href="#" class="q-item" data-auid="'+ aitems[j].auid +'" data-collect="true" data-collect-flag="tv-yunnan-biancheng-answer-answer" data-collect-desc="答题页面-答案按钮">'+ aitems[j].at +'</a></dd>');
							}
						t._('</dl>')
					._('</li>');
				}
			t._('</ul>');
			this.$question.html(t.toString());
			this.progress(parseInt(data.cud));
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
			var me = this, server_time = new Date(data).getTime(), itemLength = this.$question.find('li').length;
			this.$question.find('li').each(function() {
				var $me = $(this), result = $me.attr('data-ruid');
				$me.progress({
					cTime: data,
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
									return parseInt($(this).attr('data-qcode')) !== 0; // 未答题
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
									if ($prev && parseInt($prev.attr('data-qcode')) === 1) {
										me.$answered.addClass('error');
										$('#answer-tip').removeClass('none');
									} else {
										me.$answered.removeClass('error');
										$('#answer-tip').addClass('none');
									}
									me.$timebox.html($starting.eq(0).attr('data-timestr')).removeClass('none');
									$('.timer').removeClass('none');
								} else if ($me.next('li').length == 0) {
									clearInterval(window.progressTimeInterval);
									$(".time-box").addClass('none');
									$('.timer-tips').removeClass('none').find('h4').html("<span class='wait-next'>本期答题已结束，请等待下期<span>");
									$('.timer').removeClass('none');
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
				getResult('api/question/answer', {
					yoi: openid,
					suid: $(this).closest('li').attr('data-quid'),
					auid: $(this).attr('data-auid')
				}, 'callbackQuestionAnswerHandler', true);
				// getResult('yiguan/answer', {
				// 	yoi: openid,
				// 	auid: $(this).attr('data-auid')
				// }, 'callbackYiguanAnswer', true);
				// H.answer.TIMETRUE_CLS = false;
				// $(this).addClass(me.REPEAT_CLS);
			});
			
			this.$btnRule.click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});

			$('#ranking').click(function(e) {
				e.preventDefault();
				$('#ranking').css({"-webkit-animation":"toggle 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).on("webkitAnimationEnd", function () {
					H.dialog.rank.open();
					$(".rank-dialog").css({"-webkit-animation":"dispshow 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("webkitAnimationEnd", function () {
						$('.rank-dialog').css({"-webkit-animation":""});
						$('#ranking').css({"-webkit-animation":""});
					});
				});
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
				shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save'+dev,
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
                        hidenewLoading();
                    },
                    success : function(data) {
                        me.$btnFunny.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                        	showTips('发射成功', null, 800);
                            var nfunny = funny.replace('/:','');
							var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
			                barrage.appendMsg('<div class="c_head_img menow"><img class="c_head_img_img" src="' + h + '" /></div>'+'<img class="funnyimg" src="./images/funny/' + nfunny + '.png" border="0" />');
			                $('.menow').parent('div').addClass('me').css({'height': '41px'});
			                me.$inputCmt.removeClass('error').val('');
			                return;
                        }
                    }
                });
			});
		},	
		answered: function(data) {
			var me = this;
			// data.rs === 2 答对了
			this.$question.addClass('none');
			this.$answered.removeClass('none').addClass(data.rs === 2 ? '' : 'error');
			if (data.rs === 2) {
				H.answer.TIMETRUE_CLS = true;
				$('#answer-tip').addClass('none');
				H.dialog.fudai.open();
			} else {
				$('#answer-tip').removeClass('none');
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
			var $question = this.$getQuestion(data.suid);
			if ($question) {
				$question.attr('data-qcode', data.rs);
			}
		},
		
		$getQuestion: function(quid) {
			return $('#question-' + quid);
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
					}else if(data.code == 1){
                    }
				},
				error : function(xmlHttpRequest, error) {
				}
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
			this.$header.css('height', Math.round(height * 0.38));
			this.$wrapper.css('height', Math.round(height * 0.62));
			this.$comments.css('height', Math.round(height * 0.62 - 70));
			$('body').css('height', height);
		}	
	};

	W.callbackQuestionRoundHandler = function(data) {
		if (data.code == 0) {
			getResult('api/question/allrecord', {
				tid: data.tid,
				yoi: openid
			}, 'callbackQuestionAllRecordHandler', true, null, true);
			H.answer.QUEdata = data;
			//H.answer.fill(data);
		}
	};
	W.callbackQuestionAllRecordHandler = function (data) {
		H.answer.fill(H.answer.QUEdata,data);
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
})(Zepto);

$(function() {
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