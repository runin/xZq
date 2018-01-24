(function($) {
    H.dialog = {
        ci:null,
        ts:null,
        si:null,
        $container: $('body'),
        sau: '',
        lru: '',
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
            this.$dialog.animate({'opacity':'1'}, 500);
            this.$dialog.find('.dialog').addClass('bounceInDown');
            setTimeout(function(){
                $('.btn-wheel').animate({'-webkit-transform': 'rotate(360deg)'}, 300);
                me.$dialog.find('.dialog').removeClass('bounceInDown');
            }, 1000);
        },
        relocate : function(){
            var height = $(window).height(), width = $(window).width();
            $('.modal').each(function() {
                $(this).css({
                    'width': width,
                    'height': height
                });
            });
            $('.dialog').each(function() {
                $(this).css({
                    'width': width,
                    'left': 0,
                    'top': height * 0.1
                });
            });
        },
        thanksLottery: {
            $dialog: null,
            open: function() {
                H.yao.canShake = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                var height = $(window).height(), width = $(window).width();
                setTimeout(function(){
                    me.close();
                },1500);
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    H.yao.canShake = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('#btn-thanks-continue').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="thanks-dialog">')
                    ._('<section class="dialog thanks-dialog">')
                    ._('<img class="icon-denglong" src="./images/icon-denglong.png">')
                    ._('<img class="icon-bianpao" src="./images/icon-bianpao.png">')
                    ._('<section class="dialog-content thanks-content">')
                    ._('<img class="thanks-tips" src="./images/thanks-tip.jpg">')
                    ._('</section>')
                    ._('</section>')
                    ._('</section>');
                return t.toString();
            }
        },
    };
})(Zepto);

$(function() {
    H.dialog.init();
});