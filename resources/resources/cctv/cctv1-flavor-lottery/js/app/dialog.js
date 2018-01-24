(function($) {
    H.dialog = {
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
            this.$dialog.animate({'opacity':'1'}, 300);
            this.$dialog.find('.dialog').addClass('bounceInDown');
            setTimeout(function(){
                me.$dialog.find('.dialog').removeClass('bounceInDown');
            }, 500);
            hidenewLoading();
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
                    // 'min-height': height * 0.7, 
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
                this.$dialog.find('.dialog').removeClass('bounceInDown').animate({'opacity':'0'}, 100);
                this.$dialog.animate({'opacity':'0'}, 200);
                setTimeout(function(){
                    hidenewLoading();
                    $("#btn-rule").removeClass('flag');
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 200);
            },
            event: function () {
                var me = this;
                this.$dialog.find('.btn-dialog-close').tap(function (e) {
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
                    ._('<section class="dialog rule-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-rule-btn-close" data-collect-desc="弹层(活动规则)-关闭按钮"><img src="./images/btn-rule-close.png"></a>')
                        ._('<section class="dialog-content">')
                            ._('<h1>活动规则</h1>')
                            ._('<section class="rule-content" id="rule-content">' + rule_temp + '</section>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        shiwuLottery: {
            $dialog: null,
            name: '',
            mobile: '',
            address: '',
            open: function(data) {
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').animate({'opacity':'0'}, 100);
                this.$dialog.animate({'opacity':'0'}, 200);
                setTimeout(function(){
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 200);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').tap(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('#btn-shiwuLottery-award').tap(function(e) {
                    e.preventDefault();
                    if(me.check()) {
                        if(!$('#btn-shiwuLottery-award').hasClass("flag")){
                            $('#btn-shiwuLottery-award').addClass("flag");
                            shownewLoading();
                            getResult('api/lottery/award', {
                                oi: openid,
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                rn: me.name ? encodeURIComponent(me.name) : "",
                                ph: me.mobile ? me.mobile : "",
                                ad: me.address ? encodeURIComponent(me.address) : ""
                            }, 'callbackLotteryAwardHandler');
                            $("#shiwu-dialog").find(".info-name label").text(me.name);
                            $("#shiwu-dialog").find(".info-phone label").text(me.mobile);
                            $("#shiwu-dialog").find(".info-address label").text(me.address);
                            shownewLoading();
                            setTimeout(function(){
                                $("#shiwu-dialog").find(".before").addClass('none');
                                $("#shiwu-dialog").find(".after").removeClass('none');
                                $("#shiwu-dialog").find(".award-keyTips").addClass('none');
                                hidenewLoading();
                            }, 200);
                        }
                    }
                });
                this.$dialog.find('#btn-shiwuLottery-close').tap(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    $("#shiwu-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#shiwu-dialog").find(".award-luckTips").html(data.tt || '恭喜您获得');
                    $("#shiwu-dialog").find('.award-keyTips').html(data.pd || '请填写您的个人信息以便顺利领奖');
                    $("#shiwu-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#shiwu-dialog").find(".phone").val(data.ph ? data.ph : '');
                    $("#shiwu-dialog").find(".address").val(data.ad ? data.ad : '');
                    $("#shiwu-dialog").find(".before").removeClass('none');
                    $("#shiwu-dialog").find(".after").addClass('none');
                }
                this.$dialog.find('.shiwu-dialog').css({
                    'top': Math.ceil($(window).height()*0.06)
                });
            },
            check: function() {
                var me = this, name = $.trim($('.name').val()), mobile = $.trim($('.phone').val()), address = $.trim($('.address').val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖！');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                } else if (address.length < 8 || address.length > 80 || address.length == 0) {
                    showTips('请填写您的详细地址，以便顺利领奖！');
                    return false;
                }
                me.name = name;
                me.mobile = mobile;
                me.address = address;
                return true;
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-shiwu" id="shiwu-dialog">')
                    ._('<section class="dialog shiwu-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-close" data-collect-desc="弹层(实物奖)-关闭按钮"></a>')
                        ._('<img class="bg-dialog-header" src="./images/bg-dialog-header.png">')
                        ._('<section class="dialog-content">')
                            ._('<p class="award-luckTips"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<p class="award-keyTips"></p>')
                            ._('<section class="input-box before">')
                                ._('<input class="name" type="text" placeholder="姓名: ">')
                                ._('<input class="phone" type="tel" placeholder="电话: ">')
                                ._('<input class="address" type="text" placeholder="地址: ">')
                            ._('</section>')
                            ._('<section class="info-box after">')
                                ._('<p class="info-name">姓名：<label></label></p>')
                                ._('<p class="info-phone">电话：<label></label></p>')
                                ._('<p class="info-address">地址：<label></label></p>')
                                ._('<h3>奖品将在15个工作日内发出</h3>')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物奖)-领取按钮">领取</a>')
                            ._('<section class="btn-lottery-box after">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-close" id="btn-shiwuLottery-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-close" data-collect-desc="弹层(实物奖)-继续摇奖按钮">继续摇奖</a>')
                            ._('</section>')
                        ._('</section>')
                        ._('<img class="bg-dialog-footer" src="./images/bg-dialog-footer.png">')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        linkLottery: {
            $dialog: null,
            name: '',
            mobile: '',
            ru: '',
            open: function(data) {
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').animate({'opacity':'0'}, 100);
                this.$dialog.animate({'opacity':'0'}, 200);
                setTimeout(function(){
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 200);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').tap(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('#btn-linkLottery-award').tap(function(e) {
                    e.preventDefault();
                    if(me.check()) {
                        if(!$('#btn-linkLottery-award').hasClass("flag")){
                            $('#btn-linkLottery-award').addClass("flag");
                            shownewLoading();
                            getResult('api/lottery/award', {
                                oi: openid,
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                rn: me.name ? encodeURIComponent(me.name) : "",
                                ph: me.mobile ? me.mobile : ""
                            }, 'callbackLotteryAwardHandler');
                            $("#link-dialog").find(".info-name label").text(me.name);
                            $("#link-dialog").find(".info-phone label").text(me.mobile);
                            shownewLoading();
                            setTimeout(function(){
                                $("#link-dialog").find(".before").addClass('none');
                                $("#link-dialog").find(".after").removeClass('none');
                                $("#link-dialog").find(".award-keyTips").addClass('none');
                                hidenewLoading();
                            }, 200);
                        }
                    }
                });
                this.$dialog.find('#btn-linkLottery-use').tap(function(e) {
                    e.preventDefault();
                    if (me.ru.length == 0) {
                        me.close();
                        hidenewLoading();
                    } else {
                        shownewLoading();
                        setTimeout(function(){
                            location.href = me.ru;
                        },500);
                    }
                });
                this.$dialog.find('#btn-linkLottery-close').tap(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    me.ru = data.ru;
                    if (data.ru.length == 0) {
                        $('#btn-linkLottery-use').addClass('none');
                    } else {
                        $('#btn-linkLottery-use').removeClass('none');
                    }
                    $("#link-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#link-dialog").find(".award-luckTips").html(data.tt || '恭喜您获得');
                    $("#link-dialog").find('.award-keyTips').html(data.pd || '请填写您的个人信息以便顺利领奖');
                    $("#link-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#link-dialog").find(".phone").val(data.ph ? data.ph : '');
                    $("#link-dialog").find(".before").removeClass('none');
                    $("#link-dialog").find(".after").addClass('none');
                }
            },
            check: function() {
                var me = this, name = $.trim($('.name').val()), mobile = $.trim($('.phone').val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖！');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖!');
                    return false;
                }
                me.name = name;
                me.mobile = mobile;
                return true;
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-link" id="link-dialog">')
                    ._('<section class="dialog link-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链奖)-关闭按钮"></a>')
                        ._('<img class="bg-dialog-header" src="./images/bg-dialog-header.png">')
                        ._('<section class="dialog-content">')
                            ._('<p class="award-luckTips"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<p class="award-keyTips"></p>')
                            ._('<section class="input-box before">')
                                ._('<input class="name" type="text" placeholder="姓名:">')
                                ._('<input class="phone" type="tel" placeholder="电话:">')
                            ._('</section>')
                            ._('<section class="info-box after">')
                                ._('<p class="info-name">姓名：<label></label></p>')
                                ._('<p class="info-phone">电话：<label></label></p>')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-link-lottery-award before" id="btn-linkLottery-award" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-award" data-collect-desc="弹层(外链奖)-领取按钮">领取</a>')
                            ._('<section class="btn-lottery-box after">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-link-use" id="btn-linkLottery-use" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-use" data-collect-desc="弹层(外链奖)-立即使用按钮">立即使用</a>')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-link-lottery-close" id="btn-linkLottery-close" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-close" data-collect-desc="弹层(外链奖)-继续摇奖按钮">继续摇奖</a>')
                            ._('</section>')
                        ._('</section>')
                        ._('<img class="bg-dialog-footer" src="./images/bg-dialog-footer.png">')
                    ._('</section>')
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
            name:null,
            mobile:null,
			open: function(data) {
                var me =this, $dialog = this.$dialog;
				H.lottery.isCanShake = false;
                H.lottery.canJump = false;
				H.dialog.open.call(this);
				if (!$dialog) {
				   this.event();
				}
            	me.update(data);
                me.readyFunc();
			},
			close: function() {
				var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').animate({'opacity':'0'}, 100);
                this.$dialog.animate({'opacity':'0'}, 200);
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 200);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').tap(function(e) {
					e.preventDefault();
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
					me.close();
				});
			},
            readyFunc: function(){
                var me = this;
                $('#btn-wxcardLottery-award').tap(function(e) {
                    e.preventDefault();
                    if($(".input-box").hasClass("none") || me.check()){
                        H.lottery.isCanShake = false;
                        if(!$('#btn-wxcardLottery-award').hasClass("flag")){
                            $('#btn-wxcardLottery-award').addClass("flag");
                            shownewLoading();
                            me.close();
                            me.sto = setTimeout(function(){
                                H.lottery.isCanShake = true;
                                hidenewLoading();
                            },15000);
                            $('#btn-wxcardLottery-award').text("领取中");
                            setTimeout(function(){
                                me.wx_card();
                            },1000);
                        }
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
                        H.lottery.wxCheck = true;
                        H.lottery.canJump = true;
                        H.lottery.isCanShake = true;
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid,
                            rn: me.name ? encodeURIComponent(me.name) : "",
                            ph: me.mobile ? me.mobile : ""
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        H.lottery.isCanShake = true;
                        H.lottery.canJump = true;
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        H.lottery.isCanShake = true;
                        H.lottery.canJump = true;
                        hidenewLoading();
                    },
                    cancel:function(){
                        H.lottery.isCanShake = true;
                        H.lottery.canJump = true;
                        hidenewLoading();
                    }
                });
            },
			update: function(data) {
				var me = this;
                if(data.result && data.pt == 7){
                    me.pt = data.pt;
                    $("#wxcard-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    $("#wxcard-dialog").find(".award-luckTips").html(data.tt || '恭喜您获得');
                    $("#wxcard-dialog").find('.award-keyTips').html(data.pd || '');
                    $("#wxcard-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#wxcard-dialog").find(".phone").val(data.ph ? data.ph : '');
                    if(data.cu == 1){
                        $('.wxcard-dialog').css({
                            'top': Math.ceil($(window).height()*0.1)
                        });
                        $(".input-box").removeClass("none");
                    }else{
                        $('.wxcard-dialog').css({
                            'top': Math.ceil($(window).height()*0.2)
                        });
                        $(".input-box").addClass("none");
                    }
                    me.ci = data.ci;
                    me.ts = data.ts;
                    me.si = data.si;
                }
			},
            check: function() {
                var me = this, name = $.trim($('.name').val()), mobile = $.trim($('.phone').val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖！');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖!');
                    return false;
                }
                me.name = name;
                me.mobile = mobile;
                return true;
            },
			tpl: function() {
				var t = simpleTpl();
                t._('<section class="modal modal-wxcard" id="wxcard-dialog">')
                    ._('<section class="dialog wxcard-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-wxcard-btn-close" data-collect-desc="弹层(卡券)-关闭按钮"></a>')
                        ._('<img class="bg-dialog-header" src="./images/bg-dialog-header.png">')
                        ._('<section class="dialog-content">')
                            ._('<p class="award-luckTips"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<section class="input-box none">')
                                ._('<p class="award-keyTips"></p>')
                                ._('<input class="name" type="text" placeholder="姓名:">')
                                ._('<input class="phone" type="tel" placeholder="电话:">')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">领取</a>')
                        ._('</section>')
                        ._('<img class="bg-dialog-footer" src="./images/bg-dialog-footer.png">')
                    ._('</section>')
                ._('</section>');
				return t.toString();
			}
		},
        thanksLottery: {
            $dialog: null,
            open: function() {
                var me =this,$dialog = this.$dialog;
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                   this.resize();
                }
                // setTimeout(function(){
                //     me.close();
                // }, 1500);
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').animate({'opacity':'0'}, 100);
                this.$dialog.animate({'opacity':'0'}, 200);
                setTimeout(function(){
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 200);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').tap(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('#btn-thanksLottery-close').tap(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            resize: function() {
                var me = this, thanksW = Math.ceil($(window).width() * 0.98);
                this.$dialog.find('.thanks-dialog').css({
                    'width': thanksW,
                    'height': thanksW,
                    'margin-top': -(thanksW / 2),
                    'margin-left': -(thanksW / 2)
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-thanks" id="thanks-dialog">')
                    ._('<section class="dialog thanks-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-thanks-btn-close" data-collect-desc="弹层(谢谢参与)-关闭按钮"></a>')
                        ._('<p>没中你就不摇了？还有老多老多啦！<br>不要停，继续摇！</p>')
                        ._('<a href="javascript:void(0);" class="btn-lottery btn-thanks-lottery-close" id="btn-thanksLottery-close" data-collect="true" data-collect-flag="dialog-thanks-btn-thanksLottery-close" data-collect-desc="弹层(谢谢参与)-继续摇奖按钮">继续摇奖</a>')
                    ._('</section>')
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
})(Zepto);

$(function() {
    H.dialog.init();
});