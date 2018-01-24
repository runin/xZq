(function($) {
    H.dialog = {
        ci:null,
        ts:null,
        si:null,
        name: '',
        mobile: '',
        address: '',
        $container: $('body'),
        init: function() {
            var me = this, width = $(window).width(), height = $(window).height();
            $('body').css({
                'width': width
            });
        },
        open: function(data) {
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
                    'height': "100%",
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
        userInfo: {
            $dialog: null,
                open: function() {
                if($("body").attr("data-type") != "user"){
                    H.lottery.isCanShake = false;
                    H.lottery.canJump = false;
                }
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                me.pre_dom();
                me.checkFocus();
                me.update();
            },
            checkFocus: function(){
                var me = this;
                $("input").each(function() {
                    $(this).focus(function(){
                    }).blur(function(){
                        $(window).scrollTop(0);
                    });
                });
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                $(".dialog").css({
                    'width': "280px",
                    'height': "337px",
                    'left': Math.round((width-280)/2)+'px',
                    'top': Math.round((height-337)/2)+'px'
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
                this.$dialog.find('#btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                this.$dialog.find('.login').click(function(e) {
                    e.preventDefault();
                    var outMe = H.dialog;
                    H.dialog.btn_animate($(this));
                    if(me.check()) {
                        if(!$(this).hasClass("flag")){
                            $(this).addClass("flag");

                            $.ajax({
                                type: 'GET',
                                async: false,
                                url: domain_url + 'api/user/edit_v2' + dev,
                                data: {
                                    matk: matk,
                                    nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                    hi: headimgurl ? headimgurl : "",
                                    ph: outMe.mobile ? outMe.mobile : "",
                                    rn: outMe.name ? encodeURIComponent(outMe.name) : "",
                                    ad: outMe.address ? encodeURIComponent(outMe.address) : ""
                                },
                                dataType: "jsonp",
                                jsonpCallback: 'callbackUserEditHandler',
                                timeout: 10000,
                                complete: function() {},
                                success: function(data) {
                                    if(data.result){
                                        me.close();
                                        if($("body").attr("data-type") != "user"){
                                            H.lottery.showDialog(H.lottery.luckData);
                                        }
                                    }else{
                                        me.close();
                                    }
                                },
                                error: function(xmlHttpRequest, error) {me.close();}
                            });
                        }
                    }
                });
            },
            check: function() {
                var outMe = H.dialog, name = $.trim($('#name').val()), mobile = $.trim($('#phone').val()), address = $.trim($('#address').val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名！');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号！');
                    return false;
                } else if (address.length < 8 || address.length > 80 || address.length == 0) {
                    showTips('请填写您的详细地址！');
                    return false;
                }
                outMe.name = name;
                outMe.mobile = mobile;
                outMe.address = address;
                return true;
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-user" id="user-dialog">')
                    ._('<section class="dialog user-dialog">');
                    if($("body").attr("data-type") == "user"){
                        t._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-user-btn-close" data-collect-desc="弹层(个人信息)-关闭按钮"><img src="images/user-close.jpg"></a>')
                            ._('<img class="user-head" src="./images/user-head.png">')
                    }else{
                        t._('<a href="javascript:void(0);" class="btn-dialog-close" data-collect="true" data-collect-flag="dialog-user-btn-close" data-collect-desc="弹层(个人信息)-关闭按钮"><img src="images/user-head.png"></a>')
                    }
                        t._('<section class="dialog-content">')
                            ._('<p class="award-luckTips"><img src="./images/user-info.png"></p>')
                            ._('<section class="input-box before">')
                                ._('<p>姓 名</p><input class="name" type="text" id="name">')
                                ._('<p>手 机</p><input class="phone" type="tel" id="phone">')
                                ._('<p>地 址</p><input class="address" type="text" id="address">')
                            ._('</section>')
                    if($("body").attr("data-type") == "user"){
                        t._('<a href="javascript:void(0);" class="btn-lottery btn-user-confirm login" data-collect="true" data-collect-flag="dialog-user-confirm" data-collect-desc="弹层(个人信息)-确认按钮"></a>')
                    }else{
                        t._('<a href="javascript:void(0);" class="btn-lottery btn-user-login login" data-collect="true" data-collect-flag="dialog-user-login" data-collect-desc="弹层(个人信息)-登入按钮"></a>')
                    }
                        t._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            },
            update: function(){
                if($("body").attr("data-type") == "user"){
                    getResult('api/user/info_v2', {matk: matk}, 'callbackUserInfoHandler');
                }else{
                    var me = H.lottery.luckData;
                    $("#name").val(me.rn || "");
                    $("#phone").val(me.ph || "");
                    $("#address").val(me.ad || "");
                }
            }
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
                        ._('<a href="#" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-rule-btn-close" data-collect-desc="弹层(活动规则)-关闭按钮"></a>')
                        ._('<div class="dialog-content">')
                            ._('<img class="icon-rule" src="./images/icon-rule.png">')
                            ._('<div class="rule-content" id="rule-content">' + rule_temp + '</div>')
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
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
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
                        'height': "388px",
                        'left': Math.round((width-280)/2)+'px',
                        'top': Math.round((height-388)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "320px",
                        'height': "443px",
                        'left': Math.round((width-320)/2)+'px',
                        'top': Math.round((height-443)/2)+'px'
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
                    $(".redbag-dialog").find("h1").html("<span>"+ data.tt +"</span>元");
                    $("#redbag-dialog").find(".award-keyTips").html(data.pn || '');
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-redbag" id="redbag-dialog">')
                    ._('<section class="dialog redbag-dialog" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-立即领取按钮">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-redbag-btn-close" data-collect-desc="弹层(红包)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            /*._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<p class="award-keyTips"></p>')*/
                            ._('<img class="award-img" src="">')
                            ._('<h1></h1>')
                            ._('<section class="btn-lottery-box">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-redbag-get" id="btn-redbagLottery-use" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-领取红包按钮">点击领取</a>')
                                ._('<h2>>>请在公众号推送消息中领取</h2>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        jfLottery: {
            $dialog: null,
            open: function(data) {
                var me =this, $dialog = this.$dialog, winW = $(window).width(), winH = $(window).height();
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
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
                        'height': "388px",
                        'left': Math.round((width-280)/2)+'px',
                        'top': Math.round((height-388)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "320px",
                        'height': "443px",
                        'left': Math.round((width-320)/2)+'px',
                        'top': Math.round((height-443)/2)+'px'
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
                        $(this).addClass("flag");

                        var outMe = H.dialog;
                        getResult('api/lottery/award', {
                            oi: openid,
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            rn: outMe.name ? encodeURIComponent(outMe.name) : "",
                            ph: outMe.mobile ? outMe.mobile : "",
                            ad: outMe.address ? encodeURIComponent(outMe.address) : ""
                        }, 'callbackLotteryAwardHandler');
                        me.close();
                        showTips('领取成功');
                    }
                });
            },
            update: function(data) {
                var me = this, height = $(window).height();
                if(data.result){
                    $(".redbag-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $(".redbag-dialog").find("h1").html("<span>"+ data.tt +"</span>积分");
                    /*$("#redbag-dialog").find(".award-keyTips").html(data.pn || '');*/
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-redbag" id="jf-dialog">')
                    ._('<section class="dialog redbag-dialog" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(积分)-立即领取按钮">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-redbag-btn-close" data-collect-desc="弹层(积分)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            /*._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<p class="award-keyTips"></p>')*/
                            ._('<img class="award-img" src="">')
                            ._('<h1></h1>')
                            ._('<section class="btn-lottery-box">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-redbag-get" id="btn-redbagLottery-use" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(积分)-领取积分按钮">点击领取</a>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        shiwuLottery: {
            $dialog: null,
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
                        'width': "280px",
                        'height': "388px",
                        'left': Math.round((width-280)/2)+'px',
                        'top': Math.round((height-388)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "320px",
                        'height': "443px",
                        'left': Math.round((width-320)/2)+'px',
                        'top': Math.round((height-443)/2)+'px'
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
                /*this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                    if(me.isFocus && !is_android()){
                        toUrl("lottery.html");
                    }
                });*/
                this.$dialog.find('#btn-shiwuLottery-award').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    if(!$('#btn-shiwuLottery-award').hasClass("flag")){
                        $('#btn-shiwuLottery-award').addClass("flag");

                        var outMe = H.dialog;
                        getResult('api/lottery/award', {
                            oi: openid,
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            rn: outMe.name ? encodeURIComponent(outMe.name) : "",
                            ph: outMe.mobile ? outMe.mobile : "",
                            ad: outMe.address ? encodeURIComponent(outMe.address) : ""
                        }, 'callbackLotteryAwardHandler');
                        me.close();
                        showTips('领取成功');
                    }
                });
                /*this.$dialog.find('#btn-shiwuLottery-close').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                    if(me.isFocus && !is_android()){
                        toUrl("lottery.html");
                    }
                });*/
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    $("#shiwu-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    /*$("#shiwu-dialog").find(".award-keyTips").html(data.pn || '');*/
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-shiwu" id="shiwu-dialog">')
                    ._('<section class="dialog shiwu-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-close" data-collect-desc="弹层(实物)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            /*._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<p class="award-keyTips"></p>')*/
                            ._('<img class="award-img" src="">')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物)-领取按钮">领 取</a>')
                            ._('<section class="btn-lottery-box after">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-close" id="btn-shiwuLottery-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-close" data-collect-desc="弹层(实物)-继续摇奖按钮">返 回</a>')
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
                        'width': "280px",
                        'height': "388px",
                        'left': Math.round((width-280)/2)+'px',
                        'top': Math.round((height-388)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "320px",
                        'height': "443px",
                        'left': Math.round((width-320)/2)+'px',
                        'top': Math.round((height-443)/2)+'px'
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
                        var outMe = H.dialog;
                        getResult('api/lottery/award', {
                            oi: openid,
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            rn: outMe.name ? encodeURIComponent(outMe.name) : "",
                            ph: outMe.mobile ? outMe.mobile : "",
                            ad: outMe.address ? encodeURIComponent(outMe.address) : ""
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
                   /* $("#link-dialog").find(".award-keyTips").html(data.pn || '');*/
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-link" id="link-dialog">')
                    ._('<section class="dialog link-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            /*._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<p class="award-keyTips"></p>')*/
                            ._('<img class="award-img" src="">')
                            ._('<section class="btn-lottery-box">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-link-use" id="btn-linkLottery-use" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-use" data-collect-desc="弹层(外链)-立即领取按钮">领 取</a>')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-link-lottery-close none" id="btn-linkLottery-close" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-close" data-collect-desc="弹层(外链)-继续摇奖按钮">继续摇奖</a>')
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
                        'height': "388px",
                        'left': Math.round((width-280)/2)+'px',
                        'top': Math.round((height-388)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "320px",
                        'height': "443px",
                        'left': Math.round((width-320)/2)+'px',
                        'top': Math.round((height-443)/2)+'px'
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
                    var outMe = H.dialog;
                    getResult('api/lottery/award', {
                        oi: openid,
                        nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        hi: headimgurl ? headimgurl : "",
                        rn: outMe.name ? encodeURIComponent(outMe.name) : "",
                        ph: outMe.mobile ? outMe.mobile : "",
                        ad: outMe.address ? encodeURIComponent(outMe.address) : ""
                    }, 'callbackLotteryAwardHandler');
                    me.close();
                    showTips('领取成功');
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
                        $("#dhm-dialog").find(".cc").html("<label>兑奖码 </label><span>"+ data.cc +"</span>").removeClass("none");
                    }

                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-link" id="dhm-dialog">')
                    ._('<section class="dialog dhm-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-dhm-btn-close" data-collect-desc="弹层(兑换码)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            /*._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')*/
                            /*._('<p class="award-keyTips"></p>')*/
                            ._('<img class="award-img" src="">')
                            ._('<div class="cc none"></div>')
                            ._('<section class="btn-lottery-box">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-link-use before" id="btn-djmLottery-use" data-collect="true" data-collect-flag="dialog-dhm-btn-linkLottery-use" data-collect-desc="弹层(兑奖码)-立即领取按钮">我已截图</a>')
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
                        'width': "280px",
                        'height': "388px",
                        'left': Math.round((width-280)/2)+'px',
                        'top': Math.round((height-388)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "320px",
                        'height': "444px",
                        'left': Math.round((width-320)/2)+'px',
                        'top': Math.round((height-444)/2)+'px'
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
                    if(!$('#btn-wxcardLottery-award').hasClass("flag")){
                        $('#btn-wxcardLottery-award').addClass("flag");
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
                        var outMe = H.dialog;
                        getResult('api/lottery/award', {
                            oi: openid,
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            rn: outMe.name ? encodeURIComponent(outMe.name) : "",
                            ph: outMe.mobile ? outMe.mobile : "",
                            ad: outMe.address ? encodeURIComponent(outMe.address) : ""
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
                    /*$("#wxcard-dialog").find('.award-keyTips').html(data.pn || '');*/
                    me.ci = data.ci;
                    me.ts = data.ts;
                    me.si = data.si;
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-wxcard" id="wxcard-dialog">')
                    ._('<section class="dialog wxcard-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-wxcard-btn-close" data-collect-desc="弹层(卡券)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            /*._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<p class="award-keyTips"></p>')*/
                            ._('<img class="award-img" src="">')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">领 取</a>')
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
                        'height': "244px",
                        'left': Math.round((width-280)/2)+'px',
                        'top': Math.round((height-244)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "312px",
                        'height': "272px",
                        'left': Math.round((width-312)/2)+'px',
                        'top': Math.round((height-272)/2)+'px'
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
                        ._('<section class="dialog-content">')
                            ._('<h2 class="tlt">太遗憾啦，没有中奖~</h2>')
                            ._('<img class="icon-thanks" src="'+ me.randomSrc +'">')
                            ._('<h3 class="tlt">长按二维码识别图中二维码<br/>更多精彩敬请关注武林风官方微信</h3>')
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

    W.callbackUserInfoHandler = function(data) {
        if(data.result == true){
            $("#name").val(data.rn || "");
            $("#phone").val(data.ph || "");
            $("#address").val(data.ad || "");
        }
    };

})(Zepto);

$(function() {
    H.dialog.init();
});