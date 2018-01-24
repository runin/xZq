(function($) {
	H.answer = {
		actUuid: '',
		collectAnswer: '',
		currTime: new Date().getTime(),
		$question: $('.answer-box .item ul'),
		$timebox: $('.time-box'),
		$timer: $('.timer'),
		STARTING_CLS: 'starting',
		STARTED_CLS: 'started',
		ENDED_CLS: 'ended',
		REPEAT_CLS: 'repeat',
		TIMETRUE_CLS: true,
		LIMITTIMEFALSE_CLS: false,
		wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
		init: function() {
			var me = this;
			if (!openid) {
				me.loadError('活动还未开始，敬请期待~');
				return false;
			};
			me.loadResize();
			me.updateQuestion();
			me.updateCount();
			me.event();
			me.ddtj();
			me.wxConfig();
		},
		event: function() {
			var me = this;
			$('header a').click(function(e) {
				e.preventDefault();
				toUrl('declaration.html');
			});
		},
		updateQuestion: function() {
			getResult('api/question/info', {yoi: openid}, 'callbackQuestionInfoHandler', true, null, true);
		},
		updateCount: function() {
			getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
			setInterval(function() {
				getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
			}, 5000);
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
				t._('<li data-qcode="'+ qcode +'" data-ruid="'+ ruid +'" data-stime="'+ timestamp(qitems[i].qst) +'" data-etime="'+ timestamp(qitems[i].qet) +'" id="question-'+ qitems[i].quid +'" data-quid="'+ qitems[i].quid +'">')
					._('<p>'+ qitems[i].qt +'</p>')
					._('<div class="dorA">')
						var aitems = qitems[i].aitems || [];
						for (var j = 0, jlen = aitems.length; j < jlen; j ++) {
							t._('<a class="q-item" href="#" id="answer-'+ aitems[j].auid +'" data-auid="'+ aitems[j].auid +'" data-collect="true" data-collect-flag="yn-travel-answer-item" data-collect-desc="答题页-答案按钮">'+ aitems[j].at +'</a>')
						}
					t._('</div>')
					._('<div class="dorB none">')
						var aitems = qitems[i].aitems || [];
						for (var l = 0, llen = aitems.length; l < llen; l ++) {
							t._('<span id="show-'+ aitems[l].auid +'" data-auid="'+ aitems[l].auid +'">'+ aitems[l].at +'</span>')
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
			$thisQ.find('.dorA').addClass('none');
			$thisQ.find('.dorB').removeClass('none');
			if (data.rs === 2) {
				$thisQ.find('.dorB span').removeClass().addClass('wrong answered');
				$('#show-' + me.collectAnswer).removeClass().addClass('right');
				H.dialog.fudai.open();
				me.TIMETRUE_CLS = true;
			} else if (data.rs === 1) {
				$thisQ.find('.dorB span').removeClass().addClass('right answered');
				$('#show-' + me.collectAnswer).removeClass().addClass('wrong');
				H.dialog.funny.open();
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
				getResult('api/question/answer', {
					yoi: openid,
					suid: $(this).parent('.dorA').parent('li').attr('data-quid'),
					auid: $(this).attr('data-auid')
				}, 'callbackQuestionAnswerHandler', true);
				me.collectAnswer = $(this).attr('data-auid');
				me.TIMETRUE_CLS = false;
				$(this).addClass(me.REPEAT_CLS);
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
			this.$question.find('li').each(function() {
				var $me = $(this), result = $me.attr('data-ruid');
				$me.progress({
					cTime: data,
					stpl : '距离下次答题抽奖还有:<span>%H%</span><span>:</span><span>%M%</span><span>:</span><span>%S%</span>',
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
							var $started = me.$question.find('li.' + me.STARTED_CLS).not(function() {
									return parseInt($(this).attr('data-qcode')) !== 0;
								});
							var $starting = me.$question.find('li.' + me.STARTING_CLS);
							if (itemLength == $starting.length) {
								$('.answer-box .item').addClass('none');
								$('.answer-box .wait').removeClass('none');
								$('.answer-box .wait h1').text('不要走开~抽奖马上开始');
							} else {
								if (!$('.answer-box').hasClass('over')) {
									$('.answer-box .item').removeClass('none');
									$('.answer-box .wait').addClass('none');
								};
							}
							if ($started.length > 0) {
								$started.eq(0).removeClass('none');
								me.$timebox.addClass('none');
							} else {
								if ($starting.length > 0) {
									var $prev = $starting.eq(0).prev('li');
									if ($prev && parseInt($prev.attr('data-qcode')) === 0) {
										$prev.find('.dorA').removeClass('none');
										$prev.find('.dorB').addClass('none');
									} else if ($prev && parseInt($prev.attr('data-qcode')) === 1) {
										var collectAnswer = $prev.attr('data-ruid');
										$prev.find('.dorA').addClass('none');
										$prev.find('.dorB').removeClass('none');
										if (!$prev.find('.dorB span').hasClass('answered')) {
											$prev.find('.dorB span').removeClass().addClass('right');
											$('#show-' + collectAnswer).removeClass().addClass('wrong');
										};
									} else if ($prev && parseInt($prev.attr('data-qcode')) === 2) {
										var collectAnswer = $prev.attr('data-ruid');
										$prev.find('.dorA').addClass('none');
										$prev.find('.dorB').removeClass('none');
										if (!$prev.find('.dorB span').hasClass('answered')) {
											$prev.find('.dorB span').removeClass().addClass('wrong');
											$('#show-' + collectAnswer).removeClass().addClass('right');
										};
									};
									me.$timebox.removeClass('none').html($starting.eq(0).attr('data-timestr'));
								} else if ($me.next('li').length == 0) {
									$('.answer-box').addClass('over');
									clearInterval(window.progressTimeInterval);
									me.loadError('本期活动已结束，请等待下期!');
								}
							}
						}
					}
				});
			});
		},
		loadResize: function() {
			var me = this,
				winW = $(window).width(),
				winH = $(window).height(),
				answerW = $('.answer-box').width();
			$('body').css({
				'width': winW,
				'height': winH
			});
			var answerH = Math.round(answerW * 342 / 554);
			$('.answer-box').css('height', answerH);
		},
		loadError: function(tips) {
			var tips = tips || '活动还未开始，敬请期待~';
			$('.time-box, .answer-box .item').addClass('none');
			$('.answer-box .wait').removeClass('none');
			$('.answer-box .wait h1').text(tips);
		},
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'mp/jsapiticket' + dev,
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
                    }

                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
		ddtj: function() {
			$('#ddtj').addClass('none');
			getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
		}
	};

	W.callbackQuestionInfoHandler = function(data) {
		if (data.code == 0) {
			if (data.qitems) {
				H.answer.fillContent(data);
			} else {
				H.answer.loadError();
			};
		} else {
			H.answer.loadError();
		};
	};
	
	W.callbackQuestionAnswerHandler = function(data) {
		if (data.code == 0) {
			H.answer.fillAnswer(data);
			return;
		} else {
			showTips(data.message);
		};
	};
	
	W.callbackCountServicePvHander = function(data) {
		if (data.code == 0) {
			$('header p').animate({'opacity': '1'}, 1000);
			$('header p label').text(data.c);
		} else {
			$('header p').animate({'opacity': '0'}, 1000);
		};
	};

	W.commonApiPromotionHandler = function(data){
		if (data.code == 0 && data.desc && data.url) {
			$('#ddtj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
		} else {
			$('#ddtj').remove();
		};
	};
	
})(Zepto);

$(function() {
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
    
	H.answer.init();
});