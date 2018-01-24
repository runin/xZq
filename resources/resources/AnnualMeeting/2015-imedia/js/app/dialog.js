H.dialog = {
    ci:null,
    ts:null,
    si:null,
    $container: $('body'),
    init: function() {
        $('.modal').css({
            'width': $(window).width(),
            'height': $(window).height(),
            'overflow': 'hidden'
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
        $('.dialog').each(function() {
            $(this).css({
                'width': width * 0.88, 
                'left': width * 0.06,
                'top': height * 0.18
            });
        });
    },
    shiwuLottery: {
        $dialog: null,
        name: '',
        mobile: '',
        open: function(data) {
            H.index.isCanShake = false;
            H.index.canJump = false;
            var me =this,$dialog = this.$dialog;
            H.dialog.open.call(this);
            if (!$dialog) {
               this.event();
            }
            me.update(data);
        },
        close: function() {
            var me = this;
            this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
            this.$dialog.animate({'opacity':'0'}, 1000);
            setTimeout(function(){
                H.index.isCanShake = true;
                H.index.canJump = true;
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
            }, 1000);
        },
        event: function() {
            var me = this;
            this.$dialog.find('#btn-shiwuLottery-award').click(function(e) {
                e.preventDefault();
                if(me.check()) {
                    if(!$('#btn-shiwuLottery-award').hasClass("flag")){
                        $('#btn-shiwuLottery-award').addClass("flag");
                        shownewLoading();
                        getResult('api/lottery/award', {
                            oi: openid,
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            rn: me.name ? encodeURIComponent(me.name) : "",
                            ph: me.mobile ? me.mobile : ""
                        }, 'callbackLotteryAwardHandler');
                        $("#shiwu-dialog").find(".info-name label").text(me.name);
                        $("#shiwu-dialog").find(".info-phone label").text(me.mobile);
                        shownewLoading();
                        setTimeout(function(){
                            $("#shiwu-dialog").find(".before").addClass('none');
                            $("#shiwu-dialog").find(".after").removeClass('none');
                            hidenewLoading();
                        }, 200);
                    }
                }
            });
        },
        update: function(data) {
            var me = this;
            if(data.result){
                $("#shiwu-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                $("#shiwu-dialog").find(".name").val(data.rn ? data.rn : '');
                $("#shiwu-dialog").find(".phone").val(data.ph ? data.ph : '');
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
            }
            me.name = name;
            me.mobile = mobile;
            return true;
        },
        tpl: function() {
            var t = simpleTpl();
            t._('<section class="modal modal-shiwu" id="shiwu-dialog">')
                ._('<section class="dialog shiwu-dialog">')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<section class="fly-box"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></section>')
                ._('</section>')
                ._('<section class="icon-rays" id="icon-rays"></section>')
            ._('</section>');
            return t.toString();
        }
    },
    redbagLottery: {
        $dialog: null,
        rp:null,
        open: function(data) {
            H.index.isCanShake = false;
            H.index.canJump = false;
            var me =this, $dialog = this.$dialog, winW = $(window).width(), winH = $(window).height();
            H.dialog.open.call(this);
            if (!$dialog) {
               this.event();
            }
            me.update(data);
        },
        close: function() {
            var me = this;
            me.$dialog && me.$dialog.remove();
            me.$dialog = null;
        },
        event: function() {
            var me = this;
            $(".redbag-dialog").click(function(e){
                e.preventDefault();
                if(!$('.redbag-dialog').hasClass("flag")) {
                    shownewLoading(null, '红包领取中...');
                    $('.redbag-dialog').addClass("flag");
                    setTimeout(function(){
                        location.href = H.dialog.redbagLottery.rp;
                    },50);
                }
            });
        },
        update: function(data) {
            var me = this, height = $(window).height();
            if(data.result){
                me.rp = data.rp;
                $("#redbag-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
            }
        },
        tpl: function() {
            var t = simpleTpl();
            t._('<section class="modal modal-redbag" id="redbag-dialog">')
                ._('<section class="dialog redbag-dialog">')
                    ._('<img class="award-img" src="./images/default-award.png">')
                    ._('<section class="fly-box"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></section>')
                ._('</section>')
                ._('<section class="icon-rays" id="icon-rays"></section>')
            ._('</section>');
            return t.toString();
        }
    }
};

W.callbackLotteryAwardHandler = function(data) {};

$(function() {
    H.dialog.init();
});