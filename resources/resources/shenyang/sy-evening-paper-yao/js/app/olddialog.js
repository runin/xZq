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
			name: '',
			mobile: '',
			address: '',
			open: function(data) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(),
				winH = $(window).height();
				H.dialog.lottery.pt = data.pt;
				hideLoading($dialog);
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event(data);
				}
				
				this.$dialog && this.$dialog.removeClass('none');
				this.pre_dom();
				
				H.dialog.lottery.update(data);
				if(data.pt == 7){
					 H.dialog.lottery.readyFunc();
				}
			},
			pre_dom: function(){
				var width = $(window).width(),
					height = $(window).height();
				if(W.screen.width === 320){
					$(".dialog").css({
						'width': "250px",
						'height': "375px",
						'left': Math.round((width-250)/2)+'px',
						'top': Math.round((height-375)/2)+'px'
					});
				}else{
					$(".dialog").css({
						'width': "320px",
						'height': "415px",
						'left': Math.round((width-320)/2)+'px',
						'top': Math.round((height-415)/2)+'px'
					});
				}
			},
            readyFunc: function(){
                var me = this;
                this.$dialog.find('#btn-card').on("click", function (e) {
                    e.preventDefault();
                    if(!$('#btn-card').hasClass("flag")){
                        $('#btn-card').addClass("flag");
                        if(H.dialog.lottery.pt == 7){
							showLoading();
							me.close();
							me.sto = setTimeout(function(){
								if(H.lottery.type == 2){
									H.lottery.isCanShake = true;
								}else{
									H.lottery.isCanShake = false;
								}
                                hideLoading();
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
                        if(H.lottery.type == 2){
							H.lottery.isCanShake = true;
						}else{
							H.lottery.isCanShake = false;
						}
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent(nickname) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
						if(H.lottery.type == 2){
									H.lottery.isCanShake = true;
								}else{
									H.lottery.isCanShake = false;
								}e;
                        hideLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        if(H.lottery.type == 2){
							H.lottery.isCanShake = true;
						}else{
							H.lottery.isCanShake = false;
						}
                        hideLoading();
                    },
                    cancel:function(){
                        if(H.lottery.type == 2){
							H.lottery.isCanShake = true;
						}else{
							H.lottery.isCanShake = false;
						}
                        hideLoading();
                    }
                });
            },
			event: function(data) {
				var me = H.dialog.lottery;
				$('#btn-award').click(function(e) {
					e.preventDefault();
					var $mobile = $('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = $('.name'),
					name = $.trim($name.val()),
                    $address = $('.address'),
                    address = $.trim($address.val());
					H.dialog.lottery.disable();
					if(H.dialog.lottery.pt == 4){
						showLoading(null,"请稍候...");
						window.location.href = H.dialog.lottery.redpack;
						return;
					}else if(H.dialog.lottery.pt == 1){

						if(me.check(data)) {
							if(!$(this).hasClass("flag")){
								$(this).addClass("flag");

								getResult('api/lottery/award', {
									oi: openid,
									nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
									hi: headimgurl ? headimgurl : "",
									rn: me.name ? encodeURIComponent(me.name) : "",
									ph: me.mobile ? me.mobile : "",
									ad: me.address ? encodeURIComponent(me.address) : ""
								}, 'callbackLotteryAwardHandler');
								me.close();
								showTips('领取成功');
							}
						}
					}else if(H.dialog.lottery.pt == 9){
						showLoading(null,"请稍候...");
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent(nickname) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid
						}, 'callbackLotteryAwardHandler', true, H.dialog.lottery.$dialog);
						setTimeout(function(){
							location.href =  H.dialog.lottery.ru;
						},500);
					}
					if(H.lottery.type == 2){
						H.lottery.isCanShake = true;
					}else{
						H.lottery.isCanShake = false;
					}
				});
				
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
					if(H.lottery.type == 2){
						H.lottery.isCanShake = true;
					}else{
						H.lottery.isCanShake = false;
					}
				});
				
				this.$dialog.find('.btn-share').click(function(e) {
					e.preventDefault();
					me.$dialog.find('.btn-close').trigger('click');
					H.dialog.reset();
					if(H.lottery.type == 2){
						H.lottery.isCanShake = true;
					}else{
						H.lottery.isCanShake = false;
					}
				});
			},
			update: function(data) {
				var me = this;
				if (data != null && data != '') {
					if (data.result) {
						if (data.pt === 1) { //实物奖品
                            this.$dialog.find(".lottery-dialog").addClass("award-bg");
							this.$dialog.find('.awardwin-tips').html(data.pn || '').removeClass('none');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.find('.address').val(data.ad || '');
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
						} else if (data.pt === 9) { //外链
                            this.$dialog.find(".lottery-dialog").addClass("award-bg");
							this.$dialog.find('.awardwin-tips').html(data.tt || '').removeClass('none');
							this.$dialog.find('img').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
							this.$dialog.find('.contact').addClass("none");
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('#btn-award').removeClass('none');
                            this.$dialog.find('#btn-card').addClass('none');
							me.ru = data.ru;

						} else if (data.pt === 7) { //卡券
                            H.dialog.ci = data.ci;
                            H.dialog.ts = data.ts;
                            H.dialog.si = data.si;
                            this.$dialog.find(".lottery-dialog").addClass("award-bg");
                            this.$dialog.find('.awardwin-tips').html(data.tt || '').removeClass('none');
                            this.$dialog.find('img').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
                            this.$dialog.find('.contact').addClass("none");
                            this.$dialog.find('.awardwin-tips').removeClass("none");
                            this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass("none");
                            this.$dialog.find('#btn-award').addClass('none');
                            this.$dialog.find('#btn-card').removeClass('none');
						}else if (data.pt === 4) { //红包
							H.dialog.lottery.redpack = data.rp;
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
			check: function(data) {
				var me = this, name = $.trim($('#name').val()), mobile = $.trim($('#mobile').val()), address = $.trim($('#address').val());
				if (name.length > 20 || name.length == 0) {
					showTips('请填写您的姓名！');
					return false;
				} else if (!/^\d{11}$/.test(mobile)) {
					showTips('请填写正确手机号！');
					return false;
				}else if (address.length < 8 || address.length > 80 || address.length == 0) {
					showTips('请填写您的详细地址！');
					return false;
				}

				me.name = name;
				me.mobile = mobile;
				me.address = address;
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
					._('<div class="black"></div>')
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
										._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
										/*._('<h4 class="awarded-tip">以下是您的联系方式</h4>')*/
										._('<p class="q-name"><input type="text" class="name" id="name" placeholder="姓名：" /></p>')
										._('<p class="q-mobile"><input type="tel" class="mobile" id="mobile" placeholder="电话：" /></p>')
										._('<p class="q-address"><input type="text" class="address" id="address" placeholder="地址：" /></p>')
									._('</div>')
									._('<a href="#" class="btn btn-award" id="btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-领取按钮">领取</a>')
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