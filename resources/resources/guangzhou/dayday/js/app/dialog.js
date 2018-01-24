(function($) {
	
	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		init: function () {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function (e) {
				e.preventDefault();
				H.dialog.rule.open();
			}).delegate('.btn-close', 'click', function (e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
			});
		},
		close: function () {
			$('.modal').addClass('none');
		},
		open: function () {
			H.dialog.close();
			if (this.$dialog) {
				this.$dialog.removeClass('none');
			} else {
				this.$dialog = $(this.tpl());
				H.dialog.$container.append(this.$dialog);
			}

			H.dialog.relocate();
		},

		relocate: function () {
			var height = $(window).height(),
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.10;
			$(".dialog-inner").css({ 
				'width': width, 
				'height': height * 0.82
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
				this.$dialog && this.$dialog.addClass('none');
				
			},
			event: function () {
				var me = this;
				this.$dialog.find('.close').click(function (e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-know').click(function (e) {
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
					._('<div class="dialog rule-dialog ">')
						._('<div class="rule-box">')
							._('<h2>活动规则</h2>')
							._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="tv-gznews-dayday-ruledialog-closebtn" data-collect-desc="新闻日日睇规则弹层-关闭按钮"></a>')
								._('<div class="content">')
								._('<div class="rule-con"></div>')
								._('</div>')
								._('<a  class="btn-try" id="btn-know" data-collect="true" data-collect-flag="tv-gznews-dayday-rule-know-btn" data-collect-desc="引导弹层-我知道了按钮">我知道了</a>')
							._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
        //引导
        guide: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();
                var me = this;
                setTimeout(function() {
                    me.close();
                }, 5000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('#btn-try').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            close: function() {
                this.$dialog && this.$dialog.addClass('none');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-guide" id="guide-dialog">')
                    ._('<div class="dialog guide-dialog dropDown">')
	                     ._('<img src="images/guide-logo.png" />')
	                    ._('<div class="guide-content">')
	                     ._('<p class="ellipsis"><label></label>每晚锁定广州新闻频道《新闻日日睇》  </p>')
	                     ._('<p class="ellipsis"><label></label>打开微信，进入发现摇一摇（TV）</p>')
	                    ._('<p class="ellipsis"><label></label>对着电视摇一摇</p>')
	                    ._('<p class="ellipsis"><label></label>参与话题互动有机会赢取大奖</p>')
	                    ._('<a  class="btn-try" id="btn-try" data-collect="true" data-collect-flag="tv-gznews-dayday-guide-closebtn" data-collect-desc="引导弹层-立即参与按钮">立即参与</a></div>')
                    ._('</div>')
                ._('</section>');
                return t.toString();
            }
        },	
        fudai: {
			$dialog: null,
			open: function() {
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				this.event();
			},
			close: function() {
				this.$dialog.find('.fudai').removeClass("requesting");
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this,
				$fudai = this.$dialog.find('.fudai');
					$fudai.click(function(e) {
						e.preventDefault();
						if(!$(this).hasClass("requesting")){
							$(this).addClass("requesting");
						}else{
							return;
						}
						if(!H.comments.wxCheck){
							H.dialog.lottery.open(null);
			                me.close();
						}else{
							setTimeout(function() {
								showLoading();
				                $.ajax({
				                    type : 'GET',
				                    async : false,
				                    url : domain_url + 'api/lottery/luck',
				                    data: { oi: openid},
				                    dataType : "jsonp",
				                    jsonpCallback : 'callbackLotteryLuckHandler',
				                    complete: function() {
				                        hideLoading();
				                    },
				                    success : function(data) {
				                    	H.dialog.lottery.open(data);
				                    	me.close();
				                    },
				                    error : function() {
				                    	H.dialog.lottery.open(null);
				                    	me.close();
				                    }
				                });
							}, 5);
						}
					});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal fudai-dialog" id="fudai-dialog">')
					._('<div class="fudai-round">')
						._('<img class="fudai" data-collect="true" data-collect-flag="tv-gznews-dayday-fudai-lottery-btn" data-collect-desc="福袋弹层-抽奖按钮" src="images/fudai.png"/>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		lottery : {
			me : this,
			iscroll: null,
			$dialog: null,
			ci:null,
            ts:null,
            si:null,
            pt:null,
            url:null,
            sto:null,
			open: function(data) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(),
				winH = $(window).height();
				hideLoading($dialog);
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				$("body").css("overflow-y","hidden");
				this.$dialog && this.$dialog.removeClass('none');
				H.dialog.lottery.update(data);
			},
			event: function() {
				var me = this;
				this.$dialog.find('#btn-award').click(function(e) {
					e.preventDefault();
					if (!me.check()) {
						return false;
					};
					if(!$(this).hasClass("requesting")){
						$(this).addClass("requesting")
					}else{
						return;
					}
					var $mobile = $('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = $('.name'),
					name = $.trim($name.val());
//					$address = $('.address'),
//					address = $.trim($address.val());

					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile
//						ad: encodeURIComponent(address)
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
				this.$dialog.find('#btn-get').click(function(e) {
					e.preventDefault();
					if(!$(this).hasClass("requesting")){
						$(this).addClass("requesting")
					}else{
						return;
					}
					var $phone = $('.quan .phone'),
					phone = $.trim($phone.val());
					if (!/^\d{11}$/.test(phone)) {
						showTips('这手机号，可打不通...',4);
						$phone.focus();
						$(this).removeClass("requesting")
						return ;
					}
					getResult('api/lottery/award', {
                        oi: openid,
                        hi: headimgurl,
                        nn: nickname,
                        ph: phone
                    }, 'callbackLotteryAwardHandler');
					 me.sto = setTimeout(function(){
                        hidenewLoading();
                    },15000);
                    me.close();
                    if(me.pt == 7){
                        H.comments.wxCheck = false;
                      	setTimeout(function(){
                            me.wx_card();
                        },1000);
                     }else if(me.pt == 9){
                        window.location.href = $(this).attr("data-href");                    }
					
				});
				this.$dialog.find('#btn-red').click(function(e) {
					e.preventDefault();	
					$(".contact input").removeAttr("disabled");
					me.close();
				});
				this.$dialog.find('#btn-back').click(function(e) {
					e.preventDefault();
					me.close();
				});
				
			},
			 wx_card:function(){
                var me = this;
                //卡券
                wx.addCard({
                    cardList: [{
                        cardId: H.dialog.lottery.ci,
                        cardExt: "{\"timestamp\":\""+ H.dialog.lottery.ts +"\",\"signature\":\""+ H.dialog.lottery.si +"\"}"
                    }],
                    success: function (res) {
                        H.comments.wxCheck = true;
                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        recordUserOperate(openid, res.errMsg, "cctv7-world-card-fail");
                        hidenewLoading();
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
          	update: function(data) {
        		var me = this;
   				if (data != null && data != '') {
   					if (data.result) {
   						me.pt = data.pt;
   						if (data.pt === 1) { //实物奖品
   							H.dialog.prizeType = 1;
   							this.$dialog.find('.awardwin-tips').html(data.tt || '');
   							this.$dialog.find('.award-img img').attr('src', (data.pi || ''));
   							this.$dialog.find('.name').val(data.rn || '');
   							this.$dialog.find('.mobile').val(data.ph || '');
// 							this.$dialog.find('.address').val(data.ad || '');
   							this.$dialog.find('.awarded-tip').addClass("none");
   							this.$dialog.find('.award-tip').removeClass("none");
   							this.$dialog.find('.contact').removeClass("none");
   							$("#btn-award").removeClass("none");
   							$("#btn-red").addClass("none");
   							
   							this.$dialog.find('.goods-btn').removeClass('none');
   							this.$dialog.find('.quan-btn').addClass('none');
   							this.$dialog.find('.goods').removeClass('none');
   							this.$dialog.find('.quan').addClass('none');
	 						this.$dialog.find('.award-content').removeClass('none');
	 						this.$dialog.find('.award-none').addClass('none');
   						} else if(data.pt === 7||data.pt === 9){
   							if(data.pt === 7){
   								me.ci = data.ci;
			                    me.ts = data.ts;
			                    me.si = data.si;
   							}
   							if(data.pt === 9){
   								this.$dialog.find('#btn-get').attr('data-href',data.ru);
   							}
   							this.$dialog.find('.awardwin-tips').html(data.tt || '');
   							this.$dialog.find('.award-img img').attr('src', (data.pi || ''));
   							this.$dialog.find('.quan .phone').val(data.ph || '');
   							this.$dialog.find('.goods-btn').addClass('none');
   							this.$dialog.find('.quan-btn').removeClass('none');
   							this.$dialog.find('.goods').addClass('none');
   							this.$dialog.find('.quan').removeClass('none');
	 						this.$dialog.find('.award-content').removeClass('none');
	 						this.$dialog.find('.award-none').addClass('none');
   						} else{
   							me.notLott();
   						}
					} else {
	   					me.notLott();
   					}				
   				} else {
   					me.notLott();
   				}
			},
			notLott : function(){
				var me = this;
				this.$dialog.find('.award-content').addClass('none');
   			    this.$dialog.find('.award-none').removeClass('none');
   			    setTimeout(function(){
   			    	me.close();
   			    },2000)
			},
			check: function() {
				var $mobile = $('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = $('.name'),
					name = $.trim($name.val());
//					$address = $('.address'),
//					address = $.trim($address.val());
				if (name.length > 20 || name.length == 0) {
					showTips('请输入您的姓名，不要超过20字哦!',4);
					$name.focus();
					return false;
				}
				if (!/^\d{11}$/.test(mobile)) {
					showTips('这手机号，可打不通...',4);
					$mobile.focus();
					return false;
				}
//				if (address.length < 4&&H.dialog.prizeType == 1) {
//					showTips('请填写正确的地址',4);
//					$address.focus();
//					return false;
//				}
				return true;
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
			succ: function() {
				var me = this, 
				$qmobile = $('.dialog').find('.mobile'),
				qmobile = $qmobile.val(),
				$name = $('.dialog').find('.name'),
				qname = $name.val();
				$address = $('.dialog').find('.address'),
				qaddress = $address.val();
				showTips('信息提交成功',4);
				this.$dialog.find('.awarded-tip').removeClass("none");
				this.$dialog.find('.award-tip').addClass("none");
				this.$dialog.find("#btn-award").removeClass("requesting").addClass("none");
				this.$dialog.find("#btn-red").removeClass("none");
				this.$dialog.find(".contact input").attr("disabled","disabled").css("color","grey");
				$('.name').val('姓名：' + qname);
				$('.mobile').val('').attr("placeholder",'电话：' + qmobile);
//				$('.address').val('地址：' + qaddress);
			},
			close: function() {
				$("body").css("overflow-y","scroll");
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
	
			},
			tpl: function() {
				var t = simpleTpl(), randomPic = Math.ceil(7*Math.random());
				t._('<section class="modal" id="lottery-dialog">')
//					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yn-travel-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					._('<div class="dialog lottery-dialog">')
						._('<div class="dialog-inner">')
							._('<div class="award-content none">')
								._('<div class="award-lottery">')
									._('<div class="award-win goods none">')
										._('<div class="award-img">')
											._('<img src="" />')
										._('</div>')
										._('<h5 class="awardwin-tips"></h5>')
										._('<div class="contact none">')
											._('<h4 class="award-tip">请填写您的联系方式，自提地址请查看活动规则</h4>')
											._('<h4 class="awarded-tip none">以下是您的联系方式，自提地址请查看活动规则</h4>')
											._('<p class="q-name"><input type="text" class="name"  placeholder="姓名："/></p>')
											._('<p class="q-mobile"><input type="number" class="mobile"   placeholder="电话："/></p>')
// 											._('<p class="q-address"><input type="text" class="address"  placeholder="地址：" /></p>')
										._('</div>')
									._('</div>')
									._('<div class="award-win quan none">')
										._('<h5 class="awardwin-tips"></h5>')
										._('<div class="award-img">')
											._('<img src="" />')
										._('</div>')
										._('<input type="number" class="phone"   placeholder="电话："/>')
									._('</div>')
								._('</div>')
								._('<div class="bg-bottom">')
									._('<div class="goods-btn none">')
										._('<a href="#" class="btn-style" id="btn-award" data-collect="true" data-collect-flag="tv-jiangsu-week-luck-lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮">提&nbsp&nbsp&nbsp交</a>')
										._('<a href="#" class="btn-style none" id="btn-red" data-collect="true" data-collect-flag="tv-jiangsu-week-luck-lotterydialog-confirmbtn" data-collect-desc="抽奖弹层-领取按钮">确&nbsp&nbsp&nbsp定</a>')
									._('</div>')
									._('<div class="quan-btn none">')
										._('<a href="#" class="btn-style" id="btn-get" data-collect="true" data-collect-flag="tv-jiangsu-week-luck-lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮">领&nbsp&nbsp&nbsp取</a>')
									._('</div>')
								._('</div>')
							._('</div>')
							._('<div class="award-none none">')
								._('<img src="images/not-lott.png">')
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
		
		if (data.result ) {
			if(H.dialog.lottery.pt == 1 ){
				H.dialog.lottery.succ();
			}
			return;
		} else {
			showTips('亲，服务君繁忙！稍后再试哦！');
		}
	};
})(Zepto);

H.dialog.init();





