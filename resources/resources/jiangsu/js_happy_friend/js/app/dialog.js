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
			this.$dialog.find('.dialog-assist').addClass('dispshow');
            setTimeout(function(){
            	me.$dialog.find('.dialog-assist').removeClass('dispshow');
            }, 500);
		},
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				getResult('api/common/rule', {}, 'commonApiRuleHandler', true, this.$dialog);
				H.dialog.isOpen = false;
			    this.event();
			},
			close: function() {
				var me = this;
				H.dialog.close.call(this);
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			event: function() {
				var me = this;
				this.$dialog.find('.close').click(function(e) {
					e.preventDefault();
					me.$dialog.find('.dialog-assist').addClass('disphide');	
					$(".modal").animate({'opacity':'0'},500)
					setTimeout(function(){
						me.close();
	            	}, 500);
				});
			},
			update: function(rule) {
				this.$dialog.find('.rule').html(rule);
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<div class="dialog thank-dialog">')
					._('<h1 class="thank-title"><img src="images/rule-title.png"/></h1>')
						._('<div class="dialog-assist">')
							._('<div class="rule-content"><div class="rule"></div></div>')
						._('</div>')
						._('<a href="#" class="btn-dia close" data-collect="true" data-collect-flag="rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"><img src="images/btn-ok.png"></a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		thank: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				H.dialog.isOpen = false;
			    this.event();
			},
			close: function() {
				var me = this;
				H.dialog.close.call(this);
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			event: function() {
				var me = this;
				this.$dialog.find('.close').click(function(e) {
					e.preventDefault();
					me.$dialog.find('.dialog-assist').addClass('disphide');	
					$(".modal").animate({'opacity':'0'},500);
					setTimeout(function(){
						me.close();
	            	}, 500);
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="thank-dialog">')
					._('<div class="dialog thank-dialog">')
					._('<h1 class="thank-title"><img src="images/thank-title.png"/></h1>')
						._('<div class="dialog-assist">')
							._('<img src="images/thank-card.jpg" />')
						._('</div>')
						._('<a href="#" class="btn-dia close" data-collect="true" data-collect-flag="thank-dialog-closebtn" data-collect-desc="未中奖弹层-关闭按钮"><img src="images/btn-dia-back.png"></a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		lottery: {
			$dialog: null,
			pic: '',
            sto:null,
			redpack:"",
			pt:null,
			ru:null,
			name:null,
			mobile : null,
			bmobile : null,
			address:null,
			open: function(data,type) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(),
				winH = $(window).height();
				hidenewLoading($dialog);
				H.dialog.openType = type; 
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				
				this.$dialog && this.$dialog.removeClass('none');
				$(".lottery-dialog").css({ 
					'width': winW*0.82, 
					'height': winH * 0.90,
					'left': winW*0.08,
					'right':winW*0.08,
					'top': winH * 0.10,
					'bottom': winH * 0
				});
				
				H.dialog.lottery.update(data);
			},
      
			event: function() {
				var me = this;
				$('#btn-dl').click(function(e) {
					e.preventDefault();
				    getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent(nickname) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
					$('.show').removeClass('none').find('img').attr('src', me.pic);
					me.pic = '';
					me.$dialog.find('.dialog-assist').addClass('disphide');
					setTimeout(function(){
						me.reset();
					},500);
				});
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
							em: me.bmobile? me.bmobile : '',
 							ad: me.address? encodeURIComponent(me.address) : ''
						}, 'callbackLotteryAwardHandler', true, me.$dialog);
						$(".name").val(me.name).attr("disabled","disabled");
						$(".mobile").val(me.mobile).attr("disabled","disabled");
						$(".bmobile").val(me.bmobile).attr("disabled","disabled");
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
						}, 'callbackLotteryAwardHandler', true, H.dialog.lottery.$dialog);
						setTimeout(function(){
							location.href =  H.dialog.lottery.ru;
						},500);
					//（流量红包）卡片
					}else if(H.dialog.lottery.pt == 6){
						shownewLoading();
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent(nickname) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid
						}, 'callbackLotteryAwardHandler', true, H.dialog.lottery.$dialog);
						setTimeout(function(){
							location.href =  'detail.html?uid=' + H.dialog.lottery.ru + '&swiperJump=0';
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
						}, 'callbackLotteryAwardHandler', true, H.dialog.lottery.$dialog);
						$("#btn-back").trigger("click");
					}else{
						H.dialog.lottery.reset();
					}
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
				H.dialog.lottery.pt = data.pt;
				me.$dialog.find('#aw').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
				if (data.pt == 6)
					me.$dialog.find('#btn-dl').removeClass("none");
				else
					me.$dialog.find('#btn-award').removeClass("none");
				me.$dialog.find('#btn-back').addClass("none");
				if(H.dialog.openType&&H.dialog.openType == "lottery"){
					me.$dialog.find('.lott-title').addClass("hidden");
				}else{
					me.$dialog.find('.lott-title').removeClass("hidden");
				}
				if (data.pt === 6) {
					me.pic = data.qc || '';
					if (data.qc == '') {
						$('#btn-dl').addClass('none');
						$('#btn-back').removeClass('none');
					}
				} else if (data.pt === 1) { //实物奖品
					me.$dialog.find('.lottery-good').removeClass("lottery-card");
					me.$dialog.find('.name').val(data.rn || '');
					me.$dialog.find('.mobile').val(data.ph || '');
 					me.$dialog.find('.address').val(data.ad || '');
 					me.$dialog.find('.bmobile').val(data.em || '');
					me.$dialog.find('.contact').removeClass("none");
				} else if (data.pt === 7) { //卡券
                    H.dialog.ci = data.ci;
                    H.dialog.ts = data.ts;
                    H.dialog.si = data.si;
			    }else if (data.pt === 4){//现金红包
			    	H.dialog.lottery.redpack = data.rp;
			    }else if (data.pt === 6){
			    	H.dialog.lottery.ru = data.ru;
			    }else if (data.pt === 9){
			    	H.dialog.lottery.ru = data.ru;
			    }else if (data.pt === 18){
			    }
			},
			check: function() { 
				var me = this;
			    var $mobile = $('.mobile'),$bmobile = $('.bmobile'),$address = $('.address'),$name = $('.name');
					me.mobile = $.trim($mobile.val());
					me.bmobile = $.trim($bmobile.val());
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
				}else if (me.bmobile.length > 0 && !/^\d{11}$/.test(me.bmobile)) {
					showTips('请填写正确的备用电话');
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
				if(H.dialog.openType&&H.dialog.openType == "lottery"&&H.lottery){
					if(H.lottery.type == 2){
						H.lottery.isCanShake = true;
						if(!is_android()){
							if(H.dialog.lottery.pt == 1){
								window.location.href = window.location.href;
							}
						}
					}else{
						H.lottery.isCanShake = false;
						shownewLoading(null, '请稍后...');
						setTimeout(function(){
							toUrl("answer.html");
						},2000)
					}
				}else{
					if(H.answer&&H.answer.yao_type == 2&&!(H.answer.markJump&&H.answer.markJump == 'yaoClick')){
						shownewLoading(null, '请稍后...');
						setTimeout(function(){
							toUrl("yao.html");
						},2000)
						
					}else{
						if(!is_android()){
							if(H.dialog.lottery.pt == 1){
								window.location.href = window.location.href;
							}
						}	
					}
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
					._('<div class="dialog lottery-dialog">')
					._('<h1 class="lott-title hidden"><img src="images/congra.png"/></h1>')
						._('<div class="dialog-assist">')
//							 ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lottery-dialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>'))
							._('<div class="award-img">')
								._('<img id="aw" src="" />')
								._('<div class="contact none">')
									._('<h4 class="award-tip">正确填写信息，确保顺利领奖</h4>')
									._('<p class="q-name"><label>姓名:</label><input type="text" class="name" placeholder="" /></p>')
									._('<p class="q-mobile"><label>电话:</label><input type="tel" class="mobile" placeholder="" /></p>')
									._('<p class="q-bmobile"><label>备用电话:</label><input type="tel" class="bmobile" placeholder="" /></p>')
									._('<p class="q-address"><label>地址:</label><input type="text" class="address" placeholder="" /></p>')
								._('</div>')
							._('</div>')
						._('</div>')
						._('<a href="#" class="btn-dia none" id="btn-dl" data-collect="true" data-collect-flag="lotterydialog-dlbtn" data-collect-desc="抽奖弹层-下载按钮"><img src="images/btn-dia-dl.png"/></a>')
						._('<a href="#" class="btn-dia none" id="btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-领取按钮"><img src="images/btn-dia-award.png"/></a>')
						._('<a href="#" class="btn-dia none" id="btn-back" data-collect="true" data-collect-flag="lotterydialog-BACKbtn" data-collect-desc="抽奖弹层-返回按钮"><img src="images/btn-ok.png"/></a>')
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