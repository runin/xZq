(function($) {
    H.dialog = {
        ci:null,
        ts:null,
        si:null,
        $container: $('body'),
        init: function() {
        },
        open: function() {
            this.$dialog = $(this.tpl());
            H.dialog.$container.prepend(this.$dialog);
            H.dialog.relocate();
        },
        relocate: function(){
            var height = $(window).height(), width = $(window).width();
            $('.modal').each(function() {
                $(this).css({
                    'width': width, 
                    'height': height
                });
            });
            $('.dialog').each(function() {
                $(this).css({
                    'width': width,
                    'left': 0
                });
            });
        },
        rule: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                getResult('api/common/rule', {}, 'commonApiRuleHandler', true, this.$dialog);
                H.dialog.isOpen = false;
                this.event();
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
                    me.close();
                    hidenewLoading();
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-rule" id="rule-dialog">')
                    ._('<div class="dialog rule-dialog">')
                        ._('<a href="javascript:;" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-rule-btn-close" data-collect-desc="弹层(活动规则)-关闭按钮"></a>')
                        ._('<div class="dialog-content">')
                            ._('<h1>活动规则</h1>')
                            ._('<div class="rule-content" id="rule-content"></div>')
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
                $('.shake-wrapper img').removeClass('noshake');
            },
            event: function() {
                var me = this;
                $(".redbag-dialog").click(function(e){
                    e.preventDefault();
                    if(!$('.redbag-dialog').hasClass("flag")) {
                        shownewLoading(null, '领取中...');
                        $('.redbag-dialog').addClass("flag");
                        // $('.btn-redbag-get').text("领取中");
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
                    $("#redbag-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#redbag-dialog").find(".award-keyTips").html(data.tt || '');
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-redbag" id="redbag-dialog">')
                    ._('<section class="dialog redbag-dialog" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-立即使用按钮">')
                        ._('<a href="javascript:;" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-redbag-btn-close" data-collect-desc="弹层(红包)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<section class="dialog-body">')
                                ._('<h2><img src="./images/icon-luck.png"></h2>')
                                ._('<img class="award-img" src="./images/default-award.png">')
                                ._('<section class="lottery-cover">')
                                    ._('<p class="award-keyTips"></p>')
                                    ._('<a href="javascript:;" class="btn-lottery btn-redbag-get" id="btn-redbagLottery-use" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-立即使用按钮">领取红包</a>')
                                ._('</section>')
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
                H.lottery.isCanShake = true;
                H.lottery.canJump = true;
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
                $('.shake-wrapper img').removeClass('noshake');
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
                            me.close();
                            showTips('领取成功');
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
                }
                //  else if (address.length < 8 || address.length > 80 || address.length == 0) {
                //     showTips('请填写您的详细地址，以便顺利领奖！');
                //     return false;
                // }
                me.name = name;
                me.mobile = mobile;
                me.address = address;
                return true;
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-shiwu" id="shiwu-dialog">')
                    ._('<section class="dialog shiwu-dialog">')
                        ._('<a href="javascript:;" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-close" data-collect-desc="弹层(实物)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<section class="dialog-body">')
                                ._('<h2><img src="./images/icon-luck.png"></h2>')
                                ._('<img class="award-img" src="./images/default-award.png">')
                                ._('<section class="lottery-cover">')
                                    ._('<section class="input-box">')
                                        ._('<h5>请填写您的联系方式以便顺利领奖</h5>')
                                        ._('<p><span class="none">姓名：</span><input class="name" type="text" placeholder="姓名"></p>')
                                        ._('<p><span class="none">电话：</span><input class="phone" type="tel" placeholder="电话"></p>')
                                        ._('<p class="none"><span>地址：</span><input class="address" type="text" placeholder=""></p>')
                                    ._('</section>')
                                    ._('<p class="award-keyTips"></p>')
                                    ._('<a href="javascript:;" class="btn-lottery btn-shiwu-lottery-award" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物)-领取按钮">立即领取</a>')
                                ._('</section>')
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
                H.lottery.isCanShake = true;
                H.lottery.canJump = true;
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
                $('.shake-wrapper img').removeClass('noshake');
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
                        shownewLoading(null, '领取中...');
                        getResult('api/lottery/award', {
                            oi: openid,
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : ""
                        }, 'callbackLotteryAwardHandler');
                        setTimeout(function(){
                            location.href = me.ru;
                        },1000);
                    }
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    me.ru = data.ru;
                    if (data.ru.length == 0) {
                        $('#btn-linkLottery-use').html('继续摇奖');
                    } else {
                        $('#btn-linkLottery-use').html('点我领取');
                    }
                    $("#link-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#link-dialog").find(".award-keyTips").html(data.tt || '');
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-link" id="link-dialog">')
                    ._('<section class="dialog link-dialog">')
                        ._('<a href="javascript:;" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<section class="dialog-body">')
                                ._('<h2><img src="./images/icon-luck.png"></h2>')
                                ._('<img class="award-img" src="./images/default-award.png">')
                                ._('<section class="lottery-cover">')
                                    ._('<p class="award-keyTips"></p>')
                                    ._('<a href="javascript:;" class="btn-lottery btn-link-use" id="btn-linkLottery-use" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-use" data-collect-desc="弹层(外链)-点我领取按钮">点我领取</a>')
                                ._('</section>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        codeLottery: {
            $dialog: null,
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
                H.lottery.isCanShake = true;
                H.lottery.canJump = true;
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
                $('.shake-wrapper img').removeClass('noshake');
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('#btn-codeLottery-use').click(function(e) {
                    e.preventDefault();
                    getResult('api/lottery/award', {
                        oi: openid,
                        nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        hi: headimgurl ? headimgurl : ""
                    }, 'callbackLotteryAwardHandler');
                    me.close();
                    showTips('领取成功');
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    $("#code-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#code-dialog").find(".award-keyTips").html(data.tt || '');
                    if (data.cc || data.cc != '') {
                        if (data.cc.split(',')[0]) {
                            $("#code-dialog").find(".code-box").append("<p>" + (data.cc.split(',')[0] || '') + "</p>");
                        }
                        if (data.cc.split(',')[1]) {
                            $("#code-dialog").find(".code-box").append("<p>" + (data.cc.split(',')[1] || '') + "</p>");
                        }
                        // $("#code-dialog").find(".code-box").append("<p>" + (data.cc || '') + "</p>");
                        $("#code-dialog").find(".code-box").removeClass('none');
                    } else {
                        $("#code-dialog").find(".code-box").addClass('none');
                    }
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-code" id="code-dialog">')
                    ._('<section class="dialog code-dialog">')
                        ._('<a href="javascript:;" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-code-btn-close" data-collect-desc="弹层(兑换码)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<section class="dialog-body">')
                                ._('<h2><img src="./images/icon-luck.png"></h2>')
                                ._('<img class="award-img" src="./images/default-award.png">')
                                ._('<section class="lottery-cover">')
                                    ._('<section class="code-box none"></section>')
                                    ._('<p class="award-keyTips"></p>')
                                    ._('<a href="javascript:;" class="btn-lottery btn-code-use" id="btn-codeLottery-use" data-collect="true" data-collect-flag="dialog-code-btn-codeLottery-use" data-collect-desc="弹层(兑换码)-领取按钮">领&nbsp;&nbsp;取</a>')
                                ._('</section>')
                            ._('</section>')
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
            pv: null,
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
                H.lottery.isCanShake = true;
                H.lottery.canJump = true;
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
                $('.shake-wrapper img').removeClass('noshake');
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('.award-img').click(function(e) {
                    e.preventDefault();
                    // if(me.check()) {
                        if(!$('.award-img').hasClass("flag")){
                            $('.award-img').addClass("flag");
                            getResult('api/lottery/award', {
                                oi: openid,
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                rn: me.name ? encodeURIComponent(me.name) : "",
                                ph: me.mobile ? me.mobile : ""
                            }, 'callbackLotteryAwardHandler');
                            me.close();
                            showTips('领取成功');
                        }
                    // }
                    console.log($('.btn-coin span').text().replace('积分', '')*1);
                    console.log(me.pv);
                    $('.btn-coin span').text(($('.btn-coin span').text().replace('积分', '')*1 + me.pv) + '积分');
                });
                this.$dialog.find('#btn-jifenLottery-award').click(function(e) {
                    e.preventDefault();
                    // if(me.check()) {
                        if(!$('#btn-jifenLottery-award').hasClass("flag")){
                            $('#btn-jifenLottery-award').addClass("flag");
                            getResult('api/lottery/award', {
                                oi: openid,
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                rn: me.name ? encodeURIComponent(me.name) : "",
                                ph: me.mobile ? me.mobile : ""
                            }, 'callbackLotteryAwardHandler');
                            me.close();
                            showTips('领取成功');
                        }
                    // }
                });
                this.$dialog.find('#btn-jifenLottery-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    me.pv = data.pv;
                    $("#jifen-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#jifen-dialog").find(".award-keyTips").html(data.tt || '');
                    // $("#jifen-dialog").find(".name").val(data.rn ? data.rn : '');
                    // $("#jifen-dialog").find(".phone").val(data.ph ? data.ph : '');
                }
            },
            check: function() {
                var me = this, name = $.trim($('.name').val()), mobile = $.trim($('.phone').val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖！');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                }
                me.name = name;
                me.mobile = mobile;
                return true;
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-jifen" id="jifen-dialog">')
                    ._('<section class="dialog jifen-dialog">')
                        ._('<a href="javascript:;" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-jifen-btn-close" data-collect-desc="弹层(实物)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<section class="dialog-body">')
                                ._('<h2><img src="./images/icon-luck.png"></h2>')
                                ._('<img class="award-img" src="./images/default-award.png">')
                                ._('<section class="lottery-cover">')
                                    ._('<section class="input-box none">')
                                        ._('<h5 class="none">请填写完整信息，否则视为放弃</h5>')
                                        ._('<p><span>姓名：</span><input class="name" type="text" placeholder=""></p>')
                                        ._('<p><span>电话：</span><input class="phone" type="tel" placeholder=""></p>')
                                    ._('</section>')
                                    ._('<p class="award-keyTips"></p>')
                                    ._('<a href="javascript:;" class="btn-lottery btn-jifen-lottery-award none" id="btn-jifenLottery-award" data-collect="true" data-collect-flag="dialog-jifen-btn-jifenLottery-award" data-collect-desc="弹层(实物)-领取按钮">领&nbsp;&nbsp;取</a>')
                                ._('</section>')
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
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
                $('.shake-wrapper img').removeClass('noshake');
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
                            shownewLoading(null, '卡券打开中...');
                            me.close();
                            me.sto = setTimeout(function(){
                                H.lottery.isCanShake = true;
                                hidenewLoading();
                            },15000);
                            // $('#btn-wxcardLottery-award').text("领取中");
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
                        showTips('领取成功');
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
                    $("#wxcard-dialog").find('.award-keyTips').html(data.pn || '');
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
                        ._('<a href="javascript:;" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-wxcard-btn-close" data-collect-desc="弹层(卡券)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<section class="dialog-body">')
                                ._('<h2><img src="./images/icon-luck.png"></h2>')
                                ._('<img class="award-img" src="./images/default-award.png">')
                                ._('<section class="lottery-cover">')
                                    ._('<section class="input-box none">')
                                        ._('<h5 class="none">请填写完整信息，否则视为放弃</h5>')
                                        ._('<p><span>姓名：</span><input class="name" type="text" placeholder=""></p>')
                                        ._('<p><span>电话：</span><input class="phone" type="tel" placeholder=""></p>')
                                    ._('</section>')
                                    ._('<p class="award-keyTips"></p>')
                                    ._('<a href="javascript:;" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">领&nbsp;&nbsp;&nbsp;取</a>')
                                ._('</section>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        payGood: {
            $dialog: null,
            name: '',
            mobile: '',
            address: '',
            ru: '',
            open: function() {
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                   $('.good-dialog').css('top', ($(window).height() - $('.dialog-content').height()) / 2);
                }
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
                    me.close();
                });
                this.$dialog.find('#btn-payGood-award').click(function(e) {
                    e.preventDefault();
                    if(me.check()) {
                        if(!$('#btn-payGood-award').hasClass("flag")){
                            $('#btn-payGood-award').addClass("flag");
                            shownewLoading(null, '商品兑换中...');
                            getResult('api/mall/order/pay', {
                                openid: openid,
                                wxname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                wxheadurl: headimgurl ? headimgurl : "",
                                name: me.name ? encodeURIComponent(me.name) : "",
                                phone: me.mobile ? me.mobile : "",
                                address: me.address ? encodeURIComponent(me.address) : "",
                                buyCount: 1,
                                itemUuid: H.detail.goodUid
                            }, 'callbackMallApiPay');
                        }
                    }
                });
                this.$dialog.find('#btn-payGood-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('.btn-good-lottery-other').click(function(e) {
                    e.preventDefault();
                    toUrl('shop.html');
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
                }
                //  else if (address.length < 8 || address.length > 80 || address.length == 0) {
                //     showTips('请填写您的详细地址，以便顺利领奖！');
                //     return false;
                // }
                me.name = name;
                me.mobile = mobile;
                me.address = address;
                $('label.name').text(name);
                $('label.phone').text(mobile);
                $('label.address').text(address);
                return true;
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-good" id="good-dialog">')
                    ._('<section class="dialog good-dialog">')
                        ._('<a href="javascript:;" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-good-btn-close" data-collect-desc="弹层(商城)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<section class="dialog-body">')
                                ._('<section class="input-box goodBefore">')
                                    ._('<h5>请填写您的联系方式</h5>')
                                    ._('<p><span>姓名 </span><input class="name" type="text" placeholder=""></p>')
                                    ._('<p><span>电话 </span><input class="phone" type="tel" placeholder=""></p>')
                                    ._('<p class="none"><span>地址 </span><input class="address" type="text" placeholder=""></p>')
                                ._('</section>')
                                ._('<section class="input-box goodBack none">')
                                    ._('<h5>太棒啦，兑换成功！</h5>')
                                    ._('<p><span>姓名：</span><label class="name"></label></p>')
                                    ._('<p><span>电话：</span><label class="phone"></label></p>')
                                    ._('<p class="none"><span>地址：</span><label class="address"></label></p>')
                                ._('</section>')
                            ._('</section>')
                            ._('<a href="javascript:;" class="btn btn-good-lottery-award" id="btn-payGood-award" data-collect="true" data-collect-flag="dialog-good-btn-payGood-award" data-collect-desc="弹层(商城)-确认兑换按钮">确认兑换</a>')
                            ._('<a href="javascript:;" class="btn btn-good-lottery-other none" id="btn-payGood-other" data-collect="true" data-collect-flag="dialog-good-btn-payGood-other" data-collect-desc="弹层(商城)-查看其它商品按钮">查看其它商品</a>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        }
    };

    W.callbackLotteryAwardHandler = function(data) {};

    W.callbackMallApiPay = function(data) {
        hidenewLoading();
        if (data.code == 0) {
            $('.goodBefore , .btn-good-lottery-award').addClass('none');
            $('.goodBack , .btn-good-lottery-other').removeClass('none');
            $('.good-dialog').css('top', ($(window).height() - $('.dialog-content').height()) / 2);
            $('#J_goodShow h2 label').text(($('#J_goodShow h2 label').text()*1 - 1));
            if (($('#J_goodShow h2 label').text()*1 - 1) <= 0) {
                $('.btn-pay').addClass('btn-noCoin').html('商品已售罄');
            }
        } else {
            H.dialog.payGood.close();
            showTips(data.message);
        }
    };

    W.commonApiRuleHandler = function(data) {
        if(data.code == 0){
            $("#rule-content").html(data.rule);
        }
        hidenewLoading();
    };
})(Zepto);

$(function() {
    H.dialog.init();
});