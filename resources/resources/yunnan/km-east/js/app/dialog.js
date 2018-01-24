(function($) {
	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',

		redpack : '',
		iscroll: null,
		isJump :true,
		hasaddr:false,
		rule_flag:true,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				me.close();
			})

		},
		close: function() {
            setTimeout(function(){
                $('.modal').addClass('none');
            }, 1000);	
		},
		open: function() {

			if (this.$dialog) {
				this.$dialog.removeClass('none');
			} else {
				this.$dialog = $(this.tpl());
				H.dialog.$container.append(this.$dialog);
			}
             $('div.dialog').addClass('bounceInDown');
            setTimeout(function(){
            $('div.dialog').removeClass('bounceInDown');
                }, 1000);

			H.dialog.relocate();
		},
		relocate : function(){
			var height = $(window).height(),
				width = $(window).width(),
                bodyheight = $("body").height(),
				top = $(window).scrollTop();
			$('.modal').each(function() {
                if(H.dialog.rule_flag)
                {
                    $(this).css({ 'width': width, 'height': height }).find('.').css({'right': '0px', 'top': '0px'});
                }
                else
                {
                    $(this).css({ 'width': width, 'height': bodyheight}).find('.').css({'right': '0px', 'top': '0px'});
                }
				
			});
			$('.dialog').each(function() {
				$(this).css({
					'width': width,
					'height': height,
					'left': 0,
				});
			});
			$(".rule-dialog").css({
				'width': width * 0.82,
				'height': height * 0.6,
				'left': width * 0.09,
				'right': width * 0.09,
				'top': height * 0.2,
				'bottom': height * 0.15
			});
			$(".thanks-dialog").css({
				'width': width * 0.68,
				'height': height * 0.6,
				'left': width * 0.16,
				'top': height * 0.2
				//'bottom': height * 0.075
			});
		},
		// 规则
		rule: {
			$dialog: null,
			open: function() {
                H.dialog.rule_flag = false;
				H.dialog.open.call(this);
				this.event();
				$('body').addClass('noscroll');
                getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
                var me = this;
				$('body').removeClass('noscroll');
                $(".rule-dialog").addClass('bounceOutDown');
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-back').click(function(e) {
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
					._('<a href="#" class="btn-back" data-collect="true" data-collect-flag="dialog-task-quan-link-close-btn" data-collect-desc="活动规则-关闭按钮">')
                    ._('<img class="btn-close" src="./images/btn-close.png"></a>')
					._('<div class="content border">')
					._('<h2>活动规则</h2>')
					._('<div class="rule none"></div>')
					._('</div>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
         // 谢谢参与
        thanks: {
            $dialog: null,
            open: function () {
                var me = this;
                H.lottery.isCanShake = false;
                H.dialog.open.call(this);
                this.event();
      
            },
            close: function () {
                var me = this;
                $(".thanks-dialog").addClass('bounceOutDown');
                setTimeout(function(){
                    H.lottery.isCanShake = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function () {
                var me = this;
                this.$dialog.find('.btn-close').click(function (e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function () {
                // var t = simpleTpl(), random = getRandomArbitrary(0, thanks_list.length);
                var t = simpleTpl()
                t._('<section class="modal modal-rul" id="thanks-dialog">')
                    ._('<div class="dialog thanks-dialog">')
                    ._('<a class="back-btn" id="btn-close" data-collect="true" data-collect-flag="dialog-thank-close-btn" data-collect-desc="谢谢参与-关闭按钮">')
                    ._('<img class="btn-close" src="./images/btn-close.png"></a>') 
                    // ._('<img src="./images/thanks-bg.jpg" class="thank-img">')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
        Entlottery: {
            $dialog: null,
            pt:null,
            ru:null,
            open: function(data) {
                H.lottery.isCanShake = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                var winW = $(window).width(), winH = $(window).height();
                var lotteryW = winW * 0.94,
                    lotteryH = winH * 0.76,
                    lotteryT = (winH - lotteryH) / 2,
                    lotteryL = (winW - lotteryW) / 2;
                $('.lottery-dialog').css({
                    'width': lotteryW,
                    'height': lotteryH,
                    'bottom': lotteryT,
                    'left': lotteryL
                });
                me.update(data);
            },
            close: function() {
                H.lottery.isCanShake = true;
                var me = this;
                $('.lottery-dialog').addClass('bounceOutDown');
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('#btn-sure').click(function(e) {
                    e.preventDefault();
                    me.close();
                   });
                this.$dialog.find('.btn-close').click(function(e) {
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
                                $("#ent-show").removeClass("none");
                                $("#ent-inp").addClass("none");
                                $("#Entlottery-dialog").find(".na").text(name);
                                $("#Entlottery-dialog").find(".ph").text(mobile);
                                $("#Entlottery-dialog").find(".ad").text(address);
                            }
                           getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid,
                            rn: name ? encodeURIComponent(name) : "",
                            ph: mobile ? mobile : "",
                            ad:address? address : ""
                        }, 'callbackLotteryAwardHandler');
                        //me.worldTips();
                    }
                });
            },
            update: function(data) {
                  var me = this;
                      me.pt = data.pt;
                    $("#Entlottery-dialog").find(".award-luckEt").html(data.tt);
                    $("#Entlottery-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    $("#Entlottery-dialog").find(".name").val(data.rn?data.rn:"");
                    $("#Entlottery-dialog").find(".phone").val(data.ph?data.ph:"");
                    $("#Entlottery-dialog").find(".address").val(data.ad?data.ad:"");
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery" id="Entlottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                        ._('<a href="#" class="btn-back" data-collect="true" data-collect-flag="dialog-task-Entlottery-close-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-关闭按钮">')
                        ._('<img class="btn-close" src="./images/btn-close.png"></a>')
                            ._('<img class="award-tips" src="./images/lottery-title.png">')
                            ._('<img class="award-img" src="./images/pre-ward">')
                            ._('<div class="inp" id="ent-inp">')
                                ._('<p class="ple">正确填写信息以便顺利领奖</p>')
                                ._('<p><input class="name" type="text" placeholder="姓名"></p>')
                                ._('<p><input class="phone" type="tel" placeholder="手机号码"></p>')
                                ._('<p><input class="address" type="text" placeholder="收件地址"></p>')
                                ._('<a class="lottery-btn" id="btn-award" data-collect="true" data-collect-flag="dialog-task-Entlottery-award-btn" data-collect-desc="中奖弹层业务类(实物)-提交信息按钮">领    取</a>')
                            ._('</div>')
                            ._('<div class="code none" id="ent-show">')
                               // ._('<p class="ple">正确填写信息以便顺利领奖</p>')
                               ._('<p><label>姓名：</label><span class="na"></span></p>')
                               ._('<p><label>手机号码：</label><span class="ph"></span></p>')
                               ._('<p><label>收件地址：</label><span class="ad"></span></p>')
                               // ._('<p class="praytips"><span class="yaobai">温馨提示：</span>请截屏此页面，在和悦汇现场出示消费。</p>')
                               ._('<a class="lottery-btn" id="btn-sure" data-collect="true" data-collect-flag="dialog-task-Entlottery-award-btn" data-collect-desc="中奖弹层业务类(实物)-确认信息按钮">确    定</a>')
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
                    address = $.trim($address.val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖!');
                    return false;
                }else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                }else if (address.length > 30) {
                    showTips('请填写正确地址，以便顺利领奖！');
                    return false;
                }
                return true;
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
            name:null,
            mobile:null,
            open: function(data) {
                H.lottery.isCanShake = false;
                H.lottery.canJump = false;
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
                me.update(data);
                H.dialog.lottery.readyFunc();
            },
            close: function() {
                var me = this;
                $('.btn-close').animate({'opacity':'0'}, 300);
                this.$dialog.find('.dialog').addClass('bounceOutDown');
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    H.lottery.isCanShake = true;
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
                                // H.lottery.wxCheck = false;
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
                var me = this;
                if(data.result && (data.pt == 7 || data.pt == 9)){
                    me.pt = data.pt;
                    $(".lottery-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    $(".lottery-dialog").find(".award-luck").html(data.tt);
                    $("#lottery-dialog").find(".name").val(data.rn?data.rn:"");
                    $("#lottery-dialog").find(".phone").val(data.ph?data.ph:"");
                    if(data.al){
                        $(".lottery-dialog").find(".award-phone").text(data.al);
                        $(".lottery-dialog").find(".award-phone").removeClass("none");
                    }
                    if(data.cu == 1){
                        $('.lottery-dialog').css({
                            'height': $(window).height()*0.75,
                            'top': ($(window).height()*0.25) / 2
                        });
                        // $('.btn-close').css({'top': ($(window).height()*0.25) / 2});
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
                    ._('<div class="dialog lottery-dialog">')
                        ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dialog-task-quan-link-close-btn" data-collect-desc="中奖弹层业务类(卡券-外链)-关闭按钮">')
                        ._('<img class="btn-close" src="./images/btn-close.png"></a>')
                        ._('<div class="lott-box" id="lott">')
                            ._('<img class="award-tips" src="./images/lottery-title.png">')
                            ._('<p class="award-luck"></p>')
                            ._('<img class="award-img" src="./images/pre-ward.png">')
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
		Redlottery: {
            $dialog: null,
            rp:null,
            open: function(data) {
                H.lottery.canJump = false;
                H.lottery.isCanShake = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                if (!$dialog) {
                    this.event();
                }
                var winW = $(window).width(), winH = $(window).height();
                var lotteryW = winW * 0.9,
                    lotteryH = winH * 0.54,
                    lotteryT = (winH - lotteryH) / 2,
                    lotteryL = (winW - lotteryW) / 2;
                $('.redlottery-dialog').css({
                    'width': lotteryW,
                    'height': lotteryH,
                    'top': lotteryT,
                    'left': lotteryL
                });
                me.update(data);
            },
            close: function() {
            	var me = this;
                H.lottery.isCanShake = true;
                $('div.dialog').addClass('bounceOutDown');
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
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
                // $("#Redlottery-dialog").click(function(){
                //     if(!$('#btn-red').hasClass("requesting") && me.rp){
                //         shownewLoading();
                //         $('#btn-red').addClass("requesting");
                //         $('#btn-red').text("领取中");
                //         setTimeout(function(){
                //             location.href = me.rp;
                //         },500);
                //     }
                // });
                $(".btn-close").click(function(){
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if(data.result && data.pt == 4){
                    me.rp = data.rp;
                    $(".redlottery-dialog").find(".award-img").attr("src",data.pi);
                    $(".redlottery-dialog").find(".award-logo").attr("src",data.qc);
                    $(".redlottery-dialog").find(".award-lpt").html(data.tt);
                    $(".redlottery-dialog").find(".award-ly").html(data.aw);
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery " id="Redlottery-dialog">')
                    ._('<div class="dialog redlottery-dialog">')
                    ._('<a class="back-btn" id="btn-back" data-collect="true" data-collect-flag="dialog-task-red-close-btn" data-collect-desc="中奖弹层业务类(红包)-中奖弹层关闭按钮">')
                    ._('<img class="btn-close" src="./images/btn-close.png"></a>') 
                    ._('<img class="award-tips" src="./images/lottery-title.png">')
                    ._('<p class="award-lpt"></p>')
                    // ._('<img class="award-logo" src="./images/gift-blank.png">')
                    ._('<img class="award-img" src="./images/gift-blank.png">')
                    ._('<a class="lottery-btn" id="btn-red" data-collect="true" data-collect-flag="dialog-task-red-close-btn" data-collect-desc="中奖弹层业务类(红包)-领取按钮">领&nbsp;&nbsp;取</a>')
                    ._('<p class="award-ly"></p>')
                    ._('</div>')
                    ._('</div>');
                return t.toString();
            }
        }, 
	};

	W.callbackLotteryAwardHandler = function(data) {
		if (data.result) {
			$(".cona").addClass("none");
			$(".conb").removeClass("none");
			return;
		}
		showTips('亲，服务君繁忙！请稍后再试！');
	};
	W.callbackRuleHandler = function(data) {
		if (data.code == 0) {

			H.dialog.rule.update(data.rule);
			
		}
	};
})(Zepto);

$(function() {
	H.dialog.init();
});
