(function($) {
    H.dialog = {
        rollLotteryNum: 0,
        puid: 0,
        ci:null,
        ts:null,
        si:null,
        $container: $('body'),
        init: function() {
            var me = this, height = $(window).height(), width = $(window).width();
            $('body').css({
                'width': width,
                'height': height
            });
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
            this.$dialog.animate({'opacity':'1'}, 500);
            this.$dialog.find('.dialog').addClass('bounceInDown');
            setTimeout(function(){
                $('#icon-start').animate({'-webkit-transform': 'rotate(360deg)'}, 300);
            	me.$dialog.find('.dialog').removeClass('bounceInDown');
            }, 1000);
        },
        relocate : function(){
        	var height = $(window).height(), width = $(window).width();
            $('.modal').each(function() {
                $(this).css({ 
                    'width': width, 
                    'height': height
                });
            });
            $('.dialog').each(function() {
                $(this).css({ 
                    'width': width * 0.88, 
                    'min-height': height * 0.8, 
                    'left': width * 0.06,
                    'top': height * 0.1
                });
            });
        },
        rule: {
            $dialog: null,
            open: function () {
                H.dialog.open.call(this);
                this.event();
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    hidenewLoading();
                    $("#btn-rule").removeClass('requesting');
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function () {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function (e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function () {
                var t = simpleTpl();
                if (rule_temp == '') {
                    getResult('api/common/rule', {}, 'commonApiRuleHandler');
                } else {
                    hidenewLoading();
                }
                t._('<section class="modal modal-rule" id="rule-dialog">')
                    ._('<div class="dialog rule-dialog">')
                        ._('<a href="#" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-rule-btn-close" data-collect-desc="弹层(活动规则)-关闭按钮"></a>')
                        ._('<img src="./images/bg-dialog-header.png">')
                        ._('<div class="dialog-content">')
                            ._('<img class="icon-rule" src="./images/icon-rule.png">')
                            ._('<div class="rule-content" id="rule-content">' + rule_temp + '</div>')
                            ._('<img class="icon-rulecar" src="./images/icon-rulecar.png">')
                        ._('</div>')
                        ._('<img src="./images/bg-dialog-footer.png">')
                    ._('</div>')
                ._('</section>');
                return t.toString();
            }
        },
        shiwuLottery: {
            $dialog: null,
            mobile: '',
            open: function(data) {
                H.lottery.isCanRoll = false;
                var me =this, $dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    H.lottery.isCanRoll = true;
                    $('#btn-wheel').animate({'-webkit-transform': 'rotate(360deg)'}, 300);
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('#btn-shiwuLottery').click(function(e) {
                    e.preventDefault();
                    if(me.check()) {
                        if(!$('#btn-shiwuLottery').hasClass("flag")){
                            $('#btn-shiwuLottery').addClass("flag");
                            getResult('api/lottery/award', {
                                oi: openid,
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                ph: me.mobile ? me.mobile : ""
                            }, 'callbackLotteryAwardHandler');
                            $('.commint-before').addClass('none');
                            $('.commint-after').removeClass('none');
                        }
                    }
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    $("#shiwu-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#shiwu-dialog").find(".award-luckTips").html(data.tt || '');
                    $("#shiwu-dialog").find(".phone").val(data.ph ? data.ph : '');
                }
            },
            check: function() {
                var me = this, $mobile = $('.phone'), mobile = $.trim($mobile.val());
                if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖!');
                    return false;
                }
                me.mobile = mobile;
                return true;
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-shiwu" id="shiwu-dialog">')
                    ._('<div class="dialog shiwu-dialog">')
                        ._('<a href="#" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-close" data-collect-desc="弹层(实物奖)-关闭按钮"></a>')
                        ._('<img src="./images/bg-dialog-header.png">')
                        ._('<div class="dialog-content">')
                            ._('<div class="commint-before">')
                                ._('<img class="icon-congrats" src="./images/icon-congrats.png">')
                                ._('<p class="award-luckTips"></p>')
                                ._('<div class="award-img-box"><img class="award-img" src="./images/default-award.png"><img class="icon-paper" src="./images/icon-paper.png"></div>')
                                ._('<p class="award-keyTips">填写手机号，领取大奖</p>')
                                ._('<div class="input-box"><label>电话: </label><input class="phone" type="tel"></div>')
                                ._('<a href="#" class="btn-lottery btn-shiwuLottery" id="btn-shiwuLottery" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery" data-collect-desc="弹层(实物奖)-领取按钮"><img src="./images/btn-getluck.png" alt="点我领取"></a>')
                            ._('</div>')
                            ._('<div class="commint-after none">')
                                ._('<img class="icon-ok" src="./images/icon-ok.png">')
                                ._('<p class="qrcode-tips">关注我们，赢取更多奖品</p>')
                                ._('<div class="qrcode-box">')
                                    ._('<img class="icon-qrcode" src="./images/icon-qrcode.png">')
                                    ._('<p>长按二维码，关注瓜子二手车直卖网公众号</p>')
                                ._('</div>')
                                ._('<p>之后会有工作人员与您联系</p>')
                                ._('<p>请保持电话畅通</p>')
                            ._('</div>')
                        ._('</div>')
                        ._('<img src="./images/bg-dialog-footer.png">')
                    ._('</div>')
                ._('</section>');
                return t.toString();
            }
        },
        linkLottery: {
			$dialog: null,
            ru: '',
            mobile: '',
			open: function(data) {
				H.lottery.isCanRoll = false;
				var me =this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
				   this.event();
				}
            	me.update(data);
			},
			close: function() {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    H.lottery.isCanRoll = true;
                    $('#btn-wheel').animate({'-webkit-transform': 'rotate(360deg)'}, 300);
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-dialog-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
                this.$dialog.find('#btn-linkLottery').click(function(e) {
                    e.preventDefault();
                    if(me.check()) {
                        if(!$('#btn-linkLottery').hasClass("flag")){
                            $('#btn-linkLottery').addClass("flag");
                            shownewLoading();
                            getResult('api/lottery/award', {
                                oi: openid,
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                ph: me.mobile ? me.mobile : ""
                            }, 'callbackLotteryAwardHandler');
                            if (me.ru.length == 0) {
                                me.close();
                                hidenewLoading();
                            } else {
                                setTimeout(function(){
                                    location.href = me.ru;
                                },500);
                            }
                        }
                    }
                });
			},
			update: function(data) {
				var me = this;
                if(data.result){
                    me.ru = data.ru;
                    $("#link-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#link-dialog").find(".award-luckTips").html(data.tt || '');
                    $("#link-dialog").find(".phone").val(data.ph ? data.ph : '');
                }
			},
            check: function() {
                var me = this, $mobile = $('.phone'), mobile = $.trim($mobile.val());
                if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖!');
                    return false;
                }
                me.mobile = mobile;
                return true;
            },
			tpl: function() {
				var t = simpleTpl();
                t._('<section class="modal modal-link" id="link-dialog">')
                    ._('<div class="dialog link-dialog">')
                        ._('<a href="#" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链奖)-关闭按钮"></a>')
                        ._('<img src="./images/bg-dialog-header.png">')
                        ._('<div class="dialog-content">')
                            ._('<img class="icon-congrats" src="./images/icon-congrats.png">')
                            ._('<p class="award-luckTips"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<p class="award-keyTips">填写手机号，领取大奖</p>')
                            ._('<div class="input-box"><label>电话: </label><input class="phone" type="tel"></div>')
                            ._('<a href="#" class="btn-lottery btn-link-lottery" id="btn-linkLottery" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery" data-collect-desc="弹层(外链奖)-领取按钮"><img src="./images/btn-getluck.png" alt="点我领取"></a>')
                        ._('</div>')
                        ._('<img src="./images/bg-dialog-footer.png">')
                    ._('</div>')
                ._('</section>');
				return t.toString();
			}
		},
        redLottery: {
            $dialog: null,
            mobile: '',
            rp:null,
            open: function(data) {
                H.lottery.isCanRoll = false;
                var me =this, $dialog = this.$dialog, winW = $(window).width(), winH = $(window).height();
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                $('.redbag-dialog').css({
                    'width': winW * 0.76,
                    'height': winH * 0.68,
                    'top': winH * 0.16,
                    'left': winW * 0.12,
                    'min-height': '0'
                });
                me.update(data);
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    H.lottery.isCanRoll = true;
                    $('#btn-wheel').animate({'-webkit-transform': 'rotate(360deg)'}, 300);
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                $(".btn-redLottery-see").click(function(e){
                    e.preventDefault();
                    var delay = Math.ceil(500*Math.random() + 100)
                    if(me.check()) {
                        if(!$('.btn-redLottery-see').hasClass("requesting") && me.rp){
                            shownewLoading();
                            $('.btn-redLottery-see').addClass("requesting");
                            getResult('api/user/edit', {
                                oi: openid,
                                tk: H.lottery.token,
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                ph: me.mobile ? me.mobile : ""
                            }, 'callbackUserEditHandler');
                            setTimeout(function() {
                                $('.redbag-commint-before').addClass('none');
                                $('.redbag-commint-after').removeClass('none');
                                $(".redbag-commint-after").click(function(){
                                    if(!$('.redbag-commint-after').hasClass("requesting") && H.dialog.redLottery.rp){
                                        shownewLoading();
                                        $('.redbag-commint-after').addClass("requesting");
                                        $('.btn-redLottery-get').text("领取中");
                                        setTimeout(function(){
                                            location.href = H.dialog.redLottery.rp;
                                        },500);
                                    }
                                });
                                hidenewLoading();
                            }, delay)
                        }
                    }
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    me.rp = data.rp;
                    $(".redbag-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $(".redbag-dialog").find(".award-logo").attr("src", data.qc).attr("onerror", "$(this).addClass(\'none\')");
                    $(".redbag-dialog").find(".award-luckTips").html(data.tt);
                    if (H.lottery.phone) {
                        $(".redbag-dialog").find(".phone").val(H.lottery.phone);
                    }
                }
            },
            check: function() {
                var me = this, $mobile = $('.phone'), mobile = $.trim($mobile.val());
                if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖!');
                    return false;
                }
                me.mobile = mobile;
                return true;
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-redbag" id="redbag-dialog">')
                    ._('<div class="dialog redbag-dialog">')
                        ._('<div class="redbag-commint-before">')
                            ._('<p class="award-luckTips"></p>')
                            ._('<img class="award-logo" src="./images/icon-redbag-logo.png">')
                            ._('<div class="userinfo-box">')
                                ._('<img class="icon-redtips" src="./images/icon-redtips.png">')
                                ._('<div class="input-box"><label>电话: </label><input class="phone" type="tel"></div>')
                                ._('<a href="#" class="btn-redlottery btn-redLottery-see" id="btn-redLottery-see" data-collect="true" data-collect-flag="dialog-redbag-btn-see" data-collect-desc="弹层(红包)-拆开按钮">拆&nbsp;&nbsp;开</a>')
                            ._('</div>')
                        ._('</div>')
                        ._('<div class="redbag-commint-after none">')
                            ._('<img class="award-logo" src="./images/icon-redbag-logo.png">')
                            ._('<div class="userinfo-box">')
                                ._('<img class="award-img" src="./images/default-award.png">')
                                ._('<a href="#" class="btn-redlottery btn-redLottery-get" id="btn-redLottery-get" data-collect="true" data-collect-flag="dialog-redbag-btn-get" data-collect-desc="弹层(红包)-领取按钮">领&nbsp;&nbsp;取</a>')
                            ._('</div>')
                        ._('</div>')
                    ._('</div>')
                ._('</section>');
                return t.toString();
            }
        },
        thanks: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    H.lottery.isCanRoll = true;
                    $('#btn-wheel').animate({'-webkit-transform': 'rotate(360deg)'}, 300);
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function (e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-thanks" id="thanks-dialog">')
                    ._('<div class="dialog thanks-dialog">')
                        ._('<a href="#" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-thanks-btn-close" data-collect-desc="弹层(谢谢参与)-关闭按钮"></a>')
                        ._('<img src="./images/bg-dialog-header.png">')
                        ._('<div class="dialog-content">')
                            ._('<img class="icon-sorry" src="./images/icon-sorry.png">')
                            ._('<img class="icon-qrcode" src="./images/icon-qrcode.png">')
                            ._('<p>长按图片识别二维码</p>')
                            ._('<p>关注瓜子二手车直卖网官方账号</p>')
                        ._('</div>')
                        ._('<img src="./images/bg-dialog-footer.png">')
                    ._('</div>')
                ._('</section>');
                return t.toString();
            }
        }
    };

    W.commonApiRuleHandler = function(data) {
		if(data.code == 0){
            rule_temp = data.rule;
			$("#rule-content").html(data.rule);
		}
        hidenewLoading();
	};

	W.callbackLotteryAwardHandler = function(data) {};

    W.callbackUserEditHandler = function(data) {};
})(Zepto);

$(function() {
    H.dialog.init();
});
