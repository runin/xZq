(function($) {
	H.dialog = {
		$container: $('body'),
		init: function() {
		},
		close: function() {
			$('.modal').addClass('none');
		},
		open: function() {
			var me = this;
			H.dialog.close();
			if (this.$dialog) {
				this.$dialog.removeClass('none');
			} else {
				this.$dialog = $(this.tpl());
				H.dialog.$container.append(this.$dialog);
			}
			this.$dialog.find('.dialog').addClass('dispshow');
            setTimeout(function(){
            	me.$dialog.find('.dialog').removeClass('dispshow');
            }, 1000);
		},
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
				var me = this;
				me.$dialog.find('.rule-dialog').addClass('disphide');
				setTimeout(function(){
					$('.rule-dialog').removeClass('disphide');
					$("#rule-dialog").addClass("none");
					$("#btn-rule").removeClass("requesting");
            	}, 1000);
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<div class="dialog-assist">')
							._('<div class="content">')
								._('<h1 class="rule-title">活动规则</h1>')
								._('<div class="rule none"></div>')
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		}

	};
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};
})(Zepto);

$(function() {
	H.dialog.init();
});