(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        iscroll: null,
        init: function() {
            var me = this;
            this.$container.delegate('.f_rule', 'click', function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            }).delegate('.btn-close', 'click', function(e) {
                e.preventDefault();
                $(this).closest('.modal').addClass('none');
            })
			
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
                //top = $(window).scrollTop() + height * 0.06;
				top = height * 0.06;
				
            $('.modal').each(function() {
                //$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 - 30, 'top': top - 40})
            });
			
            $('.dialog').each(function() {
                if ($(this).hasClass('relocated')) {
                    return;
                }
                $(this).css({ 
                    'width': width * 0.88, 
                    'height': height * 0.88, 
                    'left': width * 0.06,
                    'right': width * 0.06,
                    'top': top,
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
                ._('<div class="dialog rule-dialog">')
				._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dn-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                ._("<h2></h2>")
                ._('<div class="content border">')
                ._('<div class="rule-con">')
				._("<h4>一、活动规则：</h4>")
                ._("<p>1.&nbsp;&nbsp;1. 中超足球</p>")
                ._("</div>")
                ._("</div>")
                ._('<p class="dialog-copyright">页面由甘肃卫视提供<br/>新掌趣科技制作 & Powered by holdfun.cn</p>')
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
