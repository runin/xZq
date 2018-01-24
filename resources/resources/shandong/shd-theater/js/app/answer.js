
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
			getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
            //setInterval(function(){
            //	 H.answer.account_num();
            //},5000);
			this.event();
			H.answer.wxConfig();
			//H.comment.init();
			//this.updatepv();
			//$.ajax({
			//	type:"GET",
			//	url:domain_url+"api/common/promotion"+dev,
			//	dataType:"jsonp",
			//	jsonp: "callback",
			//	jsonpCallback:"commonApiPromotionHandler",
			//	data:{
			//		oi: openid
			//	},
			//	success: function (data) {
			//		if(data.code == 0){
			//			var jumpUrl = data.url;
			//			$(".linkout").attr("href",jumpUrl).removeClass("none").css({"-webkit-animation":"picshake 3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("webkitAnimationEnd", function () {
			//				$(".linkout").css("-webkit-animation","");
			//				setTimeout(function () {
			//					$(".linkout").css({"-webkit-animation":"picshake 3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"});
			//				},1000);
			//			});
			//		}else{
			//			$(".linkout").addClass("none");
			//		}
			//	},
			//	error: function () {
			//		//alert("请求数据失败，请刷新页面");
			//	}
			//});
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
		},
		event: function() {
			var me = this;
			$(".toyao").removeClass("none").one("click", function () {
				if(H.answer.isJump == false){
					H.answer.isJump = true;
					toUrl("yao.html");
				}
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
                    url : domain_url + 'api/comments/save?'+dev,
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
			H.answer.$total.html("目前人数："+data.c);
		}
	};
	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			jumpUrl = data.url;
			$(".outer").attr("href",jumpUrl).html(data.desc).removeClass("none");
		}else{
			$(".outer").addClass("none");
		}
	};

})(Zepto);

$(function() {
	H.answer.init();
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
