(function($) {
	H.dialog = {
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		isLotteryDialog: false,
        uid: '',
        wa: '',
		init: function() {
            getResult('api/comments/topic/round', {}, 'callbackCommentsTopicInfo');
			var me = this;
			this.$container.delegate('#btn-rule', 'click', function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			}).delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
                H.dialog.btn_animate($(this));
                $('.dialog').removeClass('bounceInDown').addClass('bounceOutUp');
                setTimeout(function(){
                    $('.modal').addClass('none');
                    $('.dialog').addClass('none');
                    if(H.dialog.isLotteryDialog){
                        H.dialog.lottery.close_lottery();
                        H.dialog.isLotteryDialog = false;
                    }
                },1300);

			}).delegate('.btn-result', 'click', function(e) {
				e.preventDefault();
				H.dialog.result.open();
			}).delegate('.btn-comeon', 'click', function(e) {
				e.preventDefault();
				H.dialog.guide.open();
			});
		},
		close: function() {
			$('.modal').addClass('none');
		},
		open: function() {
			H.dialog.close();
			if (this.$dialog) {
				this.$dialog.removeClass('none');
			} else {
				this.$dialog = $(this.tpl());
				H.dialog.$container.append(this.$dialog);
			}

			H.dialog.relocate();
		},
		relocate: function() {
			var height = $(window).height(),
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.06;

			$('.modal').each(function() {
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.10 -15, 'top': height * 0.16 -15})
			});
			$('.dialog').each(function() {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({ 
					'width': width * 0.80,
					'height': height * 0.68,
					'left': width * 0.1,
					'right': width * 0.1,
					'top': height * 0.16,
					'bottom': height * 0.16
				});
				var $box = $(this).find('.box');
				if ($box.length > 0) {
					$box.css('height', height * 0.38);
				}
			});
		},
        btn_animate: function(str){
        str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
		guide: {
			$dialog: null,
			open: function() {
				var me = this,
					winW = $(window).width(),
					winH = $(window).height();
				H.dialog.open.call(this);
				$('#guide-dialog .tips').css({
                    'top': Math.round((winH-250)/2)+'px',
                    'left': Math.round((winW-218)/2)+'px'
                });
				this.event();
				setTimeout(function() {
					me.close();
				}, 5000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-try').click(function(e) {
					e.preventDefault();
                    H.dialog.btn_animate($(this));
                    $('.tips').removeClass('bounceInDown').addClass('bounceOutUp');
                    setTimeout(function(){
                        me.close();
                    },0);
				});
			},
			close: function() {
                $('.tips').removeClass('bounceInDown').addClass('bounceOutUp');
                setTimeout(function(){
                    $('#guide-dialog') && $('#guide-dialog').addClass('none');
                },800);
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog relocated">')
						._('<div class="content">')
							._('<div class="tips animated">')
								._('<div>')
                                    ._('<img class="btn-try close-img" data-collect="true" data-collect-flag="syrj-guide-trybtn" data-collect-desc="引导弹层-关闭按钮" src="images/yy-close.png" />')
                                    ._('<h2>看《大小青花剧场》微信摇一摇</h1>')
                                    ._('<h1>赢取大奖</h1>')
								._('</div>')
								._('<p>1.打开电视，锁定河北农民频道</p>')
								._('<p>2.打开微信，进入摇一摇（电视）</p>')
								._('<p>3.对着电视摇一摇</p>')
                                ._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="syrj-guide-trybtn" data-collect-desc="引导弹层-关闭按钮"><img src="./images/index-guide-btn.jpg"></a>')
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				getResult('api/common/rule', {}, 'commonApiRuleHandler', true, this.$dialog);
			},
			close: function() {
				//$('body').removeClass('noscroll');
                /*this.$dialog.find('.rule-dialog').removeClass('bounceInDown').addClass('bounceOutUp');
                setTimeout(function(){
                    this.$dialog && this.$dialog.addClass('none');
                },1300);*/

			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					//me.close();
				});
			},
			update: function(rule) {
				this.$dialog.find('.rule').html(rule).removeClass('none');
                $('.rule-dialog').removeClass('bounceOutUp');
                setTimeout(function(){
                   $('.rule-dialog').removeClass('none').addClass('bounceInDown');
                },0)
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<div class="dialog rule-dialog animated none">')
                        ._('<a href="#" class="btn-close animated" data-collect="true" data-collect-flag="syrj-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2>活动规则</h2>')
						._('<div class="content border">')
							._('<div class="rule none"></div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		postcard: {
			$dialog: null,
            img:null,
            uid:null,
            t:null,
            info:null,
			open: function(img, uid, t, info) {
                this.img = img;
                this.uid = uid;
                this.t = t;
                this.info = info;
				H.dialog.open.call(this);
				this.event();
                var height = $(window).height(),
                    width = $(window).width();
                $(".postcard-dialog").css({
                    'width': width * 0.95,
                    'height': height * 0.70,
                    'left': width * 0.025,
                    'right': width * 0.025,
                    'top': height * 0.15,
                    'bottom': height * 0.15
                });
                $('html').bind("touchmove",function(e){
                    e.preventDefault();
                });
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
                this.$dialog.remove();
                this.$dialog = null;
                $('html').unbind("touchmove");
			},
			event: function() {
				var me = this;
				this.$dialog.find('#btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
                this.$dialog.find('#btn-send').click(function(e) {
					e.preventDefault();
                    if(me.check()){
                        var cont = {
                            "to":$(".to-in").val(),
                            "con":$(".con-in").val(),
                            "from":$(".from-in").val()
                        };
                        getResult("api/linesdiy/save",{
                            yoi: openid,
                            tuid:me.uid,
                            wxnn:nickname,
                            wximg:headimgurl,
                            jsdt:JSON.stringify(cont)
                        },"callbackLinesDiySaveHandler",true);
                    }
				});

			},
            check: function(){
                var $to = $(".ron").find(".to-in"),
                    $con = $(".ron").find(".con-in"),
                    $from = $(".ron").find(".from-in");
                var to = $to.val(),
                    con = $con.val(),
                    from = $from.val();
                if(to.length == 0 || to.length > 10){
                    showTips('请填写您要发送的人，不超过10个字哦！',4);
                    $to.focus();
                    return false;
                }
                if(con.length == 0 || con.length > 50){
                    showTips('请填写您的祝福，不超过50个字哦！',4);
                    $con.focus();
                    return false;
                }
                if(from.length == 0 || from.length > 10){
                    showTips('请填写您的姓名，不超过10个字哦！',4);
                    $from.focus();
                    return false;
                }
                return true;
            },
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rank-dialog">')
					._('<div class="dialog postcard-dialog">')
					    ._('<p class="tip">我要给你寄张明信片，就躺在你家门口的信箱里。</p>')
					    ._('<div class="content">')
                            ._('<img class="fr" src="'+this.img+'">')
                            ._('<div class="ron">')
                                ._('<p class="to">To:<input class="to-in" type="text"></p>')
                                ._('<textarea class="con-in" type="text"></textarea>')
                                ._('<p class="from">From:<input class="from-in" type="text"></p>')
                            ._('</div>')
						._('</div>')
                        ._('<p class="tip" id="send-tips">在明信片相应位置点击即可填写。</p>')
                        ._('<a class="btn-send" id="btn-send" data-collect="true" data-collect-flag="syrj-tour-postcard-sendbtn" data-collect-desc="明信片弹层-发送按钮">发送</a>')
                        ._('<a class="btn-send none" id="btn-close" data-collect="true" data-collect-flag="syrj-tour-postcard-closebtn" data-collect-desc="明信片弹层-关闭按钮">关闭</a>')
                    ._('</div>')
				._('</section>');
				return t.toString();
			},
            update: function(data){
                var to = data.to,
                    con = data.con,
                    from = data.from;
                $(".to-in").val(to);
                $(".con-in").val(con);
                $(".from-in").val(from);
                $("#btn-send").addClass("none");
                $("#btn-close").html("我也要玩");
                $("#btn-close").removeClass("none");
                this.$dialog.find(".tip").addClass("none");
                this.$dialog.find("input").attr("disabled","disabled");
                this.$dialog.find("textarea").attr("disabled","disabled");
                this.$dialog.find("textarea").addClass("border-no");
            }
		},
        lottery: {
            $dialog: null,
            LOTTERIED_CLS: 'lotteried',
            REQUEST_CLS: 'requesting',
            AWARDED_CLS: 'lottery-awarded',
            LOTTERY_NONE_CLS: 'lottery-none',
            redpack: '',
            isSbtRed: false,
            ci:null,
            ts:null,
            si:null,
            pt:null,
            url:null,
            sto:null,
            open: function(data) {
                H.yao.isCanShake = false;
                H.dialog.isLotteryDialog = true;
                var me = this, $dialog = this.$dialog;
                H.dialog.open.call(this);
                H.dialog.lottery.pre_dom();
                H.dialog.lottery.update(data);
                if (!$dialog) {
                    this.event();
                }
                this.$dialog && this.$dialog.removeClass('none');
            },
            pre_dom: function(){
                var winW = $(window).width(),
                    winH = $(window).height();

                $('.lottery-dialog').css({
                    'top': Math.round((winH-368)/2)+'px',
                    'left': Math.round((winW-260)/2)+'px',
                    'bottom': 'auto'
                });
                $('.dialog').removeClass('bounceOutUp');
                setTimeout(function(){
                    $('.dialog').removeClass('none').addClass('bounceInDown');
                },0);
            },
            card_fail: function(){
                shownewLoading();
                me.sto = setTimeout(function(){
                    H.yao.isCanShake = true;
                    hidenewLoading();
                },15000);
            },
            event: function() {
                var me = this,
                    $open = $('.open'),
                    $lq = $('.lq');
                $open.click(function(e){
                    e.preventDefault();
                    $(this).addClass('none');
                    $lq.removeClass('none');
                });

                this.$dialog.find('.btn-lq').click(function(e){
                    e.preventDefault();
                    if(me.isSbtRed){
                        return;
                    }
                    me.isSbtRed = true;
                    toUrl(me.redpack);
                });
                this.$dialog.find('.btn-award').click(function(e) {
                    e.preventDefault();
                    H.dialog.btn_animate($(this));

                    if(!$('#btn-award').hasClass("flag")){
                        $('#btn-award').text("领取中");
                        $('#btn-award').addClass("flag");
                        H.yao.isCanShake = false;
                        if(me.pt == 7){
                            H.yao.card_fail();
                            H.yao.wxCheck = false;
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
                        }else if(me.pt == 2){
                            if (!me.check()) {
                                return false;
                            }
                            var mobile = $.trim(me.$dialog.find('.mobile').val()),
                                name = $.trim(me.$dialog.find('.name').val()),
                                address = $.trim(me.$dialog.find('.address').val());

                            me.disable();
                            getResult('api/lottery/award', {
                                oi: openid,
                                rn: encodeURIComponent(name),
                                ph: mobile,
                                ad: encodeURIComponent(address),
                                pu: H.dialog.uid,
                                pv: H.dialog.PV
                            }, 'callbackLotteryAwardHandler', true, me.$dialog);
                            H.dialog.lottery.succ();
                        }
                    }
                });

                $(".btn-qd").click(function(e){
                    e.preventDefault();
                    $(this).removeClass('animated zoom-in');
                    H.dialog.btn_animate($(this));
                    $('.rule-first').removeClass('bounceOutUp').addClass('bounceInDown');
                    $('.rule-section').removeClass('none');

                });
                $(".rule-close").click(function(e){
                    e.preventDefault();
                    H.dialog.btn_animate($(this));
                    $('.btn-close').trigger('click');
                    $('.rule-first').removeClass('bounceInDown').addClass('bounceOutUp');
                    setTimeout(function(){
                        $('.rule-section').addClass('none');
                    },500);
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
            close_lottery: function() {
                H.yao.isCanShake = true;
                var me = this;
                if(me.pt == 2){
                    //积分
                    this.$dialog.find('.mobile').attr('type','tel');
                    this.$dialog.find('input').removeAttr('disabled').removeClass('disabled');
                    this.$dialog.removeClass(this.AWARDED_CLS);
                    this.$dialog.find('.btn-award').removeClass(me.REQUEST_CLS);
                    this.$dialog.find('.award-tip').text('请填写您的联系方式,以便顺利领奖');
                    this.$dialog.find('.award-win').addClass('none');
                }else if(me.pt == 4){
                    //红包
                    $('.open').removeClass('none');
                    $('.lq').addClass('none');
                    this.$dialog.find('.award-red').addClass('none');
                }else if(me.pt == 7 || me.pt == 9){
                    this.$dialog.find('.award-card').addClass('none');
                }
            },
            update: function(data) {
                var me = this;
                me.pt = data.pt;
                if(data){
                    if (data.result) {
                        //pt : 0 谢谢参与
                        //pt : 1 普通奖品
                        //pt : 2 积分
                        // 中奖后
                        this.$dialog.find('h2.tt').text(data.tt || '');
                        this.$dialog.find('img.pi').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
                        if(data.pt == 4){
                            H.dialog.lottery.redpack = data.rp;
                            this.$dialog.find('.award-red').removeClass('none');
                            return;
                        }else if(data.pt == 2){
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
                }else if(address.length < 5 || address.length > 60) {
                    showTips('地址长度为5~60个字符');
                    $address.focus();
                    return false;
                }
                return true;
            },

            enable: function() {
                this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
            },
            disable: function() {
                this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
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
                this.$dialog.find('.award-tip').text('以下是您的联系方式');
            },

            reset: function() {
                this.$dialog && this.$dialog.remove();
                this.$dialog = null;
            },

            close: function() {
                this.$dialog.find('.btn-close').trigger('click');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog animated none">')
                        ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="syrj-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
                        ._('<div class="dialog-inner">')
                            ._('<div class="content">')
                                ._('<div class="back">')

                                    ._('<div class="award-win none">')
                                        ._('<h2 class="tt"></h2>')
                                        ._('<img class="pi" src="" />')
                                        ._('<div class="contact">')
                                            ._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
                                            ._('<p><input type="text" class="name" placeholder="姓名" /></p>')
                                            ._('<p><input type="tel" class="mobile" placeholder="电话" /></p>')
                                            ._('<p><input type="text" class="address" maxlength="18" placeholder="地址" /></p>')
                                            ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="syrj-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">领 取</a>')
                                            ._('<a href="#" class="btn btn-share btn-qd" data-collect="true" data-collect-flag="syrj-lotterydialog-back-btn" data-collect-desc="抽奖弹层-返回按钮">确 定</a>')
                                        ._('</div>')
                                    ._('</div>')

                                    ._('<div class="award-card none">')
                                        ._('<h2 class="tt"></h2>')
                                        ._('<img class="pi" src="" />')
                                        ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="syrj-lotterydialog-know-btn" data-collect-desc="抽奖弹层-我知道了按钮">领 取</a>')
                                    ._('</div>')

                                    ._('<div class="award-red none">')
                                        ._('<img class="logo-img" src="images/red-top.png" />')
                                        ._('<div class="open">')
                                            ._('<h2>恭喜您，获得一个红包</h2>')
                                            ._('<a href="#" class="btn-open" data-collect="true" data-collect-flag="syrj-lotterydialog-know-btn" data-collect-desc="抽奖弹层-打开"></a>')
                                        ._('</div>')
                                        ._('<div class="lq none">')
                                            ._('<h2 class="tt"></h2>')
                                            ._('<img class="pi" src="" />')
                                            ._('<a href="#" class="btn-lq" data-collect="true" data-collect-flag="syrj-lotterydialog-know-btn" data-collect-desc="抽奖弹层-领取"></a>')
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
        // 积分排行榜
        rank: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
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
            close: function() {
                this.$dialog && this.$dialog.addClass('none');
            },
            event: function() {
                var me = this;
               /* this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });*/

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
                        ._('<span class="r-name">第<span class="jf-num">'+ (items[i].rk || '-') +'</span>名</span>')
                        ._('<span class="r-rank"><span class="jf-num">积分：</span>'+ (items[i].in || ' ') +'</span>')
                    ._('</li>');
                }
                this.$dialog.find('ul').html(t.toString());
            },

            tpl: function() {
                var t = simpleTpl();

                t._('<section class="modal" id="rank-dialog">')
                    ._('<div class="dialog rank-dialog animated none">')
                        ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="syrj-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
                        ._('<div class="rank-top">')
                            ._('<img src="images/rank-top.png" />')
                            ._('<label class="infor"></label>')
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
	
	W.callbackLinesDiySaveHandler = function(data) {
		if (data.code == 0) {
            var ruid = data.ruid,
                me = H.dialog.postcard;
            $("#btn-send").addClass("none");
            $("#btn-close").removeClass("none");
            $("#send-tips").html("想送给谁？右上角单击试试。");
            window['shaketv'] && shaketv.wxShare(share_img, me.t, me.info, getnewUrl(openid,ruid));
		}else{
            if(data.message.length > 0){
                showtip(data.message,4);
            }
        }
	};

    W.callbackLotteryAwardHandler = function(data) {
    };

    W.callbackIntegralRankSelfRoundHandler = function(data) {
        if (data.result) {
            H.dialog.rank.selfupdate(data);
            $(".infor").text(H.dialog.wa);
        }
    };

    W.callbackIntegralRankTop10RoundHandler = function(data) {
        if (data.result) {
            H.dialog.rank.update(data);
        }
    };
    W.callbackCommentsTopicInfo = function(data){
        if(data.code == 0){
            H.dialog.uid = data.items[0].uid;
            H.dialog.wa = data.items[0].t;
        }
    }
})(Zepto);

$(function() {
	H.dialog.init();
});