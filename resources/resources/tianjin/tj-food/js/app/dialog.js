(function($) {
	H.dialog = {
		$container: $('body'),
		init: function() {
			var me = this;
			this.$container.delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
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
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': '3px', 'top': '3px'})
			});
			$('.dialog').each(function() {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({ 
					'width': width * 0.88, 
					'height': height * 0.8, 
					'left': width * 0.06,
					'right': width * 0.06,
					'top': height * 0.1,
					'bottom': height * 0.1
				});
			});
		},
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
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
				this.$dialog.find('.rule-content').html(rule);
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tj-food-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<div class="content">')
							._('<h1>活动规则</h1>')
							._('<div class="rule-content"><div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		getLottery: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			event: function() {
				var me = this;
				$('#getLottery-dialog').click(function(e) {
					e.preventDefault();
					shownewLoading();
	                $.ajax({
	                    type : 'GET',
	                    async : false,
	                    url : domain_url + 'api/lottery/exec/luck' + dev,
	                    data: {
	                    	matk: matk,
	                    	sau: H.wall.guid
	                    },
	                    dataType : "jsonp",
	                    jsonpCallback : 'callbackLotteryLuckHandler',
	                    complete: function() {
	                        hidenewLoading();
							$('#btn-guid-' + H.wall.guid).removeClass('requesting');
	                    },
	                    success : function(data) {
	                    	H.dialog.lottery.open(data);
							$('#btn-guid-' + H.wall.guid).removeClass().addClass('btn-zaned').text('已赞');
	                    },
	                    error : function() {
	                    	H.dialog.lottery.open(null);
							$('#btn-guid-' + H.wall.guid).removeClass('requesting');
	                    }
	                });
					me.close();
					recordUserOperate(openid, "调用抽奖接口", "doLottery");
					recordUserPage(openid, "调用抽奖接口", 0);
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="getLottery-dialog">')
					._('<div class="dialog getLottery-dialog" data-collect="true" data-collect-flag="tj-food-getLotterydialog-open" data-collect-desc="福袋弹层-点击卡通抽奖">')
						._('<div class="content">')
							._('<h1>想要送您一份大礼<br>快点打开看看有什么吧~</h1>')
							._('<img src="./images/lottery.png">')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		lottery: {
			$dialog: null,
			open: function(data) {
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				H.dialog.lottery.update(data);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-back').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-ok').click(function(e) {
					e.preventDefault();
					getResult('api/lottery/award', {
						oi: openid,
						nn: (nickname ? encodeURIComponent(nickname) : encodeURIComponent('匿名用户'))
					}, 'callbackLotteryAwardHandler');
					me.close();
				});
			},
			update: function(data) {
				if (data && data.result) {
					if (data.pt == 5) {
						$('.lottery-dialog').removeClass('lottery-null');
						$('.award-img').attr('src', (data.pi || ''));
						$('.award-tip').html(data.tt || '恭喜您中奖了~');
						$('.award-reserved').html(data.pd || '');
						if (data.cc.split(',')[0]) {
							$('.award-code').text(('兑换码: ' + data.cc.split(',')[0]) || '');
						}
						if (data.cc.split(',')[1]) {
							$('.award-password').text(('密码: ' + data.cc.split(',')[1]) || '');
						}
					} else if (data.pt == 1) {
						$('.lottery-dialog').removeClass('lottery-null');
						$('.award-img').attr('src', (data.pi || ''));
						$('.award-tip').html(data.tt || '恭喜您中奖了~');
						$('.award-reserved').html(data.pd || '');
						$('.award-code, .award-password').addClass('none');
					} else if (data.pt == 9) {
		                if (data.ru.length == 0) {
		                    $('.lottery-dialog').addClass('lottery-null');
		                } else {
							$('.lottery-dialog').removeClass('lottery-null');
							$('.award-img').attr('src', (data.pi || ''));
							$('.award-tip').html(data.tt || '恭喜您中奖了~');
							$('.award-reserved').html(data.pd || '');
							$('.award-code, .award-password').addClass('none');
							$('.btn').addClass('none');
							$('.btn-link').removeClass('none');
							$('#btn-link').click(function(e) {
								e.preventDefault();
								shownewLoading(null, '领取中...');
								getResult('api/lottery/award', {
									oi: openid,
									nn: (nickname ? encodeURIComponent(nickname) : encodeURIComponent('匿名用户'))
								}, 'callbackLotteryAwardHandler');
                                setTimeout(function(){
                                    location.href = data.ru;
                                },50);
							});
		                }
					} else {
						$('.lottery-dialog').addClass('lottery-null');
					}
				} else {
					$('.lottery-dialog').addClass('lottery-null');
				}
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
						._('<div class="award-box">')
							._('<img class="tips-award" src="./images/tips-award.png">')
							._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tj-food-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
							._('<p class="award-tip"></p>')
							._('<p class="award-no-tip">您与奖品擦肩而过，继续加油哦</p>')
							._('<img class="award-img">')
							._('<img class="award-no-img" src="./images/tips-noaward.png">')
							._('<img class="award-bg" src="./images/bg-award.png" >')
						._('</div>')
						._('<p class="award-info award-code"></p>')
						._('<p class="award-info award-password"></p>')
						._('<p class="award-info award-reserved"></p>')
						._('<a href="#" class="btn btn-ok" id="btn-ok" data-collect="true" data-collect-flag="tj-food-lotterydialog-btn-ok" data-collect-desc="抽奖弹层-点击确定领奖按钮">确定</a>')
						._('<a href="#" class="btn btn-back" id="btn-back" data-collect="true" data-collect-flag="tj-food-lotterydialog-btn-back" data-collect-desc="抽奖弹层-点击继续加油按钮">继续加油</a>')
						._('<a href="#" class="btn btn-link none" id="btn-link" data-collect="true" data-collect-flag="tj-food-lotterydialog-btn-link" data-collect-desc="抽奖弹层-点击立即领取按钮">立即领取</a>')
						._('<p class="award-info award-share">瞬间分享给朋友来摇奖吧~</p>')
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
			showTips('领取成功!');
		} else {
			showTips('亲,服务君繁忙~<br>稍后再试哦!');
		}
	};
})(Zepto);

$(function() {
	H.dialog.init();
});

