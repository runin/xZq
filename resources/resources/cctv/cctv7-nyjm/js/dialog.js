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
                e.stopPropagation();
                H.dialog.rule.open();
            }).delegate('.close', 'click', function(e) {
                e.preventDefault();
                e.stopPropagation();
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
                this.$dialog.find('.close').click(function(e) {
                    e.preventDefault();
                    me.close();
                    $("body").removeClass("truepop");
                });
            },
            update: function(rule) {
                this.$dialog.find('.rule').html(rule).removeClass('none');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="rule-box" id="rule-dialog">')
                ._('<div class="rule">')
				  ._('<a href="#" class="close" id="closegz" data-collect="true" data-collect-flag="dn-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                  ._('<div class="rule-con">')
				    ._('<h2 class="rule-title"></h2>')
                    ._('<div class="rule-text">')
                    ._("</div>")
                  ._("</div>")
                ._("</div>")
                ._("</section>");
                $("body").addClass("truepop");
                return t.toString();
            }
        }
    };
    
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-text").html(data.rule);
		}
	};
    
})(Zepto);

$(function() {
    H.dialog.init();
});
