(function($) {
	H.dialog = {
		$container: $('body'),
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
			var me = this;
			H.dialog.close();
			if (this.$dialog) {
				this.$dialog.removeClass('none');
			} else {
				this.$dialog = $(this.tpl());
				H.dialog.$container.append(this.$dialog);
			}
			this.$dialog.find('.dialog').addClass('dispshow');
            setTimeout(function(){
            	me.$dialog.find('.dialog').removeClass('dispshow');
            }, 1000);
		},
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
				var me = this;
				me.$dialog.find('.rule-dialog').addClass('disphide');
				setTimeout(function(){
					$('.rule-dialog').removeClass('disphide');
					$("#rule-dialog").addClass("none");
            	}, 1000);
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
						._('<div class="dialog-assist">')
							._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
							._('<div class="content">')
								._('<h1 class="rule-title">活动规则</h1>')
								._('<div class="rule none"></div>')
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		lottery: {
			$dialog: null,
            sto:null,
			redpack:"",
			pt:null,
			ru:null,
			name:null,
			mobile : null,
			address:null,
			open: function(data) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(),
				winH = $(window).height();
				hidenewLoading($dialog);
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				
				this.$dialog && this.$dialog.removeClass('none');
				$(".lottery-dialog").css({ 
					'width': winW*0.9, 
					'height': winH * 0.8,
					'left': winW*0.05,
					'right':winW*0.05,
					'top': winH * 0.1,
					'bottom': winH * 0.1
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
                        H.lottery.isCanShake = false;
                        if(H.dialog.lottery.pt == 7){
							shownewLoading();
							H.dialog.lottery.sto = setTimeout(function(){
								if(H.lottery.type == 2){
									H.lottery.isCanShake = true;
								}else{
									H.lottery.isCanShake = false;
								}
                                hidenewLoading();
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
                      	hidenewLoading();
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
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                 
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        if(H.lottery.type == 2){
							H.lottery.isCanShake = true;
						}else{
							H.lottery.isCanShake = false;
						}
                        hidenewLoading();
                    },
                    cancel:function(){
                        if(H.lottery.type == 2){
							H.lottery.isCanShake = true;
						}else{
							H.lottery.isCanShake = false;
						}
                        hidenewLoading();
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
						shownewLoading();
						window.location.href = H.dialog.lottery.redpack;
						return;
					}else if(H.dialog.lottery.pt == 1){
					   	if(!H.dialog.lottery.check()){
					   		return;
					   	}
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
						$(".name").val(me.name).attr("disabled","disabled");
						$(".mobile").val(me.mobile).attr("disabled","disabled");
						$(".address").val(me.address).attr("disabled","disabled");
						showTips("领取成功");
						$(this).addClass("none");
					}else if(H.dialog.lottery.pt == 9){
						shownewLoading();
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent(nickname) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid
						}, 'callbackLotteryAwardHandler', true, H.dialog.lottery.$dialog);
						setTimeout(function(){
							location.href =  H.dialog.lottery.ru;
						},500);
					}	
				});
				
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					var me = H.dialog.lottery;
					me.$dialog.find('.lottery-dialog').addClass('disphide');
					setTimeout(function(){
						H.dialog.lottery.reset();
	            	}, 1000);
				});
			},
			update: function(data) {
				var me = this,winH=$(window).height(),winW=$(window).width();
				H.dialog.lottery.pt = data.pt;
				if (data.pt === 1) { //实物奖品
					me.$dialog.find('#aw').attr('src', (data.pi || ''));
					me.$dialog.find('.name').val(data.rn || '');
					me.$dialog.find('.mobile').val(data.ph || '');
					me.$dialog.find('.address').val(data.ad || '');
					me.$dialog.find('.contact').removeClass("none");
					$("#btn-award").removeClass("none");
					$("#btn-card").addClass("none");
				} else if (data.pt === 7) { //卡券
                    H.dialog.ci = data.ci;
                    H.dialog.ts = data.ts;
                    H.dialog.si = data.si;
                    me.$dialog.find('#aw').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
                    me.$dialog.find('.contact').addClass("none");
                    $("#btn-award").addClass("none");
					$("#btn-card").removeClass("none");
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
					._('<div class="dialog lottery-dialog">')
						._('<div class="dialog-assist">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lottery-dialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>')
							._('<div class="lottery-good">')
								._('<h5 class="awardwin-tips"><img src="images/congra.png" /></h5>')
								._('<div class="award-img">')
									._('<img id="aw" src="" />')
								._('</div>')
								._('<div class="contact none">')
									._('<h4 class="award-tip">请填写完整信息，否则视为放弃。</h4>')
									._('<h4 class="awarded-tip none">以下是您的联系方式</h4>')
									._('<p class="q-name">姓名：<input type="text" class="name" placeholder="" /></p>')
									._('<p class="q-mobile">电话：<input type="tel" class="mobile" placeholder="" /></p>')
									._('<p class="q-address">地址：<input type="text" class="address" placeholder="" /></p>')
								._('</div>')
								._('<a href="#" class="btn-award none" id="btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-实物领取按钮"><img src="images/award-btn.png" /></a>')
								._('<a href="#" class="btn-award none" id="btn-card" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-卡券领取按钮"><img src="images/award-btn.png" /></a>')
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
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};
})(Zepto);

$(function() {
	H.dialog.init();
});