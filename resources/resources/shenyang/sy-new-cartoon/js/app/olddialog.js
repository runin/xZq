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
			name:null,
			mobile : null,
			address:null,
			open: function(data) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(),
				winH = $(window).height();
				hideLoading($dialog);
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				
				this.$dialog && this.$dialog.removeClass('none');
				$(".lottery-dialog").css({ 
					'width': winW, 
					'height': winH * 0.56,
					'left': 0,
					'right':0,
					'top': winH * 0.22,
					'bottom': winH * 0.22
				});
				
				H.dialog.lottery.update(data);
				if(data.pt == 7){
					 H.dialog.lottery.readyFunc();
				}
			},
            readyFunc: function(){
                var me = this;
                this.$dialog.find('#btn-card').on("click", function (e) {
                    e.preventDefault();
                    if(!$('#btn-card').hasClass("flag")){
                        $('#btn-card').addClass("flag");
                        H.dialog.lottery.reset();
                        if(H.dialog.lottery.pt == 7){
							showLoading();
							H.dialog.lottery.sto = setTimeout(function(){
								if(H.lottery.type == 2){
									H.lottery.isCanShake = true;
								}else{
									H.lottery.isCanShake = false;
								}
                                hideLoading();
                            },15000);
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
                      	hideLoading();
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
						};
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
			event: function() {
				var me = this;
				$('#btn-award').click(function(e) {
					e.preventDefault();
					if($(this).hasClass("requesting")){
						return;
					}
					$(this).addClass("requesting");
					if(H.dialog.lottery.pt == 4){
						showLoading(null,"请稍候...");
						window.location.href = H.dialog.lottery.redpack;
						return;
					}else if(H.dialog.lottery.pt == 1){
					   	if(!H.dialog.lottery.check()){
					   		return;
					   	}
						H.dialog.lottery.disable();
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent(nickname) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid,
							rn: me.name?encodeURIComponent(me.name) : '',
							ph: me.mobile? me.mobile : '',
							ad: me.address? encodeURIComponent(me.address) : ''
						}, 'callbackLotteryAwardHandler', true, me.$dialog);
						$('.award-tip').addClass('none');
						$('.awarded-tip').removeClass('none');
						$(".q-name").html("姓名："+me.name);
						$(".q-mobile").html("电话："+me.mobile);
						$(".q-address").html("地址："+me.address);
						showTips("领取成功");
						$(this).addClass("none");
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
					setTimeout(function(){
						H.dialog.lottery.reset();
					},3000);	
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
				var me = this,winH=$(window).height(),winW=$(window).width();
				H.dialog.lottery.pt = data.pt;
				if (data.pt === 1) { //实物奖品
                    me.$dialog.find(".lottery-dialog").addClass("award-bg");
				    me.$dialog.find('.awardwin-tips').html(data.tt || '').removeClass('none');
					me.$dialog.find('img').attr('src', (data.pi || ''));
					me.$dialog.find('.name').val(data.rn || '');
					me.$dialog.find('.mobile').val(data.ph || '');
					me.$dialog.find('.address').val(data.ad || '');
					me.$dialog.addClass(this.LOTTERIED_CLS);
					me.$dialog.find('.award-win').addClass("award-good").removeClass('none');
					$(".lottery-dialog").css({ 
						'width': winW, 
						'height': winH * 0.7,
						'left': 0,
						'right':0,
						'top': winH * 0.15,
						'bottom': winH * 0.15
					});
				} else if (data.pt === 9) { //外链
                    me.$dialog.find(".lottery-dialog").addClass("award-bg");
					me.$dialog.find('.awardwin-tips').html(data.tt || '').removeClass('none');
					me.$dialog.find('img').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
					me.$dialog.find('.contact').addClass("none");
					me.$dialog.addClass(this.LOTTERIED_CLS);
					me.$dialog.find('.award-win').removeClass('none');
					me.$dialog.find('#btn-award').removeClass('none');
                    me.$dialog.find('#btn-card').addClass('none');
					me.ru = data.ru;
				} else if (data.pt === 7) { //卡券
                    H.dialog.ci = data.ci;
                    H.dialog.ts = data.ts;
                    H.dialog.si = data.si;
                    me.$dialog.find(".lottery-dialog").addClass("award-bg");
                    me.$dialog.find('.awardwin-tips').html(data.tt || '').removeClass('none');
                    me.$dialog.find('img').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
                    me.$dialog.find('.contact').addClass("none");
                    me.$dialog.addClass(this.LOTTERIED_CLS);
					me.$dialog.find('.award-win').removeClass("none");
                    me.$dialog.find('#btn-award').addClass('none');
                    me.$dialog.find('#btn-card').removeClass('none');
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
					me.$dialog.addClass(me.LOTTERIED_CLS);
					me.$dialog.find('.award-win').removeClass('none');
					me.$dialog.find('.contact').removeClass('redbag');
				}
			},
			check: function() { 
				    var me = this;
					var $mobile = $('.mobile'),$address = $('.address'),$name = $('.name');
						me.mobile = $.trim($mobile.val()),
						me.address = $.trim($address.val()),
						me.name = $.trim($name.val());
					if (me.name.length > 20 || me.name.length == 0) {
						showTips('请输入您的姓名，不要超过20字哦!');
						$("#btn-award").removeClass("requesting");
						return false;
					}else if (!/^\d{11}$/.test(me.mobile)) {
						showTips('这手机号，可打不通...');
						$("#btn-award").removeClass("requesting");
						return false;
					}else if(me.address.length <5){
						showTips(' 请填写详细的地址...');
						$("#btn-award").removeClass("requesting");
						return false;
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
			reset: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
				if(H.lottery.type == 2){
					H.lottery.isCanShake = true;
				}else{
					H.lottery.isCanShake = false;
				}
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
								._('<div class="award-win none">')
									._('<h5 class="awardwin-tips none"></h5>')
									._('<div class="award-img">')
										._('<img id="aw" src="" />')
									._('</div>')
									._('<div class="contact">')
										._('<h4 class="award-tip">正确填写信息以便工作人员联系您</h4>')
										._('<h4 class="awarded-tip none">以下是您的联系方式</h4>')
										._('<p class="q-name">姓名：<input type="text" class="name" placeholder="" /></p>')
										._('<p class="q-mobile">电话：<input type="tel" class="mobile" placeholder="" /></p>')
										._('<p class="q-address">地址：<input type="text" class="address" placeholder="" /></p>')
									._('</div>')
									._('<a href="#" class="btn btn-award" id="btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-领取按钮">领取</a>')
									._('<a href="#" class="btn btn-award none" id="btn-card" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮">领取</a>')
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