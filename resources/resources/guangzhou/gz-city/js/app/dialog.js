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
				top = $(window).scrollTop() + height * 0.10;

			$('.modal').css({'width': width}).find('.btn-close').css({
				'right': width * 0.10 + 10,
				'top': top + 10
			});
			$('.rule-dialog').each(function () {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({
					'width': width * 0.80,
					'height': height * 0.70,
					'left': width * 0.10,
					'right': width * 0.10,
					'top': top,
					'bottom': height * 0.15
				});
			});

            $('.guide-dialog').each(function () {
                if ($(this).hasClass('relocated')) {
                    return;
                }
                top = $(window).scrollTop() + height * 0.20;
                $(this).css({
                    'width': width * 0.80,
                    'height': height * 0.60,
                    'left': width * 0.10,
                    'right': width * 0.10,
                    'top': top,
                    'bottom': height * 0.2
                });
            });
		},

		// 规则
		rule: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();

				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
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
					._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="gz-live-ruledialog-closebtn" data-collect-desc="第一现场规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
					._('<h2>活动规则</h2>')
					._('<div class="content">')
					._('<div class="rule-con"></div>')
					._('</div>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
        //引导
        guide: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();

                var me = this;
                setTimeout(function() {
                    //me.close();
                }, 5000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-try').click(function(e) {
                    e.preventDefault();

                    me.close();
                });
            },
            close: function() {
                this.$dialog && this.$dialog.addClass('none');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-guide" id="guide-dialog">')
                    ._('<div class="dialog guide-dialog">')
                    ._('<div class="title">看《城市话题》微信摇一摇</div>')
                    ._('<div class="guide-content"><p class="ellipsis"><label>1</label>打开电视，锁定直播广州</p>')
                    ._('<p class="ellipsis"><label>2</label>打开微信，进入摇一摇(电视)</p>')
                    ._('<p class="ellipsis"><label>3</label>对着电视摇一摇</p>')
                    ._('<a href="#" class="btn-try" data-collect="true" data-collect-flag="hb-wdh-guide-trybtn" data-collect-desc="引导弹层-关闭按钮"></a></div>')
                    ._('</div>')
                    ._('</section>');
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

H.dialog.init();
