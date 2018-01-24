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
            this.$dialog.find('.dialog').addClass('spread');
            setTimeout(function(){
                me.$dialog.find('.dialog').removeClass('spread');
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
                this.$dialog.find('.dialog').removeClass('spread').addClass('closeUp');
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
                    ._('<div class="dialog-content">')
                    ._('<img class="icon-rule" src="./images/rule-title.png">')
                    ._('<div class="rule-content" id="rule-content">' + rule_temp + '</div>')
                    ._('<a class="btn-dialog-close"  data-collect="true" data-collect-flag="dialog-rule-closebtn" data-collect-desc="弹层(活动规则)-返回按钮">返回</a>')
                    ._('</div>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
        thanksLottery: {
            $dialog: null,
            open: function() {
                var me =this, $dialog = this.$dialog, winW = $(window).width(), winH = $(window).height();
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').removeClass('spread').addClass('closeUp');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                    H.lottery.isCanShake = true;
                }, 1000);
            },
            event: function() {
                var me = this;
                me.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                me.$dialog.find('.award-img').click(function(e) {
                    e.preventDefault();
                    toUrl("brandhome.html")
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-redbag" id="thanks-dialog">')
                    ._('<section class="dialog thanks-dialog">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-thanks-btn-close" data-collect-desc="弹层(谢谢参与)-关闭按钮"></a>')
                    ._('<section class="dialog-content">')
                    ._('<img class="award-img" src="./images/thanks-img.jpg" data-collect="true" data-collect-flag="dialog-thanks-btn-brand" data-collect-desc="弹层(谢谢参与)-名品馆按钮">')
                    ._('</section>')
                    ._('</section>')
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
                this.$dialog.find('.dialog').removeClass('spread').addClass('closeUp');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('#btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.close();
                });
                $(".redbag-dialog").click(function(e){
                    e.preventDefault();
                    if(!$('.redbag-dialog').hasClass("flag")) {
                        shownewLoading(null, '领取中...');
                        $('.redbag-dialog').addClass("flag");
                        $('.btn-redbag-get').text("领取中");
                        setTimeout(function(){
                            location.href = H.dialog.redbagLottery.rp;
                        },500);
                    }
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    me.rp = data.rp;
                    $(".redbag-dialog").find(".award-keyTips").html(data.tt);
                    $(".redbag-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-redbag" id="redbag-dialog">')
                    ._('<section class="dialog redbag-dialog" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-立即使用按钮">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-redbag-btn-close" data-collect-desc="弹层(红包)-关闭按钮"></a>')
                    ._('<section class="dialog-content">')
                    ._('<p class="icon-congrats">恭喜您中奖啦~</p>')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<section class="input-box">')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-redbag-get" id="btn-redbagLottery-use" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-立即使用按钮">领取红包</a>')
                    ._('</section>')
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
                this.$dialog.find('.dialog').removeClass('spread').addClass('closeUp');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    if(!is_android()){
                        location.reload(true);
                    }
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
                            shownewLoading(null,"领取中...");
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
                            setTimeout(function(){
                                $("#shiwu-dialog").find(".before").addClass('none');
                                $("#shiwu-dialog").find(".after").removeClass('none');
                                $("#shiwu-dialog").find(".award-keyTips").addClass('none');
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
                    ._('<p class="icon-congrats">恭喜您中奖啦~</p>')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<section class="input-box before">')
                    ._('<p><input class="name" type="text" placeholder="姓名："></p>')
                    ._('<p><input class="phone" type="tel" placeholder="电话："></p>')
                    ._('<p><input class="address" type="text" placeholder="地址："></p>')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物)-领取按钮">立即领取</a>')
                    ._('</section>')
                    ._('<section class="info-box after">')
                    ._('<p class="info-name">姓名：<label></label></p>')
                    ._('<p class="info-phone">电话：<label></label></p>')
                    ._('<p class="info-address">地址：<label></label></p>')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-close" id="btn-shiwuLottery-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-close" data-collect-desc="弹层(实物)-继续摇奖按钮">继续摇奖</a>')
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
                this.$dialog.find('.dialog').removeClass('spread').addClass('closeUp');
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
                        shownewLoading(null,"领取中...");
                        getResult('api/lottery/award', {
                            oi: openid,
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : ""
                        }, 'callbackLotteryAwardHandler');
                        setTimeout(function(){
                            location.href = me.ru;
                        },500);
                    }
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
                    $("#link-dialog").find(".award-keyTips").html(data.tt || '');
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-link" id="link-dialog">')
                    ._('<section class="dialog link-dialog">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链)-关闭按钮"></a>')
                    ._('<section class="dialog-content">')
                    ._('<p class="icon-congrats">恭喜您中奖啦~</p>')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<section class="input-box">')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-link-use" id="btn-linkLottery-use" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-use" data-collect-desc="弹层(外链奖)-立即使用按钮">立即领取</a>')
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
                this.$dialog.find('.dialog').removeClass('spread').addClass('closeUp');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            readyFunc: function(){
                var me = this;
                $('#btn-wxcardLottery-award').click(function(e) {
                    e.preventDefault();
                    if($(".input-cont").hasClass("none") || me.check()){
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
                var me = this, height = $(window).height();
                if(data.result && data.pt == 7){
                    me.pt = data.pt;
                    $("#wxcard-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    $("#wxcard-dialog").find('.award-keyTips').html(data.pd || '');
                    $("#wxcard-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#wxcard-dialog").find(".phone").val(data.ph ? data.ph : '');
                    if(data.cu == 1){
                        $(".input-cont").removeClass("none");
                    }else{
                        $(".input-cont").addClass("none");
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
                    ._('<section class="dialog-content">')
                    ._('<p class="icon-congrats">恭喜您中奖啦~</p>')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<section class="input-box">')
                    ._('<div class="input-cont none">')
                    ._('<p class="award-keyTips"></p>')
                    ._('<input class="name" type="text" placeholder="姓名:">')
                    ._('<input class="phone" type="tel" placeholder="电话:">')
                    ._('</div>')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">立即领取</a>')
                    ._('</section>')
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