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
                    'width': width * 0.9,
                    'left': width * 0.05,
                    'top': height * 0.15
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
                        ._('<div class="dialog-content">')
                            ._('<div class="rule-content" id="rule-content">' + rule_temp + '</div>')
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
                this.$dialog.find('#btn-shiwuLottery-close').click(function(e) {
                    e.preventDefault();
                    showTips("领取成功");
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    H.dialog.lru = data.ruid;
                    $("#shiwu-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#shiwu-dialog").find('.award-keyTips').html(data.tt || '请填写您的个人信息以便顺利领奖');
                    $("#shiwu-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#shiwu-dialog").find(".phone").val(data.ph ? data.ph : '');
                    $("#shiwu-dialog").find(".address").val(data.ad ? data.ad : '');
                    if(data.cu == 1){
                        $(".name").removeClass("none");
                        $(".name").parent().removeClass("none");
                        $(".info-name").removeClass("none");
                        $(".address").removeClass("none");
                        $(".address").parent().removeClass("none");
                        $(".info-address").removeClass("none");
                    }else{
                        $(".name").addClass("none");
                        $(".name").parent().addClass("none");
                        $(".info-name").addClass("none");
                        $(".address").addClass("none");
                        $(".address").parent().addClass("none");
                        $(".info-address").addClass("none");
                    }
                    $("#shiwu-dialog").find(".before").removeClass('none');
                    $("#shiwu-dialog").find(".after").addClass('none');
                }
            },
            check: function() {
                var me = this, name = $.trim($('.name').val()), mobile = $.trim($('.phone').val()),address = $.trim($('.address').val());

                if(!$('.name').hasClass("none")) {
                    if (name.length > 20 || name.length == 0) {
                        showTips('请填写您的姓名，以便顺利领奖！');
                        return false;
                    }
                }
                if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                }
                if(!$('.address').hasClass("none")){
                    if (address.length < 8 || address.length > 80 || address.length == 0) {
                        showTips('请填写您的详细地址，以便顺利领奖！');
                        return false;
                    }
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
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" data-collect="true" data-collect-flag="dialog-wxcard-btn-close" data-collect-desc="弹层(卡券)-关闭按钮"></a>')
                    ._('<section class="dialog-content">')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<div class="info-content">')
                                ._('<p class="award-keyTips"></p>')
                                ._('<section class="input-box before">')
                                ._('<p>姓名：<input class="name" type="text"></p>')
                                ._('<p>电话：<input class="phone" type="tel"></p>')
                                ._('<p>地址：<input class="address" type="text"></p>')
                                ._('</section>')
                                ._('<section class="info-box after">')
                                ._('<p class="info-name">姓名：<label></label></p>')
                                ._('<p class="info-phone">电话：<label></label></p>')
                                ._('<p class="info-address">地址：<label></label></p>')
                                ._('</section>')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物奖)-领取按钮"></a>')
                                ._('<section class="btn-lottery-box after">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-close" id="btn-shiwuLottery-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-close" data-collect-desc="弹层(实物奖)-确定按钮"></a>')
                                ._('</section>')
                            ._('</div>')
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
                t._('<section class="modal" id="thanks-dialog">')
                    ._('<section class="dialog thanks-dialog">')
                    ._('<section class="dialog-content thanks-content">')
                    ._('<p class="thanks-title">不是不中奖，只是缘分少了点！</p>')
                    ._('<img class="thanks-tips" src="./images/thanks-tip.png">')
                    ._('<a href="javascript:void(0);" class="btn-lottery" id="btn-thanks-continue" data-collect="true" data-collect-flag="dialog-thanks-btn-close" data-collect-desc="弹层(谢谢参与)-关闭按钮"></a>')
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
            },
            readyFunc: function(){
                var me = this;
                $('#btn-wxcardLottery-award,.award-img').click(function(e) {
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
                        },800);
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
                    $("#wxcard-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    me.ci = data.ci;
                    me.ts = data.ts;
                    me.si = data.si;
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-wxcard" id="wxcard-dialog">')
                    ._('<section class="dialog wxcard-dialog">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" data-collect="true" data-collect-flag="dialog-wxcard-btn-close" data-collect-desc="弹层(卡券)-关闭按钮"></a>')
                    ._('<section class="dialog-content">')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮"></a>')
                    ._('</section>')
                    ._('</section>')
                    ._('</section>');
                return t.toString();
            }
        },
        linkLottery: {
            $dialog: null,
            pt:null,
            name:null,
            mobile:null,
            ru:null,
            open: function(data) {
                var me =this, $dialog = this.$dialog;
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                me.update(data);
                var height = $(window).height(), width = $(window).width();
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
                $('#btn-linkLottery-award,.award-img').click(function(e) {
                    e.preventDefault();
                    H.lottery.isCanShake = false;
                    if(!$('#btn-linkLottery-award').hasClass("flag")){
                        $('#btn-linkLottery-award').addClass("flag");
                        shownewLoading();
                        me.close();
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid,
                            rn: me.name ? encodeURIComponent(me.name) : "",
                            ph: me.mobile ? me.mobile : ""
                        }, 'callbackLotteryAwardHandler');
                        setTimeout(function(){
                            location.href = me.ru;
                        },500);
                    }
                });
            },
            update: function(data) {
                var me = this;
                if(data.result && data.pt == 9){
                    H.dialog.lru = data.ruid;
                    me.pt = data.pt;
                    me.ru = data.ru;
                    $("#link-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="link-dialog">')
                    ._('<section class="dialog link-dialog">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链)-关闭按钮"></a>')
                    ._('<section class="dialog-content">')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<a href="javascript:void(0);" class="btn-lottery" id="btn-linkLottery-award" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-award" data-collect-desc="弹层(外链)-领取按钮"></a>')
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
                this.$dialog.find('.red-dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                $('#btn-redLottery-award,.award-img').click(function(e) {
                    e.preventDefault();
                    H.lottery.isCanShake = false;
                    if(!$('#btn-redLottery-award').hasClass("flag")){
                        $('#btn-redLottery-award').addClass("flag");
                        shownewLoading();
                        $('#btn-redLottery-award').text("领取中");
                        setTimeout(function(){
                            location.href = me.rp;
                        },500);
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
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="red-dialog">')
                    ._('<section class="red-dialog dialog">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" data-collect="true" data-collect-flag="dialog-red-btn-close" data-collect-desc="弹层(红包)-关闭按钮"></a>')
                    ._('<section class="dialog-content">')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<a href="javascript:void(0);" class="btn-lottery" id="btn-redLottery-award" data-collect="true" data-collect-flag="dialog-red-btn-redLottery-award" data-collect-desc="弹层(红包)-领取按钮"></a>')
                    ._('</section>')
                    ._('</section>')
                    ._('</section>')
                    ._('</section>');
                return t.toString();
            }
        },
        exchangeDialog: {
            $dialog: null,
            name: '',
            mobile: '',
            address: '',
            ru: '',
            uid:'',
            open: function(data) {
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
                this.$dialog.find('#btn-exchange-award').click(function(e) {
                    e.preventDefault();
                    if(me.check()) {
                        if(!$('#btn-exchange-award').hasClass("flag")){
                            $('#btn-exchange-award').addClass("flag");
                            shownewLoading();
                            getResult('api/mall/order/pay', {
                                openid: openid,
                                phone: me.mobile ? me.mobile : "",
                                buyCount: 1,
                                itemUuid: me.uid ? me.uid : '',
                                pu: H.product.uid,
                                wxheadurl: headimgurl ? headimgurl : "",
                                name: me.name ? encodeURIComponent(me.name) : "",
                                address: me.address ? encodeURIComponent(me.address) : "",
                                wxname: nickname ? encodeURIComponent(nickname) : ""
                            }, 'callbackMallApiPay');
                            hidenewLoading();
                        }
                    }
                });
                this.$dialog.find('#btn-exchange-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                me.uid = data.uid;
                $("#exchange-dialog").find(".award-img").attr("src", data.is).attr("onerror", "$(this).addClass(\'none\')");
                $("#exchange-dialog").find(".before").removeClass('none');
                $("#exchange-dialog").find(".after").addClass('none');
                hidenewLoading();
            },
            check: function() {
                var me = this, name = $.trim($('.name').val()), mobile = $.trim($('.phone').val()),address = $.trim($('.address').val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖！');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                }
                if(!$('.address').hasClass("none")){
                    if (address.length < 8 || address.length > 80 || address.length == 0) {
                        showTips('请填写您的详细地址，以便顺利领奖！');
                        return false;
                    }
                }
                me.name = name;
                me.mobile = mobile;
                me.address = address;
                return true;
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-shiwu" id="exchange-dialog">')
                    ._('<section class="dialog exchange-dialog">')
                    ._('<section class="dialog-content">')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<div class="info-content">')
                    ._('<p class="award-keyTips none"></p>')
                    ._('<section class="input-box before">')
                    ._('<p>姓名：<input class="name" type="text"></p>')
                    ._('<p>电话：<input class="phone" type="tel"></p>')
                    ._('<p>地址：<input class="address" type="text"></p>')
                    ._('</section>')
                    ._('<section class="info-box after">')
                    ._('<p class="info-name">姓名：<label></label></p>')
                    ._('<p class="info-phone">电话：<label></label></p>')
                    ._('<p class="info-address">地址：<label></label></p>')
                    ._('</section>')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-exchange-award" data-collect="true" data-collect-flag="dialog-exchange-btn-award" data-collect-desc="弹层(兑换)-领取按钮"></a>')
                    ._('<section class="btn-lottery-box after">')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-close" id="btn-exchange-close" data-collect="true" data-collect-flag="dialog-exchange-btn-close" data-collect-desc="弹层(兑换)-确定按钮"></a>')
                    ._('</section>')
                    ._('</div>')
                    ._('</section>')
                    ._('</section>')
                    ._('</section>');
                return t.toString();
            }
        }
    };

    W.callbackLotteryAwardHandler = function(data) {};
    W.commonApiRuleHandler = function(data) {
        if(data.code == 0){
            rule_temp = data.rule;
            $("#rule-content").html(data.rule);
        }
        hidenewLoading();
    };
    W.callbackMallApiPay = function(data){
        if(data.code == 0){
            showTips("兑换成功");
            H.product.already = true;
            $(".btn-exchange").addClass("already");
            $("#exchange-dialog").find(".info-name label").text(H.dialog.exchangeDialog.name);
            $("#exchange-dialog").find(".info-phone label").text(H.dialog.exchangeDialog.mobile);
            $("#exchange-dialog").find(".info-address label").text(H.dialog.exchangeDialog.address);
            setTimeout(function(){
                $("#exchange-dialog").find(".before").addClass('none');
                $("#exchange-dialog").find(".after").removeClass('none');
                $("#exchange-dialog").find(".award-keyTips").addClass('none');
            }, 200);
            $("#left-num").text($("#left-num").text()*1 - 1);
        }else{
            showTips(data.message);
            H.dialog.exchangeDialog.close();
        }
    }
})(Zepto);

$(function() {
    H.dialog.init();
});
