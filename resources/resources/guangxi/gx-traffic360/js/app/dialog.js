(function($) {
	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		clickFlag: true,
		funnyFlag: true,
		successFlag: true,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function(e) {
				e.preventDefault();
				H.dialog.rule.open();
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
					'height': height * 0.56, 
					'left': width * 0.06,
					'right': width * 0.06,
					'top': height * 0.22,
					'bottom': height * 0.22
				});
			});
		},
		guide: {
			$dialog: null,
			open: function() {
				var me = this;
				H.dialog.open.call(this);
				this.event();
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
						._('<div class="content">')
							._('<div class="tips">')
								._('<p>1.打开电视，锁定广西睛彩交通频道</p>')
								._('<p>2.打开微信，进入摇一摇(电视)</p>')
								._('<p>3.对着电视摇一摇，赢取奖品</p>')
							._('</div>')
						._('</div>')
						._('<a href="#" class="btn-try" data-collect="true" data-collect-flag="gx-traffic360-guide-trybtn" data-collect-desc="引导弹层-关闭按钮">')
							._('<img src="./images/index-guide-btn.png">')
						._('</a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
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
						._('<div class="content">')
							._('<h2>活动规则</h2>')
							._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="gx-traffic360-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
							._('<div class="rule"></div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="gx-traffic360-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
					._('<div class="dialog rank-dialog">')
						._('<div class="rank-content"><p>积分使用方法请参考活动规则</p>')
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
		wrong: {
			$dialog: null,
			open: function() {
				var me = this, $dialog = $(".wrong-dialog");
				H.dialog.open.call(this);
				this.event();
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
				this.$dialog.find('.btn-goOn').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="wrong-dialog">')
					._('<div class="wrong">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="gx-traffic360-fudaidialog-closebtn" data-collect-desc="答错弹层-关闭按钮"></a>')
						._('<div class="wrong-box">')
							._('<h1>非常遗憾，答错啦！</h1>')
							._('<p>上知天文,下知地理,才能得到更多人的喜欢</p>')
							._('<a href="#" class="btn-red btn-goOn" data-collect="true" data-collect-flag="gx-traffic360-fudaidialog-closebtn" data-collect-desc="答错福袋弹层-关闭按钮">继续加油</a>')
						._('</div">')
					._('</div">')
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
				$fudai = this.$dialog.find('.fudai-box img');
				if (H.dialog.clickFlag) {
					H.dialog.clickFlag = false;
					$fudai.click(function(e) {
						e.preventDefault();
						setTimeout(function() {
							shownewLoading();
			                $.ajax({
			                    type : 'GET',
			                    async : false,
			                    url : domain_url + 'api/lottery/luck',
			                    data: { oi: openid},
			                    dataType : "jsonp",
			                    jsonpCallback : 'callbackLotteryLuckHandler',
			                    complete: function() {
			                    	me.close();
			                        hidenewLoading();
			                    },
			                    success : function(data) {
			                    	H.dialog.lottery.open(data);
			                    },
			                    error : function() {
			                    	H.dialog.lottery.open(null);
			                    }
			                });
						}, 5);
						
					});
				} else {
					return;
				};
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="fudai-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="gx-traffic360-fudaidialog-closebtn" data-collect-desc="福袋弹层-关闭按钮"></a>')
					._('<div class="fudai">')
						._('<p>恭喜您答对啦<br /> 送您一个红包，打开看看吧</p>')
						._('<div class="fudai-box" data-collect="true" data-collect-flag="gx-traffic360-fudaidialog-clickbtn" data-collect-desc="福袋弹层-点击按钮">')
							._('<img src="images/open.png"/>')
							._('<p class="fudai-tip ">静静的等待我来拆</p>')
						._('</div>')
					._('</div>')
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
				this.$dialog.find('.btn-goOn').click(function(e) {
					e.preventDefault();
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				});
//				this.$dialog.find('.btn-award').click(function(e) {
//					e.preventDefault();
//
//					if (!me.check()) {
//						return false;
//					};
//					
//					var $mobile = $('.mobile'),
//					mobile = $.trim($mobile.val()),
//					$name = $('.name'),
//					name = $.trim($name.val());
//
//					me.disable();
//					getResult('api/lottery/award', {
//						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
//						hi: headimgurl ? headimgurl : "",
//						oi: openid,
//						rn: encodeURIComponent(name),
//						ph: mobile
//					}, 'callbackLotteryAwardHandler', true, me.$dialog);
//				});
//				
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
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
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').removeClass('redbag');
							this.$dialog.removeClass("getred");
						} else if (data.pt === 2) { //积分
							this.$dialog.find('.awardwin-tips').html(data.tt || '');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').removeClass('redbag');
							this.$dialog.removeClass("getred");
						} else if (data.pt === 4) { //红包
							this.$dialog.find('.awardwin-tips').html(data.tt || '');
							this.$dialog.find('.award-img img').attr('src', (data.pi || ''));
							this.$dialog.addClass(this.LOTTERIED_CLS + " getred");
                    	 	recordUserPage(openid, "广西《交通360》红包领奖页", '');
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.award-none').addClass('none');
							this.$dialog.find('.btn-get').attr('href', data.rp);
						  } else {
							this.$dialog.find('.award-win').addClass('none');
							this.$dialog.find('.award-none').removeClass('none');
						  }
 					} else {
 						this.$dialog.find('.award-win').addClass('none');
						this.$dialog.find('.award-none').removeClass('none');
 					}
				} else {
					this.$dialog.find('.award-win').addClass('none');
					this.$dialog.find('.award-none').removeClass('none');
				}
				this.$dialog.removeClass(this.REQUEST_CLS);
			},
			check: function() {
				var $mobile = $('.mobile'),
					mobile = $.trim($mobile.val()),
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
				$('.q-name').html('姓名:' + qname);
				$('.q-mobile').html('手机号码:' + qmobile);
			},
			reset: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			close: function() {
				this.$dialog.find('.btn-close').trigger('click');
			},
			tpl: function() {
				var t = simpleTpl(), randomPic = Math.ceil(7*Math.random());
				
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
						._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="back">')
									._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="gx-traffic360-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
									._('<div class="award-win none">')
										._('<h1>太棒啦~</h1>')
										._('<p class="awardwin-tips"></p>')
										._('<div class="award-img">')
											._('<img src="" />')
										._('</div>')
										._('<a href="#" class="btn-red btn-get" data-collect="true" data-collect-flag="gx-traffic360-lotterydialog-redbtn" data-collect-desc="中奖弹层-领取现金按钮">领&nbsp;&nbsp;&nbsp;取</a>')
									._('</div>')
									._('<div class="award-none none">')
										._('<h1>不好意思噢~</h1>')
										._('<p>您与红包的缘分还不够，继续努力吧~</p>')
										._('<div class="sad-box"><img src="images/sad.png"/></div>')
										._('<a href="#" class="btn-red btn-goOn" data-collect="true" data-collect-flag="gx-traffic360-award-none-closebtn" data-collect-desc="未中奖弹层-关闭按钮">再接再厉</a>')
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