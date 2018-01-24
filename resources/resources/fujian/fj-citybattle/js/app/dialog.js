(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        iscroll: null,
        init: function() {
            var me = this;
            this.$container.delegate('.btn-close', 'click', function(e) {
                e.preventDefault();
                $(this).closest('.modal').addClass('none');
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
                var ruleW = Math.ceil(winW * 0.8);
                var ruleH = Math.ceil(ruleW * 778 / 522);
                H.dialog.open.call(this);
                this.event();
                getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
                $('.rule-dialog').css({
                    'width': ruleW,
                    'height': ruleH,
                    'top': (winH - ruleH) / 2,
                    'bottom': (winH - ruleH) / 2,
                    'left': (winW - ruleW) / 2,
                    'right': (winW - ruleW) / 2
                });
            },
            close: function() {
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
                this.$dialog.find('.rule').html(rule);
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="rule-dialog">')
                ._('<div class="dialog rule-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-fjdushi-citybattle-ruledialog-close-btn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<div class="content border">')
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
