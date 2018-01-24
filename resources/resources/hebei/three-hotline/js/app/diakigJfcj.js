(function($) {
    H.dialog = {
        $container: $('body'),
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
            this.$dialog.find('.dialog').addClass('bounceInDown');
            setTimeout(function(){
                me.$dialog.find('.dialog').removeClass('bounceInDown');
            }, 1000);
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
            },200);
        },
        swLottery: {
            $dialog: null,
            AWARDED_CLS: 'lottery-awarded',
            open: function(data) {
                var me = this, $dialog = this.$dialog;
                H.dialog.open.call(this);
                this.pre_dom();
                this.update(data);
                if (!$dialog) {
                    this.event();
                }
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                $(".dialog").css({
                    'width': "285px",
                    'height': "400px",
                    'left': Math.round((width-285)/2)+'px',
                    'top': Math.round((height-400)/2)+'px'
                });
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    $('#btn-lottery').animate({'-webkit-transform': 'rotate(360deg)'}, 300);
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 800);
            },
            event: function() {
                var me = this;
                $('.btn-qd').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                $('.btn-close').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                this.$dialog.find('.btn-award').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    if (me.check()) {
                        if(!$(this).hasClass("flag")){
                            $(this).text("领取中");
                            $(this).addClass("flag");

                            var mobile = $.trim(me.$dialog.find('.mobile').val()),
                                name = $.trim(me.$dialog.find('.name').val()),
                                address = $.trim(me.$dialog.find('.address').val());

                            getResult('api/lottery/award', {
                                oi: openid,
                                rn: encodeURIComponent(name),
                                ph: mobile,
                                ad: encodeURIComponent(address)
                            }, 'callbackLotteryAwardHandler', true, me.$dialog);
                            me.succ();
                        }
                    }
                });
            },
            update: function(data) {
                var me = this;
                if(data){
                    if (data.result) {
                        //pt 1:实物奖品
                        // 中奖后
                        this.$dialog.find('h2.tt').text(data.tt || '');
                        this.$dialog.find('img.pi').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");

                        this.$dialog.find('.name').val(data.rn || '');
                        this.$dialog.find('.mobile').val(data.ph || '');
                        this.$dialog.find('.address').val(data.ad || '');
                        $('.rule-section img').attr('src', data.qc);
                        this.$dialog.find('.award-win').removeClass('none');
                    }
                }
            },

            check: function() {
                var me = this, $mobile = me.$dialog.find('.mobile'),
                    mobile = $.trim($mobile.val()),
                    $name = me.$dialog.find('.name'),
                    name = $.trim($name.val()),
                    $address = me.$dialog.find('.address'),
                    address = $.trim($address.val());

                if (((me.name && me.name == name) && me.mobile && me.mobile == phone)
                    && (me.address && me.address == address)) {
                    return;
                }

                if (name.length < 2 || name.length > 30) {
                    showTips('姓名长度为2~30个字符');
                    $name.focus();
                    return false;
                }
                else if (!/^\d{11}$/.test(mobile)) {
                    showTips('这手机号，可打不通哦...');
                    $mobile.focus();
                    return false;
                }
                else if(address.length < 5 || address.length > 60) {
                    showTips('地址长度为5~60个字符');
                    $address.focus();
                    return false;
                }
                return true;
            },
            // 领奖成功
            succ: function() {
                this.$dialog.find('.mobile').attr('type','text');
                var rn = "姓名：" + this.$dialog.find('.name').val(),
                    ph = "电话：" + this.$dialog.find('.mobile').val(),
                    ad = "地址：" + this.$dialog.find('.address').val();
                this.$dialog.addClass(this.AWARDED_CLS);
                this.$dialog.find('.share').removeClass('none');
                this.$dialog.find('.name').val(rn);
                this.$dialog.find('.mobile').val(ph);
                this.$dialog.find('.address').val(ad);
                this.$dialog.find('input').attr('disabled', 'disabled').addClass('disabled');
                this.$dialog.find('.award-tip').text('提交成功，以下是您的联系方式。');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                        ._('<h2 class="tt"></h2>')
                        ._('<div class="dialog-inner">')
                            ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
                            ._('<div class="content">')
                                ._('<div class="back">')

                                    ._('<div class="award-win none">')
                                        ._('<img class="pi" src="" />')
                                        ._('<div class="contact">')
                                            ._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
                                            ._('<p><input type="text" class="name" placeholder="姓名" /></p>')
                                            ._('<p><input type="tel" class="mobile" placeholder="电话" /></p>')
                                            ._('<p><input type="text" class="address" maxlength="18" placeholder="地址" /></p>')
                                            ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">提 交</a>')
                                            ._('<a href="#" class="btn btn-share btn-qd" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-back-btn" data-collect-desc="抽奖弹层-返回按钮">返 回</a>')
                                        ._('</div>')
                                    ._('</div>')

                                ._('</div>')
                            ._('</div>')
                        ._('</div>')
                    ._('</div>')
                ._('</section>');

                return t.toString();
            }
        },
        jfLottery: {
            $dialog: null,
            AWARDED_CLS: 'lottery-awarded',
            open: function(data) {
                var me = this, $dialog = this.$dialog;
                H.dialog.open.call(this);
                this.pre_dom();
                this.update(data);
                if (!$dialog) {
                    this.event();
                }
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                $(".dialog").css({
                    'width': "285px",
                    'height': "300px",
                    'left': Math.round((width-285)/2)+'px',
                    'top': Math.round((height-300)/2)+'px'
                });
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    $('#btn-lottery').animate({'-webkit-transform': 'rotate(360deg)'}, 300);
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 800);
            },
            event: function() {
                var me = this;
                $('.btn-qd').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                $('.btn-close').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                this.$dialog.find('.btn-award').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));

                    if(!$(this).hasClass("flag")){
                        $(this).addClass("flag");

                        getResult('api/lottery/award', {
                            oi: openid
                        }, 'callbackLotteryAwardHandler', true, me.$dialog);
                        me.close();
                    }
                });
            },
            update: function(data) {
                var me = this;
                me.pt = data.pt;
                if(data){
                    if (data.result) {
                        //pt : 2:积分奖品
                        // 中奖后
                        this.$dialog.find('h2.tt').text(data.tt || '');
                        this.$dialog.find('img.pi').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
                        this.$dialog.find('.award-win').removeClass('none');
                    }
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                        ._('<h2 class="tt"></h2>')
                        ._('<div class="dialog-inner">')
                            ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
                            ._('<div class="content">')
                                ._('<div class="back">')

                                ._('<div class="award-win none">')
                                    ._('<img class="pi" src="" />')
                                    ._('<div class="contact">')
                                        ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">确 定</a>')
                                    ._('</div>')
                                ._('</div>')

                                ._('</div>')
                            ._('</div>')
                        ._('</div>')
                    ._('</div>')
                ._('</section>');

                return t.toString();
            }
        },
        wlLottery: {
            $dialog: null,
            AWARDED_CLS: 'lottery-awarded',
            url:null,
            open: function(data) {
                var me = this, $dialog = this.$dialog;
                H.dialog.open.call(this);
                this.pre_dom();
                this.update(data);
                if (!$dialog) {
                    this.event();
                }
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                $(".dialog").css({
                    'width': "285px",
                    'height': "300px",
                    'left': Math.round((width-285)/2)+'px',
                    'top': Math.round((height-300)/2)+'px'
                });
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    $('#btn-lottery').animate({'-webkit-transform': 'rotate(360deg)'}, 300);
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 800);
            },
            event: function() {
                var me = this;
                $('.btn-qd').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                $('.btn-close').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                this.$dialog.find('.btn-award').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));

                    if(!$(this).hasClass("flag")){
                        $(this).addClass("flag");

                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                        location.href = me.url;
                    }
                });
            },
            update: function(data) {
                var me = this;
                me.pt = data.pt;
                if(data){
                    if (data.result) {
                        //pt : 9:外链领取奖品）
                        // 中奖后
                        this.$dialog.find('h2.tt').text(data.tt || '');
                        this.$dialog.find('img.pi').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");

                        me.url = data.ru;
                        this.$dialog.find('.award-card').removeClass('none');
                    }
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                        ._('<h2 class="tt"></h2>')
                        ._('<div class="dialog-inner">')
                            ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
                            ._('<div class="content">')
                                ._('<div class="back">')

                                ._('<div class="award-card none">')
                                    ._('<img class="pi" src="" />')
                                    ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-know-btn" data-collect-desc="抽奖弹层-我知道了按钮">领 取</a>')
                                ._('</div>')

                                ._('</div>')
                            ._('</div>')
                        ._('</div>')
                    ._('</div>')
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