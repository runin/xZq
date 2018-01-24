(function($) {
	H.dialog = {
		$container: $('body'),
        ci:"",
        ts:"",
        si:"",
        isOpen :false,//弹层是否打开，false未打开，true打开
		init: function() {
		},
		close: function() {
			H.dialog.isOpen = false;
		},
		open: function() {
			var me = this;
			if(H.dialog.isOpen){
				$(".modal").addClass('none');
			}
			if (this.$dialog) {
				this.$dialog.removeClass('none');
			} else {
				this.$dialog = $(this.tpl()).addClass("modal");
				H.dialog.$container.append(this.$dialog);
			}
			H.dialog.isOpen = true;
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
				var winW = $(window).width(),
				winH = $(window).height();
				$(".content").css({  
					'height': winH * 0.66-50,
				});
			},
			close: function() {
				var me = this;
				hidenewLoading();
				H.dialog.close.call(this);
				me.$dialog.find('.rule-dialog').addClass('disphide');
				setTimeout(function(){
					$("#btn-rule").removeClass("requesting");
					$('.rule-dialog').removeClass('disphide');
					$("#rule-modal").addClass("none");
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
				getResult('api/common/rule', {}, 'commonApiRuleHandler', true, this.$dialog);
				t._('<section class="modal" id="rule-modal">')
					._('<div class="dialog rule-dialog">')
						._('<div class="dialog-assist">')
							._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
							._('<h1 class="rule-title">活动规则</h1>')
							._('<div class="content">')
								._('<div class="rule"></div>')
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
					'width': winW*0.80, 
					'height': winH * 0.64,
					'left': winW*0.1,
					'right':winW*0.1,
					'top': winH * 0.18,
					'bottom': winH * 0.18
				});
				
				H.dialog.lottery.update(data);
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
						shownewLoading();
						window.location.href = H.dialog.lottery.redpack;
						return;
					//实物奖品
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
						$(".name").val(me.name).attr("disabled","disabled");
						$(".mobile").val(me.mobile).attr("disabled","disabled");
						$(".address").val(me.address).attr("disabled","disabled");
						me.$dialog.find('.btn-award').addClass("none");
					    me.$dialog.find('.btn-back').removeClass("none");
						showTips("领取成功");
					//外链奖品
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
					//卡券奖品
					}else if(H.dialog.lottery.pt == 7){
						shownewLoading();
						H.dialog.lottery.sto = setTimeout(function(){
							H.dialog.lottery.reset();
	                        hidenewLoading();
                        },15000);
                        setTimeout(function(){
							H.dialog.lottery.wx_card();
                        },500);
                    }
				});
				
				this.$dialog.find('.btn-close,#btn-back').click(function(e) {
					e.preventDefault();
					var me = H.dialog.lottery;
					me.$dialog.find('.lottery-dialog').addClass('disphide');
					setTimeout(function(){
						H.dialog.lottery.reset();
					},1000);
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
                      	H.dialog.lottery.reset();
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent(nickname) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        hidenewLoading();
                        H.dialog.lottery.reset();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        hidenewLoading();
                    },
                    cancel:function(){
                        H.dialog.lottery.reset();
                        hidenewLoading();
                    }
                });
            },
			update: function(data) {
				var me = this,winH=$(window).height(),winW=$(window).width();
				H.dialog.lottery.pt = data.pt;
				 me.$dialog.find('#aw').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
				me.$dialog.find('.btn-award').removeClass("none");
				me.$dialog.find('.btn-back').addClass("none");
				if (data.pt === 1) { //实物奖品
					 me.$dialog.find('.lottery-good').removeClass("lottery-card");
					me.$dialog.find('.name').val(data.rn || '');
					me.$dialog.find('.mobile').val(data.ph || '');
					me.$dialog.find('.address').val(data.ad || '');
					me.$dialog.find('.contact').removeClass("none");		
				} else if (data.pt === 7) { //卡券
                    H.dialog.ci = data.ci;
                    H.dialog.ts = data.ts;
                    H.dialog.si = data.si;
			    }else if (data.pt === 4){//现金红包
			    	H.dialog.lottery.redpack = data.rp;
			    }else if (data.pt === 9){
			    	H.dialog.lottery.ru = data.ru;
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
				H.dialog.close.call(this);
				if(!is_android() && H.dialog.lottery.pt == 1){
					window.location.href = window.location.href;
				}
				if(H.lottery.type == 2){
					H.lottery.isCanShake = true;
				}else{
					H.lottery.isCanShake = false;
				}
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
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lottery-dialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>')
							._('<div class="lottery-good lottery-card">')
								._('<div class="lottery-assit">')
									._('<div class="award-img">')
										._('<img id="aw" src="" />')
									._('</div>')
									._('<div class="contact none">')
										._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
										._('<p class="q-name"><input type="text" class="name" placeholder="姓名" /></p>')
										._('<p class="q-mobile"><input type="tel" class="mobile" placeholder="手机号码" /></p>')
										._('<p class="q-address"><input type="text" class="address" placeholder="邮寄地址" /></p>')
									._('</div>')
									._('<a href="#" class="btn btn-award none" id="btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-实物领取按钮">领取</a>')
									._('<a href="#" class="btn btn-back none" id="btn-back" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-实物领取按钮">确定</a>')
								._('</div>')
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		thanks: {
			$dialog: null,
				randomSrc: null,
				open: function(data) {
				H.lottery.isCanShake = false;
				H.lottery.canJump = false;
				var me =this, $dialog = this.$dialog, width = $(window).width(), height = $(window).height();
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				this.pre_dom();
				this.update(data);
			},
			pre_dom: function(){
				var width = $(window).width(),
					height = $(window).height();
				$(".dialog").css({
					'width': "270px",
					'height': "293px",
					'left': Math.round((width-270)/2)+'px',
					'top': Math.round((height-293)/2)+'px'
				});
			},
			close: function() {
				var me = this;
				this.$dialog.find('.dialog').addClass('disphide');
				setTimeout(function(){
					me.$dialog.find('.dialog').removeClass('disphide');
					H.dialog.isOpen = false;
					H.lottery.isCanShake = true;
					H.lottery.canJump = true;
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
				this.$dialog.find('#btn-thanksLottery-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			textMath: function() {//随机img
				var me = this;
				if(thanks_imgs.length >0){
					var i = Math.floor((Math.random()*thanks_imgs.length));
					me.randomSrc = thanks_imgs[i];
				}
			},
			update: function(data) {
				var src = "images/e-code.jpg";
				if(data && data.pi){
					src = data.pi;
				}
				$(".icon-thanks").attr("src", src);
			},
			tpl: function() {
				var t = simpleTpl(),me = this;
				t._('<section class="modal modal-thanks" id="thanks-dialog">')
					._('<section class="dialog lottery-good">')
						._('<a href="javascript:void(0);" class="btn-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-thanks-btn-close" data-collect-desc="弹层(谢谢参与)-关闭按钮"></a>')
						._('<img class="icon-thanks" src="" />')
						._('<h2>长按图片识别图中二维码<br/> 更多精彩等着您</h2>')
					._('</section>')
				._('</section>');
				return t.toString();
			}
		}
	};
	W.commonApiRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};
	W.callbackLotteryAwardHandler = function(data) {
	};
})(Zepto);

$(function() {
	H.dialog.init();
});