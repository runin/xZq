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
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.10 + 5, 'top': height * 0.12 + 5})
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
					//me.close();
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
						._('<img src="./images/logos.png">')
						._('<div class="guide-content"><p class="ellipsis"><label>1</label>打开电视，锁定天津影视</p>')
						._('<p class="ellipsis"><label>2</label>打开微信，进入摇一摇(电视)</p>')
						._('<p class="ellipsis"><label>3</label>对着电视摇一摇</p>')
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="yn-warrior-guide-trybtn" data-collect-desc="引导弹层-关闭按钮">确定</a></div>')
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
				var ruleDH = this.$dialog.height(),
					ruleW = $('.rule-dialog').width();
				var ruleH = Math.ceil(782 * ruleW / 565);
				var ruleTop = Math.ceil((ruleDH - ruleH) / 2);
				$('.rule-dialog').css({'height': ruleH, 'top': ruleTop});
				$('#rule-dialog .btn-close').css({
					'top': ruleTop + ruleH * 0.01 ,
					"right": 0,
					"width":($(window).width() * 0.1),
					"height":($(window).width() * 0.1),
					"background-size": "100% 100%",
					"background-position": "0 0"
				});
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-warrior-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
						._('<div class="content border">领奖规则')
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
				var rankH = Math.ceil(782 * rankW / 565);
				var rankTop = Math.ceil((rankDH - rankH) / 2);
				$('.rank-dialog').css({'height': rankH, 'top': rankTop});
				$('#rank-dialog .btn-close').css('top', rankTop + rankH * 0.1);
				
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
						._('<span class="r-avatar"><img src="'+ (top10[i].hi ? (top10[i].hi + '/64') : './images/danmu-head.png') +'" /></span>')
						._('<span class="r-rank">第'+ (top10[i].rk || '-') +'名</span>')
						._('<span class="r-name ellipsis">积分：'+ (top10[i].in || '0') +'</span>')
					._('</li>');
				}
				this.$dialog.find('ul').html(t.toString());
			},
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="rank-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-warrior-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
					._('<div class="dialog rank-dialog">')
						._('<p>全剧剧终累积前三获得千元户外大礼包</p>')
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
		fudai: {
			$dialog: null,
			open: function() {
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				var rayW = $('.ray-box').width();
				var rayH = Math.round(rayW * 652 / 397);
				var rayT = Math.round(($(window).height() - rayH) / 2);
				$('.ray-box').css({'height':rayH,'top':rayT});
				this.scrollRay();
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			scrollRay: function() {
				var me = this;
				var el = document.querySelector('.fudai');
				var elStep = $(window).width() * 0.1;
			    var startPosition, endPosition, deltaX, deltaY, moveLength;
			    var clientHeight = $(window).height();
			    el.addEventListener('touchstart', function (e) {
			    	e.preventDefault();
			        var touch = e.touches[0];
			        startPosition = {
			            x: touch.pageX,
			            y: touch.pageY
			        }
			    });
			    el.addEventListener('touchmove', function (e) {
			    	e.preventDefault();
			        var touch = e.touches[0];
			        endPosition = {
			            x: touch.pageX,
			            y: touch.pageY
			        }
			        deltaX = endPosition.x - startPosition.x;
			        deltaY = endPosition.y - startPosition.y;
			        if(deltaY < 0) {
			        	moveLength = 0;
			        } else if (deltaY > 0) {
			        	moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2));
			        };
			    });
			    el.addEventListener('touchend', function (e) {
			    	e.preventDefault();
			    	var winW = $(window).height();
			        if (moveLength > 30) {
			        	$('.ray-guide').css('display', 'none');
			        	var $fudai = me.$dialog.find('.fudai');
						if (H.dialog.clickFlag) {
							H.dialog.clickFlag = false;
							$('.ray-box .ray').addClass('fx-ray');
							$('.ray-box .fire').addClass('fx-fire');
							setTimeout(function() {
								showLoading();
								$('.ray-box .ray').removeClass('fx-ray');
								$('.ray-box .fire').removeClass('fx-fire');
			        			$('.ray-guide').css('display', 'block');
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
								me.close();
							}, 1600);
						} else {
							return;
						};
			        };
			    });
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="fudai-dialog">')
					._('<div class="fudai" data-collect="true" data-collect-flag="yn-warrior-fudaidialog-clickbtn" data-collect-desc="福袋弹层-点击按钮">')
						._('<div class="ray-box">')
							._('<img class="ray" src="./images/ray.png">')
							._('<img class="fire" src="./images/fire.png">')
						._('</div>')
						._('<div class="ray-guide"><img src="./images/ray-guide.png"></div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		// 领取成功
		lingqu: {
			$dialog: null,
			open: function() {
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				this.event();
				var fudaiW = $(window).width();
				var fudaiH = $(window).height();
				$('.succ').css({
					'height': fudaiH*0.7
				});
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this,
				$fudai = this.$dialog.find('.succ');
					$fudai.click(function(e) {
						e.preventDefault();
						me.close();
					});
			},
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="succ-dialog">')
				._('<div class="succ" data-collect="true" data-collect-flag="yn-warrior-rankdialog-clickbtn" data-collect-desc="领奖弹层-点击按钮"><div class="chai"></div><div class="succ-round">恭喜您，领取成功</div></div>')
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
				setTimeout(function() {
					$('#lottery-dialog').animate({'opacity':'1'});
				}, 500);
				$("#ddtj").addClass("none");
				getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
				H.dialog.clickFlag = true;
				var lotteryW = $('.lottery-dialog').width();
				var lotteryH = Math.ceil(lotteryW * 826 / 565);
				var lotteryTop = Math.ceil((winH - lotteryH) / 2);
				$('.lottery-dialog').css({
					'height': lotteryH,
					'top': lotteryTop
				});
				if (!$dialog) {
					this.event();
				}
				this.$dialog && this.$dialog.removeClass('none');
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
					name = $.trim($name.val()),
					$address = $('.address'),
					address = $.trim($address.val());

					me.disable();
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile,
						ad: encodeURIComponent(address)
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
				
				this.$dialog.find('#btn-back').click(function(e) {
					e.preventDefault();
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				});
				
				this.$dialog.find('.btn-share').click(function(e) {
					e.preventDefault();
					me.$dialog.find('.btn-close').trigger('click');
					me.reset();
					// share();
				});
				this.$dialog.find('.redbtn').click(function(e) {
					e.preventDefault();
					// showTips($(this).attr("data-href"));
					location.href = $(this).attr("data-href");
				});
			},
			update: function(data) {
				if (data != null && data != '') {
					if (data.result) {
						if (data.pt === 1) { //实物奖品
							this.$dialog.find('.award-tip').removeClass("none");
							this.$dialog.find('.prize-img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.find('.address').val(data.ad || '');
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').removeClass('none');
							this.$dialog.find('.award-img').removeClass('none');
							$('.lottery-dialog').css({
								'background': 'url(./images/open-bg.png) top no-repeat',
								'background-size': '100% auto'
							});
						} else if (data.pt === 2) { //积分
							this.$dialog.find('.award-tip').removeClass("none");
							this.$dialog.find('.prize-img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.find('.address').val(data.ad || '');
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').removeClass('none');
							this.$dialog.find('.award-img').removeClass('none');
							$('.lottery-dialog').css({
								'background': 'url(./images/open-bg.png) top no-repeat',
								'background-size': '100% auto'
							});
						} else if (data.pt === 4) { //红包
							this.$dialog.find('.red-img').attr('src', (data.pi || ''));
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').addClass('none');
							this.$dialog.find('.redcontact').removeClass('none');
							this.$dialog.find('.redbtn').attr("data-href",data.rp);
							this.$dialog.find('.award-img').addClass('none');
							$('.lottery-dialog').css({
								'background': 'url(./images/redbg.png) top no-repeat',
								'background-size': '100% auto'
							});
						} else {
							this.$dialog.find('.award-win').addClass('none');
							this.$dialog.addClass(this.LOTTERY_NONE_CLS);
							$('.lottery-dialog').css({
								'background': 'url(./images/open-bg.png) top no-repeat',
								'background-size': '100% auto'
							});
						}
					} else {
						this.$dialog.find('.award-win').addClass('none');
						this.$dialog.addClass(this.LOTTERY_NONE_CLS);
						$('.lottery-dialog').css({
							'background': 'url(./images/open-bg.png) top no-repeat',
							'background-size': '100% auto'
						});
					}
				} else {
					this.$dialog.find('.award-win').addClass('none');
					this.$dialog.addClass(this.LOTTERY_NONE_CLS);
					$('.lottery-dialog').css({
						'background': 'url(./images/open-bg.png) top no-repeat',
						'background-size': '100% auto'
					});
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
					showTips('请输入您的姓名，不要超过20字哦!',4);
					$name.focus();
					return false;
				}else if (!/^\d{11}$/.test(mobile)) {
					showTips('这手机号，可打不通...',4);
					$mobile.focus();
					return false;
				}else if (address.length < 5 || address.length > 60 || address.length == 0) {
					showTips('地址长度为5~60个字符',4);
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
			fillDdtj: function(data) {
				if (data.code == 0 && data.desc && data.url) {
					$('#ddtj').text(data.desc || '').attr('href', (data.url || ''));
				} else {
					$('#ddtj').remove();
				};
			},
			succ: function() {
				this.$dialog.addClass(this.AWARDED_CLS);
				this.$dialog.find("input").attr("disabled","disabled");
				$(".award-tip").addClass("none");
				$(".awarded-tip").removeClass("none");
				$("#btn-award").addClass("none");
				$("#btn-back").removeClass("none");
				$("#ddtj").removeClass("none");
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
					._('<div class="lottery-dialog">')
						._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="back">')
									._('<div class="award-win none">')
										._('<div class="award-img">')
											._('<img class="prize-img" src="" />')
										._('</div>')
										._('<div class="contact none">')
											._('<h4 class="award-tip none">请填写您的联系方式，以便顺利领奖</h4>')
											._('<h4 class="awarded-tip none">以下是您的联系方式</h4>')
											._('<p class="q-name"><input type="text" class="name" placeholder="姓名" /></p>')
											._('<p class="q-mobile"><input type="number" class="mobile" placeholder="手机号码" /></p>')
											._('<p class="q-address"><input type="text" class="address" placeholder="收件地址" /></p>')
											._('<a class="ddtj none" id="ddtj" href="" data-collect="true" data-collect-flag="tttj" data-collect-desc="天天淘金" ></a>')
											._('<a href="#" class="btn btn-award" id="btn-award" data-collect="true" data-collect-flag="yn-warrior-lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮">确定</a>')
											._('<a href="#" class="btn none" id="btn-back" data-collect="true" data-collect-flag="yn-warrior-lotterydialog-OKbtn" data-collect-desc="抽奖弹层-返回按钮">返回</a>')
										._('</div>')
										._('<div class="redcontact none">')
											._('<img class="red-now" src="./images/red-tip.png">')
											._('<img class="red-img" src="">')
											._('<a href="#" class="btn redbtn" data-collect="true" data-collect-flag="yn-warrior-lotterydialog-redbtn" data-collect-desc="抽奖弹层-红包领取按钮"></a>')
										._('</div>')
									._('</div>')
									._('<div class="award-none none">')
										._('<h5>很遗憾，您未抽中奖品</h5>')
										._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-warrior-lotterydialog-backbtn" data-collect-desc="抽奖弹层-返回按钮">返回答题</a>')
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
			showTips('亲，服务君繁忙~ 稍后再试哦!');
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

	W.commonApiPromotionHandler = function(data) {
		H.dialog.lottery.fillDdtj(data);
	};
})(Zepto);

$(function() {
	H.dialog.init();
});
