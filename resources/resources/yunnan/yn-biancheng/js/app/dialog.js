(function($) {
	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		clickFlag: true,
		successFlag: true,
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
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': "10px", 'top': "10px"})
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
				$(".rule-dialog").css({ 
					'width': width * 0.88, 
					'height': height * 0.7, 
					'left': width * 0.06,
					'right': width * 0.06,
					'top': height * 0.15,
					'bottom': height * 0.15
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
					
						._('<div class="guide-title"><h2>看《边城》微信摇一摇</h2><h1>答题抽大奖</h1></div>')
						._('<div class="guide-content"><p>1.打开电视，锁定云南卫视</p>')
						._('<p>2.打开微信，进入摇一摇(电视)</p>')
						._('<p>3.对着电视摇一摇</p>')
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="tv-yunnan-biancheng-guide-trybtn" data-collect-desc="引导弹层-关闭按钮">马上去试试</a></div>')
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
					._('<div class="dialog rule-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-yunnan-biancheng-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<div class="content border">')
						  ._('<h2>活动规则</h2>')
							._('<div class="rule none"></div>')
						._('</div>')
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
				var rankDH = this.$dialog.height(),
					rankW = $('.rank-dialog').width();
				var rankH = Math.ceil(810 * rankW / 523);
				var rankTop = Math.ceil((rankDH - rankH) / 2);
				$('.rank-dialog').css({'height': rankH, 'top': rankTop});
				$('#rank-dialog .btn-close').css('top', rankTop + 5);
				
				getResult('api/lottery/integral/rank/self', {
					oi: openid
				}, 'callbackIntegralRankSelfRoundHandler', true, this.$dialog);
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
			selfupdate: function(data) {
				this.$dialog.find('.jf').text(data.in || 0);
				this.$dialog.find('.pm').text(data.rk || '暂无排名');

				getResult('api/lottery/integral/rank/top10', {}, 'callbackIntegralRankTop10RoundHandler', true, this.$dialog);
			},
			update: function(data) {
				var t = simpleTpl(),
					top10 = data.top10 || [],
					len = top10.length;
				
				for (var i = 0; i < len; i ++) {
					t._('<li>')
						._('<span class="r-avatar"><img src="'+ (top10[i].hi ? (top10[i].hi + '/64') : './images/danmu-head.jpg') +'" /></span>')
						._('<span class="r-name ellipsis">'+ (top10[i].nn || '匿名用户') +'</span>')
						._('<span class="r-rank">第'+ (top10[i].rk || '-') +'名</span>')
					._('</li>');
				}
				this.$dialog.find('ul').html(t.toString());
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rank-dialog">')
					._('<div class="dialog rank-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-yunnan-biancheng-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
						._('<div class="rank-content"><img class="rank-title" src="images/rank-title.png" /><p>剧终累积积分前十名获得云南特色礼包一份</p>')
						._('<h3>我的积分：<span class="jf"></span>排名<span class="pm"></span></h3>')
						._('<div class="list border">')
							._('<div class="content">')
								._('<ul></ul>')		
							._('</div>')
						._('</div></div>')
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-yunnan-biancheng-rankdialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>')
					._('<div class="fudai" data-collect="true" data-collect-flag="stv-yunnan-biancheng-rankdialog-clickbtn" data-collect-desc="领奖弹层-点击按钮"><p>恭喜您，答对啦~</p><h3>赶快打开看看吧~</h3><div class="fudai-round"></div><i>打开</i></div>')
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

				$('.lottery-dialog').css({
					'width': winW,
					'height': winH * 0.9
				});
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
					name = $.trim($name.val());

					me.disable();
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile
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
							this.$dialog.find('.awardwin-tips').html(data.tt || '');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.find('.address').val(data.ad || '');
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').removeClass('redbag');
						} else if (data.pt === 2) { //积分
							this.$dialog.find('.awardwin-tips').html(data.tt || '');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').removeClass('redbag');
						} else if (data.pt === 4) { //红包
							this.$dialog.find('.awardwin-tips').html(data.tt || '');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.addClass(this.LOTTERIED_CLS);
                    	 	recordUserPage(openid, "《边城》红包领奖页", '');
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').addClass('redbag');
							this.$dialog.find('.award-img').css({
								'margin': '20% auto'
							});
							this.$dialog.find('.award-win').css({
								'padding-top': '15%',
							});
							this.$dialog.find('.btn-red').attr('href', data.rp);
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
					$address = $('.address'),
					address = $.trim($address.val()),
					$name = $('.name'),
					name = $.trim($name.val());
				if (name.length > 20 || name.length == 0) {
					showTips('请输入您的姓名，不要超过20字哦!',4);
					$name.focus();
					return false;
				}else if (!/^\d{11}$/.test(mobile)) {
					showTips('这手机号，可打不通...',4);
					$mobile.focus();
					return false;
				}else if(address.length == 0){
					showTips('请填写正确的地址',4);
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
				$('.name').val('姓名:' + qname);
				$('.mobile').val(" ").attr("placeholder",'手机号码:' + qmobile);
				$('.address').val('收件地址:' + qaddress);
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-yunnan-biancheng-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					._('<div class="dialog lottery-dialog">')
						._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="back">')
									._('<div class="award-win none">')
										._('<h5 class="awardwin-tips"></h5>')
										._('<div class="award-img">')
											._('<img src="" />')
										._('</div>')
										._('<div class="contact">')
											._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
											._('<h4 class="awarded-tip">以下是您的联系方式</h4>')
											._('<p class="q-name"><input type="text" class="name" placeholder="姓名" /></p>')
											._('<p class="q-mobile"><input type="number" class="mobile" placeholder="手机号码" /></p>')
											._('<p class="q-address"><input type="text" class="address" placeholder="收件地址" /></p>')
											._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="tv-yunnan-biancheng-lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮">确定</a>')
											._('<a href="#" class="btn btn-red" data-collect="true" data-collect-flag="tv-yunnan-biancheng-lotterydialog-redbtn" data-collect-desc="抽奖弹层-领取现金按钮">领取</a>')
											._('<div class="share"><a href="#" class="btn btn-share">确定</a></div>')
										._('</div>')
									._('</div>')
									._('<div class="award-none none">')
										._('<h5>很遗憾，没中奖</h5>')
										._('<img src="./images/lottery-none.png">')
										._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-yunnan-biancheng-lotterydialog-backbtn" data-collect-desc="抽奖弹层-返回按钮">确定</a>')
									._('</div>')
								._('</div>')
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				
				return t.toString();
			}
		},
		success: {
			$dialog: null,
			open: function() {
				var me = this, $dialog = this.$dialog,
					winH = $(window).height(),
					winW = $(window).width();
				H.dialog.open.call(this);
				this.event();
				this.$dialog.find('.qrbox').css({
					'width': winW,
					'height': winH
				});
				this.$dialog.removeClass('qr');
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
				// this.$dialog && this.$dialog.remove();
				// this.$dialog = null;
			},
			event: function() {
				var me = this,
				$success = this.$dialog.find('.success');
				$successClose = this.$dialog.find('.btn-close');
				if (H.dialog.successFlag) {
					H.dialog.successFlag = false;
					$success.click(function(e) {
						e.preventDefault();
						me.$dialog.addClass('qr');
					});
					$successClose.click(function(e) {
						me.close();
					});
				} else {
					return;
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="success-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-yunnan-biancheng-successdialog-closebtn" data-collect-desc="领奖成功弹层-关闭按钮"></a>')
					._('<div class="success" data-collect="true" data-collect-flag="tv-yunnan-biancheng-successdialog-clickbtn" data-collect-desc="领奖成功弹层-点击按钮"><div class="success-round"></div><p>领取成功</p><i>关注微店公众号</i></div>')
					._('<div class="qrbox"><img src="./images/qrcode.png" border="0"></div>')
				._('</section>');
				return t.toString();
			}
		}
	};
	
	// 抽奖
	// W.callbackLotteryLuckHandler = function(data) {
	// 	H.dialog.lottery.open(data);
	// };
	
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
})(Zepto);

$(function() {
	H.dialog.init();
});