(function($) {
	
	H.dialog = {
		puid: 0,
		$container: $('body'),
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
				top = $(window).scrollTop() + height * 0.15;
			$('.dialog').each(function () {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({
					'width': width * 0.80,
					'height': height * 0.74,
					'left': width * 0.10,
					'right': width * 0.10,
					'top': height * 0.13,
					'bottom': height * 0.13
				});
			});
			$(".rule-dialog").find(".content").height(height * 0.65-32);
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
					._('<div class="dialog rule-dialog">')
					._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="jx-jsbb-ruledialog-closebtn" data-collect-desc="经视播报规则弹层-关闭按钮"></a>')
						._('<h2>活动规则</h2>')
						._('<div class="content">')
						._('</div>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
		lottery: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
				$('.masking-box').addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
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
					$(".lott-fill").addClass('none');
					$(".info-confirm").removeClass('none');
					$(".lott").find("input").addClass("nonetext").addClass("none");
					me.butt_loading();
					getResult('api/lottery/award', {
						ph: mobile,
						rn: encodeURIComponent(name),
						ad :encodeURIComponent(address),
						oi: openid
					}, 'callbackLotteryAwardHandler');
				});
				$('#btn-red').click(function(e) {
					e.preventDefault();
					toUrl($(this).attr("data-href"));
				});
			},
			check: function() {
				var me = this;

					var $mobile = me.$dialog.find('.mobile'),
						$name = me.$dialog.find('.name'),
						$address = me.$dialog.find('.address'),
						mobile = $.trim($mobile.val()),
						name = $.trim($name.val());
						address = $.trim($address.val());

					if (!name) {
						showTips('请输入您的姓名',4);
						$name.focus();
						$(this).removeClass(me.REQUEST_CLS);
						return false;
					}
					if (!mobile || !/^\d{11}$/.test(mobile)) {
						showTips('这手机号，可打不通...',4);
						$mobile.focus();
						$(this).removeClass(me.REQUEST_CLS);
						return false;
					}
					if (!address) {
						showTips('请输入正确的地址',4);
						$address.focus();
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
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="jx-jsbb-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						//未中奖
						._('<div class="not-lott" id="not-lott">')
						    ._('<h1></h1>')
							._('<img src="images/sad.png">')
							._('<a href="#" class="btn lott-back btn-share lottery-close" data-collect="true" data-collect-flag="jx-jsbb-sharebtn" data-collect-desc="返回按钮">返回</a>')
						._('</div>')
						//中奖
						._('<div class="lott none" id="lott">')
							._('<div class="goods none">')
							    ._('<h1 class="info-confirm none"></h1>')
								._('<img src="">')
								._('<h1 class="lott-fill"></h1>')
								._('<input type="text" class="name" placeholder="姓名：(必填)" />')
								._('<input type="number" class="mobile" placeholder="电话： 例：13888888888 (必填)" />')
								._('<input type="text" class="address" placeholder="地址：(必填)" />')
								._('<a class="btn bth-aw btn-award" id="btn-award" data-collect="true" data-collect-flag="jx-jsbb-combtn" data-collect-desc="经视播报确定按钮">确定提交</a>')
								._('<a href="#" class="btn btn-share lottery-close none" data-collect="true" data-collect-flag="jx-jsbb-rank" data-collect-desc="经视播报分享按钮">返回</a>')
							._('</div>')
							._('<div class="red-bao none">')
							    ._('<h1 class="award-tip"></h1>')
								._('<img src="">')
								._('<a class="btn-red" id="btn-red" data-collect="true" data-collect-flag="jx-jsbb-combtn" data-collect-desc="经视播报确定按钮">领取</a>')
							._('</div>')
						._('</div>')
					._('</div>')
					._('</section>');
				return t.toString();
			},
			update: function(data) {
					if(data&&data.result&&data.pt == 1){
						$("#lott .goods").find("img").attr("src",data.pi);
						$(".mobile").val(data.ph || "");
						$(".name").val(data.rn || "");
						$('.address').val(data.ad || '');
						this.$dialog.find(".red-bao").addClass("none");
						this.$dialog.find(".goods ").removeClass("none");
						this.$dialog.find("#not-lott").addClass("none");
						this.$dialog.find("#lott").removeClass("none");
					}else if(data&&data.result&&data.pt == 4){
						$("#lott .red-bao").find("img").attr("src",data.pi);
						$("#lott .red-bao").find(".award-tip").html(data.tt);
						$(".dialog").addClass("red");
						$("#btn-red").attr("data-href",data.rp);
						this.$dialog.find(".red-bao").removeClass("none");
						this.$dialog.find(".goods ").addClass("none");
						this.$dialog.find("#not-lott").addClass("none");
						this.$dialog.find("#lott").removeClass("none");
					}else{
						this.$dialog.find("#not-lott").removeClass("none");
						this.$dialog.find("#lott").addClass("none");
					}
			},
			succ: function() {
				$('.loader').addClass('none');
				this.$dialog.find('input').attr('disabled','disabled').css('border','none');
				this.$dialog.find('input.adderss').removeAttr("disabled").attr("readonly","readonly");
				this.$dialog.find('#btn-award').addClass('none');
				this.$dialog.find('.btn-share').removeClass('none');
				var mob = this.$dialog.find('.mobile').val();
				var nam = this.$dialog.find('.name').val();
				var adr= this.$dialog.find('.address').val();
				this.$dialog.find('.mobile').val('').attr("placeholder",'电话：'+ mob);
				this.$dialog.find('.name').val('姓名：'+nam);
				this.$dialog.find('.address').val('地址：'+adr);
				$(".lott").find("input").removeClass("none");
			}
		}
	};

	W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".content").html(data.rule);
		}
	};
	
	W.callbackLotteryAwardHandler = function(data) {
		if (data.result) {
			H.dialog.lottery.enable();
			H.dialog.lottery.succ();
			return;
		}
	}
	
})(Zepto);

H.dialog.init();
