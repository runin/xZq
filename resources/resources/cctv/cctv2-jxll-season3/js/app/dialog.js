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
                    'width': width * 0.80,
                    'left': width * 0.1,
                    'top': height * 0.15
                });
            });
        },
        shiwuLottery: {
            $dialog: null,
            name: '',
            mobile: '',
            address: '',
            ru: '',
            cu: "",
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
                                nn: nickname ? encodeURIComponent(nickname) : "",
                                hi: headimgurl ? headimgurl : "",
                                rn: me.name ? encodeURIComponent(me.name) : "",
                                ph: me.mobile ? me.mobile : "",
                                ad: me.address ? encodeURIComponent(me.address) : ""
                            }, 'callbackLotteryAwardHandler');
                            $("#shiwu-dialog").find(".info-name label").text(me.name);
                            $("#shiwu-dialog").find(".info-phone label").text(me.mobile);
                            $("#shiwu-dialog").find(".info-address label").text(me.address);
                            showTips("领取成功");
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
                    H.dialog.lru = data.ruid;
                    $("#shiwu-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#shiwu-dialog").find('.award-keyTips').html(data.tt || '请填写您的个人信息以便顺利领奖');
                    $("#shiwu-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#shiwu-dialog").find(".phone").val(data.ph ? data.ph : '');
                    $("#shiwu-dialog").find(".address").val(data.ad ? data.ad : '');
                    me.cu = data.cu;
                    if(data.cu == 1){
                        $('.shiwu-dialog').css({
                            'top': Math.ceil($(window).height()*0.20)
                        });
                        $(".dialog-shiwu-address").removeClass("none");
                    }else{
                        $('.shiwu-dialog').css({
                            'top': Math.ceil($(window).height()*0.25)
                        });
                        $(".dialog-shiwu-address").addClass("none");
                    }
                    $("#shiwu-dialog").find(".before").removeClass('none');
                    $("#shiwu-dialog").find(".after").addClass('none');
                }
            },
            check: function() {
                var me = this, name = $.trim($('.name').val()), mobile = $.trim($('.phone').val()),
                address = $.trim($('.address').val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖！');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                }
                if (me.cu == 1 && (address.length < 8 || address.length > 80 || address.length == 0)) {
                   showTips('请填写您的详细地址，以便顺利领奖！');
                   return false;
                }else{
                    me.address = address;
                }
                me.name = name;
                me.mobile = mobile;
                return true;
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-shiwu" id="shiwu-dialog">')
                    ._('<section class="dialog shiwu-dialog">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-close" data-collect-desc="弹层(实物奖)-关闭按钮"></a>')
                    ._('<section class="dialog-content">')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<div class="info-content">')
                                ._('<p class="award-keyTips none"></p>')
                                ._('<section class="input-box before">')
                                ._('<p>姓名：<input class="name" type="text"></p>')
                                ._('<p>电话：<input class="phone" type="tel"></p>')
                                ._('<p class="dialog-shiwu-address none">地址：<input class="address" type="text"></p>')
                                ._('</section>')
                                ._('<section class="info-box after">')
                                ._('<p class="info-name">姓名：<label></label></p>')
                                ._('<p class="info-phone">电话：<label></label></p>')
                                ._('<p class="info-address dialog-shiwu-address none">地址：<label></label></p>')
                                ._('</section>')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物奖)-领取按钮">立即领取</a>')
                                ._('<section class="btn-lottery-box after">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-close" id="btn-shiwuLottery-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-close" data-collect-desc="弹层(实物奖)-继续摇奖按钮">继续摇奖</a>')
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
                var height = $(window).height(), width = $(window).width();
                $("#thanks-dialog").find(".dialog").css({
                    'width': width * 0.80,
                    'left': width * 0.10,
                    'top': height * 0.30
                });
                setTimeout(function(){
                    me.close();
                },1500);
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
                    ._('<img class="thanks-tips" src="./images/thanks-tip.png">')
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
                var height = $(window).height(), width = $(window).width();
                $("#wxcard-dialog").find(".dialog").css({
                    'width': width * 0.80,
                    'left': width * 0.10,
                    'top': height * 0.30
                });
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
                            },800);
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
                            nn: nickname ? encodeURIComponent(nickname) : "",
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
                        recordUserOperate(openid, "card-fail", res.errMsg);
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
                    $("#wxcard-dialog").find('.award-keyTips').html(data.tt || '');
                    $("#wxcard-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#wxcard-dialog").find(".phone").val(data.ph ? data.ph : '');
                    if(data.cu == 1){
                        $('.wxcard-dialog').css({
                            'top': Math.ceil($(window).height()*0.25)
                        });
                        $(".input-box").removeClass("none");
                    }else{
                        $('.wxcard-dialog').css({
                            'top': Math.ceil($(window).height()*0.3)
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
                    ._('<section class="dialog-content">')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<div class="info-content">')
                        ._('<section class="input-box none">')
                        ._('<p class="award-keyTips none"></p>')
                        ._('<p><span>姓名：</span><input class="name" type="text"></p>')
                        ._('<p><span>电话：</span><input class="phone" type="tel"></p>')
                    ._('</section>')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">立即领取</a>')
                    ._('</div>')
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
                    if($(".input-box").hasClass("none") || me.check()){
                        H.lottery.isCanShake = false;
                        if(!$('#btn-linkLottery-award').hasClass("flag")){
                            $('#btn-linkLottery-award').addClass("flag");
                            shownewLoading();
                            me.close();
                            $('#btn-linkLottery-award').text("领取中");
                            getResult('api/lottery/award', {
                                nn: nickname ? encodeURIComponent(nickname) : "",
                                hi: headimgurl ? headimgurl : "",
                                oi: openid,
                                rn: me.name ? encodeURIComponent(me.name) : "",
                                ph: me.mobile ? me.mobile : ""
                            }, 'callbackLotteryAwardHandler');
                            setTimeout(function(){
                                location.href = me.ru;
                            },500);
                        }
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
                    $("#link-dialog").find('.award-keyTips').html(data.tt || '');
                    $("#link-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#link-dialog").find(".phone").val(data.ph ? data.ph : '');
                    if(data.cu == 1){
                        $('.link-dialog').css({
                            'top': Math.ceil($(window).height()*0.25)
                        });
                        $(".input-box").removeClass("none");
                    }else{
                        $('.link-dialog').css({
                            'top': Math.ceil($(window).height()*0.3)
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
                t._('<section class="modal" id="link-dialog">')
                    ._('<section class="dialog link-dialog">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链)-关闭按钮"></a>')
                    ._('<section class="dialog-content">')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<div class="info-content">')
                    ._('<section class="input-box none">')
                    ._('<p class="award-keyTips none"></p>')
                    ._('<p>姓名：<input class="name" type="text" placeholder="姓名:"></p>')
                    ._('<p>电话：<input class="phone" type="tel" placeholder="电话:"></p>')
                    ._('</section>')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-link-lottery-award" id="btn-linkLottery-award" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-award" data-collect-desc="弹层(外链)-领取按钮">立即领取</a>')
                    ._('</div>')
                    ._('</section>')
                    ._('</section>')
                    ._('</section>');
                return t.toString();
            }
        },
        cardLottery: {
            $dialog: null,
            pt:null,
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
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                    me.close();
                });
                $('#btn-cardLottery-award,.award-img').click(function(e) {
                    e.preventDefault();
                    H.lottery.isCanShake = false;
                    if(!$('#btn-cardLottery-award').hasClass("flag")){
                        $('#btn-cardLottery-award').addClass("flag");
                        me.close();
                        $('#btn-cardLottery-award').text("领取中");
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid
                        }, 'callbackLotteryAwardHandler');
                        showTips("领取成功！");
                        H.lottery.isCanShake = true;
                    }
                });
            },
            update: function(data) {
                var me = this;
                if(data.result && data.pt == 18){
                    H.dialog.lru = data.ruid;
                    me.pt = data.pt;
                    $("#card-dialog").find(".award-img").attr("src",data.qc).attr("onerror","$(this).addClass(\'none\')");
                    $("#card-dialog").find('.award-keyTips').html(data.tt || '');
                    $('.card-dialog').css({
                        'top': Math.ceil($(window).height()*0.2)
                    });
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="card-dialog">')
                    ._('<section class="dialog card-dialog">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-card-btn-close" data-collect-desc="弹层(卡牌)-关闭按钮"></a>')
                    ._('<section class="dialog-content">')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<div class="info-content">')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-card-lottery-award" id="btn-cardLottery-award" data-collect="true" data-collect-flag="dialog-link-btn-cardLottery-award" data-collect-desc="弹层(卡牌)-领取按钮">立即领取</a>')
                    ._('</div>')
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
                    if($(".input-box").hasClass("none") || me.check()){
                        H.lottery.isCanShake = false;
                        if(!$('#btn-redLottery-award').hasClass("flag")){
                            $('#btn-redLottery-award').addClass("flag");
                            shownewLoading();
                            getResult("api/user/edit_v2",{
                                matk:matk,
                                rn: me.name ? encodeURIComponent(me.name) : "",
                                ph: me.mobile ? me.mobile : ""
                            },"callbackUserEditHandler");
                            $('#btn-redLottery-award').text("领取中");
                            setTimeout(function(){
                                location.href = me.rp;
                            },500);
                        }
                    }
                });
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if(data.result && data.pt == 4){
                    H.dialog.lru = data.ruid;
                    me.pt = data.pt;
                    me.rp = data.rp;
                    $("#red-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    $("#red-dialog").find('.award-keyTips').html(data.pd || '');
                    $("#red-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#red-dialog").find(".phone").val(data.ph ? data.ph : '');
                    if(data.cu == 1){
                        $('.red-dialog').css({
                            'top': Math.ceil($(window).height()*0.25)
                        });
                        $(".input-box").removeClass("none");
                    }else{
                        $('.red-dialog').css({
                            'top': Math.ceil($(window).height()*0.3)
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
                t._('<section class="modal" id="red-dialog">')
                    ._('<section class="dialog red-dialog">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-red-btn-close" data-collect-desc="弹层(红包)-关闭按钮"></a>')
                    ._('<section class="dialog-content">')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<div class="info-content">')
                    ._('<section class="input-box none">')
                    ._('<p class="award-keyTips none"></p>')
                    ._('<p>姓名：<input class="name" type="text" placeholder="姓名:"></p>')
                    ._('<p>电话：<input class="phone" type="tel" placeholder="电话:"></p>')
                    ._('</section>')
                    ._('<a href="javascript:void(0);" class="btn-lottery btn-red-lottery-award" id="btn-redLottery-award" data-collect="true" data-collect-flag="dialog-red-btn-redLottery-award" data-collect-desc="弹层(红包)-领取按钮">立即领取</a>')
                    ._('</div>')
                    ._('</section>')
                    ._('</section>')
                    ._('</section>');
                return t.toString();
            }
        }
    };

    W.callbackLotteryAwardHandler = function(data) {};
    W.callbackUserEditHandler = function (data) {

    }
})(Zepto);

$(function() {
    H.dialog.init();
});