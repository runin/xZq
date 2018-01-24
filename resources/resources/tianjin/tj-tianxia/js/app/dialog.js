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
            $('.answer-dialog').each(function () {
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
                    ._('<a href="#" class="rule-close close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<div class="content">')
					._('<div class="rule-con"></div>')
					._('</div>')
                    ._('</div>')
					._('</section>');
				return t.toString();
			}
		},
        // 答题
        answer: {
            $dialog: null,
            open: function (type) {
                H.dialog.open.call(this);
                this.event();
                this.update(type)
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
                $(".lh-close").click(function(){
                    $(".lh-close").addClass("none");
                    $(".lh-open").removeClass("none");
                    setTimeout(function(){
                        shownewLoading();
                        var sn = new Date().getTime()+'';
                        $.ajax({
                            type : 'GET',
                            async : false,
                            url : domain_url + 'api/lottery/luck4Vote?dev=chris',
                            data: { oi: openid , sn : sn},
                            dataType : "jsonp",
                            jsonpCallback : 'callbackLotteryLuck4VoteHandler',
                            timeout: 11000,
                            complete: function() {
                                hidenewLoading();
                            },
                            success : function(data) {
                                if(data.result){
                                    if(data.sn == sn){
                                        sn = new Date().getTime()+'';
                                        me.close();
                                        setTimeout(function(){
                                            H.dialog.anslottery.open(data);
                                        },1000);
                                    }
                                }else{
                                    sn = new Date().getTime()+'';
                                    me.lottery_fail();
                                }
                            },
                            error : function() {
                                sn = new Date().getTime()+'';
                                me.lottery_fail();
                            }
                        });
                    },1000);
                });
            },
            lottery_fail:function(){
                $(".answer-right").addClass("none");
                $(".lottery-error").removeClass("none");
            },
            update: function (type) {
                if(type == 1){
                    // 答对
                    $(".answer-right").removeClass("none");
                    $(".answer-dialog").find("btn-close").addClass("none");
                }else{
                    $(".answer-error").removeClass("none");
                }
            },
            tpl: function () {
                var t = simpleTpl();
                t._('<section class="modal modal-rul" id="answer-dialog">')
                    ._('<div class="dialog answer-dialog">')
                        ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                        ._('<div class="answer-right none">')
                            ._('<img class="lh-title" src="./images/answer-right.png">')
                            ._('<img class="lh-close" src="./images/lh-close.png">')
                            ._('<img class="lh-open zoomIn none" src="./images/lh-open.png">')
                        ._('</div>')
                        ._('<div class="answer-error none">')
                            ._('<img class="fail-t" src="./images/answer-fail-t.png">')
                            ._('<img class="fail-c" src="./images/answer-fail.png">')
                        ._('</div>')
                        ._('<div class="lottery-error none">')
                            ._('<img class="lh-title" src="./images/lottery-fail.png">')
                            ._('<img class="lh-fail" src="./images/lh-fail.png">')
                        ._('</div>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
        // 中奖
        lottery: {
            $dialog: null,
            open: function (data) {
                H.dialog.open.call(this);
                this.event();
                this.update(data);
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                    H.lottery.isCanShake = true;
                }, 1000);
            },
            event: function () {
                var me = this;
                this.$dialog.find('.btn-sure').click(function (e) {
                    e.preventDefault();
                    me.close();
                    getResult('api/lottery/award', {
                        oi: openid,
                        hi: headimgurl,
                        nn: nickname
                    }, 'callbackLotteryAwardHandler');
                });
            },
            update: function (data) {
                if(data.result && data.pt == 5){
                    $(".lottery-tt").text(data.tt);
                    $(".lottery-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    var code = data.cc;
                    if(code){
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
                        ._('<img class="lottery-img" src="./images/gift-blank.png">')
                        ._('<p class="code" id="lottery-code"></p>')
                        ._('<p class="code" id="lottery-password"></p>')
                        ._('<a href="#" class="btn-sure close" data-collect="true" data-collect-flag="lotterydialog-closebtn" data-collect-desc="中奖弹层-关闭按钮"></a>')
                        ._('<p class="bot-p">快喊小伙伴们一起来摇奖~</p>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
        // 中奖
        anslottery: {
            $dialog: null,
            open: function (data) {
                H.dialog.open.call(this);
                this.event();
                this.update(data);
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
                this.$dialog.find('.btn-sure').click(function (e) {
                    e.preventDefault();
                    me.close();
                    getResult('api/lottery/award', {
                        oi: openid,
                        hi: headimgurl,
                        nn: nickname
                    }, 'callbackLotteryAwardHandler');
                });
            },
            update: function (data) {
                if(data.result && data.pt == 5){
                    $(".lottery-tt").text(data.tt);
                    $(".lottery-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    var code = data.cc;
                    if(code){
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
                        ._('<img class="lottery-img" src="./images/gift-blank.png">')
                        ._('<p class="code" id="lottery-code"></p>')
                        ._('<p class="code" id="lottery-password"></p>')
                        ._('<a href="#" class="btn-sure close" data-collect="true" data-collect-flag="lotterydialog-closebtn" data-collect-desc="答题中奖弹层-关闭按钮"></a>')
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
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                setTimeout(function(){
                    H.lottery.isCanShake = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
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
