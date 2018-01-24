(function($) {

	H.dialog = {
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		as: getQueryString('as'),
		iscroll: null,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-close', 'click', function(e) {
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
			$('.modal-guide').click(function(e){
				e.preventDefault();
				e.stopPropagation();
			});
			$('#rule-dialog').click(function(e){
				e.preventDefault();
				e.stopPropagation();
			});
			H.dialog.relocate();
		},
		
		relocate: function() {
			var height = $(window).height(),
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.06;

			$('.modal').each(function() {
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': '14px', 'top': '14px'})
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
						._('<p class="ellipsis"><label><img src="images/hb-1.jpg" /></label>锁定河北卫视《中华好民歌》</p>')
						._('<p class="ellipsis"><label><img src="images/hb-2.jpg" /></label>打开微信，进入摇一摇（电视）</p>')
						._('<p class="ellipsis"><label><img src="images/hb-3.jpg" /></label>对着电视摇一摇</p>')
						._('<p class="ellipsis"><label><img src="images/hb-4.jpg" /></label>参与互动就有机会赢取超值礼品</p>')
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="hb-folk-song-guide-trybtn" data-collect-desc="引导弹层-关闭按钮">等下就去试试</a>')
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
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hb-folk-song-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2><img src="images/hbrule-tlt.png"></h2>')
						._('<div class="content border">')
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

				getResult('api/lottery/integral/rank/self', {
					oi: openid,
					pu: getQueryString('actUid')
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

				getResult('api/lottery/integral/rank/top10', {
					pu: getQueryString('actUid')
				}, 'callbackIntegralRankTop10RoundHandler', true, this.$dialog);
			},
			update: function(data) {
				var t = simpleTpl(),
					items = data.top10 || [],
					len = items.length;
				
				for (var i = 0; i < len; i ++) {
					t._('<li>')
						._('<span class="r-avatar"><img src="'+ (items[i].hi ? (items[i].hi + '/' + 0) : './images/avatar.jpg') +'" /></span>')
						._('<span class="r-name">第<span class="jf-num">'+ (items[i].rk || '-') +'</span>名</span>')
						._('<span class="r-rank"><span class="jf-num">积分:</span>'+ (items[i].in || '-') +'</span>')
					._('</li>');
				}
				this.$dialog.find('ul').html(t.toString());
			},
			
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="rank-dialog">')
					._('<div class="dialog rank-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hb-folk-song-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
						._('<label class="infor"></label><h2>积分排行榜</h2>')
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
            pt: 0,
			open: function(data) {
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				H.dialog.lottery.update(data);
				hideLoading($dialog);
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
						name = $.trim(me.$dialog.find('.name').val()),
						address = $.trim(me.$dialog.find('.idc').val());
					
					me.disable();
					getResult('api/lottery/award', {
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile,
						ad: encodeURIComponent(address)
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
					
				});
				this.$dialog.find('.btn-back').click(function(e) {
					e.preventDefault();
					me.close_lottery();
				});
			},
			close_lottery: function() {
				var me = this;
				H.vote.get_port();
				this.$dialog.addClass('none');
				this.$dialog.find('input').removeAttr('disabled');
				this.$dialog.removeClass(this.AWARDED_CLS);
				this.$dialog.find('.btn-award').removeClass(me.REQUEST_CLS);
			},
			update: function(data) {
				if (data) {
					$('.lottery-btn').removeClass('requesting');
					if (data.result) {
						//pt : 0 谢谢参与
						// 中奖后
                        H.dialog.lottery.pt = data.pt;
						if(data.pt != 0){
							this.$dialog.find('.prize-tip').text(data.tt || '');
							this.$dialog.find('.award-img img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.find('.address').val(data.ad || '');
                            if(data.pt == 5 && data.cc){
                                this.$dialog.find('.duihuan span').text(data.cc || '');
                                this.$dialog.find('.duihuan').removeClass("none");
                                this.$dialog.find('.award-tip').text('(保存此截图，作为领奖唯一凭证)');
                            }
							this.$dialog.find('.award-win').removeClass('none');
						}else{
							//谢谢参与
							this.$dialog.find('.lottery-dialog').addClass('none');
							this.$dialog.find('.not-zhong').removeClass('none');
						}
					}else{
						this.$dialog.find('.lottery-dialog').addClass('none');
						this.$dialog.find('.not-zhong').removeClass('none');
					}
				}

			},
			
			check: function() {
				var me = this, $mobile = me.$dialog.find('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = me.$dialog.find('.name'),
					name = $.trim($name.val()),
					$address = me.$dialog.find('.address'),
					address = $.trim($address.val());

				if (((me.name && me.name == name) && me.mobile && me.mobile == phone)
				&& (me.address && me.address == address)) {
					return;
				}

				if (name.length < 2 || name.length > 30) {
					alert('姓名长度为2~30个字符');
					$name.focus();
					return false;
				}
				else if (!/^\d{11}$/.test(mobile)) {
					alert('这手机号，可打不通哦...');
					$mobile.focus();
					return false;
				} else if (address.length < 5 || address.length > 60) {
					alert('地址长度为5~60个字符');
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
				this.$dialog.find('.mobile').attr('type','text');
				var rn = "姓名：" + this.$dialog.find('.name').val(),
					ph = "电话：" + this.$dialog.find('.mobile').val(),
					ad = "地址：" + this.$dialog.find('.address').val();
				this.scroll_disable();
				this.$dialog.addClass(this.AWARDED_CLS);
                if(H.dialog.lottery.pt != 5){
                    this.$dialog.find('.award-tip').addClass('none');
                }
				this.$dialog.find('.share').removeClass('none');
				this.$dialog.find('.name').val(rn);
				this.$dialog.find('.mobile').val(ph);
				this.$dialog.find('.address').val(ad);
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
					._('<img class="not-zhong btn-back none" src="images/hbnot-zhong.png" />')
					._('<div class="dialog lottery-dialog">')
						._('<a href="#" class="btn-close btn-back" data-collect="true" data-collect-flag="hb-folk-song-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="back">')
								
									._('<div class="award-win none">')
										._('<div class="award-img">')
											._('<img src="" />')
										._('</div>')
										._('<h3 class="prize-tip">恭喜你，答对了！</h3>')
										._('<h3 class="duihuan none">兑换码：<span></span></h3>')
										._('<div class="contact">')
											._('<h4 class="award-tip">请填写您的联系方式,以便顺利领奖,<br/>若您不需要此奖品,请勿填写信息哦</h4>')
											._('<p><input type="text" class="name" placeholder="姓名" /></p>')
											._('<p><input type="number" class="mobile" placeholder="电话" /></p>')
											._('<p><input type="text" class="address" placeholder="地址" /></p>')
											._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="hb-folk-song-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">确定</a>')
											._('<a href="#" class="btn btn-share btn-back" data-collect="true" data-collect-flag="hb-folk-song-lotterydialog-back-btn" data-collect-desc="抽奖弹层-返回按钮">返 回</a>')
										._('</div>')
										._('<div class="cont-tip">')
                                            ._('<h4>中奖请咨询：全国热线—4006699616<br/>河北热线：0311-85691821</h4>')
										._('</div>')
									._('</div>')
									
									/*._('<div class="award-none none">')
										._('<img src="<!--images/face.png-->" />')
										._('<h5>真遗憾，没有中奖<br/>下次加油哦~</h5>')
										._('<a href="#" class="btn btn-back" data-collect="true" data-collect-flag="hb-folk-song-lotterydialog-know-btn" data-collect-desc="抽奖弹层-我知道了按钮">我知道了</a>')
									._('</div>')*/
								
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
							._('<a href="#" class="btn btn-confirm" data-collect="true" data-collect-flag="hb-folk-song-lotterydialog-tip-btn" data-collect-desc="抽奖弹层-返回填写信息按钮">返回填写</a>')
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
		if (data.result) {
			H.dialog.lottery.succ();
			return;
		} else {
			alert('亲，服务君繁忙！稍后再试哦！');
		}
	};

	W.callbackIntegralRankSelfRoundHandler = function(data) {
		if (data.result) {
			H.dialog.rank.selfupdate(data);
		}
	};

	W.callbackIntegralRankTop10RoundHandler = function(data) {
		//H.dialog.rank.update(rankData);
		if (data.result) {
			H.dialog.rank.update(data);
			$('.rank-dialog .infor').text(H.dialog.as);
		}
	};
	
})(Zepto);

$(function() {
	H.dialog.init();
});

