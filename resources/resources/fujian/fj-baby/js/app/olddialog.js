(function($) {
	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		clickFlag: true,
		successFlag: true,
		iscard: false,
		PV: "",
		ci: "",
		ts: "",
		si: "",
		ismark: false,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function(e) {
				//e.preventDefault();
				//H.dialog.rule.open();
			}).delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				var me = $(this);
			}).delegate('.btn-result', 'click', function(e) {
				e.preventDefault();
				H.dialog.result.open();
			}).delegate('.btn-comeon', 'click', function(e) {
				e.preventDefault();
				H.dialog.guide.open();
			});

		},
		close: function() {
			$('.modal').addClass('none');
		},
		open: function() {
			H.dialog.close();
			if (this.$dialog) {
				this.$dialog.removeClass('none');
			} else {
				this.$dialog = $(this.tpl());
				H.dialog.$container.append(this.$dialog);
			}

			H.dialog.relocate();
		},

		relocate: function() {
			var height = $(window).height(),
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.06;

			$('.dialog').each(function() {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({
					'width': width * 0.88,
					'height': height * 0.88,
					'left': width * 0.06,
					'right': width * 0.06,
					'top': height * 0.06,
					'bottom': height * 0.06
				});
				$(".rule-dialog").css({
					'width': width,
					'height': height * 0.80,
					'left': 0,
					'right': 0,
					'top': height * 0.10,
					'bottom': height * 0.15
				});
				$(".rank-dialog").css({
					'width': width,
					'height': height * 0.77,
					'left': 0,
					'right': 0,
					'top': height * 0.10,
					'bottom': height * 0.06
				});
				var $box = $(this).find('.box');
				if ($box.length > 0) {
					$box.css('height', height * 0.38);
				}
			});
		},

		//引导
		guide: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();

				var me = this;
				setTimeout(function() {
					me.close();
				}, 10000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-try').click(function(e) {
					e.preventDefault();
					$(this).removeClass("pop-zoom").addClass("pop-zoom");
					me.$dialog && me.$dialog.find(".relocated").addClass("guide-top-ease");
					setTimeout(function() {
						me.close();
					}, 500);
				});
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog relocated">')
					._('<div class="guide-title"></div>')
					._('<div class="guide-content"><p><i>1</i>打开电视，锁定青海卫视</p>')
					._('<p><i>2</i>打开微信，进入摇一摇(电视)</p>')
					._('<p><i>3</i>对着电视摇一摇</p>')
					._('<p><i>4</i>参与互动就有机会赢取超值礼品</p>')
					._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="guide-trybtn" data-collect-desc="引导弹层-关闭按钮"></a></div>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},

		// 规则
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				//this.event();
				//$(".rule-dialog").addClass("pop-zoom");
				$('body').addClass('noscroll');
				if (H.dialog.ismark == false) {
					getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
				}
			},
			close: function() {
				$('body').removeClass('noscroll');
				$('.pop-zoom').removeClass('pop-zoom');
				$('.pop-opacity').removeClass('pop-opacity');
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function(rule) {
				this.$dialog.find('.rule').html(rule).removeClass('none');
				H.dialog.ismark = true;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._('<div class="content border">')
					._('<h2></h2>')
					._('<div class="rule none"></div>')
					._('</div>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
		// 积分排行榜
		btn_animate: function(str) {
			str.addClass('flipInY');
			setTimeout(function() {
				str.removeClass('flipInY');
			}, 200);
		},
		lottery: {
			$dialog: null,
			AWARDED_CLS: 'lottery-awarded',
			redpack: '',
			isSbtRed: false,
			ci: null,
			ts: null,
			si: null,
			pt: null,
			url: null,
			sto: null,
			open: function(data) {
				H.yao.canJump = false;
				H.yao.isCanShake = false;
				var me = this,
					$dialog = this.$dialog;
				H.dialog.open.call(this);
				this.pre_dom(data);
				this.$dialog.find('.dialog').addClass('bounceInDown');
				setTimeout(function() {
					me.$dialog.find('.dialog').removeClass('bounceInDown');
				}, 1000);
				this.update(data);
				if (!$dialog) {
					this.event();
				}
			},
			pre_dom: function(data) {
				var width = $(window).width(),
					height = $(window).height();
				$(".modal").css({
					'width': width,
					'height': height,
				});
				if (data.pt == 1) {
					$(".dialog").css({
						'width': width * 0.80,
						'height': height * 0.70,
						'left': width * 0.1,
						'top': height * 0.16
					});
				} else if (data.pt == 9) {
					$(".dialog").css({
						'width': width * 0.80,
						'height': height * 0.52,
						'left': width * 0.1,
						'top': height * 0.16
					});
				} else if (data.pt == 7) {
					$(".dialog").css({
						'width': width * 0.80,
						'height': height * 0.52,
						'left': width * 0.1,
						'top': height * 0.16
					});
				} else if (data.pt == 5) {
					$(".dialog").css({
						'width': width * 0.80,
						'height': height * 0.52,
						'left': width * 0.1,
						'top': height * 0.16
					});
				}
			},
			card_fail: function() {
				shownewLoading();
				H.dialog.lottery.sto = setTimeout(function() {
					H.yao.isCanShake = true;
					hidenewLoading();
				}, 15000);
			},
			close: function() {
				var me = this;
				this.$dialog.find('.dialog').addClass('bounceOutUp');
				setTimeout(function() {
					H.yao.isCanShake = true;
					H.yao.canJump = true;
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-lq').click(function(e) {
					e.preventDefault();
					if (me.isSbtRed) {
						return;
					}
					me.isSbtRed = true;
					toUrl(me.redpack);
				});
				$('.btn-qd').click(function(e) {
					e.preventDefault();
					H.dialog.btn_animate($(this));
					me.close();
				});
				$('.btn-close,.btn-ok').click(function(e) {
					e.preventDefault();
					H.dialog.btn_animate($(this));
					me.close();
				});
				this.$dialog.find('.btn-award').click(function(e) {
					e.preventDefault();
					H.dialog.btn_animate($(this));
					H.yao.isCanShake = false;
					if (me.pt == 7) {
						me.card_fail();
						//H.yao.wxCheck = false;
						setTimeout(function() {
							me.wx_card();
						}, 1000);
					} else if (me.pt == 9) {
						getResult('api/lottery/award', {
							oi: openid,
							hi: headimgurl,
							nn: nickname
						}, 'callbackLotteryAwardHandler',true);
						setTimeout(function () {
							window.location.href = me.url;
						},1000);
						//window.location.href = me.url;
					} else if (me.pt == 1) {
						if (!me.check()) {
							return false;
						}
						var mobile = $.trim(me.$dialog.find('.mobile').val()),
							name = $.trim(me.$dialog.find('.name').val()),
							address = $.trim(me.$dialog.find('.address').val());
						getResult('api/lottery/award', {
							oi: openid,
							rn: encodeURIComponent(name),
							ph: mobile,
							ad: encodeURIComponent(address)
						}, 'callbackLotteryAwardHandler', true, me.$dialog);
						H.dialog.lottery.succ();
					} else if (me.pt == 5) {
						getResult('api/lottery/award', {
							oi: openid
						}, 'callbackLotteryAwardHandler', true, me.$dialog);
						me.close();
					}

				});
			},

			wx_card: function() {
				var me = this;
				//卡券
				wx.addCard({
					cardList: [{
						cardId: H.dialog.lottery.ci,
						cardExt: "{\"timestamp\":\"" + H.dialog.lottery.ts + "\",\"signature\":\"" + H.dialog.lottery.si + "\"}"
					}],
					success: function(res) {
						//H.yao.wxCheck = true;
						getResult('api/lottery/award', {
							oi: openid,
							hi: headimgurl,
							nn: nickname
						}, 'callbackLotteryAwardHandler',true);
					},
					fail: function(res) {
						recordUserOperate(openid, res.errMsg, "card-fail");
						H.yao.isCanShake = true;
						H.dialog.lottery.close();
						hidenewLoading();
					},
					complete: function() {
						me.sto && clearTimeout(me.sto);
						H.yao.isCanShake = true;
						H.dialog.lottery.close();
						hidenewLoading();
					},
					cancel: function() {
						H.yao.isCanShake = true;
						H.dialog.lottery.close();
						hidenewLoading();
					}
				});
			},
			update: function(data) {
				var me = this;
				me.pt = data.pt;
				if (data) {
					if (data.result) {
						//pt : (0:谢谢参与
						// 1:实物奖品
						// 9:外链领取奖品
						// 5:兑奖码
						$('img.pi').attr('src', (data.pi || '')).attr("onerror", "$(this).addClass(\'none\')");
						this.$dialog.find('h2.tt').text(data.tt || '');

						if (data.pt == 1) {
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.find('.address').val(data.ad || '');
							this.$dialog.find('.award-win').removeClass('none');
							return;
						} else if (data.pt == 9) {
							me.url = data.ru;
							this.$dialog.find('.award-card').removeClass('none');
							return;
						} else if (data.pt == 7) {
							me.ci = data.ci;
							me.ts = data.ts;
							me.si = data.si;
							this.$dialog.find('.award-card').removeClass('none');
							return;
						} else if (data.pt == 5) {
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('#contact-before').addClass('none');
							this.$dialog.find('.award-code').removeClass('none');
							$(".ma").text("兑换码：" + data.cc);
						};
					}
				}
			},

			check: function() {
				var me = this,
					$mobile = me.$dialog.find('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = me.$dialog.find('.name'),
					name = $.trim($name.val()),
					$address = me.$dialog.find('.address'),
					address = $.trim($address.val());

				if (((me.name && me.name == name) && me.mobile && me.mobile == phone) && (me.address && me.address == address)) {
					return;
				}

				if (name.length < 2 || name.length > 30) {
					showTips('姓名长度为2~30个字符');
					$name.focus();
					return false;
				} else if (!/^\d{11}$/.test(mobile)) {
					showTips('这手机号，可打不通哦...');
					$mobile.focus();
					return false;
				}
				return true;
			},
			// 领奖成功
			succ: function() {
				this.$dialog.find('.mobile').attr('type', 'text');
				var rn = this.$dialog.find('.name').val(),
					ph = this.$dialog.find('.mobile').val(),
					ad = this.$dialog.find('.address').val();
				this.$dialog.find('#contact-after').removeClass('none');
				this.$dialog.find('#contact-before').addClass('none');
				this.$dialog.find('.name').text(rn);
				this.$dialog.find('.mobile').text(ph);
				this.$dialog.find('.address').text(ad);
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="fj-baby-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					._('<div class="dialog-inner">')
					._('<div class="content">')
					._('<div class="back">')
				._('<div class="award-win none">')
					._('<img class="pi-tips" src="./images/lottery-tips.png" />')
					._('<img class="pi" src="./images/default-load.png"  id="pi"/>')
					// ._('<h2 class="tt"></h2>')
					._('<div class="contact" id="contact-before">')
						._('<h4 class="award-tip">正确填写信息以便顺利领奖</h4>')
						._('<p><input type="text" class="name" placeholder="姓名" /></p>')
						._('<p><input type="tel" class="mobile" placeholder="手机号码" /></p>')
						._('<p><input type="text" class="address" maxlength="18" placeholder="地址" /></p>')
						._('<a href="#" class="btn btn-award" id = "btn-award" data-collect="true" data-collect-flag="fj-baby-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">领   取</a>')
					._('</div>')

					._('<div class="contact none" id="contact-after">')
						._('<p>姓名：<span class="name"></span></p>')
						._('<p>电话号码：<span class="mobile"></span></p>')
						._('<p>地址：<span class="address"></span></p>')
						._('<a href="#" class="btn btn-ok" id = "btn-award" data-collect="true" data-collect-flag="fj-baby-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">确   认</a>')
					._('</div>')

					._('<div class="award-code none">')
						._('<div class="lq">')
						._('<h4 class="ma"></h4>')
						._('<h4 style="margin-top:5%">请复制次兑换码，以便顺利兑奖</h4>')
						._('<p style="font-size:13px">(若你的手机不能复制，请牢记它)</p>')
						._('<a href="#" class="btn btn-ok" id = "btn-award" data-collect="true" data-collect-flag="fj-baby-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">确   认</a>')
						._('</div>')
					._('</div>')
				._('</div>')

				._('<div class="award-card none">')
					._('<img class="pi-tips" src="./images/lottery-tips.png" />')
					._('<img class="pi" src="./images/load-image.png" />')
					._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-know-btn" data-collect-desc="抽奖弹层-我知道了按钮">领 取</a>')
				._('</div>')

				._('</div>')
					._('</div>')
					._('</div>')
					._('</div>')
					._('</section>');

				return t.toString();
			}
		}
	};

	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};

	W.callbackLotteryAwardHandler = function(data) {
		if (data.result) {
			// H.dialog.lottery.succ();
			// H.yao.isCanShake = true;
			return;
		} else {
			showTips('亲，服务君繁忙！稍后再试哦！');
		}
	};

	W.callbackIntegralRankSelfRoundHandler = function(data) {
		if (data.result) {
			H.dialog.rank.selfupdate(data);
		};
	};

	W.callbackIntegralRankTop10RoundHandler = function(data) {
		if (data.result) {
			H.dialog.rank.update(data);
		};
	};
	//天天淘金的广告链接
	//W.commonApiPromotionHandler = function(data) {
	//	if (data.code == 0) {
	//		jumpUrl = data.url;
	//		Desc = (data.desc).toString();
	//		$(".outer").attr("href", jumpUrl).html(Desc).removeClass("none");
	//	} else {
	//		$(".outer").addClass("none");
	//	}
	//};
})(Zepto);

//查询主活动接口 
function fashionIndexNewHandler(data) {
	if (data.code == 0) {
		acttUID = data.tl[0].actUid;
		actTtle = data.tl[0].actTle;
	}
}

//需要取得的两条数据
var acttUID, actTtle = "";

$(function() {
	H.dialog.init();
});