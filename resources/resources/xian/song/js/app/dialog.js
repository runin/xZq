(function($) {
	
	H.dialog = {
		puid: 0,
		$container: $('#main'),
		REQUEST_CLS: 'requesting',
		height : $(window).height(),
		init: function() {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			}).delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
			}).delegate('.btn-lottery', 'click', function(e) {
				e.preventDefault();
				H.dialog.lottery.open();
			}).delegate('.btn-record', 'click', function(e) {
				e.preventDefault();
				H.dialog.record.open();
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

			$('.modal').css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 - 15, 'top': height * 0.06 - 15});
			$('.dialog').each(function() {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({ 
					'width': width * 0.88, 
					'height': height * 0.88,
					'left': width * 0.06,
					'right': width * 0.06,
					'bottom': height * 0.06
				});
				var $box = $(this).find('.box');
				if ($box.length > 0) {
					$box.css('height', height * 0.38);
				}
			});

			if (is_android()) {
				$('input').each(function() {

					$(this).focus(function(){
						setInterval(function(){
							if(H.dialog.height != $(window).height()){
								$('.dialog').css({
									'bottom': -height * 0.12
								});
							}else{
								$('.dialog').css({
									'bottom': H.dialog.height * 0.06
								});
							}
						},500)
					});
				});
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="xian-song-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
						._('<h2></h2>')
						._('<div class="content border none">')
							._('<div class="rule"></div>')
						._('</div>')
						._('<p class="dialog-copyright">本活动最终解释权归西安广播电视台所有</p>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		lottery: {
			$dialog: null,
			open: function() {
				var $dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
				$('.masking-box').addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.clear();
					me.close();
				});

				this.$dialog.find('.btn-award').click(function(e) {
					e.preventDefault();

					if (!me.check()) {
						return false;
					}

					var mobile = $.trim(me.$dialog.find('.mobile').val()),
						name = $.trim(me.$dialog.find('.name').val()),
						address = $.trim(me.$dialog.find('.address').val());

					me.disable();
					getResult('vote/award', {
						pluid: me.puid,
						ph: mobile,
						un: encodeURIComponent(name),
						openid: openid
					}, 'awardHander', this.$dialog);
				});
			},
			check: function() {
				var me = this;

					var $mobile = me.$dialog.find('.mobile'),
						$name = me.$dialog.find('.name'),
						mobile = $.trim($mobile.val()),
						name = $.trim($name.val());

					if (!name) {
						alert('请先输入姓名');
						$name.focus();
						$(this).removeClass(me.REQUEST_CLS);
						return false;
					}
					if (!mobile || !/^\d{11}$/.test(mobile)) {
						alert('请先输入正确的手机号');
						$mobile.focus();
						$(this).removeClass(me.REQUEST_CLS);
						return false;
					}

					$('.mobile').val(mobile);
				return true;
			},
			enable: function() {
				this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
			},
			disable: function() {
				this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="xian-song-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						//未中奖
						._('<div class="not-lott " id="not-lott">')
							._('<img src="images/open-li.png">')
							._('<h1>很遗憾，没抽中哦，再接再厉吧</h1>')
							._('<a href="javascript:share();" class="btn btn-share" data-collect="true" data-collect-flag="xian-song-sharebtn" data-collect-desc="唱响中国-分享按钮">邀请小伙伴来抽奖</a>')
							._('<p class="da-tips"><a href="#" class="btn-record" data-collect="true" data-collect-flag="xian-song-rank" data-collect-desc="唱响中国-查看中奖纪录">查看中奖记录</a></p>')

						._('</div>')
						//中奖
						._('<div class="lott none" id="lott">')
							._('<img src="">')
							._('<h2>-</h2>')
							._('<h1>请填写您的联系方式以便顺利领奖</h1>')
							._('<input type="text" class="name" placeholder="姓名：" />')
							._('<input type="number" class="mobile" placeholder="电话：" />')
							._('<a class="btn btn-share bth-aw btn-award" id="btn-award" data-collect="true" data-collect-xian-song-combtn" data-collect-desc="唱响中国-确定按钮">确定</a>')
							._('<p class="da-tips"><a href="#" class="btn-record" data-collect="true" data-collect-flag="xian-song-rank" data-collect-desc="唱响中国-查看中奖纪录">查看中奖记录</a></p>')
						._('</div>')
						._('<p class="dialog-copyright">本活动最终解释权归西安广播电视台所有</p>')
					._('</div>')
					._('</section>');
				return t.toString();
			},
			update: function(data) {
				if(data.code == 0){
					this.puid = data.pluid;
					if(data.pt == 1){
						$("#lott").find("img").attr("src",data.piu);
						$("#lott").find("h2").text(data.ltp);
						this.$dialog.find("#not-lott").addClass("none");
						this.$dialog.find("#lott").removeClass("none");
					}
				}else{
					alert("系统繁忙，请稍候再试~");
				}
			},
			clear:function(){
				this.$dialog.find("#not-lott").removeClass("none");
				this.$dialog.find("#lott").addClass("none");
				this.$dialog.find('input').removeAttr('disabled');
				this.$dialog.find('#btn-award').removeClass('none').addClass('btn btn-share bth-aw btn-award');
				this.$dialog.find('#lott h1').text('请填写您的联系方式以便顺利领奖');
			},
			succ: function() {
				this.$dialog.find('input').attr('disabled','disabled');
				this.$dialog.find('#btn-award').addClass('none');
				this.$dialog.find('#lott h1').text('以下是您的联系方式，请等候工作人员联系');
			}
		},
		
		// 中奖记录
		record: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				H.dialog.lottery.clear();
				if(openid != null){
					getResult('vote/prize', {openid:openid}, 'prizeHandler', true, this.$dialog);
				}
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
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="xian-song-recoddialog-closebtn" data-collect-desc="中奖记录弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
						._('<h2 class="record-h2"></h2>')
						._('<div class="content border record-con">')
							._('<ul class="rule" id="rule-ul"></ul>')
						._('</div>')
						._('<p class="dialog-copyright">本活动最终解释权归西安广播电视台所有</p>')
					._('</div>')
					._('</section>');
				return t.toString();
			},
			list: function(data){
				var t = simpleTpl(), item = data || [], $rule_ul = $('#rule-ul');
				for ( var i = 0, len = item.length; i < item.length; i++) {
					t._('<li>')
						._('<i>' + (i + 1) + '</i><label>'+item[i].pd+'</label><span>'+item[i].pn+'</span>')
					._('</li>')
				}
				return $rule_ul.html(t.toString());
			}
		}
	};
	
	W.awardHander = function(data) {
		if (data.code == 0) {
			H.dialog.lottery.enable();
			H.dialog.lottery.succ();
			return;
		}
		alert(data.message);
	};
	
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
			H.dialog.record.list();
		}
	};
	
	W.prizeHandler = function(data){
		if(data.code == 0){
			H.dialog.record.list(data.items);
		}
	}
	
})(Zepto);
$(function(){
	H.dialog.init();
});
