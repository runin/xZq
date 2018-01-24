(function($) {
	H.dialog = {
		pt:null,
		ci:null,
		ts:null,
		si:null,
		PV:null,
		$container: $('body'),
		init: function() {
			var me = this, width = $(window).width(), height = $(window).height();
			$('body').css({
				'width': width
			});
		},
		open: function() {
			var me = this;
			if (this.$dialog) {
				this.$dialog.removeClass('none');
			} else {
				this.$dialog = $(this.tpl());
				H.dialog.$container.append(this.$dialog);
			}
			H.dialog.relocate();
			this.$dialog.animate({'opacity':'1'}, 400);
			this.$dialog.find('.dialog').addClass('bounceInDown');
			setTimeout(function(){
				me.$dialog.find('.dialog').removeClass('bounceInDown');
			}, 1000);
		},
		relocate : function(){
			var height = $(window).height(), width = $(window).width();
			$('.modal').each(function() {
				$(this).css({
					'width': width,
					'height': height
				});
			});
			$('.dialog').each(function() {
				$(this).css({
					'width': width * 0.86,
					'left': width * 0.07,
					'top': height * 0.1
				});
			});
		},
		rule: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();
			},
			close: function () {
				var me = this;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({'opacity':'0'}, 1000);
				setTimeout(function(){
					hidenewLoading();
					$("#btn-rule").removeClass('requesting');
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			event: function () {
				var me = this;
				this.$dialog.find('.btn-dialog-bottom').click(function (e) {
					e.preventDefault();
					me.close();
				});
			},
			tpl: function () {
				var t = simpleTpl();
				if (rule_temp == '') {
					getResult('api/common/rule', {}, 'commonApiRuleHandler');
				} else {
					hidenewLoading();
				}
				t._('<section class="modal modal-rule modal-flag" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
					//._('<a href="#" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-rule-btn-close" data-collect-desc="弹层(活动规则)-关闭按钮"></a>')
					._('<div class="dialog-content">')
					._('<img class="icon-flag icon-rule" src="./images/icon-rule.png">')
					._('<div class="rule-content" id="rule-content">' + rule_temp + '</div>')
					//._('<img class="icon-rule-in" src="./images/rule-in-bg.png">')
					._('<a href="#" class="btn-dialog-bottom" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-rule-btn-close" data-collect-desc="弹层(活动规则)-关闭按钮"></a>')
					._('</div>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
		redbagLottery: {
			$dialog: null,
			rp:null,
			open: function(data) {
				var me =this, $dialog = this.$dialog, winW = $(window).width(), winH = $(window).height();
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				me.update(data);
				$('.dialog').each(function() {
					$(this).css({
						'top': ($(window).height() * 0.1)+"px"
					});
				});
			},
			close: function() {
				var me = this;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({'opacity':'0'}, 1000);
				setTimeout(function(){
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			event: function() {
				var me = this;
				$(".redbag-dialog").click(function(e){
					e.preventDefault();
					if(!$('.redbag-dialog').hasClass("flag")) {
						shownewLoading(null, '领取中...');
						$('.redbag-dialog').addClass("flag");
						//$('.btn-redbag-get').text("领取中");
						setTimeout(function(){
							location.href = H.dialog.redbagLottery.rp;
						},500);
					}
				});
				$("#btn-dialog-close").click(function(e){
					e.stopPropagation();
					e.preventDefault();
					me.close();
				});
			},
			update: function(data) {
				var me = this, height = $(window).height();
				if(data.result){
					me.rp = data.rp;
					$("#redbag-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-redbag" id="redbag-dialog">')
					._('<section class="dialog redbag-dialog" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-立即使用按钮">')
					._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-redbag-btn-close" data-collect-desc="弹层(红包)-关闭按钮"></a>')
					._('<section class="dialog-content">')
					._('<section class="dialog-body">')
					._('<img class="award-img" src="./images/default-award.png">')
					._('</section>')
					._('<section class="dialog-footer">')
					._('<section class="btn-lottery-box">')
					._('<a href="javascript:void(0);" class="btn-lottery btn-redbag-use" id="btn-redbag-use" data-collect="true" data-collect-flag="dialog-redbag-btn-use" data-collect-desc="弹层(红包)-点我领取按钮"></a>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>');
				return t.toString();
			}
		},
		shiwuLottery: {
			$dialog: null,
			name: '',
			mobile: '',
			address: '',
			ru: '',
			isFocus: false,
			pt:0,
			cu:0,
			open: function(data) {
				H.dialog.pt = 1;
				H.lottery.isCanShake = false;
				H.lottery.canJump = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				me.update(data);
				me.checkFocus();
				$('.dialog').each(function() {
					$(this).css({
						'top': $(window).height() * 0.1
					});
				});
			},
			close: function() {
				var me = this;
				H.dialog.pt = null;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({'opacity':'0'}, 1000);
				setTimeout(function(){
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			checkFocus: function(){
				var me = this;
				$("input").each(function() {
					$(this).focus(function(){
						me.isFocus = true;
					});
				});
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-dialog-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-shiwuLottery-award').click(function(e) {
					e.preventDefault();
					if(me.check()){
						if(!$('#btn-shiwuLottery-award').hasClass("flag")){
							$('#btn-shiwuLottery-award').addClass("flag");

							var mobile = $.trim(me.$dialog.find('.mobile').val()),
								addr = $.trim(me.$dialog.find('.address').val()),
								name = $.trim(me.$dialog.find('.name').val());

							getResult('api/lottery/award', {
								oi: openid,
								nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
								hi: headimgurl ? headimgurl : "",
								rn: encodeURIComponent(name),
								ph: mobile,
								ad: encodeURIComponent(addr)
							}, 'callbackLotteryAwardHandler');
							me.close();
							showTips('领取成功');
							if(me.isFocus && !is_android()){
								setTimeout(function(){
									location.href = window.location.href;
								}, 200);
							}
						}
					}
				});
				this.$dialog.find('#btn-shiwuLottery-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function(data) {
				var me = this;
				if(data.result){
					me.pt = data.pt;
					me.cu = data.cu;
					$("#shiwu-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
					//$("#shiwu-dialog").find(".award-keyTips").html(data.pn || '');
					$("#shiwu-dialog").find('.name').val(data.rn || '');
					$("#shiwu-dialog").find('.mobile').val(data.ph || '');
					$("#shiwu-dialog").find('.address').val(data.ad || '');
				}
			},
			check: function() {
				var me = this, $mobile = me.$dialog.find('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = me.$dialog.find('.name'),
					name = $.trim($name.val()),
					$addr = me.$dialog.find('.address'),
					addr = $.trim($addr.val())

				if (((me.name && me.name == name) && me.mobile && me.mobile == phone)) {
					return;
				}

				if (name.length < 2 || name.length > 30) {
					showTips('姓名长度为2~30个字符');
					$name.focus();
					return false;
				}
				else if (!/^\d{11}$/.test(mobile)) {
					showTips('请输入正确的手机号');
					$mobile.focus();
					return false;
				}
				else if (addr.length < 2 || addr.length > 30) {
					showTips('地址长度为2~30个字符');
					$addr.focus();
					return false;
				}
				return true;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-shiwu" id="shiwu-dialog">')
					._('<section class="dialog shiwu-dialog">')
					._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-close" data-collect-desc="弹层(实物)-关闭按钮"></a>')
					._('<section class="dialog-content">')
					._('<section class="dialog-body">')
					._('<img class="award-img" src="./images/default-award.png">')
					._('<section class="dialog-footer">')
					._('<section class="btn-lottery-box">')
					._('<p><input type="text" class="name" placeholder="姓名" /></p>')
					._('<p><input type="tel" class="mobile" placeholder="电话" /></p>')
					._('<p><input type="text" class="address" placeholder="地址" /></p>')
					._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物)-领取按钮"></a>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>');
				return t.toString();
			}
		},
		llLottery: {
			$dialog: null,
			name: '',
			mobile: '',
			address: '',
			ru: '',
			open: function(data) {
				H.dialog.pt = 1;
				H.lottery.isCanShake = false;
				H.lottery.canJump = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				me.update(data);
				//$(".dialog-footer").css("height","180px");
				$('.dialog').each(function() {
					$(this).css({
						'top': $(window).height() * 0.1
					});
				});
			},
			close: function() {
				var me = this;
				H.dialog.pt = null;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({'opacity':'0'}, 1000);
				setTimeout(function(){
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-dialog-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-shiwuLottery-award').click(function(e) {
					e.preventDefault();
					if(me.check()){
						if(!$('#btn-shiwuLottery-award').hasClass("flag")){
							$('#btn-shiwuLottery-award').addClass("flag");

							var mobile = $.trim(me.$dialog.find('.mobile').val());
							//addr = $.trim(me.$dialog.find('.address').val()),
							//name = $.trim(me.$dialog.find('.name').val());

							getResult('api/lottery/award', {
								oi: openid,
								nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
								hi: headimgurl ? headimgurl : "",
								//rn: encodeURIComponent(name),
								ph: mobile
								//ad: encodeURIComponent(addr)
							}, 'callbackLotteryAwardHandler');
							me.close();
							showTips('领取成功');
							if(H.lottery.pageType == 1){
								toUrl("tiger.html");
							}else{
								toUrl("lottery.html");
							}
						}
					}
				});
				this.$dialog.find('#btn-shiwuLottery-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function(data) {
				var me = this;
				if(data.result){
					$("#shiwu-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
					//$("#shiwu-dialog").find(".award-keyTips").html(data.pn || '');
					//$("#shiwu-dialog").find('.name').val(data.rn || '');
					$("#shiwu-dialog").find('.mobile').val(data.ph || '');
					//$("#shiwu-dialog").find('.address').val(data.ad || '');
				}
			},
			check: function() {
				var me = this, $mobile = me.$dialog.find('.mobile'),
					mobile = $.trim($mobile.val());

				if ( me.mobile && me.mobile == phone) {
					return;
				}

				//if (name.length < 2 || name.length > 30) {
				//    showTips('姓名长度为2~30个字符');
				//    $name.focus();
				//    return false;
				//}
				if (!/^\d{11}$/.test(mobile)) {
					showTips('这手机号，可打不通哦...');
					$mobile.focus();
					return false;
				}
				//else if (addr.length < 2 || addr.length > 30) {
				//    showTips('地址长度为2~30个字符');
				//    $addr.focus();
				//    return false;
				//}
				return true;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-shiwu" id="shiwu-dialog">')
					._('<section class="dialog shiwu-dialog">')
					._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-close" data-collect-desc="弹层(实物)-关闭按钮"></a>')
					._('<section class="dialog-content">')
					._('<section class="dialog-body">')
					._('<img class="award-img" src="./images/default-award.png">')
					._('<p class="award-normalTips">请正确填写手机号码，三个工作日内将会有工作人员与您联系奖品发放事宜。</p>')
					._('</section>')
					._('<section class="dialog-footer">')
					._('<section class="btn-lottery-box">')
					//._('<p><input type="text" class="name" placeholder="姓名" /></p>')
					._('<p><input type="tel" class="mobile" placeholder="电话" /></p>')
					//._('<p><input type="text" class="address" placeholder="地址" /></p>')
					._('<a href="javascript:void(0);" class="btn-lottery btn-shiwu-lottery-award" id="btn-shiwuLottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-llttery-award" data-collect-desc="弹层(流量红包)-领取按钮"></a>')
					._('</section>')
					._('</section>')
					//._('<img class="award-bottom-bg-fake" src="./images/lot-bottom-bg.png">')
					//._('<img class="award-bottom-bg" src="./images/lot-bottom-bg.png">')
					._('</section>')
					._('</section>')
					._('</section>');
				return t.toString();
			}
		},
		linkLottery: {
			$dialog: null,
			ru: '',
			open: function(data) {
				H.lottery.isCanShake = false;
				H.lottery.canJump = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				me.update(data);
				$('.dialog').each(function() {
					$(this).css({
						'top': ($(window).height() * 0.1)+"px"
					});
				});
			},
			close: function() {
				var me = this;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({'opacity':'0'}, 1000);
				setTimeout(function(){
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-dialog-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-linkLottery-use').click(function(e) {
					e.preventDefault();
					if (me.ru.length == 0) {
						me.close();
						hidenewLoading();
					} else {
						shownewLoading(null, '请稍后...');
						getResult('api/lottery/award', {
							oi: openid,
							nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							hi: headimgurl ? headimgurl : ""
						}, 'callbackLotteryAwardHandler');
						setTimeout(function(){
							location.href = me.ru;
						},1000);
					}
				});
			},
			update: function(data) {
				var me = this;
				if(data.result){
					me.ru = data.ru;
					$("#link-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-link" id="link-dialog">')
					._('<section class="dialog link-dialog">')
					._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链)-关闭按钮"></a>')
					._('<section class="dialog-content">')
					._('<section class="dialog-body">')
					._('<img class="award-img" src="./images/default-award.png">')
					._('<section class="dialog-footer">')
					._('<section class="btn-lottery-box">')
					._('<a href="javascript:void(0);" class="btn-lottery btn-link-use" id="btn-linkLottery-use" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-use" data-collect-desc="弹层(外链)-点我领取按钮"></a>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>');
				return t.toString();
			}
		},
		codeLottery: {
			$dialog: null,
			open: function(data) {
				H.lottery.isCanShake = false;
				H.lottery.canJump = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				me.update(data);
				$('.dialog').each(function() {
					$(this).css({
						'top': $(window).height() * 0.18
					});
				});
			},
			close: function() {
				var me = this;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({'opacity':'0'}, 1000);
				setTimeout(function(){
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-dialog-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-codeLottery-use').click(function(e) {
					e.preventDefault();
					getResult('api/lottery/award', {
						oi: openid,
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : ""
					}, 'callbackLotteryAwardHandler');
					me.close();
					showTips('领取成功');
				});
			},
			update: function(data) {
				var me = this;
				if(data.result){
					$("#code-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
					$("#code-dialog").find(".award-keyTips").html(data.tt || '');
					if (data.cc || data.cc != '') {
						if (data.cc.split(',')[0]) {
							$("#code-dialog").find(".code-box").append("<p>" + (data.cc.split(',')[0] || '') + "</p>");
						}
						if (data.cc.split(',')[1]) {
							$("#code-dialog").find(".code-box").append("<p>" + (data.cc.split(',')[1] || '') + "</p>");
						}
						$("#code-dialog").find(".code-box").removeClass('none');
					} else {
						$("#code-dialog").find(".code-box").addClass('none');
					}
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-code" id="code-dialog">')
					._('<section class="dialog code-dialog">')
					._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-code-btn-close" data-collect-desc="弹层(兑换码)-关闭按钮"></a>')
					._('<section class="dialog-content">')
					._('<section class="dialog-body">')
					._('<p class="award-keyTips"></p>')
					._('<img class="award-img" src="./images/default-award.png">')
					._('<section class="code-box none"></section>')
					._('</section>')
					._('<section class="dialog-footer">')
					._('<section class="btn-lottery-box">')
					._('<a href="javascript:void(0);" class="btn-lottery btn-code-use" id="btn-codeLottery-use" data-collect="true" data-collect-flag="dialog-code-btn-codeLottery-use" data-collect-desc="弹层(兑换码)-领取按钮"></a>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>');
				return t.toString();
			}
		},
		jifenLottery: {
			$dialog: null,
			name: '',
			mobile: '',
			address: '',
			ru: '',
			open: function(data) {
				H.lottery.isCanShake = false;
				H.lottery.canJump = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				me.update(data);
				$('.dialog').each(function() {
					$(this).css({
						'top': $(window).height() * 0.18
					});
				});
			},
			close: function() {
				var me = this;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({'opacity':'0'}, 1000);
				setTimeout(function(){
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-dialog-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-jifenLottery-award').click(function(e) {
					e.preventDefault();
					if(!$('#btn-jifenLottery-award').hasClass("flag")){
						$('#btn-jifenLottery-award').addClass("flag");
						getResult('api/lottery/award', {
							oi: openid,
							nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							hi: headimgurl ? headimgurl : "",
							pv: H.dialog.PV
						}, 'callbackLotteryAwardHandler');
						me.close();
						showTips('领取成功');
					}
				});
				this.$dialog.find('#btn-jifenLottery-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function(data) {
				var me = this;
				if(data.result){
					$("#jifen-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-jifen" id="jifen-dialog">')
					._('<section class="dialog jifen-dialog">')
					._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-jifen-btn-close" data-collect-desc="弹层(实物)-关闭按钮"></a>')
					._('<section class="dialog-content">')
					._('<section class="dialog-body">')

					._('<img class="award-img" style="border: none" />')

					._('</section>')
					._('<section class="dialog-footer">')
					._('<section class="btn-lottery-box">')
					._('<a href="javascript:void(0);" class="btn-lottery btn-jifen-lottery-award" id="btn-jifenLottery-award" data-collect="true" data-collect-flag="dialog-jifen-btn-jifenLottery-award" data-collect-desc="弹层(实物)-领取按钮"></a>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>');
				return t.toString();
			}
		},
		wxcardLottery: {
			$dialog: null,
			ci:null,
			ts:null,
			si:null,
			pt:null,
			sto:null,
			open: function(data) {
				var me =this, $dialog = this.$dialog;
				H.lottery.isCanShake = false;
				H.lottery.canJump = false;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				me.update(data);
				$('.dialog').each(function() {
					$(this).css({
						'top': ($(window).height() * 0.1)+"px"
					});
				});
				me.readyFunc();
			},
			close: function() {
				var me = this;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({'opacity':'0'}, 1000);
				setTimeout(function(){
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-dialog-close').click(function(e) {
					e.preventDefault();
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.close();
				});
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.close();
				});
			},
			readyFunc: function(){
				var me = this;
				$('#btn-wxcardLottery-award').click(function(e) {
					e.preventDefault();
					H.lottery.isCanShake = false;
					if(!$('#btn-wxcardLottery-award').hasClass("flag")){
						$('#btn-wxcardLottery-award').addClass("flag");
						shownewLoading();
						me.close();
						me.sto = setTimeout(function(){
							H.lottery.isCanShake = true;
							hidenewLoading();
						},15000);
						//$('#btn-wxcardLottery-award').text("领取中");
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
						H.lottery.wxCheck = true;
						H.lottery.canJump = true;
						H.lottery.isCanShake = true;
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid
						}, 'callbackLotteryAwardHandler');
						showTips('领取成功');
					},
					fail: function(res){
						H.lottery.isCanShake = true;
						H.lottery.canJump = true;
						hidenewLoading();
						recordUserOperate(openid, res.errMsg, "card-fail");
					},
					complete:function(){
						me.sto && clearTimeout(me.sto);
						H.lottery.isCanShake = true;
						H.lottery.canJump = true;
						hidenewLoading();
					},
					cancel:function(){
						H.lottery.isCanShake = true;
						H.lottery.canJump = true;
						hidenewLoading();
					}
				});
			},
			update: function(data) {
				var me = this, height = $(window).height();
				if(data.result && data.pt == 7){
					me.pt = data.pt;
					me.ci = data.ci;
					me.ts = data.ts;
					me.si = data.si;
					$("#wxcard-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-wxcard" id="wxcard-dialog">')
					._('<section class="dialog wxcard-dialog">')
					._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-wxcard-btn-close" data-collect-desc="弹层(卡券)-关闭按钮"></a>')
					._('<section class="dialog-content">')
					._('<section class="dialog-body">')
					._('<img class="award-img" src="">')
					._('<section class="dialog-footer">')
					._('<section class="btn-lottery-box">')
					._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮"></a>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>');
				return t.toString();
			}
		},
		thanks: {
			$dialog: null,
			name: '',
			mobile: '',
			address: '',
			ru: '',
			open: function() {
				H.dialog.pt = 1;
				H.lottery.isCanShake = false;
				H.lottery.canJump = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				$('.dialog').each(function() {
					$(this).css({
						'top': $(window).height() * 0.1
					});
				});
			},
			close: function() {
				var me = this;
				H.dialog.pt = null;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({'opacity':'0'}, 1000);
				setTimeout(function(){
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-dialog-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-shiwuLottery-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-none-lottery-award').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-none" id="none-dialog">')
					._('<section class="dialog none-dialog">')
					._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-close" data-collect-desc="弹层(实物)-关闭按钮"></a>')
					._('<section class="dialog-content">')
					._('<section class="dialog-body">')
					//._('<img class="award-img-tip" src="./images/none-award-tip.png">')
					._('<p class="award-keyTips">关注我们，赢取更多奖品</p>')
					._('</section>')
					._('<section class="dialog-footer">')
					._('<section class="dialog-show">')
					//._('<img class="award-img-tip" src="./images/chk.png">')
					._('</section>')
					._('<section class="btn-lottery-box">')
					//._('<a href="javascript:void(0);" class="btn-lottery btn-none-lottery-award" id="btn-none-lottery-award" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery-award" data-collect-desc="弹层(实物)-领取按钮"></a>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>');
				return t.toString();
			}
		},
		openLuck: {
			$dialog: null,
			open: function(data) {
				$(".dialog-footer").css("height","120px");
				H.lottery.isCanShake = false;
				H.lottery.canJump = false;
				var me =this, $dialog = this.$dialog;
				this.justopen(data);
				//H.dialog.open.call(this);
				//if (!$dialog) {
				//   this.event(data);
				//}
			},
			close: function() {
				var me = this;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				this.$dialog.animate({'opacity':'0'}, 1000);
				setTimeout(function(){
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			event: function(data) {
				var me = this;
				this.$dialog.find('.btn-dialog-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-openLuckLottery-close').click(function(e) {
					e.preventDefault();
					me.close();
					if(data == null || data.result == false || data.pt == 0){
						setTimeout(function(){H.dialog.thanks.open();}, 500);
					}else{
						if (data.pt == 1) {
							H.dialog.shiwuLottery.open(data);
						} else if (data.pt == 2) {
							H.dialog.jifenLottery.open(data);
						} else if (data.pt == 4) {
							H.dialog.redbagLottery.open(data);
						} else if (data.pt == 5) {
							H.dialog.codeLottery.open(data);
						} else if (data.pt == 6) {
							H.dialog.llLottery.open(data);
						} else if (data.pt == 7) {
							H.dialog.wxcardLottery.open(data);
						} else if (data.pt == 9) {
							H.dialog.linkLottery.open(data);
						} else {
							setTimeout(function(){H.dialog.thanks.open();}, 500);
						}
					}
				});
			},
			justopen: function (data) {
				if(data == null || data.result == false || data.pt == 0){
					setTimeout(function(){H.dialog.thanks.open();}, 500);
				}else{
					if (data.pt == 1) {
						H.dialog.shiwuLottery.open(data);
					} else if (data.pt == 2) {
						H.dialog.jifenLottery.open(data);
					} else if (data.pt == 4) {
						H.dialog.redbagLottery.open(data);
					} else if (data.pt == 5) {
						H.dialog.codeLottery.open(data);
					} else if (data.pt == 6) {
						H.dialog.llLottery.open(data);
					} else if (data.pt == 7) {
						H.dialog.wxcardLottery.open(data);
					} else if (data.pt == 9) {
						H.dialog.linkLottery.open(data);
					} else {
						setTimeout(function(){H.dialog.thanks.open();}, 500);
					}
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-openLuck" id="openLuck-dialog">')
					._('<section class="dialog openLuck-dialog">')
					._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-openLuck-btn-close" data-collect-desc="弹层(拆红包)-关闭按钮"></a>')
					._('<section class="dialog-content">')
					._('<section class="dialog-body">')
					._('<img class="icon-openluck" src="./images/icon-openluck.png">')
					._('<p class="sponsor-tips">本环节奖品由</p>')
					._('<img class="icon-sponsorlogo" src="./images/icon-logo.png">')
					._('<p class="sponsor-tips">赞助提供</p>')
					._('</section>')
					._('<section class="dialog-footer">')
					._('<section class="btn-lottery-box">')
					._('<a href="javascript:void(0);" class="btn-lottery btn-openLuck-lottery-close" id="btn-openLuckLottery-close" data-collect="true" data-collect-flag="dialog-openLuck-btn-openLuckLottery-close" data-collect-desc="弹层(拆红包)-拆红包按钮">拆红包</a>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>')
					._('</section>');
				return t.toString();
			}
		}
	};

	W.commonApiRuleHandler = function(data) {
		if(data.code == 0){
			rule_temp = data.rule;
			$("#rule-content").html(data.rule);
		}
		hidenewLoading();
	};

	W.callbackIntegralRankSelfRoundHandler = function(data) {
		if (data.result) {
			H.dialog.rank.selfupdate(data);
		};
	};

	W.callbackIntegralRankTop10RoundHandler = function(data) {
		if (data.result) {
			H.dialog.rank.update(data);
		};
	};

	W.callbackUserInfoHandler = function(data){
		if(data.result){
			if (data.rn && data.ph && data.ad) {
				if (data.rn == '' || data.ph == '' || data.ad == '') {
					H.dialog.rank.updateInfo(data);
				}
			} else {
				H.dialog.rank.updateInfo(data);
			}
		}
	};

	W.callbackLotteryAwardHandler = function(data) {};
})(Zepto);

$(function() {
	H.dialog.init();
});