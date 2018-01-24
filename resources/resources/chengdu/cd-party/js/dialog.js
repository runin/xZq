(function($) {
	
	H.dialog = {
		puid: 0,
		$container: $('#main'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		init: function () {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function (e) {
				e.preventDefault();
				H.dialog.rule.open();
			}).delegate('.btn-close', 'click', function (e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
			}).delegate('.btn-comeon', 'click', function (e) {
				e.preventDefault();
				H.dialog.guide.open();
			});
		},
		close: function () {
			$('.modal').addClass('none');
		},
		open: function () {
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

			$('.modal').css({'width': width, 'height': height}).find('.btn-close').css({
				'right': width * 0.10 - 15,
				'top': top - 15
			});
			$('.dialog').each(function () {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({
					'width': width * 0.80,
					'height': height * 0.88,
					'left': width * 0.10,
					'right': width * 0.10,
					'top': top,
					'bottom': height * 0.10
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
					._('<p class="ellipsis"><label class="fir"></label><span>打开电视<br/>观看成都电视台第二频道跨年晚会</span></p>')
					._('<p class="ellipsis"><label class="sec"></label><span class="sec-span">打开微信，进入摇一摇，<br/>选择“歌曲”，摇动手机</span></p>')
					._('<p class="ellipsis fina"><label class="thir"></label>即可参与有奖互动</p>')
					._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="cd-party-guide-trybtn" data-collect-desc="成都跨年晚会引导弹层-关闭按钮">等下去试试</a>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},

		// 规则
		rule: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();

				getResult('party/quiz/index', {}, 'quizIndexHandler', true, this.$dialog);
			},
			close: function () {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function () {
				var me = this;
				this.$dialog.find('.close').click(function (e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function (rule) {
				this.$dialog.find('.rule-con').html(rule).closest('.content').removeClass('none');
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-rul" id="rule-dialog">')
					._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="cd-party-ruledialog-closebtn" data-collect-desc="成都跨年晚会规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
					._('<h2>活动规则</h2>')
					._('<div class="content border">')
					._('<div class="rule-con"></div>')
					._('</div>')
					._('<p class="dialog-copyright"><a href="#" class="btn my-zhidao close" data-collect="true" data-collect-flag="cd-party-guide-trybtn" data-collect-desc="成都跨年晚会规则弹层-我知道了按钮">我知道了</a></p>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		}
	};

	W.quizIndexHandler = function(data) {};
	
})(Zepto);

H.dialog.init();
