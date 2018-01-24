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
				$("#btn-wheel").rotate({
	                angle : 0,
	                animateTo : 0
            	});
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
			},
            readyFunc: function(){
                var me = this;
                this.$dialog.find('#btn-card').on("click", function (e) {
                    e.preventDefault();
                    if(!$('#btn-card').hasClass("flag")){
                        $('#btn-card').addClass("flag");
                        H.dialog.lottery.reset();
                        if(H.dialog.lottery.pt == 7){
							shownewLoading();
							H.dialog.lottery.sto = setTimeout(function(){
								$("#icon-start").removeClass("requesting");	
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
                        $("#icon-start").removeClass("requesting");	
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent(nickname) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
						$("#icon-start").removeClass("requesting");	
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        $("#icon-start").removeClass("requesting");	
                        hidenewLoading();
                    },
                    cancel:function(){
                        $("#icon-start").removeClass("requesting");	
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
						shownewLoading(null,"请稍候...");
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
							ph: me.mobile? me.mobile : ''
						}, 'callbackLotteryAwardHandler', true, me.$dialog);
						$(".name").val(me.name).attr("disabled","disabled");
						$(".mobile").val(me.mobile).attr("disabled","disabled");
						showTips("领取成功");
						$(this).addClass("none");
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
				this.$dialog.find('#btn-back').click(function(e) {
					e.preventDefault();
					$('.btn-close').trigger('click');
				});
			},
			update: function(data) {
				var me = this,winH=$(window).height(),winW=$(window).width();
				
				if(data&&data.result){
					H.dialog.lottery.pt = data.pt;
					if (data.pt === 1) { //实物奖品
						me.$dialog.find('#good-aw').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
						me.$dialog.find('.name').val(data.rn || '');
						me.$dialog.find('.mobile').val(data.ph || '');
						me.$dialog.find(".award-tip").html(data.tt||'')
						me.$dialog.find('.lottery-good').removeClass("none");
	                    me.$dialog.find('.lottery-card').addClass("none");
	                    me.$dialog.find(".lott").removeClass("none");
						me.$dialog.find(".not-lott").addClass("none");
					}  else if (data.pt === 7) { //卡券
	                    H.dialog.ci = data.ci;
	                    H.dialog.ts = data.ts;
	                    H.dialog.si = data.si;
	                    me.$dialog.find('#card-aw').attr('src', (data.pi || '')).attr("onerror","$(this).addClass(\'none\')");
	                    H.dialog.lottery.readyFunc();
	                    me.$dialog.find('.lottery-good').addClass("none");
	                    me.$dialog.find('.lottery-card').removeClass("none");
	                    me.$dialog.find(".lott").removeClass("none");
						me.$dialog.find(".not-lott").addClass("none");
				    }else{
				    	me.$dialog.find(".lott").addClass("none");
						me.$dialog.find(".not-lott").removeClass("none");
				    }
				    
				}else{
					me.$dialog.find(".lott").addClass("none");
					me.$dialog.find(".not-lott").removeClass("none");
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
					}
				return true;
			},
			reset: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
				$("#icon-start").removeClass("requesting");	
			},
			close: function() {
				this.$dialog.find('.btn-close').trigger('click');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
							._('<div class="lott none">')
								._('<div class="lottery-good none">')
									._('<div class="dialog-assist">')
									    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lottery-dialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>')
										._('<h5 class="lottery-tip"><img src="images/lott-title.png" /></h5>')
										._('<div class="award-img">')
											._('<img id="good-aw" src="" />')
										._('</div>')
										._('<h4 class="award-tip"></h4>')
										._('<div class="line"></div>')
										._('<div class="contact">')
											._('<h4 class="warm-tip">请您正确填写信息以便顺利领奖 </h4>')
											._('<p class="q-name"><input type="text" class="name" placeholder="姓名：" /></p>')
											._('<p class="q-mobile"><input type="tel" class="mobile" placeholder="电话：" /></p>')
										._('</div>')
										._('<a href="#" class="current-btn" id="btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-领取按钮">领取</a>')
									._('</div>')
								._('</div>')
								._('<div class="lottery-card none">')
									._('<div class="dialog-assist">')
									    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lottery-dialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>')
										._('<h5 class="lottery-tip"><img src="images/lott-title.png" /></h5>')
										._('<div class="award-img">')
											._('<img id="card-aw" src="" />')
										._('</div>')
										._('<a href="#" class="current-btn" id="btn-card" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-领取按钮">领取</a>')
									._('</div>')
								._('</div>')
							._('</div>')
							._('<div class="not-lott none">')
								._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lottery-dialog-closebtn" data-collect-desc="未中奖弹层-关闭按钮"></a>')
								._('<div class="notLott-assist">')
									._('<div class="lottery-tip">')
										._('<img src="images/notLott-title.png" />')
									._('</div>')
									._('<a href="#" class="current-btn" id="btn-back" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="未中奖弹层-继续加油按钮">继续加油</a>')
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