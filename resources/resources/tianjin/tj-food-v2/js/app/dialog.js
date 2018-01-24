(function($) {
	H.dialog = {
		$container: $('body'),
		init: function() {
			var me = this;
			this.$container.delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
			});
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
			$('.modal').each(function() {
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': '3px', 'top': '3px'})
			});
			$('.dialog').each(function() {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({ 
					'width': width * 0.88, 
					'height': height * 0.8, 
					'left': width * 0.06,
					'right': width * 0.06,
					'top': height * 0.1,
					'bottom': height * 0.1
				});
			});
		},
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('.btn-back').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function(rule) {
				this.$dialog.find('.rule-content').html(rule);
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tj-food-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<div class="content">')
							._('<h1>活动规则</h1>')
							._('<div class="rule-content"><div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		getLottery: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			event: function() {
				var me = this;
				$('#getLottery-dialog').click(function(e) {
					e.preventDefault();
					shownewLoading();
	                $.ajax({
	                    type : 'GET',
	                    async : false,
	                    url : domain_url + 'api/lottery/exec/luck' + dev,
	                    data: {
	                    	matk: matk,
	                    	sau: H.wall.guid
	                    },
	                    dataType : "jsonp",
	                    jsonpCallback : 'callbackLotteryLuckHandler',
	                    complete: function() {
	                        hidenewLoading();
	                    },
	                    success : function(data) {
	                    	if (data.result)
		                    	H.dialog.lottery.open(data);
		                    else
		                    	H.dialog.thanks.open();
	                    },
	                    error : function() {
	                    	H.dialog.thanks.open();
	                    }
	                });
					me.close();
					recordUserOperate(openid, "调用抽奖接口", "doLottery");
					recordUserPage(openid, "调用抽奖接口", 0);
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="getLottery-dialog">')
					._('<div class="dialog getLottery-dialog" data-collect="true" data-collect-flag="tj-food-getLotterydialog-open" data-collect-desc="福袋弹层-点击卡通抽奖">')
						._('<div class="content">')
							._('<h1>想要送您一份大礼<br>快点打开看看有什么吧~</h1>')
							._('<img src="./images/lottery.png">')
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
						shownewLoading(null, '红包领取中...');
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
					    // H.dialog.lottery.reset();
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
					}else if(H.dialog.lottery.pt == 5){
                        shownewLoading();
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent(nickname) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid
                        }, 'callbackLotteryAwardHandler', true, H.dialog.lottery.$dialog);
                        if(H.dialog.lottery.ru && H.dialog.lottery.ru.length > 0){
                            setTimeout(function(){
                                location.href =  H.dialog.lottery.ru;
                            },500);
                        }else{
                            H.dialog.lottery.reset();
                        }
                        //卡券奖品
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
				    }else if (data.pt === 5){
	                    H.dialog.lottery.ru = data.ru;
	                    me.$dialog.find('.code-tip').text(data.cc);
	                    me.$dialog.find('.code').removeClass("none");
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
				hidenewLoading();
				H.dialog.close.call(this);
				$(".modal").animate({'opacity':'0'},500);
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
	            swiper.slideNext();
			},
			close: function() {
				this.$dialog.find('.btn-close').trigger('click');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
						._('<div class="dialog-assist">')
							._('<h1 class="lott-title"><img src="images/congra.png"/></h1>')
							._('<div class="border">')
								._('<div class="award-img">')
									._('<img id="aw" src="" />')
									._('<div class="contact-info">')
									 	._('<div class="code none">')
					                    	._('<h4 class="code-tip"></h4>')
					                    ._('</div>')
										._('<div class="contact none">')
											._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
											._('<p class="q-name"><input type="text" class="name" placeholder="姓名" /></p>')
											._('<p class="q-mobile"><input type="tel" class="mobile" placeholder="电话" /></p>')
											._('<p class="q-address"><input type="text" class="address" placeholder="地址" /></p>')
										._('</div>')
										._('<a href="#" class="btn-dia none" id="btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-领取按钮">领&nbsp&nbsp取</a>')
										._('<a href="#" class="btn-dia none" id="btn-back" data-collect="true" data-collect-flag="lotterydialog-BACKbtn" data-collect-desc="抽奖弹层-返回按钮">确&nbsp&nbsp认</a>')
									._('</div>')
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
			open: function(flag) {
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				if (flag == 'answer')
					$('.dialog-thanks').addClass('answer-dialog');
				else
					$('.dialog-thanks').addClass('thanks-dialog');
				
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-back').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
	            swiper.slideNext();
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal-thanks" id="thanks-dialog">')
					._('<div class="dialog-thanks lottery-null">')
						._('<div class="award-box">')
							._('<p class="award-no-tip answer">啊哦，答错啦，继续加油哦~~</p>')
							._('<img class="award-no-img answer" src="./images/icon-wrong.png">')
							._('<p class="award-no-tip thanks">您与奖品擦肩而过，继续加油哦</p>')
							._('<img class="award-no-img thanks" src="./images/tips-noaward.png">')
							._('<img class="award-bg" src="./images/bg-award.png" >')
						._('</div>')
						._('<a href="javascript:;" class="btn btn-back" id="btn-back">继续加油</a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		}
	};
	
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};

	W.callbackLotteryAwardHandler = function(data) {
		if (data.result) {
			showTips('领取成功!');
		}
	};
})(Zepto);

$(function() {
	H.dialog.init();
});

