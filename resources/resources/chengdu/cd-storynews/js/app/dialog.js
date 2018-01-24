(function($) {
    H.dialog = {
        puid: 0,
        ci:null,
        ts:null,
        si:null,
        rule_flag:true,
        record_flag:true,
        recData:null,
        isLoc:false,
        isGetInfo:false,
        isGetNew:true,
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
            this.$dialog.animate({'opacity':'1'}, 500);
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
            $(".rule-dialog").css({
				'width': width * 0.7,
				'height': height * 0.66,
				'left': width * 0.15,
				'top': height * 0.17
			});
            $(".list-dialog").css({
				'width': width * 0.8,
				'height': height * 0.66,
				'left': width * 0.1,
				'top': height * 0.17
			});
            $(".duobao-dialog").css({
                'width': width * 0.82,
                'height': height * 0.6,
                'left': width * 0.09,
                'right': width * 0.09,
                'top': height * 0.2,
                'bottom': height * 0.15
            });
        },
        // 规则
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				$('body').addClass('noscroll');
                if(H.dialog.rule_flag==true)
                {
                    getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
                }
				
			},
			close: function() {
                var me = this;
				$('body').removeClass('noscroll');
                this.$dialog.find('.dialog').removeClass("bounceInDown").addClass('bounceOutDown');
                  this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    // me.$dialog && me.$dialog.remove();
                    // me.$dialog = null;
                     me.$dialog.find('.dialog').removeClass('bounceOutDown');
                     me.$dialog && me.$dialog.addClass('none');
                }, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="活动规则弹层-关闭按钮"></a>')
					._('<div class="content border">')
					._('<h2>活动规则</h2>')
					._('<div class="rule"></div>')
					._('</div>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
        list: {
			$dialog: null,
            init: function () {
                if(H.dialog.isGetNew==true){
                    getResult('api/lottery/record', {oi: openid}, 'callbackLotteryRecordHandler', true);
                }else{
                    H.dialog.list.open(H.dialog.recData,1);
                }
            },
			open: function(data,info) {
				H.dialog.open.call(this);
				this.event();
                if(H.dialog.isGetNew){
                    this.update(data,info);
                    H.dialog.isGetNew = false;
                }
				$('body').addClass('noscroll');
			},
			close: function() {
                var me = this;
				$('body').removeClass('noscroll');
                this.$dialog.find('.dialog').removeClass("bounceInDown").addClass('bounceOutDown');
                  this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    // me.$dialog && me.$dialog.remove();
                    // me.$dialog = null;
                     me.$dialog.find('.dialog').removeClass('bounceOutDown');
                     me.$dialog && me.$dialog.addClass('none');
                }, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function(data,info) {
                $('.content-record ul').html("");
                var t = simpleTpl(), items = data.rl || [], len = items.length, isPick = false, img = "./images/lit-card-bg.png";
                t._('<div class="gift-user-info">');
                if(info !== 1){
                    if(info){
                        t._('<img src="' + info.hi + '" />')
                            ._('<div class="gift-user-name">' + info.nn + '</div>')
                    }else{
                        t._('<img src="./images/avatar.png" />')
                            ._('<div class="gift-user-name">匿名</div>')
                    }
                    t._('</div>')
                        ._('</div>');
                    $('.border').before(t.toString());
                }

                t = simpleTpl();
                t._('<li>')
                    ._('<div class="gift-info">')
                    ._('<p class="gift-name">奖品名称</p>')
                    ._('<div class="gift-time">获奖时间</div>')
                    ._('</div>')
                    ._('</div>')
                    ._('</li>');
                for (var i = 0; i < len; i ++) {
                    t._('<li>')
                        ._('<div class="gift-icon"></div>')
                        ._('<div class="gift-info">')
                        ._('<p class="gift-name">' + items[i].pn + '</p>');

                    if (items[i].cc) {
                        if (items[i].cc.split(',')[0]) {
                            t._('<div class="gift-numb">' + items[i].cc.split(',')[0] + '<div class="gift-time">' + items[i].lt.split(" ")[0] + '</div></div>')
                        }
                    }else{
                        t._('<div class="gift-time">' + items[i].lt.split(" ")[0] + '</div>')
                    }
                    t._('</div>')
                        ._('</div>')
                        ._('</li>')
                }
                $('.content-record ul').append(t.toString());
            },
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="list-dialog">')
					._('<div class="dialog list-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="活动规则弹层-关闭按钮"></a>')
					._('<div class="content border">')
                    ._('<section class="content content-record">')
                    ._('<ul>')
                    ._('</ul>')
                    ._('</section>')
					._('</div>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
         // 夺宝跳转
        duobao: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();
                $('body').addClass('noscroll');
            },
            close: function() {
                var me = this;
                $('body').removeClass('noscroll');
                this.$dialog.find('.dialog').addClass('bounceOutDown');
                setTimeout(function(){
                    // me.$dialog && me.$dialog.remove();
                    // me.$dialog = null;
                     me.$dialog.find('.dialog').removeClass('bounceOutDown');
                     me.$dialog && me.$dialog.addClass('none');
                     H.lottery.isCanShake = true;
                }, 800);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.duobao-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('.duobao-btn-sure').click(function(e) {
                     e.preventDefault();
                    $(".duobao-btn-sure").addClass('flash');
                    setTimeout(function()
                    {
                         location.href=" http://cdn.holdfun.cn/mpAccount/resources/pages/8438267a82b143a78fe00d2e69f8d5ca/index.html";
                     },500);
                   
                });
            },
            update: function(rule) {
                this.$dialog.find('.rule').html(rule).removeClass('none');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="duobao-dialog">')
                    ._('<div class="dialog duobao-dialog">')
                    ._('<a href="#" class="duobao-close" data-collect="true" data-collect-flag="duobao-closebtn" data-collect-desc="夺宝弹层-关闭按钮"></a>')
                    ._('<div class="content border">')
                    ._('<div class="rule"></div>')
                    ._('<a class="duobao-btn-sure" id="duobao-btn-sure" data-collect="true" data-collect-flag="duobao-sure-btn" data-collect-desc="夺宝-跳进链接">立即夺宝</a>')
                    ._('</div>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
        // 夺宝跳转
        qtcode: {
            $dialog: null,
            isLocation :false,
            open: function(data) {
                H.dialog.open.call(this);
                this.event();
                $('body').addClass('noscroll');
                 this.update(data);
                this.isLocation = data;
                H.lottery.isCanShake = false;
            },
            close: function() {
                var me = this;
                $('body').removeClass('noscroll');
                this.$dialog.find('.dialog').removeClass("bounceInDown").addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                     me.$dialog && me.$dialog.remove();
                     me.$dialog = null;
                     // me.$dialog.find('.dialog').removeClass('bounceOutDown');
                     // me.$dialog && me.$dialog.addClass('none');
                     H.lottery.isCanShake = true;
                     if(me.isLocation && H.dialog.isLoc)
                     {
                         location.reload();
                     }
                }, 800);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.qtcode-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(data) {
                var winW = $(window).width(), winH = $(window).height();
                $(".qtcode-dialog").find(".award-luckEt").html(data.tt);
                $(".qtcode-dialog").find(".t-img").attr("src",data.pi);
                var lotteryW = winW * 0.8,
                    lotteryH = winH * 0.60,
                    lotteryT = (winH - lotteryH) / 2,
                    lotteryL = (winW - lotteryW) / 2;
                $('.qtcode-dialog').css({
                    'width': lotteryW,
                    'height': "auto",
                    'top': lotteryT,
                    'left': lotteryL
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-rul" id="qtcode-dialog">')
                    ._('<div class="dialog qtcode-dialog">')
                    ._('<a href="#" class="qtcode-close" data-collect="true" data-collect-flag="qtcode-closebtn" data-collect-desc="二维码弹层-关闭按钮"></a>')
                    ._('<div class="award-luckEt"></div>')
                    ._('<img src="" class="t-img">')
                    ._('<p class="award-luck">长按图片识别二维码,更多优惠等您</p>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
        lottery: {
			$dialog: null,
            url:null,
            ci:null,
            ts:null,
            si:null,
            pt:null,
            sto:null,
            rp:null,
            name:null,
            mobile:null,
			open: function(data) {
				H.lottery.isCanShake = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
				   this.event();
				}
				var winW = $(window).width(), winH = $(window).height();
				var lotteryW = winW * 0.8,
					lotteryH = winH * 0.55,
					lotteryT = (winH - lotteryH) / 2,
					lotteryL = (winW - lotteryW) / 2;
				$('.lottery-dialog').css({
					'width': lotteryW,
					'height': "auto",
					'top': lotteryT,
					'left': lotteryL,
                    'padding': "1%"
				});
            	me.update(data);
                H.dialog.lottery.readyFunc();
				H.lottery.canJump = false;
			},
			close: function() {
				var me = this;
            	this.$dialog.find('.dialog').removeClass("bounceInDown").addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
            	setTimeout(function(){
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
                    //H.dialog.qtcode.open();
                    H.lottery.isCanShake = true;
                }, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
                    // H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
					me.close();

				});
			},
            readyFunc: function(){
                var me = this;
                $('#btn-getluck').click(function(e) {
                    e.preventDefault();
                    if($("#lot-inp").hasClass("none") || me.check()){
                        H.lottery.isCanShake = false;
                        if(!$('#btn-getluck').hasClass("flag")){
                            $('#btn-getluck').addClass("flag");
                            if(me.pt == 7){
                                shownewLoading();
                                me.close();
                                me.sto = setTimeout(function(){
                                    H.lottery.isCanShake = true;
                                    hidenewLoading();
                                },15000);
                                $('#btn-getluck').text("领取中");
                                //H.lottery.wxCheck = false;
                                setTimeout(function(){
                                    me.wx_card();
                                },1000);
                            }else if(me.pt == 9){
                                shownewLoading();
                                $('#btn-getluck').text("领取中");
                                getResult('api/lottery/award', {
                                    nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                    hi: headimgurl ? headimgurl : "",
                                    oi: openid,
                                    rn: me.name ? encodeURIComponent(me.name) : "",
                                    ph: me.mobile ? me.mobile : ""
                                }, 'callbackLotteryAwardHandler');
                                setTimeout(function(){
                                    location.href = H.dialog.lottery.url;
                                },500);
                            } else if(me.pt == 4){
                                shownewLoading();
                                $('#btn-getluck').text("领取中");
                                setTimeout(function(){
                                    location.href = H.dialog.lottery.rp;
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
                        //H.lottery.wxCheck = true;
                        H.lottery.canJump = true;
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
                        hidenewLoading();
                    },
                    cancel:function(){
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    }
                });
            },
			update: function(data) {
				var me = this;
                if(data.result && (data.pt == 7 || data.pt == 9 || data.pt == 4)){
                    me.pt = data.pt;
                    $(".lottery-dialog").find(".award-img").attr("src",data.pi);
                    $(".lottery-dialog").find(".award-luckEt").html(data.tt);
                    $('.award-img').css({
                        'width': "70%"
                    });
                    if(data.cu == 1){
                        $('.lottery-dialog').css({
                            'height': $(window).height()*0.7,
                            'top': ($(window).height()*0.3) / 2
                        });
                        $("#lot-inp").removeClass("none");
                    }else{
                        $("#lot-inp").addClass("none");
                    }
                    if(data.pt == 9){
                        me.url = data.ru;
                        if(!data.ru){
                            $("#btn-getluck").addClass("none");
                        }else{
                            $("#btn-getluck").removeClass("none");
                        }
                        $("#lot-inp").addClass("none");
                    }else if(data.pt == 7){
                        me.ci = data.ci;
                        me.ts = data.ts;
                        me.si = data.si;
                    }else if(data.pt == 4){
                        me.rp = data.rp;
                    }
                }
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal modal-lottery" id="lottery-dialog">')
					._('<div id="lot" class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dialog-task-juan-link-close-btn" data-collect-desc="中奖弹层业务类(卡券-外链)-关闭按钮"></a>')
						._('<div class="award-luckEt"></div>')
                        ._('<div class="lott-box" id="lott">')
							// ._('<img class="award-tips" src="./images/lottery-title.png">')
                            //._('<p class="award-luck"></p>')
							._('<img class="award-img" src="./images/gift-blank.png">')
                            ._('<div class="inp" id="lot-inp">')
                                ._('<p class="ple">请填写您的联系方式，以便顺利领奖</p>')
                                ._('<p>姓名：<input class="name"></p>')
                                ._('<p>电话：<input class="phone" type="tel"></p>')
                            ._('</div>')
                            //._('<p class="get-infor">温馨提示：使用详情请参照活动规则<br>或优惠券详情</p>')
                            ._('<a class="lottery-btn" id="btn-getluck" href="#" data-collect="true" data-collect-flag="dialog-task-quan-link-get-btn" data-collect-desc="中奖弹层业务类(卡券-外链)-领取按钮">立  即  领  取</a>')
                        ._('<img class="award-bottom" src="./images/lot-bottom.png">')
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
            ru:null,
            open: function(data) {
                H.lottery.isCanShake = false;
                var me =this,$dialog = this.$dialog;
                me.pt = data.pt;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                var winW = $(window).width(), winH = $(window).height();
                var lotteryW = winW * 0.84,
                    lotteryH = winH * 0.8,
                    lotteryT = (winH - lotteryH) / 2,
                    lotteryL = (winW - lotteryW) / 2;
                $('.lottery-dialog').css({
                    'width': lotteryW,
                    'height': "auto",
                    'top': lotteryT,
                    'left': lotteryL,
                    'padding':"0px 11px 0px 16px"
                });
                me.update(data);
                H.dialog.lottery.readyFunc();
                H.lottery.canJump = false;
            },
            close: function() {
                // H.lottery.isCanShake = false;
                H.lottery.canJump = true;
                var me = this;
                this.$dialog.find('.dialog').removeClass("bounceInDown").addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                    //H.dialog.qtcode.open(true);
                    H.lottery.isCanShake = true;
                    if(me.pt == 1){
                        toUrl("yaoyiyao.html");
                    }
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
                    if(me.ru){
                        shownewLoading();
                        setTimeout(function(){
                            location.href = me.ru;
                        },500);
                    }else{
                        me.close();
                    }
                });
                this.$dialog.find('#btn-link').click(function(e) {
                    e.preventDefault();
                    if(me.ru){
                        shownewLoading();
                        setTimeout(function(){
                            location.href = me.ru;
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
                            name = $.trim($name.val()),
                            $address = $('.address'),
                            address = $.trim($address.val());
                        if(me.pt == 1){
                            $("#Entlottery-dialog").find(".na").text(name);
                            $("#Entlottery-dialog").find(".ph").text(mobile);
                            $("#Entlottery-dialog").find(".aa").text(address);
                            getResult('api/lottery/award', {
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                oi: openid,
                                rn: name ? encodeURIComponent(name) : "",
                                ph: mobile ? mobile : "",
                                ad: address ? address : ""
                            }, 'callbackLotteryAwardHandler');
                        }else if(me.pt == 6){
                            $("#Entlottery-dialog").find(".ph").text(mobile);
                            getResult('api/lottery/award', {
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                oi: openid,
                                ph: mobile ? mobile : ""
                            }, 'callbackLotteryAwardHandler');
                        }
                        if(H.dialog.Entlottery.pt == 5){
                            // showTips("领取成功");
                            $(".duijiangma").addClass("none");
                            $("#ent-inp").addClass("none");
                            $("#ent-show").removeClass("none");
                        }else if(H.dialog.Entlottery.pt == 1){
                            $("#ent-inp").addClass("none");
                            $("#ent-result").removeClass("none");
                        }else if(H.dialog.Entlottery.pt == 6){
                            $("#ent-inp").addClass("none");
                            $("#ent-result").removeClass("none");
                            $("#Entlottery-dialog").find(".na").parent().addClass('none');
                            $("#Entlottery-dialog").find(".aa").parent().addClass('none');
                        }
                    }
                });
            },
            update: function(data) {
                var me = this;
                me.pt = data.pt;
                if (data.ru) {
                    me.ru = data.ru;
                    $('#btn-link').removeClass('none');
                    $('#btn-use').removeClass('none');
                } else {
                    $('#btn-link').addClass('none');
                    $('#btn-use').addClass('none');
                }
                if(data.result && data.pt == 5){
                    //$("#Entlottery-dialog").find(".award-luckEt").html(data.tt);
                    $("#Entlottery-dialog").find(".award-img").attr("src",data.pi);
                    $("#Entlottery-dialog").find(".name").val(data.rn?data.rn:"");
                    $("#Entlottery-dialog").find(".phone").val(data.ph?data.ph:"");
                    $("#Entlottery-dialog").find(".address").addClass("none");
                    if(data.aw){
                        $("#ent-ple").text(data.aw);
                    }
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
                            //$("#Entlottery-dialog").find(".award-luckEt").html(cd[0]);
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
                }else if(data.result && data.pt == 1){

                    $("#Entlottery-dialog").find(".award-luckEt").html(data.tt);
                    $("#Entlottery-dialog").find(".award-img").attr("src",data.pi);
                    $("#Entlottery-dialog").find(".duijiangma").addClass('none');
                    $("#Entlottery-dialog").find(".name").val(data.rn?data.rn:"");
                    $("#Entlottery-dialog").find(".phone").val(data.ph?data.ph:"");
                    $("#Entlottery-dialog").find(".address").val(data.ad?data.ad:"");
                    if(!data.rn || !data.ad || !data.rn)
                    {
                        H.dialog.isLoc=true;
                    }
                    else
                    {
                        H.dialog.isLoc=false;
                    }
                }else if(data.result && data.pt == 6){

                    $("#Entlottery-dialog").find(".award-luckEt").html(data.tt);
                    $("#Entlottery-dialog").find(".award-img").attr("src",data.pi);
                    $("#Entlottery-dialog").find(".duijiangma").addClass('none');
                    $("#Entlottery-dialog").find(".ple").html("请正确填写手机号码，三个工作日内将会有工作人员与您联系奖品发放事宜");
                    //$("#Entlottery-dialog").find(".name").val(data.rn?data.rn:"");
                    $("#Entlottery-dialog").find(".name").addClass("none");
                    $("#Entlottery-dialog").find(".phone").val(data.ph?data.ph:"");
                    //$("#Entlottery-dialog").find(".address").val(data.ad?data.ad:"");
                    $("#Entlottery-dialog").find(".address").addClass("none");
                    if(!data.ph)
                    {
                        H.dialog.isLoc=true;
                    }
                    else
                    {
                        H.dialog.isLoc=false;
                    }
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery" id="Entlottery-dialog">')
                    ._('<div class="dialog lottery-dialog Entlottery-dialog">')
                        ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dialog-task-Entlottery-close-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-关闭按钮"></a>')
                        ._('<div class="award-luckEt"></div>')
                        ._('<div class="lott-box" id="ent-lott">')
                            //._('<img class="award-tips" src="./images/lottery-title.png">')
                            ._('<img class="award-img" src="./images/wenquan-prize.jpg">')
                            ._('<p class="duijiangma">兑奖码:<span class="award-luckEt"></span></p>')
                            ._('<div class="inp" id="ent-inp">')
                                ._('<p class="ple">请填写您的联系方式以便顺利领奖</p>')
                                ._('<p><input class="name" placeholder="姓名"></p>')
                                ._('<p><input class="phone" placeholder="手机号码"></p>')
                                ._('<p><input class="address" type="text" placeholder="地址"></p>')
                                ._('<a class="lottery-btn" id="btn-award" data-collect="true" data-collect-flag="dialog-task-Entlottery-award-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-提交信息按钮">领&nbsp&nbsp取</a>')
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
                                ._('<p class="cd">地址：<span class="aa"></span></p>')
                                ._('<a class="lottery-btn" id="btn-link" data-collect="true" data-collect-flag="dialog-task-Entlottery-link-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-领取按钮">领&nbsp&nbsp取</a>')
                                ._('<a class="lottery-btn" id="btn-sure" data-collect="true" data-collect-flag="dialog-task-Entlottery-sure-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-返回按钮">返&nbsp&nbsp回</a>')
                            ._('</div>')
                            ._('<img class="award-bottom" src="./images/lot-bottom.png">')
                        ._('</div>')
                    ._('</div>')
                    ._('</div>');
                return t.toString();
            },
            check:function(){
                var $mobile = $('.phone'),
                    mobile = $.trim($mobile.val()),
                    $name = $('.name'),
                    name = $.trim($name.val()),
                    $address = $('.address'),
                    address = $.trim($address.val()),
                    me = this;
                if ((me.pt == 1) && (name.length > 20 || name.length == 0)) {
                    showTips('请填写您的姓名，以便顺利领奖!');
                    return false;
                }else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                }else if ((me.pt == 1) && (address.length > 30 || address.length == 0)) {
                    showTips('请填写正确地址，以便顺利领奖！');
                    return false;
                }
                return true;
            }
        },
        Redlottery: {
            $dialog: null,
            rp:null,
            open: function(data) {
                H.lottery.isCanShake = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                var winW = $(window).width(), winH = $(window).height();
                var lotteryW = winW * 0.94,
                    lotteryH = winH * 0.70,
                    lotteryT = (winH - lotteryH) / 2,
                    lotteryL = (winW - lotteryW) / 2
                $('.redlottery-dialog').css({
                    'width': lotteryW,
                    'height': lotteryH,
                    'top': lotteryT,
                    'left': lotteryL,
                    'padding':"4px 4px 4px 4px"
                });
                me.update(data);
                H.lottery.canJump = false;
            },
            close: function() {
                // H.lottery.isCanShake = true;
                H.lottery.canJump = true;
                var me = this;
                this.$dialog.find('.dialog').removeClass("bounceInDown").addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                    //H.dialog.qtcode.open();
                    H.lottery.isCanShake = true;
                }, 1000);
            },
            event: function() {
                var me = this;
                $("#btn-red").click(function(){
                    if(!$('#btn-red').hasClass("requesting") && me.rp){
                        shownewLoading();
                        $('#btn-red').addClass("requesting");
                        $('#btn-red').text("领取中");
                        setTimeout(function(){
                            location.href = me.rp;
                        },500);
                    }
                });
                $(".btn-close").click(function(){
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if(data.result && data.pt == 4){
                    me.rp = data.rp;
                    $(".redlottery-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");;
                    // $(".redlottery-dialog").find(".award-logo").attr("src",data.qc);
                    $(".redlottery-dialog").find(".award-luckEt").html(data.tt);
                    $(".redlottery-dialog").find(".award-luck").html(data.tt);
                    $(".redlottery-dialog").find(".award-ly").html(data.aw);
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery" id="Redlottery-dialog">')
                    ._('<div class="dialog redlottery-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dialog-task-Redlottery-close-btn" data-collect-desc="中奖弹层业务类(红包)-关闭按钮"></a>')
                    ._('<div class="award-luck"></div>')
                    // ._('<p class="award-lpt"></p>')
                    ._('<img class="award-img" src="./images/gift-blank.png">')
                    // ._('<img class="bussiness-infor-img" src="./images/bussiness-infor.png">')
                    ._('<p class="luck-infor">温馨提示：请到公众号消息领取！</p>')
                    ._('<a class="lottery-btn" id="btn-red" data-collect="true" data-collect-flag="dialog-task-red-close-btn" data-collect-desc="中奖弹层业务类(红包)-领取按钮">朕&nbsp;&nbsp;知&nbsp;&nbsp;道&nbsp;&nbsp;了</a>')
                    ._('<p class="award-ly"></p>')
                    ._('</div>')
                    ._('</div>');
                return t.toString();
            }
        },

        // 谢谢参与
        thanks: {
            $dialog: null,
            open: function () {
                var me = this;
                H.dialog.open.call(this);
                this.event();
                // setTimeout(function(){
                //     me.close();
                // },1000);
                var winW = $(window).width(), winH = $(window).height();
                var lotteryW = winW * 0.86,
                    lotteryH = winH * 0.7,
                    lotteryT = (winH - lotteryH) / 2,
                    lotteryL = (winW - lotteryW) / 2
                $('.thanks-dialog').css({
                    'width': lotteryW,
                    'height': lotteryH,
                    'top': lotteryT,
                    'left': lotteryL
                });
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass("bounceInDown").addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    H.lottery.isCanShake = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                    H.lottery.isCanShake = true;
                }, 1000);
            },
            event: function () {
                var me = this;
                this.$dialog.find('.close').click(function (e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('.btn-close').click(function (e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function () {
                var t = simpleTpl();
                // random = getRandomArbitrary(0, thanks_list.length);
                t._('<section class="modal modal-rul" id="thanks-dialog">')
                    ._('<div class="dialog thanks-dialog">')
                    ._('<a href="#" class="btn-close" style = "right:-7px;top: -7px;"  data-collect="true" data-collect-flag="dialog-task-thanks-close-btn" data-collect-desc="谢谢参与-关闭按钮"></a>')
                    ._('<img src="./images/thanks-bg.png" class="thanks-bg">')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        }

    };
    
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
            H.dialog.rule_flag = false;
			$(".rule-dialog .rule").html(data.rule);
		}
	};

    W.callbackLotteryRecordHandler = function(data) {
        if (data.result) {
            H.dialog.recData = data;
            if(!H.dialog.isGetInfo){
                getResult('api/user/info_v2', {matk: matk}, 'callbackUserInfoHandler', true);
            }else{
                H.dialog.list.open(H.dialog.recData,1);
            }
        }else{
            showTips("您还没有中奖记录哦");
        }
    };

    W.callbackUserInfoHandler = function(data) {
        H.dialog.isGetInfo = true;
        if (data.result) {
            H.dialog.list.open(H.dialog.recData,data);
        }else{
            H.dialog.list.open(H.dialog.recData,false);
        }
    };

	W.callbackLotteryAwardHandler = function(data) {};
})(Zepto);

$(function() {
    H.dialog.init();
});
