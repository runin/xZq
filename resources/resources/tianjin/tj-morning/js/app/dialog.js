(function($) {
	
	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		init: function () {
		},
		open: function () {
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

		relocate: function () {
			var height = $(window).height(),
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.10;
			$('.rule-dialog').each(function () {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({
					'width': width * 0.80,
					'height': height * 0.70,
					'left': width * 0.10,
					'right': width * 0.10,
					'top': top,
					'bottom': height * 0.15
				});
			});
            $('.lottery-dialog').each(function () {
                if ($(this).hasClass('relocated')) {
                    return;
                }
                $(this).css({
                    'width': width * 0.85,
                    'height': height * 0.70,
                    'left': width * 0.075,
                    'right': width * 0.075,
                    'top': $(window).scrollTop() + height * 0.15,
                    'bottom': height * 0.15
                });
            });
		},

		// 规则
		rule: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();

				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
			},
			event: function () {
				var me = this;
				this.$dialog.find('.close').click(function (e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function (rule) {
				this.$dialog.find('.rule-con').html(rule).closest('.content').removeClass('none');
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-rul" id="rule-dialog">')
                    ._('<div class="dialog rule-dialog">')
                    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<div class="content">')
					._('<div class="rule-con"></div>')
					._('</div>')
                    ._('<a href="#" class="btn-back close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('</div>')
					._('</section>');
				return t.toString();
			}
		},

        // 中奖
        lottery: {
            $dialog: null,
            url: "",
            pt:null,
            open: function (data) {
                H.dialog.open.call(this);
                this.event();
                this.update(data);
                H.lottery.canJump = false;
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                }, 1000);
            },
            event: function () {
                var me = this;
                this.$dialog.find('.btn-sure').click(function (e) {
                    e.preventDefault();
                    if(me.pt == 9){
                        $(".btn-sure").addClass("none");
                        shownewLoading(null,"请稍候...");
                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                        setTimeout(function(){
                            location.href = me.url;
                        },800);
                    }else{
                        me.close();
                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                    }
                });
            },
            update: function (data) {
                var me = this;
                me.pt = data.pt;
                if(data.result && data.pt == 5){
                    $(".lottery-tt").text(data.tt);
                    $(".lottery-img").attr("src",data.pi);
                    var code = data.cc;
                    if(code){
                        $("#code").removeClass("none");
                        var cd = code.split(",");
                        if (typeof(cd[0]) == 'undefined' || cd[0] == '') {
                            $('#lottery-code').addClass('none');
                        } else {
                            $("#lottery-code").text("兑换码：" + cd[0]);
                            $('#lottery-code').removeClass('none');
                        }
                        if (typeof(cd[1]) == 'undefined' || cd[1] == '') {
                            $('#lottery-password').addClass('none');
                        } else {
                            $("#lottery-password").text("密码：" + cd[1]);
                            $('#lottery-password').removeClass('none');
                        }
                    }
                }else if(data.result && data.pt == 1){
                    $(".lottery-tt").text(data.tt);
                    $(".lottery-img").attr("src",data.pi);
                    $("#accpet-way").text(data.aw);
                    $("#tip").removeClass("none");
                }else if(data.result && data.pt == 9){
                    $(".lottery-tt").text(data.tt);
                    $(".lottery-img").attr("src",data.pi);
                    $(".btn-sure").css("margin-top","10%");
                    me.url = data.ru;
                }
            },
            tpl: function () {
                var t = simpleTpl();
                t._('<section class="modal modal-rul" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                    ._('<div class="lot-top">')
                        ._('<img src="images/congrate.png">')
                        ._('<p class="lottery-tt"></p>')
                    ._('</div>')
                    ._('<div class="lot-bot">')
                        ._('<img class="lottery-img" src="">')
                        ._('<div id="code" class="none">')
                            ._('<p class="code" id="lottery-code"></p>')
                            ._('<p class="code" id="lottery-password"></p>')
                        ._('</div>')
                        ._('<div id="tip" class="none">')
                            ._('<p class="code" id="accpet-way"></p>')
                        ._('</div>')
                        ._('<a href="#" class="btn-sure close" data-collect="true" data-collect-flag="lotterydialog-closebtn" data-collect-desc="中奖弹层-关闭按钮"></a>')
                        ._('<p class="bot-p">快喊小伙伴们一起来摇奖~</p>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
        // 谢谢参与
        thanks: {
            $dialog: null,
            open: function () {
                var me = this;
                H.dialog.open.call(this);
                this.event();
                H.lottery.canJump = false;
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                setTimeout(function(){
                    H.lottery.isCanShake = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                    H.lottery.canJump = true;
                }, 1000);
            },
            event: function () {
                var me = this;
                this.$dialog.find('.btn-close').click(function (e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function () {
                var t = simpleTpl();
                t._('<section class="modal modal-rul" id="thanks-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="thanksdialog-closebtn" data-collect-desc="谢谢参与弹层-关闭按钮"></a>')
                    ._('<div class="lot-top-thanks">')
                    ._('<img class="thanks-tt" src="images/thanks.png">')
                    ._('<p class="lottery-tt">没关系，还有机会哦！</p>')
                    ._('</div>')
                    ._('<div class="lot-bot">')
                    ._('<img class="qrcode" src="images/qrcode.jpg">')
                    ._('<p class="thanks-p">长按图片识别二维码&nbsp;&nbsp;关注天视汇公众号</p>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        }
	};

	W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};

    W.callbackLotteryAwardHandler = function(data){
    }
	
})(Zepto);

H.dialog.init();
