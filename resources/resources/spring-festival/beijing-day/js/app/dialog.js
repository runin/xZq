(function($) {

	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			}).delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
			}).delegate('.btn-result', 'click', function(e) {
				e.preventDefault();
				H.dialog.result.open();
			}).delegate('.btn-lottery', 'click', function(e) {/** 抽奖事件**/
				e.preventDefault();
				H.dialog.lottery.open();
			}).delegate('.btn-comeon', 'click', function(e) {
				e.preventDefault();
				H.dialog.guide.open();
			}).delegate('.btn-download', 'click', function(e) {
				e.preventDefault();
				H.dialog.download.open();
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
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.06;

			$('.modal').each(function() {
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 - 15, 'top': top - 15})
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
		
		//引导
		guide: {
			$dialog: null,
			closePage: false,
			open: function(closePage) {
				this.closePage = closePage;
				
				H.dialog.open.call(this);
				this.event();
				
				var me = this;
				if (!me.closePage) {
					setTimeout(function() {
						me.close();
					}, 8000);
				}
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-try').click(function(e) {
					e.preventDefault();
					
					window['localStorage'].bjcwGuided = true;
					me.close();
					
					if (me.closePage) {
						wx.ready(function() {
							wx.closeWindow();
						});
					}
				});
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog relocated">')
						._('<h2></h2>')
						._('<p><label>1.</label>打开电视收看北京电视台春晚</p>')
						._('<p><label>2.</label>打开微信进入“发现”打开“摇一摇”</p>')
						._('<p><label>3.</label>选择“电视”，对着电视摇一摇</p>')
						._('<h3>即有丰厚互动大奖等着您！</h3>')
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="yg-guide-trybtn" data-collect-desc="引导弹层-关闭按钮">等下就去试试</a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		//引导
		tips: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-now').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-tips" id="tips-dialog">')
					._('<div class="dialog tips-dialog relocated">')
						._('<div class="content">摇得很辛苦吧，您小歇一会儿，和家人一起聊聊家常，看看北京春晚吧！</div>')
						._('<a href="#" class="btn btn-now">马上就去</a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		confirm: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
				$('#share').trigger('click');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-now').click(function(e) {
					e.preventDefault();
					
					window.location.href = 'star.html';
				});
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-tips" id="confirm-dialog">')
					._('<div class="dialog tips-dialog confirm-dialog relocated">')
						._('<div class="content">您的贺卡已发送成功！</div>')
						._('<a href="#" class="btn btn-now">继续发贺卡</a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		//引导
		download: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
				$('body').addClass('noscroll');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			close: function() {
				$('body').removeClass('noscroll');
				this.$dialog.remove();
				this.$dialog = null;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-download" id="download-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yg-ruledialog-closebtn" data-collect-desc="下载弹层-关闭按钮"></a>')
					._('<div class="dialog download-dialog">')
						._('<iframe src="http://pay.xiaojukeji.com/share/tmp_download.html?t='+ (new Date().getTime()) +'"></iframe>')
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
				
				var me = this;
				
				$('body').addClass('noscroll');
				getResult({
					url: 'common/rule', 
					jsonpCallback: 'callbackRuleHandler',
					success: function(data) {
						if (data.code == 0 && data.rule) {
							me.update(data.rule);
						}
					},
					error: function() {
						H.dialog.tips.open();
					}
				});
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
				this.$dialog.find('.rule').html(rule).removeClass('hidden');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yg-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
						._('<h2></h2>')
						._('<div class="content border">')
							._('<div class="hidden rule"></div>')
						._('</div>')
						._('<p class="dialog-copyright">本活动最终解释权归“北京电视台”所有</p>')
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
