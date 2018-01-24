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
				H.dialog.isOpen = false;
				this.event();
				var winW = $(window).width(),
				winH = $(window).height();
				$(".content").css({  
					'height': winH * 0.64-50,
				});
				setTimeout(function(){
					$(".content").removeClass("hidden");
				},1000);
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
					$(".content").addClass("hidden");
            	}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.close').click(function(e) {
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
						._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<div class="dialog-assist">')
							._('<h1 class="rule-title">活动规则</h1>')
							._('<div class="content hidden">')
								._('<div class="rule"></div>')
//								._('<a href="#" class="btn-know close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮">我知道了</a>')
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
			// 积分排行榜
		rank: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				getResult('api/lottery/integral/rank/self', {
					oi: openid
				}, 'callbackIntegralRankSelfRoundHandler', true, this.$dialog);
			},
			close: function() {
				var me = this;
				me.$dialog.find('.rank-dialog').addClass('disphide');
				setTimeout(function(){
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
			},
			selfupdate: function(data) {
				getResult('api/lottery/integral/rank/top10', {}, 'callbackIntegralRankTop10RoundHandler', true, this.$dialog);
			},
			selfurank:function(data){
				var t = simpleTpl();
				t._('<span class="r-avatar"><img src="'+ (headimgurl+ '/' +yao_avatar_size || './images/danmu-head.jpg') +'" /></span>')
                ._('<span class="r-rank">'+ (nickname ||"匿名用户")+":"+ data.in +'积分</span>')
				._('<span class="r-name ellipsis">排名:'+ (data.rk || '-') +'</span>')
				this.$dialog.find('.self').html(t.toString());
			},
			update: function(data) {
				var t = simpleTpl(),
					top10 = data.top10 || [],
					len = top10.length;
				
				for (var i = 0; i < len; i ++) {
					t._('<li>')
						._('<span class="r-avatar"><img src="'+ (top10[i].hi ? (top10[i].hi + '/64') : './images/danmu-head.jpg') +'" /></span>')
//                      ._('<span class="r-rank">第'+ (top10[i].rk || '-') +'名</span>')
                        ._('<span class="r-rank">'+ (top10[i].nn ||"匿名用户") +'</span>')
						._('<span class="r-name ellipsis">'+ (top10[i].in || '0') +'积分</span>')
					._('</li>');
				}
				this.$dialog.find('ul').html(t.toString());
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rank-dialog">')
					._('<div class="dialog rank-dialog">')
						._('<div class="rank-title"><img src="images/rank-title.png"/></div>')
						._('<div class="rank-content dialog-assist">')
							._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-hebeitv-world-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
							._('<div class="list">')
								._('<div class="self">')
									._('<span class="r-avatar"><img src="'+ (headimgurl || './images/danmu-head.jpg') +'" /></span>')
			                        ._('<span class="r-rank">'+ (nickname || "匿名用户") +'</span>')
									._('<span class="r-name ellipsis"></span>')
								._('</div>')
								._('<div class="content">')
									._('<ul></ul>')		
								._('</div>')
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		thank: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
			    this.event();
			},
			close: function() {
				var me = this;
				H.dialog.close.call(this);
		 		if(H.lottery.type == 2){
					H.lottery.isCanShake = true;
				}else{
					H.lottery.isCanShake = false;
					shownewLoading(null, '请稍后...');
					setTimeout(function(){
						toUrl("comment.html");
					},2000)
				}
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			event: function() {
				var me = this;
				this.$dialog.find('.close').click(function(e) {
					e.preventDefault();
					me.$dialog.find('.thank-dialog').addClass('disphide');	
					setTimeout(function(){
						me.close();
	            	}, 1000);
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="thank-dialog">')
					._('<div class="dialog thank-dialog">')
					._('<h1 class="thank-title"><img src="images/thank-title.png"/></h1>')
						._('<div class="dialog-assist">')
							._('<img src="images/erweima.jpg" />')
							._('<p>长按识别图中二维码，更多精彩等着你</p>')
							._('<a href="#" class="btn-crm close" data-collect="true" data-collect-flag="thank-dialog-closebtn" data-collect-desc="未中奖弹层-关闭按钮">确定</a>')
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
					'width': winW*0.82, 
					'height': winH * 0.74,
					'left': winW*0.09,
					'right':winW*0.09,
					'top': winH * 0.13,
					'bottom': winH * 0.13
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
					}else if(H.dialog.lottery.pt == 2){
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent(nickname) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid
						}, 'callbackLotteryAwardHandler', true, H.dialog.lottery.$dialog);
						 H.dialog.lottery.reset();
						showTips("领取成功");
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
				}else if(me.address.length <5){
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
					if(!is_android()){
						if(H.dialog.lottery.pt == 1){
							window.location.href = window.location.href;
						}
					}
				}else{
					H.lottery.isCanShake = false;
					shownewLoading(null, '请稍后...');
					setTimeout(function(){
						toUrl("comment.html");
					},2000)
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
					._('<h1 class="lott-title"><img src="images/congra.png"/></h1>')
						._('<div class="dialog-assist">')
//							 ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lottery-dialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>')
							._('<div class="lottery-assist">')
								._('<div class="award-img">')
									._('<img id="aw" src="" />')
									._('<div class="contact none">')
										._('<h4 class="award-tip">请填写您的联系方式，以便顺利领奖</h4>')
										._('<p class="q-name"><input type="text" class="name" placeholder="姓名" /></p>')
										._('<p class="q-mobile"><input type="tel" class="mobile" placeholder="电话" /></p>')
										._('<p class="q-address"><input type="text" class="address" placeholder="地址" /></p>')
									._('</div>')
									._('<a href="#" class="btn btn-award none" id="btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-领取按钮">立即领取></a>')
									._('<a href="#" class="btn btn-back none" id="btn-back" data-collect="true" data-collect-flag="lotterydialog-BACKbtn" data-collect-desc="抽奖弹层-返回按钮">确定</a>')
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
	W.callbackIntegralRankSelfRoundHandler = function(data) {
		if (data.result) {
			H.dialog.rank.selfupdate(data);
			H.dialog.rank.selfurank(data);
		};
	};
	
	W.callbackIntegralRankTop10RoundHandler = function(data) {
		if (data.result) {
			H.dialog.rank.update(data);
		};
	};
})(Zepto);

$(function() {
	H.dialog.init();
});