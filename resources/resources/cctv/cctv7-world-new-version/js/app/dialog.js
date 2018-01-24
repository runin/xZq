(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        redpack : '',
        iscroll: null,
        isJump :true,   
        init: function() {
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
        	var height = $(window).height(),
        		width = $(window).width(),
        		top = $(window).scrollTop();
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
                'width': width * 0.75,
                'height': height * 0.75,
                'left': width * 0.125,
                'right': width * 0.125,
                'top': height * 0.125,
                'bottom': height * 0.125
            });
        },
       	// 规则
		rule: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();

				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                setTimeout(function(){
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
			},
			update: function (rule) {
				this.$dialog.find('.rule-con').html(rule).closest('.content').removeClass('none');
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-rul" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
					    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="cctv7-world-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2>活动规则</h2>')
						._('<div class="content">')
							 ._('<div class="rule-con"></div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
        // 规则
        thanks: {
            $dialog: null,
            open: function () {
                var me = this;
                H.dialog.open.call(this);
                this.event();
                setTimeout(function(){
                    me.close();
                },1500);
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                setTimeout(function(){
                    if(H.lottery.type == 2){
						H.lottery.isCanShake = true;
					}else{
						H.lottery.isCanShake = false;	
					}
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
                var t = simpleTpl();
                t._('<section class="modal modal-rul" id="thanks-dialog">')
                    ._('<div class="dialog thanks-dialog">')
                    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="cctv7-world-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<p class="con">没中你就不摇了？还有老多老多啦！不要停，继续摇！</p>')
                    ._('<a class="thanks-close" data-collect="true" data-collect-flag="cctv7-world-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮">继续加油</a>')
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
			aw :1,
			open: function(data,type) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(),
				winH = $(window).height();
				hidenewLoading($dialog);
				H.dialog.isJump = false; 
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				
				this.$dialog && this.$dialog.removeClass('none');
				$(".lottery-dialog").css({ 
					'width': winW*0.84, 
					'height': winH * 0.9,
					'left': winW*0.08,
					'right':winW*0.08,
					'top': winH * 0.02,
					'bottom': winH * 0.08
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
				me.$dialog.find('#btn-award').removeClass("none");
				me.$dialog.find('#btn-back').addClass("none");
				if (data.pt === 1) { //实物奖品
					me.$dialog.find('.lottery-good').removeClass("lottery-card");
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
				var me = this;
				hidenewLoading();
				this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
				setTimeout(function(){
					if(H.lottery.type == 2){
						H.lottery.isCanShake = true;
						if(!is_android()){
							if(H.dialog.lottery.pt == 1){
								window.location.href = window.location.href;
							}
						}
					}else{
						H.lottery.isCanShake = false;	
						if(H.lottery.type == 3){
							toUrl("end.html");
						}
					}
					H.dialog.isJump = true; 
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
				},1000)
				
			},
			close: function() {
				this.$dialog.find('.btn-close').trigger('click');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<h1 class="lott-title"><img src="images/congra.png"/></h1>')
						._('<div class="dialog-assist">')
//							 ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lottery-dialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>'))
							._('<div class="award-img">')
								._('<img id="aw" src="" />')
								._('<div class="award-info">')
									._('<div class="contact none">')
										._('<h4 class="award-tip">正确填写信息，确保顺利领奖</h4>')
										._('<p class="q-name"><input type="text" class="name" placeholder="姓名" /></p>')
										._('<p class="q-mobile"><input type="tel" class="mobile" placeholder="电话" /></p>')
										._('<p class="q-address"><input type="text" class="address" placeholder="地址" /></p>')
									._('</div>')
									._('<a href="#" class="btn-dia none" id="btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-领取按钮">立即领取</a>')
									._('<a href="#" class="btn-dia none" id="btn-back" data-collect="true" data-collect-flag="lotterydialog-BACKbtn" data-collect-desc="抽奖弹层-返回按钮">确认</a>')
								._('</div>')
							._('</div>')
						._('</div>')
						
					._('</div>')
				._('</section>');
				return t.toString();
			}
		}
	};
    
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};
	W.callbackLotteryAwardHandler = function(data) {
	}
    
})(Zepto);

$(function() {
    H.dialog.init();
});
