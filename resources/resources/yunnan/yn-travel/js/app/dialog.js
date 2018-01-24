var issw = false;
(function($) {
	H.dialog = {
		pt: null,
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
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 + 5, 'top': height * 0.06 + 5})
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
						._('<a href="#" class="btn-try" data-collect="true" data-collect-flag="yn-travel-guide-trybtn" data-collect-desc="引导弹层-关闭按钮">')
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-travel-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
						._('<div class="content border">')
							._('<div class="rule none"></div>')
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-travel-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
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
		funny: {
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
				$funny = this.$dialog.find('.funny');
				if (H.dialog.funnyFlag) {
					H.dialog.funnyFlag = false;
					$funny.click(function(e) {
						e.preventDefault();
						me.close();
					});
				} else {
					return;
				};
			},
			tpl: function() {
				var t = simpleTpl(), randomPic = Math.ceil(7*Math.random());
				t._('<section class="modal" id="funny-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-travel-funnydialog-closebtn" data-collect-desc="随机图片弹层-关闭按钮"></a>')
					._('<div class="funny" data-collect="true" data-collect-flag="yn-travel-funnydialog-clickbtn" data-collect-desc="随机图片弹层-点击按钮"><p>真遗憾~ 答错了,下轮加油吧!</p><img src="./images/tips/' + randomPic + '.jpg"></div>')
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
						if(!H.answer.wxCheck){
		                    //微信config失败
		                    H.dialog.lottery.open(null);
		                } else {
		                	shownewLoading();
			                $.ajax({
			                    type : 'GET',
			                    async : false,
			                    url : domain_url + 'api/lottery/exec/luck' + dev,
			                    data: { matk: matk },
			                    dataType : "jsonp",
			                    jsonpCallback : 'callbackLotteryLuckHandler',
			                    timeout: 10000,
			                    complete: function() {
			                        hidenewLoading();
			                    },
			                    success : function(data) {
			                    	if (data.pt == 7) {
			                    		H.dialog.wxcardLottery.open(data);
			                    	} else {
			                    		H.dialog.lottery.open(data);
			                    	}
			                    },
			                    error : function() {
			                    	H.dialog.lottery.open(null);
			                    }
			                });
							recordUserOperate(openid, "调用抽奖接口", "doLottery");
		                }
		                me.close();
					});
				} else {
					return;
				};
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="fudai-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-travel-fudaidialog-closebtn" data-collect-desc="福袋弹层-关闭按钮"></a>')
					._('<div class="fudai" data-collect="true" data-collect-flag="yn-travel-fudaidialog-clickbtn" data-collect-desc="福袋弹层-点击按钮"><p>送上红包，速速打开</p><i>打&nbsp;开</i></div>')
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
			open: function(data) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(),
				winH = $(window).height();
				hideLoading($dialog);
				hidenewLoading($dialog);
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				this.$dialog && this.$dialog.removeClass('none');

				$('.lottery-dialog').css({
					'width': Math.round(winW * 0.9),
					'height': Math.round(winH * 0.8),
					'top' : Math.round(winH * 0.1),
					'left' : Math.round(winW * 0.05)
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
					name = $.trim($name.val()),
					$addr = $('.address'),
		 			addr = $.trim($addr.val());

					me.disable();
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile,
						ad:	encodeURIComponent(addr)
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
				var me = this;
				if (data != null && data != '') {
					if (data.result) {
						if (data.pt === 1) { //实物奖品
							issw = true;
							H.dialog.pt = 1;
							this.$dialog.find('.awardwin-tips').html(data.tt || '');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.find('.address').val(data.ad || '');
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').removeClass('redbag');
							this.$dialog.find('.btn-link').addClass('none');
							this.$dialog.removeClass("getred");
						} else if (data.pt === 2) { //积分
							H.dialog.pt = 2;
							$('.q-address').css("display","none");
							$('.notice').css("display","none");
							this.$dialog.find('.awardwin-tips').html(data.tt || '');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').removeClass('redbag');
							this.$dialog.find('.btn-link').addClass('none');
							this.$dialog.removeClass("getred");
						} else if (data.pt === 4) { //红包
							H.dialog.pt = 4;
							$('.q-address').css("display","none");
							$('.notice').css("display","none");
							this.$dialog.find('.awardwin-tips').html(data.tt || '');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.addClass(this.LOTTERIED_CLS + " getred");
                    	 	recordUserPage(openid, "云南卫视《你是我的旅伴》红包领奖页", '');
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').addClass('redbag');
							this.$dialog.find('.btn-red').attr('href', data.rp);
							this.$dialog.find('.btn-link').addClass('none');
						} else if (data.pt === 9) { //外链奖品
							H.dialog.pt = 9;
							$('.lottery-dialog').addClass('link-award');
							$('.q-address').css("display","none");
							$('.notice').css("display","none");
							this.$dialog.find('.awardwin-tips').html(data.tt || '');
							this.$dialog.find('.awardwin-info').html(data.pd || '');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							if (data.ru) {
								$('.btn-link').click(function(e) {
									e.preventDefault();
									shownewLoading();
						            $.ajax({
						                type : 'GET',
						                async : false,
						                url : domain_url + 'api/lottery/award',
						                data: {nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "", hi: headimgurl ? headimgurl : "", oi: openid},
						                dataType : "jsonp",
						                jsonp : "callback",
						                complete: function() {
						                },
						                success : function(data) {
						                },
						                error : function(xmlHttpRequest, error) {
						                }
						            });
									setTimeout(function(){
										location.href = data.ru;
									}, 100);
								});
							} else {
								$('.btn-link').html('关&nbsp;闭');
								$('.btn-link').click(function(e) {
									e.preventDefault();
									me.$dialog && me.$dialog.remove();
									me.$dialog = null;
								});
							}
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact > p, .award-tip').addClass('none');
							this.$dialog.find('a').addClass('none');
							this.$dialog.find('.btn-link').removeClass('none');
							this.$dialog.removeClass("getred");
						} else {
							$('.q-address').css("display","none");
							$('.notice').css("display","none");
							this.$dialog.find('.award-win').addClass('none');
							this.$dialog.addClass(this.LOTTERY_NONE_CLS);
						}
					} else {
						$('.q-address').css("display","none");
						$('.notice').css("display","none");
						this.$dialog.find('.award-win').addClass('none');
						this.$dialog.addClass(this.LOTTERY_NONE_CLS);
					}
				} else {
					$('.q-address').css("display","none");
					$('.notice').css("display","none");
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
					$addr = $('.addr'),
					addr = $.trim($addr.val());
				
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
				if(issw = true){
					$('.q-address').html('地址:' + qaddress);
				}
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-travel-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					._('<div class="dialog lottery-dialog">')
						._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="back">')
									._('<div class="award-win none">')
										._('<h5 class="awardwin-tips"></h5>')
										._('<div class="award-img">')
											._('<img src="" />')
										._('</div>')
										._('<p class="awardwin-info"></p>')
											._('<div class="contact">')
											._('<h3 class="notice"/></h3>')
											._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
											._('<h4 class="awarded-tip">以下是您的联系方式</h4>')
											._('<p class="q-name"><input type="text" class="name" placeholder="姓名" /></p>')
											._('<p class="q-mobile"><input type="tel" class="mobile" placeholder="手机号码" /></p>')
											._('<p class="q-address"><input type="text" class="address" placeholder="地址" /></p>')
											._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="yn-travel-lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮">确定</a>')
											._('<a href="#" class="btn btn-red" data-collect="true" data-collect-flag="yn-travel-lotterydialog-redbtn" data-collect-desc="抽奖弹层-领取现金按钮">领&nbsp;取</a>')
											._('<a href="#" class="btn btn-link" data-collect="true" data-collect-flag="yn-travel-lotterydialog-linkbtn" data-collect-desc="抽奖弹层-外链按钮">领&nbsp;取</a>')
											._('<div class="share"><a href="#" class="btn btn-share">返回</a></div>')
										._('</div>')
									._('</div>')
									._('<div class="award-none none">')
										._('<h5>真遗憾，与大奖擦身而过！</h5>')
										._('<p>再来一次吧!</p>')
										._('<img src="./images/tips/' + randomPic +'.jpg">')
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-travel-successdialog-closebtn" data-collect-desc="领奖成功弹层-关闭按钮"></a>')
					._('<div class="success" data-collect="true" data-collect-flag="yn-travel-successdialog-clickbtn" data-collect-desc="领奖成功弹层-点击按钮"><div class="success-round"></div><p>领取成功</p><i>关注微店公众号</i></div>')
					._('<div class="qrbox"><img src="./images/qrcode.png" border="0"></div>')
				._('</section>');
				return t.toString();
			}
		},
        wxcardLottery: {
			$dialog: null,
            ci:null,
            ts:null,
            si:null,
            pt:null,
            sto:null,
			open: function(data) {
                var me =this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
				   this.event();
				}
            	me.update(data);
                me.readyFunc();
			},
			close: function() {
				var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
            readyFunc: function(){
                var me = this;
                $('#btn-wxcardLottery-award').click(function(e) {
                    e.preventDefault();
                    if(!$('#btn-wxcardLottery-award').hasClass("flag")){
                        $('#btn-wxcardLottery-award').addClass("flag");
                        shownewLoading();
                        me.close();
                        me.sto = setTimeout(function(){
                            hidenewLoading();
                        },15000);
                        $('#btn-wxcardLottery-award').text("领取中");
                        setTimeout(function(){
                            me.wx_card();
                        },1000);
                    }
                });
            },
            wx_card:function(){
                var me = this;
                wx.addCard({
                    cardList: [{
                        cardId: me.ci,
                        cardExt: "{\"timestamp\":\""+ me.ts +"\",\"signature\":\""+ me.si +"\"}"
                    }],
                    success: function (res) {
                        H.answer.wxCheck = true;
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        hidenewLoading();
                    },
                    cancel:function(){
                        hidenewLoading();
                    }
                });
            },
			update: function(data) {
				var me = this;
                if(data.result && data.pt == 7){
                    me.pt = data.pt;
                    $(".wx").find(".award-img img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    $(".wx").find(".awardwin-tips").html(data.tt || '恭喜您获得');
                    me.ci = data.ci;
                    me.ts = data.ts;
                    me.si = data.si;
                }
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal wx" id="lottery-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-travel-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					._('<div class="dialog lottery-dialog">')
						._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="back">')
									._('<div class="award-win">')
										._('<h5 class="awardwin-tips"></h5>')
										._('<div class="award-img">')
											._('<img src="" />')
										._('</div>')
										._('<p class="awardwin-info">')
											._('<a href="javascript:void(0);" class="btn btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">领取</a>')
										._('</p>')
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
		if (H.dialog.pt != 9) {
			if (data.result) {
				H.dialog.lottery.succ();
				return;
			} else {
				showTips('亲，服务君繁忙！稍后再试哦！');
			}
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