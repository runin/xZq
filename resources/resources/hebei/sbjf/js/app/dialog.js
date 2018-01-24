(function($) {
	H.dialog = {
		$container: $('body'),
        uid: '',
        wa: '',
		init: function() {
            getResult('api/comments/topic/round', {}, 'callbackCommentsTopicInfo');
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
                if(W.screen.height === 480){
                    $(".dialog").css({
                        'width': "230px",
                        'height': "377px",
                        'left': Math.round((width-230)/2)+'px',
                        'top': Math.round((height-377)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "270px",
                        'height': "443px",
                        'left': Math.round((width-270)/2)+'px',
                        'top': Math.round((height-443)/2)+'px'
                    });
                }

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
                        ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="index-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                        ._('<img class="rule-t" src="images/rule-t.png">')
                        ._('<div class="content border">')
							._('<div class="rule none"></div>')
						._('</div>')
                        //._('<a href="#" class="btn rule-colse animated" data-collect="true" data-collect-flag="fj-ydsBzq-closebtn" data-collect-desc="规则弹层-关闭按钮">确 定</a>')
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
                H.yao.canJump = false;
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
                    H.yao.isCanShake = true;
                    H.yao.canJump = true;
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
                    H.yao.isCanShake = false;
                    if(!$(this).hasClass("flag")){
                        $(this).addClass("flag");
                        shownewLoading();
                        me.close();
                        me.sto = setTimeout(function(){
                            H.yao.isCanShake = true;
                            hidenewLoading();
                        },15000);
                        $(this).text("领取中");
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
                        H.yao.isCanShake = true;
                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        recordUserOperate(openid, res.errMsg, "cctv7-world-card-fail");
                        H.yao.isCanShake = true;
                        hidenewLoading();
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        H.yao.isCanShake = true;
                        hidenewLoading();
                    },
                    cancel:function(){
                        H.yao.isCanShake = true;
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
                        this.$dialog.find('.award-win').removeClass('none');
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
                        ._('<h2 class="tt"></h2>')
                        ._('<div class="dialog-inner">')
                            ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
                            ._('<div class="content">')
                                ._('<div class="back">')

                                    ._('<div class="award-win none">')
                                        ._('<img class="pi" src="" />')
                                        ._('<div class="contact">')
                                            ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">提 交</a>')
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
                H.yao.canJump = false;
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
                    H.yao.isCanShake = true;
                    H.yao.canJump = true;
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
                            H.yao.isCanShake = false;

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
        redLottery: {
            $dialog: null,
            AWARDED_CLS: 'lottery-awarded',
            url:null,
            open: function(data) {
                H.yao.canJump = false;
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
                if(W.screen.height === 480){
                    $(".dialog").css({
                        'width': "280px",
                        'height': "407px",
                        'left': Math.round((width-280)/2)+'px',
                        'top': Math.round((height-407)/2)+'px'
                    });
                }else {
                    $(".dialog").css({
                        'width': "295px",
                        'height': "429px",
                        'left': Math.round((width-295)/2)+'px',
                        'top': Math.round((height-429)/2)+'px'
                    });
                }
                $("#ll-lottery-dialog").addClass("none");
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    H.yao.isCanShake = true;
                    H.yao.canJump = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 800);
            },
            event: function() {
                var me = this;
                $('.btn-qd').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    H.dialog.llLottery.close();
                    me.close();
                });
                this.$dialog.find('.btn-award').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));

                    if(!$(this).hasClass("flag")){
                        $(this).addClass("flag");
                        H.yao.isCanShake = false;

                        location.href = me.url;
                    }
                });
            },
            update: function(data) {
                var me = this;
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
                t._('<section class="modal" id="red-dialog">')
                    ._('<div class="dialog red-dialog">')
                        ._('<div class="award-card none">')
                            ._('<h2 class="tt"></h2>')
                            ._('<img class="pi" src="" />')
                            ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="yao-reddialog-btn-award" data-collect-desc="红包抽奖弹层-领取按钮">领 取</a>')
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
                H.yao.canJump = false;
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
                if(W.screen.height === 480){
                    $(".jf-dialog").css({
                        'width': "249px",
                        'height': "385px",
                        'left': Math.round((width-249)/2)+'px',
                        'top': Math.round((height-385)/2)+'px'
                    });
                }else {
                    $(".jf-dialog").css({
                        'width': "295px",
                        'height': "457px",
                        'left': Math.round((width-295)/2)+'px',
                        'top': Math.round((height-457)/2)+'px'
                    });
                }
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    H.yao.isCanShake = true;
                    H.yao.canJump = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 800);
            },
            event: function() {
                var me = this;
                $('.btn-qd').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    H.dialog.jfErCode.open();
                    H.dialog.jfLottery.pre_dom();
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
                            H.yao.isCanShake = false;

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
                        //this.$dialog.find('h2.tt').text(data.tt || '');
                        this.$dialog.find('img.pi').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");

                        this.$dialog.find('.name').val(data.rn || '');
                        this.$dialog.find('.mobile').val(data.ph || '');
                        this.$dialog.find('.address').val(data.ad || '');
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
                var rn = this.$dialog.find('.name').val(),
                    ph = this.$dialog.find('.mobile').val(),
                    ad = this.$dialog.find('.address').val();
                this.$dialog.addClass(this.AWARDED_CLS);
                this.$dialog.find('.name').val(rn);
                this.$dialog.find('.mobile').val(ph);
                this.$dialog.find('.address').val(ad);
                this.$dialog.find('input').attr('disabled', 'disabled').addClass('disabled');
                //this.$dialog.find('.award-tip').text('提交成功，以下是您的联系方式。');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog jf-dialog">')
                        //._('<h2 class="tt"></h2>')
                        ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yao-jfdialog-closebtn" data-collect-desc="积分抽奖弹层-关闭按钮"></a>')

                        ._('<div class="dialog-inner">')

                            ._('<div class="content">')
                                ._('<div class="back">')
                                    ._('<img class="jf-top" src="images/jf-top.png" />')
                                    ._('<div class="award-win none">')
                                        ._('<img class="pi" src="" />')

                                        ._('<div class="contact">')
                                            //._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
                                            ._('<p><label>姓名:</label><input type="text" class="name"/></p>')
                                            ._('<p><label>电话:</label><input type="tel" class="mobile" /></p>')
                                            ._('<p><label>地址:</label><input type="text" class="address" /></p>')
                                            ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="yao-jfdialog-combtn" data-collect-desc="积分抽奖弹层-提交按钮"><img class="tj" src="images/tj.png"></a>')
                                            ._('<a href="#" class="btn btn-share btn-qd" data-collect="true" data-collect-flag="yao-jfdialog-qd-btn" data-collect-desc="积分抽奖弹层-打开关注二维码按钮"><img class="confirm" src="images/confirm.png"></a>')
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
        jfErCode: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();
                this.pre_dom();
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                $(".er-dialog").css({
                    'width': "295px",
                    'height': "230px",
                    'left': Math.round((width-295)/2)+'px',
                    'top': Math.round((height-230)/2)+'px'
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
                    H.dialog.jfLottery.close();
                    me.close();
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal">')
                    ._('<div class="dialog er-dialog">')
                        ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yao-er-closebtn" data-collect-desc="二维码弹层-关闭按钮"></a>')
                        ._('<img class="rule-t" src="images/er.png">')
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
                H.yao.canJump = false;
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
                if(W.screen.height === 480){
                    $(".dialog").css({
                        'width': "249px",
                        'height': "385px",
                        'left': Math.round((width-249)/2)+'px',
                        'top': Math.round((height-385)/2)+'px'
                    });
                }else {
                    $(".dialog").css({
                        'width': "295px",
                        'height': "457px",
                        'left': Math.round((width-295)/2)+'px',
                        'top': Math.round((height-457)/2)+'px'
                    });
                }
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    H.yao.isCanShake = true;
                    H.yao.canJump = true;
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
                        H.yao.isCanShake = false;

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
                        this.$dialog.find('h3.tt').text(data.tt || '');
                        this.$dialog.find('img.pi').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");

                        me.url = data.ru;
                        this.$dialog.find('.award-card').removeClass('none');
                    }
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog jf-dialog wllottery-dialog">')
                        ._('<div class="dialog-inner">')
                            ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yao-wldialog-closebtn" data-collect-desc="外链抽奖弹层-关闭按钮"></a>')
                                ._('<img class="jf-top" src="images/jf-top.png" />')
                                ._('<div class="award-card none">')
                                    ._('<h3 class="tt"></h3>')
                                    ._('<img class="pi" src="" />')
                                    ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="yao-wldialog-award-btn" data-collect-desc="外链抽奖弹层-确定按钮"><img class="confirm" src="images/confirm.png"></a>')
                                ._('</div>')
                        ._('</div>')
                    ._('</div>')
                ._('</section>');

                return t.toString();
            }
        },
        llLottery: {
            $dialog: null,
            AWARDED_CLS: 'lottery-awarded',
            open: function(data) {
                H.yao.canJump = false;
                var me = this, $dialog = this.$dialog;
                H.dialog.open.call(this);
                this.pre_dom();
                H.answer.init();
                if (!$dialog) {
                    var event = this.event();
                }
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                $(".dialog").css({
                    'width': "295px",
                    'height': "339px",
                    'left': Math.round((width-295)/2)+'px',
                    'top': Math.round((height-339)/2)+'px'
                });
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    H.yao.isCanShake = true;
                    H.yao.canJump = true;
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
                        H.yao.isCanShake = false;

                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                    }
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="ll-lottery-dialog">')
                    ._('<div class="dialog ll-dialog">')
                        ._('<div class="dialog-inner">')
                            ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yao-lldialog-closebtn" data-collect-desc="答题卡抽奖弹层-关闭按钮"></a>')
                            ._('<img class="dt-t" src="images/dt-t.png">')
                            ._('<div class="content">')

                                ._('<dl class="question"></dl>')

                                ._('<div class="dt-btn none">')
                                    ._('<a href="#" class="btn btn-award yes" data-collect="true" data-collect-flag="yao-lldialog-yes" data-collect-desc="答题卡抽奖弹层-是按钮"><img src="images/yes.png" /></a>')
                                    ._('<a href="#" class="btn btn-award no" data-collect="true" data-collect-flag="yao-lldialog-no" data-collect-desc="答题卡抽奖弹层-否按钮"></a>')
                                ._('</div>')
                            ._('</div>')
                        ._('</div>')
                    ._('</div>')
                ._('</section>');

                return t.toString();
            }
        },
        error: {
            $dialog: null,
            open: function(data) {
                H.yao.canJump = false;
                H.dialog.open.call(this);

                this.event();
                this.pre_dom();
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                $(".dialog").css({
                    'width': "295px",
                    'height': "339px",
                    'left': Math.round((width-295)/2)+'px',
                    'top': Math.round((height-339)/2)+'px'
                });
                $("#ll-lottery-dialog").addClass("none");
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    H.yao.canJump = true;
                    H.yao.isCanShake = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 800);
            },
            event: function(){
                var me = this;
                $('.btn-close').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    H.dialog.llLottery.close();
                    me.close();
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-thanks" id="thanks-dialog">')
                    ._('<div class="dialog thanks-dialog">')
                        ._('<a href="#" class="btn-close animated" data-collect="true" data-collect-flag="yao--error-closebtn" data-collect-desc="答错题弹层-关闭按钮"></a>')
                        ._('<img class="error-img" src="images/error-img.png">')
                        ._('<h2>在十八酒坊官方微信回复“我要答案”<br/> 即可获得您想要的正确答案，<br/> 一般人我不告诉他！</h2>')
                    ._('</div>')
                ._('</section>');
                return t.toString();
            }
        },
        thanks: {
            $dialog: null,
            open: function(data) {
                H.yao.canJump = false;
                H.dialog.open.call(this);
                this.event(data);
                this.pre_dom();
                //this.update(data);
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                $(".dialog").css({
                    'width': "295px",
                    'height': "339px",
                    'left': Math.round((width-295)/2)+'px',
                    'top': Math.round((height-339)/2)+'px'
                });
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    H.yao.canJump = true;
                    H.yao.isCanShake = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 800);
            },
            event: function(data){
                var me = this;
                $('.close').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    me.close();
                });
                $('.btn-close').click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    if(data === 1){
                        H.dialog.llLottery.close();
                    }
                    me.close();
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-thanks" id="thanks-dialog">')
                    ._('<div class="dialog thanks-dialog">')
                        ._('<a href="#" class="btn-close animated" data-collect="true" data-collect-flag="yao-thanks-closebtn" data-collect-desc="谢谢参与弹层-关闭按钮"></a>')
                        ._('<img src="images/thanks.png">')
                        ._('<h2>长按图片识别二维码<br/>关注十八酒坊官方账号</h2>')
                    ._('</div>')
                ._('</section>');
                return t.toString();
            },
            update: function(data) {
                if(data && data.pi){
                    $('.thanks-dialog img').attr('src',data.pi || "./images/thanks.png");
                }
            }
        },
        // 积分排行榜
        rank: {
            $dialog: null,
            open: function() {
                H.yao.isCanShake = false;
                H.dialog.open.call(this);
                this.pre_dom();
                this.event();
                $('.dialog').removeClass('bounceOutUp');
                setTimeout(function(){
                    $('.dialog').removeClass('none').addClass('bounceInDown');
                },300);
                getResult('api/lottery/integral/rank/self', {
                    oi: openid,
                    pu: H.dialog.uid
                }, 'callbackIntegralRankSelfRoundHandler', true);
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                if(W.screen.height === 480){
                    $(".dialog").css({
                        'width': "230px",
                        'height': "377px",
                        'left': Math.round((width-230)/2)+'px',
                        'top': Math.round((height-377)/2)+'px'
                    });
                }else{
                    $(".dialog").css({
                        'width': "270px",
                        'height': "443px",
                        'left': Math.round((width-270)/2)+'px',
                        'top': Math.round((height-443)/2)+'px'
                    });
                }
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                setTimeout(function(){
                    H.yao.isCanShake = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 800);
            },
            event: function() {
                var me = this;
                 this.$dialog.find('.btn-close').click(function(e) {
                 e.preventDefault();
                 H.dialog.btn_animate($(this));
                 me.close();
                 });

            },
            selfupdate: function(data) {
                this.$dialog.find('.jf').text(data.in || 0);
                this.$dialog.find('.pm').text(data.rk || '暂无排名');

                getResult('api/lottery/integral/rank/top10', {
                    pu: H.dialog.uid
                }, 'callbackIntegralRankTop10RoundHandler', true, this.$dialog);
            },
            update: function(data) {
                var t = simpleTpl(),
                    items = data.top10 || [],
                    len = items.length;

                for (var i = 0; i < len; i ++) {
                    t._('<li>')
                        ._('<span class="r-avatar"><img src="'+ (items[i].hi ? (items[i].hi + '/' + 0) : './images/avatar.png') +'" /></span>')
                        ._('<span class="r-nn">'+ (items[i].nn || '匿名用户') +'</span>')
                        ._('<span class="r-rank"><span class="jf-num"><img src="images/money.png"></span>'+ (items[i].in || ' ') +'</span>')
                        ._('<span class="r-name">第<span class="jf-num">'+ (items[i].rk || '-') +'</span>名</span>')
                    ._('</li>');
                }
                this.$dialog.find('ul').html(t.toString());
            },

            tpl: function() {
                var t = simpleTpl();

                t._('<section class="modal" id="rank-dialog">')
                    ._('<div class="dialog rank-dialog animated none">')
                        ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yao-rank-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
                        ._('<div class="rank-top">')
                            ._('<img src="images/rank-t.png" />')
                            ._('<label class="infor">积分排行顶部文案</label>')
                            ._('<h3>我的积分：<span class="jf"></span> 排名：<span class="pm"></span></h3>')
                        ._('</div>')
                        ._('<div class="list border">')
                            ._('<div class="content">')
                                ._('<ul></ul>')
                            ._('</div>')
                        ._('</div>')
                    ._('</div>')
                ._('</section>');
                return t.toString();
            }
        }
	};

	W.commonApiRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};

    W.callbackLotteryAwardHandler = function(data) {};

    W.callbackCommentsTopicInfo = function(data){
        if(data.code == 0){
            H.dialog.uid = data.items[0].uid;
            H.dialog.wa = data.items[0].t;
        }
    };

    W.callbackIntegralRankTop10RoundHandler = function(data) {
        if (data.result) {
            H.dialog.rank.update(data);
        }
    };

    W.callbackIntegralRankSelfRoundHandler = function(data) {
        if (data.result) {
            H.dialog.rank.selfupdate(data);
            $(".infor").text(H.dialog.wa);
        }
    };
})(Zepto);

$(function() {
	H.dialog.init();
});