(function($) {
	
	H.dialog = {
		puid: 0,
		$container: $('body'),
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
                    'width': width * 0.90,
                    'height': height * 0.85,
                    'left': width * 0.05,
                    'right': width * 0.05,
                    'top': $(window).scrollTop() + height * 0.075,
                    'bottom': height * 0.075
                });
            });
		},

		// 规则
		rule: {
			$dialog: null,
			open: function (rule) {
				H.dialog.open.call(this);
				this.event();
                this.update(rule);
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
				this.$dialog.find('.rule-con').html(rule);
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-rul" id="rule-dialog">')
                    ._('<div class="dialog rule-dialog">')
                    ._('<a href="#" class="rule-close close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<img class="title" src="images/rule.png">')
                    ._('<div class="content">')
					._('<div class="rule-con"></div>')
					._('</div>')
                    ._('</div>')
					._('</section>');
				return t.toString();
			}
		},
        // 中奖
        lottery: {
            $dialog: null,
            url: null,
            type: null,
            phone: null,
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
                $('#btn-get').click(function (e) {
                    e.preventDefault();
                    if(me.check() && !$("#btn-get").hasClass("pulse")){
                        shownewLoading(null, '请稍后...');
                        $("#btn-get").addClass("pulse");
                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname,
                            ph: me.phone? me.phone : ""
                        }, 'callbackLotteryAwardHandler');
                        $.ajax({
                            type : 'GET',
                            async : false,
                            url : register_port,
                            data: { tel: me.phone , type : me.type},
                            dataType : "jsonp",
                            jsonpCallback: "PreRegisterHandel",
                            timeout: 11000,
                            complete: function() {
                            },
                            success : function(data) {
                                if(data.code == 1111 || data.code == 4444){
                                    setTimeout(function(){
                                        location.href = me.url+"&tel="+me.phone;
                                    },1000);
                                }else{
                                    showTips('为了您更方便的领取奖品，请输入正确的手机号！');
                                    $("#btn-get").removeClass("pulse");
                                }
                            },
                            error : function() {
                                showTips('为了您更方便的领取奖品，请输入正确的手机号！');
                                $("#btn-get").removeClass("pulse");
                            }
                        });
                    }
                });
                this.$dialog.find('.btn-close').click(function (e) {
                    e.preventDefault();
                    me.close();
                });
            },
            check: function(){
                var me = this;
                var ph = $(".tel-input").val();
                if (!/^\d{11}$/.test(ph)) {
                    showTips('为了您更方便的领取奖品，请输入正确的手机号！');
                    return false;
                }
                me.phone = ph;
                return true;
            },
            update: function (data) {
                var me = this;
                if(data.result && (data.pt == 9 || data.pt == 1 || data.pt == 6)){
                    $(".lottery-tt").text(data.tt);
                    $(".tel-input").val(data.ph);
                    me.url = data.ru;
                    if(data.pt == 9){
                        // 体验金
                        me.type = "expgold";
                    }else if(data.pt == 1){
                        // 元宝币
                        me.type = "ybingot";
                    }else if(data.pt == 6){
                        // 手机流量
                        me.type = "telflow";
                    }
                }
            },
            tpl: function () {
                var t = simpleTpl();
                t._('<section class="modal modal-rul" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="lotterydialog-closebtn" data-collect-desc="中奖弹层-关闭按钮"></a>')
                        ._('<img class="lottery-logo" src="images/lottery-logo.png">')
                        ._('<img class="lottery-congrtate" src="images/congrate.png">')
                        ._('<p class="lottery-tt"></p>')
                        ._('<p class="lottery-ples">请填写手机号，并在下个页面登录领取</p>')
                        ._('<p class="lottery-input">手机：<input type="tel" class="tel-input"></p>')
                        ._('<p class="lottery-psdtip">登录密码稍后会发送到您手机上</p>')
                        ._('<a href="#" class="btn-sure" id="btn-get" data-collect="true" data-collect-flag="lotterydialog-receivebtn" data-collect-desc="中奖弹层-领取按钮">确认</a>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
        // 中奖
        redlottery: {
            $dialog: null,
            phone: null,
            rp: null,
            open: function (data) {
                H.dialog.open.call(this);
                this.event();
                this.update(data);
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
                this.$dialog.find('#chai').click(function (e) {
                    e.preventDefault();
                    if(me.check()){
                        $("#chai").addClass("none");
                        getResult('api/user/edit', {
                            oi: openid,
                            tk: H.lottery.token,
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            ph: me.phone ? me.phone : ""
                        }, 'callbackUserEditHandler');
                        $("#red-befor").addClass("none");
                        $("#red-after").removeClass("none");
                    }
                });
                this.$dialog.find("#receive").click(function(){
                    if(!$(this).hasClass("pulse")){
                        $(this).addClass("pulse");
                        $(this).addClass("none");
                        shownewLoading(null, '请稍后...');
                        location.href = me.rp;
                    }
                });
                this.$dialog.find('.btn-close').click(function (e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function (data) {
                var me = this;
                if(data.result && data.pt == 4){
                    $(".lottery-redimg").attr("src",data.pi);
                    $("#red-tel").val(H.lottery.phone);
                    me.rp = data.rp;
                }
            },
            check: function(){
                var me = this;
                var ph = $("#red-tel").val();
                if (!/^\d{11}$/.test(ph)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                }
                me.phone = ph;
                return true;
            },
            tpl: function () {
                var t = simpleTpl();
                t._('<section class="modal modal-rul" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="reddialog-closebtn" data-collect-desc="红包弹层-关闭按钮"></a>')
                        ._('<div id="red-befor">')
                            ._('<img class="lottery-logo" src="images/lottery-logo.png">')
                            ._('<img class="lottery-congrtate" src="images/congrate.png">')
                            ._('<p class="lottery-tt">元宝365红包一个</p>')
                            ._('<p class="lottery-ples">填手机号，拆红包</p>')
                            ._('<p class="lottery-input">手机：<input type="tel" id="red-tel" class="tel-input"></p>')
                            ._('<a href="#" class="btn-sure" id="chai" data-collect="true" data-collect-flag="reddialog-chai-btn" data-collect-desc="红包弹层-拆开">拆开</a>')
                        ._('</div>')
                        ._('<div id="red-after" class="none">')
                            ._('<img class="lottery-logo" src="images/lottery-logo.png">')
                            ._('<img class="lottery-redimg">')
                            ._('<a href="#" class="btn-sure" id="receive" data-collect="true" data-collect-flag="reddialog-receive-btn" data-collect-desc="红包弹层-领取">领取</a>')
                        ._('</div>')
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
                    ._('<img class="thanks-tt" src="images/thanks-tip.png">')
                    ._('<img class="qrcode" src="images/qrcode.jpg">')
                    ._('<p class="thanks-p">长按图片识别二维码<br />关注元宝365官方账号</p>')
                    ._('</section>');
                return t.toString();
            }
        }
	};

    W.callbackLotteryAwardHandler = function(data){
    };
    W.callbackUserEditHandler = function(data) {
    };
	
})(Zepto);

H.dialog.init();
