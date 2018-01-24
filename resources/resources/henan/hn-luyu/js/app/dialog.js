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
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h1 class="rule-title">活动规则</h1>')
						._('<div class="content">')
							._('<div class="rule none"></div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		tip: {
			$dialog: null,
			open: function() {
				if (this.$dialog) {
					this.$dialog.removeClass('none');
				} else {
					this.$dialog = $(this.tpl());
					H.dialog.$container.append(this.$dialog);
				}
				this.event();
			},
			close: function() {
				var me = this;
				me.$dialog.find('.tip-dialog').addClass('disphide');
				setTimeout(function(){
					$('.tip-dialog').removeClass('disphide');
					$("#tip-dialog").remove();
            	}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="tip-dialog">')
					._('<div class="dialog tip-dialog">')
						._('<div class="tip-text bounceInRight">')
							._('<h1><img class="tip-title" src="images/tip-title.png"><a href="#" class="btn-close close" data-collect="true" data-collect-flag="tipdialog-close-btn" data-collect-desc="互动提示弹层-关闭按钮"></a></h1>')
							._('<img class="tip-con" src="images/tip-con.png">')
							._('<a href="#" class="btn-join close" data-collect="true" data-collect-flag="tipdialog-join-btn" data-collect-desc="互动提示弹层-进入互动按钮"><img src="images/join-btn.png"></a>')
						._('</div>')
						._('<div class="content bounceInLeft">')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		erweima: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
			},
			close: function() {
				var me = this;
				me.$dialog.find('.tip-dialog').addClass('disphide');
				setTimeout(function(){
					$('.tip-dialog').removeClass('disphide');
					$("#tip-dialog").remove();
            	}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="tip-dialog">')
					._('<div class="dialog tip-dialog">')
						._('<div class="content">')
							._('<div class="er-content">')
								._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="erweimadialog-close-btn" data-collect-desc="二维码弹层-关闭按钮"></a>')
							   	._('<img class="tip-con" src="images/er.jpg">')
						   ._('</div>')
						   ._('<div class="er-text">识别二维码，加鲁豫有约小助手为好友， <br />获取节目录制信息，更多好礼等你来拿！</div>')
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
			token : null,
			open: function(data) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(),
				winH = $(window).height();
				hidenewLoading($dialog);
				H.dialog.open.call(this);
				me.userInfo();
				if (!$dialog) {
					this.event();
				}
				
				this.$dialog && this.$dialog.removeClass('none');
				$(".lottery-dialog").css({ 
					'width': winW*0.84, 
					'height': winH * 0.8,
					'left': winW*0.08,
					'right':winW*0.08,
					'top': winH * 0.12,
					'bottom': winH * 0.08
				});
				H.dialog.lottery.update(data);
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
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent(nickname) : "",
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
            userInfo : function(){
				getResult("api/user/info",{oi:openid},"callbackUserInfoHandler");
	  		},
			event: function() {
				var me = this;
				$('#btn-award').click(function(e) {
					e.preventDefault();
					if($(this).hasClass("requesting")){
						return;
					}
					$(this).addClass("requesting");
					//现金红包
					if(H.dialog.lottery.pt == 4){
						shownewLoading(null,"请稍候...");
						window.location.href = H.dialog.lottery.redpack;
						return;
					//实物奖品，积分奖品，兑换码奖品
					}else if(H.dialog.lottery.pt == 1 || H.dialog.lottery.pt == 2 || H.dialog.lottery.pt == 5){
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent(nickname) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid,
						}, 'callbackLotteryAwardHandler', true, me.$dialog);
						showTips("领取成功");
					//外链奖品
					}else if(H.dialog.lottery.pt == 9){
						shownewLoading(null,"请稍候...");
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent(nickname) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid
						}, 'callbackLotteryAwardHandler', true, H.dialog.lottery.$dialog);
						setTimeout(function(){
							location.href =  H.dialog.lottery.ru;
						},500);
					//卡券奖品
					}else if(H.dialog.lottery.pt == 7){
						shownewLoading();
						H.dialog.lottery.sto = setTimeout(function(){
                            hidenewLoading();
                        },15000);
                        setTimeout(function(){
							H.dialog.lottery.wx_card();
                        },500);
                    }
					me.$dialog.find('.lottery-dialog').addClass('disphide');
					setTimeout(function(){
						H.dialog.lottery.reset();
		            }, 1000);
				});
				
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					var me = H.dialog.lottery;
					me.$dialog.find('.lottery-dialog').addClass('disphide');
					setTimeout(function(){
						H.dialog.lottery.reset();
	            	}, 1000);
				});
				this.$dialog.find('#btn-info').click(function(e) {
					e.preventDefault();
					if(!H.dialog.lottery.check()){
					   	return;
					}
					getResult('api/user/edit', {
						nn: nickname ? encodeURIComponent(nickname) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						tk : me.token,
						rn: me.name?encodeURIComponent(me.name) : '',
						ph: me.mobile? me.mobile : '',
						ad: me.address? encodeURIComponent(me.address) : ''
					}, 'callbackUserEditHandler', true, me.$dialog);
					$(".name").val(me.name).attr("disabled","disabled");
					$(".mobile").val(me.mobile).attr("disabled","disabled");
					$(".address").val(me.address).attr("disabled","disabled");
					showTips("信息提交成功");
					me.$dialog.find('.lottery-good').removeClass("none");
					me.$dialog.find('.contact').addClass("none");	
				});
			},
			update: function(data) {
				var me = this,winH=$(window).height(),winW=$(window).width();
				H.dialog.lottery.pt = data.pt;
				me.$dialog.find('#good-aw').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
				if (data.pt === 9) { //外链
					me.ru = data.ru;
				}else if (data.pt === 7) { //卡券
		            H.dialog.ci = data.ci;
		            H.dialog.ts = data.ts;
		            H.dialog.si = data.si;
			    }else if (data.pt === 4) { //红包
					H.dialog.lottery.redpack = data.rp;
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
			},
			close: function() {
				this.$dialog.find('.btn-close').trigger('click');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					   
						._('<div class="dialog-assist">')
						    ._('<img class="dia-logo" src="images/dia-logo.png" />')
							._('<div class="contact none">')
							    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="userinfodialog-close-btn" data-collect-desc="个人信息填写弹层-关闭按钮"></a>')
								._('<h1>请完善个人信息</h1>')
								._('<div class="info-box">')
									._('<p class="q-name">姓名：<input type="text" class="name" placeholder="" /></p>')
									._('<p class="q-mobile">电话：<input type="tel" class="mobile" placeholder="" /></p>')
									._('<p class="q-address">地址：<input type="text" class="address" placeholder="" /></p>')
									._('<a href="#" class="dia-btn btn-back" id="btn-info" data-collect="true" data-collect-flag="lotterydialog-back-btn" data-collect-desc="抽奖弹层-返回按钮">提交</a>')
								._('</div>')
							._('</div>')
							._('<div class="lottery-good none">')
								._('<div class="award-img">')
									._('<img id="good-aw" src="" />')
								._('</div>')
								._('<a href="#" class="dia-btn btn-award" id="btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-领取按钮">领取</a>')
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
    W.callbackUserEditHandler = function(data) {
	};
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};
	W.callbackUserInfoHandler = function(data){
  		if(data&&data.result){
  			H.dialog.lottery.token = data.tk;
  			if(!data.rn || !data.ph || !data.ad){
				$(".lottery-dialog").find('.lottery-good').addClass("none");
				$(".lottery-dialog").find('.contact').removeClass("none");					
  			}else{
  			    $(".lottery-dialog").find('.lottery-good').removeClass("none");
				$(".lottery-dialog").find('.contact').addClass("none");			
  			}
  		}else{
			$(".lottery-dialog").find('.lottery-good').removeClass("none");
		    $(".lottery-dialog").find('.contact').addClass("none");
  		}
  	}
})(Zepto);

$(function() {
	H.dialog.init();
});