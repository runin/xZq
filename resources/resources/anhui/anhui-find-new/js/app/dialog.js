(function($) {
	
	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		height : $(window).height(),
		init: function() {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			}).delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				me.close();
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
		
		relocate: function () {
			var height = $(window).height(),
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.06;

			$('.modal').css({'width': width}).find('.btn-close').css({
				'right': width * 0.10 - 15,
				'top': top - 15
			});
			$('.dialog').each(function () {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({
					'width': width * 0.80,
					'height': height * 0.85,
					'left': width * 0.10,
					'right': width * 0.10,
					'top': top,
					'bottom': height * 0.10
				});
			});
		},
			//引导
		guide: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();

				var me = this;
				setTimeout(function () {
					me.close();
				}, 8000);
			},
			event: function () {
				var me = this;
				this.$dialog.find('.btn-try').click(function (e) {
					e.preventDefault();

					localStorage.guided = false;
					me.close();
				});
			},
			close: function () {
				this.$dialog && this.$dialog.addClass('none');
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog relocated">')
					._('<h2></h2>')
					._('<p class="ellipsis"><label class="fir"></label><span>打开电视，锁定安徽卫视</span></p>')
					._('<p class="ellipsis"><label class="sec"></label><span class="sec-span">打开微信，进入摇一摇(电视)</span></p>')
					._('<p class="ellipsis fina"><label class="thir"></label>摇动手机，即可参与栏目互动</p>')
					._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="anhui-find-new-guide-trybtn" data-collect-desc="安徽电视台我要找到你引导弹层-关闭按钮">等下去试试</a>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
		// 规则
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
				getResult('common/activtyRule/' + serviceNo, {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
				$('.masking-box').addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function(rule) {
				this.$dialog.find('.rule').html(rule).closest('.content').removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="anhui-find-new-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
						._('<h2></h2>')
						._('<div class="content border none">')
							._('<div class="rule"></div>')
						._('</div>')
						._('<p class="dialog-copyright">本活动最终解释权归安徽卫视《我要找到你》栏目所有</p>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		}
	};	
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
			H.dialog.record.list();
		}
	};	
})(Zepto);
$(function(){
	H.dialog.init();
});
