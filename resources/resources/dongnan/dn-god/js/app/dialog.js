(function($) {
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
            hidenewLoading();
            setTimeout(function(){
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
                    'left': width * 0.06,
                    'top': height * 0.16
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
                hidenewLoading();
                $("#btn-rule").removeClass('requesting');
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
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
                t._('<section class="modal modal-rule modal-flag" id="rule-dialog">')
                    ._('<div class="dialog rule-dialog">')
                        ._('<a href="#" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-rule-btn-close" data-collect-desc="弹层(活动规则)-关闭按钮"></a>')
                        ._('<div class="dialog-content">')
                            ._('<h1>活动规则</h1>')
                            ._('<div class="rule-content" id="rule-content">' + rule_temp + '</div>')
                        ._('</div>')
                    ._('</div>')
                ._('</section>');
                return t.toString();
            }
        },
        redbagLottery: {
            $dialog: null,
            rp:null,
            open: function(data) {
                var me =this, $dialog = this.$dialog, winW = $(window).width(), winH = $(window).height();
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
            },
            close: function() {
                var me = this;
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
            },
            event: function() {
                var me = this;
                $(".redbag-dialog").click(function(e){
                    e.preventDefault();
                    if(!$('.redbag-dialog').hasClass("flag")) {
                        shownewLoading(null, '领取中...');
                        $('.redbag-dialog').addClass("flag");
                        setTimeout(function(){
                            location.href = H.dialog.redbagLottery.rp;
                        },50);
                    }
                });
            },
            update: function(data) {
                var me = this, height = $(window).height();
                if(data.result){
                    me.rp = data.rp;
                    $("#redbag-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#redbag-dialog").find(".award-keyTips").html(data.tt || '');
                    $("#redbag-dialog").find("h6 label").html((data.pv / 100) || '');
                }
                this.$dialog.find('.dialog').css({
                    'top': Math.ceil($(window).height()*0.22)
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-redbag" id="redbag-dialog">')
                    ._('<section class="dialog redbag-dialog" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-立即使用按钮">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close none" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-redbag-btn-close" data-collect-desc="弹层(红包)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<img class="icon-luck" src="./images/icon-luck.png">')
                            ._('<p class="award-keyTips"></p>')
                            ._('<h6>现金 <label></label>元</h6>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-redbag-get" id="btn-redbagLottery-use" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-立即使用按钮"><img src="./images/btn-get.png"></a>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        jifenLottery: {
            $dialog: null,
            name: '',
            mobile: '',
            address: '',
            ru: '',
            open: function(data) {
                H.index.isCanShake = false;
                H.index.canJump = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
            },
            close: function() {
                var me = this;
                H.index.isCanShake = true;
                H.index.canJump = true;
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('#btn-jifenLottery-award').click(function(e) {
                    e.preventDefault();
                    if(!$('#btn-jifenLottery-award').hasClass("flag")){
                        $('#btn-jifenLottery-award').addClass("flag");
                        getResult('api/lottery/award', {
                            oi: openid,
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : ""
                        }, 'callbackLotteryAwardHandler');
                        me.close();
                        showTips('领取成功');
                    }
                });
                this.$dialog.find('#btn-jifenLottery-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    $("#jifen-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#jifen-dialog").find(".award-keyTips").html(data.tt || '');
                    $("#jifen-dialog").find("h6 label").html(data.pv || '');
                }
                this.$dialog.find('.dialog').css({
                    'top': Math.ceil($(window).height()*0.22)
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-jifen" id="jifen-dialog">')
                    ._('<section class="dialog jifen-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-jifen-btn-close" data-collect-desc="弹层(实物)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<img class="icon-luck" src="./images/icon-luck.png">')
                            ._('<p class="award-keyTips"></p>')
                            ._('<h6>金币 <label></label>枚</h6>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-jifen-lottery-award" id="btn-jifenLottery-award" data-collect="true" data-collect-flag="dialog-jifen-btn-jifenLottery-award" data-collect-desc="弹层(实物)-领取按钮"><img src="./images/btn-get.png"></a>')
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
                H.index.isCanShake = false;
                H.index.canJump = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
            },
            close: function() {
                var me = this;
                H.index.isCanShake = true;
                H.index.canJump = true;
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
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
                            getResult('api/lottery/award', {
                                oi: openid,
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                rn: me.name ? encodeURIComponent(me.name) : "",
                                ph: me.mobile ? me.mobile : "",
                                ad: me.address ? encodeURIComponent(me.address) : ""
                            }, 'callbackLotteryAwardHandler');
                            showTips('领取成功!');
                            me.close();
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
                    $("#shiwu-dialog").find(".award-keyTips").html(data.tt || '');
                    $("#shiwu-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#shiwu-dialog").find(".phone").val(data.ph ? data.ph : '');
                    $("#shiwu-dialog").find(".address").val(data.ad ? data.ad : '');
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
                        ._('<section class="dialog-content">')
                            ._('<img class="icon-luck" src="./images/icon-luck.png">')
                            ._('<p class="award-keyTips"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<section class="input-box">')
                                ._('<h5>正确填写信息以便顺利领奖</h5>')
                                ._('<input class="name" type="text" placeholder="姓名: ">')
                                ._('<input class="phone" type="tel" placeholder="电话: ">')
                                ._('<input class="address" type="text" placeholder="地址: ">')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物)-领取按钮"><img src="./images/btn-get.png"></a>')
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
                if (data.ru.length == 0) {
                    H.index.thanks();
                    H.index.isCanShake = true;
                    H.index.canJump = true;
                    return;
                }
                H.index.isCanShake = false;
                H.index.canJump = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
            },
            close: function() {
                var me = this;
                H.index.isCanShake = true;
                H.index.canJump = true;
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('#btn-linkLottery-use').click(function(e) {
                    e.preventDefault();
                    if(me.check()) {
                        if(!$('#btn-linkLottery-use').hasClass("flag")){
                            $('#btn-linkLottery-use').addClass("flag");
                            shownewLoading(null, '领取中，请稍后...');
                            getResult('api/lottery/award', {
                                oi: openid,
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                rn: me.name ? encodeURIComponent(me.name) : "",
                                ph: me.mobile ? me.mobile : ""
                            }, 'callbackLotteryAwardHandler');
                            if (me.ru.length == 0) {
                                me.close();
                                hidenewLoading();
                            } else {
                                setTimeout(function(){
                                    location.href = me.ru;
                                },50);
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
                    $("#link-dialog").find(".award-keyTips").html(data.tt || '');
                    $("#link-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#link-dialog").find(".phone").val(data.ph ? data.ph : '');
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
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<img class="icon-luck" src="./images/icon-luck.png">')
                            ._('<p class="award-keyTips"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<section class="input-box">')
                                ._('<h5>正确填写信息以便顺利领奖</h5>')
                                ._('<input class="name" type="text" placeholder="姓名: ">')
                                ._('<input class="phone" type="tel" placeholder="电话: ">')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-link-use" id="btn-linkLottery-use" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-use" data-collect-desc="弹层(外链)-点我领取按钮"><img src="./images/btn-get.png"></a>')
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
                H.index.isCanShake = false;
                H.index.canJump = false;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
                me.readyFunc();
            },
            close: function() {
                var me = this;
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.index.isCanShake = true;
                    H.index.canJump = true;
                    me.close();
                });
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    H.index.isCanShake = true;
                    H.index.canJump = true;
                    me.close();
                });
            },
            readyFunc: function(){
                var me = this;
                $('#btn-wxcardLottery-award').click(function(e) {
                    e.preventDefault();
                    if($(".input-box").hasClass("none") || me.check()){
                        H.index.isCanShake = false;
                        if(!$('#btn-wxcardLottery-award').hasClass("flag")){
                            $('#btn-wxcardLottery-award').addClass("flag");
                            shownewLoading();
                            me.wx_card();
                            me.close();
                            me.sto = setTimeout(function(){
                                H.index.isCanShake = true;
                                hidenewLoading();
                            },15000);
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
                        H.index.wxCheck = true;
                        H.index.canJump = true;
                        H.index.isCanShake = true;
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid,
                            rn: me.name ? encodeURIComponent(me.name) : "",
                            ph: me.mobile ? me.mobile : ""
                        }, 'callbackLotteryAwardHandler');
                        showTips('领取成功');
                    },
                    fail: function(res){
                        H.index.isCanShake = true;
                        H.index.canJump = true;
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        H.index.isCanShake = true;
                        H.index.canJump = true;
                        hidenewLoading();
                    },
                    cancel:function(){
                        H.index.isCanShake = true;
                        H.index.canJump = true;
                        hidenewLoading();
                    }
                });
            },
            update: function(data) {
                var me = this, height = $(window).height();
                if(data.result && data.pt == 7){
                    me.pt = data.pt;
                    me.ci = data.ci;
                    me.ts = data.ts;
                    me.si = data.si;
                    $("#wxcard-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    $("#wxcard-dialog").find(".award-keyTips").html(data.tt || '');
                    $("#wxcard-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#wxcard-dialog").find(".phone").val(data.ph ? data.ph : '');
                    if(data.cu == 1){
                        $('.wxcard-dialog').css({
                            'top': Math.ceil($(window).height()*0.16)
                        });
                        $(".input-box").removeClass("none");
                    }else{
                        $('.wxcard-dialog').css({
                            'top': Math.ceil($(window).height()*0.22)
                        });
                        $(".input-box").addClass("none");
                    }
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
                        ._('<section class="dialog-content">')
                            ._('<img class="icon-luck" src="./images/icon-luck.png">')
                            ._('<p class="award-keyTips"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<section class="input-box none">')
                                ._('<h5>正确填写信息以便顺利领奖</h5>')
                                ._('<input class="name" type="text" placeholder="姓名:">')
                                ._('<input class="phone" type="tel" placeholder="电话:">')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮"><img src="./images/btn-get.png"></a>')
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
})(Zepto);

$(function() {
    H.dialog.init();
});