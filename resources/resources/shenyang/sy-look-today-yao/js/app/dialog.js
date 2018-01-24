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
				$('.fudai').removeClass('bounceInDown');
				$('.lottery-dialog').addClass('bounceOutUp');
				setTimeout(function(){
					$('.lottery-dialog').closest('.modal').addClass('none');
					H.index.hideLottery();
				},1500);
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
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.10 + 5, 'top': (height-295)/2 + 10})
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
				$('.fudai').addClass('bounceInDown');
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this,
				$fudai = this.$dialog.find('.fudai');

					$fudai.click(function(e) {
						e.preventDefault();
						if (H.dialog.clickFlag) {
							H.dialog.clickFlag = false;
						}else{
								return;
							};
						setTimeout(function() {
							shownewLoading();
			                $.ajax({
			                    type : 'GET',
			                    async : false,
			                    url : domain_url + 'api/lottery/luck',
			                    data: { oi: openid },
			                    dataType : "jsonp",
			                    jsonpCallback : 'callbackLotteryLuckHandler',
			                    complete: function() {
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
						me.close();
					});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="fudai-dialog">')
					._('<div class="fudai animated" data-collect="true" data-collect-flag="sy-news-fudaidialog-openbtn" data-collect-desc="福袋弹层-打开按钮">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="sy-news-fudaidialog-closebtn" data-collect-desc="福袋弹层-关闭按钮"></a>')
						._('<h2>恭喜您，获得一个红包<br/>赶快打开看看里面有什么吧！</h2>')
						._('<img class="redpack" src="images/redpack.png">')
						._('<a class="btn">打 开</a>')
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
				this.$dialog.find('.btn-award').click(function(e) {
					e.preventDefault();
					if (!me.check()) {
						return false;
					};
					var $mobile = $('.mobile'),
					mobile = $.trim($mobile.val());
					me.disable();
					getResult('api/lottery/award', {
						oi: openid,
						ph: mobile
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
				/*this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				});*/
			},
			update: function(data) {
				if (data != null && data != '') {
					if (data.result) {
						if (data.pt === 1) { //实物奖品
							this.$dialog.find('.awardwin-tips').html(data.tt || '');
							this.$dialog.find('img').attr('src', (data.pi || ''));
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
				var $mobile = $('.mobile'),
					mobile = $.trim($mobile.val());
				if (!/^\d{11}$/.test(mobile)) {
					showTips('这手机号，可打不通...');
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
				var me = this, $qmobile = $('input');
				this.$dialog.addClass(this.AWARDED_CLS);
				$qmobile.addClass('q-mobiled');
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
					._('<div class="lottery-dialog animated">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="sy-news-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						._('<div class="award-win none">')
							._('<h5 class="awardwin-tips"></h5>')
							._('<div class="award-img">')
								._('<img src="" />')
							._('</div>')
							._('<div class="contact">')
								._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
								._('<h4 class="awarded-tip">请耐心等我们工作人员的电话，安排时间到电视台门口领奖。</h4>')
								._('<p class="q-mobile"><input type="tel" class="mobile" placeholder="手机号码" /></p>')
							._('</div>')
							._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="sy-news-lotterydialog-awardCommitbtn" data-collect-desc="抽奖弹层-中奖确认按钮">领 取</a>')
							._('<a href="#" class="btn btn-close" data-collect="true" data-collect-flag="sy-news-lotterydialog-awardClosebtn" data-collect-desc="抽奖弹层-中奖关闭按钮">好 的</a>')
						._('</div>')
						._('<div class="award-none none">')
							._('<h2>太遗憾了，没中奖！</h2>')
							._('<h5>您与奖品的缘分就这么擦肩而过了<br>没关系，继续加油！</h5>')
							._('<a href="#" class="btn btn-close" data-collect="true" data-collect-flag="sy-news-lotterydialog-awardnoneClosebtn" data-collect-desc="抽奖弹层-未中奖关闭按钮">继续加油</a>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		}
	};
	W.callbackLotteryAwardHandler = function(data) {
		if (data.result) {
			H.dialog.lottery.succ();
			return;
		}
	};
})(Zepto);

$(function() {
	H.dialog.init();
});