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
		rule: {
			$dialog: null,
            ruleData: "",
			open: function() {
				H.dialog.open.call(this);
				this.event();
                if(this.ruleData){
                    this.$dialog.find('.rule').html(this.ruleData).removeClass('none');
                }else{
                    getResult('api/common/rule', {}, 'commonApiRuleHandler', true, this.$dialog);
                }
                this.pre_dom();
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                $(".dialog").css({
                    'width': "260px",
                    'height': "315px",
                    'left': Math.round((width-260)/2)+'px',
                    'top': Math.round((height-315)/2)+'px'
                });
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 800);
            },
            event: function(){
                var me = this;
                $('.btn-close').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                $('.rule-colse').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
            },
			update: function(rule) {
                var me = H.dialog.rule;
                this.$dialog.find('.rule').html(rule).removeClass('none');
                me.ruleData = rule;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
                        ._('<a href="#" class="btn-close animated" data-collect="true" data-collect-flag="closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<div class="content border">')
							._('<div class="rule none"></div>')
						._('</div>')
                        //._('<a href="#" class="btn rule-colse animated" data-collect="true" data-collect-flag="closebtn" data-collect-desc="规则弹层-关闭按钮">确 定</a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
        kjLottery: {
            $dialog: null,
            AWARDED_CLS: 'lottery-awarded',
            ci:null,
            ts:null,
            si:null,
            url:null,
            sto:null,
            open: function(data) {
                //H.index.canJump = false;
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
                if(480 == window.screen.height  && window.screen.width == 320){
                    $(".dialog").css({
                        'width': "275px",
                        'height': "380px",
                        'left': Math.round((width-275)/2)+'px',
                        'top': Math.round((height-380)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "275px",
                        'height': "460px",
                        'left': Math.round((width-275)/2)+'px',
                        'top': Math.round((height-460)/2)+'px'
                    });
                }
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    H.index.isCanShake = true;
                    //H.index.canJump = true;
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
                    H.index.isCanShake = false;
                    if(!$(this).hasClass("flag")){
                        $(this).addClass("flag");
                        shownewLoading();
                        me.close();
                        me.sto = setTimeout(function(){
                            H.index.isCanShake = true;
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
                //卡券
                wx.addCard({
                    cardList: [{
                        cardId: me.ci,
                        cardExt: "{\"timestamp\":\""+ me.ts +"\",\"signature\":\""+ me.si +"\"}"
                    }],
                    success: function (res) {
                        H.index.isCanShake = true;
                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        recordUserOperate(openid, res.errMsg, "cctv7-world-card-fail");
                        H.index.isCanShake = true;
                        hidenewLoading();
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        H.index.isCanShake = true;
                        hidenewLoading();
                    },
                    cancel:function(){
                        H.index.isCanShake = true;
                        hidenewLoading();
                    }
                });
            },
            update: function(data) {
                var me = this;
                if(data){
                    if (data.result) {
                        //pt 7:卡劵奖品
                        // 中奖后
                        this.$dialog.find('h2.tt').text(data.tt || '');
                        this.$dialog.find('img.pi').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
                        this.$dialog.find('.award-card').removeClass('none');
                        me.ci = data.ci;
                        me.ts = data.ts;
                        me.si = data.si;
                    }
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lotterydialog-closebtn" data-collect-desc="卡劵奖品弹层-关闭按钮"></a>')
                        ._('<div class="dialog-inner">')
                            ._('<div class="content">')
                                ._('<div class="back">')

                                    ._('<div class="award-card none">')
                                        ._('<img class="pi" src="" />')
                                        ._('<h2 class="tt"></h2>')
                                        ._('<div class="contact">')
                                            ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="lotterydialog-combtn" data-collect-desc="卡劵奖品弹层-确认按钮">提 交</a>')
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
        swLottery: {
            $dialog: null,
            AWARDED_CLS: 'lottery-awarded',
            open: function(data) {
                //H.index.canJump = false;
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
                if(480 == window.screen.height  && window.screen.width == 320){
                    $(".dialog").css({
                        'width': "275px",
                        'height': "380px",
                        'left': Math.round((width-275)/2)+'px',
                        'top': Math.round((height-380)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "275px",
                        'height': "460px",
                        'left': Math.round((width-275)/2)+'px',
                        'top': Math.round((height-460)/2)+'px'
                    });
                }

            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    H.index.isCanShake = true;
                    //H.index.canJump = true;
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
                            $(this).addClass("flag");
                            H.index.isCanShake = false;

                            var mobile = $.trim(me.$dialog.find('.mobile').val()),
                                name = $.trim(me.$dialog.find('.name').val());

                            getResult('api/lottery/award', {
                                oi: openid,
                                rn: encodeURIComponent(name),
                                ph: mobile
                            }, 'callbackLotteryAwardHandler', true, me.$dialog);
                            //me.succ();
                            showTips("提交成功");
                            me.close();
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
                        this.$dialog.find('.award-win').removeClass('none');
                    }
                }
            },

            check: function() {
                var me = this, $mobile = me.$dialog.find('.mobile'),
                    mobile = $.trim($mobile.val()),
                    $name = me.$dialog.find('.name'),
                    name = $.trim($name.val());

                if (((me.name && me.name == name) && me.mobile && me.mobile == phone)) {
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
                return true;
            },
            // 领奖成功
            succ: function() {
                var rn = this.$dialog.find('.name').val(),
                    ph = this.$dialog.find('.mobile').val();
                this.$dialog.addClass(this.AWARDED_CLS);
                this.$dialog.find('.share').removeClass('none');
                this.$dialog.find('.name').val(rn);
                this.$dialog.find('.mobile').val(ph);
                this.$dialog.find('input').attr('disabled', 'disabled').addClass('disabled');
                this.$dialog.find('.award-tip').text('提交成功，以下是您的联系方式。');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                        ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lotterydialog-closebtn" data-collect-desc="实物奖品弹层-关闭按钮"></a>')
                        ._('<div class="dialog-inner">')

                            ._('<div class="content">')
                                ._('<div class="back">')

                                    ._('<div class="award-win none">')
                                        ._('<img class="pi" src="" />')
                                        ._('<h2 class="tt"></h2>')
                                        ._('<div class="contact">')
                                            //._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
                                            ._('<p><label>姓名</label><input type="text" class="name"/></p>')
                                            ._('<p><label>电话</label><input type="tel" class="mobile"/></p>')
                                            ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="lotterydialog-combtn" data-collect-desc="实物奖品弹层-确认按钮">提交信息</a>')
                                            //._('<a href="#" class="btn btn-share btn-qd" data-collect="true" data-collect-flag="lotterydialog-back-btn" data-collect-desc="抽奖弹层-返回按钮">返 回</a>')
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
        redLottery: {
            $dialog: null,
            AWARDED_CLS: 'lottery-awarded',
            url:null,
            open: function(data) {
                //H.index.canJump = false;
                var me = this, $dialog = this.$dialog;
                H.dialog.open.call(this);
                this.pre_dom();
                this.update(data);
                if (!$dialog) {
                    var event = this.event();
                }
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                if(480 == window.screen.height  && window.screen.width == 320){
                    $(".dialog").css({
                        'width': "275px",
                        'height': "380px",
                        'left': Math.round((width-275)/2)+'px',
                        'top': Math.round((height-380)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "275px",
                        'height': "460px",
                        'left': Math.round((width-275)/2)+'px',
                        'top': Math.round((height-460)/2)+'px'
                    });
                }
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    H.index.isCanShake = true;
                    //H.index.canJump = true;
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
                        H.index.isCanShake = false;

                        location.href = me.url;
                    }
                });
            },
            update: function(data) {
                var me = this;
                me.pt = data.pt;
                if(data){
                    if (data.result) {
                        //pt : 4:红包领取奖品）
                        // 中奖后
                        this.$dialog.find('h2.tt').text(data.tt || '');
                        this.$dialog.find('img.pi').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");

                        me.url = data.rp;
                        this.$dialog.find('.award-card').removeClass('none');
                    }
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                        ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lotterydialog-closebtn" data-collect-desc="红包奖品弹层-关闭按钮"></a>')
                        ._('<div class="dialog-inner">')

                            ._('<div class="content">')
                                ._('<div class="back">')

                                    ._('<div class="award-card none">')
                                        ._('<img class="pi" src="" />')
                                        ._('<h2 class="tt"></h2>')
                                        ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="lotterydialog-know-btn" data-collect-desc="红包奖品-领取按钮">领 取</a>')
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
                //H.index.canJump = false;
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
                    H.index.isCanShake = true;
                    //H.index.canJump = true;
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
                        H.index.isCanShake = false;

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
                            ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lotterydialog-closebtn" data-collect-desc="积分奖品弹层-关闭按钮"></a>')
                            ._('<div class="content">')
                                ._('<div class="back">')

                                    ._('<div class="award-win none">')
                                        ._('<img class="pi" src="" />')
                                        ._('<div class="contact">')
                                            ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="lotterydialog-combtn" data-collect-desc="积分奖品弹层-确认按钮">确 定</a>')
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
                //H.index.canJump = false;
                var me = this, $dialog = this.$dialog;
                H.dialog.open.call(this);
                this.pre_dom();
                this.update(data);
                if (!$dialog) {
                    var event = this.event();
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
                    H.index.isCanShake = true;
                    //H.index.canJump = true;
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
                        H.index.isCanShake = false;

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
                            ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lotterydialog-closebtn" data-collect-desc="外链奖品弹层-关闭按钮"></a>')
                            ._('<div class="content">')
                                ._('<div class="back">')

                                    ._('<div class="award-card none">')
                                        ._('<img class="pi" src="" />')
                                        ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="lotterydialog-know-btn" data-collect-desc="外链奖品弹层-我知道了按钮">领 取</a>')
                                    ._('</div>')

                                ._('</div>')
                            ._('</div>')
                        ._('</div>')
                    ._('</div>')
                ._('</section>');

                return t.toString();
            }
        },
        thanks: {
            $dialog: null,
            open: function(data) {
                //H.index.canJump = false;
                H.dialog.open.call(this);
                this.event();
                this.pre_dom();
                this.update(data);
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                $(".dialog").css({
                    'width': "260px",
                    'height': "315px",
                    'left': Math.round((width-260)/2)+'px',
                    'top': Math.round((height-315)/2)+'px'
                });
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    //H.index.canJump = true;
                    H.index.isCanShake = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 800);
            },
            event: function(){
                var me = this;
                $('.close').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                $('.btn-close').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-thanks" id="thanks-dialog">')
                    ._('<div class="dialog thanks-dialog">')
                        ._('<a href="#" class="btn-close animated" data-collect="true" data-collect-flag="closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                        ._('<img src="">')
                        ._('<a href="#" class="btn animated close" data-collect="true" data-collect-flag="thanksdialog-know-btn" data-collect-desc="抽奖弹层-领取">再试一试</a>')
                    ._('</div>')
                ._('</section>');
                return t.toString();
            },
            update: function(data) {
                if(data && data.pi){
                    $('.thanks-dialog img').attr('src',data.pi || "./images/thanks.png");
                }
            }
        }
	};

	W.commonApiRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};

    W.callbackLotteryAwardHandler = function(data) {};
})(Zepto);

$(function() {
	H.dialog.init();
});