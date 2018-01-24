(function($) {
    H.dialog = {
        ci:null,
        ts:null,
        si:null,
        $container: $('body'),
        init: function() {
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
                    'width': width * 1, 
                    'left': width * 0,
                    'top': height * 0
                });
            });
        },
        shiwuLottery: {
            $dialog: null,
            name: '',
            mobile: '',
            address: '',
            ru: '',
            isFocus: false,
            open: function(data) {
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
                me.checkFocus();
            },
            close: function() {
                H.lottery.isCanShake = true;
                H.lottery.canJump = true;
                this.$dialog && this.$dialog.remove();
                this.$dialog = null;
            },
            checkFocus: function(){
                var me = this;
                $("input").each(function() {
                    $(this).focus(function(){
                        me.isFocus = true;
                    });
                });
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
                            $("#shiwu-dialog").find(".info-name label").text(me.name);
                            $("#shiwu-dialog").find(".info-phone label").text(me.mobile);
                            $("#shiwu-dialog").find(".info-address label").text(me.address);
                            me.close();
                            if(me.isFocus && !is_android()){
                                setTimeout(function(){
                                    location.href = window.location.href;
                                }, 500);
                            }
                            showTips('领取成功!');
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
                    $("#shiwu-dialog").find(".before").removeClass('none');
                    $("#shiwu-dialog").find(".after").addClass('none');
                }
            },
            check: function() {
                var me = this, name = $.trim($('.name').val()), mobile = $.trim($('.phone').val()), address = $.trim($('.address').val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写姓名');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写11位手机号码');
                    return false;
                } else if (address.length < 8 || address.length > 80 || address.length == 0) {
                    showTips('请填写详细地址');
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
                            ._('<section class="dialog-body">')
                                ._('<img class="t1" src="./images/t1.png">')
                                ._('<img class="award-img" src="./images/jp.jpg">')
                                ._('<p class="award-keyTips"></p>')
                                ._('<section class="input-box before">')
                                    ._('<p><span>姓名：</span><input class="name" type="text" placeholder=""></p>')
                                    ._('<p><span>电话：</span><input class="phone" type="tel" placeholder=""></p>')
                                    ._('<p><span>地址：</span><input class="address" type="text" placeholder=""></p>')
                                    ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物)-领取按钮"><img src="images/get.png"></a>')
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
                H.lottery.isCanShake = true;
                H.lottery.canJump = true;
                this.$dialog && this.$dialog.remove();
                this.$dialog = null;
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
                        shownewLoading(null, '领取中...');
                        var nickn = nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "";
                        getResult('api/lottery/award', {
                            oi: openid,
                            nn: nickn,
                            hi: headimgurl ? headimgurl : ""
                        }, 'callbackLotteryAwardHandler');
                        setTimeout(function(){
                            location.href = me.ru;
                        },1000);
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
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-link" id="link-dialog">')
                    ._('<section class="dialog link-dialog">')
                        ._('<section class="dialog-content">')
                            ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链)-关闭按钮"></a>')
                            ._('<section class="dialog-body">')
                                ._('<img class="t1" src="./images/t1.png">')
                                ._('<img class="award-img" src="./images/jp.jpg">')
                                ._('<p class="award-keyTips"></p>')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-link-use" id="btn-linkLottery-use" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-use" data-collect-desc="弹层(外链奖)-立即使用按钮"><img src="images/get.png"></a>')
                            ._('</section>')
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
                if (!$dialog) this.event();
            },
            close: function() {
                H.lottery.isCanShake = true;
                H.lottery.canJump = true;
                this.$dialog && this.$dialog.remove();
                this.$dialog = null;
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
                var t = simpleTpl(), qr = getRandomArbitrary(1,3) == 1 ? 'qr1' : 'qr2';
                t._('<section class="modal modal-thanks" id="thanks-dialog">')
                    ._('<section class="dialog thanks-dialog">')
                        ._('<section class="dialog-body">')
                            ._('<img class="t2" src="./images/t2.png">')
                            ._('<div class="qr ' + qr + '"><img class="fix" src="./images/' + qr + '.png"><img src="./images/' + qr + '.png"></div>')
                            ._('<section class="btn-lottery-box">')
                                ._('<a href="javascript:void(0);" class="btn-thanks-lottery" id="btn-thanksLottery-close" data-collect="true" data-collect-flag="dialog-thanks-btn-retry" data-collect-desc="弹层(谢谢参与)-继续摇奖按钮"><img src="./images/back.png"></a>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        }
    };

    W.callbackLotteryAwardHandler = function(data) {};
})(Zepto);

$(function() {
    H.dialog.init();
});