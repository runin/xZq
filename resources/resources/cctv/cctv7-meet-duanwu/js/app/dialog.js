(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        iscroll: null,
        redpack: "",
        ci:null,
        ts:null,
        si:null,
        pt: 0,
        first: true,
        init: function() {
            this.$container.delegate('.link-a', 'click', function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            }).delegate('.btn-close', 'click', function(e) {
                e.preventDefault();
                $(this).closest('.modal').addClass('none');
            }).delegate('.btn-result', 'click', function(e) {
                e.preventDefault();
                H.dialog.result.open();
            }).delegate('.btn-receive', 'click', function(e) {
                e.preventDefault();
                H.dialog.receive.open();
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
                $(this).find('.btn-close').css({'right': width * 0.1 + 6, 'top': top * 2 + 10})
            });
            $('.dialog').each(function() {
                if ($(this).hasClass('relocated')) {
                    return;
                }
                $(this).css({ 
                    'width': width * 0.8, 
                    'height': height * 0.75,
                    'left': width * 0.1,
                    'right': width * 0.1,
                    'top': top * 2,
                    'bottom': height * 0.06
                });
                var $box = $(this).find('.box');
                if ($box.length > 0) {
                    $box.css('height', height * 0.38);
                }
            });
        },
        
        
        // 规则
        rule: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();
                
                $('body').addClass('noscroll');
                getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
            },
            close: function() {
                $('body').removeClass('noscroll');
                this.$dialog && this.$dialog.addClass('none');
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
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="cctv7-meet-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<div class="dialog rule-dialog">')
                        ._('<div class="content border">')
                            ._('<div class="rule-con">')
                            ._("</div>")
                        ._("</div>")
                    ._("</div>")
                ._("</section>");
                return t.toString();
            }
        },

        showWin: {
            $dialog: null,
            open: function (temp, openFn, closeFn, customTemp) {
                this.customTemp = null;
                this.innerText = temp;
                this.closeFn = closeFn;
                this.customTemp = customTemp;
                H.dialog.open.call(this);
                this.event();
                if (openFn) {
                    openFn(this.$dialog);
                }
                this.changeText();
            },
            event: function () {
                var b = this;
                this.$dialog.find("#showWin-sure").unbind("click").click(function (c) {
                    c.preventDefault();
                    b.close()
                })
            },
            close: function () {
                this.$dialog && this.$dialog.addClass("none");

                if (this.closeFn) {
                    this.closeFn(this.$dialog);
                }
            },
            getText: function () {
                return this.innerText;

            },
            changeText: function () {
                this.$dialog.find(".safety-text").text(this.getText());
            },
            tpl: function () {
                if (!this.customTemp) {
                    var b = simpleTpl();
                    b._('<section class="modal" id="guide-dialog">')
                    ._('<div class="receive relocated">')
                    ._('<p class="safety-text">' + this.getText())
                    ._('</p>')
                    ._('<a href="javascript:void(0)" id="showWin-sure" class="activities-btn" data-collect="true" data-collect-flag="dn-podium-trybtn" data-collect-desc="关闭按钮">确定</a>')
                    ._('</div>')
                    ._('</section>');
                    return b.toString()
                } else {
                    return this.customTemp(this);

                }

            }
        },
        lottery: {
            $dialog: null,
            sto:null,
            open: function() {
                H.yao.canJump = false;
                H.yao.isCanShake = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                H.dialog.lottery.readyFunc();
            },
            close: function() {
                H.yao.canJump = true;
                this.$dialog && this.$dialog.remove();
                this.$dialog = null;
                H.yao.isCanShake = true;
            },
            event: function() {
                var me = this;
                this.$dialog.find('.lottery-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('#btn-award-ad').click(function(e) {
                    e.preventDefault();
                    if(me.check()){
                        var mobile = $.trim(me.$dialog.find('.mobile').val()),
                            name = $.trim(me.$dialog.find('.name').val()),
                            address = $.trim(me.$dialog.find('.address').val()),
                            postcode = $.trim(me.$dialog.find('.postcode').val());
                        getResult('api/lottery/award', {
                            oi: openid,
                            rn: encodeURIComponent(name),
                            ph: mobile,
                            ad: encodeURIComponent(address),
                            pc: postcode,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler', true, me.$dialog);
                    }
                });

            },
            readyFunc:function(){
                var me = this;
                $('#btn-award').click(function(e) {
                    e.preventDefault();
                    shownewLoading();
                    me.sto = setTimeout(function(){
                        H.yao.isCanShake = true;
                        hidenewLoading();
                    },15000);
                    if(!$('#btn-award').hasClass("flag")){
                        $('#btn-award').text("领取中");
                        $('#btn-award').addClass("flag");
                        me.close();
                        H.yao.isCanShake = false;
                        if(H.dialog.pt == 4){
                            //红包
                            me.close();
                            location.href = H.dialog.redpack;
                        }else if(H.dialog.pt == 7){
                            H.yao.wxCheck = false;
                            setTimeout(function(){
                                me.wx_card();
                            },1000);
                        }
                    }

                });
            },
            wx_card:function(){
                var me = this;
                //卡券
                wx.addCard({
                    cardList: [{
                        cardId: H.dialog.ci,
                        cardExt: "{\"timestamp\":\""+ H.dialog.ts +"\",\"signature\":\""+ H.dialog.si +"\"}"
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
                        H.yao.isCanShake = true;
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "cctv7-meet-card-fail");
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
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                        //中奖
                        ._('<div class="lott none" id="lott">')
                            ._('<div class="contip">')
                                ._('<p class="ltp"></p>')
                                ._('<img src="">')
                            ._('</div>')
                            ._('<div class="conbg">')
                                ._('<a class="btn-award" id="btn-award" data-collect="true" data-collect-flag="cctv7-meet-redbtn" data-collect-desc="乡约抽奖弹层-领取按钮">领取</a>')
                            ._('</div>')
                        ._('</div>')
                        ._('<div class="lott-ad none" id="lott-ad">')
                            ._('<div class="contip-ad">')
                                ._('<p class="ltp"></p>')
                                ._('<img src="">')
                            ._('</div>')
                            ._('<div class="conbg-ad">')
                                ._('<p class="contact">请填写您的联系方式以便顺利领奖</p>')
                                ._('<p class="ipt"><input type="text" class="name" placeholder="姓名" /></p>')
                                ._('<p class="ipt"><input type="number" class="mobile" placeholder="手机号码" /></p>')
                                ._('<p class="ipt"><input type="text" class="address" placeholder="收件地址" /></p>')
                                ._('<p class="ipt"><input type="number" class="postcode" placeholder="邮编" /></p>')
                                ._('<a class="btn-award" id="btn-award-ad" data-collect="true" data-collect-flag="cctv7-meet-combtn" data-collect-desc="乡约抽奖弹层-提交按钮">领取</a>')
                            ._('</div>')
                            ._('<div class="success-ad none">')
                                ._('<p class="succ">领取成功！</p>')
                                ._('<p class="contact">请耐心等待工作人员与您联系</p>')
                                ._('<a class="btn-award lottery-close" id="btn-close-ad" data-collect="true" data-collect-flag="cctv7-meet-suretn" data-collect-desc="乡约抽奖弹层-确定按钮">确定</a>')
                            ._('</div>')
                        ._('</div>')
                    ._('</div>')
                ._('</div>');
                return t.toString();
            },
            update: function(data) {
                var me = this;
                if(data&& data.result == true){
                    if(data.pt == 4 || data.pt == 7){
                        $("#audio-b").get(0).play();//中奖声音
                        $(".contip").find("img").attr("src",data.pi);
                        $(".ltp").html(data.tt);
                        H.dialog.pt = data.pt;
                        this.$dialog.find("#lott").removeClass("none");
                        if(data.pt == 4){
                            H.dialog.redpack = data.rp;
                        }else if(data.pt == 7){
                            H.dialog.ci = data.ci;
                            H.dialog.ts = data.ts;
                            H.dialog.si = data.si;
                        }
                    }else if(data.pt == 0){
                        me.close();
                        H.yao.thanks();
                    }else if(data.pt == 1){
                        $("#audio-b").get(0).play();//中奖声音
                        $(".contip-ad").find("img").attr("src",data.pi);
                        $(".contip-ad").find(".ltp").html(data.tt);
                        H.dialog.pt = data.pt;
                        $(".name").attr("value",data.rn);
                        $(".mobile").attr("value",data.ph);
                        $(".address").attr("value",data.ad);
                        $(".postcode").attr("value",data.pc);
                        $(".conbg-ad").removeClass("none");
                        $(".success-ad").addClass("none");
                        this.$dialog.find("#lott-ad").removeClass("none");
                    }else{
                        me.close();
                        H.yao.thanks();
                    }
                }
            },
            check:function(){
                var me = this, $mobile = me.$dialog.find('.mobile'),
                    mobile = $.trim($mobile.val()),
                    $name = me.$dialog.find('.name'),
                    name = $.trim($name.val()),
                    $address = me.$dialog.find('.address'),
                    address = $.trim($address.val()),
                    $postcode = me.$dialog.find('.postcode'),
                    postcode = $.trim($postcode.val());

                if (name.length < 2 || name.length > 30) {
                    showTips('姓名长度为2~30个字符',4);
                    $name.focus();
                    return false;
                }
                if (!/^\d{11}$/.test(mobile)) {
                    showTips('这手机号，可打不通哦...',4);
                    $mobile.focus();
                    return false;
                }
                if (address.length < 5 || address.length > 30) {
                    showTips('地址长度为5~30个字符',4);
                    $address.focus();
                    return false;
                }
                if (postcode.length < 5 || postcode.length > 10) {
                    showTips('邮编输入不正确',4);
                    $postcode.focus();
                    return false;
                }
                return true;
            }
        }
    };
    
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};

    W.callbackLotteryAwardHandler = function(data) {
        if (data.result) {
            if(H.dialog.pt != 7){
                $(".conbg-ad").addClass("none");
                $(".success-ad").removeClass("none");
                return;
            }
        }
    };
    
})(Zepto);

$(function() {
    H.dialog.init();
});
