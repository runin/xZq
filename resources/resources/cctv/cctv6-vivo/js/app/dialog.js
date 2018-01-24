H.dialog = {
    ci:null,
    ts:null,
    si:null,
    $container: $('body'),
    init: function() {
        var me = this, width = $(window).width(), height = $(window).height();
        $('body').css({
            'width': width
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
            me.$dialog.find('.dialog').removeClass('bounceInDown');
        }, 1000);
        hidenewLoading();
    },
    relocate : function(){
        var height = $(window).height(), width = $(window).width();

        $('.dialog').each(function() {
            $(this).css({
                'width': width * 0.9, 
                'left': width * 0.05,
                'top': height * 0.10
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
            this.$dialog.find('.btn-back').click(function (e) {
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
                    ._('<img class="icon-head" src="./images/icon-rule.png">')
                    ._('<div class="dialog-content">')
                        ._('<div class="rule-content" id="rule-content">' + rule_temp + '</div>')
                        ._('<a href="javascript:void(0);" class="btn-back" id="btn-back" data-collect="true" data-collect-flag="dialog-rule-btn-back" data-collect-desc="弹层(活动规则)-返回按钮">')
                            ._('<img src="./images/btn-back.png">')
                        ._('</a>')
                    ._('</div>')
                ._('</div>')
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
                            nn: nickname ? encodeURIComponent($.cookie(mpappid + '_nickname')) : "",
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
                            hidenewLoading();
                        }, 200);
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
                $("#shiwu-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                $("#shiwu-dialog").find(".award-keyTips").html(data.pn || '');
                $("#shiwu-dialog").find(".name").val(data.rn ? data.rn : '');
                $("#shiwu-dialog").find(".phone").val(data.ph ? data.ph : '');
                $("#shiwu-dialog").find(".address").val(data.ad ? data.ad : '');
                $("#shiwu-dialog").find(".before").removeClass('none');
                $("#shiwu-dialog").find(".after").addClass('none');
                $('.shiwu-dialog').css({
                    'top': $(window).height() * 0.06
                });
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
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-close" data-collect-desc="弹层(实物)-关闭按钮"></a>')
                    ._('<img class="icon-head" src="./images/icon-luck.png">')
                    ._('<section class="dialog-content">')
                        ._('<p class="award-keyTips"></p>')
                        ._('<img class="award-img" src="./images/default-award.png">')
                        ._('<section class="input-box before">')
                            ._('<h5>请填写联系方式以便顺利领奖</h5>')
                            ._('<p><span>姓名：</span><input class="name" type="text" placeholder=""></p>')
                            ._('<p><span>电话：</span><input class="phone" type="tel" placeholder=""></p>')
                            ._('<p><span>地址：</span><input class="address" type="text" placeholder=""></p>')
                        ._('</section>')
                        ._('<section class="info-box after">')
                            ._('<p class="info-name">姓名：<label></label></p>')
                            ._('<p class="info-phone">电话：<label></label></p>')
                            ._('<p class="info-address">地址：<label></label></p>')
                        ._('</section>')
                        ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物)-领取按钮">')
                            ._('<img src="./images/btn-submit.png">')
                        ._('</a>')
                        ._('<section class="btn-lottery-box after">')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-close" id="btn-shiwuLottery-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-close" data-collect-desc="弹层(实物)-继续摇奖按钮">')
                                ._('<img src="./images/btn-ok.png">')
                            ._('</a>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>')
            ._('</section>');
            return t.toString();
        }
    },
    linkLottery: {
        $dialog: null,
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
            this.$dialog.find('#btn-linkLottery-use').click(function(e) {
                e.preventDefault();
                if (me.ru.length == 0) {
                    me.close();
                    hidenewLoading();
                } else {
                    shownewLoading();
                    getResult('api/lottery/award', {
                        oi: openid,
                        nn: nickname ? encodeURIComponent($.cookie(mpappid + '_nickname')) : "",
                        hi: headimgurl ? headimgurl : ""
                    }, 'callbackLotteryAwardHandler');
                    setTimeout(function(){
                        location.href = me.ru;
                    },500);
                }
            });
            this.$dialog.find('#btn-linkLottery-close').click(function(e) {
                e.preventDefault();
                me.close();
            });
        },
        update: function(data) {
            var me = this, height = $(window).height();
            if(data.result){
                me.ru = data.ru;
                if (data.ru.length == 0) {
                    $('#btn-linkLottery-use').addClass('none');
                } else {
                    $('#btn-linkLottery-use').removeClass('none');
                }
                $("#link-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                $("#link-dialog").find(".award-keyTips").html(data.pn || '');
                $('.link-dialog').css({
                    'top': height * 0.15
                });
            }
        },
        tpl: function() {
            var t = simpleTpl();
            t._('<section class="modal modal-link" id="link-dialog">')
                ._('<section class="dialog link-dialog">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链)-关闭按钮"></a>')
                    ._('<img class="icon-head" src="./images/icon-luck.png">')
                    ._('<section class="dialog-content">')
                        ._('<p class="award-keyTips"></p>')
                        ._('<img class="award-img" src="./images/default-award.png">')
                        ._('<section class="btn-lottery-box">')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-link-use" id="btn-linkLottery-use" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-use" data-collect-desc="弹层(外链)-立即领取按钮">')
                                ._('<img src="./images/btn-getLuck.png">')
                            ._('</a>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-link-lottery-close none" id="btn-linkLottery-close" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-close" data-collect-desc="弹层(外链)-继续摇奖按钮">')
                                ._('<img src="./images/btn-back.png">')
                            ._('</a>')
                        ._('</section>')
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
        name:null,
        mobile:null,
        open: function(data) {
            H.lottery.isCanShake = false;
            H.lottery.canJump = false;
            var me =this, $dialog = this.$dialog;
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
                H.dialog.split();
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
                    H.lottery.canJump = true;
                    H.lottery.isCanShake = true;
                    getResult('api/lottery/award', {
                        nn: nickname ? encodeURIComponent($.cookie(mpappid + '_nickname')) : "",
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
                H.dialog.lru = data.ruid;
                me.pt = data.pt;
                $("#wxcard-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                $("#wxcard-dialog").find(".award-keyTips").html(data.pn || '');
                $("#wxcard-dialog").find(".name").val(data.rn ? data.rn : '');
                $("#wxcard-dialog").find(".phone").val(data.ph ? data.ph : '');
                if(data.cu == 1){
                    $('.wxcard-dialog').css({
                        'top': Math.ceil($(window).height()*0.06)
                    });
                    $(".input-box").removeClass("none");
                }else{
                    $('.wxcard-dialog').css({
                        'top': Math.ceil($(window).height()*0.15)
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
                    ._('<img class="icon-head" src="./images/icon-luck.png">')
                    ._('<section class="dialog-content">')
                        ._('<p class="award-keyTips"></p>')
                        ._('<img class="award-img" src="./images/default-award.png">')
                        ._('<section class="input-box none">')
                            ._('<h5>请填写联系方式以便顺利领奖</h5>')
                            ._('<p><span>姓名：</span><input class="name" type="text" placeholder=""></p>')
                            ._('<p><span>电话：</span><input class="phone" type="tel" placeholder=""></p>')
                        ._('</section>')
                        ._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">')
                            ._('<img src="./images/btn-getLuck.png">')
                        ._('</a>')
                    ._('</section>')
                ._('</section>')
            ._('</section>');
            return t.toString();
        }
    },
    thanks: {
        $dialog: null,
        open: function(data) {
            H.lottery.isCanShake = false;
            H.lottery.canJump = false;
            var me =this, $dialog = this.$dialog, width = $(window).width(), height = $(window).height();
            H.dialog.open.call(this);
            if (!$dialog) {
               this.event();
            }
            $('.thanks-dialog').css({
                'top': height * 0.1
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
            this.$dialog.find('.btn-dialog-close').click(function(e) {
                e.preventDefault();
                me.close();
            });
            this.$dialog.find('#btn-thanksLottery-close').click(function(e) {
                e.preventDefault();
                me.close();
            });
        },
        tpl: function() {
            var t = simpleTpl();
            t._('<section class="modal modal-thanks" id="thanks-dialog">')
                ._('<section class="dialog thanks-dialog">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-thanks-btn-close" data-collect-desc="弹层(谢谢参与)-关闭按钮"></a>')
                    ._('<img class="icon-head icon-thanks" src="./images/icon-thanks.png">')
                    ._('<section class="dialog-content">')
                        ._('<p class="global-tips color-tips">vivo X6 够快才畅快</p>')
                        ._('<img class="icon-qrcode" src="./images/icon-qrcode.png">')
                        ._('<p class="info-qrcode">长按图片识别二维码<br>进入vivo智能手机移动商城</p>')
                    ._('</section>')
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

$(function() {
    H.dialog.init();
});