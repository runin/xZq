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
			this.$container.delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
				H.index.hideLottery();
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
		fudai: {
			$dialog: null,
			open: function() {
				var me = this, $dialog = this.$dialog,
				winH = $(window).height();
				H.dialog.open.call(this);
				this.pre_dom();
				//$('.fudai').css('height', Math.ceil(winH*0.7));
				this.event();
			},
			pre_dom: function(){
				var winW = $(window).width(),
					winH = $(window).height();
				$('.fudai').css({
					"top": (winH - 404)/2 + 'px',
					"left": (winW - 285)/2 + 'px'
				});
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="sy-news-fudaidialog-closebtn" data-collect-desc="福袋弹层-关闭按钮"></a>')
					._('<div class="fudai" data-collect="true" data-collect-flag="sy-news-fudaidialog-openbtn" data-collect-desc="福袋弹层-打开按钮"><!--<p>红包到手，打开看看吧</p><i>打&nbsp;开</i>--></div>')
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
				$('.lottery-dialog').css('height', Math.ceil(winH*0.7));
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
					var $name = $('.name'),
					name = $.trim($name.val()),
					$mobile = $('.mobile'),
					mobile = $.trim($mobile.val());
					me.disable();
					getResult('api/lottery/award', {
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
			},
			update: function(data) {
				if (data != null && data != '') {
					if (data.result) {
						if (data.pt === 1) { //实物奖品
							this.$dialog.find('.awardwin-tips label').html(data.pn || '');
							this.$dialog.find('.awarded-tip').text(data.aw || '');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
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
				var $name = $('.name'),
					name = $.trim($name.val()),
					$mobile = $('.mobile'),
					mobile = $.trim($mobile.val());
				if (name.length > 20 || name.length == 0) {
					showTips('请输入您的姓名，不要超过20字哦!');
					$name.focus();
					return false;
				}else if (!/^\d{11}$/.test(mobile)) {
					alert('这手机号，可打不通...');
					$mobile.focus();
					return false;
				};
				return true;
			},
			enable: function() {
				this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
			},
			disable: function() {
				this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
			},
			succ: function() {
				var me = this, $qname = $('.dialog').find('.name'), qname = $qname.val(), 
				$qmobile = $('.dialog').find('.mobile'), qmobile = $qmobile.val();
				this.$dialog.addClass(this.AWARDED_CLS);
				qname = $('.name').val();
				qmobile = $('.mobile').val();
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
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="sy-news-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					._('<div class="lottery-dialog">')
						._('<div class="award-win none">')
							._('<h5 class="awardwin-tips">人品大爆发，恭喜您中了<br><label></label></h5>')
							._('<div class="award-img">')
								._('<img src="" />')
							._('</div>')
							._('<div class="contact">')
								._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
								._('<h4 class="awarded-tip"><!--请耐心等我们工作人员的电话，安排时间到电视台门口领奖。--></h4>')
								._('<p class="q-name"><input type="text" class="name" placeholder="姓名" /></p>')
								._('<p class="q-mobile"><input type="tel" class="mobile" placeholder="手机号码" /></p>')
							._('</div>')
							._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="sy-news-lotterydialog-awardCommitbtn" data-collect-desc="抽奖弹层-中奖确认按钮">确定</a>')
							._('<a href="#" class="btn btn-close" data-collect="true" data-collect-flag="sy-news-lotterydialog-awardClosebtn" data-collect-desc="抽奖弹层-中奖关闭按钮">好的</a>')
						._('</div>')
						._('<div class="award-none none">')
							._('<h5>太可惜了，大奖与您擦肩而过<br>下次换个姿势吧</h5>')
							._('<img src="./images/icon_nofun.png">')
							._('<a href="#" class="btn btn-close" data-collect="true" data-collect-flag="sy-news-lotterydialog-awardnoneClosebtn" data-collect-desc="抽奖弹层-未中奖关闭按钮">返回</a>')
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