(function($) {
    H.dialog = {
        ci:null,
        ts:null,
        si:null,
        $container: $('body'),
        init: function() {
            var me = this, width = $(window).width(), height = $(window).height();
            $('body').css({
                'width': width,
                'height': height,
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
                    'top': height * 0.10
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
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
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
                this.$dialog.find('#btn-shiwuLottery-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    $("#shiwu-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#shiwu-dialog").find(".after h5").html(data.tt || '');
                    $("#shiwu-dialog").find(".name").val(data.rn ? data.rn : '');
                    $("#shiwu-dialog").find(".phone").val(data.ph ? data.ph : '');
                    $("#shiwu-dialog").find(".before").removeClass('none');
                    $("#shiwu-dialog").find(".after").addClass('none');
                    $('.shiwu-dialog').css({
                        'top': $(window).height() * 0.18
                    });
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
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-close" data-collect-desc="弹层(实物)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<p class="award-luckTips"><img src="./images/icon-luckytips.png"></p>')
                            ._('<p class="award-keyTips"></p>')
                            ._('<img class="award-img" src="./images/default-award.png">')
                            ._('<section class="input-box before">')
                                ._('<h5>请填写完整信息，否则视为放弃</h5>')
                                ._('<p><input class="name" type="text" placeholder="姓名"></p>')
                                ._('<p><input class="phone" type="tel" placeholder="电话"></p>')
                            ._('</section>')
                            ._('<section class="info-box after">')
                                ._('<h5></h5>')
                                ._('<p class="info-name">姓名：<label></label></p>')
                                ._('<p class="info-phone">电话：<label></label></p>')
                            ._('</section>')
                            ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award before" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物)-领取按钮">领&nbsp;&nbsp;&nbsp;取</a>')
                            ._('<section class="btn-lottery-box after">')
                                ._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-close" id="btn-shiwuLottery-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-close" data-collect-desc="弹层(实物)-继续摇奖按钮">继续摇奖</a>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
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