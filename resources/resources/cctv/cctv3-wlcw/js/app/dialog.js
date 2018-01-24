(function($) {
    H.dialog = {
        ci:null,
        ts:null,
        si:null,
        $container: $('body'),
        sau: '',
        lru: '',
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
                $('.btn-wheel').animate({'-webkit-transform': 'rotate(360deg)'}, 300);
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
                    'width': width * 0.7,
                    // 'min-height': height * 0.7, 
                    'left': width * 0.15,
                    'top': height * 0.25
                });
            });
        },
        rule: {
            $dialog: null,
            open: function () {
                H.lottery.isCanShake = false;
                H.dialog.open.call(this);
                this.event();
                hidenewLoading();
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    H.lottery.isCanShake = true;
                    $("#btn-rule").removeClass('requesting');
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function () {
                var me = this;
                this.$dialog.find('.rule-bg').click(function (e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function () {
                var t = simpleTpl();
                t._('<section class="modal modal-rule" id="rule-dialog">')
                    ._('<section class="dialog rule-dialog">')
                        ._('<section class="dialog-content">')
                            ._('<img class="rule-bg" src="./images/rule-bg.jpg">')
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
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
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
                this.$dialog.find('#btn-shiwuLottery-award').click(function(e) {
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
                            me.close();
                            H.dialog.rule.open();
                        }
                    }
                });
                this.$dialog.find('#btn-shiwuLottery-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    H.dialog.lru = data.ruid;
                    $("#shiwu-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#shiwu-dialog").find(".award-luckTips").html(data.tt || '');
                    $("#shiwu-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#shiwu-dialog").find(".phone").val(data.ph ? data.ph : '');
                    $("#shiwu-dialog").find(".address").val(data.ad ? data.ad : '');
                    $("#shiwu-dialog").find(".before").removeClass('none');
                }
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
                        ._('<img class="icon-jindai" src="./images/icon-jindai.png">')
                        ._('<section class="dialog-content">')
                            ._('<p class="award-congratulate">恭喜您</p>')
                            ._('<p class="award-luckTips"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<section class="input-box before">')
                                ._('<p><label>姓名：</label><input class="name" type="text"><i></i></p>')
                                ._('<p><label>电话：</label><input class="phone" type="tel"><i></i></p>')
                                ._('<p><label>地址：</label><input class="address" type="text"><i></i></p>')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物奖)-领取按钮">点击领取</a>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        thanksLottery: {
            $dialog: null,
            open: function() {
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                var height = $(window).height(), width = $(window).width();
                $("#thanks-dialog").find(".dialog").css({
                    'width': width * 0.6,
                    'left': width * 0.2,
                    'top': height * 0.35
                });
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('#btn-thanks-continue').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-shiwu" id="thanks-dialog">')
                    ._('<section class="dialog shiwu-dialog">')
                    ._('<img class="icon-jindai" src="./images/icon-jindai.png">')
                    ._('<section class="dialog-content">')
                    ._('<p class="award-thankTips" style="margin-top: 15%;">猴年大吉!</p>')
                    ._('<p class="award-thankTips">新春快乐!</p>')
                    ._('<p class="award-try">再试一次吧!</p>')
                    ._('<a href="javascript:void(0);" class="btn-lottery" style="margin:5% auto 10%;" id="btn-thanks-continue" data-collect="true" data-collect-flag="dialog-thanks-btn-continue" data-collect-desc="弹层(谢谢参与)-继续摇奖">再试一次</a>')
                    ._('</section>')
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
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                    me.close();
                });
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                    me.close();
                });
            },
            readyFunc: function(){
                var me = this;
                $('#btn-wxcardLottery-award').click(function(e) {
                    e.preventDefault();
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
                        H.lottery.canJump = true;
                        H.lottery.isCanShake = true;
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid,
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
                    H.dialog.lru = data.ruid;
                    me.pt = data.pt;
                    $("#wxcard-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    $("#wxcard-dialog").find(".award-luckTips").html(data.tt || '');
                    $('.wxcard-dialog').css({
                        'top': Math.ceil($(window).height()*0.3)
                    });
                    me.ci = data.ci;
                    me.ts = data.ts;
                    me.si = data.si;
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-wxcard" id="wxcard-dialog">')
                    ._('<section class="dialog wxcard-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-wxcard-btn-close" data-collect-desc="弹层(卡券)-关闭按钮"></a>')
                        ._('<img class="icon-jindai" src="./images/icon-jindai.png">')
                        ._('<section class="dialog-content">')
                            ._('<p class="award-congratulate">恭喜您</p>')
                            ._('<p class="award-luckTips"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">点击领取</a>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        redLottery: {
            $dialog: null,
            pt:null,
            name:null,
            mobile:null,
            rp:null,
            open: function(data) {
                var me =this, $dialog = this.$dialog;
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
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
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                $('#btn-redLottery-award').click(function(e) {
                    e.preventDefault();
                    H.lottery.isCanShake = false;
                    if(!$('#btn-redLottery-award').hasClass("flag")){
                        $('#btn-redLottery-award').addClass("flag");
                        shownewLoading();
                        $('#btn-redLottery-award').text("领取中");
                        setTimeout(function(){
                            location.href = me.rp;
                        },1000);
                    }
                });
            },
            update: function(data) {
                var me = this;
                if(data.result && data.pt == 4){
                    H.dialog.lru = data.ruid;
                    me.pt = data.pt;
                    me.rp = data.rp;
                    $("#red-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    $("#red-dialog").find('.red-keyTips').html(data.tt || '');
                    $("#red-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#red-dialog").find(".phone").val(data.ph ? data.ph : '');
                    $('.wxcard-dialog').css({
                        'top': Math.ceil($(window).height()*0.2)
                    });
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-wxcard" id="red-dialog">')
                    ._('<section class="dialog wxcard-dialog">')
                    ._('<img class="icon-jindai" src="./images/icon-jindai.png">')
                    ._('<section class="dialog-content">')
                        ._('<div class="content-div">')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<p class="red-keyTips"></p>')
                        ._('</div>')
                        ._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-redLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-redLottery-award" data-collect-desc="弹层(红包)-领取按钮">点击领取</a>')
                    ._('</section>')
                    ._('</section>')
                    ._('</section>');
                return t.toString();
            }
        }
    };

    W.callbackLotteryAwardHandler = function(data) {};
    W.callbackRuleHandler = function(data) {
        if(data.code == 0){
            H.dialog.rule.update(data.rule);
        }
    };
})(Zepto);

$(function() {
    H.dialog.init();
});