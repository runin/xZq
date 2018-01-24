(function($) {
	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		prizeType:0,
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
				width = $(window).width();
			$('.modal').each(function() {
				$(this).css({ 'width': width, 'height': height });
			});
			$('.dialog').each(function() {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({ 
					'width': width * 0.82, 
					'height': height * 0.76, 
					'left': width * 0.09,
					'right': width * 0.09,
					'top': height * 0.12,
					'bottom': height * 0.12
				});
			});
		},
		guide: {
			$dialog: null,
			open: function() {
				var me = this, guideW, guideH,
					winW = $(window).width(),
					winH = $(window).height();
				guideW = winW * 0.7;
				guideH = guideW * 462 / 400;
				H.dialog.open.call(this);
				$('.guide-dialog').css({
					'width': guideW,
					'height': guideH,
					'top': (winH - guideH) / 2,
					'left': (winW - guideW) / 2
				});
				this.event();
				setTimeout(function() {
					me.close();
				}, 8000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.guide-dialog').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog" data-collect="true" data-collect-flag="tv-xian-ljl-dialog-guide-close-btn" data-collect-desc="引导弹层-关闭按钮">')
					._('<div class="dialog guide-dialog relocated">')
						._('<div class="content"><img src="./images/bg-guide.png"></div>')
						._('')
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
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(rule) {
                this.$dialog.find('.rule-con').html(rule).removeClass('none');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="rule-dialog">')
                ._('<div class="dialog rule-dialog">')
                	._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-xian-ljl-dialog-rule-close-btn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<div class="content">')
                    	._("<h1>活动规则</h1>")
                        ._('<div class="rule-con"></div>')
                    ._("</div>")
                ._("</div>")
                ._("</section>");
                return t.toString();
            }
        },
		lottery: {
			$dialog: null,
			REQUEST_CLS: 'requesting',
			open: function(data) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(), winH = $(window).height();
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				var lotteryW = winW * 0.9;
				var lotteryH = lotteryW * 482 / 591;
				this.$dialog.find('.lottery-dialog').css({
					'width': lotteryW,
					'height': lotteryH,
					'top': (winH - lotteryH) / 2,
					'bottom': (winH - lotteryH) / 2,
					'left': (winW - lotteryW) / 2,
					'right': (winW - lotteryW) / 2
				});
				me.update(data);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					H.lottery.isCanShake = true;
					me.close();
				});
				this.$dialog.find('.btn-ok').click(function(e) {
					e.preventDefault();
					H.lottery.isCanShake = true;
					getResult('api/lottery/award', {
						oi: openid,
						nn: (nickname ? encodeURIComponent(nickname) : encodeURIComponent('匿名用户'))
					}, 'callbackLotteryAwardHandler');
				});
			},
			update: function(data) {
				if (data && data.result) {
					if (data.pt == 9) {
						$('.lottery-dialog').removeClass('lottery-null');
						$('.lottery-dialog .award-tips').html(data.tt || '');
						$('.lottery-dialog .award-img').attr('src', (data.pi || '恭喜你中奖了~<br>运气真棒'));
						$('.lottery-dialog .btn-ok').attr("href", data.ru);
					} else if (data.pt == 0) {
						$('.lottery-dialog').addClass('lottery-null');
						$('.lottery-dialog .award-tips, .lottery-dialog .award-no-tips').html(data.tt || '大奖与你擦肩而过<br>继续加油哦~');
						$('.lottery-dialog .award-img, .lottery-dialog .award-no-img').attr('src', (data.pi || ''));
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
				var t = simpleTpl(), randomPic = Math.ceil(7*Math.random());
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-xian-ljl-dialog-lottery-close-btn" data-collect-desc="摇一摇抽奖弹层-关闭按钮"></a>')
						._('<p class="award-tips"></p>')
						._('<p class="award-no-tips">大奖与你擦肩而过<br>继续加油哦~</p>')
						._('<div class="award-box">')
							._('<img class="award-img">')
							._('<img class="award-no-img" src="./images/bg-thanks.jpg">')
						._('</div>')
						._('<a href="#" class="btn btn-ok" id="btn-ok" data-collect="true" data-collect-flag="tv-xian-ljl-dialog-lottery-btn-ok" data-collect-desc="摇一摇抽奖弹层-点击确定领奖按钮">领取</a>')
						._('<a href="#" class="btn btn-back" id="btn-back" data-collect="true" data-collect-flag="tv-xian-ljl-dialog-lottery-btn-back" data-collect-desc="摇一摇抽奖弹层-点击继续加油按钮">继续加油</a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		lottery4vote: {
			$dialog: null,
			open: function(data) {
				var me = this, $dialog = this.$dialog,
					winW = $(window).width(), winH = $(window).height();
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				var l4voteW = winW * 0.9;
				var l4voteH = l4voteW * 482 / 591;
				this.$dialog.find('.lottery4vote-dialog').css({
					'width': l4voteW,
					'height': l4voteH,
					'top': (winH - l4voteH) / 2,
					'bottom': (winH - l4voteH) / 2,
					'left': (winW - l4voteW) / 2,
					'right': (winW - l4voteW) / 2
				});
				me.update(data);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-vote4back').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-vote4ok').click(function(e) {
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
					if (data.pt == 9) {
						$('.lottery4vote-dialog').removeClass('lottery4vote-null');
						$('.lottery4vote-dialog .award-tips').html(data.tt || '');
						$('.lottery4vote-dialog .award-img').attr('src', (data.pi || ''));
						$('.lottery4vote-dialog .btn-vote4ok').attr("href", data.ru);
					} else {
						$('.lottery4vote-dialog').addClass('lottery4vote-null');
					}
				} else {
					$('.lottery4vote-dialog').addClass('lottery4vote-null');
				}
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery4vote-dialog">')
					._('<div class="dialog lottery4vote-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-xian-ljl-dialog-lottery4vote-close-btn" data-collect-desc="答题抽奖弹层-关闭按钮"></a>')
						._('<p class="award-tips"></p>')
						._('<p class="award-no-tips">大奖与你擦肩而过<br>继续加油哦~</p>')
						._('<div class="award-box">')
							._('<img class="award-img">')
							._('<img class="award-no-img" src="./images/bg-no-award.png">')
						._('</div>')
						._('<a href="#" class="btn btn-vote4ok" id="btn-vote4ok" data-collect="true" data-collect-flag="tv-xian-ljl-dialog-lottery4vote-btn-ok" data-collect-desc="答题抽奖弹层-点击确定领奖按钮">领取</a>')
						._('<a href="#" class="btn btn-vote4back" id="btn-vote4back" data-collect="true" data-collect-flag="tv-xian-ljl-dialog-lottery4vote-btn-back" data-collect-desc="答题抽奖弹层-点击继续加油按钮">继续加油</a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		voteWrong: {
			$dialog: null,
			open: function(data) {
				var me = this, $dialog = this.$dialog,
					winW = $(window).width(), winH = $(window).height();
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				var voteW = winW * 0.9;
				var voteH = voteW * 482 / 591;
				this.$dialog.find('.voteWrong-dialog').css({
					'width': voteW,
					'height': voteH,
					'top': (winH - voteH) / 2,
					'bottom': (winH - voteH) / 2,
					'left': (winW - voteW) / 2,
					'right': (winW - voteW) / 2
				});
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-voteWrongback').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="voteWrong-dialog">')
					._('<div class="dialog voteWrong-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-xian-ljl-dialog-voteWrong-close-btn" data-collect-desc="答错弹层-关闭按钮"></a>')
						._('<p class="award-no-tips">不好意思，答错了<br>继续加油哦~</p>')
						._('<div class="award-box">')
							._('<img class="award-no-img" src="./images/bg-no-right.png">')
						._('</div>')
						._('<a href="#" class="btn btn-voteWrongback" id="btn-voteWrongback" data-collect="true" data-collect-flag="tv-xian-ljl-dialog-voteWrong-btn-back" data-collect-desc="答错弹层-点击继续加油按钮">继续加油</a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		fudai: {
			$dialog: null,
			open: function(data) {
				var me = this, $dialog = this.$dialog,
					winW = $(window).width(), winH = $(window).height();
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				var voteW = winW * 0.9;
				var voteH = voteW * 482 / 591;
				this.$dialog.find('.fudai-dialog').css({
					'width': voteW,
					'height': voteH,
					'top': (winH - voteH) / 2,
					'bottom': (winH - voteH) / 2,
					'left': (winW - voteW) / 2,
					'right': (winW - voteW) / 2
				});
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-fudaiback').click(function(e) {
					e.preventDefault();
					shownewLoading();
	                $.ajax({
	                    type : 'GET',
	                    async : false,
	                    url : domain_url + 'api/lottery/luck4Vote',
	                    data: { oi: openid, sau: H.vote.tid },
	                    dataType : "jsonp",
	                    jsonpCallback : 'callbackLotteryLuck4VoteHandler',
	                    complete: function() {
	                        hidenewLoading();
	                    },
	                    success : function(data) {
	                    	H.dialog.lottery4vote.open(data);
	                    },
	                    error : function() {
	                    	H.dialog.lottery4vote.open(null);
	                    }
	                });
					me.close();
				});
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="fudai-dialog">')
					._('<div class="dialog fudai-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-xian-ljl-dialog-fudai-close-btn" data-collect-desc="答对弹层-关闭按钮"></a>')
						._('<p class="award-no-tips">回答正确<br>下面开始抽奖</p>')
						._('<div class="award-box">')
						._('</div>')
						._('<a href="#" class="btn btn-fudaiback" id="btn-fudaiback" data-collect="true" data-collect-flag="tv-xian-ljl-dialog-fudai-btn-back" data-collect-desc="答对弹层-点击好的按钮">好的</a>')
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
			showTips('领取成功~');
			return;
		} else {
			showTips('亲，服务君繁忙！稍后再试哦！');
		}
	};
})(Zepto);

$(function() {
	H.dialog.init();
});