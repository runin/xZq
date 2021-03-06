(function($) {
	H.dialog = {
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		PV:"",
        ci:"",
        ts:"",
        si:"",
		init: function() {
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
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.06;

			$('.dialog').each(function() {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({ 
					'width': width * 0.88, 
					'height': height * 0.88, 
					'left': width * 0.06,
					'right': width * 0.06,
					'top': height * 0.06,
					'bottom': height * 0.06
				});
			});
		},
		lottery: {
			iscroll: null,
			$dialog: null,
			LOTTERIED_CLS: 'lotteried',
			REQUEST_CLS: 'requesting',
			AWARDED_CLS: 'lottery-awarded',
            sto:null,
			redpack:"",
			pt:null,
			LOTTERY_NONE_CLS: 'lottery-none',
			ru:null,
			open: function(data) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(),
				winH = $(window).height();
				H.dialog.lottery.pt = data.pt;
				hideLoading($dialog);
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				this.$dialog && this.$dialog.removeClass('none');
				$(".lottery-dialog").css({ 
					'width': winW, 
					'height': winH * 0.65,
					'left': 0,
					'right':0,
					'top': winH * 0.15,
					'bottom': winH * 0.15
				});
				H.dialog.lottery.update(data);
				var inheight;
				if(data.pt == 7){
                    H.dialog.lottery.readyFunc();
					document.getElementById('aw').onload = function () {
						inheight = ($(".contact").height() + $(".award-img").height() + 35) + (winH * 0.2);
						if(inheight >= winH){
							$(".award-img img").css("height","60px");
							inheight = ($(".contact").height() + 95) + (winH * 0.2);
						}
						$(".lottery-dialog").css({
							'height': inheight,
							'top': (winH - inheight) * 0.5
						});
					};
                }else if(data.pt == 4){
				}else {
					document.getElementById('aw').onload = function () {
						inheight = ($(".contact").height() + $(".awardwin-tips").height() + $(".award-img").height() + 35) + (winH * 0.12);
						if(inheight >= winH){
							$(".award-img img").css("height","60px");
							inheight = ($(".contact").height() + 95) + (winH * 0.2);
						}

						$(".lottery-dialog").css({
							'height': inheight,
							'top': (winH - inheight) * 0.5
						});
					};
				}
			},
            readyFunc: function(){
                var me = this;
                this.$dialog.find('#btn-card').on("click", function (e) {
                    e.preventDefault();
                    if(!$('#btn-card').hasClass("flag")){
                        $('#btn-card').addClass("flag");
                        if(H.dialog.lottery.pt == 7){
							shownewLoading();
							me.close();
							me.sto = setTimeout(function(){
                                H.lottery.isCanShake = true;
                                hidenewLoading();
                            },15000);
                             H.lottery.wxCheck = false;
                            setTimeout(function(){
								H.dialog.lottery.wx_card();
                            },500);
                        }
                    }
                });
            },
            wx_card:function(){
                var me = this;
                //卡券
                wx.addCard({
                    cardList: [{
                        cardId: H.dialog.ci,
                        cardExt: "{\"timestamp\":\""+ H.dialog.ts +"\",\"signature\":\""+ H.dialog.si +"\"}"
                    }],
                    success: function (res) {
                        H.lottery.wxCheck = true;
                        H.lottery.isCanShake = true;
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
						H.lottery.isCanShake = true;
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
			event: function() {
				var me = this;
				$('#btn-award').click(function(e) {
					e.preventDefault();
					if (!me.check()) {
						return false;
					}
					
					var $mobile = $('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = $('.name'),
					name = $.trim($name.val()),
                    $address = $('.address'),
                    address = $.trim($address.val());
					me.disable();
					if(H.dialog.lottery.pt == 4){
						shownewLoading(null,"请稍候...");
						window.location.href = H.dialog.lottery.redpack;
						return;
					}else if(H.dialog.lottery.pt == 1){
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid,
							rn: name?encodeURIComponent(name) : '',
							ph: mobile? mobile : '',
							ad: address? encodeURIComponent(address) : ''
						}, 'callbackLotteryAwardHandler', true, me.$dialog);
					}else if(H.dialog.lottery.pt == 9){
						shownewLoading(null,"请稍候...");
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid
						}, 'callbackLotteryAwardHandler', true, me.$dialog);
						setTimeout(function(){
							location.href = me.ru;
						},500);
					}
					H.dialog.lottery.succ();
					H.dialog.lottery.reset();
					H.lottery.isCanShake = true;
				});
				
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
					H.lottery.isCanShake = true;
				});
				
				this.$dialog.find('.btn-share').click(function(e) {
					e.preventDefault();
					me.$dialog.find('.btn-close').trigger('click');
					me.reset();
					H.lottery.isCanShake = true;
				});
			},
			update: function(data) {
				var me = this;
				if (data != null && data != '') {
					if (data.result) {
						if (data.pt === 1) { //实物奖品
                            this.$dialog.find(".lottery-dialog").addClass("award-bg");
							this.$dialog.find('.awardwin-tips').html(data.tt || '').removeClass('none');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.find('.q-address').val(data.ad || '');
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').removeClass('redbag');
							this.$dialog.find('.btn').css({"background":"url(./images/award-btn.png) 0 0 no-repeat","background-size":"100%"});
							this.$dialog.find('.btn-share').css({"background":"url(./images/try.png) 0 0 no-repeat","background-size":"100%"});
							$(".award-win").css("margin","auto");
							$(".award-img").css("margin","10% auto 3%");
							$(".award-win").css({"background": "url(./images/newaward-bg.jpg) no-repeat 100% 100%!important","background-size": "100% 100%!important"});
							$(".award-bg").css({"background": ""});
						} else if (data.pt === 9) { //外链
                            this.$dialog.find(".lottery-dialog").addClass("award-bg");
							this.$dialog.find('.awardwin-tips').html(data.tt || '').removeClass('none');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.find('.q-name').addClass("none");
							this.$dialog.find('.q-mobile').addClass("none");
							this.$dialog.find('.q-address').addClass("none");
							this.$dialog.find('.award-tip').addClass("none");
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').removeClass('redbag');
							this.$dialog.find('#btn-award').css({"background":"url(./images/award-btn.png) 0 0 no-repeat","background-size":"100%"});
							$(".award-win").css("margin","auto");
							$(".award-img").css("margin","10% auto 3%");
							$(".award-win").css({"background": "url(./images/newaward-bg.jpg) no-repeat 100% 100%!important","background-size": "100% 100%!important"});
							$(".award-bg").css({"background": ""});
							me.ru = data.ru;

						} else if (data.pt === 7) { //卡券
                            H.dialog.ci = data.ci;
                            H.dialog.ts = data.ts;
                            H.dialog.si = data.si;
                            this.$dialog.find(".lottery-dialog").addClass("award-bg");
                            this.$dialog.find('.awardwin-tips').html(data.tt || '');
                            this.$dialog.find('img').attr('src', (data.pi || ''));
                            this.$dialog.find('.q-name').addClass("none");
                            this.$dialog.find('.q-mobile').addClass("none");
                            this.$dialog.find('.q-address').addClass("none");
                            this.$dialog.find('.award-tip').addClass("none");
                            this.$dialog.find('.awardwin-tips').removeClass("none");
                            this.$dialog.addClass(this.LOTTERIED_CLS);
							$(".award-win").css({"background": "url(./images/newaward-bg.jpg) no-repeat 100% 100%!important","background-size": "100% 100%!important"});
							$(".award-win").css("margin","auto");
							$(".award-img").css("margin","10% auto 3%");
							this.$dialog.find('.award-win').removeClass('none');
							$(".award-bg").css({"background": ""});
							this.$dialog.find('#btn-card').css({"background":"url(./images/award-btn.png) 0 0 no-repeat","background-size":"100%"});
                            this.$dialog.find('.contact').removeClass('redbag');
                            this.$dialog.find('#btn-award').addClass('none');
                            this.$dialog.find('#btn-card').removeClass('none');
						}else if (data.pt === 4) { //红包
							H.dialog.lottery.redpack = data.rp;
							$(".red").css("top",(($(".back").height() - ($(window).width() * 0.86)) * 0.5) + "px").removeClass('none').on("click", function () {
								$(".red").addClass('none');
								var me = H.dialog.lottery;
								me.$dialog.find(".lottery-dialog").addClass("award-bg");
								me.$dialog.find('.awardwin-tips').html(data.tt || '');
								me.$dialog.find('img').attr('src', (data.pi || ''));
								me.$dialog.find('.q-name').addClass("none");
								me.$dialog.find('.q-mobile').addClass("none");
								me.$dialog.find('.q-address').addClass("none");
								me.$dialog.find('.award-tip').addClass("none");
								me.$dialog.addClass(me.LOTTERIED_CLS);
								me.$dialog.find('.award-win').removeClass('none');
								me.$dialog.find('.contact').removeClass('redbag');
								me.$dialog.find('.btn').css({"background":"url(./images/award-btn.png) 0 0 no-repeat","background-size":"100%"});
								me.$dialog.find('.btn-share').css({"background":"url(./images/try.png) 0 0 no-repeat","background-size":"100%"});
								$(".award-win").css("margin","15% auto");
								$(".award-img").css("margin","40% auto 3%");
								if(($(window).height()<520)){
									$(".award-img").css("margin","36% auto 3%");
								}
								if($(window).height()<440){
									$(".award-img").css("margin","26% auto 3%");
								}
								$(".award-bg").css({"background": "url(./images/award-bg.png) no-repeat 100% 100%!important","background-size": "100% 100% !important"})
							})
						} else {
							this.$dialog.find('.award-win').addClass('none');
							this.$dialog.addClass(this.LOTTERY_NONE_CLS);
						}
					} else {
						this.$dialog.find('.award-win').addClass('none');
						this.$dialog.addClass(this.LOTTERY_NONE_CLS);
					}
				} else {
					this.$dialog.find('.award-win').addClass('none');
					this.$dialog.addClass(this.LOTTERY_NONE_CLS);
				}
				this.$dialog.removeClass(this.REQUEST_CLS);
			},
			check: function() {
				if(H.dialog.lottery.pt == 1){
					var $mobile = $('.mobile'),
						mobile = $.trim($mobile.val()),
						$address = $('.address'),
						address = $.trim($address.val()),
						$name = $('.name'),
						name = $.trim($name.val());
					if (name.length > 20 || name.length == 0) {
						showTips('请输入您的姓名，不要超过20字哦!');
						return false;
					}else if (!/^\d{11}$/.test(mobile)) {
						showTips('这手机号，可打不通...');
						return false;
					}
				}
				return true;
			},
			
			enable: function() {
				this.$dialog.find('#btn-award').removeClass(this.REQUEST_CLS);
			},
			disable: function() {
				this.$dialog.find('#btn-award').addClass(this.REQUEST_CLS);
			},
			scroll_enable: function() {
				if (this.iscroll) {
					this.iscroll.scrollTo(0, 0);
					this.iscroll.enable();
				}
			},
			scroll_disable: function() {
				if (this.iscroll) {
					this.iscroll.scrollTo(0, 0);
					this.iscroll.disable();
				}
			},
			succ: function() {
                showTips('领取成功');
				if(H.dialog.lottery.pt == 1){
					var $qmobile = $('.dialog').find('.mobile'),
						qmobile = $qmobile.val(),
						$name = $('.dialog').find('.name'),
						qname = $name.val(),
						$address = $('.dialog').find('.address'),
						qaddress = $address.val();
					$qmobile.attr("disabled","disabled");
					$name.attr("disabled","disabled");
					$address.attr("disabled","disabled");
					this.$dialog.addClass(this.AWARDED_CLS);
					$('.name').val(qname);
					$('.mobile').val(qmobile);
					$('.address').val(qaddress);
				}
			},
			reset: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			close: function() {
				this.$dialog.find('.btn-close').trigger('click');
			},
			tpl: function() {
				var t = simpleTpl();

				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="black"></div>>')

					._('<div class="dialog lottery-dialog">')
					._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="back">')
					._('<img class="red none" src="images/red-bg.png" />')

					._('<div class="award-win none">')
										._('<h5 class="awardwin-tips none"></h5>')
										._('<div class="award-img">')
										._('<img id="aw" src="" />')
										._('</div>')
										._('<div class="contact">')
											._('<h4 class="award-tip">请正确填写信息，以便工作人员顺利联系到您</h4>')
											._('<h4 class="awarded-tip">以下是您的联系方式</h4>')
											._('<p class="q-name">姓名：<input type="text" class="name" placeholder="" /></p>')
											._('<p class="q-mobile">电话：<input type="tel" class="mobile" placeholder="" /></p>')
											._('<p class="q-address">地址：<input type="text" class="address" placeholder="" /></p>')
											._('<a href="#" class="btn btn-award" id="btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮"></a>')
											._('<a href="#" class="btn btn-award none" id="btn-card" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮"></a>')
											._('<div class="share"><a href="#" class="btn btn-share"></a></div>')
										._('</div>')
									._('</div>')
									._('<div class="award-none none">')
										._('<img id="imgnone" src="./images/lottery-none.jpg">')
										._('<a href="#" class="outer" data-collect="true" data-collect-flag="tttj" data-collect-desc="天天淘金"></a>')
										._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lotterydialog-backbtn" data-collect-desc="抽奖弹层-返回按钮"></a>')
									._('</div>')
								._('</div>')
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');

				return t.toString();
			}
		}
	};
	
	W.callbackLotteryAwardHandler = function(data) {
	};
	//天天淘金的广告链接
	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			jumpUrl = data.url;
			Desc = (data.desc).toString();
			$(".outer").attr("href",jumpUrl).html(Desc).removeClass("none");
		}else{
			$(".outer").addClass("none");
		}
	};
})(Zepto);

$(function() {
	H.dialog.init();
});