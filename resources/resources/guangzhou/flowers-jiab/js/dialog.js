(function($) {
	
	H.dialog = {
		puid: 0,
		$container: $('#main'),
		
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
				top = $(window).scrollTop() + height * 0.06;

			$('.modal').css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 - 15, 'top': top - 15});
		},

		// tip
		tip: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				
				var me = this;
				setTimeout(function() {
					me.close();
				}, 1000);
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="tip-dialog">')
					._('<div class="dialog tip-dialog relocated">')
						._('<h2>投票成功</h2>')
					._('</div>')
				._('</section>');
				
				return t.toString();
			}
		}
	};
	
})(Zepto);
