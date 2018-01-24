(function($) {
	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		clickFlag: true,
		funnyFlag: true,
		successFlag: true,
		prizeType:0,
		prizeAmount:5,
		outerUrl:"http://m.chediandian.com/Activity/Lottery",
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

			$('.fudai-dialog').each(function() {
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 + 5, 'top': height * 0.06 + 5})
			});
			$(".dialog-inner").css({ 
				'width': width * 0.8, 
				'height': height * 0.8, 
			});
			var $box = $(this).find('.box');
			if ($box.length > 0) {
				$box.css('height', height * 0.38);
			}
		},
		guide: {
			$dialog: null,
			open: function() {
				var me = this, guideFlyW, guideFlyH, guideFlyMT, guideTipsT,
					winW = $(window).width(),
					winH = $(window).height();
				guideFlyW = guideFlyH = winW * 1.2;
				guideFlyMT = winH * 0.1;
				H.dialog.open.call(this);
				$('#guide-dialog .tips').css('top', Math.round(guideFlyMT + (guideFlyH * 0.34)));
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
							._('<img class="rollcity" src="./images/index-guide.png">')
							._('<div class="tips">')
								._('<p>1.打开电视，锁定云南卫视</p>')
								._('<p>2.打开微信，进入摇一摇(电视)</p>')
								._('<p>3.对着电视摇一摇，赢取奖品</p>')
							._('</div>')
						._('</div>')
						._('<a href="#" class="btn-try" data-collect="true" data-collect-flag="tv-jiangsu-week-luck-guide-trybtn" data-collect-desc="引导弹层-关闭按钮">返回</a>')
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
				var winW = $(window).width(),
					ruleDH = this.$dialog.height(),
					ruleW = $('.rule-dialog').width();
				var ruleH = Math.ceil(810 * ruleW / 523);
				var ruleTop = Math.ceil((ruleDH - ruleH) / 2);
				var ruleRight = Math.ceil((winW - ruleW) / 2);
				$('.rule-dialog').css({'height': ruleH, 'top': ruleTop});
				$('#rule-dialog .btn-close').css({'top': ruleTop,'right': ruleRight-10});
				$('body').addClass('noscroll');
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
				$('body').removeClass('noscroll');
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
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
					._('<img class="rule-top" src="images/rule.png" />')
						._('<div class="content">')
							._('<img class="border-top" src="images/border-top.png"/>')
							._('<div class="rule-content">')
								._('<div class="rule"></div>')
							._('</div>')
							._('<a href="#" class="btn-join btn-back" data-collect="true" data-collect-flag="tv-jiangsu-week-luck-rule-trybtn" data-collect-desc="规则弹层-关闭按钮">返回</a>')
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-jiangsu-week-luck-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
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
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				setTimeout(function(){
					me.close();
				},3000)
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
	
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="wrong-dialog">')
					._('<img class="wrong-title" src="images/wrong-title.png"/>')
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
							showLoading();
			                $.ajax({
			                    type : 'GET',
			                    async : false,
			                    url : domain_url + 'api/lottery/luck',
			                    data: { oi: openid,	dev:"ce"},
			                    dataType : "jsonp",
			                    jsonpCallback : 'callbackLotteryLuckHandler',
			                    complete: function() {
			                        hideLoading();
			                    },
			                    success : function(data) {
			                    	H.dialog.lottery.open(data);
			                    	me.close();
			                    },
			                    error : function() {
			                    	H.dialog.lottery.open(null);
			                    	me.close();
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
				t._('<section class="modal fudai-dialog" id="fudai-dialog">')
					._('<img class="right-title" src="images/right-title.png"/>')
					._('<div class="fudai-round">')
						._('<img class="fudai" src="images/fudai.png"/>')
						._(' <div class="copyright">页面由江苏电视台提供 <br />一真科技技术支持&Powered by holdfun.cn</div>')
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
				this.$dialog.find('#btn-award').click(function(e) {
					e.preventDefault();

					if (!me.check()) {
						return false;
					};
					
					var $mobile = $('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = $('.name'),
					name = $.trim($name.val());
//					$address = $('.address'),
//					address = $.trim($address.val());

					me.disable();
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile,
//						ad: encodeURIComponent(address),
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
				
				this.$dialog.find('#btn-red').click(function(e) {
					e.preventDefault();
//					me.$dialog && me.$dialog.remove();
//					me.$dialog = null;
					if(H.dialog.prizeType == 9&&H.dialog.outerUrl){
						window.location.href = H.dialog.outerUrl;
					}else if(H.answer.isEnd){
						toUrl("view.html");
					}else{
						me.$dialog && me.$dialog.remove();
						me.$dialog = null;
						me.close();
					}
				});
				this.$dialog.find('#btn-back').click(function(e) {
					e.preventDefault();
					if(H.answer.isEnd){
						toUrl("view.html");
					}else{
						me.$dialog && me.$dialog.remove();
						me.$dialog = null;
						me.close();
					}
				});
				
			},
			update: function(data) {
   				if (data != null && data != '') {
   					if (data.result) {
   					if (data.pt === 1) { //实物奖品
   							H.dialog.prizeType = 1;
   							this.$dialog.find('.awardwin-tips').html(data.tt || '');
   							this.$dialog.find('.award-img img').attr('src', (data.pi || ''));
   							this.$dialog.find('.name').val(data.rn || '');
   							this.$dialog.find('.mobile').val(data.ph || '');
   							this.$dialog.find('.address').val(data.ad || '');
   							this.$dialog.find('.awarded-tip').addClass("none");
   							this.$dialog.find('.award-tip').removeClass("none");
   							$("#btn-award").removeClass("none");
   							$("#btn-red").addClass("none");
	 						this.$dialog.find('.award-lottery').removeClass('none');
	 						this.$dialog.find('.award-none').addClass('none');
   							this.$dialog.find(".contact").removeClass("info-crm");
   							this.$dialog.addClass(this.LOTTERIED_CLS);
   						} else if (data.pt === 9) {
   							H.dialog.prizeType = 9;
   							H.dialog.outerUrl = data.ru;
							H.dialog.prizeAmount = data.aw;
							this.$dialog.find('.awardwin-tips').html(data.tt || '');
							this.$dialog.find('.award-img img').attr('src', (data.pi || ''));
   							this.$dialog.find('.name').val(data.rn || '');
   							this.$dialog.find('.mobile').val(data.ph || '');
   							this.$dialog.find('.q-address').addClass("none");
   							this.$dialog.find('.awarded-tip').addClass("none");
   							this.$dialog.find('.award-tip').removeClass("none");
   							this.$dialog.find("#btn-award").removeClass("none");
   							this.$dialog.find("#btn-red").addClass("none");
   							this.$dialog.find(".contact").removeClass("info-crm");
   							this.$dialog.find('.award-lottery').removeClass('none');
   							this.$dialog.find('.award-none').addClass('none');
   							this.$dialog.addClass(this.LOTTERIED_CLS);
   						}else {
   							H.dialog.prizeType = 0;
   							this.$dialog.find('.award-lottery').addClass('none');
   							this.$dialog.find('.award-none').removeClass('none');
							this.$dialog.addClass(this.LOTTERY_NONE_CLS);
   						}
					} else {
	   					H.dialog.prizeType = 0;
	   					this.$dialog.find('.award-lottery').addClass('none');
	   					this.$dialog.find('.award-none').removeClass('none');
	   					this.$dialog.addClass(this.LOTTERY_NONE_CLS);
   					}				
   				} else {
   					H.dialog.prizeType = 0;
   					this.$dialog.find('.award-lottery').addClass('none');
   					this.$dialog.find('.award-none').removeClass('none');
   					this.$dialog.addClass(this.LOTTERY_NONE_CLS);
   				}
   				this.$dialog.removeClass(this.REQUEST_CLS);
			},
			getPaySignType:function(mobile,pz,channel,timestamp){
				var key = "91quible4lfwm0za";
				var sign = mobile+""+pz+""+channel+""+timestamp+""+key;
				var md5SignValue = hex_md5(sign).toUpperCase();
				return md5SignValue;
			},
			check: function() {
				var $mobile = $('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = $('.name'),
					name = $.trim($name.val());
//					$address = $('.address'),
//					address = $.trim($address.val());
				if (name.length > 20 || name.length == 0) {
					showTips('请输入您的姓名，不要超过20字哦!',4);
					$name.focus();
					return false;
				}
				if (!/^\d{11}$/.test(mobile)) {
					showTips('这手机号，可打不通...',4);
					$mobile.focus();
					return false;
				}
//				if (address.length < 4&&H.dialog.prizeType == 1) {
//					showTips('请填写正确的地址',4);
//					$address.focus();
//					return false;
//				}
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
				var me = this, 
				$qmobile = $('.dialog').find('.mobile'),
				qmobile = $qmobile.val(),
				$name = $('.dialog').find('.name'),
				qname = $name.val();
//				$address = $('.dialog').find('.address'),
//				qaddress = $address.val();
				this.$dialog.find('.awarded-tip').removeClass("none");
				this.$dialog.find('.award-tip').addClass("none");
				this.$dialog.find("#btn-award").addClass("none");
				this.$dialog.find("#btn-red").removeClass("none");
				if(H.dialog.prizeType == 9){
					var timestamp = new Date().getTime();//积分
					var channel = 64;
					var md5SignValue = H.dialog.lottery.getPaySignType(qmobile,H.dialog.prizeAmount,channel,timestamp);
					H.dialog.outerUrl= H.dialog.outerUrl+"?mobile="+qmobile+"&value="+H.dialog.prizeAmount+"&channel="+channel+"&timestamp="+timestamp+"&sign="+md5SignValue;
					this.$dialog.find("#btn-red").html("立即领取").removeClass("none");
				}
				this.$dialog.find(".contact").addClass("info-crm");
				this.$dialog.addClass(this.AWARDED_CLS);
				$('.q-name').html('姓名：' + qname);
				$('.q-mobile').html('电话：' + qmobile);
//				$('.q-address').html('地址：' + qaddress);
				
			},
			reset: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			close: function() {
				$(this).closest('.modal').addClass('none');
			},
			tpl: function() {
				var t = simpleTpl(), randomPic = Math.ceil(7*Math.random());
				
				t._('<section class="modal" id="lottery-dialog">')
//					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-travel-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					._('<div class="dialog lottery-dialog">')
						._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="award-lottery none">')
									._('<img class="border-top" src="images/border-top.png" />')
										._('<div class="award-win">')
											._('<div class="award-img">')
												._('<img src="" />')
											._('</div>')
											._('<h5 class="awardwin-tips"></h5>')
											._('<div class="contact">')
												._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
												._('<h4 class="awarded-tip none">以下是您的联系方式</h4>')
												._('<p class="q-name"><label>姓名：</label><input type="text" class="name"/></p>')
												._('<p class="q-mobile"><label>电话：</label><input type="number" class="mobile" /></p>')
//												._('<p class="q-address"><label>地址：</label><input type="text" class="address" /></p>')
											._('</div>')
										._('</div>')
										._('<div class="contact-btn">')
											._('<a href="#" class="btn-join" id="btn-award" data-collect="true" data-collect-flag="tv-jiangsu-week-luck-lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮">确&nbsp&nbsp&nbsp定</a>')
											._('<a href="#" class="btn-join none" id="btn-red" data-collect="true" data-collect-flag="tv-jiangsu-week-luck-lotterydialog-confirmbtn" data-collect-desc="抽奖弹层-领取按钮">返&nbsp&nbsp&nbsp回</a>')
										._('</div>')
									._('</div>')
									 ._('<div class="award-none none">')
										._('<img src="images/not-lott.png">')
										._('<a href="#" class="btn-join" id="btn-back" data-collect="true" data-collect-flag="tv-jiangsu-week-luck-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮">返&nbsp&nbsp&nbsp回</a>')
									._('</div>')
							._('</div>')
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