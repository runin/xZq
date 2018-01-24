(function($) {
    H.dialog = {
        puid: 0,
        ci:null,
        ts:null,
        si:null,
        $container: $('body'),
        init: function() {
            var me = this;
        },
        open: function() {
        	var me = this;
            if (this.$dialog) {
                this.$dialog.removeClass('none');
            } else {
                this.$dialog = $(this.tpl());
                H.dialog.$container.append(this.$dialog);
            }
            H.dialog.relocate();
            this.$dialog.find('.dialog').addClass('bounceInDown');
            setTimeout(function(){
            	me.$dialog.find('.dialog').removeClass('bounceInDown');
            }, 1000);
        },
        relocate : function(){
        	var height = $(window).height(), width = $(window).width();
            $('.dialog').each(function() {
                $(this).css({ 
                    'width': width, 
                    'height': height, 
                    'left': 0,
                    'top': 0
                });
            });
        },
		guide: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				var me = this, winW = $(window).width(), winH = $(window).height();
				var guideW = winW * 0.8,
					guideH = guideW * 665 / 486,
					guideT = (winH - guideH) / 2,
					guideL = (winW - guideW) / 2
				$('.guide-dialog').css({
					'width': guideW,
					'height': guideH,
					'top': guideT,
					'left': guideL
				});
				setTimeout(function() {
					me.close();
				}, 8000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.guide-dialog').click(function(e) {
					e.preventDefault();
					if (!$(this).hasClass('requesting')) {
						$(this).addClass('requesting');
						me.close();
					};
				});
			},
			close: function() {
				var me = this;
            	this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
            	setTimeout(function(){
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
            	}, 1000);
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog relocated" data-collect="true" data-collect-flag="cctv7-nongye-dialog-guide-close-btn" data-collect-desc="引导弹层-关闭按钮">')
						._('<img src="./images/bg-guide.png">')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		rule: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();
				var me = this, winW = $(window).width(), winH = $(window).height();
				var ruleW = winW * 0.8,
					ruleH = ruleW * 773 / 526,
					ruleT = (winH - ruleH) / 2,
					ruleL = (winW - ruleW) / 2
				$('.rule-dialog').css({
					'width': ruleW,
					'height': ruleH,
					'top': ruleT,
					'left': ruleL
				});
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
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
			close: function () {
				var me = this;
            	this.$dialog.find('.rule-dialog').addClass('bounceOutDown');
            	setTimeout(function(){
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
            	}, 1000);
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-rule" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
					    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="cctv7-nongye-dialog-rule-close-btn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<div class="content"></div>')
					    ._('<a href="#" class="btn-back" data-collect="true" data-collect-flag="cctv7-nongye-dialog-rule-back-btn" data-collect-desc="规则弹层-返回按钮"><img src="./images/btn-back.png"></a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
        lottery: {
			$dialog: null,
            sto:null,
			open: function(data) {
				H.lottery.isCanShake = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
				   this.event();
				}
				var winW = $(window).width(), winH = $(window).height();
				var lotteryW = winW * 0.8,
					lotteryH = winH * 0.52,
					lotteryT = (winH - lotteryH) / 2,
					lotteryL = (winW - lotteryW) / 2
				$('.lottery-dialog').css({
					'width': lotteryW,
					'height': lotteryH,
					'top': lotteryT,
					'left': lotteryL
				});
            	me.update(data);
				H.lottery.canJump = false;
			},
			close: function() {
				var me = this;
            	this.$dialog.find('.dialog').addClass('bounceOutDown');
            	setTimeout(function(){
					H.lottery.canJump = true;
					H.lottery.isCanShake = true;
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
				this.$dialog.find('#btn-havefun').click(function(e) {
					e.preventDefault();
					me.close();
				});
                this.$dialog.find('#btn-getquan').click(function(e) {
                    e.preventDefault();
                    shownewLoading();
                    me.sto = setTimeout(function(){
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    },15000);
                    if(!$('#btn-getquan').hasClass("requesting")){
                        $('#btn-getquan').text("领取中");
                        $('#btn-getquan').addClass("requesting");
                        me.close();
                        H.lottery.isCanShake = false;
                        H.lottery.wxCheck = false;
                        setTimeout(function(){
                            me.wx_card();
                        },1000);
                    }
                });
			},
            wx_card:function(){
                var me = this;
                //卡券
                wx.addCard({
                    cardList: [{
                        cardId: H.dialog.ci,
                        cardExt: "{\"timestamp\":\""+ H.dialog.ts +"\",\"signature\":\""+ H.dialog.si +"\"}"
                    }],
                    success: function (res) {
                        H.lottery.wxCheck = true;
                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "getquan-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    },
                    cancel:function(){
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    }
                });
            },
			update: function(data) {
				var me = this;
				if(data && data.result == true && data.pt == 9){
				    $("#lott").find(".award-img").attr("src", data.pi);
					this.$dialog.find("#not-lott").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
					this.$dialog.find("#btn-havefun").addClass("none");
					this.$dialog.find("#btn-getquan").addClass("none");
					this.$dialog.find("#btn-getluck").removeClass("none");
					this.$dialog.find('#btn-getluck').click(function(e) {
						e.preventDefault();
						if (!$(this).hasClass('requesting')) {
							$(this).addClass('requesting');
							me.close();
							shownewLoading(null, '请稍后...');
	                        getResult('api/lottery/award', {
	                            oi: openid,
	                            hi: headimgurl,
	                            nn: nickname
	                        }, 'callbackLotteryAwardHandler');
	                        setTimeout(function(){
	                        	location.href = data.ru;
	                        }, 500);
						};
					});
				}else if(data && data.result == true && data.pt == 14){
				    $("#lott").find(".award-img").attr("src", data.pi);
                    H.dialog.ci = data.ci;
                    H.dialog.ts = data.ts;
                    H.dialog.si = data.si;
					this.$dialog.find("#not-lott").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
					this.$dialog.find("#btn-havefun").addClass("none");
					this.$dialog.find("#btn-getluck").addClass("none");
					this.$dialog.find("#btn-getquan").removeClass("none");
				}else if(data && data.result == true && data.pt == 7){
				    $("#lott").find(".award-img").attr("src", data.pi);
                    H.dialog.ci = data.ci;
                    H.dialog.ts = data.ts;
                    H.dialog.si = data.si;
					this.$dialog.find("#not-lott").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
					this.$dialog.find("#btn-havefun").addClass("none");
					this.$dialog.find("#btn-getluck").addClass("none");
					this.$dialog.find("#btn-getquan").removeClass("none");
				}else if(data && data.result == true && data.pt == 0){
					$("#not-lott").find(".ltp").html(data.tt || "<span>您与大奖的缘分就这样擦肩而过了，不要灰心，继续加油~~</span>");
					this.$dialog.find("#lott").addClass("none");
					this.$dialog.find("#not-lott").removeClass("none");
					this.$dialog.find("#btn-havefun").removeClass("none");
					this.$dialog.find("#btn-getluck").addClass("none");
					this.$dialog.find("#btn-getquan").addClass("none");
					setTimeout(function(){
						$('.btn-close').trigger('click');
					}, 1500);
					this.$dialog.click(function(e) {
						e.preventDefault();
						me.close();
					});
				}else {
					$("#not-lott").find(".ltp").html("<span>您与大奖的缘分就这样擦肩而过了，不要灰心，继续加油~~</span>");
					this.$dialog.find("#lott").addClass("none");
					this.$dialog.find("#not-lott").removeClass("none");
					this.$dialog.find("#btn-havefun").removeClass("none");
					this.$dialog.find("#btn-getluck").addClass("none");
					this.$dialog.find("#btn-getquan").addClass("none");
					setTimeout(function(){
						$('.btn-close').trigger('click');
					}, 1500);
					this.$dialog.click(function(e) {
						e.preventDefault();
						me.close();
					});
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal modal-lottery" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="cctv7-nongye-dialog-lottery-close-btn" data-collect-desc="中奖弹层-关闭按钮"></a>')
						._('<div class="lott-box lott none" id="lott">')
							._('<img class="award-tips" src="./images/icon-award.png">')
							._('<img class="award-img" src="">')
						._('</div>')
						._('<div class="lott-box not-lott" id="not-lott">')
							._('<img class="award-tips" src="./images/icon-noaward.png">')
							._('<p class="ltp"></p>')
						._('</div>')
						._('<a class="lottery-btn btn-havefun" id="btn-havefun" href="#" data-collect="true" data-collect-flag="cctv7-nongye-dialog-lottery-thanks-btn" data-collect-desc="中奖弹层-继续加油按钮"><img src="./images/btn-havefun.png"></a>')
						._('<a class="lottery-btn btn-getluck none" id="btn-getluck" href="#" data-collect="true" data-collect-flag="cctv7-nongye-dialog-lottery-getluck-btn" data-collect-desc="中奖弹层-领奖按钮"><img src="./images/btn-getluck.png"></a>')
						._('<a class="lottery-btn btn-getquan none" id="btn-getquan" href="#" data-collect="true" data-collect-flag="cctv7-nongye-dialog-lottery-getluck-btn" data-collect-desc="中奖弹层-领奖按钮"><img src="./images/btn-getluck.png"></a>')
					  ._('</div>')
					._('</div>');
				return t.toString();
			}
		},

    };
    
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-dialog .content").html(data.rule);
		}
	};

	W.callbackLotteryAwardHandler = function(data) {};
})(Zepto);

$(function() {
    H.dialog.init();
});
