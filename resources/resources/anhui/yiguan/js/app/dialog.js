(function($) {

	H.dialog = {
		puid: 0,
		$container: $('body'),
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
			}).delegate('.btn-result', 'click', function(e) {
				e.preventDefault();
				H.dialog.result.open();
			}).delegate('.btn-lottery', 'click', function(e) {/** 抽奖事件**/
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
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.06;

			$('.modal').each(function() {
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 - 15, 'top': top - 15})
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
					'top': top,
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
				}, 8000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-try').click(function(e) {
					e.preventDefault();
					
					me.close();
				});
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog relocated">')
						._('<h2>看《医馆笑传》微信摇一摇<strong>答题抽大奖</strong></h2>')
						._('<p class="ellipsis"><label>1.</label>打开电视，锁定安徽卫视</p>')
						._('<p class="ellipsis"><label>2.</label>打开微信，进入摇一摇(歌曲)</p>')
						._('<p class="ellipsis"><label>3.</label>对着电视摇一摇</p>')
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="yg-guide-trybtn" data-collect-desc="引导弹层-关闭按钮">等下就去试试</a>')
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
				this.$dialog.find('.rule').html(rule).removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yg-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
						._('<h2>活动规则</h2>')
						._('<div class="content border">')
							._('<div class="rule none"></div>')
						._('</div>')
						._('<p class="dialog-copyright">中奖信息详询微信公众号：天和医馆</p>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		// 积分排行榜
		rank: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
				getResult('yiguan/transcript', {
					yoi: openid
				}, 'callbackYiguanTranscript', true, this.$dialog);
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
			
			update: function(data) {
				this.$dialog.find('.jf').text(data.iv);
				this.$dialog.find('.pm').text(data.rank);
				
				var t = simpleTpl(),
					items = data.items || [],
					len = items.length;
				
				for (var i = 0; i < len; i ++) {
					t._('<li>')
						._('<span class="r-avatar"><img src="'+ (items[i].hm ? (items[i].hm + '/' + yao_avatar_size) : './images/avatar.jpg') +'" /></span>')
						._('<span class="r-name ellipsis">'+ (items[i].n || '匿名用户') +'</span>')
						._('<span class="r-rank">第'+ (items[i].rank || '-') +'名</span>')
					._('</li>');
				}
				this.$dialog.find('ul').html(t.toString());
			},
			
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="rank-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yg-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
					._('<div class="dialog rank-dialog">')
						._('<h2>积分排行榜</h2>')
						._('<div class="list border">')
							._('<div class="content">')
								._('<h3>我的积分：<span class="jf"></span>排名：<span class="pm"></span></h3>')
								._('<ul></ul>')		
							._('</div>')
						._('</div>')
					._('</div>')
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
			open: function() {
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				var $cover = this.$dialog.find('.cover'),
					$back = this.$dialog.find('.back'),
					$content = this.$dialog.find('.content'),
					lotteryFlag = true;
				
				var lottery = new Lottery($cover.get(0), 'images/bg-lottery-cover.jpg', 'image', $content.width(), $content.height(), function() {
					$cover.removeClass('zshow').html('');
					
					setTimeout(function() {
						$cover.addClass('none');
						if (!lotteryFlag) {
							return;
						}
						lotteryFlag = false;
						getResult('yiguan/lottery', {
							yoi: openid
						}, 'callbackYiguanLottery', true, me.$dialog);
					}, 5);
				});
				lottery.init();
				
				this.scroll_enable();
				this.$dialog && this.$dialog.removeClass('none');
			},
			
			event: function() {
				var me = this;
				this.$dialog.find('.btn-award').click(function(e) {
					e.preventDefault();
					
					if ($(this).hasClass(me.REQUEST_CLS)) {
						return false;
					}
					$(this).addClass(me.REQUEST_CLS);
					
					if (!me.check()) {
						return false;
					}

					var mobile = $.trim(me.$dialog.find('.mobile').val()),
						name = $.trim(me.$dialog.find('.name').val()),
						address = $.trim(me.$dialog.find('.address').val());
					
					me.disable();
					getResult('yiguan/award', {
						yoi: openid,
						rl: encodeURIComponent(name),
						ph: mobile,
						ad: encodeURIComponent(address)
					}, 'callbackYiguanAward', true, me.$dialog);
					
				});
				
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					
					if (me.$dialog && me.$dialog.hasClass(me.LOTTERIED_CLS) && !me.check()) {
						return false;
					}
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				});
				
				this.$dialog.find('.btn-share').click(function(e) {
					e.preventDefault();
					
					me.$dialog.find('.btn-close').trigger('click');
					me.reset();
					
					share();
				});
				
				if (is_android()) {
					this.iscroll = new IScroll(this.$dialog.find('.dialog')[0], { 
						mouseWheel: true,
						preventDefaultException: { tagName: /^(A|INPUT|TEXTAREA|BUTTON|SELECT)$/ },
					});
					
					this.$dialog.find('input').focus(function() {
						me.$dialog.find('.dialog-inner').css('padding-bottom', '70%').css('height', 'auto');
						if (me.iscroll) {
							me.iscroll.refresh();
							me.iscroll.scrollToElement($(this)[0]);
						}
					});
				}
			},
			update: function(data) {
				if (data.code === 0) {
					if (data.pt === 3) {
						alert('太棒了！恭喜你获得滴滴红包');
						window.location.href = 'didi.html';
						return;
					}
					// 中奖后
					this.$dialog.find('h3').html('太棒了！恭喜你获得 ' + (data.pn || '') + (data.pt === 2 ? '' : (' ' + (data.co || '') + (data.pu || ''))));
					this.$dialog.find('img').attr('src', (data.pi || ''));
					this.$dialog.find('.name').val(data.rl || '');
					this.$dialog.find('.mobile').val(data.ph || '');
					this.$dialog.find('.address').val(data.ad || '');
					this.$dialog.addClass(this.LOTTERIED_CLS);
				} else {
					this.$dialog.addClass(this.LOTTERY_NONE_CLS);
				}
				this.$dialog.find('.back').removeClass('none');
				this.$dialog.removeClass(this.REQUEST_CLS);
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
			
			enable: function() {
				this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
			},
			disable: function() {
				this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
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
			// 领奖成功
			succ: function() {
				this.scroll_disable();
				this.$dialog.addClass(this.AWARDED_CLS);
				this.$dialog.find('input').attr('disabled', 'disabled');
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yg-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					._('<div class="dialog lottery-dialog">')
						._('<div class="dialog-inner">')
							._('<h2>恭喜你，答对了！<br />快来刮开膏药，赢取奖品吧！</h2>')
							._('<div class="content">')
								._('<div class="cover zshow"></div>')
								._('<div class="back none">')
								
									._('<div class="award-win">')
										._('<h3></h3>')
										._('<div class="award-img">')
											._('<img src="" />')
										._('</div>')
										._('<div class="contact">')
											._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
											._('<h4 class="awarded-tip">以下是您的联系方式，请等候工作人员联系</h4>')
											._('<p><input type="text" class="name" placeholder="姓名" /></p>')
											._('<p><input type="number" class="mobile" placeholder="联系电话" /></p>')
											._('<p><input type="text" class="address" placeholder="收件地址" /></p>')
											._('<a href="#" class="btn btn-award">确定</a>')
											._('<a href="#" class="btn btn-share">喜大普奔告诉小伙伴</a>')
										._('</div>')
									._('</div>')
									
									._('<div class="award-none none">')
										._('<h5>很遗憾，您未抽中奖品</h5>')
										._('<a href="#" class="btn-close">返回答题</a>')
									._('</div>')
								
								._('</div>')
								
							._('</div>')
						._('</div>')
						._('<p class="dialog-copyright">中奖信息详询微信公众号：天和医馆</p>')
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
		}
	};
	
	// 抽奖
	W.callbackYiguanLottery = function(data) {
		if (data.code >= 0) {
			H.dialog.lottery.update(data);
		} else {
			setTimeout(function() {
				alert(data.message);
				H.dialog.lottery.close();
			}, 50);
		}
	};
	
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};
	
	W.callbackYiguanAward = function(data) {
		H.dialog.lottery.enable();
		if (data.code == 0) {
			H.dialog.lottery.succ();
			return;
		}
		alert(data.message);
	};
	
	W.callbackYiguanTranscript = function(data) {
		H.dialog.rank.update(data);
	};
	
})(Zepto);

$(function() {
	H.dialog.init();
});
