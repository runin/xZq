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

		// 规则
		rule: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();

				getResult('common/activtyRule/'+serviceNo, {}, 'callbackRuleHandler', true, this.$dialog);
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
					._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="cd-express-ruledialog-closebtn" data-collect-desc="深夜快递规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
					._('<h2>活动规则</h2>')
					._('<div class="content border">')
					._('<div class="rule-con"></div>')
					._('</div>')
					._('<p class="dialog-copyright"><a href="#" class="btn my-zhidao close" data-collect="true" data-collect-flag="cd-express-guide-trybtn" data-collect-desc="深夜快递规则弹层-我知道了按钮">我知道了</a></p>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
		lottery: {
			$dialog: null,
			open: function(data) {
				var me = this;
				H.dialog.open.call(this);
				me.update(data);
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
				$('.masking-box').addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.clear();
					me.close();
				});

				$('#btn-award').click(function(e) {
					e.preventDefault();

					if (!me.check()) {
						return false;
					}

					var mobile = $.trim(me.$dialog.find('.mobile').val()),
						name = $.trim(me.$dialog.find('.name').val()),
						address = $.trim(me.$dialog.find('.address').val());

					me.disable();
					$('#btn-award').addClass('none');
					me.butt_loading();
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						rn: name ? encodeURIComponent(name) : "",
						ph: mobile ? mobile : ""
					}, 'callbackLotteryAwardHandler');
					H.dialog.lottery.enable();
					H.dialog.lottery.succ();
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

				return true;
			},
			enable: function() {
				this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
			},
			disable: function() {
				this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
			},
			butt_loading: function() {
				var t = simpleTpl();
				t._(' <div class="loader">')
					._('<span></span>')
					._('<span></span>')
					._('<span></span>')
					._('<span></span>')
					._('<span></span>')
					._('</div>');
				$('.dialog-copyright').before(t.toString());
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="cd-express-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						//未中奖
						._('<div class="not-lott" id="not-lott">')
							._('<img src="images/open-li.png">')
							._('<h1>很遗憾没有中奖 <br />下个抽奖时段再试试！</h1>')
							._('<a class="btn lottery-close lott-back" data-collect="true" data-collect-flag="cd-express-sharebtn" data-collect-desc="返回按钮">返 回</a>')
						._('</div>')
						//没有openid
						._('<div class="not-lott none" id="not-openid">')
							._('<img src="images/open-li.png">')
							._('<h1>努力加载中，请稍候~~</h1>')
							._('<a class="btn lottery-close lott-back" data-collect="true" data-collect-flag="cd-express-sharebtn" data-collect-desc="返回按钮">返 回</a>')
						._('</div>')
						//中奖
						._('<div class="lott none" id="lott">')
							._('<img src="">')
							._('<h2>-</h2>')
							._('<h1>请填写您的联系方式以便顺利领奖</h1>')
							._('<input type="text" class="name" placeholder="姓名：(必填)" />')
							._('<input type="number" class="mobile" placeholder="电话： 例：13888888888 (必填)" />')
							._('<a class="btn btn-share bth-aw btn-award" id="btn-award" data-collect="true" data-collect-flag="cd-express-combtn" data-collect-desc="深夜快递-确定按钮">确定</a>')
							._('<p class="da-tips none">')
								._('<a class="lottery-close" data-collect="true" data-collect-flag="cd-express-back" data-collect-desc="深夜快递-返回按钮">返回</a>')
							._('</p>')
						._('</div>')
						._('<p class="dialog-copyright">活动详情可咨询CDTV2公众微信号</br> 活动最终解释权归成都第二频道所有</p>')
					._('</div>')
					._('</section>');
				return t.toString();
			},
			update: function(data) {
				if(data){
					if(data.pt == 1){
						$("#lott").find("img").attr("src",data.pi);
						$("#lott").find("h2").html(data.tt);
						this.$dialog.find("#not-lott").addClass("none");
						this.$dialog.find("#lott").removeClass("none");
					}else if(data.pt == 0){
						if(data.pi){
							$("#not-lott").find("img").attr("src",data.pi);
						}
						if(data.tt){
							$("#not-lott").find("h1").html(data.tt);
						}
					}
				}
			},
			no_openid: function() {
				this.$dialog.find("#not-lott").addClass("none");
				this.$dialog.find("#lott").addClass("none");
				this.$dialog.find("#not-openid").removeClass("none");
			},
			clear:function(){
				this.$dialog.find("#not-lott").removeClass("none");
				this.$dialog.find("#lott").addClass("none");
				this.$dialog.find('input').removeAttr('disabled').val("").css('border','1px solid #D3D3D3');
				this.$dialog.find('#btn-award').removeClass('none').addClass('btn btn-share bth-aw btn-award');
				this.$dialog.find('#lott h1').text('请填写您的联系方式以便顺利领奖');
			},
			succ: function() {
				$('.loader').addClass('none');
				this.$dialog.find('input').attr('disabled','disabled').css('border','none');
				this.$dialog.find('#btn-award').addClass('none');
				this.$dialog.find('.da-tips').removeClass('none');
				var mob = this.$dialog.find('.mobile').val();
				var nam = this.$dialog.find('.name').val();
				this.$dialog.find('.mobile').val(mob);
				this.$dialog.find('.name').val(nam);
				this.$dialog.find('#lott h1').text('以下是您的联系方式');
			}
		}
	};

	W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};
	
	W.callbackLotteryAwardHandler = function(data) {
	}
	
})(Zepto);

H.dialog.init();
