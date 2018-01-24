(function($) {
	
	H.dialog = {
		puid: 0,
		$container: $('#main'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		prUid :"",
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

		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
				getResult('common/activtyRule/' + serviceNo, {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
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
				this.$dialog.find('.rule').html(rule).closest('.content').removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<a href="#" class="btn-close"></a>')
					._('<div class="dialog rule-dialog">')
						._('<h2></h2>')
						._('<div class="content">')
							._('<div class="rule">')
							._('</div>')
						._('</div>')
						._('<p class="dialog-copyright"></p>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		ontv: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.update(H.index.ontv);
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			update: function(prule) {
				this.$dialog.find('.wrapper').html(prule).removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="ontv-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="landlord-new-lotterydialog-closebtn" data-collect-desc="上电视弹层-关闭按钮"></a>')
					._('<div class="dialog ontv-dialog">')
						._('<h2></h2>')
						._('<div class="wrapper none">')
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
				this.$dialog && this.$dialog.addClass('none');
				$('.masking-box').addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.clear();
					me.close();
					toUrl("index.html?isreload=true");
				});

				$('#btn-award').click(function(e) {
					e.preventDefault();

					if (!me.check()) {
						return false;
					}

					var mobile = $.trim(me.$dialog.find('.mobile').val()),
						name = $.trim(me.$dialog.find('.name').val()),
						qq = $.trim(me.$dialog.find('.qq').val());

					me.disable();
					$('#btn-award').addClass('none');
					me.butt_loading();
					getResult('landnew/award', {openid:openid,prUid:H.dialog.prUid,ph:mobile,un:encodeURIComponent(name),qq:qq}, 'landNewAwardHandler', true);
				});
			},
			check: function() {
				var me = this;

					var $mobile = me.$dialog.find('.mobile'),
						$name = me.$dialog.find('.name'),
						$qq = me.$dialog.find('.qq'),
						mobile = $.trim($mobile.val()),
						qq = $.trim($qq.val()),
						name = $.trim($name.val());

					if (!name) {
						alert('请先输入姓名');
						$name.focus();
						$(this).removeClass(me.REQUEST_CLS);
						return false;
					}
					if (!qq) {
						alert('请输入QQ号');
						$qq.focus();
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
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="landlord-new-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						//未中奖
						._('<div class="not-lott" id="not-lott">')
							._('<img src="images/open-li.png">')
							._('<h1>运气不太好，没有中奖</h1>')
							._('<h2>别灰心，发评论上电视，<br>有机会赢大奖哦</h2>')
							._('<a class="btn lottery-close lott-back" data-collect="true" data-collect-flag="landlord-new-sharebtn" data-collect-desc="返回按钮">返 回</a>')
						._('</div>')
						//中奖
						._('<div class="lott none" id="lott">')
							._('<img src="" class="none">')
							._('<h1></h1>')
							._('<h2>请填写您的联系方式以便顺利领奖</h2>')
							._('<input type="text" class="name" placeholder="姓名：(必填)" />')
							._('<input type="text" class="qq" placeholder="QQ号：(必填)" />')
							._('<input type="number" class="mobile" placeholder="电话： 例：13888888888 (必填)" />')
							._('<a class="btn lottery-close lott-back" data-collect="true" data-collect-flag="fj-group-lottert-confirm-btn" data-collect-desc="积分确定按钮">确定</a>')
							._('<a class="btn btn-share bth-aw btn-award" id="btn-award" data-collect="true" data-collect-flag="landlord-new-combtn" data-collect-desc="斗地主-确定按钮">确定</a>')
							._('<p class="da-tips none">')
								._('<a class="lottery-close" data-collect="true" data-collect-flag="landlord-new-back" data-collect-desc="斗地主-返回按钮">返回</a>')
							._('</p>')
						._('</div>')
						._('<p class="dialog-copyright"></p>')
					._('</div>')
					._('</div>');
				return t.toString();
			},
			update: function(data) {
				H.dialog.prUid = data.ru;
				if(data.pt ==1 || data.pt == 3){
					$("#lott").find("img").attr("src",data.pi);
					$("#lott").find("h1").html(data.ptt);
					$(".lott-back").addClass("none")
					this.$dialog.find("#not-lott").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
				}else{
					this.$dialog.find("#lott").addClass("none");
					this.$dialog.find("#not-lott").removeClass("none");
				}
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
				var qq = this.$dialog.find('.qq').val();
				this.$dialog.find('.mobile').val("").attr('placeholder','电话：'+mob);
				this.$dialog.find('.qq').val("").attr('placeholder','QQ号：'+qq);
				this.$dialog.find('.name').val('姓名：'+nam);
				this.$dialog.find('#lott h2').text('以下是您的联系方式，请等候工作人员联系');
			}
		}
	};

	W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule").html(data.rule);
		}
	};
	
	W.landNewAwardHandler = function(data) {
		if (data.code == 0) {
			H.dialog.lottery.enable();
			H.dialog.lottery.succ();
			return;
		}
	};
	
	W.callbackLandlordPrule = function(data) {
		H.dialog.ontv.update(data.prule);
	};
	
})(Zepto);

H.dialog.init();
