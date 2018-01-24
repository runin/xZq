(function($) {
	H.dialog = {
		$container: $('body'),
        ci:"",
        ts:"",
        si:"",
        isOpen :false,//弹层是否打开，false未打开，true打开
        openType : "",//tiger,sign,lottry
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
			this.$dialog.find('.dialog-assist').addClass('dispshow');
            setTimeout(function(){
            	me.$dialog.find('.dialog-assist').removeClass('dispshow');
            }, 500);
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
			aw :1,
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
				$("#lottery-dialog").find(".dialog").css({ 
					'width': winW*0.94, 
//					'height': winH * 0.80,
					'left': winW*0.03,
					'right':winW*0.03,
					'top': winH * 0.10
//					'bottom': winH * 0.10
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
					localStorage.award = "awarded";
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
						}, 'callbackLotteryAwardHandler', false);
						$(".name").val(me.name).attr("disabled","disabled");
						$(".mobile").val(me.mobile).attr("disabled","disabled");
 						$(".address").val(me.address).attr("disabled","disabled");
						me.$dialog.find('#btn-award').addClass("none");
					    me.$dialog.find('#btn-back').removeClass("none");
						showTips("领取成功");
					//外链奖品
					}else if(H.dialog.lottery.pt == 9){
						shownewLoading();
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent(nickname) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid
						}, 'callbackLotteryAwardHandler',false);
						setTimeout(function(){
							location.href =  H.dialog.lottery.ru;
						},500);
					//卡券奖品
					}else if(H.dialog.lottery.pt == 7){
						shownewLoading();
						$(".modal").addClass("none");
						H.dialog.lottery.sto = setTimeout(function(){
							H.dialog.lottery.reset();
	                        hidenewLoading();
                        },15000);
                        setTimeout(function(){
							H.dialog.lottery.wx_card();
                        },500);
                    }else if(H.dialog.lottery.pt == 18){//卡牌类型
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent(nickname) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid
						}, 'callbackLotteryAwardHandler',false);
						$("#btn-back").trigger("click");
					}else{
						H.dialog.lottery.reset();
					}
				});
				this.$dialog.find('#btn-want').click(function(e) {
					e.preventDefault();
					localStorage.award = 'unaward';
					window.location.href = localStorage.url;
				});
				this.$dialog.find('.btn-close,#btn-back').click(function(e) {
					e.preventDefault();
					var me = H.dialog.lottery;
					me.$dialog.find('.dialog-assist').addClass('disphide');
					setTimeout(function(){
						H.dialog.lottery.reset();
					},500);
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
                        }, 'callbackLotteryAwardHandler',false);
                    },
                    fail: function(res){
						H.dialog.lottery.reset();
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        H.dialog.lottery.reset();
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
				if(!!data){
					H.dialog.lottery.pt = data.pt;
					me.$dialog.find('#aw').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
					me.$dialog.find('#btn-award').removeClass("none");
					me.$dialog.find('#btn-back').addClass("none");
					me.$dialog.find('.lottery-dialog').removeClass("none");
					me.$dialog.find('.card-dialog').addClass("none");
					localStorage.url = data.tt? data.tt :'';
					if (data.pt === 1) { //实物奖品
						me.$dialog.find('.name').val(data.rn || '');
						me.$dialog.find('.mobile').val(data.ph || '');
	 					me.$dialog.find('.address').val(data.ad || '');
	 					if(data.aw&&data.aw == 0){
	 						me.$dialog.find('.address').addClass("none");
	 						H.dialog.lottery.aw = data.aw
	 					}else{
	 						H.dialog.lottery.aw = 1
	 					}
	 					
						me.$dialog.find('.contact').removeClass("none");		
					} else if (data.pt === 7) { //卡券
	                    H.dialog.ci = data.ci;
	                    H.dialog.ts = data.ts;
	                    H.dialog.si = data.si;
				    }else if (data.pt === 4){//现金红包
				    	H.dialog.lottery.redpack = data.rp;
				    }else if (data.pt === 9){
				    	H.dialog.lottery.ru = data.ru;
				    }else if (data.pt === 18){
				    }
			    }else{
				    me.$dialog.find('.lottery-dialog').addClass("none");
					me.$dialog.find('.card-dialog').removeClass("none");
			    }
			},
			check: function() { 
				var me = this;
			    var $mobile = $('.mobile'),$address = $('.address'),$name = $('.name');
					me.mobile = $.trim($mobile.val());
 					me.address = $.trim($address.val());
					me.name = $.trim($name.val());
				if (me.name.length > 20 || me.name.length == 0) {
					showTips('请输入您的姓名，不要超过20字哦!');
					$("#btn-award").removeClass("requesting");
					return false;
				}else if (!/^\d{11}$/.test(me.mobile)) {
					showTips('这手机号，可打不通...');
					$("#btn-award").removeClass("requesting");
					return false;
				}else if(H.dialog.lottery.aw==1&&me.address.length <5){
					showTips(' 请填写详细的地址...');
					$("#btn-award").removeClass("requesting");
					return false;
				}
				return true;
			},
			reset: function() {
				H.dialog.close.call(this);          
				if(H.lottery.type == 2){
					H.lottery.isCanShake = true;
					if(H.dialog.lottery.pt == 1){
						if(is_android()){
							window.location.href = "index.html";
						}else{
							if(localStorage.award&&localStorage.award == 'awarded' &&localStorage.url){
								setTimeout(function(){
									H.dialog.lottery.open();
								},500)	
							}
						}
					}
					
				}else{
					H.lottery.isCanShake = false;
				}
				$(".modal").animate({'opacity':'0'},500);
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			close: function() {
				this.$dialog.find('.btn-close').trigger('click');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog none">')
						._('<div class="dialog-assist">')
							._('<h1 class="lott-title"><img src="images/congra.png"/></h1>')
//							 ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lottery-dialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>'))
							._('<div class="border">')
								._('<div class="award-img">')
									._('<img id="aw" src="" />')
									._('<div class="contact none">')
										._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
										._('<p class="q-name"><input type="text" class="name" placeholder="姓名" /></p>')
										._('<p class="q-mobile"><input type="tel" class="mobile" placeholder="电话" /></p>')
										._('<p class="q-address"><input type="text" class="address" placeholder="地址" /></p>')
									._('</div>')
									._('<a href="#" class="btn-dia none" id="btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-领取按钮">点击领取</a>')
									._('<a href="#" class="btn-dia none" id="btn-back" data-collect="true" data-collect-flag="lotterydialog-BACKbtn" data-collect-desc="抽奖弹层-返回按钮">确认</a>')
								._('</div>')
							._('</div>')
						._('</div>')
					._('</div>')
					._('<div class="dialog card-dialog none">')
						._('<div class="dialog-assist card">')
							._('<img src="images/card.png" />')
							._('<a href="#" class="btn-dia" id="btn-want" data-collect="true" data-collect-flag="card-dialog-want-btn" data-collect-desc="抽奖弹层-我要油卡按钮"><img src="images/want-btn.png" /></a>')
						._('</div>')
					._('</div>')
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