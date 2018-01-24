(function($) {
		H.answer = {
			tid: '',
			$article: $('#article'),
			$inputCmt: $('#input-comment'),
			$btnCmt: $('#btn-comment'),
			$total: $('.count'),
			$btnFunny: $('.funny-box img'),
			$back_btn:$('.barrage-back-btn'),
			REQUEST_CLS: 'requesting',

			init: function() {
				if (!openid) {
					return false;
				};
				// getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
				H.utils.resize();
				this.event();
				this.account_num();
				H.comment.init();
			},
			updatepv: function() {
				getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
				setInterval(function() {
					getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
				}, 5000);
			},
			account_num: function() {
				getResult('log/serpv ', {}, 'callbackCountServicePvHander');
			},
			event: function() {
				var me = this;
				this.$back_btn.click(function(e) {
					e.preventDefault();
					toUrl("vote.html");
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
						setTimeout(function()
						{
							me.$inputCmt.removeClass('error');
						},2000)
						return;
					} else if (len > 20) {
						showTips('观点字数超出了20字');
						me.$inputCmt.removeClass('error').addClass('error');
						setTimeout(function()
						{
							me.$inputCmt.removeClass('error');
						},2000)
						return;
					}

					$(this).addClass(me.REQUEST_CLS);

					shownewLoading(null, '发射中...');
					$.ajax({
						type: 'GET',
						async: false,
						url: domain_url + 'api/comments/save' + dev,
						data: {
							co: encodeURIComponent(comment),
							op: openid,
							tid: me.tid,
							ty: 1,
							nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							headimgurl: headimgurl ? headimgurl : ""
						},
						dataType: "jsonp",
						jsonpCallback: 'callbackCommentsSave',
						complete: function() {
							hidenewLoading();
						},
						success: function(data) {
							me.$btnCmt.removeClass(me.REQUEST_CLS);
							if (data.code == 0) {
								showTips('发射成功', null, 800);
								var h = headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
								barrage.appendMsg('<div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div>' + comment);
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
					if (H.answer.sendFunnyTime != null && time - H.answer.sendFunnyTime < sendTime) {
						showTips('点的太快啦~ 休息下吧!');
						return;
					} else {
						H.answer.sendFunnyTime = time;
						$('.funny-box img').css('-webkit-filter', 'grayscale(100%)');
						setTimeout(function() {
							$('.funny-box img').css('-webkit-filter', 'grayscale(0%)');
						}, sendTime);
					}
					$(this).addClass(me.REQUEST_CLS);
					var funny = $(this).attr('data-item') || '/:funny1';
					shownewLoading(null, '发射中...');
					$.ajax({
						type: 'GET',
						async: false,
						url: domain_url + 'api/comments/save'+dev,
						data: {
							co: encodeURIComponent(funny),
							op: openid,
							tid: me.tid,
							ty: 1,
							nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							headimgurl: headimgurl ? $.fn.cookie(mpappid + '_headimgurl') : ""
						},
						dataType: "jsonp",
						jsonpCallback: 'callbackCommentsSave',
						complete: function() {
							hidenewLoading();
						},
						success: function(data) {
							me.$btnFunny.removeClass(me.REQUEST_CLS);
							if (data.code == 0) {
								showTips('发射成功', null, 800);
								var nfunny = funny.replace('/:', '');
								var h = headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
								barrage.appendMsg('<div class="c_head_img menow" style="border:none"><img class="c_head_img_img" src="' + h + '" /></div>' + '<img class="funnyimg" src="./images/head/' + nfunny + '.png" border="0" />');
								$('.menow').parent('div').addClass('me').css({
									'height': '41px'
								});
								me.$inputCmt.removeClass('error').val('');
								return;
							}
						}
					});
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
		   var h = headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
		   $(".user-headimg").css("background-image","url("+h+")");
		},
		flash: function() {
			var me = this;
			$.ajax({
				type: 'GET',
				async: true,
				url: domain_url + "api/comments/room?temp=" + new Date().getTime() + dev,
				data: {
					ps: me.pageSize,
					maxid: me.maxid
				},
				dataType: "jsonp",
				jsonpCallback: 'callbackCommentsRoom',
				success: function(data) {
					if (data.code == 0) {
						me.maxid = data.maxid;
						var items = data.items || [],
							umoReg = '/:';
						for (var i = 0, len = items.length; i < len; i++) {
							if ((items[i].co).indexOf(umoReg) >= 0) {
								var funny = items[i].co;
								var nfunny = funny.replace('/:', '');
								barrage.appendMsg('<div class="c_head_img"><img src="' + (items[i].hu ? (items[i].hu + "/" + yao_avatar_size) : "./images/danmu-head.jpg") + '" /></div>' + '<img class="funnyimg" src="./images/head/' + nfunny + '.png" border="0" />');
							} else {
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
			var winW = $(window).width();
			this.$header.css('height', Math.round(winW * 0.3));
			this.$wrapper.css('height', Math.round(height - (winW * 0.3)));
			this.$comments.css('height', Math.round(height - (winW * 0.3) - 150));
			$('body').css('height', height);
		}
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
			H.answer.$total.html("当前参与人数：" + data.c);
		}
	}; W.commonApiPromotionHandler = function(data) {
		var me = H.answer;
		if (data.code == 0) {
			if (data.url && data.desc) {
				$(".outer").text(data.desc).attr('href', data.url).removeClass('none');
			}
		}
	};

})(Zepto);

$(function() {
	H.answer.init();
});