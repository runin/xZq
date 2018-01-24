(function($) {
	
	H.dialog = {
		puid: 0,
		$container: $('#main'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			}).delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
			}).delegate('.btn-lottery', 'click', function(e) {
				e.preventDefault();
				H.dialog.lottery.open();
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
				width = $(window).width();

			$('.modal').css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 - 15, 'bottom': height * 0.06 - 15});
			$('.dialog').each(function() {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({ 
					'width': width * 0.88, 
					'height': height * 0.94, 
					'left': width * 0.06,
					'right': width * 0.06,
					'top': 0,
					'bottom': height * 0.06
				});
				var $box = $(this).find('.box');
				if ($box.length > 0) {
					$box.css('height', height * 0.38);
				}
			});
		},
		
		// 规则
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
				getResult('common/activtyRule/' + serviceNo, {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
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
				this.$dialog.find('.rule').html(rule).closest('.content').removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ah-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
						._('<h2></h2>')
						._('<div class="content border none">')
							._('<div class="rule"></div>')
						._('</div>')
						._('<p class="dialog-copyright">最终解释权归《家庭幽默大赛》所有</p>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		lottery: {
			$dialog: null,
			BROKEN_CLS: 'broken',
			ANIMATED_CLS: 'animated',
			LOTTERIED_CLS: 'lotteried',
			open: function() {
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				
				this.reset();
				this.$dialog.removeClass('none');
				
				var $btn_hammer = this.$dialog.find('.btn-hammer').addClass(this.ANIMATED_CLS);
				setTimeout(function() {
					$btn_hammer.removeClass(me.ANIMATED_CLS);
				}, 800);
				
				getResult('humor/querylc', {
					tsuid: stationUuid,
					yp: openid
				}, 'callbackHumorQuerylc', true);
			},
			
			shake: function() {
				W.addEventListener('shake', H.dialog.lottery.shake_listener, false);
			},
			
			unshake: function() {
				W.removeEventListener('shake', H.dialog.lottery.shake_listener, false);
			},
			
			shake_listener: function() {
				var $dialog = H.dialog.lottery.$dialog;
				if ($dialog.hasClass('none')) {
					return;
				}
				$dialog.find('.btn-hammer').trigger('click');
			},
			
			event: function() {
				var me = this;
				this.$dialog.find('.btn-hammer').click(function(e) {
					var $me = $(this);
					e.preventDefault();
					
					if (me.$dialog.hasClass(me.LOTTERIED_CLS)) {
						return false;
					}
					me.$dialog.addClass(me.LOTTERIED_CLS);
					
					$me.addClass(me.ANIMATED_CLS);
					setTimeout(function() {
						me.$dialog.addClass(me.BROKEN_CLS);
					}, 400);
					setTimeout(function() {
						$me.removeClass(me.ANIMATED_CLS);
					}, 800);
					
					getResult('humor/lottery', {
						tsuid: stationUuid,
						tcuid: channelUuid,
						serviceNo: serviceNo,
						yp: openid
					}, 'callbackHumorLottery', this.$dialog);
				});
				
				this.shake();
			},
			animate: function(data) {
				var me = this;
				setTimeout(function() {
					me.$dialog.addClass(me.ANIMATED_CLS);
				}, 400);
				setTimeout(function() {
					H.dialog.award.open(data);
				}, 1100);
			},
			update: function(lc) {
				W.lc = lc;
				$('.s-lc').text(lc);
			},
			reset: function() {
				this.$dialog.removeClass(this.BROKEN_CLS).removeClass(this.ANIMATED_CLS).removeClass(this.LOTTERIED_CLS);
			},
			
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="lottery-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ah-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					._('<div class="dialog lottery-dialog">')
						._('<div class="hammer">')
							._('<p>举起你的双手，让我们一起摇摆吧！</p>')
							._('<a href="#" class="btn-hammer" data-collect="true" data-collect-flag="ah-lotterydialog-hammerbtn" data-collect-desc="抽奖弹层-锤子砸奖"></a>')
						._('</div>')
						._('<div class="ctrl">')
							._('<p>你还有<strong class="s-lc"></strong>次抽奖机会</p>')			
						._('</div>')
						._('<div class="light"></div>')
						._('<p class="dialog-copyright">最终解释权归《家庭幽默大赛》所有</p>')
					._('</div>')
				._('</section>');
				
				return t.toString();
			}
		},
		
		// 领奖
		award: {
			puid: 0,
			pt: 0,
			$dialog: null,
			SUCCESS_CLS: 'award-succ-dialog',
			REQUEST_CLS: 'requesting',
			open: function(data) {
				var $dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				
				this.scroll_enable();
				this.pt = data.pt;
				this.puid = data.puid;
				this.$dialog.find('.s-award').text(' ' + data.pn + ' ' + (data.pt == 2 ? '' : (data.co + data.pu)));
				this.$dialog.find('.prize').html('<img src="'+ data.pi +'" />').addClass('p' + data.pt);
				this.$dialog.find('.mobile').val(data.ph || '');
				this.$dialog.find('.name').val(data.rn || '');
				
				var $address = this.$dialog.find('.address').val(data.ad || '');
				if (data.pt == 2) {
					$address.addClass('none');
				} else {
					$address.removeClass('none');
				}
				this.$dialog.removeClass(this.SUCCESS_CLS);
			},
			scroll_enable: function() {
				if (this.iscroll) {
					this.iscroll.scrollTo(0, 0);
					this.iscroll.enable();
				}
			},
			scroll_disable: function() {
				if (this.iscroll) {
					this.iscroll.scrollTo(0, 0);
					this.iscroll.disable();
				}
			},
			enable: function() {
				this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
			},
			disable: function() {
				this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
			},
			
			succ: function() {
				this.scroll_disable();
				H.dialog.lottery.update(W.lc);
				this.$dialog.addClass(this.SUCCESS_CLS);
				if (W.lc <= 0) {
					this.$dialog.find('.btn-again').addClass('none');
				} else {
					this.$dialog.find('.btn-again').removeClass('none');
				}
			},
			
			check: function() {
				var me = this, $mobile = me.$dialog.find('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = me.$dialog.find('.name'),
					name = $.trim($name.val()),
					$address = me.$dialog.find('.address'),
					address = $.trim($address.val());
				
				if (!name) {
					H.dialog.confirm.open($name);
					return false;
				} else if (!mobile) {
					H.dialog.confirm.open($mobile);
					return false;
				} else if (me.pt == 1 && !address) {
					H.dialog.confirm.open($address);
					return false;
				}
				
				if (name.length > 20) {
					alert('姓名太太太长了！');
					$name.focus();
					return false;
				}
				if (!/^\d{11}$/.test(mobile)) {
					alert('这手机号，可打不通...');
					$mobile.focus();
					return false;
				}
				if (me.pt == 1 && (address.length < 5 || address.length > 60)) {
					alert('地址长度为5~60个字符');
					$address.focus();
					return false;
				}
				return true;
			},
			
			event: function() {
				var me = this;
				this.$dialog.find('.btn-award').click(function(e) {
					e.preventDefault();
					
					if (!me.check()) {
						return false;
					}
					
					var mobile = $.trim(me.$dialog.find('.mobile').val()),
						name = $.trim(me.$dialog.find('.name').val()),
						address = $.trim(me.$dialog.find('.address').val());
					
					me.disable();
					getResult('humor/award/', {
						puid: me.puid,
						ph: mobile,
						rn: encodeURIComponent(name),
						ad: me.pt == 1 ? encodeURIComponent(address) : '',
						yp: openid
					}, 'callbackHumorAward', this.$dialog);
				});
				
				this.$dialog.find('.btn-again').click(function(e) {
					e.preventDefault();
					
					me.$dialog.removeClass(me.SUCCESS_CLS);
					H.dialog.lottery.open();
				});
				
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					
					if (!me.check()) {
						return false;
					}
				});
				
				if (is_android()) {
					this.iscroll = new IScroll(this.$dialog.find('.dialog')[0], { 
						mouseWheel: true,
						preventDefaultException: { tagName: /^(A|INPUT|TEXTAREA|BUTTON|SELECT)$/ },
					});
					
					this.$dialog.find('.dialog-inner').css('padding-bottom', '70%');
					
					this.$dialog.find('input').focus(function() {
						if (me.iscroll) {
							me.iscroll.refresh();
							me.iscroll.scrollToElement($(this)[0]);
						}
					});
				}
			},
			
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal iscroll" id="award-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ah-awarddialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>')
					._('<div class="dialog award-dialog">')
						._('<div class="dialog-inner">')
							._('<div class="box">')
								._('<div class="prize"></div>')
							._('</div>')
							._('<div class="ctrl">')
								._('<h2>运气太好了，您获得<strong class="s-award"></strong></h2>')
								._('<div class="content">')
									._('<p>请填写您的姓名及联系方式，以便顺利领奖</p>')
									._('<input type="text" class="name" placeholder="姓名" />')
									._('<input type="number" class="mobile" placeholder="手机号码" />')
									._('<input type="text" class="address" placeholder="地址" />')
								._('</div>')
								._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="ah-awarddialog-awardbtn" data-collect-desc="领奖弹层-领奖按钮">确定</a>')
							._('</div>')
							._('<div class="ctrl award-succ">')
								._('<h2>实物奖品将会由工作人员联系您进行发放。</h2>')
								._('<h3>您还有<strong class="s-lc"></strong>次抽奖机会</h3>')
								._('<a href="#" class="btn btn-again" data-collect="true" data-collect-flag="ah-awarddialog-againbtn" data-collect-desc="领奖弹层-再来一次">再来一次</a>')
							._('</div>')
						._('</div>')
						._('<p class="dialog-copyright">最终解释权归《家庭幽默大赛》所有</p>')
					._('</div>')
				._('</section>');
				
				return t.toString();
			}
		},
		
		// confirm
		confirm: {
			$dialog: null,
			$focus_obj: null,
			open: function($obj) {
				this.$focus_obj = $obj;
				if (this.$dialog) {
					this.$dialog.removeClass('none');
				} else {
					this.$dialog = $(this.tpl());
					H.dialog.$container.append(this.$dialog);
				}
				H.dialog.relocate();
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-confirm').click(function(e) {
					e.preventDefault();
					//me.$focus_obj.focus();
					me.close();
				});
			},
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="confirm-dialog">')
					._('<div class="dialog confirm-dialog relocated">')
						._('<div class="content">资料填写不全，将被视为自愿放弃奖品。</div>')
						._('<div class="ctrl">')
							._('<a href="#" class="btn btn-confirm">返回填写</a>')
						._('</div>')
					._('</div>')
				._('</section>');
				
				return t.toString();
			}
		},
		
		// tip
		tip: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
			},
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="tip-dialog">')
					._('<div class="dialog tip-dialog relocated">')
						._('<h2></h2>')
						._('<a href="#" class="btn btn-close">确定</a>')
					._('</div>')
				._('</section>');
				
				return t.toString();
			}
		}
	};
	
	W.callbackHumorAward = function(data) {
		H.dialog.award.enable();
		
		if (data.code == 0) {
			H.dialog.award.succ();
			return;
		}
		alert(data.message);
	};
	
	W.callbackHumorLottery = function(data) {
		if (data.code == 0) {
			H.dialog.lottery.update(data.lc);
			H.dialog.lottery.animate(data);
		} else {
			H.dialog.lottery.update(data.lc);
			setTimeout(function() {
				alert(data.message);
				H.dialog.lottery.reset();
			}, 400);
		}
	};
	
	W.callbackHumorQuerylc = function(data) {
		if (data.code == 0) {
			W.jo = data.jo;
			W.gc = data.gc;
			W.hc = data.hc;
			W.lc = data.lc;
			
			H.dialog.lottery.update(data.lc);
		}
	};
	
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};
	
})(Zepto);

H.dialog.init();
