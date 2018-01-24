(function($) {
    H.dialog = {
        ci:null,
        ts:null,
        si:null,
        $container: $('body'),
        shiwuPn:null,
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
                        ._('</div>')
                        ._('<img src="./images/bg-dialog-footer.png">')
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
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
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
                var me = this, height = $(window).height();
                if(data.result){
                    me.rp = data.rp;
                    $(".redbag-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $('.redbag-dialog').css({
                        'top': height * 0.15
                    });
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-redbag" id="redbag-dialog">')
                    ._('<section class="dialog redbag-dialog" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-立即使用按钮">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-redbag-btn-close" data-collect-desc="弹层(红包)-关闭按钮"></a>')
                        ._('<section class="global-header">')
                            ._('<img class="icon-redbag-back" src="./images/icon-redbag-back.png">')
                            ._('<img class="icon-redbag-gold" src="./images/icon-redbag-gold.png">')
                            ._('<img class="icon-redbag-prev" src="./images/icon-redbag-prev.png">')
                            ._('<img class="icon-lottery-yhlogo" src="./images/icon-lottery-yhlogo.png">')
                            ._('<img class="icon-lottery-denglong" src="./images/icon-denglong.png">')
                        ._('</section>')
                        ._('<section class="dialog-content">')
                            //._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<section class="btn-lottery-box">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-redbag-get" id="btn-redbagLottery-use" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-立即使用按钮">领取红包</a>')
                            ._('</section>')
                            ._('<section class="dialog-bottom">')
                                ._('<img src="./images/icon-kids.png" class="icon-kids">')
                                ._('<img src="./images/icon-cw.png" class="icon-cw">')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                    ._('<section class="flash-box"><img class="icon-flash" src="./images/icon-flash.png"></section>')
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
                        ._('<section class="global-header">')
                            ._('<img class="icon-redbag-back" src="./images/icon-redbag-back.png">')
                            ._('<img class="icon-redbag-gold" src="./images/icon-redbag-gold.png">')
                            ._('<img class="icon-redbag-prev" src="./images/icon-redbag-prev.png">')
                            ._('<img class="icon-lottery-yhlogo" src="./images/icon-lottery-yhlogo.png">')
                        ._('</section>')
                        ._('<section class="dialog-content">')
                            ._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<p class="award-keyTips"></p>')
                            ._('<section class="input-box before">')
                                ._('<p><span>姓名：</span><input class="name" type="text" placeholder=""></p>')
                                ._('<p><span>电话：</span><input class="phone" type="tel" placeholder=""></p>')
                                ._('<p><span>地址：</span><input class="address" type="text" placeholder=""></p>')
                            ._('</section>')
                            ._('<section class="info-box after">')
                                ._('<p class="info-name">姓名：<label></label></p>')
                                ._('<p class="info-phone">电话：<label></label></p>')
                                ._('<p class="info-address">地址：<label></label></p>')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物)-领取按钮">领&nbsp;&nbsp;&nbsp;取</a>')
                            ._('<section class="btn-lottery-box after">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-close" id="btn-shiwuLottery-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-close" data-collect-desc="弹层(实物)-继续摇奖按钮">继续摇奖</a>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                    ._('<section class="flash-box"><img class="icon-flash" src="./images/icon-flash.png"></section>')
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
                this.$dialog.find('#btn-linkLottery-award').click(function(e) {
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
                            shownewLoading();
                        }
                    }
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
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
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
                    $("#link-dialog").find(".award-keyTips").html(data.tt || '');
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
                        ._('<section class="global-header">')
                            ._('<img class="icon-redbag-back" src="./images/icon-redbag-back.png">')
                            ._('<img class="icon-redbag-gold" src="./images/icon-redbag-gold.png">')
                            ._('<img class="icon-redbag-prev" src="./images/icon-redbag-prev.png">')
                            ._('<img class="icon-lottery-yhlogo" src="./images/icon-lottery-yhlogo.png">')
                            ._('<img class="icon-lottery-denglong" src="./images/icon-denglong.png">')
                        ._('</section>')
                        ._('<section class="dialog-content">')
                            ._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            //._('<p class="award-keyTips"></p>')
                            ._('<section class="btn-lottery-box">')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-link-use" id="btn-linkLottery-use" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-use" data-collect-desc="弹层(外链奖)-立即使用按钮">点击领取</a>')
                    //._('<a href="javascript:void(0);" class="btn-lottery btn-link-lottery-close" id="btn-linkLottery-close" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-close" data-collect-desc="弹层(外链奖)-继续摇奖按钮">继续摇奖</a>')
                            ._('</section>')
                            ._('<section class="dialog-bottom">')
                                ._('<img src="./images/icon-kids.png" class="icon-kids">')
                                ._('<img src="./images/icon-cw.png" class="icon-cw">')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                    ._('<section class="flash-box"><img class="icon-flash" src="./images/icon-flash.png"></section>')
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
                        $(".input-box").removeClass("none");
                    }else{
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
                        ._('<section class="global-header">')
                            ._('<img class="icon-redbag-back" src="./images/icon-redbag-back.png">')
                            ._('<img class="icon-redbag-gold" src="./images/icon-redbag-gold.png">')
                            ._('<img class="icon-redbag-prev" src="./images/icon-redbag-prev.png">')
                            ._('<img class="icon-lottery-yhlogo" src="./images/icon-lottery-yhlogo.png">')
                            ._('<img class="icon-lottery-denglong" src="./images/icon-denglong.png">')
                        ._('</section>')
                        ._('<section class="dialog-content">')
                            ._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<section class="input-box none">')
                                //._('<p class="award-keyTips"></p>')
                                ._('<input class="name" type="text" placeholder="姓名:">')
                                ._('<input class="phone" type="tel" placeholder="电话:">')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">领&nbsp;&nbsp;&nbsp;取</a>')
                        ._('<section class="dialog-bottom">')
                            ._('<img src="./images/icon-kids.png" class="icon-kids">')
                            ._('<img src="./images/icon-cw.png" class="icon-cw">')
                        ._('</section>')
                        ._('</section>')
                    ._('</section>')
                    ._('<section class="flash-box"><img class="icon-flash" src="./images/icon-flash.png"></section>')
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
                        ._('<section class="global-header">')
                            ._('<img class="icon-redbag-back" src="./images/icon-redbag-back.png">')
                            ._('<img class="icon-redbag-prev" src="./images/icon-redbag-prev.png">')
                            ._('<img class="icon-lottery-yhlogo" src="./images/icon-lottery-yhlogo.png">')
                        ._('</section>')
                        ._('<section class="dialog-content">')
                            ._('<p class="tips-thanks"><img src="./images/tips-thanks.png"></p>')
                            ._('<img class="icon-qrcode" src="./images/icon-qrcode.png">')
                            ._('<p class="info-qrcode">长按图片识别二维码<br>更多惊喜等你来</p>')
                            ._('<section class="btn-lottery-box">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-thanks-lottery-close" id="btn-thanksLottery-close" data-collect="true" data-collect-flag="dialog-thanks-btn-thanksLottery-close" data-collect-desc="弹层(谢谢参与)-继续摇奖按钮">继续摇奖</a>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                    ._('<section class="flash-box"><img class="icon-flash" src="./images/icon-flash.png"></section>')
                ._('</section>');
                return t.toString();
            }
        },
        shiwuLottery4vote: {
            $dialog: null,
            name: '',
            mobile: '',
            address: '',
            idcard: '',
            ru: '',
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
                    H.dialog.record();
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
                                ad: me.address ? encodeURIComponent(me.address) : "",
                                ic: me.idcard ? me.idcard : ""
                            }, 'callbackLotteryAwardHandler');
                            $("#shiwu-dialog").find(".info-name label").text(me.name);
                            $("#shiwu-dialog").find(".info-phone label").text(me.mobile);
                            $("#shiwu-dialog").find(".info-address label").text(me.address);
                            $("#shiwu-dialog").find(".info-idcard label").text(me.idcard);
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
                var me = this, height = $(window).height();
                if(data.result){
                    H.dialog.shiwuPn = data.pn;
                    $("#shiwu-dialog").find(".award-nameTips").html(data.tt || '');
                    //$("#shiwu-dialog").find(".award-keyTips").html(data.tt || '');
                    $("#shiwu-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#shiwu-dialog").find(".phone").val(data.ph ? data.ph : '');
                    $("#shiwu-dialog").find(".address").val(data.ad ? data.ad : '');
                    $("#shiwu-dialog").find(".before").removeClass('none');
                    $("#shiwu-dialog").find(".after").addClass('none');
                    $('.link-dialog').css({
                        'top': height * 0.10
                    });
                    if(data.cu == 1){
                        $(".idcard").removeClass("none");
                        $(".info-idcard").removeClass("none");
                    }
                }
            },
            check: function() {
                var me = this, name = $.trim($('.name').val()), mobile = $.trim($('.phone').val()), address = $.trim($('.address').val()), idcard = $.trim($('.idcard').val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖！');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                } else if (address.length < 8 || address.length > 80 || address.length == 0) {
                    showTips('地址详细才能收到奖品哦！');
                    return false;
                }
                if(!$(".idcard").hasClass("none")){
                    if (idcard.length != 18) {
                        showTips('请正确填写身份证号，以便顺利领奖！');
                        return false;
                    }
                }
                me.name = name;
                me.mobile = mobile;
                me.address = address;
                me.idcard = idcard;
                return true;
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-shiwu vote" id="shiwu-dialog">')
                    ._('<section class="dialog shiwu-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwuvote-btn-close" data-collect-desc="抽奖弹层(实物)-关闭按钮"></a>')
                        ._('<section class="global-header">')
                            ._('<img class="icon-redbag-back" src="./images/icon-redbag-back.png">')
                            ._('<img class="icon-luckytips" src="./images/icon-luckytips.png">')
                            ._('<img class="icon-redbag-prev" src="./images/icon-redbag-prev.png">')
                            ._('<img class="icon-lottery-yhlogo" src="./images/icon-lottery-yhlogo.png">')
                        ._('</section>')
                        ._('<section class="dialog-content">')
                            ._('<p class="award-nameTips"></p>')
                            //._('<p class="award-keyTips"></p>')
                            ._('<section class="input-box before">')
                                ._('<p><input class="name" type="text" placeholder="姓名"></p>')
                                ._('<p><input class="phone" type="tel" placeholder="电话"></p>')
                                ._('<p><input class="address" type="text" placeholder="地址"></p>')
                                ._('<p><input class="idcard none" type="text" placeholder="身份证号"></p>')
                            ._('</section>')
                            ._('<section class="info-box after">')
                                ._('<p class="info-name">姓名：<label></label></p>')
                                ._('<p class="info-phone">电话：<label></label></p>')
                                ._('<p class="info-address">地址：<label></label></p>')
                                ._('<p class="info-idcard none">身份证号：<label></label></p>')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwuvote-btn-shiwuLottery-award" data-collect-desc="抽奖弹层(实物)-领取按钮">领&nbsp;&nbsp;&nbsp;取</a>')
                            ._('<section class="btn-lottery-box after">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-close" id="btn-shiwuLottery-close" data-collect="true" data-collect-flag="dialog-shiwuvote-btn-shiwuLottery-close" data-collect-desc="抽奖弹层(实物)-继续摇奖按钮">关&nbsp;&nbsp;&nbsp;闭</a>')
                            ._('</section>')
                            ._('<section class="dialog-bottom">')
                                ._('<img src="./images/icon-kids.png" class="icon-kids">')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                    ._('<section class="flash-box"><img class="icon-flash" src="./images/icon-flash.png"></section>')
                ._('</section>');
                return t.toString();
            }
        },
        linkLottery4vote: {
            $dialog: null,
            ru: '',
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
                    H.dialog.record();
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('#btn-linkLottery-award').click(function(e) {
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
                            shownewLoading();
                        }
                    }
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
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
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
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-linkvote-btn-close" data-collect-desc="抽奖弹层(外链)-关闭按钮"></a>')
                        ._('<section class="global-header">')
                            ._('<img class="icon-redbag-back" src="./images/icon-redbag-back.png">')
                            ._('<img class="icon-redbag-gold" src="./images/icon-redbag-gold.png">')
                            ._('<img class="icon-redbag-prev" src="./images/icon-redbag-prev.png">')
                            ._('<img class="icon-lottery-yhlogo" src="./images/icon-lottery-yhlogo.png">')
                            ._('<img class="icon-lottery-denglong" src="./images/icon-denglong.png">')
                        ._('</section>')
                        ._('<section class="dialog-content">')
                            ._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<p class="award-keyTips"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<section class="btn-lottery-box">')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-link-use" id="btn-linkLottery-use" data-collect="true" data-collect-flag="dialog-linkvote-btn-linkLottery-use" data-collect-desc="抽奖弹层(外链)-立即使用按钮">点击领取</a>')
                    //._('<a href="javascript:void(0);" class="btn-lottery btn-link-lottery-close" id="btn-linkLottery-close" data-collect="true" data-collect-flag="dialog-linkvote-btn-linkLottery-close" data-collect-desc="抽奖弹层(外链)-继续摇奖按钮">继续摇奖</a>')
                        ._('<section class="dialog-bottom">')
                            ._('<img src="./images/icon-kids.png" class="icon-kids">')
                            ._('<img src="./images/icon-cw.png" class="icon-cw">')
                        ._('</section>')
                        ._('</section>')
                        ._('</section>')
                    ._('</section>')
                    ._('<section class="flash-box"><img class="icon-flash" src="./images/icon-flash.png"></section>')
                ._('</section>');
                return t.toString();
            }
        },
        wxcardLottery4Vote: {
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
                    H.dialog.record();
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
                    if($(".input-box").hasClass("none") || me.check()){
                        if(!$('#btn-wxcardLottery-award').hasClass("flag")){
                            $('#btn-wxcardLottery-award').addClass("flag");
                            shownewLoading();
                            me.close();
                            me.sto = setTimeout(function(){
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
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid,
                            rn: me.name ? encodeURIComponent(me.name) : "",
                            ph: me.mobile ? me.mobile : ""
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        hidenewLoading();
                    },
                    cancel:function(){
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
                        $(".input-box").removeClass("none");
                    }else{
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
                    ._('<section class="global-header">')
                    ._('<img class="icon-redbag-back" src="./images/icon-redbag-back.png">')
                    ._('<img class="icon-redbag-gold" src="./images/icon-redbag-gold.png">')
                    ._('<img class="icon-redbag-prev" src="./images/icon-redbag-prev.png">')
                    ._('<img class="icon-lottery-yhlogo" src="./images/icon-lottery-yhlogo.png">')
                    ._('<img class="icon-lottery-denglong" src="./images/icon-denglong.png">')
                    ._('</section>')
                    ._('<section class="dialog-content">')
                    ._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<section class="input-box none">')
                    //._('<p class="award-keyTips"></p>')
                    ._('<input class="name" type="text" placeholder="姓名:">')
                    ._('<input class="phone" type="tel" placeholder="电话:">')
                    ._('</section>')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">领&nbsp;&nbsp;&nbsp;取</a>')
                    ._('<section class="dialog-bottom">')
                    ._('<img src="./images/icon-kids.png" class="icon-kids">')
                    ._('<img src="./images/icon-cw.png" class="icon-cw">')
                    ._('</section>')
                    ._('</section>')
                    ._('</section>')
                    ._('<section class="flash-box"><img class="icon-flash" src="./images/icon-flash.png"></section>')
                    ._('</section>');
                return t.toString();
            }
        },
        thanks4vote: {
            $dialog: null,
            open: function(data) {
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
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                    H.dialog.record();
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
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-thanksvote-btn-close" data-collect-desc="抽奖弹层(谢谢参与)-关闭按钮"></a>')
                        ._('<section class="global-header">')
                            ._('<img class="icon-redbag-back" src="./images/icon-redbag-back.png">')
                            ._('<img class="icon-redbag-prev" src="./images/icon-redbag-prev.png">')
                            ._('<img class="icon-lottery-yhlogo" src="./images/icon-lottery-yhlogo.png">')
                        ._('</section>')
                        ._('<section class="dialog-content">')
                            ._('<p class="tips-thanks"><img src="./images/tips-thanks.png"></p>')
                            ._('<img class="icon-qrcode" src="./images/icon-qrcode.png">')
                            ._('<p class="info-qrcode">长按图片识别二维码<br>更多惊喜等你来</p>')
                            ._('<section class="btn-lottery-box">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-thanks-lottery-close" id="btn-thanksLottery-close" data-collect="true" data-collect-flag="dialog-thanksvote-btn-thanksLottery-close" data-collect-desc="抽奖弹层(谢谢参与)-继续摇奖按钮">返&nbsp;&nbsp;&nbsp;回</a>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                    ._('<section class="flash-box"><img class="icon-flash" src="./images/icon-flash.png"></section>')
                ._('</section>');
                return t.toString();
            }
        },
        record: function(){
            getResult("api/lottery/allrecord",{at:6,ol:1},"callbackLotteryAllRecordHandler");
        },
        recordDialog:{
            $dialog: null,
            open: function(data,isTrue) {
                var me =this, $dialog = this.$dialog, width = $(window).width(), height = $(window).height();
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                $('.record-dialog').css({
                    'top': height * 0.05
                });
                if(isTrue){
                    me.update(data);
                }else{
                    me.falseUpdate(data);
                }
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
                this.$dialog.find('.dialog-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(data){
                var t = simpleTpl();
                var tp = simpleTpl();
                var falseData = H.dialog.shiwuPn;
                var delay = true;
                for(var i = 0; i < data.length; i++){
                    if(data[i].pn.indexOf('门票') >= 0){
                        tp._('<div class="content-tr">')
                            ._('<span class="head"><img src="' + (data[i].hi ? (data[i].hi + "/" + yao_avatar_size) : "./images/avatar/default-avatar.jpg") + '"></span>')
                            ._('<span class="nickname">' + (data[i].ni ? data[i].ni : "匿名用户") + '</span>')
                            ._('<span class="prize" style="color: #fddf2f;">' + data[i].pn + '</span>')
                            ._('</div>');
                    }else{
                        t._('<div class="content-tr">')
                            ._('<span class="head"><img src="' + (data[i].hi ? (data[i].hi + "/" + yao_avatar_size) : "./images/avatar/default-avatar.jpg") + '"></span>')
                            ._('<span class="nickname">' + (data[i].ni ? data[i].ni : "匿名用户") + '</span>')
                            ._('<span class="prize">' + data[i].pn + '</span>')
                            ._('</div>');
                    }
                    if(data[i].hi == headimgurl){
                        delay = false;
                    }
                }
                if(delay && falseData){
                    if(falseData.indexOf('门票') >= 0){
                        tp._('<div class="content-tr">')
                            ._('<span class="head"><img src="' + (headimgurl ? (headimgurl + "/" + yao_avatar_size) : "./images/avatar/default-avatar.jpg") + '"></span>')
                            ._('<span class="nickname">' + (nickname ? nickname : "匿名用户") + '</span>')
                            ._('<span class="prize" style="color: #fddf2f;">' + falseData + '</span>')
                            ._('</div>');
                    }else{
                        t._('<div class="content-tr">')
                            ._('<span class="head"><img src="' + (headimgurl ? (headimgurl + "/" + yao_avatar_size) : "./images/avatar/default-avatar.jpg") + '"></span>')
                            ._('<span class="nickname">' + (nickname ? nickname : "匿名用户") + '</span>')
                            ._('<span class="prize">' + falseData + '</span>')
                            ._('</div>');
                    }
                }
                $(".tp-list").html(tp.toString());
                $(".t-list").html(t.toString());
            },
            falseUpdate: function(data){
                var t = simpleTpl();
                var tp = simpleTpl();
                if(data.indexOf('门票') >= 0){
                    tp._('<div class="content-tr">')
                        ._('<span class="head"><img src="' + (headimgurl ? (headimgurl + "/" + yao_avatar_size) : "./images/avatar/default-avatar.jpg") + '"></span>')
                        ._('<span class="nickname">' + (nickname ? nickname : "匿名用户") + '</span>')
                        ._('<span class="prize" style="color: #fddf2f;">' + data + '</span>')
                        ._('</div>');
                }else{
                    t._('<div class="content-tr">')
                        ._('<span class="head"><img src="' + (headimgurl ? (headimgurl + "/" + yao_avatar_size) : "./images/avatar/default-avatar.jpg") + '"></span>')
                        ._('<span class="nickname">' + (nickname ? nickname : "匿名用户") + '</span>')
                        ._('<span class="prize">' + data + '</span>')
                        ._('</div>');
                }
                $(".tp-list").html(tp.toString());
                $(".t-list").html(t.toString());
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-thanks" id="record-dialog">')
                    ._('<section class="dialog record-dialog">')
                    ._('<a href="javascript:void(0);" class="dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-thanksvote-btn-close" data-collect-desc="抽奖弹层(谢谢参与)-关闭按钮">X</a>')
                    ._('<img class="record-top" src="./images/record-dialog-top.png">')
                    ._('<section class="record-content">')
                    ._('<img class="lucky-tips" src="./images/icon-lucky-tips.png">')
                    ._('<div  class="record-table">')
                        ._('<div class="header">')
                            ._('<span class="t-head">头像</span>')
                            ._('<span class="t-nickname">昵称</span>')
                            ._('<span class="t-prize">奖品名称</span>')
                        ._('</div>')
                        ._('<div class="record-list" id="record-list">')
                            ._('<div class="tp-list">')
                            ._('</div>')
                            ._('<div class="t-list">')
                            ._('</div>')
                        ._('</div>')
                    ._('</div>')
                    ._('<img class="icon-cw" src="./images/icon-cw.png">')
                    ._('</section>')
                    ._('</section>')
                    ._('</section>');
                return t.toString();
            }
        }
    };
    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            var list = data.rl;
            if(list && list.length > 0){
                H.dialog.recordDialog.open(list,true);
            }else{
                if(H.dialog.shiwuPn){
                    H.dialog.recordDialog.open(H.dialog.shiwuPn,false);
                }
            }
        }else{
            if(H.dialog.shiwuPn){
                H.dialog.recordDialog.open(H.dialog.shiwuPn,false);
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