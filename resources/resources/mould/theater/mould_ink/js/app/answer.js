(function($) {
	H.answer = {
		tid: '',
		$article: $('#article'),
        $question: $('.answer-box .item ul'),
        $answered: $('#answered'),
		$timebox: $('.time-box'),
		$timer: $('.timer'),
		$answerTip: $('#answer-tip'),
		$btnRank: $('#ranking'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		$btnRule: $('#btn-rule'),
		$total: $('#count'),
		STARTING_CLS: 'starting',
		STARTED_CLS: 'started',
		ENDED_CLS: 'ended',
		REQUEST_CLS: 'requesting',
		REPEAT_CLS: 'repeat',
		TIMETRUE_CLS: true,
		QUEdata:"",
		chktime:0,
		isshow:false,
		LIMITTIMEFALSE_CLS: false,
		tque:"",
		aid:"",
		isJump:false,
        qriu:'',
        isask:false,
        ruleContent:'',
		$btnFunny: $('.funny-box img'),
		currTime: new Date().getTime(),
		headMix: Math.ceil(8*Math.random()),
		wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true

		init: function() {
			if (!openid) {
				return false;
			}
			H.utils.resize();
			getResult('api/question/round', {yoi: openid}, 'callbackQuestionRoundHandler', true, null, true);
            getResult('api/comments/topic/round', {}, 'callbackCommentsTopicInfo',true);
            getResult('api/common/rule', {}, 'commonApiRuleHandler',true);
            //getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
            //setInterval(function(){
            //	 H.answer.account_num();
            //},5000);
            //getResult('api/user/info_v2',{
				//matk : matk
            //}, 'callbackUserInfoHandler', true, null);
			this.event();
			H.answer.wxConfig();
			//H.comment.init();
			//this.updatepv();
            getResult('api/article/list', {}, 'callbackArticledetailListHandler');
            $.ajax({
                type:"GET",
                url:domain_url+"api/common/promotion"+dev,
                dataType:"jsonp",
                jsonp: "callback",
                jsonpCallback:"commonApiPromotionHandler",
                data:{
                    oi: openid
                },
                success: function (data) {
                    if(data.code == 0){
                        var jumpUrl = data.url;
                        $(".linkout").removeClass("none").css({"-webkit-animation":"picshake 3s infinite","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("click", function () {
                            shownewLoading();
                            setTimeout(function () {
                                window.location.href = jumpUrl;
                            },500);
                        });
                    }else{
                        $(".linkout").addClass("none");
                    }
                },
                error: function () {
                    //alert("请求数据失败，请刷新页面");
                }
            });
		},
        event: function () {
            $(".btn-rank").on("click", function (e) {
                var me = this;
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    H.dialog.rank.open();
                    setTimeout(function(){
                        $(me).removeClass('requesting');
                    }, 500);
                }
            })
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
        fillContent: function(data,r) {
            var me = this, t = simpleTpl(),
                qitems = data.qitems || [],
                ritems = r.items || [],
                length = qitems.length;
            me.currTime = timeTransform(data.cut);
            me.actUuid = data.tid;
            for (var i = 0; i < length; i ++) {
                var qcode = 0;
                var ruid = 123;
                if(ritems.length == 0){
                    qcode = 0;
                    ruid = 123;
                }else {
                    for(var a = 0; a < ritems.length; a ++){
                        if(ritems[a].quid == qitems[i].quid){
                            if (ritems[a].rs) {
                                // qcode 1-错 2-对 0-未答题
                                qcode = ritems[a].rs;
                            } else {
                                qcode = 0;
                            };
                            if (ritems[a].anws) {
                                ruid = ritems[a].anws;
                            } else {
                                ruid = 0;
                            };
                        }
                    }
                }
                t._('<li data-qcode="'+ qcode +'" data-ruid="'+ ruid +'" data-stime="'+ timestamp(qitems[i].qst) +'" data-etime="'+ timestamp(qitems[i].qet) +'" id="question-'+ qitems[i].quid +'" data-quid="'+ qitems[i].quid +'" data-qriu="' + qitems[i].qriu + '">')
                    ._('<p>'+ qitems[i].qt +'</p>')
                    ._('<img src="images/que-book.png" />')
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
            $thisQ.find('.dorB').find('span').each(function() {
                if($(this).attr('data-auid') == $thisQ.attr('data-qriu')){
                    $thisQ.find('.dorB span').removeClass().addClass('wrong answered');
                    $(this).removeClass().addClass('right');
                }
            });
            if (data.rs === 2) {
                H.dialog.win.open();
                me.TIMETRUE_CLS = true;
            } else if (data.rs === 1) {
                showTips("答错了");
                //H.dialog.funny.open();
                me.TIMETRUE_CLS = true;
                if (me.LIMITTIMEFALSE_CLS) {
                    me.TIMETRUE_CLS = true;
                    me.LIMITTIMEFALSE_CLS = true;
                } else {
                    setTimeout(function() {
                        me.TIMETRUE_CLS = true;
                        me.LIMITTIMEFALSE_CLS = true;
                    }, answer_delaytimer);
                }
            }
            if ($thisQ) {
                $thisQ.attr('data-qcode', data.rs);
            }
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
                    showTips('这道题您已经答过了!');
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
                if($me.find('.dorA').find('a').length>2){
                    $me.find('.dorA').find('a').css("max-width","31%");
                    $me.find('.dorB').find('span').css("max-width","31%");
                }else{
                    $me.find('.dorA').find('a').css("max-width","48%");
                    $me.find('.dorB').find('span').css("max-width","48%");
                }
                $me.progress({
                    cTime: data,
                    stpl : '<p>距离下次答题还有</p><span>%H%</span><span>:</span><span>%M%</span><span>:</span><span>%S%</span>',
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
                            //if (itemLength == $starting.length) {
                            if ($started.length == 0 && $starting.length > 0 && me.$question.find('li.' + me.STARTED_CLS).length == 0) {
                                $('.answer-box .item').addClass('none');
                                $('.answer-box .wait').removeClass('none');
                                $('.answer-box .wait h1').text('不要走开~答题马上开始');
                            } else {
                                if (!$('.answer-box').hasClass('over')) {
                                    $('.answer-box .item').removeClass('none');
                                    $('.answer-box .wait').addClass('none');
                                }
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
                                        $prev.find('.dorA').addClass('none');
                                        $prev.find('.dorB').removeClass('none').find('span').each(function() {
                                            if($(this).attr('data-auid') == $prev.attr('data-qriu')){
                                                $prev.find('.dorB span').removeClass().addClass('wrong');
                                                $(this).removeClass().addClass('right');
                                            }
                                        });
                                    } else if ($prev && parseInt($prev.attr('data-qcode')) === 2) {
                                        $prev.find('.dorA').addClass('none');
                                        $prev.find('.dorB').removeClass('none').find('span').each(function() {
                                            if($(this).attr('data-auid') == $prev.attr('data-qriu')){
                                                $prev.find('.dorB span').removeClass().addClass('wrong');
                                                $(this).removeClass().addClass('right');
                                            }
                                        });
                                    };
                                    me.$timebox.removeClass('none').html($starting.eq(0).attr('data-timestr'));
                                } else if ($me.next('li').length == 0) {
                                    $('.answer-box').addClass('over');
                                    clearInterval(window.progressTimeInterval);
                                    me.loadError('本期答题已结束，请等待下期!');
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
				async : false,
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
                url : domain_url + "api/comments/room?temp=" + new Date().getTime()+dev,
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
        $input_text: $('#input_text'),
        resize: function() {
			var width = $(window).width();
			var height = $(window).height();
			this.$header.css('height', Math.round(height * 0.38));
			this.$wrapper.css('height', Math.round(height * 0.62));
			this.$comments.css('height', Math.round(height * 0.62 - 70));
            this.$input_text.css({"width": (width - 115) + "px"});
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
		H.answer.fillContent(H.answer.QUEdata,data);
	};
	W.callbackQuestionAnswerHandler = function(data) {
		if (data.code == 0) {
			H.answer.fillAnswer(data);
			return;
		}
		showTips(data.message);
	};
	//W.callbackUserInfoHandler = function(data){
	//	//alert(data.hi);
	//	if(data.result == true){
	//		//alert(data.hi);
	//		$(".handimg").attr("src",data.hi+ '/' + yao_avatar_size);
	//	}else if(data.result == false){
	//		$(".handimg").attr("src","images/head.jpg");
	//	}else{
    //
	//	}
	//};
	W.callbackCountServicePvHander = function(data) {
		if (data.code == 0) {
			H.answer.$total.html("目前人数："+data.c);
		}
	};
	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			$(".outer").attr("href",data.url).html(data.desc).removeClass("none");
		}else{
			$(".outer").addClass("none");
		}
	};
    W.commonApiRuleHandler = function(data) {
        if(data.code == 0){
            H.answer.ruleContent = data.rule;
            //$("#rule-content").html(data.rule);
        }
        hidenewLoading();
    };
	W.callbackCommentsTopicInfo = function(data){
		if(data.code == 0){
            $(".topic").html('边看边聊:'+data.items[0].t);
            $("#input_text").attr('placeholder',data.items[0].t);
		}else{
		}
	};

    W.callbackArticledetailListHandler = function(data){
        if(data == undefined){

        }else{
            if(data.code == 0){
                hidenewLoading();
                $("body").append('<img class="round-bg" src="' + (data.arts[0].img).toString() + '"/>');
                //H.index.isgetpic = true;
            }else if(data.code == 1){
                //if(H.answer.isask == false){
                //    getResult('api/article/list', {}, 'callbackArticledetailListHandler');
                //    H.answer.isask = true;
                //}else{
                //    hidenewLoading();
                //    $("body").append('<img class="round-bg" src="' + (data.arts[0].img).toString() + '"/>');
                //}
            }
        }
    };

})(Zepto);

(function($) {
    H.lottery = {
        dec: 0,
        sau: 0,
        type: 2,
        index: 0,
        times: 1,
        endType: 1,
        pal: null,
        pageType:0,
        nowTime: null,
        pingFlag: null,
        roundData: null,
        nextPrizeAct: null,
        canJump: true,
        wxCheck: false,
        isError: false,
        safeFlag: false,
        lastRound: false,
        isToLottey: true,
        isCanShake: false,
        isTimeOver: false,
        repeat_load: true,
        recordFirstload: true,
        sponsorDetailFlag: false,
        isOnListen:false,
        lotteryImgList: [],
        lotteryTime: 1,
        exp:null,
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        init: function() {
            //this.event();
            //this.resize();
            //this.getUserinfo_port();
            //this.getSau_port();
            this.lotteryRound_port();
            this.globalVal();
            this.wxConfig();
            //this.shake();
        },
        resize: function() {
            var me = this, winW = $(window).width(), winH = $(window).height();
            if(!is_android()){
                $(".main-top").css("height", (winH / 2) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2) + "px").css('bottom', '0');
            } else {
                $(".main-top").css("height", (winH / 2 + 0.5) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2 + 0.5) + "px").css('bottom', '0');
            }
        },
        event: function() {
            var me = this;
            $('body').delegate('#test', 'click', function(e) {
                e.preventDefault();
                me.wxCheck = true;
                me.lotteryTime = 1;
                me.shake_listener();
            });
            $('.btn-info').click(function(e){
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('info.html');
                }
            });
            $('#totalk').click(function(e) {
                e.preventDefault();
                $('#totalk').css({"-webkit-animation":"drop 1s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("webkitAnimationEnd", function () {
                    $('#totalk').css({"-webkit-animation":""});
                });
                toUrl("talk.html");
            });
            $('.btn-back').click(function(e){
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    shownewLoading(null, '请稍后...');
                    //window.history.go(-1);
                    toUrl('talk.html');
                }
            });
            $('.btn-rule').click(function(e){
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    H.dialog.rule.open();
                }
            });
        },
        getSau_port: function() {
            getResult("api/linesdiy/info", {}, "callbackLinesDiyInfoHandler");
        },
        getUserinfo_port: function() {
            getResult("api/user/info_v2", {matk: matk}, "callbackUserInfoHandler");
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        ping: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/common/time' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'commonApiTimeHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.t){
                        me.safeLotteryMode('off');
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        globalVal: function () {
            var exp = new Date();
            exp.setTime(exp.getTime() + 5*60*1000);
            this.exp = exp;
            if($.fn.cookie(openid + 'canJump') == null) {
                $.fn.cookie(openid + 'canJump', true, {expires: exp});
            }
        },
        checkPing: function() {
            var me = this, delay = Math.ceil(60000*2*Math.random() + 60000*1);
            me.pingFlag = setTimeout(function(){
                clearTimeout(me.pingFlag);
                me.ping();
                me.checkPing();
            }, delay);
        },
        lotteryRound_port: function() {
            var me = this;
            shownewLoading();
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryRoundHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.result == true){
                        me.nowTime = timeTransform(data.sctm);
                        var nowTimeStemp = new Date().getTime();
                        me.dec = nowTimeStemp - data.sctm;
                        me.roundData = data;
                        me.currentPrizeAct(data);
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.lotteryRound_port();
                            },500);
                        }else{
                            me.change();
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                    me.safeLotteryMode('on');
                }
            });
        },
        safeLotteryMode: function(flag) {
            var me = this;
            if (flag == 'on') {
                me.checkPing();
                $('.countdown, .icon-lotterytip').addClass('none');
                me.safeFlag = true;
            } else if (flag == 'off') {
                clearTimeout(me.pingFlag);
                me.pingFlag = null;
                me.lotteryRound_port();
                $('.countdown, .icon-lotterytip').removeClass('none');
                me.safeFlag = false;
            } else {
                me.safeLotteryMode('off');
            };
            hidenewLoading();
        },
        shake_listener: function() {
            if (!H.lottery.safeFlag) {
                if(H.lottery.sponsorDetailFlag) {
                    return;
                }
                if(H.lottery.isCanShake){
                    H.lottery.isCanShake = false;
                    H.lottery.canJump = false;
                }else{
                    return;
                }
                if (H.lottery.type != 2) {
                    return;
                }
                //H.lottery.times++;
                if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                    H.lottery.isToLottey = false;
                }
            }
            //if(!$(".icon-lottery-wheel").hasClass("shake")) {
            //    $(".icon-lottery-wheel").addClass("shake");
            //    $("#audio-a").get(0).play();
            //}
            recordUserOperate(openid, "摇奖", "shakeLottery");
            if(!openid || openid=='null' || H.lottery.isToLottey == false || H.lottery.safeFlag == true) {
                setTimeout(function(){
                    H.lottery.fill(null);//摇一摇
                }, 1800);
            } else {
                //if(!H.lottery.wxCheck) {
                //    //微信config失败
                //    setTimeout(function(){
                //        H.lottery.fill(null);//摇一摇
                //    }, 1800);
                //    return;
                //}
                H.lottery.drawlottery();
            }
            H.lottery.isToLottey = true;
        },
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        account_num: function(){
            getResult('api/common/servicedaypv', {}, 'commonApiSDPVHander');
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this, nowTimeStr = this.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [], day = nowTimeStr.split(" ")[0];
            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.endType = 3;
                    me.change();
                    return;
                }
                //config微信jssdk
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        if(i < prizeActList.length - 1){
                            var nextBeginTimeStr = prizeActList[i + 1].pd + " " + prizeActList[i + 1].st;
                            if(comptime(endTimeStr, nextBeginTimeStr) <= 0){
                                me.endType = 2;
                                // 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
                                me.lastRound = false;
                                me.nextPrizeAct = prizeActList[i+1];
                            } else {
                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                me.endType = 1;
                            }
                        }else{
                            // 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
                            me.endType = 3;
                            me.lastRound = true;
                        }
                        me.nowCountdown(prizeActList[i]);
                        $.fn.cookie('jumpNum', 0, {expires: -1});
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        me.beforeCountdown(prizeActList[i]);
                        return;
                    }
                }
            }else{
                me.safeLotteryMode('on');
                return;
            }
        },
        drawlottery: function() {
            shownewLoading();
            var me = this, sn = new Date().getTime()+'';
            //me.lotteryTime = getRandomArbitrary(1,3);
            me.lotteryTime = 1;
            me.times = 0;
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/exec/luck4Vote' + dev,
                data: { matk: matk , sn: sn, sau: me.sau},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryLuck4VoteHandler',
                timeout: 10000,
                complete: function() {
                    hidenewLoading();
                },
                success: function(data) {
                    if(data.flow && data.flow == 1){
                        me.lotteryTime = getRandomArbitrary(6, 10);
                        me.times = 0;
                        sn = new Date().getTime()+'';
                        me.lottery_point(null);
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            sn = new Date().getTime()+'';
                            me.lottery_point(data);
                        }
                    }else{
                        sn = new Date().getTime()+'';
                        me.lottery_point(null);
                    }
                },
                error: function() {
                    sn = new Date().getTime()+'';
                    me.lottery_point(null);
                }
            });
            recordUserOperate(openid, "调用抽奖接口", "doLottery");
            recordUserPage(openid, "调用抽奖接口", 0);
        },
        fill: function(data) {
            //this.imgMath();
            //setTimeout(function() {
            //    $(".yao-bg").removeClass("yao");
            //}, 300);
            //$(".icon-lottery-wheel").removeClass("shake");
            if(data == null || data.result == false || data.pt == 0){
                //$("#audio-a").get(0).pause();
                H.lottery.thanks();
                return;
            }else{
                //$("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();    //中奖声音
            }
            H.dialog.openLuck.open(data);
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.count_down();
            $('.countdown').removeClass('none');
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            $.fn.cookie(openid + 'canJump', true, {expires: me.exp});
            H.lottery.isOnListen = true;
            $(".btn-tolottery").css({"background":'url("images/talk-tolottery.png") no-repeat',"background-size":'100% 100%',"-webkit-animation":""}).off();
            //me.downloadImg();
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.count_down();
            $('.countdown').removeClass('none');
            me.index++;
            me.canJump = true;
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            $(".btn-tolottery").css({"background":'url("images/talk-tolottery-start.png") no-repeat',"background-size":'100% 100%',"-webkit-animation":"picshake 3s infinite","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("click", function () {
                toUrl("lottery.html");
            });
            if($.fn.cookie(openid + 'canJump') == "true"){
                $.fn.cookie(openid + 'canJump', false, {expires: me.exp});
                toUrl('lottery.html');
            }
            //me.downloadImg();
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '', // 还有...结束
                    stpl: '', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.canJump){
                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                                if(!me.isTimeOver){
                                    me.isTimeOver = true;
                                    $('.countdown-tip').html('请稍后');
                                    shownewLoading(null,'请稍后...');
                                    setTimeout(function() {
                                        me.nowCountdown(me.pal[me.index]);
                                    }, 1000);
                                }
                            }else if(me.type == 2){
                                //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                                if(!me.isTimeOver){
                                    me.isTimeOver = true;
                                    if(me.index >= me.pal.length){
                                        me.change();
                                        me.type = 3;
                                        return;
                                    }
                                    $('.countdown-tip').html('请稍后');
                                    shownewLoading(null,'请稍后...');
                                    var i = me.index - 1;
                                    if(i < me.pal.length - 1){
                                        var endTimeStr = me.pal[i].pd + " " + me.pal[i].et;
                                        var nextBeginTimeStr = me.pal[i + 1].pd + " " + me.pal[i + 1].st;
                                        if(comptime(endTimeStr,nextBeginTimeStr) <= 0){
                                            // 有下一轮并且下一轮的开始时间和本轮的结束时间重合
                                            me.endType = 2;
                                        } else {
                                            // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                            me.endType = 1;
                                        }
                                    }
                                    setTimeout(function(){
                                        if(me.endType == 2){
                                            me.nowCountdown(me.pal[me.index]);
                                        }else if(me.endType == 1){
                                            me.beforeCountdown(me.pal[me.index]);
                                        } else {
                                            me.change();
                                        }
                                    },1000);
                                }
                            }else{
                                me.isCanShake = false;
                            }
                        }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        wxConfig: function() {
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'mp/jsapiticket' + dev,
                data: {appId: shaketv_appid},
                dataType: "jsonp",
                jsonpCallback: 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                },
                success: function(data) {
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
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        thanks: function() {
            var me = this;
            me.canJump = true;
            if (typeof(thanks_tips) == 'undefined' || thanks_tips.length == 0) {
                var tips = '姿势摆的好，就能中大奖';
            } else {
                var tips = thanks_tips[getRandomArbitrary(0, thanks_tips.length)]
            }
            $('.thanks-tips').html(tips).addClass('show');
            setTimeout(function(){
                $('.thanks-tips').removeClass('show');
                setTimeout(function(){
                    $('.thanks-tips').empty();
                    me.isCanShake = true;
                }, 300);
            }, 1000);
        },
        lottery_point: function(data) {
            var me = this;
            setTimeout(function() {me.fill(data);}, 1800);
        },
        change: function() {
            var me = this;
            this.isCanShake = false;
            $.fn.cookie(openid + 'canJump', true, {expires: me.exp});
            $(".btn-tolottery").css({"background":'url("images/talk-tolottery.png") no-repeat',"background-size":'100% 100%',"-webkit-animation":""}).off();
            hidenewLoading();
        }
    };


    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            H.lottery.sau = data.tid;
        }
    };

})(Zepto);

$(function() {
	H.answer.init();
	H.lottery.init();
	var me = H.answer;
	wx.ready(function () {
		wx.checkJsApi({
			jsApiList: [
				'addCard'
			],
			success: function (res) {
				var t = res.checkResult.addCard;
				//判断checkJsApi 是否成功 以及 wx.config是否error
				if(t && !me.isError){
					me.wxCheck = true;
				}
			}
		});
		//wx.config成功
	});

	wx.error(function(res){
		me.isError = true;
		//wx.config失败，重新执行一遍wx.config操作
		//H.record.wxConfig();
	});
});
