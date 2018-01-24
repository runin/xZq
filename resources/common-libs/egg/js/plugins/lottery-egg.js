/**
 * 砸蛋抽大奖
 */
var LotteryEgg = (function($) {
	
	var lottery_count = 0,
		puid = 0,
		$container = $('body'),
		REQUEST_CLS = 'requesting',
		iscroll = null,
		defaults = {
			countUrl: domain_url + 'comedian/querylc', 	// 剩余抽奖次数接口地址
			countCallback: 'callbackComedianQuerylc',	// 剩余抽奖次数接口回调函数名
			lotteryUrl: domain_url + 'comedian/lottery',// 抽奖接口地址 
			lotteryCallback: 'callbackComedianLottery',	// 抽奖接口回调函数 
			awardUrl: domain_url + 'comedian/award/', 	// 领奖接口地址
			awardCallback: 'callbackComedianAward'   	// 领奖接口回调函数
		};
	
	var event = function() {
		$container.delegate('.btn-close', 'click', function(e) {
			e.preventDefault();
			$(this).closest('.modal').addClass('none');
		}).delegate('.btn-lottery', 'click', function(e) {
			e.preventDefault();
			lottery.open();
		}).delegate('.btn-comeon', 'click', function(e) {
			e.preventDefault();
			lottery.open();
		});
	};
	
	var open = function() {
		if (this.$dialog) {
			this.$dialog.removeClass('none');
		} else {
			this.$dialog = $(this.tpl());
			$container.append(this.$dialog);
		}
		relocate();
	};
	
	var close = function() {
		$('.modal').addClass('none');
	};
	
	var relocate = function() {
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
	};
	
	var lottery = {
		$dialog: null,
		BROKEN_CLS: 'broken',
		ANIMATED_CLS: 'animated',
		LOTTERIED_CLS: 'lotteried',
		init: function(options) {
			defaults = $.extend({}, defaults, options);
			return this;
		},
		
		open: function() {
			var me = this, $dialog = this.$dialog;
			
			close();
			open.call(this);
			
			if (!$dialog) {
				this.event();
			}
			
			this.reset();
			this.$dialog.removeClass('none');
			
			var $btn_hammer = this.$dialog.find('.btn-hammer').addClass(this.ANIMATED_CLS);
			setTimeout(function() {
				$btn_hammer.removeClass(me.ANIMATED_CLS);
			}, 800);
			
			showLoading(me.$dialog);
			$.ajax({
				type : 'GET',
				async : false,
				url : defaults.countUrl,
				data: {
					tsuid: stationUuid,
					yp: openid
				},
				dataType : "jsonp",
				jsonp : "callback",
				jsonpCallback : defaults.countCallback,
				complete: function() {
					hideLoading(me.$dialog);
				},
				success : function(data) {
					lottery_count = data.lc;
					lottery.update(data.lc);
				}
			});
			
		},
		
		shake: function() {
			W.addEventListener('shake', lottery.shake_listener, false);
		},
		
		unshake: function() {
			W.removeEventListener('shake', lottery.shake_listener, false);
		},
		
		shake_listener: function() {
			var $dialog = lottery.$dialog;
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
				
				window.callbackComedianLottery = function(data) {};
				
				showLoading(me.$dialog);
				$.ajax({
					type : 'GET',
					async : false,
					url : defaults.lotteryUrl,
					data: {
						tsuid: stationUuid,
						tcuid: channelUuid,
						serviceNo: serviceNo,
						yp: openid
					},
					dataType : "jsonp",
					jsonp : "callback",
					jsonpCallback : defaults.lotteryCallback,
					complete: function() {
						hideLoading(me.$dialog);
					},
					success : function(data) {
						if (data.code == 0) {
							me.update(data.lc);
							me.animate(data);
						} else {
							setTimeout(function() {
								alert(data.message);
								me.reset();
							}, 400);
						}
					}
				});
				
				/* 构造数据，测试
				var data = {
				    "code": 0,
				    "message": "亲，恭喜您中奖了",
				    "puid": "af4ca7b2ca594fb39010539a7e756d98",
				    "co": "一",
				    "ph": "15112505426",
				    "pn": "10积分",
				    "pu": "个",
				    "pt": 2,
				    "pv": 10,
				    "pi": "http://cdn.holdfun.cn/ahtvcomedian/images/20141119/prize1.png",
				    "lc": 8,
				    "rn": "张三",
				    "ad": "深港产学研基地"
				};
				lottery.update(data.lc);
				lottery.animate(data); 
				 构造数据，测试 */
			});
			
			this.shake();
		},
		animate: function(data) {
			var me = this;
			setTimeout(function() {
				me.$dialog.addClass(me.ANIMATED_CLS);
			}, 400);
			setTimeout(function() {
				award.open(data);
			}, 1100);
		},
		update: function(lc) {
			lottery_count = lc;
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
						._('<div class="list"><ul></ul></div>')
						._('<a href="#" class="btn btn-result none" data-collect="true" data-collect-flag="ah-lotterydialog-resultbtn" data-collect-desc="抽奖弹层-查看战绩">查看战绩</a>')
						._('<p>你还有<strong class="s-lc"></strong>次抽奖机会</p>')			
					._('</div>')
					._('<div class="light"></div>')
					._('<p class="dialog-copyright none">本活动最终解释权归安徽卫视 《超级笑星》 栏目所有</p>')
				._('</div>')
			._('</section>');
			
			return t.toString();
		}
	};
	
	// 领奖
	var award = {
		pt: 0,
		$dialog: null,
		SUCCESS_CLS: 'award-succ-dialog',
		REQUEST_CLS: 'requesting',
		open: function(data) {
			var $dialog = this.$dialog;
			
			close();
			open.call(this);
			
			if (!$dialog) {
				this.event();
			}
			
			this.scroll_enable();
			this.pt = data.pt;
			puid = data.puid;
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
			lottery.update(lottery_count);
			this.$dialog.addClass(this.SUCCESS_CLS);
			if (lottery_count <= 0) {
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
				confirm.open($name);
				return false;
			} else if (!mobile) {
				confirm.open($mobile);
				return false;
			} else if (me.pt == 1 && !address) {
				confirm.open($address);
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
				
				window.callbackComedianAward = function(data) {};
				
				showLoading(me.$dialog);
				$.ajax({
					type : 'GET',
					async : false,
					url : defaults.awardUrl,
					data: {
						puid: puid,
						ph: mobile,
						rn: encodeURIComponent(name),
						ad: me.pt == 1 ? encodeURIComponent(address) : '',
						yp: openid
					},
					dataType : "jsonp",
					jsonp : "callback",
					jsonpCallback : defaults.awardCallback,
					complete: function() {
						hideLoading(me.$dialog);
					},
					success : function(data) {
						me.enable();
						if (data.code == 0) {
							me.succ();
							return;
						}
						alert(data.message);
					}
				});
			});
			
			this.$dialog.find('.btn-again').click(function(e) {
				e.preventDefault();
				
				me.$dialog.removeClass(me.SUCCESS_CLS);
				lottery.open();
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
							._('<a href="#" class="btn btn-result none" data-collect="true" data-collect-flag="ah-awarddialog-resultbtn" data-collect-desc="领奖弹层-查看战绩">查看战绩</a>')
						._('</div>')
					._('</div>')
					._('<p class="dialog-copyright none">本活动最终解释权归安徽卫视 《超级笑星》 栏目所有</p>')
				._('</div>')
			._('</section>');
			
			return t.toString();
		}
	};
	
	// confirm
	var confirm = {
		$dialog: null,
		open: function($obj) {
			open.call(this);
			this.event();
		},
		close: function() {
			this.$dialog && this.$dialog.addClass('none');
		},
		event: function() {
			var me = this;
			this.$dialog.find('.btn-confirm').click(function(e) {
				e.preventDefault();
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
	};
	
	event();
	
	return lottery;
	
})(Zepto);
