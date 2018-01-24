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
					._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="js-qglh-ruledialog-closebtn" data-collect-desc="全国两会规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
					._('<h2>活动规则</h2>')
					._('<div class="content">')
					._('<div class="rule-con"></div>')
					._('</div>')
					._('<p class="dialog-copyright"><span class="btn my-zhidao close" data-collect="true" data-collect-flag="js-qglh-guide-trybtn" data-collect-desc="全国两会规则弹层-我知道了按钮">我知道了</span><a href="http://t.cn/Rw03SgC" class="link">更多信息请点击关注江苏新时空微信服务号</a></p>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
		lottery: {
			$dialog: null,
			open: function(data,type) {
				H.dialog.open.call(this);
				this.event();
				var $paint = $('#paint'),
					$cover = $('#cover'),
					$cardPage = $('.card-page'),
					$card = this.$dialog.find('.card');
					$paint.removeClass('none')
					if($paint.hasClass('none')==false){
						$cover.removeClass('none');
				    }
					if(data.ucount){
						$("#count").html("您是第"+data.ucount+"位抽奖的人");
					}else{
						$("#count").addClass('none');
					}
				var lottery = new Lottery($paint.get(0), 'images/paint.jpg', 'image', $card.width(), $card.height(), function() {
					$cardPage.addClass('none');
						if(type==1){
							H.dialog.lottery.update(data);
						}
						
						if(type==2){
							
							H.dialog.lottery.reward(data);
						}				
				});
				lottery.init(data.pi,"image");
				
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
					toUrl("index.html");
				});
	
				$(".back").click(function(e){
					e.preventDefault();
					toUrl("index.html");
				});
				$('#btn-award').click(function(e) {
					e.preventDefault();

					if (!me.check()) {
						return false;
					}

					var mobile = $.trim(me.$dialog.find('.mobile').val()),
						name = $.trim(me.$dialog.find('.name').val()),
						idCard = $.trim(me.$dialog.find('.idCard').val());

					me.disable();
					$('#btn-award').addClass('none');
					me.butt_loading();
					getResult('newseye/awardTwo', {
						phone: mobile,
						name: encodeURIComponent(name),
						idCard: encodeURIComponent(idCard),
						openid: openid
					}, 'newseyeAwardHandler');
				});
			},
			check: function() {
				var me = this;

					var $mobile = me.$dialog.find('.mobile'),
						$name = me.$dialog.find('.name'),
						$idCard = me.$dialog.find('.idCard'),
						mobile = $.trim($mobile.val()),
						name = $.trim($name.val()),
						idCard = $.trim($idCard.val());

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
					if (idCard.length > 20) {
						alert('请先输入正确的身份证号');
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
				t._('<div class="loader">')
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
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="js-qglh-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						
						//刮刮卡区域
						._('<div class="card-page">')
						    ._('<h1 id="count"></h1>')
						    ._('<h1>恭喜您获得刮刮卡一张，  </h1>')
						    ._('<h2>快来试试手气刮奖吧！</h2>')					     
						    ._('<div class="card">')
							    ._('<div class="paint" id="paint"></div>')
							    ._('<div class="cover none" id="cover"></div>')
						    ._('</div>')  
						._('</div>')
			
						//未中奖
						._('<div class="not-lott none" id="not-lott">')
							._('<img src="images/open-li.png">')
							._('<h1>别灰心</h1>')
							._('<h2>观看江苏卫视18:30《江苏新时空》，继续摇一摇，还有机会抽奖哦！</h2>')
							._('<span class="btn back" data-collect="true" data-collect-flag="js-qglh-sharebtn" data-collect-desc="返回按钮">返 回</span>')
						._('</div>')
						//中奖
						._('<div class="lott none" id="lott">')
							._('<img src="">')
							._('<h2>-</h2>')
							._('<h1>请填写您的真实信息以便给您充值</h1>')
							._('<input type="text" class="name" placeholder="姓名：(必填)" />')
							._('<input type="number" class="mobile" placeholder="电话： 例：13888888888 (必填)" />')
							._('<input type="text" class="idCard" placeholder="身份证号：(非必填) " />')
							._('<a class="btn" id="btn-award" data-collect="true" data-collect-flag="js-qglh-combtn" data-collect-desc="全国两会-确定按钮">确定</a>')
							._('<div class="da-tips none">')
								._('<p>邀请朋友一起抽奖</p>')
								._('<span class="btn back" data-collect="true" data-collect-flag="js-qglh-back" data-collect-desc="全国两会-返回按钮">返回</span>')
							._('</div>')
						._('</div>')
						._('<p class="dialog-copyright"><a href="http://t.cn/Rw03SgC" class="link">更多信息请点击关注江苏新时空微信服务号</a></p>')
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
						$(".idCard").val(data.ic || "");
						$("#not-lott").addClass("none");
						$("#lott").removeClass("none");
						
					}else{
						$(".con").find("h1").addClass("none");
						$("#prize-tt").html('感谢您的参与，新闻眼祝您羊年大吉！');
						$("#not-lott").removeClass("none");
					}
			},
			reward: function(data) {
				
					if(data.pt != 2 ){
						$("#lott").find("img").attr("src",data.pi);
						$("#lott").find("h2").html(data.ptt);
						$("#prize-tt").html(data.ptt);
						$(".mobile").val(data.phone || "");
						$(".name").val(data.na || "");
						$(".idCard").val(data.ic || "");
						$("#not-lott").addClass("none");
						$("#lott").removeClass("none");
						
					}else{
						$(".con").find("h1").addClass("none");
						$("#prize-tt").html('感谢您的参与，新闻眼祝您羊年大吉！');
						$("#not-lott").removeClass("none");
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
				var Id = this.$dialog.find('.idCard').val();
				this.$dialog.find('.mobile').val("").attr('placeholder','电话：'+mob);
				this.$dialog.find('.name').val('姓名：'+nam);
				this.$dialog.find('.idCard').val('身份证号：'+Id);
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
				if(!H.dialog.over.maxCount){
					t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="js-qglh-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						//未中奖
						._('<div class="over-upload">')
							._('<img src="images/open-li.png">')
							._('<h1>亲，正在努力加载页面，请稍等~</h1>')	
						._('</div>')
						._('<p class="dialog-copyright"><span class="btn lottery-close" data-collect="true" data-collect-flag="js-qglh-sharebtn" data-collect-desc="返回按钮">我知道啦</span><br /><a href="http://t.cn/Rw03SgC" class="link">更多信息请点击关注江苏新时空微信服务号</a></p>')
					._('</div>')
					._('</section>');
					return t.toString();
				}
				t._('<section class="modal" id="lottery-dialog">')
				._('<div class="dialog lottery-dialog">')
				._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="js-qglh-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					//未中奖
					._('<div class="over-upload">')
						._('<img src="images/open-li.png">')
						._('<h1>亲，您今天已经发表过评论了，每天只能发表'+H.dialog.over.maxCount+'次哦~明天再来吧~</h1>')	
					._('</div>')
					._('<p class="dialog-copyright"><span class="btn lottery-close" data-collect="true" data-collect-flag="js-qglh-sharebtn" data-collect-desc="返回按钮">我知道啦</span><br /><a href="http://t.cn/Rw03SgC" class="link">更多信息请点击关注江苏新时空微信服务号</a></p>')
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
	W.callbackLotteryHander = function(data) {
		H.dialog.lottery.update(data);
	};
})(Zepto);
$(function(){
	H.dialog.init();
});
