(function($) {
    H.dialog = {
        puid: 0,
        ci: null,
        ts: null,
        si: null,
        rule_flag: true,
        $container: $('body'),
        init: function() {
            var me = this,
                height = $(window).height(),
                width = $(window).width();
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

            this.$dialog.animate({ 'opacity': '1' }, 500);
            this.$dialog.find('.dialog').addClass('bounceInDown');
            setTimeout(function() {
                me.$dialog.find('.dialog').removeClass('bounceInDown');
            }, 1000);
        },
        relocate: function() {
            var height = $(window).height(),
                width = $(window).width();
            $('.dialog').each(function() {
                $(this).css({
                    'width': width,
                    'height': height,
                    'left': 0,
                    'top': 0
                });
            });
            $(".rule-dialog").css({
                'width': width * 0.82,
                'height': height * 0.7,
                'left': width * 0.09,
                'right': width * 0.09,
                'top': height * 0.15,
                'bottom': height * 0.15
            });
            $(".duobao-dialog").css({
                'width': width * 0.82,
                'height': height * 0.6,
                'left': width * 0.09,
                'right': width * 0.09,
                'top': height * 0.2,
                'bottom': height * 0.15
            });
        },
        // 规则
        rule: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();
                $('body').addClass('noscroll');
                if (H.dialog.rule_flag == true) {
                    getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
                }

            },
            close: function() {
                var me = this;
                $('body').removeClass('noscroll');
                this.$dialog.find('.dialog').addClass('bounceOutDown');
                setTimeout(function() {
                    // me.$dialog && me.$dialog.remove();
                    // me.$dialog = null;
                    me.$dialog.find('.dialog').removeClass('bounceOutDown');
                    me.$dialog && me.$dialog.addClass('none');
                }, 800);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(rule) {
                this.$dialog.find('.rule').html(rule).removeClass('none');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="rule-dialog">')
                    ._('<div class="dialog rule-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-xian-lingjuli-ruledialog-closebtn" data-collect-desc="活动规则弹层-关闭按钮"></a>')
                    ._('<div class="content border">')
                    ._('<h2>活动规则</h2>')
                    ._('<div class="rule"></div>')
                    ._('</div>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
        lottery: {
            $dialog: null,
            url: null,
            ci: null,
            ts: null,
            si: null,
            pt: null,
            sto: null,
            name: null,
            mobile: null,
            open: function(data) {
                if(data == null || data.pt==0){
                    showTips("很遗憾，未中奖");
                    return
                }
                H.lottery.isCanShake = false;
                var me = this,
                    $dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                me.update(data);
                me.pre_dom();
                H.dialog.lottery.readyFunc();
                H.lottery.canJump = false;
            },
            pre_dom: function() {
                var width = $(window).width(),
                    height = $(window).height();
                if (W.screen.width === 320) {
                    $(".lottery-dialog").css({
                        'width': "280px",
                        'height': "420px",
                        'left': Math.round((width - 280) / 2) + 'px',
                        'top': Math.round((height - 400) / 2) + 'px'
                    });
                } else {
                    $(".lottery-dialog").css({
                        'width': "312px",
                        'height': "500px",
                        'left': Math.round((width - 312) / 2) + 'px',
                        'top': Math.round((height - 500) / 2) + 'px'
                    });
                }
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({ 'opacity': '0' }, 1000);
                setTimeout(function() {
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                    btnflas($(this));
                    me.close();

                });
            },
            readyFunc: function() {
                var me = this;
                $('#btn-getluck').click(function(e) {
                    btnflas($(this));
                    e.preventDefault();
                    if ($("#lot-inp").hasClass("none") || me.check()) {
                        H.lottery.isCanShake = false;
                        if (!$('#btn-getluck').hasClass("flag")) {
                            $('#btn-getluck').addClass("flag");
                            if (me.pt == 7) {
                                shownewLoading();
                                me.close();
                                me.sto = setTimeout(function() {
                                    H.lottery.isCanShake = true;
                                    hidenewLoading();
                                }, 15000);
                                $('#btn-getluck').text("领取中");
                                H.lottery.wxCheck = false;
                                setTimeout(function() {
                                    me.wx_card();
                                }, 1000);
                            } else if (me.pt == 9) {
                                shownewLoading();
                                $('#btn-getluck').text("领取中");
                                getResult('api/lottery/award', {
                                    nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                    hi: headimgurl ? headimgurl : "",
                                    oi: openid,
                                    rn: me.name ? encodeURIComponent(me.name) : "",
                                    ph: me.mobile ? me.mobile : ""
                                }, 'callbackLotteryAwardHandler');
                                setTimeout(function() {
                                    location.href = H.dialog.lottery.url;
                                }, 500);
                            }
                        }
                    }
                });
            },
            wx_card: function() {
                var me = this;
                //卡券
                wx.addCard({
                    cardList: [{
                        cardId: me.ci,
                        cardExt: "{\"timestamp\":\"" + me.ts + "\",\"signature\":\"" + me.si + "\"}"
                    }],
                    success: function(res) {
                        H.lottery.wxCheck = true;
                        H.lottery.canJump = true;
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid,
                            rn: me.name ? encodeURIComponent(me.name) : "",
                            ph: me.mobile ? me.mobile : ""
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res) {
                        H.lottery.isCanShake = true;
                        H.lottery.canJump = true;
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                    },
                    complete: function() {
                        me.sto && clearTimeout(me.sto);
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    },
                    cancel: function() {
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    }
                });
            },
            update: function(data) {
                var me = this;
                if (data.result && (data.pt == 7 || data.pt == 9)) {
                    me.pt = data.pt;
                    $(".lottery-dialog").find(".lott-box").css("background-image", "url(" + data.pi + ")")
                    if (data.pt == 9) {
                        me.url = data.ru;
                    } else if (data.pt == 7) {
                        me.ci = data.ci;
                        me.ts = data.ts;
                        me.si = data.si;
                    }
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                    ._('<div class="top-bar">')
                    ._('<img class="award-logo" src="./images/lottery-title.png">')
                    ._('</div>')
                    ._('<div class="lott-box" id="lott">')
                    ._('<div class="inp none" id="lot-inp">')
                    ._('<p class="ple">请填写您的联系方式，以便顺利领奖</p>')
                    ._('<p>姓名：<input class="name"></p>')
                    ._('<p>电话：<input class="phone" type="tel"></p>')
                    ._('</div>')
                    ._('</div>')
                    ._('<a class="lottery-btn" id="btn-getluck" href="#" data-collect="true" data-collect-flag="dialog-task-quan-link-get-btn" data-collect-desc="中奖弹层业务类(卡券-外链)-领取按钮">立即领取</a>')
                    ._('</div>')
                    ._('</div>');
                return t.toString();
            },
            check: function() {
                var me = this;
                var $mobile = $('.phone'),
                    mobile = $.trim($mobile.val()),
                    $name = $('.name'),
                    name = $.trim($name.val());
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
            }
        },
        Entlottery: {
            $dialog: null,
            pt: null,
            ru: null,
            open: function(data) {
                H.lottery.isCanShake = false;
                var me = this,
                    $dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                me.update(data);
                me.pre_dom();
                H.dialog.lottery.readyFunc();
                H.lottery.canJump = false;
            },
            pre_dom: function() {
                var width = $(window).width(),
                    height = $(window).height();
                if (W.screen.width === 320) {
                    $(".lottery-dialog").css({
                        'width': "280px",
                        'height': "420px",
                        'left': Math.round((width - 280) / 2) + 'px',
                        'top': Math.round((height - 400) / 2) + 'px'
                    });
                } else {
                    $(".lottery-dialog").css({
                        'width': "312px",
                        'height': "500px",
                        'left': Math.round((width - 312) / 2) + 'px',
                        'top': Math.round((height - 500) / 2) + 'px'
                    });
                }
            },
            close: function() {
                H.lottery.isCanShake = true;
                H.lottery.canJump = true;
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({ 'opacity': '0' }, 1000);
                setTimeout(function() {
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('#btn-use').click(function(e) {
                    e.preventDefault();
                    if (me.ru) {
                        shownewLoading();
                        setTimeout(function() {
                            location.href = me.ru;
                        }, 500);
                    } else {
                        me.close();
                    }
                });
                this.$dialog.find('#btn-link').click(function(e) {
                    e.preventDefault();
                    if (me.ru) {
                        shownewLoading();
                        setTimeout(function() {
                            location.href = me.ru;
                        }, 500);
                    } else {
                        me.close();
                    }
                });
                this.$dialog.find('#btn-sure').click(function(e) {
                    e.preventDefault();
                    btnflas($(this));
                    me.close();
                });
                this.$dialog.find('#btn-award').click(function(e) {
                    e.preventDefault();
                    btnflas($(this));
                    if (me.check()) {
                        var $mobile = $('.phone'),
                            mobile = $.trim($mobile.val()),
                            $name = $('.name'),
                            name = $.trim($name.val()),
                            $address = $('.address'),
                            address = $.trim($address.val());
                        if (me.pt == 1) {
                            $("#Entlottery-dialog").find(".na").text(name);
                            $("#Entlottery-dialog").find(".ph").text(mobile);
                            $("#Entlottery-dialog").find(".aa").text(address);
                        }
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid,
                            rn: name ? encodeURIComponent(name) : "",
                            ph: mobile ? mobile : "",
                            ad: address ? address : ""
                        }, 'callbackLotteryAwardHandler');
                        if (H.dialog.Entlottery.pt == 5) {
                            // showTips("领取成功");
                            $(".duijiangma").addClass("none");
                            $("#ent-inp").addClass("none");
                            $("#ent-show").removeClass("none");
                        } else if (H.dialog.Entlottery.pt == 1) {
                            showTips("领取成功");
                            me.close();
                            // $('#btn-award').addClass("none");
                            // $("#btn-sure").removeClass("none");
                            // $("#ent-inp").addClass("none");
                            // $("#ent-result").removeClass("none");
                        }
                    }
                });
            },
            update: function(data) {
                var me = this;
                me.pt = data.pt;
                if (data.result && data.pt == 1) {
                    $("#Entlottery-dialog").find(".lott-box").css("background-image", "url(" + data.pi + ")")
                    $("#Entlottery-dialog").find(".duijiangma").addClass('none');
                    $("#Entlottery-dialog").find(".name").val(data.rn ? data.rn : "");
                    $("#Entlottery-dialog").find(".phone").val(data.ph ? data.ph : "");
                    $("#Entlottery-dialog").find(".address").val(data.ad ? data.ad : "");
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery" id="Entlottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                    ._('<div class="top-bar">')
                    ._('<img class="award-tips" src="./images/lottery-title.png">')
                    ._('</div>')
                    ._('<div class="lott-box" id="ent-lott">')
                    ._('<div class="inp" id="ent-inp">')
                    ._('<p class="ple">请填写您的联系方式，以便顺利领奖</p>')
                    ._('<p><input class="name" placeholder="姓名"></p>')
                    ._('<p><input class="phone" placeholder="手机号码"></p>')
                    ._('<p><input class="address" type="text" placeholder="地址"></p>')
                    ._('</div>')
                    ._('</div>')
                    ._('<a class="lottery-btn" id="btn-award" data-collect="true" data-collect-flag="dialog-task-Entlottery-award-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-提交信息按钮"">立即领取</a>')
                    ._('</div>')
                    ._('</div>');
                return t.toString();
            },
            check: function() {
                var $mobile = $('.phone'),
                    mobile = $.trim($mobile.val()),
                    $name = $('.name'),
                    name = $.trim($name.val()),
                    $address = $('.address'),
                    address = $.trim($address.val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖!');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                } else if (address.length > 30) {
                    showTips('请填写正确地址，以便顺利领奖！');
                    return false;
                }
                return true;
            }
        },
        Redlottery: {
            $dialog: null,
            rp: null,
            open: function(data) {
                H.lottery.isCanShake = false;
                var me = this,
                    $dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                me.update(data);
                me.pre_dom();
                H.lottery.canJump = false;
            },
            pre_dom: function() {
                var width = $(window).width(),
                    height = $(window).height();
                if (W.screen.width === 320) {
                    $(".redlottery-dialog").css({
                        'width': "280px",
                        'height': "420px",
                        'left': Math.round((width - 280) / 2) + 'px',
                        'top': Math.round((height - 400) / 2) + 'px'
                    });
                } else {
                    $(".redlottery-dialog").css({
                        'width': "312px",
                        'height': "500px",
                        'left': Math.round((width - 312) / 2) + 'px',
                        'top': Math.round((height - 500) / 2) + 'px'
                    });
                }
            },
            close: function() {
                H.lottery.isCanShake = true;
                H.lottery.canJump = true;
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({ 'opacity': '0' }, 1000);
                setTimeout(function() {
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                $("#btn-red").click(function() {
                    btnflas($(this));
                    if (!$('#btn-red').hasClass("requesting") && me.rp) {
                        shownewLoading();
                        $('#btn-red').addClass("requesting");
                        $('#btn-red').text("领取中");
                        setTimeout(function() {
                            location.href = me.rp;
                        }, 500);
                    }
                });
                $(".btn-close").click(function() {
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if (data.result && data.pt == 4) {
                    me.rp = data.rp;
                    $(".redlottery-dialog").find(".lott-box").css("background-image", "url(" + data.pi + ")");
                    // $(".redlottery-dialog").find(".award-logo").attr("src",data.qc);
                    // $(".redlottery-dialog").find(".award-lpt").html(data.tt);
                    // $(".redlottery-dialog").find(".award-ly").html(data.aw);
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery" id="Redlottery-dialog">')
                    ._('<div class="dialog redlottery-dialog">')
                    ._('<div class="top-bar">')
                    ._('<img class="award-logo" src="./images/lottery-title.png">')
                    ._('</div>')
                    ._('<div class="lott-box" id="ent-lott">')
                    ._('<p class="award-lpt"></p>')
                    ._('</div>')
                    ._('<a class="lottery-btn" id="btn-red" data-collect="true" data-collect-flag="dialog-task-red-close-btn" data-collect-desc="中奖弹层业务类(红包)-领取按钮">立即领取</a>')
                    ._('<p class="award-ly"></p>')
                    ._('</div>')
                    ._('</div>');
                return t.toString();
            }
        },
        Tellottery: {
            $dialog: null,
            rp: null,
            open: function(data) {
                H.lottery.isCanShake = false;
                var me = this,
                    $dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                var winW = $(window).width(),
                    winH = $(window).height();
                var lotteryW = winW * 0.82,
                    lotteryH = winH * 0.72,
                    lotteryT = (winH - lotteryH) / 2,
                    lotteryL = (winW - lotteryW) / 2
                $('.tellottery-dialog').css({
                    'width': lotteryW,
                    'height': lotteryH,
                    'top': lotteryT,
                    'left': lotteryL
                });
                me.update(data);
                H.lottery.canJump = false;
            },
            close: function() {
                H.lottery.isCanShake = true;
                H.lottery.canJump = true;
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({ 'opacity': '0' }, 1000);
                setTimeout(function() {
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                $("#btn-red").click(function() {

                    if (!$('#btn-red').hasClass("requesting")) {

                        var $mobile = $('.tellottery-dialog').find(".phone"),
                            mobile = $.trim($mobile.val());
                        if (!/^\d{11}$/.test(mobile)) {
                            showTips('请填写正确手机号，以便顺利领奖！');
                            return;
                        }
                        shownewLoading();
                        $('#btn-red').addClass("requesting");
                        $('#btn-red').text("领取中");
                        btnflas($(this));
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid,
                            rn: name ? encodeURIComponent(name) : "",
                            ph: mobile ? mobile : "",
                        }, 'callbackLotteryAwardHandler');
                        showTips("领取成功");
                        setTimeout(function() {
                            me.close();
                        }, 500);
                    }
                });
                $(".btn-close").click(function() {
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if (data.result && data.pt == 6) {
                    $(".tellottery-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");;
                    // $(".redlottery-dialog").find(".award-logo").attr("src",data.qc);
                    $(".tellottery-dialog").find(".award-lpt").html(data.tt);
                    $(".tellottery-dialog").find(".award-ly").html(data.aw);
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery" id="Tellottery-dialog">')
                    ._('<div class="dialog tellottery-dialog">')
                    ._('<div class="top-bar">')
                    ._('<img class="award-tips" src="./images/lottery-title.png">')
                    ._('</div>')
                    ._('<p class="award-lpt"></p>')
                    ._('<img class="award-img" src="./images/gift-blank.png">')
                    ._('<div class="message" id="ent-result">')
                    ._('<p class="ple">请正确填写手机号码，三个工作日内将会有工作人员与您联系奖品发放事宜!</p>')
                    ._('<p><input class="phone" type="tel" placeholder="电话"></p>')
                    ._('</div>')
                    ._('<a class="lottery-btn" id="btn-red" data-collect="true" data-collect-flag="dialog-task-red-close-btn" data-collect-desc="中奖弹层业务类(流量红包)-领取按钮">立&nbsp;&nbsp;即&nbsp;&nbsp;领&nbsp;&nbsp;取</a>')
                    ._('<p class="award-ly"></p>')
                    ._('</div>')
                    ._('</div>');
                return t.toString();
            }
        },
        // 谢谢参与
        thanks: {
            $dialog: null,
            open: function() {
                var me = this;
                H.dialog.open.call(this);
                this.event();
                var winW = $(window).width(),
                    winH = $(window).height();
                var lotteryW = winW * 0.86,
                    lotteryH = winH * 0.80,
                    lotteryT = (winH - lotteryH) / 2,
                    lotteryL = (winW - lotteryW) / 2
                $('.thanks-dialog').css({
                    'width': lotteryW,
                    'height': lotteryH,
                    'top': lotteryT,
                    'left': lotteryL
                });
            },
            close: function() {
                var me = this;
                this.$dialog.animate({ 'opacity': '0' }, 1000);
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                setTimeout(function() {
                    H.lottery.isCanShake = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-rul" id="thanks-dialog">')
                    ._('<div class="dialog thanks-dialog">')
                    ._('<img src="./images/thanks-bg.png" class="thanks-bg">')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        }
    };

    var btnflas = function(btn) {
        btn.addClass('flash');
        setTimeout(function() {
            btn.removeClass('flash');
        }, 1000);
    };
    W.callbackLotteryPrizesHandler = function(data) {
        if (data.result) {
            H.dialog.prizesList.update(data.pa);
        } else {

        }
    }
    W.callbackRuleHandler = function(data) {
        if (data.code == 0) {
            H.dialog.rule_flag = false;
            $(".rule-dialog .rule").html(data.rule);
        }
    };

    W.callbackLotteryAwardHandler = function(data) {
        hidenewLoading();
    };
})(Zepto);

$(function() {
    H.dialog.init();
});
