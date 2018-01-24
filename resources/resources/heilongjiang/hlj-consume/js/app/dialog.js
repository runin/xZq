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
		// 排行
		rank: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
				$('body').addClass('noscroll');
				
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
				this.$dialog.find('.btn-back').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function(data) {
				this.$dialog.find('.rankcon').html(H.dialog.rank.contpl(data)).removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
				._('<div class="dialog rank-dialog">')
				._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hlj-consume-rankdialog-closebtn" data-collect-desc="排行弹层-关闭按钮"></a>')
				._('<h2>积分排行</h2>')
				._('<div class="list border">')
				._('<ul class="rankcon none"></ul>')
				._('</div>')
				._('</div>')
				._('</section>');
				return t.toString();
			},
			contpl: function(data) {
				if(data.result){
					var top10 = data.top10;
					var t = simpleTpl();
					for(var i = 0;i< top10.length;i++){
						t._('<li>')
						._('<img src="'+(top10[i].hi ? (top10[i].hi + '/64') : './images/head.png')+'">')
						._('<span class="jf">积分：'+top10[i].in+'</span>')
						._('<span class="rk">第'+top10[i].rk+'名</span>')
						._('</li>');
					}
					return t.toString();
				}else{
					var t = simpleTpl();
						t._('<li>')
						._('<span class="norank">暂时还没有排名信息~</span>')
						._('</li>');
					return t.toString();
				}
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
					
					if ($(this).hasClass(me.REQUEST_CLS)) {
						return false;
					}
					if (!me.check()) {
						return false;
					}
					$(this).addClass(me.REQUEST_CLS);
					var mobile = $.trim(me.$dialog.find('.mobile').val()),
						name = $.trim(me.$dialog.find('.name').val());
					
					me.disable();
					$(".contact").addClass("none");
					if(H.dialog.lottery.prize_type == 2){
						$(".uname").find("span").text(name);
						$(".uphone").find("span").text(mobile);
						$(".thirdCon").removeClass("none");
					}else{
						$(".otherCon").removeClass("none");
					}
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
					location.reload(true);
				});
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					
					me.close();
					location.reload(true);
				});
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			update: function(data) {
				H.dialog.lottery.prize_type = data==null?0:data.pt;
				// 中奖后
				if(data != null &&data.result&& data.pt != 0){
					H.answer.pru = data.surveyPrizelogUuid;
					this.$dialog.find('h3').text(data.tt || '');
					this.$dialog.find('img').attr('src', (data.pi || ''));
					this.$dialog.find('.name').val(data.rn || '');
					this.$dialog.find('.mobile').val(data.ph || '');
					this.$dialog.find('.phone').text(data.aw || '');
					this.$dialog.find('.addr').text(data.aa || '');
					$(".masking-box").addClass("none");
					this.$dialog.find('.award-win').removeClass('none');
					this.$dialog.find('.award-none').addClass('none');
				}else{
					//谢谢参与
					$(".masking-box").addClass("none");
					this.$dialog.find('.award-none').removeClass('none');
					this.$dialog.find('.award-win').addClass('none');
				}
			},
			
			check: function() {
				var me = this, $mobile = me.$dialog.find('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = me.$dialog.find('.name'),
					name = $.trim($name.val());

				if (name.length < 2 || name.length > 30) {
					alert('姓名长度为2~30个字符');
					$name.focus();
					return false;
				}
				else if (!/^\d{11}$/.test(mobile)) {
					alert('这手机号，可打不通哦...');
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
				this.$dialog.find('.share').removeClass('none');
				this.$dialog.find('input').attr('disabled', 'disabled');
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
											._('<img src="" />')
										._('</div>')
										._('<div class="contact">')
											._('<h3>恭喜你，答对了！</h3>')
											._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
											._('<p><input type="text" class="name" placeholder="姓名" /></p>')
											._('<p><input type="number" class="mobile" placeholder="联系电话" /></p>')
											._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="hlj-consume-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">确定</a>')
											._('<p class="btn-share yaoqing">快戳小伙伴们来围观吧！</p>')
											._('<a href="#" class="btn btn-share btn-back" data-collect="true" data-collect-flag="hlj-consume-lotterydialog-back-btn" data-collect-desc="抽奖弹层-返回按钮">返 回</a>')
										._('</div>')
										._('<div class="otherCon none">')
											._('<div class="others">')
												._('<label>商家咨询电话：</label>')
												._('<p class="phone"></p>')
											._('</div>')
											._('<div class="others">')
												._('<label>奖品自提地址：</label>')
												._('<p class="addr"></p>')
											._('</div>')
											._('<a href="#" class="btn btn-back" data-collect="true" data-collect-flag="hlj-consume-lottery-dialog-com-back-btn" data-collect-desc="抽奖弹层-返回按钮">确定</a>')
										._('</div>')
										._('<div class="thirdCon none">')
										._('<h3></h3>')
											._('<div class="awded">')
												._('<p class="uname">姓名：<span></span></p>')
												._('<p class="uphone">电话：<span></span></p>')
											._('</div>')
											._('<a href="#" class="btn btn-back" data-collect="true" data-collect-flag="hlj-consume-lottery-dialog-com-back-btn" data-collect-desc="抽奖弹层-返回按钮">确定</a>')
										._('</div>')
									._('</div>')
									._('<div class="award-none none">')
										._('<img src="images/face.png" />')
										._('<h5>真遗憾，没有中奖<br/>下次加油哦~</h5>')
										._('<a href="#" class="btn btn-back" data-collect="true" data-collect-flag="hlj-consume-lotterydialog-know-btn" data-collect-desc="抽奖弹层-我知道了按钮">我知道了</a>')
									._('</div>')
								
								._('</div>')
								
							._('</div>')
						._('</div>')
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
							._('<a href="#" class="btn btn-confirm" data-collect="true" data-collect-flag="hlj-consume-lotterydialog-tip-btn" data-collect-desc="抽奖弹层-返回填写信息按钮">返回填写</a>')
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
		H.dialog.lottery.enable();
		if (data.result) {
			H.dialog.lottery.succ();
			return;
		}
		alert('亲，服务君繁忙！请稍后再试！');
	};
	
})(Zepto);

$(function() {
	H.dialog.init();
});
