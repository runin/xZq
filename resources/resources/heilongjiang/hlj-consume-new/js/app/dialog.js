(function($) {

	H.dialog = {
		puid: 0,
		rule_flag:true,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function(e) {
				e.preventDefault();
				H.dialog.rule.open();
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
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': '-16px', 'top': '-16px'})
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

				$(".lottery-dialog").css({ 
					'width': width * 0.88, 
					'height': height * 0.80, 
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
			$(".rank-dialog").css("top",top+10+"px");
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
						._('<h2></h2>')
						._('<p class="ellipsis"><label><img src="images/1.jpg" /></label>锁定河北卫视《明星同乐会》</p>')
						._('<p class="ellipsis"><label><img src="images/2.jpg" /></label>打开微信，进入摇一摇（电视）</p>')
						._('<p class="ellipsis"><label><img src="images/3.jpg" /></label>对着电视摇一摇</p>')
						._('<p class="ellipsis"><label><img src="images/4.jpg" /></label>参与互动就有机会赢取超值礼品</p>')
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="hlj-consume-guide-trybtn" data-collect-desc="引导弹层-关闭按钮">等下就去试试</a>')
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
				if(H.dialog.rule_flag==true)
				{
					getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
				}
				
			},
			close: function() {
				var me = this;
				$('body').removeClass('noscroll');
				$('.rule-dialog').addClass('bounceOutDown');
				setTimeout(function()
				{
					$('.rule-dialog').removeClass('bounceOutDown');
					me.$dialog && me.$dialog.addClass('none');
				}, 1000);
				
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
					
				});
				this.$dialog.find('.btn-back').click(function(e) {
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
					._('<div class="dialog rule-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hlj-consume-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2>活动规则</h2>')
						._('<div class="content border">')
							._('<div class="rule none"></div>')
						._('</div>')
						._('<a href="#" class="btn btn-back" data-collect="true" data-collect-flag="hlj-consume-rule-dialog-know-btn" data-collect-desc="规则弹层-我知道了按钮">我知道了</a>')
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
			prize_type: 0,
			open: function(data) {
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				H.lottery.isCanShake = false;
				H.dialog.lottery.update(data);
				if (!$dialog) {
					this.event();
				}
				this.scroll_enable();
				this.$dialog && this.$dialog.removeClass('none');
			},
			
			event: function() {
				var me = this;
				this.$dialog.find('.btn-award').click(function(e) {
					e.preventDefault();
					
					if (!me.check()) {
						return false;
					}
					var mobile = $.trim(me.$dialog.find('.mobile').val()),
						name = $.trim(me.$dialog.find('.name').val());
					$(".contact").addClass("none");
					$(".thirdCon").removeClass("none");
					$(".uname").find("span").text(name);
					$(".uphone").find("span").text(mobile);

					getResult('api/lottery/award', {
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile,
						hi: headimgurl,
						nn: nickname
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
					
				});
				this.$dialog.find('.btn-back').click(function(e) {
					e.preventDefault();
					me.close();

				});
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			close: function() {
				var me= this;
				$('.lottery-dialog').addClass('bounceOutDown');
				setTimeout(function()
				{
					$('.lottery-dialog').removeClass('bounceOutDown');
					me.$dialog && me.$dialog.addClass('none');
				}, 1000);
				H.lottery.isCanShake = true;
			},
			update: function(data) {
				H.dialog.lottery.prize_type = data==null?0:data.pt;
				// 中奖后
				if(data != null &&data.result&& data.pt != 0){
					$(".contact").removeClass("none");
					$(".thirdCon").addClass("none");
					this.$dialog.find('.contact h3').text(data.tt || '');
					this.$dialog.find('img').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
					this.$dialog.find('.name').val(data.rn || '');
					this.$dialog.find('.mobile').val(data.ph || '');
					this.$dialog.find('.cos-phone').text(data.al || '');
					this.$dialog.find('.cos-addr').text(data.aa || '');
					$(".masking-box").addClass("none");
					this.$dialog.find('.award-win').removeClass('none');
					this.$dialog.find('.award-none').addClass('none');
				}
			},
			
			check: function() {
				var me = this, $mobile = me.$dialog.find('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = me.$dialog.find('.name'),
					name = $.trim($name.val());

				if (name.length < 2 || name.length > 30) {
					showTips('姓名长度为2~30个字符');
					$name.focus();
					return false;
				}
				else if (!/^\d{11}$/.test(mobile)) {
					showTips('这手机号，可打不通哦...');
					$mobile.focus();
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
			},
			
			reset: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hlj-consume-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="back">')
									._('<div class="award-win none">')
										._('<div class="award-img">')
											._('<img src="./images/pre-ward.png" />')
										._('</div>')
										._('<div class="contact">')
											._('<h3>恭喜你中奖了</h3>')
											._('<h4 class="award-tip">请输入您的个人信息</h4>')
											._('<p><input type="text" class="name" placeholder="姓名" /></p>')
											._('<p><input type="number" class="mobile" placeholder="联系电话" /></p>')
											._('<p class="others">')
											._('领奖地址:  <span class="cos-addr"></span>')
											._('</p>')
											._('<p class="others">')
											._('咨询电话:  <span class="cos-phone"></span>')
											._('</p>')
											._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="hlj-consume-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">领  取</a>')
											._('<p class="btn-share yaoqing">快戳小伙伴们来围观吧！</p>')
											._('<a href="#" class="btn btn-share btn-back" data-collect="true" data-collect-flag="hlj-consume-lotterydialog-back-btn" data-collect-desc="抽奖弹层-返回按钮">返 回</a>')
										._('</div>')
										._('<div class="thirdCon none">')
										._('<h3>以下是您的联系方式</h3>')
											._('<div class="awded">')
											._('<p class="uname">姓名：<span></span></p>')
											._('<p class="uphone">电话：<span></span></p>')
											._('<p class="others">咨询电话:<br><span class="cos-phone"></span>')
											._('</p>')
											._('<p class="others">领奖地址:<br><span class="cos-addr"></span>')
											._('</p>')
											._('</div>')
											._('<a href="#" class="btn btn-back" data-collect="true" data-collect-flag="hlj-consume-lottery-dialog-com-back-btn" data-collect-desc="抽奖弹层-返回按钮">确    定</a>')
										._('</div>')
									._('</div>')
								._('</div>')
								
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				
				return t.toString();
			}
		},
		
	};
	
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule_flag = false;
			H.dialog.rule.update(data.rule);
		}
	};
	
	W.callbackLotteryAwardHandler = function(data) {

	};
	
})(Zepto);

$(function() {
	H.dialog.init();
});
