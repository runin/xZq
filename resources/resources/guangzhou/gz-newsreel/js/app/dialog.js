(function($) {
	H.dialog = {
		puid: 0,
		ci:null,
		ts:null,
		si:null,
		chkimgnum:0,
		$container: $('body'),
		init: function() {
			var me = this, height = $(window).height(), width = $(window).width();
			$('body').css({
				'width': width,
				'height': height
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
			this.$dialog.find('.dialog').addClass('bounceInDown');
			setTimeout(function(){
				me.$dialog.find('.dialog').removeClass('bounceInDown');
			}, 1000);
		},
		relocate : function(){
			var height = $(window).height(), width = $(window).width();
			$('.dialog').each(function() {
				$(this).css({
					'width': width,
					'height': height,
					'left': 0,
					'top': 0
				});
			});
			$(".rule-dialog").css({
				'width': width * 0.82,
				'height': height * 0.7,
				'left': width * 0.09,
				'right': width * 0.09,
				'top': height * 0.15,
				'bottom': height * 0.15
			});
		},
		// 规则
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				$('body').addClass('noscroll');
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
				$('body').removeClass('noscroll');
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
				this.$dialog.find('.rule').html(rule).removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-xian-lingjuli-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"><span>x</span></a>')
					._('<div class="content border">')
					._('<h2>活动规则</h2>')
					._('<div class="rule"></div>')
					._('</div>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
		lottery: {
			$dialog: null,
			url:null,
			ci:null,
			ts:null,
			si:null,
			pt:null,
			sto:null,
			name:null,
			mobile:null,
			open: function(data) {
				H.lottery.isCanShake = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				var winW = $(window).width(), winH = $(window).height();
				var lotteryW = winW * 0.8,
					lotteryH = winH * 0.5,
					lotteryT = (winH - lotteryH) / 2,
					lotteryL = (winW - lotteryW) / 2;
				$('.lottery-dialog').css({
					'opacity':"0",
					'width': lotteryW,
					'height': lotteryH,
					'top': lotteryT,
					'left': lotteryL
				});
				H.dialog.lottery.update(data);
				H.dialog.lottery.readyFunc();
				H.lottery.canJump = false;
			},
			ani: function () {
				$('.lottery-dialog').css({"-webkit-animation":"dispshow 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).on("webkitAnimationEnd", function () {
					$('.lottery-dialog').css({"-webkit-animation":"","opacity":"1"});
				});
			},
			close: function() {
				var me = this;
				this.$dialog.find('.dialog').addClass('bounceOutDown');
				setTimeout(function(){
					$('.lottery-dialog').css({"-webkit-animation":"disphide 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).on("webkitAnimationEnd", function () {
						$('.lottery-dialog').css({"-webkit-animation":"","opacity":"0"});
						me.$dialog && me.$dialog.remove();
						me.$dialog = null;
					});
				}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
					me.close();
				});
				document.getElementById("aw8").onload = function () {

					if(H.dialog.chkimgnum == 0){
						H.dialog.chkimgnum ++;

					}else if(H.dialog.chkimgnum == 1){
						var newheight = $(".lottery-btn").height() + $(".award-img").height() + $("#aw8").height();

						$('.lottery-dialog').css({
							'height': (newheight + ($(window).height()  * 0.24)) + "px",
							'top': ($(window).height() - (newheight + ($(window).height()  * 0.24))) / 2
						});
						H.dialog.chkimgnum = 0;
						H.dialog.lottery.ani();
					}
				};
				document.getElementById("aw9").onload = function () {
					console.log("2");
					if(H.dialog.chkimgnum == 0){
						H.dialog.chkimgnum ++;

					}else if(H.dialog.chkimgnum == 1){
						var newheight = $(".lottery-btn").height() + $(".award-img").height() + $("#aw8").height();
						$('.lottery-dialog').css({
							'height': (newheight + ($(window).height()  * 0.24)) + "px",
							'top': ($(window).height() - (newheight + ($(window).height()  * 0.24))) / 2
						});
						H.dialog.chkimgnum = 0;
						H.dialog.lottery.ani();
					}
				}
			},
			readyFunc: function(){
				var me = this;
				$('#btn-getluck').click(function(e) {
					e.preventDefault();
					//if($("#lot-inp").hasClass("none") || me.check()){
					//	H.lottery.isCanShake = false;
					//	if(!$('#btn-getluck').hasClass("flag")){
					//		$('#btn-getluck').addClass("flag");
					//		if(me.pt == 7){
					//			shownewLoading();
					//			me.close();
					//			me.sto = setTimeout(function(){
					//				H.lottery.isCanShake = true;
					//				hidenewLoading();
					//			},15000);
					//			$('#btn-getluck').text("领取中");
					//			H.lottery.wxCheck = false;
					//			setTimeout(function(){
					//				me.wx_card();
					//			},1000);
					//		}else if(me.pt == 9){
					//			shownewLoading();
					//			$('#btn-getluck').text("领取中");
					//			getResult('api/lottery/award', {
					//				nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
					//				hi: headimgurl ? headimgurl : "",
					//				oi: openid,
					//				rn: me.name ? encodeURIComponent(me.name) : "",
					//				ph: me.mobile ? me.mobile : ""
					//			}, 'callbackLotteryAwardHandler');
								setTimeout(function(){
									location.href = H.dialog.lottery.url;
								},500);
					//		}
					//	}
					//}
				});
			},
			wx_card:function(){
				var me = this;
				//卡券
				wx.addCard({
					cardList: [{
						cardId: me.ci,
						cardExt: "{\"timestamp\":\""+ me.ts +"\",\"signature\":\""+ me.si +"\"}"
					}],
					success: function (res) {
						H.lottery.wxCheck = true;
						H.lottery.canJump = true;
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid,
							rn: me.name ? encodeURIComponent(me.name) : "",
							ph: me.mobile ? me.mobile : ""
						}, 'callbackLotteryAwardHandler');
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
						hidenewLoading();
					},
					cancel:function(){
						H.lottery.isCanShake = true;
						hidenewLoading();
					}
				});
			},
			update: function(data) {
				var me = this;
				if(data.result && (data.pt == 7 || data.pt == 9)){
					me.pt = data.pt;
					$(".lottery-dialog").find(".award-img").attr("src",data.pi);
					$(".lottery-dialog").find(".award-luck").html(data.tt);
					if(data.cu == 1){
						$('.lottery-dialog').css({
							//'height': $(window).height()*0.5,
							'height': "230px",
							'top': ($(window).height() - 230) / 2
						});
						$("#lot-inp").removeClass("none");
					}else{
						$("#lot-inp").addClass("none");
					}
					if(data.pt == 9){
						me.url = data.ru;
						//if(!data.ru){
						//     $("#btn-getluck").addClass("none");
						//}else{
						//     $("#btn-getluck").removeClass("none");
						//}
					}else if(data.pt == 7){
						me.ci = data.ci;
						me.ts = data.ts;
						me.si = data.si;
					}
				}

			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal modal-lottery" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dialog-task-quan-link-close-btn" data-collect-desc="中奖弹层业务类(卡券-外链)-关闭按钮"></a>')
					._('<div class="lott-box" id="lott">')
					._('<img class="award-tips" id="aw8" src="./images/lottery-title.png">')
					._('<p class="award-luck"></p>')
					._('<img class="award-img" id="aw9" src="">')
					._('<div class="inp" id="lot-inp">')
					//._('<p class="ple">请填写您的联系方式，以便顺利领奖</p>')
					//._('<p>姓名：<input class="name"></p>')
					//._('<p>电话：<input class="phone" type="tel"></p>')
					._('</div>')
					._('<a class="lottery-btn" id="btn-getluck" href="#" data-collect="true" data-collect-flag="dialog-task-quan-link-get-btn" data-collect-desc="中奖弹层业务类(卡券-外链)-领取按钮">领取</a>')
					._('</div>')
					._('</div>')
					._('</div>');
				return t.toString();
			},
			check:function(){
				var me = this;
				var $mobile = $('.phone'),
					mobile = $.trim($mobile.val()),
					$name = $('.name'),
					name = $.trim($name.val());
				if (name.length > 20 || name.length == 0) {
					showTips('请填写您的姓名，以便顺利领奖！');
					return false;
				}else if (!/^\d{11}$/.test(mobile)) {
					showTips('请填写正确手机号，以便顺利领奖！');
					return false;
				}
				me.name = name;
				me.mobile = mobile;
				return true;
			}
		},
		Entlottery: {
			$dialog: null,
			pt:null,
			ru:null,
			open: function(data) {
				H.lottery.isCanShake = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				var winW = $(window).width(), winH = $(window).height();
				var lotteryW = winW * 0.86,
					lotteryH = winH * 0.8,
					lotteryT = (winH - lotteryH) / 2,
					lotteryL = (winW - lotteryW) / 2;
				$('.lottery-dialog').css({
					'opacity':"0",
					'width': lotteryW,
					'height': lotteryH,
					'top': lotteryT,
					'left': lotteryL
				});
				me.update(data);
				H.dialog.lottery.ani();
				H.dialog.lottery.readyFunc();
				H.lottery.canJump = false;
			},
			close: function() {
				H.lottery.isCanShake = true;
				H.lottery.canJump = true;
				var me = this;
				this.$dialog.find('.dialog').addClass('bounceOutDown');
				setTimeout(function(){
					$('.lottery-dialog').css({"-webkit-animation":"disphide 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"}).on("webkitAnimationEnd", function () {
						$('.lottery-dialog').css({"-webkit-animation":"","opacity":"0"});
						me.$dialog && me.$dialog.remove();
						me.$dialog = null;
					});
				}, 1000);
			},
			event: function() {
				var me = this;
				document.getElementById("aw8").onload = function () {
					if(H.dialog.chkimgnum == 0){
						H.dialog.chkimgnum++;
					}else if(H.dialog.chkimgnum == 1){
						var newheight = $(".inp").height() + $(".award-img").height() + $(".award-tips").height();
						$('.lottery-dialog').css({
							'height': (newheight + ($(window).height()  * 0.28)) + "px",
							'top': ($(window).height() - (newheight + ($(window).height()  * 0.28))) / 2
						});
						H.dialog.lottery.ani();
						H.dialog.chkimgnum = 0
					}
				};
				document.getElementById("aw9").onload = function () {
					if(H.dialog.chkimgnum == 0){
						H.dialog.chkimgnum++;
					}else if(H.dialog.chkimgnum == 1){
						var newheight = $(".inp").height() + $(".award-img").height() + $(".award-tips").height();
						$('.lottery-dialog').css({
							'height': (newheight + ($(window).height()  * 0.28)) + "px",
							'top': ($(window).height() - (newheight + ($(window).height()  * 0.28))) / 2
						});
						H.dialog.lottery.ani();
						H.dialog.chkimgnum = 0
					}
				};

				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-use').click(function(e) {
					e.preventDefault();
					if(me.ru){
						shownewLoading();
						setTimeout(function(){
							location.href = me.ru;
						},500);
					}else{
						me.close();
					}
				});
				this.$dialog.find('#btn-link').click(function(e) {
					e.preventDefault();
					if(me.ru){
						shownewLoading();
						setTimeout(function(){
							location.href = me.ru;
						},500);
					}else{
						me.close();
					}
				});
				this.$dialog.find('#btn-sure').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-award').click(function(e) {
					e.preventDefault();
					if(me.check()){
						var $mobile = $('.phone'),
							mobile = $.trim($mobile.val()),
							$name = $('.name'),
							name = $.trim($name.val()),
							$address = $('.address'),
							address = $.trim($address.val());
						if(me.pt == 1){
							$("#Entlottery-dialog").find(".na").text(name);
							$("#Entlottery-dialog").find(".ph").text(mobile);
							$("#Entlottery-dialog").find(".aa").text(address);
						}
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid,
							rn: name ? encodeURIComponent(name) : "",
							ph: mobile ? mobile : "",
							ad: address ? address : ""
						}, 'callbackLotteryAwardHandler');
						if(H.dialog.Entlottery.pt == 5){
							// showTips("领取成功");
							$(".duijiangma").addClass("none");
							$("#ent-inp").addClass("none");
							$("#ent-show").removeClass("none");
						}else if(H.dialog.Entlottery.pt == 1){
							// showTips("领取成功");
							$("#ent-inp").addClass("none");
							$("#ent-result").removeClass("none");
						}
					}
				});
			},
			update: function(data) {
				var me = this;
				me.pt = data.pt;
				if (data.ru) {
					me.ru = data.ru;
					$('#btn-link').removeClass('none');
					$('#btn-use').removeClass('none');
				} else {
					$('#btn-link').addClass('none');
					$('#btn-use').addClass('none');
				}
				if(data.result && data.pt == 5){
					
					$("#Entlottery-dialog").find(".award-img").attr("src",data.pi);
					$("#Entlottery-dialog").find(".name").val(data.rn?data.rn:"");
					$("#Entlottery-dialog").find(".phone").val(data.ph?data.ph:"");
					$("#Entlottery-dialog").find(".address").addClass("none");
					$("#Entlottery-dialog").find(".duijiangma").removeClass("none");
					if(data.aw){
						$("#ent-ple").text(data.aw);
					}
					if(data.pd){
						$('.prize-desc').text(data.pd);
					}
					var code = data.cc;
					if(code){
						var cd = code.split(",");
						if (typeof(cd[0]) == 'undefined' || cd[0] == '') {
							$('.code-number').addClass('none');
						} else {
							$("#Entlottery-dialog").find(".dc").text(cd[0]);
							$("#Entlottery-dialog").find(".award-luckEt").text(cd[0]);
							$('.code-number').removeClass('none');
						}
						if (typeof(cd[1]) == 'undefined' || cd[1] == '') {
							$('.code-password').addClass('none');
							$('.prize-desc').removeClass('none');
						} else {
							$("#Entlottery-dialog").find(".pc").text(cd[1]);
							$('.code-password').removeClass('none');
						}
					}

				}else if(data.result && data.pt == 1){
					$("#Entlottery-dialog").find(".award-luckEt").html(data.tt);
					$("#Entlottery-dialog").find(".award-img").attr("src",data.pi);
					$("#Entlottery-dialog").find(".name").val(data.rn?data.rn:"");
					$("#Entlottery-dialog").find(".phone").val(data.ph?data.ph:"");
					$("#Entlottery-dialog").find(".address").val(data.ad?data.ad:"");
					$("#Entlottery-dialog").find(".duijiangma").addClass("none");
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal modal-lottery" id="Entlottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dialog-task-Entlottery-close-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-关闭按钮"></a>')
					._('<div class="lott-box" id="ent-lott">')
					._('<img class="award-tips" id="aw8" src="./images/lottery-title.png">')
					._('<img class="award-img" id="aw9" src="./images/prize.png">')
					._('<p class="duijiangma">兑奖码:<span class="award-luckEt"></span></p>')
					._('<div class="inp" id="ent-inp">')
					._('<p class="ple">请填写您的联系方式，以便顺利领奖</p>')
					._('<p><input class="name" placeholder="姓名"></p>')
					._('<p><input class="phone" type="tel" placeholder="手机号码"></p>')
					._('<p><input class="address" type="text" placeholder="地址"></p>')
					._('<a class="lottery-btn" id="btn-award" data-collect="true" data-collect-flag="dialog-task-Entlottery-award-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-提交信息按钮">领    取</a>')
					._('</div>')
					._('<div class="code none" id="ent-show">')
					._('<p class="ple" id="ent-ple">请截屏此页，需凭此码兑换票券</p>')
					._('<p class="cd code-number">兑换码：<span class="dc"></span></p>')
					._('<p class="cd code-password">密码：<span class="pc"></span></p>')
					._('<p class="cd prize-desc none"></p>')
					._('<a class="lottery-btn" id="btn-use" data-collect="true" data-collect-flag="dialog-task-Entlottery-use-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-立即使用按钮">立即使用</a>')
					._('</div>')
					._('<div class="result none" id="ent-result">')
					._('<p class="ple">以下是您的联系方式!</p>')
					._('<p class="cd">姓名：<span class="na"></span></p>')
					._('<p class="cd">电话：<span class="ph"></span></p>')
					._('<p class="cd">地址：<span class="aa"></span></p>')
					._('<a class="lottery-btn" id="btn-link" data-collect="true" data-collect-flag="dialog-task-Entlottery-link-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-领取按钮">领取</a>')
					._('<a class="lottery-btn" id="btn-sure" data-collect="true" data-collect-flag="dialog-task-Entlottery-sure-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-返回按钮">返回</a>')
					._('</div>')
					._('</div>')
					._('</div>')
					._('</div>');
				return t.toString();
			},
			check:function(){
				var $mobile = $('.phone'),
					mobile = $.trim($mobile.val()),
					$name = $('.name'),
					name = $.trim($name.val()),
					$address = $('.address'),
					address = $.trim($address.val());
				if (name.length > 20 || name.length == 0) {
					showTips('请填写您的姓名，以便顺利领奖!');
					return false;
				}else if (!/^\d{11}$/.test(mobile)) {
					showTips('请填写正确手机号，以便顺利领奖！');
					return false;
				}else if (address.length > 30) {
					showTips('请填写正确地址，以便顺利领奖！');
					return false;
				}
				return true;
			}
		},
		Redlottery: {
			$dialog: null,
			rp:null,
			open: function(data) {
				H.lottery.isCanShake = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				var winW = $(window).width(), winH = $(window).height();
				var lotteryW = winW * 0.8,
					lotteryH = winH * 0.65,
					lotteryT = (winH - lotteryH) / 2,
					lotteryL = (winW - lotteryW) / 2;
				$('.redlottery-dialog').css({
					'width': lotteryW,
					'height': lotteryH,
					'top': lotteryT,
					'left': lotteryL
				});
				me.update(data);
				//$(".lottery-btn").css({
				//	"width":(lotteryW * 0.4),
				//	"left":(lotteryW * 0.3),
				//	"height":(lotteryW * 0.4)
				//});
				H.lottery.canJump = false;
			},
			close: function() {
				H.lottery.isCanShake = true;
				H.lottery.canJump = true;
				var me = this;
				this.$dialog.find('.dialog').addClass('bounceOutDown');
				setTimeout(function(){
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			event: function() {
				var me = this;
				$("#btn-red").click(function(){
					if(!$('#btn-red').hasClass("requesting") && me.rp){
						shownewLoading();
						$('#btn-red').addClass("requesting");
						//$('#btn-red').text("领取中");
						//showTips("领取中");
						//alert(me.rp);
						setTimeout(function(){
							location.href = me.rp;
							//location.href = "http://www.baidu.com";
						},500);
					}
				});
			},
			update: function(data) {
				var me = this;
				if(data.result && data.pt == 4){
					me.rp = data.rp;
					$(".redlottery-dialog").find(".award-img").attr("src",data.pi);
					$(".redlottery-dialog").find(".award-logo").attr("src",data.qc);
					$(".redlottery-dialog").find(".award-lpt").html(data.tt);
					$(".redlottery-dialog").find(".award-ly").html(data.aw);
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal modal-lottery" id="Redlottery-dialog">')
					._('<div class="dialog redlottery-dialog">')
					._('<p class="award-lpt"></p>')
					//._('<img class="award-logo" src="">')
					._('<img class="award-img" src="">')
					._('<a class="lottery-btn" id="btn-red" data-collect="true" data-collect-flag="dialog-task-red-close-btn" data-collect-desc="中奖弹层业务类(红包)-领取按钮"></a>')
					._('<p class="award-ly"></p>')
					._('</div>')
					._('</div>');
				return t.toString();
			}
		},
		// 谢谢参与
		thanks: {
			$dialog: null,
			open: function () {
				//var me = this;
				//H.dialog.open.call(this);
				//this.event();
				//setTimeout(function(){
				//	me.close();
				//},1000);
				showTips("差一点就中奖了，继续加油！");
			},
			close: function () {
				var me = this;
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				setTimeout(function(){
					H.lottery.isCanShake = true;
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				}, 1000);
			},
			event: function () {
				var me = this;
				this.$dialog.find('.close').click(function (e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('.thanks-close').click(function (e) {
					e.preventDefault();
					me.close();
				});
			},
			tpl: function () {
				var t = simpleTpl(), random = getRandomArbitrary(0, thanks_list.length);
				t._('<section class="modal modal-rul" id="thanks-dialog">')
					._('<div class="dialog thanks-dialog">')
					._('<img src="' + (thanks_list[random]) + '">')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		}

	};

	W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-dialog .content .rule").html(data.rule);
		}
	};

	W.callbackLotteryAwardHandler = function(data) {};
})(Zepto);

$(function() {
	H.dialog.init();
});
