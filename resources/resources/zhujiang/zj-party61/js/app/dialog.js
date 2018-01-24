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
            setTimeout(function(){
                me.$dialog.find('.dialog').removeClass('bounceInDown');
            }, 1000);
            hidenewLoading();
        },
        relocate : function(){
            var height = $(window).height(), width = $(window).width();
            $('.modal, .dialog').each(function() {
                $(this).css({
                    'width': width,
                    'height': height,
                    'left': 0,
                    'top': 0
                });
            });
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        rule: {
            $dialog: null,
            open: function () {
                H.dialog.open.call(this);
                this.event();
                this.pre_dom();
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                    $(".dialog").css({
                        'width': "250px",
                        'height': "330px",
                        'left': Math.round((width-250)/2)+'px',
                        'top': Math.round((height-330)/2 - 55)+'px'
                    });
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
                    H.dialog.btn_animate($(this));
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
                        ._('<img class="butterfly" src="images/butterfly.png">')
                        ._('<div class="dialog-content">')
                            ._('<img class="icon-rule" src="./images/lj-top.png">')
                            ._('<div class="rule-content"><div id="rule-content">' + rule_temp + '</div></div>')
                        ._('</div>')
                    ._('<a href="#" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-rule-btn-close" data-collect-desc="弹层(活动规则)-关闭按钮"></a>')
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
                me.pre_dom();
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                if(W.screen.width === 320){
                    $(".dialog").css({
                        'width': "280px",
                        'height': "431px",
                        'left': Math.round((width-280)/2)+'px',
                        'top': Math.round((height-431)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "310px",
                        'height': "477px",
                        'left': Math.round((width-310)/2)+'px',
                        'top': Math.round((height-477)/2)+'px'
                    });
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
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                $("#btn-redbagLottery-use").click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    if(!$(this).hasClass("flag")) {
                        shownewLoading(null, '领取中...');
                        $(this).addClass("flag");
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
                    ._('<section class="dialog redbag-dialog" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-立即领取按钮">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-redbag-btn-close" data-collect-desc="弹层(红包)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<img class="award-img" src="">')
                            ._('<section class="btn-lottery-box">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-redbag-get" id="btn-redbagLottery-use" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-领取红包按钮"><img src="images/btn-lj.png" /></a>')
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
                me.pre_dom();
                me.checkFocus();
            },
            checkFocus: function(){
                var me = this;
                $("input").each(function() {
                    $(this).focus(function(){
                        me.isFocus = true;
                    });
                });
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                if(W.screen.width === 320){
                    $(".dialog").css({
                        'width': "250px",
                        'height': "372px",
                        'left': Math.round((width-250)/2)+'px',
                        'top': Math.round((height-372)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "310px",
                        'height': "461px",
                        'left': Math.round((width-300)/2)+'px',
                        'top': Math.round((height-446)/2)+'px'
                    });
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
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                    if(me.isFocus && !is_android()){
                        toUrl("lottery.html");
                    }
                });
                this.$dialog.find('#btn-shiwuLottery-award').click(function(e) {
                    e.preventDefault();
                    if(me.check()) {
                        if(!$(this).hasClass("flag")){
                            $(this).addClass("flag");
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
                            if(me.isFocus && !is_android()){
                                toUrl("lottery.html");
                            }
                        }
                    }
                });
                this.$dialog.find('#btn-shiwuLottery-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                    if(me.isFocus && !is_android()){
                        toUrl("lottery.html");
                    }
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
                        /*._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-close" data-collect-desc="弹层(实物)-关闭按钮"></a>')*/
                        ._('<section class="dialog-content">')
                            /*._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<p class="award-keyTips"></p>')*/
                            ._('<img class="award-img" src="">')

                        ._('<section class="footer">')
                            ._('<section class="input-box">')
                                /*._('<h5>请填写您的联系方式，以便顺利领奖</h5>')*/
                                ._('<p><span>姓名：</span><input class="name" type="text" placeholder=""></p>')
                                ._('<p><span>电话：</span><input class="phone" type="tel" placeholder=""></p>')
                                ._('<p><span>地址：</span><input class="address" type="text" placeholder=""></p>')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物)-领取按钮">立即领奖></a>')
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
                me.pre_dom();
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                if(W.screen.width === 320){
                    $(".dialog").css({
                        'width': "250px",
                        'height': "372px",
                        'left': Math.round((width-250)/2)+'px',
                        'top': Math.round((height-372)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "310px",
                        'height': "461px",
                        'left': Math.round((width-300)/2)+'px',
                        'top': Math.round((height-446)/2)+'px'
                    });
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
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                this.$dialog.find('#btn-linkLottery-use').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
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
                    H.dialog.btn_animate($(this));
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
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-link" id="link-dialog">')
                    ._('<section class="dialog link-dialog">')
                        /*._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链)-关闭按钮"></a>')*/
                        ._('<section class="dialog-content">')
                            /*._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<p class="award-keyTips"></p>')*/
                            ._('<img class="award-img" src="">')
                            ._('<section class="btn-lottery-box">')
                                ._('<a href="javascript:void(0);" class="btn-link-use" id="btn-linkLottery-use" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-use" data-collect-desc="弹层(外链)-立即领取按钮">立即领取></a>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        duiHuanMaLottery: {
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
                me.pre_dom();
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                if(W.screen.width === 320){
                    $(".dialog").css({
                        'width': "280px",
                        'height': "431px",
                        'left': Math.round((width-280)/2)+'px',
                        'top': Math.round((height-431)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "310px",
                        'height': "477px",
                        'left': Math.round((width-310)/2)+'px',
                        'top': Math.round((height-477)/2)+'px'
                    });
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
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                this.$dialog.find('#btn-djmLottery-use').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    shownewLoading();
                    getResult('api/lottery/award', {
                        oi: openid,
                        nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        hi: headimgurl ? headimgurl : ""
                    }, 'callbackLotteryAwardHandler');
                    setTimeout(function(){
                        $("#dhm-dialog").find(".before").addClass('none');
                        $("#dhm-dialog").find(".after").removeClass('none');
                        hidenewLoading();
                    }, 200);
                });
                this.$dialog.find('#btn-djmkLottery-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
            },
            update: function(data) {
                var me = this, height = $(window).height();
                if(data.result){
                    $("#dhm-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#dhm-dialog").find(".award-keyTips").html(data.pn || '');
                    if(data.al){
                        $("#dhm-dialog").find(".tel").html("<img class='tel-img' src='images/tel.png' />"+data.al);
                    }
                    if(data.cc){
                        $("#dhm-dialog").find(".cc").text("兑奖码:"+ data.cc).removeClass("none");
                    }

                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-link" id="dhm-dialog">')
                    ._('<section class="dialog dhm-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-dhm-btn-close" data-collect-desc="弹层(兑换码)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            /*._('<p class="award-keyTips"></p>')*/
                            ._('<img class="award-img" src="">')
                            ._('<h4 class="tel"></h4>')
                            ._('<h5>请截屏此页，需凭此码兑换奖品</h5>')
                            ._('<div class="cc none"></div>')
                            ._('<section class="btn-lottery-box">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-link-use before" id="btn-djmLottery-use" data-collect="true" data-collect-flag="dialog-dhm-btn-linkLottery-use" data-collect-desc="弹层(兑奖码)-立即领取按钮"><img src="images/btn-lj.png" /></a>')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-link-lottery-close none after" id="btn-djmkLottery-close" data-collect="true" data-collect-flag="dialog-dhm-btn-linkLottery-close" data-collect-desc="弹层(兑奖码)-继续摇奖按钮"><img src="images/jxyj.png" /></a>')
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
                me.pre_dom();
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                if(W.screen.width === 320){
                    $(".dialog").css({
                        'width': "250px",
                        'height': "372px",
                        'left': Math.round((width-250)/2)+'px',
                        'top': Math.round((height-372)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "310px",
                        'height': "461px",
                        'left': Math.round((width-300)/2)+'px',
                        'top': Math.round((height-446)/2)+'px'
                    });
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
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                    me.close();
                });
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                    me.close();
                });
            },
            readyFunc: function(){
                var me = this;
                $('#btn-wxcardLottery-award').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    H.lottery.isCanShake = false;
                    if(!$(this).hasClass("flag")){
                        $(this).addClass("flag");
                        shownewLoading();
                        me.close();
                        me.sto = setTimeout(function(){
                            H.lottery.isCanShake = true;
                            hidenewLoading();
                        },15000);
                        setTimeout(function(){
                            me.wx_card();
                        },1000);
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
                    $("#wxcard-dialog").find('.award-keyTips').html(data.pn || '');
                    me.ci = data.ci;
                    me.ts = data.ts;
                    me.si = data.si;
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-wxcard" id="wxcard-dialog">')
                    ._('<section class="dialog wxcard-dialog">')
                        //._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-wxcard-btn-close" data-collect-desc="弹层(卡券)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            /*._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<p class="award-keyTips"></p>')*/
                            ._('<img class="award-img" src="">')
                            ._('<section class="btn-lottery-box">')
                                ._('<a href="javascript:void(0);" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">立即领取></a>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        thanks: {
            $dialog: null,
            randomSrc: null,
            open: function(data) {
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
                var me =this, $dialog = this.$dialog, width = $(window).width(), height = $(window).height();
                this.textMath();
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                this.pre_dom();
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                if(W.screen.width === 320){
                    $(".dialog").css({
                        'width': "280px",
                        'height': "431px",
                        'left': Math.round((width-280)/2)+'px',
                        'top': Math.round((height-431)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "310px",
                        'height': "477px",
                        'left': Math.round((width-310)/2)+'px',
                        'top': Math.round((height-477)/2)+'px'
                    });
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
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                this.$dialog.find('#btn-thanksLottery-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
            },
            textMath: function() {//随机img
                var me = this;
                if(thanks_imgs.length >0){
                    var i = Math.floor((Math.random()*thanks_imgs.length));
                    me.randomSrc = thanks_imgs[i];
                }
            },
            tpl: function() {
                var t = simpleTpl(),me = this;
                t._('<section class="modal modal-thanks" id="thanks-dialog">')
                    ._('<section class="dialog thanks-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-thanks-btn-close" data-collect-desc="弹层(谢谢参与)-关闭按钮"></a>')
                            ._('<img class="icon-thanks" src="'+ me.randomSrc +'">')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        sentCard: {
            $dialog: null,
            open: function(t, uid, ib, mu, info) {
                var me =this, $dialog = this.$dialog, width = $(window).width(), height = $(window).height();
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event(t, uid, ib, mu, info);
                }
                me.update(ib, mu, info);
                this.pre_dom();
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                if(W.screen.width === 320){
                    $(".dialog").css({
                        'width': "280px",
                        'height': "255px",
                        'left': Math.round((width-280)/2)+'px',
                        'top': Math.round((height-255)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "310px",
                        'height': "282px",
                        'left': Math.round((width-310)/2)+'px',
                        'top': Math.round((height-282)/2)+'px'
                    });
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
            getnewUrl: function(openid,cu) {
                var href = window.location.href;
                href = add_param(href,"cu",cu,true);
                href = add_param(href.replace(/[^\/]*\.html/i, 'sharego.html'), 'resopenid', hex_md5(openid), true);
                href = add_param(href, 'from', 'share', true);
                href = delQueStr(href, "openid");
                href = delQueStr(href, "headimgurl");
                href = delQueStr(href, "nickname");
                return add_yao_prefix(href);
            },
            event: function(t, uid, ib, mu, info) {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                this.$dialog.find('.icon-rays,.xf').click(function(e) {
                    e.preventDefault();
                    me.close();
                });

                this.$dialog.find('#btn-pn').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    var info = $('select option:selected') .val(),
                        title = nickname + '与' + t + '祝你六一快乐',
                        share_info = "我在广东少儿频道《六一晚会》摇大奖，快来和我一起参与吧！";

                    $.ajax({
                        type: 'GET',
                        async: true,
                        url: domain_url + 'api/ceremony/greetingcard/make' + dev,
                        data: {
                            oi : openid,
                            sn : uid,
                            gt : encodeURIComponent(info),
                            nn : nickname,
                            hi : headimgurl
                        },
                        dataType: "jsonp",
                        jsonpCallback: 'callbackMakeCardHandler',
                        complete: function() {},
                        success: function(data) {
                            if(data.result == true){
                                window['shaketv'] && shaketv.wxShare(share_img, title, share_info, H.dialog.sentCard.getnewUrl(openid, data.cu));
                            }
                        },
                        error: function(xmlHttpRequest, error) {}
                    });
                    me.$dialog.find('.sentCard').addClass('none');
                    me.$dialog.find('#icon').removeClass('none');
                });

                this.$dialog.find('.triangle-right').tap(function(e) {
                    e.preventDefault();
                    var $tg = $(this),
                        $audio = $(this).find('audio');
                    if ($tg.hasClass('scale')) {
                        $audio.get(0).pause();
                        $tg.removeClass('scale');
                        return;
                    }
                    $tg.addClass('scale');
                    $audio.get(0).play();
                    $audio.on('playing', function() {
                        console.log('playing');
                    }).on('ended', function() {
                        $audio.get(0).pause();
                        $tg.removeClass('scale');
                    });
                });
            },
            update: function(ib, mu, info){
                $('#self-img img').attr('src', headimgurl ? (headimgurl + '/' + yao_avatar_size) : './images/avatar.png');
                $('#mx-img img').attr('src', (ib || './images/avatar.png'));
                $('audio').attr('src', (mu || ''));
                $('audio').on('loadedmetadata', function() {
                    $(this).siblings(".duri").text(Math.ceil($(this).get(0).duration) + "'");
                });
                var wordItems = info.split('-');
                $.each(wordItems, function(i, item){
                    $(".gx").append('<option value ="'+ item +'">'+ item +'</option>');
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-card" id="sentCard">')
                    ._('<section class="dialog sentCard">')
                        ._('<img class="butterfly" src="images/butterfly.png">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-sent-btn-close" data-collect-desc="弹层(明星语音)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<div class="start">')
                                ._('<label id="mx-img"><img src="images/avatar.png" /></label>')
                                ._('<p class="triangle-right">')
                                    ._('<audio preload="auto" class="audio none" src="" id="music"></audio>')
                                    ._('<span class="duri"></span><i></i>')
                                ._('</p>')
                            ._('</div>')
                            ._('<div class="start">')
                                ._('<label id="self-img"><img src="images/avatar.png" /></label>')
                                ._('<select class="gx"></select><i></i>')
                            ._('</div>')
                            ._('<section class="btn-lottery-box">')
                                ._('<a href="javascript:void(0);" class="btn-card-close" data-collect="true" data-collect-flag="dialog-sent-btn-sentLottery-close" data-collect-desc="弹层(明星语音)-发送贺卡按钮"><img id="btn-pn" src="images/send.png" /></a>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                    ._('<section class="icon none" id="icon">')
                        ._('<img class="start twinkle1" src="images/start.png">')
                        ._('<img class="start twinkle2" src="images/start.png">')
                        ._('<img class="start twinkle3" src="images/start.png">')
                        ._('<img src="images/icon-rays.png" class="icon-rays" data-collect="true" data-collect-flag="dialog-sent-btn-close" data-collect-desc="弹层(明星语音)-关闭按钮" />')
                        ._('<img class="butterfly" src="images/butterfly.png">')
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