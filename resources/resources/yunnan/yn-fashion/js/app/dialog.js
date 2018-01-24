(function($) {
	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		clickFlag: true,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			}).delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
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

			$('.modal').each(function() {
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 + 5, 'top': height * 0.06 + 5})
			});
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
				var $box = $(this).find('.box');
				if ($box.length > 0) {
					$box.css('height', height * 0.38);
				}
			});
		},
		guide: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				var me = this;
				setTimeout(function() {
					me.close();
				}, 5000);
			},
			event: function() {
				var me = this;
				this.$dialog.click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			close: function() {
				var me = this;
				this.$dialog && this.$dialog.removeClass('flipInX').addClass('flipOutX');
				setTimeout(function() {
					me.$dialog.removeClass('flipOutX').addClass('none');
				}, 1100);
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-guide animate flipInX" id="guide-dialog">')
				._('</section>');
				return t.toString();
			}
		},
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				$('body').addClass('noscroll');
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
				$('body').removeClass('noscroll');
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
				this.$dialog.find('.rule-content').html(rule).removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-fashion-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
						._('<div class="rule-content">')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		fudai: {
			$dialog: null,
			open: function() {
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this,
				$fudai = this.$dialog.find('.fudai');
				if (H.dialog.clickFlag) {
					H.dialog.clickFlag = false;
					$fudai.click(function(e) {
						e.preventDefault();
						setTimeout(function() {
							// getResult('api/lottery/luck', {
							// 	oi: openid
							// }, 'callbackLotteryLuckHandler', true, null);
							showLoading();
			                $.ajax({
			                    type : 'GET',
			                    async : false,
			                    url : domain_url + 'api/lottery/luck',
			                    data: { oi: openid },
			                    dataType : "jsonp",
			                    jsonpCallback : 'callbackLotteryLuckHandler',
			                    complete: function() {
			                        hideLoading();
			                    },
			                    success : function(data) {
			                    	H.dialog.lottery.open(data);
			                    },
			                    error : function() {
			                    	H.dialog.lottery.open(null);
			                    }
			                });
						}, 5);
						me.close();
					});
				} else {
					return;
				};
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="fudai-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-fashion-rankdialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>')
					._('<div class="fudai" data-collect="true" data-collect-flag="yn-fashion-rankdialog-clickbtn" data-collect-desc="领奖弹层-点击按钮">')
						._('<p>恭喜您获得红包一个</p>')
						._('<i class="btn-ball"></i>')
						._('<i class="btn-open">打 开</i></div>')
				._('</section>');
				return t.toString();
			}
		},
		lottery: {
			iscroll: null,
			$dialog: null,
			LOTTERIED_CLS: 'lotteried',
			REQUEST_CLS: 'requesting',
			AWARDED_CLS: 'lottery-awarded',
			LOTTERY_NONE_CLS: 'lottery-none',
			open: function(data) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(),
				winH = $(window).height();
				hideLoading($dialog);
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				this.$dialog && this.$dialog.removeClass('none');
				H.dialog.lottery.update(data);
			},
			
			event: function() {
				var me = this;
				this.$dialog.find('.btn-award').click(function(e) {
					e.preventDefault();
					if (!me.check()) {
						return false;
					};
					var $mobile = $('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = $('.name'),
					name = $.trim($name.val()),
					$address = $('.address'),
					address = $.trim($address.val());
					me.disable();
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile,
						ad: encodeURIComponent(address)
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
				
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				});
				
				this.$dialog.find('.btn-share').click(function(e) {
					e.preventDefault();
					me.$dialog.find('.btn-close').trigger('click');
					me.reset();
				});
			},
			update: function(data) {
				if (data != null && data != '') {
					if (data.result) {
						if (data.pt === 1) { //实物奖品
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.find('.address').val(data.ad || '');
							this.$dialog.find('.award-win h5').text(data.tt || '恭喜您中奖了 运气真好!');
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
						} else {
							this.$dialog.find('.award-win').addClass('none');
							this.$dialog.addClass(this.LOTTERY_NONE_CLS);
						}
					} else {
						this.$dialog.find('.award-win').addClass('none');
						this.$dialog.addClass(this.LOTTERY_NONE_CLS);
					}
				} else {
					this.$dialog.find('.award-win').addClass('none');
					this.$dialog.addClass(this.LOTTERY_NONE_CLS);
				}
				this.$dialog.removeClass(this.REQUEST_CLS);
			},
			check: function() {
				var $mobile = $('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = $('.name'),
					name = $.trim($name.val()),
					$address = $('.address'),
					address = $.trim($address.val());
				
				if (name.length > 20 || name.length == 0) {
					showTips('请输入您的姓名，不要超过20字哦!',4);
					$name.focus();
					return false;
				}else if (!/^\d{11}$/.test(mobile)) {
					showTips('这手机号，可打不通...',4);
					$mobile.focus();
					return false;
				}else if (address.length < 5 || address.length > 60 || address.length == 0) {
					showTips('地址长度为5~60个字符',4);
					$address.focus();
					return false;
				}
				return true;
			},
			
			enable: function() {
				this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
			},
			disable: function() {
				this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
			},
			succ: function() {
				var me = this, $qmobile = $('.dialog').find('.mobile'),
				qmobile = $qmobile.val(),
				$name = $('.dialog').find('.name'),
				qname = $name.val(),
				$address = $('.dialog').find('.address'),
				qaddress = $address.val();
				this.$dialog.addClass(this.AWARDED_CLS);
				var qname = $('.name').val(),
				qmobile = $('.mobile').val(),
				qaddress = $('.address').val();
				$('.q-name').html('姓名:' + qname);
				$('.q-mobile').html('手机号码:' + qmobile);
				$('.q-address').html('收件地址:' + qaddress);
			},
			reset: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			close: function() {
				this.$dialog.find('.btn-close').trigger('click');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-fashion-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					._('<div class="dialog lottery-dialog">')
						._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="back">')
									._('<div class="award-win none">')
										._('<h5></h5>')
										._('<div class="contact">')
											._('<div class="award-img">')
												._('<img src="" />')
											._('</div>')
											._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
											._('<h4 class="awarded-tip">以下是您的联系方式</h4>')
											._('<p class="q-name"><input type="text" class="name" placeholder="姓名" /></p>')
											._('<p class="q-mobile"><input type="number" class="mobile" placeholder="手机号码" /></p>')
											._('<p class="q-address"><input type="text" class="address" placeholder="收件地址" /></p>')
											._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="yn-fashion-lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮">确 定</a>')
											._('<div class="share"><a href="#" class="btn-share">把好运气分享给小伙伴！</a></div>')
										._('</div>')
									._('</div>')
									._('<div class="award-none none">')
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
	
	W.callbackLotteryLuckHandler = function(data) {
		H.dialog.lottery.open(data);
	};
	
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};
	
	W.callbackLotteryAwardHandler = function(data) {
		if (data.result) {
			H.dialog.lottery.succ();
			return;
		} else {
			showTips('亲，服务君繁忙！稍后再试哦！');
		}
	};
})(Zepto);

$(function() {
	H.dialog.init();
});