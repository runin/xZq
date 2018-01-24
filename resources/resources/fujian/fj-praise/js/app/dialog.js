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
                    'width': width * 0.88, 
                    'left': width * 0.06,
                    'top': height * 0.11
                });
            });
        },
        rule: {
            $dialog: null,
            open: function () {
                H.dialog.open.call(this);
                this.event();
                hidenewLoading();
                getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
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
            update: function (rule) {
                this.$dialog.find('#rule-content').html(rule);
            },
            tpl: function () {
                var t = simpleTpl();
                t._('<section class="modal modal-rule" id="rule-dialog">')
                    ._('<section class="dialog rule-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-rule-btn-close" data-collect-desc="弹层(活动规则)-关闭按钮"><img src="./images/btn-close.png"></a>')
                        ._('<section class="dialog-content">')
                            ._('<h1>活动规则</h1>')
                            ._('<section class="rule-content" id="rule-content">')
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
                $(".lottery").animate({'opacity': '0'});
                setTimeout(function(){
                    $(".praise").removeClass("none");
                    $(".lottery").addClass("none");
                    $(".praise").animate({'opacity': '1'});
                },1000);
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
                    H.dialog.lru = data.ruid;
                    $("#shiwu-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    // $("#shiwu-dialog").find(".award-luckTips").html(data.tt || '恭喜您获得');
                    $("#shiwu-dialog").find('.award-keyTips').html(data.pd || '');
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
                } else if (address.length < 6 || address.length > 80 || address.length == 0) {
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
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-rule-btn-close" data-collect-desc="弹层(活动规则)-关闭按钮"><img src="./images/btn-close.png"></a>')
                        ._('<section class="dialog-content">')
                        ._('<img class="bg-top" src="images/luck-top.jpg"><img class="roll" src="images/roll.png">')
                    ._('<p class="award-keyTips"></p>')
                    ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<section class="input-box before">')
                                ._('<input class="name" type="text" placeholder="姓名:">')
                                ._('<input class="phone" type="tel" placeholder="电话:">')
                                ._('<input class="address" type="text" placeholder="地址:">')
                            ._('</section>')
                            ._('<section class="info-box after">')
                                ._('<p class="info-name">姓名：<label></label></p>')
                                ._('<p class="info-phone">电话：<label></label></p>')
                                ._('<p class="info-address">地址：<label></label></p>')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物奖)-领取按钮">领取</a>')
                            ._('<section class="btn-lottery-box after">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-close" id="btn-shiwuLottery-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-close" data-collect-desc="弹层(实物奖)-关闭按钮">关闭</a>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        thanksLottery: {
            $dialog: null,
            open: function() {
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                var height = $(window).height(), width = $(window).width();
                $("#thanks-dialog").find(".dialog").css({
                    'width': width * 0.88,
                    'left': width * 0.06,
                    'top': height * 0.15
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
                $(".lottery").animate({'opacity': '0'});
                setTimeout(function(){
                    $(".praise").removeClass("none");
                    $(".lottery").addClass("none");
                    $(".praise").animate({'opacity': '1'});
                },1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-shiwu" id="thanks-dialog">')
                    ._('<section class="dialog shiwu-dialog">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-rule-btn-close" data-collect-desc="弹层(活动规则)-关闭按钮"><img src="./images/btn-close.png"></a>')
                    ._('<section class="dialog-content">')
                    ._('<img class="bg-top" src="images/bg-top.jpg"><img class="roll" src="images/roll.png">')
                    ._('<img class="award-egg" src="./images/thanks-egg.png">')
                    ._('<img class="award-thanks" src="./images/thanks-tip.png">')
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
                var height = $(window).height();
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
                me.readyFunc();
                $("#wxcard-dialog").find(".dialog").css({
                    'top': height * 0.15
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
                $(".lottery").animate({'opacity': '0'});
                setTimeout(function(){
                    $(".praise").removeClass("none");
                    $(".lottery").addClass("none");
                    $(".praise").animate({'opacity': '1'});
                },1000);
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
                var me = this;
                if(data.result && data.pt == 7){
                    H.dialog.lru = data.ruid;
                    me.pt = data.pt;
                    $("#wxcard-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    // $("#wxcard-dialog").find(".award-luckTips").html(data.tt || '恭喜您获得');
                    $("#wxcard-dialog").find('.award-keyTips').html(data.pd || '');
                    $("#wxcard-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#wxcard-dialog").find(".phone").val(data.ph ? data.ph : '');
                    if(data.cu == 1){
                        $('.wxcard-dialog').css({
                            'top': Math.ceil($(window).height()*0.26)
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
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-rule-btn-close" data-collect-desc="弹层(活动规则)-关闭按钮"><img src="./images/btn-close.png"></a>')
                        //._('<img class="icon-lotterydoll" src="./images/icon-lotterydoll.png">')
                        ._('<section class="dialog-content">')
                         ._('<img class="bg-top" src="images/luck-top.jpg"><img class="roll" src="images/roll.png">')
                            // ._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<section class="input-box none">')
                                ._('<p class="award-keyTips"></p>')
                                ._('<input class="name" type="text" placeholder="姓名:">')
                                ._('<input class="phone" type="tel" placeholder="电话:">')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">领取</a>')
                        ._('</section>')
                        // ._('<img class="icon-palm" src="./images/icon-palm.png">')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        linkLottery: {
            $dialog: null,
            open: function(data) {
                var me =this, $dialog = this.$dialog;
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
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });

                this.$dialog.find('.btn-link-lottery-award').click(function(e) {
                    e.preventDefault();
                    if(!$(this).hasClass("flag")){
                        $(this).addClass("flag");
                        getResult('api/lottery/award', {
                            oi: openid
                            //hi: headimgurl,
                            //nn: nickname
                        }, 'callbackLotteryAwardHandler');
                        $(this).html("领取中");
                        window.location.href = me.url;
                    }
                });
            },

            update: function(data) {
                var me = this;
                if(data.result && data.pt == 9){
                    me.pt = data.pt;
                    me.url = data.ru;
                    $("#link-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-link" id="link-dialog">')
                    ._('<section class="dialog link-dialog">')
                    ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链奖品)-关闭按钮"><img src="./images/btn-close.png"></a>')
                        // ._('<img class="icon-lotterydoll" src="./images/icon-lotterydoll.png">')
                        ._('<section class="dialog-content">')
                            ._('<img class="bg-top" src="images/luck-top.jpg"><img class="roll" src="images/roll.png">')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-link-lottery-award" id="btn-linkLottery-award" data-collect="true" data-collect-flag="dialog-link-btn-wxcardLottery-award" data-collect-desc="弹层(外链)-领取按钮">领取</a>')
                        ._('</section>')
                        // ._('<img class="icon-palm" src="./images/icon-palm.png">')
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