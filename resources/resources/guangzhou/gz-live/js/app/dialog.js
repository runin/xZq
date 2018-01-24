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
					'height': height * 0.70,
					'left': width * 0.10,
					'right': width * 0.10,
					'top': top
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
					._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="gz-live-ruledialog-closebtn" data-collect-desc="第一现场规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
					._('<h2>活动规则</h2>')
					._('<div class="content">')
					._('<div class="rule-con"></div>')
					._('</div>')
					._('<p class="dialog-copyright"><a href="#" class="btn my-zhidao close" data-collect="true" data-collect-flag="gz-live-guide-trybtn" data-collect-desc="第一现场规则弹层-我知道了按钮">我知道了</a></p>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
		lottery: {
			$dialog: null,
			open: function(data) {
				H.dialog.open.call(this);
				this.event();
				this.update(data);
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
						name = $.trim(me.$dialog.find('.name').val());

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
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="gz-live-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						//未中奖
						._('<div class="not-lott" id="not-lott">')
							._('<img src="images/open-li.png">')
							._('<h1>很遗憾，没抽中哦，再接再厉吧</h1>')
							._('<a href="#" class="btn lott-back btn-share lottery-close" data-collect="true" data-collect-flag="gz-live-sharebtn" data-collect-desc="返回按钮">返回</a>')
						._('</div>')
						//中奖
						._('<div class="lott none" id="lott">')
							._('<img src="">')
							._('<h2>-</h2>')
							._('<h1>请填写您的联系方式以便顺利领奖</h1>')
							._('<input type="text" class="name" placeholder="姓名：(必填)" />')
							._('<input type="number" class="mobile" placeholder="电话： 例：13888888888 (必填)" />')
							._('<a class="btn bth-aw btn-award" id="btn-award" data-collect="true" data-collect-flag="gz-live-combtn" data-collect-desc="第一现场-确定按钮">确定</a>')
							._('<p class="da-tips none">')
								._('<a href="#" class="btn btn-share lottery-close" data-collect="true" data-collect-flag="gz-live-rank" data-collect-desc="第一现场分享按钮">返回</a>')
							._('</p>')
						._('</div>')
						._('<p class="dialog-copyright">解释权归直播广州所有</p>')
					._('</div>')
					._('</section>');
				return t.toString();
			},
			update: function(data) {
				if(data && data.pt && data.pt != 0){
					$("#lott").find("img").attr("src",data.pi);
					$("#lott").find("h2").html(data.tt);
					$(".mobile").val(data.ph || "");
					$(".name").val(data.rn || "");
					this.$dialog.find("#not-lott").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
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
				this.$dialog.find('.mobile').val("").attr('placeholder','电话：'+mob);
				this.$dialog.find('.name').val('姓名：'+nam);
				this.$dialog.find('#lott h1').text('以下是您的联系方式');
			}
		},
		wxcardLottery: {
			$dialog: null,
			ci:null,
			ts:null,
			si:null,
			pt:null,
			sto:null,
			name:null,
			mobile:null,
			open: function(data) {
				var me =this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				var height = $(window).height(),
					width = $(window).width();
				$(".wxcard-dialog").css({
					'width': width * 0.80,
					'height': height * 0.50,
					'left': width * 0.10,
					'right': width * 0.10,
					'top': height * 0.25
				});
				me.update(data);
				me.readyFunc();
			},
			close: function() {
				var me = this;
				setTimeout(function(){
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			readyFunc: function(){
				var me = this;
				$('#btn-wxcardLottery-award').click(function(e) {
					e.preventDefault();
					if(!$('#btn-wxcardLottery-award').hasClass("flag")){
						$('#btn-wxcardLottery-award').addClass("flag");
						shownewLoading();
						me.close();
						me.sto = setTimeout(function(){
							hidenewLoading();
						},15000);
						$('#btn-wxcardLottery-award').text("领取中");
						setTimeout(function(){
							me.wx_card();
						},1000);
					}
				});
			},
			wx_card:function(){
				var me = this;
				wx.addCard({
					cardList: [{
						cardId: me.ci,
						cardExt: "{\"timestamp\":\""+ me.ts +"\",\"signature\":\""+ me.si +"\"}"
					}],
					success: function (res) {
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid
						}, 'callbackLotteryAwardHandler');
					},
					fail: function(res){
						hidenewLoading();
						recordUserOperate(openid, res.errMsg, "card-fail");
					},
					complete:function(){
						me.sto && clearTimeout(me.sto);
						hidenewLoading();
					},
					cancel:function(){
						hidenewLoading();
					}
				});
			},
			update: function(data) {
				var me = this;
				if(data.result && data.pt == 7){
					H.dialog.lru = data.ruid;
					me.pt = data.pt;
					$("#wxcard-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
					$("#wxcard-dialog").find(".award-luckTips").html(data.tt || '');
					me.ci = data.ci;
					me.ts = data.ts;
					me.si = data.si;
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="wxcard-dialog">')
					._('<section class="dialog wxcard-dialog">')
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="gz-live-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					._('<section class="dialog-content">')
					._('<img class="award-img" src="">')
					._('<h2 class="award-luckTips">-</h2>')
					._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">领取</a>')
					._('</section>')
					._('</section>')
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
	
	W.callbackLotteryAwardHandler = function(data) {
	}
	
})(Zepto);

H.dialog.init();
