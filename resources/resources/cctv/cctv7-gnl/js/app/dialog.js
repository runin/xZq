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
					'height': winH * 0.58-80,
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
							._('<h1 class="diamond-title"><span>活</span><span>动</span><span>规</span><span>则</span></h1>')
							._('<div class="content">')
								._('<div class="rule"></div>')
							._('</div>')
							._('<a href="#" class="dia-btn btn-close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮">我已了解</a>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		share: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
			},
			event: function() {
				var me = this;
				$('#share-dialog').click(function(e) {
					e.preventDefault();
					$('#share-dialog').addClass("none");
					$("#wyzhk").removeClass("none").removeClass("requesting");
					$("#ok").addClass("none");
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="share-dialog" class="other-dialog">')
					._('<img src="images/share.png" />')
				._('</section>');
				return t.toString();
			}
		},
		tip: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				var winW = $(window).width(),
				winH = $(window).height();
				$("#tip-dialog img").css({
					'width': winW * 0.9,
					'left' : winW * 0.05,
					'top' :(winH-winW * 0.9*553/545)/2
				}).removeClass("hidden");
			},
			event: function() {
				var me = this;
				$('#tip-dialog').find(".btn-close").click(function(e) {
					e.preventDefault();
					$('#tip-dialog').addClass("none");
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="tip-dialog" class="other-dialog">')
				    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="提示弹层-关闭按钮"></a>')
					._('<img class="hidden" src="images/tip.png" />')
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
			IDcard : null,
			open: function(data) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(),
				winH = $(window).height();
				hidenewLoading($dialog);
				H.dialog.open.call(this);
				H.lottery.canJump = false;
				if (!$dialog) {
					this.event();
				}
				
				this.$dialog && this.$dialog.removeClass('none');
				$(".lottery-dialog").css({ 
					'width': winW*0.92, 
					'height': winH * 0.8,
					'left': winW*0.04,
					'right':winW*0.04,
					'top': winH * 0.1,
					'bottom': winH * 0.1
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
							ad: me.address? encodeURIComponent(me.address) : '',
							ic: me.IDcard? me.IDcard : '',
						}, 'callbackLotteryAwardHandler', true, me.$dialog);
						$(".name").val(me.name).attr("disabled","disabled");
						$(".mobile").val(me.mobile).attr("disabled","disabled");
						$(".address").val(me.address).attr("disabled","disabled");
						$(".IDcard").val(me.IDcard).attr("disabled","disabled");
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
						$(".modal").addClass("none");
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
						if(!is_android()){
							if(H.dialog.lottery.pt == 1){
								window.location.href = window.location.href;
							}
						}
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
				me.$dialog.find(".award-tip").html(data.tt||"");
				me.$dialog.find('.btn-award').removeClass("none");
				me.$dialog.find('.btn-back').addClass("none");
				if (data.pt === 1) { //实物奖品
					me.$dialog.find('.dialog').removeClass("card").addClass("good");
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
			    $(".card .lottery-assit").css({ 
					'height': winH * 0.8*0.66-46,
				});
				$(".good .lottery-assit").css({ 
					'height': winH * 0.8-74,
				});
			},
			check: function() { 
				var me = this;
			    var $mobile = $('.mobile'),$address = $('.address'),$name = $('.name'),$IDcard = $('.IDcard');
					me.mobile = $.trim($mobile.val()),
					me.address = $.trim($address.val()),
					me.name = $.trim($name.val());
					me.IDcard = $.trim($IDcard.val());
					console.log(me.address+"------"+me.IDcard);
				if (me.name.length > 20 || me.name.length == 0) {
					showTips('请输入您的姓名，不要超过20字哦!');
					$("#btn-award").removeClass("requesting");
					return false;
				}else if (!/^\d{11}$/.test(me.mobile)) {
					showTips('这手机号，可打不通...');
					$("#btn-award").removeClass("requesting");
					return false;
				}else if(me.address.length <5|| me.address.length == 0){
					showTips('请填写详细的地址...');
					$("#btn-award").removeClass("requesting");
					return false;
				}else if(me.IDcard.length <15|| me.IDcard.length == 0){
					showTips('请正确填写您的身份证信息...');
					$("#btn-award").removeClass("requesting");
					return false;
				}
				return true;
			},
			reset: function() {
				H.dialog.close.call(this);
				if(H.lottery.type == 2){
					H.lottery.isCanShake = true;
				}else{
					H.lottery.isCanShake = false;
					if(H.lottery.type == 3){
						toUrl("end.html");
					}
				}
				H.lottery.canJump = true;
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			close: function() {
				this.$dialog.find('.btn-close').trigger('click');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog card">')
						._('<div class="dialog-assist">')
//						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lottery-dialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>')
							._('<div class="lottery-good">')
								._('<h1 class="diamond-title"><span>中</span><span>奖</span><span>啦</span></h1>')
								._('<div class="lottery-assit">')
									._('<div class="award-img">')
										._('<h2 class="award-tip"></h2>')
										._('<img id="aw" src="" />')
									._('</div>')
									._('<div class="contact none">')
										._('<h3 class="warm-tip1">奖品以实物为准，春节假期后会有工作人员与您 联系寄送事宜，请您耐心等待。</h4>')
										._('<h3 class="warm-tip2">请填写您的联系方式以便顺利领奖</h4>')
										._('<p class="q-name"><input type="text" class="name" placeholder="姓名" /></p>')
										._('<p class="q-mobile"><input type="tel" class="mobile" placeholder="电话" /></p>')
										._('<p class="q-address"><input type="text" class="address" placeholder="地址" /></p>')
										._('<p class="q-IDcard"><input type="text" class="IDcard" placeholder="身份证号" /></p>')
									._('</div>')
									._('<a href="#" class="dia-btn btn-award none" id="btn-award" data-collect="true" data-collect-flag="lotterydialog-OK-btn" data-collect-desc="抽奖弹层-中奖领取按钮">领取</a>')
									._('<a href="#" class="dia-btn btn-back none" id="btn-back" data-collect="true" data-collect-flag="lotterydialog-back-tn" data-collect-desc="抽奖弹层-返回按钮">确定</a>')
								._('</div>')
							._('</div>')
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