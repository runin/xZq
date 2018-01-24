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
			open: function() {
				H.dialog.open.call(this);
				this.event();
				getResult('api/common/rule', {}, 'commonApiRuleHandler', true, this.$dialog);
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
				this.$dialog.find('.rule').html(rule).removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
                        ._('<a href="#" class="btn-close animated" data-collect="true" data-collect-flag="fj-ydsBzq-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<img src="images/rule-hr.png">')
						._('<div class="content border">')
							._('<div class="rule none"></div>')
						._('</div>')
                        ._('<img class="rule-bottom" src="images/rule-hr.png">')
                        ._('<a href="#" class="btn rule-colse animated" data-collect="true" data-collect-flag="fj-ydsBzq-closebtn" data-collect-desc="规则弹层-关闭按钮">确 定</a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
        lottery: {
            $dialog: null,
            AWARDED_CLS: 'lottery-awarded',
            redpack: '',
            isSbtRed: false,
            ci:null,
            ts:null,
            si:null,
            pt:null,
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
                    'height': "350px",
                    'left': Math.round((width-285)/2)+'px',
                    'top': Math.round((height-350)/2)+'px'
                });
            },
            card_fail: function(){
                shownewLoading();
                me.sto = setTimeout(function(){
                    H.yao.isCanShake = true;
                    hidenewLoading();
                },15000);
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
                this.$dialog.find('.btn-lq').click(function(e){
                    e.preventDefault();
                    if(me.isSbtRed){
                        return;
                    }
                    me.isSbtRed = true;
                    toUrl(me.redpack);
                });
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

                    if(!$('#btn-award').hasClass("flag")){
                        $('#btn-award').text("领取中");
                        $('#btn-award').addClass("flag");
                        H.yao.isCanShake = false;
                        if(me.pt == 7){
                            this.card_fail();
                            //H.yao.wxCheck = false;
                            setTimeout(function(){
                                me.wx_card();
                            },1000);
                        }else if(me.pt == 9){
                            getResult('api/lottery/award', {
                                oi: openid,
                                hi: headimgurl,
                                nn: nickname
                            }, 'callbackLotteryAwardHandler');
                            location.href = me.url;
                        }else if(me.pt == 1){
                            if (!me.check()) {
                                return false;
                            }
                            var mobile = $.trim(me.$dialog.find('.mobile').val()),
                                name = $.trim(me.$dialog.find('.name').val()),
                                address = $.trim(me.$dialog.find('.address').val());

                            getResult('api/lottery/award', {
                                oi: openid,
                                rn: encodeURIComponent(name),
                                ph: mobile,
                                ad: encodeURIComponent(address)
                            }, 'callbackLotteryAwardHandler', true, me.$dialog);
                            H.dialog.lottery.succ();
                        }
                    }
                });
            },
            wx_card:function(){
                var me = this;
                //卡券
                wx.addCard({
                    cardList: [{
                        cardId: H.dialog.lottery.ci,
                        cardExt: "{\"timestamp\":\""+ H.dialog.lottery.ts +"\",\"signature\":\""+ H.dialog.lottery.si +"\"}"
                    }],
                    success: function (res) {
                        H.yao.wxCheck = true;
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
                me.pt = data.pt;
                if(data){
                    if (data.result) {
                        //pt : (0:谢谢参与
                        // 1:实物奖品
                        // 4:现金红包
                        // 9:外链领取奖品）
                        // 中奖后
                        this.$dialog.find('h2.tt').text(data.tt || '');
                        this.$dialog.find('img.pi').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
                        if(data.pt == 4){
                            H.dialog.lottery.redpack = data.rp;
                            this.$dialog.find('.award-red').removeClass('none');
                            return;
                        }/*else if(data.pt == 5){// 5:兑换码奖品待定
                            this.$dialog.find('.award-code').removeClass('none');
                            return;
                        }*/else if(data.pt == 1){
                            this.$dialog.find('.name').val(data.rn || '');
                            this.$dialog.find('.mobile').val(data.ph || '');
                            this.$dialog.find('.address').val(data.ad || '');
                            $('.rule-section img').attr('src', data.qc);
                            this.$dialog.find('.award-win').removeClass('none');
                            return;
                        }else if(data.pt == 7){
                            me.ci = data.ci;
                            me.ts = data.ts;
                            me.si = data.si;
                            this.$dialog.find('.award-card').removeClass('none');
                            return;
                        }else if(data.pt == 9){
                            me.url = data.ru;
                            this.$dialog.find('.award-card').removeClass('none');
                            return;
                        }

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
                        ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
                        ._('<div class="dialog-inner">')
                            ._('<div class="content">')
                                ._('<div class="back">')

                                    ._('<div class="award-win none">')
                                        ._('<img class="pi" src="" />')
                                        ._('<h2 class="tt"></h2>')
                                        ._('<div class="contact">')
                                            ._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
                                            ._('<p><input type="text" class="name" placeholder="姓名" /></p>')
                                            ._('<p><input type="tel" class="mobile" placeholder="电话" /></p>')
                                            ._('<p><input type="text" class="address" maxlength="18" placeholder="地址" /></p>')
                                            ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">提 交</a>')
                                            ._('<a href="#" class="btn btn-share btn-qd" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-back-btn" data-collect-desc="抽奖弹层-返回按钮">返 回</a>')
                                        ._('</div>')
                                    ._('</div>')

                                    ._('<div class="award-card none">')
                                        ._('<img class="pi" src="" />')
                                        ._('<h2 class="tt"></h2>')
                                        ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-know-btn" data-collect-desc="抽奖弹层-我知道了按钮">领 取</a>')
                                    ._('</div>')

                                    ._('<div class="award-red none">')
                                        ._('<div class="lq">')
                                            ._('<img class="pi"  src="" />')
                                            ._('<h2 class="tt"></h2>')
                                            ._('<a href="#" class="btn btn-lq" data-collect="true" data-collect-flag="fj-ydsBzq-lotterydialog-know-btn" data-collect-desc="抽奖弹层-领取">领 取</a>')
                                        ._('</div>')
                                    ._('</div>')

                                    ._('<div class="award-code none">')
                                        ._('<img class="er-tlt" src="images/er-tlt.png" />')
                                        ._('<div class="lq">')
                                            ._('<img class="pi"  src="" />')
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
        thanks: {
            $dialog: null,
            open: function(data) {
                H.yao.canJump = false;
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
                    H.yao.canJump = true;
                    H.yao.isCanShake = true;
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
                        ._('<a href="#" class="btn-close animated" data-collect="true" data-collect-flag="fj-ydsBzq-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                        ._('<img src="">')
                        ._('<a href="#" class="btn animated close" data-collect="true" data-collect-flag="fj-ydsBzq-thanksdialog-know-btn" data-collect-desc="抽奖弹层-领取">再试一试</a>')
                    ._('</div>')
                ._('</section>');
                return t.toString();
            },
            update: function(data) {
                /*if(data && data.pi){
                    $('.thanks-dialog img').attr('src',data.pi || "./images/thanks.png");
                }*/
                var flag = H.yao.rate(),
                    src = '';
                switch (flag){
                    case 10:
                        src = "images/default/kb-thanks.jpg";
                        break;
                    case 30:
                        src = "images/default/dd-thanks.jpg";
                        break;
                    default:
                        src = "images/default/zf-thanks.jpg";
                }
                $('.thanks-dialog img').attr('src', src);
            }
        }
	};

	W.commonApiRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};

    W.callbackLotteryAwardHandler = function(data) {
    };
})(Zepto);

$(function() {
	H.dialog.init();
});