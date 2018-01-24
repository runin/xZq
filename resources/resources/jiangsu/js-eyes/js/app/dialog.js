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
					'height': height * 0.85,
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
					._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="js-eyes-ruledialog-closebtn" data-collect-desc="新闻眼规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
					._('<h2>活动规则</h2>')
					._('<div class="content">')
					._('<div class="rule-con"></div>')
					._('</div>')
					._('<p class="dialog-copyright"><a href="#" class="btn my-zhidao close" data-collect="true" data-collect-flag="js-eyes-guide-trybtn" data-collect-desc="新闻眼规则弹层-我知道了按钮">我知道了</a>本活动最终解释权归江苏卫视《新闻眼》栏目所有</p>')
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
					getResult('newseye/award', {
						phone: mobile,
						name: encodeURIComponent(name),
						address: encodeURIComponent(address),
						openid: openid
					}, 'newseyeAwardHandler');
				});
			},
			check: function() {
				var me = this;

					var $mobile = me.$dialog.find('.mobile'),
						$name = me.$dialog.find('.name'),
						$address = me.$dialog.find('.address'),
						mobile = $.trim($mobile.val()),
						name = $.trim($name.val()),
						address = $.trim($address.val());

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
					if (!address) {
						alert('请输入您的地址');
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
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="js-eyes-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						//未中奖
						._('<div class="not-lott" id="not-lott">')
							._('<img src="images/open-li.png">')
							._('<h1>很遗憾没有中奖</h1>')
							._('<h1>感谢您的参与，新闻眼祝您羊年大吉！</h1>')
							._('<a class="btn lottery-close lott-back" data-collect="true" data-collect-flag="js-eyes-sharebtn" data-collect-desc="返回按钮">返 回</a>')
						._('</div>')
						//中奖
						._('<div class="lott none" id="lott">')
							._('<img src="">')
							._('<h2>-</h2>')
							._('<h1>请填写您的联系方式以便顺利领奖</h1>')
							._('<input type="text" class="name" placeholder="姓名：(必填)" />')
							._('<input type="number" class="mobile" placeholder="电话： 例：13888888888 (必填)" />')
							._('<input type="text" class="address" placeholder="地址：江苏省南京市" />')
							._('<a class="btn btn-share bth-aw btn-award" id="btn-award" data-collect="true" data-collect-flag="js-eyes-combtn" data-collect-desc="新闻眼-确定按钮">确定</a>')
							._('<p class="da-tips none">')
								._('<a href="javascript:share();" class="btn my-zhidao" data-collect="true" data-collect-flag="js-eyes-rank" data-collect-desc="新闻眼-分享按钮">邀请朋友一起抽奖</a>')
								._('<a class="lottery-close back" data-collect="true" data-collect-flag="js-eyes-back" data-collect-desc="新闻眼-返回按钮">返回</a>')
							._('</p>')
						._('</div>')
						._('<p class="dialog-copyright">本活动最终解释权归江苏卫视《新闻眼》栏目所有</p>')
					._('</div>')
					._('</section>');
				return t.toString();
			},
			update: function(data) {
					if(data.pt != 2 && data.code == 0){
						$("#lott").find("img").attr("src",data.pi);
						$("#lott").find("h2").html(data.tt);
						$("#prize-tt").html(data.tt);
						$(".mobile").val(data.phone || "");
						$(".name").val(data.na || "");
						$(".address").val(data.ad || "");
						this.$dialog.find("#not-lott").addClass("none");
						this.$dialog.find("#lott").removeClass("none");
					}else{
						$(".con").find("h1").addClass("none");
						$("#prize-tt").html('感谢您的参与，新闻眼祝您羊年大吉！');
					}
			},
			clear:function(){
				this.$dialog.find("#not-lott").removeClass("none");
				this.$dialog.find("#lott").addClass("none");
				this.$dialog.find('input').removeAttr('disabled').css('border','1px solid #D3D3D3');
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
				var address = this.$dialog.find('.address').val();
				this.$dialog.find('.mobile').val("").attr('placeholder','电话：'+mob);
				this.$dialog.find('.name').val('姓名：'+nam);
				this.$dialog.find('.address').val('地址：'+address);
				this.$dialog.find('#lott h1').text('以下是您的联系方式，请等候工作人员联系');
			}
		},
		// 超过上传次数谈层
		over: {
			$dialog: null,
			maxCount: null,
			open: function (count) {
				H.dialog.over.maxCount = count;
				H.dialog.open.call(this);
				this.event();
			},
			close: function () {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function () {
				var me = this;
				this.$dialog.find('.lottery-close').click(function (e) {
					e.preventDefault();
					me.close();
				});
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
				._('<div class="dialog lottery-dialog">')
				._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="cd-express-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					//未中奖
					._('<div class="over-upload">')
						._('<img src="images/open-li.png">')
						._('<h1>亲，您今天已经上传过全家福了，每天只能传'+H.dialog.over.maxCount+'次哦~明天再来吧~</h1>')	
					._('</div>')
					._('<p class="dialog-copyright"><a class="btn lottery-close" data-collect="true" data-collect-flag="cd-express-sharebtn" data-collect-desc="返回按钮">我知道啦</a><br />本活动最终解释权归江苏卫视《新闻眼》栏目所有</p>')
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
	
	W.newseyeAwardHandler = function(data) {
		if (data.code == 0) {
			H.dialog.lottery.enable();
			H.dialog.lottery.succ();
			return;
		}else{
			alert("系统繁忙，请稍候再试！");
			$('.loader').addClass('none');
			$('#btn-award').removeClass('none');
		}
	}
	
})(Zepto);
$(function(){
	H.dialog.init();
});
