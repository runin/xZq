(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        iscroll: null,
        init: function() {
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
                width = $(window).width();
            $('.dialog').each(function() {
                if ($(this).hasClass('relocated')) {
                    return;
                }
                $(this).css({ 
                    'width': width * 0.88, 
                    'height': height * 0.88, 
                    'left': width * 0.06,
                    'right': width * 0.06,
                    'top': height * 0.06,
                    'bottom': height * 0.06
                });
            });
        },
        rule: {
            $dialog: null,
            open: function() {
                var winW = $(window).width(), winH = $(window).height();
                H.dialog.open.call(this);
                this.event();
                getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
                $('.rule-dialog').css({
                    'width': winW*0.8,
                    'height': winH*0.7,
                    'top': winH*0.20,
                    'bottom': winH*0.05,
                    'left': winW*0.1,
                    'right': winW*0.1
                });
            },
            close: function() {
                $(".rule-dialog").removeClass('bounceInUp');
                $(".rule-dialog").addClass('bounceOutUp');
                setTimeout(function(){
                    $(".rule-dialog").removeClass('bounceOutUp');
                    $('.modal').addClass("none");
                    $(".rule-dialog").addClass('bounceInUp');
                },1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(rule) {
                this.$dialog.find('.rule').html(rule);
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="rule-dialog">')
                ._('<div class="dialog rule-dialog bounceInUp">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="fjqy-shuadapai-ruledialog-close-btn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<div class="content border">')
                        ._('<p class="rule-title">活动规则</p>')
                        ._('<div class="rule-con">')
                        ._("</div>")
                    ._("</div>")
                ._("</div>")
                ._("</section>");
                return t.toString();
            }
        }
    };
    
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};
    
})(Zepto);

$(function() {
    H.dialog.init();
});
