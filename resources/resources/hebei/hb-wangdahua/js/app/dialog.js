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
			// .delegate('.fudai', 'click', function(e) {
			// 	e.preventDefault();
			// 	H.dialog.lottery.open();
			// });
			// $('.fudai').click(function(event) {
			// 	e.preventDefault();
			// 	H.dialog.lottery.open();
			// });
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
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 + 4, 'top': top + 6})
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
				}, 5000);
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
						._('<div>看《王大花的革命生涯》<h1>微信摇一摇答题抽大奖</h1></div>')
						._('<div class="guide-content"><p class="ellipsis"><label>1</label>打开电视，锁定河北卫视</p>')
						._('<p class="ellipsis"><label>2</label>打开微信，进入摇一摇(电视)</p>')
						._('<p class="ellipsis"><label>3</label>对着电视摇一摇</p>')
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="hb-wdh-guide-trybtn" data-collect-desc="引导弹层-关闭按钮"></a></div>')
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hb-wdh-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
						._('<h2>活动规则</h2>')
						._('<div class="content border">')
							._('<div class="rule none"></div>')
						._('</div>')
						._('<p class="dialog-copyright"></p>')
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hb-wdh-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
					._('<div class="dialog rank-dialog">')
						._('<h2>积分排行榜</h2>')
						._('<p>全剧剧终累计积分前三名可获得<br>演员签名照与手机壳套组</p>')
						._('<h3>我的积分：<span class="jf"></span>排名<span class="pm"></span></h3>')
						._('<div class="list border">')
							._('<div class="content">')
								._('<ul></ul>')		
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},

		// 点击福袋抽奖
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
							H.dialog.lottery.open();
						me.close();
					});
				} else {
					return;
				};
			},
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="fudai-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hb-wdh-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
					._('<div class="fudai"></div>')
					._('<div class="fudai-round"></div>')
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
				setTimeout(function() {
					// 新接口yglottery/lottery
					getResult('yiguan/lottery', {
						yoi: openid
					}, 'callbackYiguanLottery', true, me.$dialog);
				}, 5);
				this.$dialog && this.$dialog.removeClass('none');
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
					getResult('yiguan/award', {
						yoi: openid,
						rl: encodeURIComponent(name),
						ph: mobile,
						ad: encodeURIComponent(address)
					}, 'callbackYiguanAward', true, me.$dialog);
				});
				
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					
					// if (me.$dialog && me.$dialog.hasClass(me.LOTTERIED_CLS) && !me.check()) {
					// 	return false;
					// }
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				});
				
				this.$dialog.find('.btn-share').click(function(e) {
					e.preventDefault();
					
					me.$dialog.find('.btn-close').trigger('click');
					me.reset();
					// share();
				});
				
				// if (is_android()) {
				// 	this.iscroll = new IScroll(this.$dialog.find('.dialog')[0], { 
				// 		mouseWheel: true,
				// 		preventDefaultException: { tagName: /^(A|INPUT|TEXTAREA|BUTTON|SELECT)$/ },
				// 	});
					
				// 	this.$dialog.find('input').focus(function() {
				// 		me.$dialog.find('.dialog-inner').css('padding-bottom', '70%').css('height', 'auto');
				// 		if (me.iscroll) {
				// 			me.iscroll.refresh();
				// 			me.iscroll.scrollToElement($(this)[0]);
				// 		}
				// 	});
				// }
			},
			update: function(data) {
				if (data.code === 0) {
					if (data.pt === 3) {
						alert('太棒了！恭喜你获得滴滴红包');
						window.location.href = 'didi.html';
						return;
					}
					// 中奖后
					this.$dialog.find('h3').html('太棒了！恭喜您获得<br>' + (data.pn || '') + (data.pt === 2 ? '' : (' ' + (data.co || '') + (data.pu || ''))));
					this.$dialog.find('img').attr('src', (data.pi || ''));
					this.$dialog.find('.name').val(data.rl || '');
					this.$dialog.find('.mobile').val(data.ph || '');
					this.$dialog.find('.address').val(data.ad || '');
					this.$dialog.addClass(this.LOTTERIED_CLS);
					this.$dialog.find('.award-win').removeClass('none');
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
					alert('请输入您的姓名，不要超过20字哦！');
					$name.focus();
					return false;
				}else if (!/^\d{11}$/.test(mobile)) {
					alert('这手机号，可打不通...');
					$mobile.focus();
					return false;
				}else if (address.length < 5 || address.length > 60 || address.length == 0) {
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
				var me = this, $qmobile = $('.dialog').find('.mobile'),
				qmobile = $qmobile.val(),
				$name = $('.dialog').find('.name'),
				qname = $name.val(),
				$address = $('.dialog').find('.address'),
				qaddress = $address.val();
				// this.scroll_disable();
				this.$dialog.addClass(this.AWARDED_CLS);
				// this.$dialog.find('input').attr('disabled', 'disabled');
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hb-wdh-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					._('<div class="dialog lottery-dialog">')
						._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="back">')
									._('<div class="award-win none">')
										._('<h3></h3>')
										._('<div class="award-img">')
											._('<img src="" />')
										._('</div>')
										._('<div class="contact">')
											._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
											._('<h4 class="awarded-tip">以下是您的联系方式，请等候工作人员联系</h4>')
											._('<p class="q-name"><input type="text" class="name" placeholder="姓名" /></p>')
											._('<p class="q-mobile"><input type="number" class="mobile" placeholder="手机号码" /></p>')
											._('<p class="q-address"><input type="text" class="address" placeholder="收件地址" /></p>')
											._('<a href="#" class="btn btn-award">确定</a>')
											._('<div class="share"><a href="#" class="btn-share">把好运气分享给小伙伴！</a></div>')
										._('</div>')
									._('</div>')
									
									._('<div class="award-none none">')
										._('<h5>很遗憾，您未抽中奖品</h5>')
										._('<a href="#" class="btn-close">返回答题</a>')
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
		// H.dialog.lottery.enable();
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
