(function($) {
    H.dialog = {
        puid: 0,
        ci:null,
        ts:null,
        si:null,
        $container: $('body'),
        init: function() {
            var me = this, height = $(window).height(), width = $(window).width();
            $('body').css({
                'width': width,
                'height': height
            });
            $('body').delegate('input', 'focus', function (e) {
                e.preventDefault();
                $('.modal').css('overflow-y', 'scroll');
            }).delegate('input', 'blur', function (e) {
                e.preventDefault();
                $('.modal').css('overflow-y', 'hidden');
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
            $('.btn-close').animate({'opacity':'1'}, 1000);
            this.$dialog.find('.dialog').addClass('bounceInDown');
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
        },
        Redlottery: {
            $dialog: null,
            rp:null,
            open: function(data) {
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                var winW = $(window).width(), winH = $(window).height();
                var lotteryW = winW * 0.8,
                    lotteryH = winH * 0.7,
                    lotteryT = (winH - lotteryH) / 2,
                    lotteryL = (winW - lotteryW) / 2;
                $('.redlottery-dialog').css({
                    'width': lotteryW,
                    'height': lotteryH,
                    'top': lotteryT,
                    'left': lotteryL
                });
                $('.btn-close').css({
                    'top': lotteryT,
                    'right': lotteryL
                });
                me.update(data);
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
                $("#Redlottery-dialog").click(function(){
                    if(!$('#btn-red').hasClass("requesting") && me.rp){
                        shownewLoading();
                        $('#btn-red').addClass("requesting");
                        $('#btn-red').text("领取中");
                        setTimeout(function(){
                            location.href = me.rp;
                        },500);
                    }
                });
            },
            update: function(data) {
                var me = this;
                if(data.result && data.pt == 4){
                    me.rp = data.rp;
                    $(".redlottery-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    $(".redlottery-dialog").find(".award-logo").attr("src",data.qc).attr("onerror","$(this).addClass(\'none\')");
                    $(".redlottery-dialog").find(".award-lpt").html(data.tt);
                    $(".redlottery-dialog").find(".award-ly").html(data.aw);
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery" id="Redlottery-dialog">')
                    ._('<div class="dialog redlottery-dialog">')
                    ._('<p class="award-lpt"></p>')
                    ._('<img class="award-logo" src="./images/gift-blank.png">')
                    ._('<img class="award-img" src="./images/gift-blank.png">')
                    ._('<a class="lottery-btn" id="btn-red" data-collect="true" data-collect-flag="dialog-task-red-close-btn" data-collect-desc="中奖弹层业务类(红包)-领取按钮">领&nbsp;&nbsp;取</a>')
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
                var winW = $(window).width(), winH = $(window).height();
                var lotteryW = winW * 0.8,
                    lotteryH = winH * 0.50,
                    lotteryT = (winH - lotteryH) / 2,
                    lotteryL = (winW - lotteryW) / 2;
                $('.thanks-dialog').css({
                    'width': lotteryW,
                    'height': lotteryH,
                    'top': lotteryT,
                    'left': lotteryL
                });
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                setTimeout(function(){
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
                var t = simpleTpl();
                t._('<section class="modal modal-rul" id="thanks-dialog">')
                    ._('<div class="dialog thanks-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dialog-task-quan-link-close-btn" data-collect-desc="中奖弹层业务类(卡券-外链)-关闭按钮"></a>')
                    ._('<img class="thanks-title" src="./images/thanks-title.png">')
                    ._('<img class="thanks-bg" src="./images/thanks-bg.jpg">')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        }

    };
})(Zepto);

$(function() {
    H.dialog.init();
});
