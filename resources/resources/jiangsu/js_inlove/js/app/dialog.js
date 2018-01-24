(function($) {
	H.dialog = {
		ci: null,
		ts: null,
		si: null,
		$container: $('body'),
		open: function() {
			var me = this;
			if (this.$dialog) {
				this.$dialog.removeClass('none');
			} else {
				this.$dialog = $(this.tpl());
				H.dialog.$container.append(this.$dialog);
			}
			$('.modal, .dialog').each(function() {
				$(this).css({
					'width': $(window).width(),
					'height': $(window).height(),
					'left': 0,
					'top': 0
				});
			});
			this.$dialog.animate({ 'opacity': '1' }, 500);
			this.$dialog.find('.dialog').addClass('bounceInDown');
			setTimeout(function() {
				me.$dialog.find('.dialog').removeClass('bounceInDown');
			}, 500);
			hideLoading();
		},
		btn_animate: function(str) {
			str.addClass('flipInY');
			setTimeout(function() {
				str.removeClass('flipInY');
			}, 150);
		},
		shiwuLottery: {
			$dialog: null,
			name: '',
			mobile: '',
			address: '',
			ru: '',
			isFocus: false,
			open: function(data) {
				H.lottery.isCanShake = false;
				H.lottery.canJump = false;
				H.dialog.open.call(this);
				this.event();
				this.update(data);
				this.checkFocus();
			},
			checkFocus: function() {
				var me = this;
				$("input").each(function() {
					$(this).focus(function() {
						me.isFocus = true;
					});
				});
			},
			close: function() {
				var me = this;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({ 'opacity': '0' }, 500);
				setTimeout(function() {
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 500);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-dialog-close').click(function(e) {
					e.preventDefault();
					H.dialog.btn_animate($(this));
					me.close();
					if (me.isFocus && !is_android() && $('body').attr("data-tip") == "lottery") {
						toUrl("lottery.html");
					}
				});
				this.$dialog.find('#btn-shiwuLottery-award').click(function(e) {
					e.preventDefault();
					H.dialog.btn_animate($(this));
					if (me.check()) {
						if (!$('#btn-shiwuLottery-award').hasClass("flag")) {
							$('#btn-shiwuLottery-award').addClass("flag");
							showLoading();
							getResult('api/lottery/award', {
								oi: openid,
								nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
								hi: headimgurl ? headimgurl : "",
								rn: me.name ? encodeURIComponent(me.name) : "",
								ph: me.mobile ? me.mobile : "",
								ad: me.address ? encodeURIComponent(me.address) : ""
							}, 'callbackLotteryAwardHandler');
							showLoading();
							setTimeout(function() {
								showTips("领取成功");
								me.close();
								if (me.isFocus && !is_android() && $('body').attr("data-tip") == "lottery") {
									toUrl("lottery.html");
								}
								hideLoading();
							}, 200);
						}
					}
				});
				this.$dialog.find('#btn-shiwuLottery-close').click(function(e) {
					e.preventDefault();
					H.dialog.btn_animate($(this));
					me.close();
					if (me.isFocus && !is_android() && $('body').attr("data-tip") == "lottery") {
						toUrl("lottery.html");
					}
				});
			},
			update: function(data) {
				var me = this;
				if (data.result) {
					$("#shiwu-dialog").find(".award-img").css("background-image", "url(" + data.pi + ")");
					$("#shiwu-dialog").find(".name").val(data.rn ? data.rn : '');
					$("#shiwu-dialog").find(".phone").val(data.ph ? data.ph : '');
					$("#shiwu-dialog").find(".address").val(data.ad ? data.ad : '');
					$("#shiwu-dialog").find(".before").removeClass('none');
					$("#shiwu-dialog").find(".after").addClass('none');
				}
			},
			check: function() {
				var me = this,
					name = $.trim($('.name').val()),
					mobile = $.trim($('.phone').val()),
					address = $.trim($('.address').val());
				if (name.length > 20 || name.length == 0) {
					showTips('请填写您的姓名，以便顺利领奖！');
					return false;
				} else if (!/^\d{11}$/.test(mobile)) {
					showTips('请填写正确手机号，以便顺利领奖！');
					return false;
				} else if (address.length < 8 || address.length > 80 || address.length == 0) {
					showTips('请填写您的详细地址，以便顺利领奖！');
					return false;
				}
				me.name = name;
				me.mobile = mobile;
				me.address = address;
				return true;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal modal-shiwu" id="shiwu-dialog">')
					._('<div class="dialog shiwu-dialog">')
						._('<div class="dialog-content">')
							._('<a href="javascript:;" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-close" data-collect-desc="弹层(实物)-关闭按钮"></a>')
							._('<h3></h3>')
							._('<div class="award-img"><div class="input-box">')
								._('<h5>请填写您的联系方式，以便顺利领奖</h5>')
								._('<input class="name" type="text" placeholder="姓名：">')
								._('<input class="phone" type="tel" placeholder="电话：">')
								._('<input class="address" type="text" placeholder="地址：">')
							._('</div>')
							._('<a href="javascript:;" class="btn-lottery btn-shiwu-lottery-award" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物)-领取按钮">立即领取</a>')
						._('</div></div>')
					._('</div>')

				._('</div>');
				return t.toString();
			}
		},
		linkLottery: {
			$dialog: null,
			ru: '',
			qc: '',
			open: function(data) {
				H.lottery.isCanShake = false;
				H.lottery.canJump = false;
				H.dialog.open.call(this);
				this.event(data.ruid);
				this.update(data);
			},
			close: function() {
				var me = this;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({ 'opacity': '0' }, 500);
				setTimeout(function() {
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 500);
			},
			event: function(SID) {
				var me = this;
				this.$dialog.find('.btn-dialog-close').click(function(e) {
					e.preventDefault();
					H.dialog.btn_animate($(this));
					me.close();
				});
				this.$dialog.find('#btn-linkLottery-use').click(function(e) {
					e.preventDefault();
					H.dialog.btn_animate($(this));
					if (me.ru.length == 0) {
						me.close();
						hideLoading();
					} else {
						showLoading();
						getResult('api/lottery/award', {
							oi: openid,
							nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							hi: headimgurl ? headimgurl : ""
						}, 'callbackLotteryAwardHandler');
						setTimeout(function() {
							location.href = me.ru;
						}, 500);
					}
				});
				this.$dialog.find('#btn-linkLottery-close').click(function(e) {
					e.preventDefault();
					H.dialog.btn_animate($(this));
					me.close();
				});
			},
			update: function(data) {
				var me = this,
					height = $(window).height();
				if (data.result) {
					me.ru = data.ru;
					me.qc = data.qc;
					if (data.ru.length == 0) {
						$('#btn-linkLottery-use').addClass('none');
					} else {
						$('#btn-linkLottery-use').removeClass('none');
					}
					$("#link-dialog").find(".award-img").css("background-image", "url(" + data.pi + ")");
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal modal-link" id="link-dialog">')
					._('<div class="dialog link-dialog">')
						._('<div class="dialog-content">')
							._('<a href="javascript:;" class="btn-dialog-close" id="btn-dialog-close"></a>')
							._('<h3></h3>')
							._('<div class="award-img"><a href="javascript:;" class="btn-lottery btn-link-use" id="btn-linkLottery-use" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-use" data-collect-desc="弹层(外链)-立即领取按钮">立即领取</a></div>')
						._('</div>')
					._('</div>')
				._('</div>');
				return t.toString();
			}
		},
		wxcardLottery: {
			$dialog: null,
			ci: null,
			ts: null,
			si: null,
			pt: null,
			sto: null,
			name: null,
			mobile: null,
			open: function(data) {
				var me = this,
					$dialog = this.$dialog;
				H.lottery.isCanShake = false;
				H.lottery.canJump = false;
				H.dialog.open.call(this);
				this.event();
				this.update(data);
				this.readyFunc();
			},
			close: function() {
				var me = this;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({ 'opacity': '0' }, 500);
				setTimeout(function() {
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 500);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-dialog-close').click(function(e) {
					e.preventDefault();
					H.dialog.btn_animate($(this));
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.close();
				});
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					H.dialog.btn_animate($(this));
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.close();
				});
			},
			readyFunc: function() {
				var me = this;
				$('#btn-wxcardLottery-award').click(function(e) {
					e.preventDefault();
					H.dialog.btn_animate($(this));
					H.lottery.isCanShake = false;
					if (!$('#btn-wxcardLottery-award').hasClass("flag")) {
						$('#btn-wxcardLottery-award').addClass("flag");
						showLoading();
						me.close();
						me.sto = setTimeout(function() {
							H.lottery.isCanShake = true;
							hideLoading();
						}, 5e3);
						setTimeout(function() {
							me.wx_card();
						}, 500);
					}
				});
			},
			wx_card: function() {
				var me = this;
				wx.addCard({
					cardList: [{
						cardId: me.ci,
						cardExt: "{\"timestamp\":\"" + me.ts + "\",\"signature\":\"" + me.si + "\"}"
					}],
					success: function(res) {
						alert('触发success');
						H.lottery.wxCheck = true;
						H.lottery.canJump = true;
						H.lottery.isCanShake = true;
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid,
							rn: me.name ? encodeURIComponent(me.name) : "",
							ph: me.mobile ? me.mobile : ""
						}, 'callbackLotteryAwardHandler');
					},
					fail: function(res) {
						alert('触发fail');
						H.lottery.isCanShake = true;
						H.lottery.canJump = true;
						hideLoading();
						recordUserOperate(openid, res.errMsg, "card-fail");
					},
					complete: function() {
						alert('触发complete');
						me.sto && clearTimeout(me.sto);
						H.lottery.isCanShake = true;
						H.lottery.canJump = true;
						hideLoading();
					},
					cancel: function() {
						alert('触发cancel');
						H.lottery.isCanShake = true;
						H.lottery.canJump = true;
						hideLoading();
					}
				});
			},
			update: function(data) {
				var me = this,
					height = $(window).height();
				if (data.result && data.pt == 7) {
					me.pt = data.pt;
					$("#wxcard-dialog").find(".award-img").css("background-image", "url(" + data.pi + ")");
					me.ci = data.ci;
					me.ts = data.ts;
					me.si = data.si;
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal modal-wxcard" id="wxcard-dialog">')
					._('<div class="dialog wxcard-dialog">')
						._('<div class="dialog-content">')
							._('<a href="javascript:;" class="btn-dialog-close" id="btn-dialog-close"></a>')
							._('<h3></h3>')
							._('<div class="award-img">')
								._('<a href="javascript:;" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">立即领取</a>')
							._('</div>')
						._('</div>')
					._('</div>')
				._('</div>');
				return t.toString();
			}
		},
		box: {
			data: null,
			$dialog: null,
			open: function(data) {
				this.data = data;
				H.lottery.isCanShake = false;
				H.lottery.canJump = false;
				H.dialog.open.call(this);
				this.event();
			},
			close: function() {
				var me = this;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({ 'opacity': '0' }, 500);
				setTimeout(function() {
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 500);
			},
			event: function() {
				var _this = this;
				this.$dialog.find('.btn-dialog-close').click(function(e) {
					e.preventDefault();
					H.dialog.btn_animate($(this));
					_this.close();
				});
				this.$dialog.find('.btn-open').click(function(e) {
					e.preventDefault();
					var data = _this.data;
					_this.close();
					if (data.pt == 1) {//1:实物奖品
						H.dialog.shiwuLottery.open(data);
					} else if (data.pt == 7) {//7:电子卡券
						H.dialog.wxcardLottery.open(data);
					} else if (data.pt == 9) {//9:外链领取奖品
						H.dialog.linkLottery.open(data);
					} else {
						H.lottery.thanks();
					}
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal modal-box" id="box-dialog">')
					._('<div class="dialog box-dialog">')
						._('<div class="dialog-content">')
							._('<a href="javascript:;" class="btn-dialog-close" id="btn-dialog-close"><img src="images/x.png"></a>')
							._('<h2 class="db">天降礼包  马上打开</h2>')
							._('<a href="javascript:;" class="btn-open">拆</a>')
						._('</div>')
					._('</div>')
				._('</div>');
				return t.toString();
			}
		}
	};
	W.callbackLotteryAwardHandler = function(data) {};
})(Zepto);