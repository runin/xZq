(function($) {
	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		redpack : '',
		iscroll: null,
		isJump :true,
		hasaddr:false,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				me.close();
			})

		},
		close: function() {
			$('.modal').addClass('none');
		},
		open: function() {

			if (this.$dialog) {
				this.$dialog.removeClass('none');
			} else {
				this.$dialog = $(this.tpl());
				H.dialog.$container.append(this.$dialog);
			}
			H.dialog.relocate();
		},
		relocate : function(){
			var height = $(window).height(),
				width = $(window).width(),
				top = $(window).scrollTop();
			$('.modal').each(function() {
				$(this).css({ 'width': width, 'height': height }).find('.').css({'right': '0px', 'top': '0px'});
			});
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
			$(".thanks-dialog").css({
				'width': width * 0.82,
				'height': height * 0.7,
				'left': width * 0.09,
				'right': width * 0.09,
				'top': height * 0.15
				//'bottom': height * 0.075
			});
			$(".award").css({
				'width': width * 0.82,
				'height': height * 0.78,
				'left': width * 0.09,
				'right': width * 0.09,
				'top': height * 0.12
				//'bottom': height * 0.15
			});
			$(".confirm-dialog").css({
				'width': width * 0.80,
				'height': height * 0.70,
				'left': width * 0.1,
				'right': width * 0.1,
				'top': height * 0.15,
				'bottom': height * 0.15
			});

			$(".thanks-dialog .content").css({
				'height': $(".thanks-dialog").height() - 180
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-xian-lingjuli-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._('<div class="content border">')
					._('<h2>活动规则</h2>')
					._('<div class="rule none"></div>')
					._('</div>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
		prize: {
			$dialog: null,
			href : "",
			imgsrc: "",
			open: function () {
				H.dialog.open.call(this);
				getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
				this.event();
			},
			close: function () {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			event: function () {
				var me = this;
				$(".get-btn").click(function(){
					H.dialog.prize.openRedpack();
				});
				this.$dialog.find('.close').click(function (e) {
					e.preventDefault();
					H.index.leftActivityCount();
					me.close();
				});
				$('#btn-close').click(function (e) {
					e.preventDefault();
					H.index.leftActivityCount();
					me.close();
					//if(H.dialog.prize.imgsrc && H.dialog.prize.imgsrc != null && H.dialog.prize.imgsrc != ''){
					//H.dialog.confirm.open(H.dialog.prize.imgsrc);
					//}
				});
				$('#btn-justclose').click(function (e) {
					e.preventDefault();
					H.index.leftActivityCount();
					me.close();
					//if(H.dialog.prize.imgsrc && H.dialog.prize.imgsrc != null && H.dialog.prize.imgsrc != ''){
					//H.dialog.confirm.open(H.dialog.prize.imgsrc);
					//}
				});
				$('#btn-back').click(function (e) {
					e.preventDefault();
					H.index.leftActivityCount();
					me.close();
					if(H.dialog.prize.imgsrc && H.dialog.prize.imgsrc != null && H.dialog.prize.imgsrc != ''){
						H.dialog.confirm.open(H.dialog.prize.imgsrc);
					}
				});
				$(".lh").on("click",function(){
					$(".lihe").addClass("none");
					$(".award").removeClass("none");
				});
				$("#btn-award").on("click",function(){
					if(!me.check()){
						return false;
					}
					var mobile = $.trim(me.$dialog.find('.mobile').val()),
						name = $.trim(me.$dialog.find('.name').val()),
						addr = $.trim(me.$dialog.find('.address').val());
					$(".uname").find("span").text(name);
					$(".uphone").find("span").text(mobile);
					$(".uaddress").find("span").text(addr);
					if(H.dialog.hasaddr == false){
						getResult('api/lottery/award', {
							oi: openid,
							rn: encodeURIComponent(name),
							ph: mobile,
							hi: headimgurl,
							nn: nickname
						}, 'callbackLotteryAwardHandler', true, me.$dialog);
					}else{
						getResult('api/lottery/award', {
							oi: openid,
							rn: encodeURIComponent(name),
							ph: mobile,
							ad: encodeURIComponent(addr),
							hi: headimgurl,
							nn: nickname
						}, 'callbackLotteryAwardHandler', true, me.$dialog);
					}

				});
				if (is_android()) {
					this.iscroll = new IScroll(this.$dialog.find('.dialog')[0], {
						mouseWheel: true,
						preventDefaultException: { tagName: /^(A|INPUT|TEXTAREA|BUTTON|SELECT)$/ }
					});

					this.$dialog.find('input').focus(function() {
						if (me.iscroll) {
							me.iscroll.refresh();
							me.iscroll.scrollToElement($(this)[0]);
						}
					});
				}
			},
			check: function(data){
				var me = this, $mobile = me.$dialog.find('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = me.$dialog.find('.name'),
					name = $.trim($name.val()),
					$addr = me.$dialog.find('.address'),
					addr = $.trim($addr.val());

				if (name.length < 2 || name.length > 30) {
					showTips('姓名长度为2~30个字符',4);
					$name.focus();
					return false;
				}
				else if (!/^\d{11}$/.test(mobile)) {
					showTips('这手机号，可打不通哦...',4);
					$mobile.focus();
					return false;
				}
				//else if (addr.length < 2 || addr.length > 30) {
				//	showTips('地址长度为2~30个字符',4);
				//	$addr.focus();
				//	return false;
				//}
				return true;
			},
			update: function (data) {
				var me = this;
				if(data.pt == 6){
					//alert("6");
					$(".award").css({
						'height': $(window).height() * 0.65,
						'top': $(window).height() * 0.15
					});
					H.dialog.hasaddr = false;
					H.dialog.prize.imgsrc = data.qc;
					$(".tigong").find("span").html(data.aw);
					$(".lihe").find(".zanzhu").attr("src",data.pi);
					$(".award").find(".zanzhu").attr("src",data.pi);
					$(".tip").html(data.tt);
					$(".desc").html(data.pd);
					$(".name").val(data.rn || '');
					$(".mobile").val(data.ph || '');
					$(".uaddress").addClass("none");
					$(".address").addClass("none");
					$(".num").addClass("none");
					$(".conc").addClass("none");
					$(".lihe").removeClass("none");
				}else if(data.pt == 1){
					//alert("1");
					$(".award").css({
						'height': $(window).height() * 0.75,
						'top': $(window).height() * 0.15
					});
					H.dialog.hasaddr = true;
					H.dialog.prize.imgsrc = data.qc;
					$(".tigong").find("span").html(data.aw);
					$(".lihe").find(".zanzhu").attr("src",data.pi);
					$(".award").find(".zanzhu").attr("src",data.pi);
					$(".tip").html(data.tt);
					$(".desc").html(data.pd);
					$(".name").val(data.rn || '');
					$(".mobile").val(data.ph || '');
					$(".address").val(data.ad || '');
					$(".uaddress").removeClass("none");
					$(".address").removeClass("none");
					$(".num").addClass("none");
					$(".conc").addClass("none");
					$(".lihe").removeClass("none");

				}else if(data.pt == 9){
					//alert("9");
					$(".award").css({
						'height': $(window).height() * 0.55,
						'top': $(window).height() * 0.18
					});
					H.dialog.prize.imgsrc = data.qc;
					$(".tigong").find("span").html(data.aw);
					$(".lihe").find(".zanzhu").attr("src",data.pi);
					$(".award").find(".zanzhu").attr("src",data.pi);
					$(".cona").addClass("none");
					$(".conb").addClass("none");
					$(".conc").removeClass("none");
					$(".tip").html(data.tt);
					$(".desc").html(data.pd);
					$(".num").removeClass("none").html(data.cc);
					$(".lihe").removeClass("none");
					//$("#btn-award").text("领取")
					$("#btn-back").attr("href", (H.index.url).toString());
				}else if(data.pt == 0){
					$(".award").css({
						'height': $(window).height() * 0.55,
						'top': $(window).height() * 0.15
					});
					$(".thanks-dialog").removeClass("none");
				}
			},
			thanks: function () {
				$(".rule-dialog").addClass("none");
				$(".thanks-dialog").removeClass("none");
			},
			openRedpack: function () {
				var me = this;
				$(".get-btn").text("领取");
				$(".get-btn").removeClass("get-btn").addClass("award");
				$(".congrate").addClass("none");
				$(".redpack").removeClass("none");
				$(".award").on("click",function(){
					location.href = H.dialog.prize.href;
				});
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-rul " id="rule-dialog">')
					._('<div class="dialog rule-dialog none">')
					._('<div class="content">')
					._('<div class="congrate none">恭喜您获得一个红包</div>')
					._('<div class="redpack none">')
					._('<span class="con"></span>')
					._('<span class="mon"></span>')
					._('</div>')
					._('</div>')
					._('<a class="get-btn" data-collect="true" data-collect-flag="tv-xian-lingjuli-redpack-btn" data-collect-desc="领取红包">')
					._('打开')
					._('</a>')
					._('</div>')
					._('<div class="dialog lihe none">')
					._('<div class="congrate">恭喜您,点开看看吧</div>')
					._('<img class="lh" src="./images/lihe.png">')
					//._('<img class="zanzhu" src="">')
					//._('<div class="tigong">本奖品由<span></span>提供</div>')
					._('</div>')
					._('</div>')
					._('<div class="dialog award none">')
					._('<a href="#" class="btn btn-award" id="btn-justclose" data-collect="true" data-collect-flag="tv-xian-lingjuli-lotterydialog-closebtn" data-collect-desc="抽奖弹层-抽奖确认按钮"></a>')
					._('<div class="tip"></div>')
					._('<img class="zanzhu" src="">')
					._('<div class="num none"></div>')
					//._('<div class="desc"></div>')
					._('<div class="cona">')
					._('<p class="contact">请填写您的联系方式以便顺利领奖</p>')
					._('<p class="ipt"><input type="text" class="name" placeholder="姓名" /></p>')
					._('<p class="ipt"><input type="text" class="mobile" placeholder="联系电话" /></p>')
					._('<p class="ipt"><input type="text" class="address" placeholder="地址" /></p>')
					._('<a href="#" class="btn btn-award" id="btn-award" data-collect="true" data-collect-flag="tv-xian-lingjuli-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">确认</a>')
					._('</div>')
					._('<div class="conb none">')
					._('<p class="contact">请保存此截图以便兑奖</p>')
					._('<p class="uname">姓名：<span></span></p>')
					._('<p class="uphone">电话：<span></span></p>')
					._('<p class="uaddress">地址：<span></span></p>')
					._('<a href="#" class="outer none" data-collect="true" data-collect-flag="tttj" data-collect-desc="天天淘金"></a>')
					._('<a href="#" class="btn btn-award" id="btn-close" data-collect="true" data-collect-flag="tv-xian-lingjuli-lotterydialog-closebtn" data-collect-desc="抽奖弹层-抽奖确认按钮">返回</a>')
					._('</div>')
					._('<div class="conc none">')
					._('<a href="#" class="outer none" data-collect="true" data-collect-flag="tttj" data-collect-desc="天天淘金"></a>')
					._('<a href="#" class="btn btn-award" id="btn-back" data-collect="true" data-collect-flag="tv-xian-lingjuli-lotterydialog-closebtn" data-collect-desc="抽奖弹层-抽奖确认按钮">领取</a>')
					._('</div>')
					._('</div>')
					._('<div class="dialog thanks-dialog none">')
					._('<div class="content">')
					//._('<img class="none zanzhu" src="">')
					._('<div class="sorry">上轮没领够？更多惊喜在这里</div>')
					._('<div class="qr">')
					._('<img src="./images/qrcode.jpg" class="qrcode">')
					._('<div class="tip">即刻关注西安网，更多大奖等您拿</div>')
					._('<a class="close-btn close" data-collect="true" data-collect-flag="tv-xian-lingjuli-dialog-close-btn" data-collect-desc="关闭谈层">确定</a>')
					._('</div>')
					._('</div>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
		confirm: {
			$dialog: null,
			open: function(data) {
				if (this.$dialog) {
					this.$dialog.removeClass('none');
				} else {
					this.$dialog = $(this.tpl(data));
					H.dialog.$container.append(this.$dialog);
				}
				H.dialog.relocate();
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-confirm').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			tpl: function(data) {
				var t = simpleTpl();
				t._('<section class="modal" id="confirm-dialog">')
					._('<div class="dialog confirm-dialog relocated">')
					._('<a href="#" class="btn-confirm" data-collect="true" data-collect-flag="tv-xian-lingjuli-conformdialog-closebtn" data-collect-desc="广告弹层-关闭按钮"></a>')
					._('<img src="'+data+'">')
					._('</div>')
					._('</section>');

				return t.toString();
			}
		}

	};

	W.callbackLotteryAwardHandler = function(data) {
		if (data.result) {
			$(".cona").addClass("none");
			$(".conb").removeClass("none");
			return;
		}
		showTips('亲，服务君繁忙！请稍后再试！');
	};
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};
	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			jumpUrl = data.url;
			$(".outer").attr("href",jumpUrl).html(data.desc).removeClass("none");
		}else{
			$(".outer").addClass("none");
		}
	};
})(Zepto);

$(function() {
	H.dialog.init();
});
