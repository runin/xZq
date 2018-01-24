(function($) {
     var height = $(window).height(),
         width = $(window).width();
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        iscroll: null,
       
        init: function() {
            var me = this;
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
            top = $(window).scrollTop() + height * 0.06;
            $('.modal').each(function() {
                $(this).css({ 'width':width,'height': height}).find('.btn-close').css({'right': width * 0.06 - 15, 'top': top - 15})
            });
            $('.dialog').each(function() {
                if ($(this).hasClass('relocated')) {
                    return;
                }
                $('.rule-dialog').css({ 
                    'width': width*0.8, 
                    'height': height * 0.54, 
                    'left':'50%',
                    'top': height * 0.15,
                    'margin-left':-(width*0.8)/2,
                });
                 $('.rule-con').css({ 
                    'height': height * 0.54-100, 
                });
            });
        },
         
       	// 规则
		rule: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();
			},
			close: function () {
                $('#index-ok').removeClass('botton-ok-after').addClass('botton-ok');
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function () {
				var me = this;
				this.$dialog.find('.close').click(function (e) {
					e.preventDefault();
                     me.close();
				});
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-rule" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
                    ._('<p><span class="close" >X</span></p>')
					._('<h3></h3>')
                    ._('<h4></h4>')
					._('<div class="rule-con">')
                    ._('<img src="./images/pop-label.png" class="pop-label" >')
                    ._('</div>')
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
