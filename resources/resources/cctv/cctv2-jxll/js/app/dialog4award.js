(function($) {
    H.dialog = {
        puid: 0,
        ci:null,
        ts:null,
        si:null,
        $container: $('body'),
        ru:'',
        init: function() {
            var me = this, height = $(window).height(), width = $(window).width();
            $('body').css({
                'width': width,
                'height': height
            });
            $('body').delegate('input', 'focus', function (e) {
                e.preventDefault();
                $('.modal').css('overflow-y', 'scroll');
            }).delegate('input', 'blur', function (e) {
                e.preventDefault();
                $('.modal').css('overflow-y', 'hidden');
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
            $('.btn-close').animate({'opacity':'1'}, 1000);
            this.$dialog.find('.dialog').addClass('bounceInDown');
            setTimeout(function(){
                me.$dialog.find('.dialog').removeClass('bounceInDown');
            }, 1000);
        },
        relocate : function(){
            var height = $(window).height(), width = $(window).width();
            $('.dialog').each(function() {
                $(this).css({ 
                    'width': width, 
                    'height': height, 
                    'left': 0,
                    'top': 0
                });
            });
        },
        lottery: {
            $dialog: null,
            url:null,
            ci:null,
            ts:null,
            si:null,
            pt:null,
            sto:null,
            name:null,
            mobile:null,
            ru:null,
            open: function(data) {
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                var winW = $(window).width(), winH = $(window).height();
                var lotteryW = winW * 0.8,
                    lotteryH = winH * 0.60,
                    lotteryT = (winH - lotteryH) / 2,
                    lotteryL = (winW - lotteryW) / 2;
                $('.lottery-dialog').css({
                    'width': lotteryW,
                    'height': lotteryH,
                    'top': lotteryT,
                    'left': lotteryL
                });
                $('.btn-close').css({
                    'top': lotteryT,
                    'right': lotteryL
                });
                me.update(data);
                H.dialog.lottery.readyFunc();
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutDown');
                $('.btn-close').animate({'opacity':'0'}, 300);
                setTimeout(function(){
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
            },
            readyFunc: function(){
                var me = this;
                $('#btn-getluck').click(function(e) {
                    e.preventDefault();
                    if($("#lot-inp").hasClass("none") || me.check()){
                        if(!$('#btn-getluck').hasClass("flag")){
                            $('#btn-getluck').addClass("flag");
                            if(me.pt == 7){
                                shownewLoading();
                                me.close();
                                me.sto = setTimeout(function(){
                                    hidenewLoading();
                                },15000);
                                $('#btn-getluck').text("领取中");
                                setTimeout(function(){
                                    me.wx_card();
                                },1000);
                            }else if(me.pt == 9){
                                shownewLoading();
                                $('#btn-getluck').text("领取中");
                                getResult('api/lottery/receive', {
                                    ru: me.ru,
                                    oi: openid,
                                    rn: me.name ? encodeURIComponent(me.name) : "",
                                    ph: me.mobile ? me.mobile : ""
                                }, 'callbackLotteryReceiveHandler');
                                setTimeout(function(){
                                    location.href = H.dialog.lottery.url;
                                },500);
                            }
                        }
                    }
                });
            },
            wx_card:function(){
                var me = this;
                //卡券
                wx.addCard({
                    cardList: [{
                        cardId: me.ci,
                        cardExt: "{\"timestamp\":\""+ me.ts +"\",\"signature\":\""+ me.si +"\"}"
                    }],
                    success: function (res) {
                        getResult('api/lottery/receive', {
                            ru: me.ru,
                            oi: openid,
                            rn: me.name ? encodeURIComponent(me.name) : "",
                            ph: me.mobile ? me.mobile : ""
                        }, 'callbackLotteryReceiveHandler');
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
                me.ru = data.ru;
                if(data.pt == 7 || data.pt == 9){
                    me.pt = data.pt;
                    $(".lottery-dialog").find(".award-img").attr("src",data.pi);
                    $(".lottery-dialog").find(".award-luck").html(data.pn);
                    if(data.al){
                        $(".lottery-dialog").find(".award-phone").text(data.al);
                        $(".lottery-dialog").find(".award-phone").removeClass("none");
                    }
                    if(data.cu == 1){
                        $('.lottery-dialog').css({
                            'height': $(window).height()*0.75,
                            'top': ($(window).height()*0.25) / 2
                        });
                        $('.btn-close').css({'top': ($(window).height()*0.25) / 2});
                        $("#lot-inp").removeClass("none");
                    }else{
                        $("#lot-inp").addClass("none");
                    }
                    if(data.pt == 9){
                        me.url = data.rl;
                        if(!data.rl){
                            $("#btn-getluck").addClass("none");
                        }else{
                            $("#btn-getluck").removeClass("none");
                        }
                    }else if(data.pt == 7){
                        me.ci = data.ci;
                        me.ts = data.ts;
                        me.si = data.si;
                    }
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery" id="lottery-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dialog-task-quan-link-close-btn" data-collect-desc="中奖弹层业务类(卡券-外链)-关闭按钮"></a>')
                    ._('<div class="dialog lottery-dialog">')
                        ._('<div class="lott-box" id="lott">')
                            ._('<p class="award-luck"></p>')
                            ._('<img class="award-img" src="./images/gift-blank.png" onerror="$(this).addClass(\'none\')">')
                            ._('<p class="award-phone none"></p>')
                            ._('<div class="inp" id="lot-inp">')
                                ._('<p class="ple">请填写您的联系方式，以便顺利领奖</p>')
                                ._('<p>姓名：<input class="name"></p>')
                                ._('<p>电话：<input class="phone" type="tel"></p>')
                            ._('</div>')
                            ._('<a class="lottery-btn" id="btn-getluck" href="#" data-collect="true" data-collect-flag="dialog-task-quan-link-get-btn" data-collect-desc="中奖弹层业务类(卡券-外链)-领取按钮">领取</a>')
                        ._('</div>')
                      ._('</div>')
                    ._('</div>');
                return t.toString();
            },
            check:function(){
                var me = this;
                var $mobile = $('.phone'),
                    mobile = $.trim($mobile.val()),
                    $name = $('.name'),
                    name = $.trim($name.val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖！');
                    return false;
                }else if (!/^\d{11}$/.test(mobile)) {
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
            pt:null,
            rl:null,
            ru:null,
            open: function(data) {
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                var winW = $(window).width(), winH = $(window).height();
                var lotteryW = winW * 0.8,
                    lotteryH = winH * 0.75,
                    lotteryT = (winH - lotteryH) / 2,
                    lotteryL = (winW - lotteryW) / 2;
                $('.lottery-dialog').css({
                    'width': lotteryW,
                    'height': lotteryH,
                    'top': lotteryT,
                    'left': lotteryL
                });
                $('.btn-close').css({
                    'top': lotteryT,
                    'right': lotteryL
                });
                me.update(data);
                // H.dialog.lottery.readyFunc();
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutDown');
                $('.btn-close').animate({'opacity':'0'}, 300);
                setTimeout(function(){
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
                    if(me.rl){
                        shownewLoading();
                        setTimeout(function(){
                            location.href = me.rl;
                        },500);
                    }else{
                        me.close();
                    }
                });
                this.$dialog.find('#btn-link').click(function(e) {
                    e.preventDefault();
                    if(me.rl){
                        shownewLoading();
                        setTimeout(function(){
                            location.href = me.rl;
                        },500);
                    }else{
                        me.close();
                    }
                });
                this.$dialog.find('#btn-sure').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('#btn-award').click(function(e) {
                    e.preventDefault();
                    if(me.check()){
                        var $mobile = $('.phone'),
                            mobile = $.trim($mobile.val()),
                            $name = $('.name'),
                            name = $.trim($name.val());
                        if(me.pt == 1){
                            $("#Entlottery-dialog").find(".na").text(name);
                            $("#Entlottery-dialog").find(".ph").text(mobile);
                        }
                        getResult('api/lottery/receive', {
                            ru: me.ru,
                            oi: openid,
                            rn: name ? encodeURIComponent(name) : "",
                            ph: mobile ? mobile : ""
                        }, 'callbackLotteryReceiveHandler');
                        if(H.dialog.Entlottery.pt == 5){
                            // showTips("领取成功");
                            $("#ent-inp").addClass("none");
                            $("#ent-show").removeClass("none");
                        }else if(H.dialog.Entlottery.pt == 1){
                            // showTips("领取成功");
                            $("#ent-inp").addClass("none");
                            $("#ent-result").removeClass("none");
                        }
                    }
                });
            },
            update: function(data) {
                var me = this;
                me.pt = data.pt;
                me.ru = data.ru;
                if (data.rl) {
                    me.rl = data.rl;
                    $('#btn-link').removeClass('none');
                    $('#btn-use').removeClass('none');
                } else {
                    $('#btn-link').addClass('none');
                    $('#btn-use').addClass('none');
                }
                if(data.al){
                    $("#Entlottery-dialog").find(".award-phone").text(data.al);
                    $("#Entlottery-dialog").find(".award-phone").removeClass("none");
                }
                if(data.pt == 5){
                    $("#Entlottery-dialog").find(".award-luckEt").html(data.pn);
                    $("#Entlottery-dialog").find(".award-img").attr("src",data.pi);
                    if(data.pd){
                        $('.prize-desc').text(data.pd);
                    }
                    var code = data.cc;
                    if(code){
                        var cd = code.split(",");
                        if (typeof(cd[0]) == 'undefined' || cd[0] == '') {
                            $('.code-number').addClass('none');
                        } else {
                            $("#Entlottery-dialog").find(".dc").text(cd[0]);
                            $('.code-number').removeClass('none');
                        }
                        if (typeof(cd[1]) == 'undefined' || cd[1] == '') {
                            $('.code-password').addClass('none');
                            $('.prize-desc').removeClass('none');
                        } else {
                            $("#Entlottery-dialog").find(".pc").text(cd[1]);
                            $('.code-password').removeClass('none');
                        }
                    }
                }else if(data.pt == 1){
                    $("#Entlottery-dialog").find(".award-luckEt").html(data.pn);
                    $("#Entlottery-dialog").find(".award-img").attr("src", data.pi);
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery" id="Entlottery-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dialog-task-Entlottery-close-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-关闭按钮"></a>')
                    ._('<div class="dialog lottery-dialog">')
                        ._('<div class="lott-box" id="ent-lott">')
                            ._('<p class="award-luckEt"></p>')
                            ._('<img class="award-img" src="./images/gift-blank.png" onerror="$(this).addClass(\'none\')">')
                            ._('<p class="award-phone none"></p>')
                            ._('<div class="inp" id="ent-inp">')
                                ._('<p class="ple">请填写您的联系方式，以便顺利领奖</p>')
                                ._('<p>姓名：<input class="name"></p>')
                                ._('<p>电话：<input class="phone" type="tel"></p>')
                                ._('<a class="lottery-btn" id="btn-award" data-collect="true" data-collect-flag="dialog-task-Entlottery-award-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-提交信息按钮">提交信息</a>')
                            ._('</div>')
                            ._('<div class="code none" id="ent-show">')
                                ._('<p class="ple" id="ent-ple">请截屏此页，需凭此码兑换票券</p>')
                                ._('<p class="cd code-number">兑换码：<span class="dc"></span></p>')
                                ._('<p class="cd code-password">密码：<span class="pc"></span></p>')
                                ._('<p class="cd prize-desc none"></p>')
                                ._('<a class="lottery-btn" id="btn-use" data-collect="true" data-collect-flag="dialog-task-Entlottery-use-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-立即使用按钮">立即使用</a>')
                            ._('</div>')
                            ._('<div class="result none" id="ent-result">')
                                ._('<p class="ple">以下是您的联系方式!</p>')
                                ._('<p class="cd">姓名：<span class="na"></span></p>')
                                ._('<p class="cd">电话：<span class="ph"></span></p>')
                                ._('<a class="lottery-btn" id="btn-link" data-collect="true" data-collect-flag="dialog-task-Entlottery-link-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-领取按钮">领取</a>')
                                ._('<a class="lottery-btn" id="btn-sure" data-collect="true" data-collect-flag="dialog-task-Entlottery-sure-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-返回按钮">返回</a>')
                            ._('</div>')
                        ._('</div>')
                    ._('</div>')
                    ._('</div>');
                return t.toString();
            },
            check:function(){
                var $mobile = $('.phone'),
                    mobile = $.trim($mobile.val()),
                    $name = $('.name'),
                    name = $.trim($name.val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖!');
                    return false;
                }else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                }
                return true;
            }
        }
    };
    W.callbackLotteryReceiveHandler = function(data) {
        if (data.result) {
            var exp = new Date();
            exp.setTime(exp.getTime() + 3*60*1000);
            if (H.award.id) {
                $.fn.cookie(H.award.id, 'true', {expires: exp});
            }
            $('#' + H.award.id).remove();
            if ($('ul li').length <= 0) {
                $('.content').html('<h1 class="norecord">您当前没有未领奖的记录</h1>');
            }
        }
    };
})(Zepto);

$(function() {
    H.dialog.init();
});
