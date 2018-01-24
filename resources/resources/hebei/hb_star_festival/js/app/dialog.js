(function($) {

	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		pt: 0,
		quan_link: '',
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
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': '-8px', 'top': '-8px'})
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
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="hb-star-festival-guide-trybtn" data-collect-desc="引导弹层-关闭按钮">等下就去试试</a>')
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
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hb-star-festival-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2>活动规则</h2>')
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
					pu: H.answer.actuid
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
					pu: H.answer.actuid
				}, 'callbackIntegralRankTop10RoundHandler', true, this.$dialog);
			},
			update: function(data) {
				
				var t = simpleTpl(),
					items = data.top10 || [],
					len = items.length;
				
				for (var i = 0; i < len; i ++) {
					t._('<li>')
						._('<span class="r-avatar"><i></i><img src="'+ (items[i].hi ? (items[i].hi + '/' + 0) : './images/avatar.jpg') +'" /></span>')
						._('<span class="r-rank"><span class="jf-num">积分:</span>'+ (items[i].in || '-') +'</span>')
					._('</li>');
				}
				this.$dialog.find('ul').html(t.toString());
			},
			
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="rank-dialog">')
					._('<div class="dialog rank-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hb-star-festival-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
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
			redpack: '',
			isSbtRed: false,
			open: function(data) {
				var me = this, $dialog = this.$dialog;
				getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
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
				this.$dialog.find('.img-red').click(function(e){
					e.preventDefault();
					if(me.isSbtRed){
						return;
					}
					me.isSbtRed = true;
					toUrl(me.redpack);
				});
				this.$dialog.find('.btn-award').click(function(e) {
					e.preventDefault();
					if (!me.check()) {
						return false;
					}
					var mobile = $.trim(me.$dialog.find('.mobile').val()),
						name = $.trim(me.$dialog.find('.name').val()),
						idc = $.trim(me.$dialog.find('.idc').val());
					
					me.disable();

					shownewLoading(null,'请稍后...');
					$.ajax({
						type: 'GET',
						async: true,
						url: H.dialog.quan_link + "?temp=" + new Date().getTime(),
						dataType: "jsonp",
						data: { country: 86, phone: mobile },
						jsonpCallback: 'getCouponCallback',
						complete: function() {hidenewLoading()},
						success: function (data) {
							if (data.result.status == 1) {
								getResult('api/lottery/award', {
									oi: openid,
									rn: encodeURIComponent(name),
									ph: mobile,
									ic: encodeURIComponent(idc)
								}, 'callbackLotteryAwardHandler', true);
								showTips("恭喜您！领取成功~");
							} else if (data.result.status == 0) {
								showTips("该手机号已领取过哦~<br>换个手机试试吧！");
								me.$dialog.find('.mobile').val('');
							} else {
								showTips("很抱歉！领取失败了");
							}
						}
					});


				});
				this.$dialog.find('.btn-back').click(function(e) {
					e.preventDefault();

					me.close();
				});

			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			update: function(data) {
				if(data){
					if (data.result) {
						//pt : 0 谢谢参与
						//pt : 1 普通奖品
						//pt : 2 积分
						// 中奖后
						H.dialog.pt = data.pt;
						if(data.pt != 0){
							if(data.pt == 4){
								this.$dialog.find('img.zj-img').attr('src', (data.pi || ''));
								H.dialog.lottery.redpack = data.rp;
								this.$dialog.find('.award-red').removeClass('none');
								return;
							}else if(data.pt == 9){
								H.dialog.quan_link = data.aa;
								$('.wailian').attr("href", data.ru);
							}
							this.$dialog.find('h3').text(data.tt || '');
							this.$dialog.find('.award-win img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.find('.address').val(data.ad || '');
							this.$dialog.find('.award-win').removeClass('none');
						}else{
							//谢谢参与
							this.$dialog.find('.award-none').removeClass('none');
						}
					}else{
						this.$dialog.find('.award-none').removeClass('none');
					}
				}else{
					this.$dialog.find('.award-none').removeClass('none');
				}
			},
			
			check: function() {
				var me = this, $mobile = me.$dialog.find('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = me.$dialog.find('.name'),
					name = $.trim($name.val()),
					$idc = me.$dialog.find('.idc'),
					idc = $.trim($idc.val());

				if (((me.name && me.name == name) && me.mobile && me.mobile == phone)
				/*&& (me.address && me.address == address)*/) {
					return;
				}

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
				this.$dialog.find('.idc').hide();
				this.$dialog.find('.share').removeClass('none');
				this.$dialog.find('input').attr('disabled', 'disabled');
				if(H.dialog.pt == 9){
					this.$dialog.find('.wailian').removeClass('none');
					this.$dialog.find('h3').addClass('none');
				}
			},
			
			reset: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			
			close: function() {
				this.$dialog.find('.btn-close').trigger('click');
				if(H.dialog.pt == 9){
					this.$dialog.find('.wailian').addClass('none');
					this.$dialog.find('h3').removeClass('none');
				}
			},
			
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hb-star-festival-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="back">')
								
									._('<div class="award-win none">')
										._('<div class="award-img">')
											._('<img src="" />')
										._('</div>')
										._('<h3></h3>')
										._('<a href="" class="wailian none" data-collect="true" data-collect-flag="hb-star-festival-lotterydialog-wailian" data-collect-desc="抽奖弹层-口袋购物外链">现在就去使用</a>')
										._('<div class="contact">')
											._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
											._('<p><input type="text" class="name" placeholder="姓名" /></p>')
											._('<p><input type="number" class="mobile" placeholder="联系电话" /></p>')
											._('<p><input type="text" class="idc" maxlength="18" placeholder="身份证号码" /></p>')
											._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="hb-star-festival-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">确定</a>')
											._('<a href="#" class="outer btn-share yaoqing none" data-collect="true" data-collect-flag="tttj" data-collect-desc="天天淘金"></a>')
											._('<a href="#" class="btn btn-share btn-back" data-collect="true" data-collect-flag="hb-star-festival-lotterydialog-back-btn" data-collect-desc="抽奖弹层-返回按钮">返 回</a>')
										._('</div>')
									._('</div>')
									
									._('<div class="award-none none">')
										._('<img src="images/face.png" />')
										._('<h5>真遗憾，没有中奖<br/>下次加油哦~</h5>')
										._('<a href="#" class="btn btn-back" data-collect="true" data-collect-flag="hb-star-festival-lotterydialog-know-btn" data-collect-desc="抽奖弹层-我知道了按钮">我知道了</a>')
									._('</div>')

									._('<div class="award-red none">')
									._('<img class="zj-img" src="" />')
									._('<img class="img-red" src="images/red_bg.png"  data-collect="true" data-collect-flag="hb-star-festival-lotterydialog-img-red" data-collect-desc="领奖"/>')
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
							._('<a href="#" class="btn btn-confirm" data-collect="true" data-collect-flag="hb-star-festival-lotterydialog-tip-btn" data-collect-desc="抽奖弹层-返回填写信息按钮">返回填写</a>')
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
	};

	W.callbackIntegralRankSelfRoundHandler = function(data) {
		if (data.result) {
			H.dialog.rank.selfupdate(data);
		}
	};

	W.callbackIntegralRankTop10RoundHandler = function(data) {
		$('.rank-dialog .infor').text(H.answer.dc);
		if (data.result) {
			H.dialog.rank.update(data);
			//H.dialog.rank.update(rankData);
		}
	};
	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			if(data.url && data.desc){
				$('.outer').text(data.desc).attr('href', data.url).removeClass('none');
			}
		}
	}
})(Zepto);

$(function() {
	H.dialog.init();
});
