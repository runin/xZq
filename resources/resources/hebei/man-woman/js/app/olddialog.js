(function($) {
	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		clickFlag: true,
		successFlag: true,
        iscard:false,
		PV:"",
        ci:"",
        ts:"",
        si:"",
		ismark:false,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function(e) {
				//e.preventDefault();
				//H.dialog.rule.open();
			}).delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				var me = $(this);
				//if(H.index == undefined){
				//	$(".rank-dialog").css({"-webkit-animation":"disphide 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"}).one("webkitAnimationEnd", function () {
				//		H.dialog.rank.close();
				//		$('.rank-dialog').css({"-webkit-animation":""});
				//		me.css({"-webkit-animation":""});
				//		$(this).closest('.modal').addClass('none');
				//		H.yao.isCanShake = true;
				//	});
				//}else{
				//	if(H.index.CHKINDEX == 1){
				//		$(".rule-dialog").css({"-webkit-animation":"disphide 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"}).one("webkitAnimationEnd", function () {
				//			H.dialog.rule.close();
				//			$('.rule-dialog').css({"-webkit-animation":""});
				//			me.css({"-webkit-animation":""});
				//			$(this).closest('.modal').addClass('none');
				//			//H.yao.isCanShake = true;
				//		});
				//	}
				//}
			}).delegate('.btn-result', 'click', function(e) {
				e.preventDefault();
				H.dialog.result.open();
			}).delegate('.btn-comeon', 'click', function(e) {
				e.preventDefault();
				H.dialog.guide.open();
			});

			//$.ajax({
			//	type:"GET",
			//	url:domain_url+"fashion/indexnew" +dev,
			//	dataType:"jsonp",
			//	jsonp: "callback",
			//	jsonpCallback:"fashionIndexNewHandler",
			//	data:{
			//		openid:openid
			//	},
			//	async: false,
			//	error: function () {
			//		//alert("请求数据失败，请刷新页面");
			//	}
			//});
			//getResult("fashion/indexnew",{
			//	openid:openid
			//},"fashionIndexNewHandler");
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

			$('.dialog').each(function() {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({ 
					'width': width * 0.88, 
					'height': height * 0.88, 
					'left': width * 0.06,
					'right': width * 0.06,
					'top': height * 0.06,
					'bottom': height * 0.06
				});
				$(".rule-dialog").css({ 
					'width': width, 
					'height': height * 0.80, 
					'left': 0,
					'right':0,
					'top': height * 0.10,
					'bottom': height * 0.15
				});
				$(".rank-dialog").css({ 
					'width': width, 
					'height': height * 0.77, 
					'left': 0,
					'right':0,
					'top': height * 0.10,
					'bottom': height * 0.06
				});
				var $box = $(this).find('.box');
				if ($box.length > 0) {
					$box.css('height', height * 0.38);
				}
			});
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
				}, 10000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-try').click(function(e) {
					e.preventDefault();
					$(this).removeClass("pop-zoom").addClass("pop-zoom");
					me.$dialog && me.$dialog.find(".relocated").addClass("guide-top-ease");
					setTimeout(function() {
						me.close();
					},500);
				});
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog relocated">')
						._('<div class="guide-title"></div>')
						._('<div class="guide-content"><p><i>1</i>打开电视，锁定青海卫视</p>')
						._('<p><i>2</i>打开微信，进入摇一摇(电视)</p>')
						._('<p><i>3</i>对着电视摇一摇</p>')
						._('<p><i>4</i>参与互动就有机会赢取超值礼品</p>')
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="guide-trybtn" data-collect-desc="引导弹层-关闭按钮"></a></div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		// 规则
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				//this.event();
				//$(".rule-dialog").addClass("pop-zoom");
				$('body').addClass('noscroll');
				if(H.dialog.ismark == false){
					getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
				}
			},
			close: function() {
				$('body').removeClass('noscroll');
				$('.pop-zoom').removeClass('pop-zoom');
				$('.pop-opacity').removeClass('pop-opacity');
				this.$dialog && this.$dialog.addClass('none');
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
				H.dialog.ismark = true;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<div class="content border">')
						  ._('<h2></h2>')
							._('<div class="rule none"></div>')
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
				//$(".rank-dialog").addClass("pop-zoom");
				getResult('api/lottery/integral/rank/self', {
					oi: openid
					//pu: acttUID
				}, 'callbackIntegralRankSelfRoundHandler', true, this.$dialog);
			},
			close: function() {
				$('.pop-zoom').removeClass('pop-zoom');
				$('.pop-opacity').removeClass('pop-opacity');
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				//this.$dialog.find('.btn-close').click(function(e) {
				//	e.preventDefault();
				//	me.close();
				//});
			},
			selfupdate: function(data) {
				this.$dialog.find('.jf').text(data.in || 0);
				this.$dialog.find('.pm').text(data.rk || '暂无排名');

				getResult('api/lottery/integral/rank/top10', {
					//pu: acttUID
				}, 'callbackIntegralRankTop10RoundHandler', true, this.$dialog);
			},
			update: function(data) {
				var t = simpleTpl(),
					top10 = data.top10 || [],
					len = top10.length;
				
				for (var i = 0; i < len; i ++) {
					t._('<li>')
						._('<span class="r-avatar"><img src="'+ (top10[i].hi ? (top10[i].hi + '/64') : './images/danmu-head.jpg') +'" /></span>')
                        ._('<span class="r-rank">第'+ (top10[i].rk || '-') +'名</span>')
						._('<span class="r-name ellipsis">积分：'+ (top10[i].in || '0') +'</span>')
					._('</li>');
				}
				this.$dialog.find('ul').html(t.toString());
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rank-dialog">')
					._('<div class="dialog rank-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
						._('<div class="rank-content"><img class="rank-title" src="images/integral-pop-btn.png" /><p>'+ actTtle +'</p>')
						._('<h3>【我的积分：<span class="jf"></span>排名：<span class="pm"></span>】</h3>')
						._('<div class="list border">')
							._('<div class="content">')
								._('<ul></ul>')		
							._('</div>')
						._('</div></div>')
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
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this,
				$fudai = this.$dialog.find('.fudai');
				if (H.dialog.clickFlag) {
					H.dialog.clickFlag = false;
					$fudai.click(function(e) {
						e.preventDefault();
						setTimeout(function() {
							shownewLoading();
			                $.ajax({
			                    type : 'GET',
			                    async : false,
			                    url : domain_url + 'api/lottery/luck'+dev,
			                    data: {
									oi: openid
									//sau:acttUID
								},
			                    dataType : "jsonp",
			                    jsonpCallback : 'callbackLotteryLuckHandler',
			                    complete: function() {
			                        hidenewLoading();
			                    },
			                    success : function(data) {
			                    	H.dialog.lottery.open(data);
			                    },
			                    error : function() {
			                    	H.dialog.lottery.open(null);
			                    }
			                });
						}, 5);
						me.close();
					});
				} else {
					return;
				};
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="fudai-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="rankdialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>')
					._('<div class="fudai" data-collect="true" data-collect-flag="rankdialog-clickbtn" data-collect-desc="领奖弹层-点击按钮"><div class="hand"></div><div class="fudai-round"></div><p>打开看看里面是什么吧？</p></div>')
				._('</section>');
				return t.toString();
			}
		},
		lottery: {
			iscroll: null,
			$dialog: null,
			LOTTERIED_CLS: 'lotteried',
			REQUEST_CLS: 'requesting',
			AWARDED_CLS: 'lottery-awarded',
            sto:null,
			redpack:"",
			pt:null,
			LOTTERY_NONE_CLS: 'lottery-none',
			open: function(data) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(),
				winH = $(window).height();
				H.dialog.lottery.pt = data.pt;
				hideLoading($dialog);
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				this.$dialog && this.$dialog.removeClass('none');
				$(".lottery-dialog").css({ 
					'width': winW, 
					'height': winH * 0.65,
					'left': 0,
					'right':0,
					'top': winH * 0.15,
					'bottom': winH * 0.15
				});
				H.dialog.lottery.update(data);
				var inheight;
				if(data.pt == 7){
                    this.$dialog.find('.btn-award').off();
                    H.dialog.lottery.readyFunc();

					document.getElementById('aw').onload = function () {
						inheight = ($(".contact").height() + $(".award-img").height() + 35) + (winH * 0.2);
						if(inheight >= winH){
							$(".award-img img").css("height","60px");
							inheight = ($(".contact").height() + 95) + (winH * 0.2);
						}
						$(".lottery-dialog").css({
							'height': inheight,
							'top': (winH - inheight) * 0.5
						});
					};
                }else if(data.pt == 4){
					//document.getElementById('aw').onload = function () {
					//	inheight = ($(".contact").height() + $(".award-img").height() + 35) + (winH * 0.4);
					//	if(inheight >= winH){
					//		$(".award-img img").css("height","60px");
					//		inheight = ($(".contact").height() + 95) + (winH * 0.12);
					//	}
                    //
					//	$(".lottery-dialog").css({
					//		'height': inheight,
					//		'top': (winH - inheight) * 0.35
					//	});
					//	alert("1");
					//};
				}else {
					document.getElementById('aw').onload = function () {
						inheight = ($(".contact").height() + $(".awardwin-tips").height() + $(".award-img").height() + 35) + (winH * 0.12);
						if(inheight >= winH){
							$(".award-img img").css("height","60px");
							inheight = ($(".contact").height() + 95) + (winH * 0.2);
						}

						$(".lottery-dialog").css({
							'height': inheight,
							'top': (winH - inheight) * 0.5
						});
					};
				}
			},
            readyFunc: function(){
                var me = this;
                this.$dialog.find('.btn-award').on("click", function (e) {
                    e.preventDefault();
                    if(!$('.btn-award').hasClass("flag")){
                        $('.btn-award').addClass("flag");
                        if(H.dialog.lottery.pt == 7){
							shownewLoading();
							me.close();
							me.sto = setTimeout(function(){
                                //H.lottery.isCanShake = true;
                                hidenewLoading();
                            },15000);
                            // H.lottery.wxCheck = false;
                            setTimeout(function(){
								H.dialog.lottery.wx_card();
                            },1000);
                        }
                    }
                });
                //$('#btn-getluck').click(function(e) {
                //    e.preventDefault();
                //    if($("#lot-inp").hasClass("none") || me.check()){
                //        H.lottery.isCanShake = false;
                //        if(!$('#btn-getluck').hasClass("flag")){
                //            $('#btn-getluck').addClass("flag");
                //            if(me.pt == 7){
                //                shownewLoading();
                //                //me.close();
                //                me.sto = setTimeout(function(){
                //                    H.lottery.isCanShake = true;
                //                    hidenewLoading();
                //                },15000);
                //                $('#btn-getluck').text("领取中");
                //                // H.lottery.wxCheck = false;
                //                setTimeout(function(){
                //                    me.wx_card();
                //                },1000);
                //            }
                //            //else if(me.pt == 9){
                //            //    shownewLoading();
                //            //    $('#btn-getluck').text("领取中");
                //            //    getResult('api/lottery/award', {
                //            //        nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                //            //        hi: headimgurl ? headimgurl : "",
                //            //        oi: openid,
                //            //        rn: me.name ? encodeURIComponent(me.name) : "",
                //            //        ph: me.mobile ? me.mobile : ""
                //            //    }, 'callbackLotteryAwardHandler');
                //            //    setTimeout(function(){
                //            //        location.href = H.dialog.lottery.url;
                //            //    },500);
                //            //}
                //        }
                //    }
                //});
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
                        H.yao.wxCheck = true;
                        H.yao.isCanShake = true;
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid
                            //rn: me.name ? encodeURIComponent(me.name) : "",
                            //ph: me.mobile ? me.mobile : ""
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
						H.yao.isCanShake = true;
						//H.lottery.canJump = true;
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        H.yao.isCanShake = true;
                        hidenewLoading();
                    },
                    cancel:function(){
                        H.yao.isCanShake = true;
                        hidenewLoading();
                    }
                });
            },
			event: function() {
				var me = this;
				this.$dialog.find('.btn-award').click(function(e) {
					e.preventDefault();

					if (!me.check()) {
						return false;
					};
					
					var $mobile = $('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = $('.name'),
					name = $.trim($name.val()),
                    $address = $('.address'),
                    address = $.trim($address.val());
					me.disable();
					if(H.dialog.lottery.pt == 4){
						window.location.href = H.dialog.lottery.redpack;
						return;
					}else if(H.dialog.lottery.pt == 2){
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid,
							rn: encodeURIComponent(name),
							ph: mobile
							//ad: address,
							//pv: H.dialog.PV
						}, 'callbackLotteryAwardHandler', true, me.$dialog);
						H.yao.count_down();
					}else{
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid
							//rn: encodeURIComponent(name),
							//ph: mobile,
							//ad: address
						}, 'callbackLotteryAwardHandler', true, me.$dialog);
						H.yao.count_down();
					}
				});
				
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
					H.yao.isCanShake = true;
				});
				
				this.$dialog.find('.btn-share').click(function(e) {
					e.preventDefault();
					me.$dialog.find('.btn-close').trigger('click');
					me.reset();
					H.yao.isCanShake = true;
				});
			},
			update: function(data) {
				if (data != null && data != '') {
					if (data.result) {
						if (data.pt === 1) { //实物奖品
                            this.$dialog.find(".lottery-dialog").addClass("award-bg");
							this.$dialog.find('.awardwin-tips').html(data.tt || '').removeClass('none');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.find('.name').val(data.rn || '');
							this.$dialog.find('.mobile').val(data.ph || '');
							this.$dialog.find('.q-address').addClass("none");
							//this.$dialog.find('.address').val(data.ad || '');
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').removeClass('redbag');
							this.$dialog.find('.btn').css({"background":"url(./images/award-btn.png) 0 0 no-repeat","background-size":"100%"});
							this.$dialog.find('.btn-share').css({"background":"url(./images/try.png) 0 0 no-repeat","background-size":"100%"});
							$(".award-win").css("margin","auto");
							$(".award-img").css("margin","10% auto 3%");
							$(".award-win").css({"background": "url(./images/newaward-bg.jpg) no-repeat 100% 100%!important","background-size": "100% 100%!important"});
							$(".award-bg").css({"background": ""});
						} else if (data.pt === 9) { //外链
                            this.$dialog.find(".lottery-dialog").addClass("award-bg");
							this.$dialog.find('.awardwin-tips').html(data.tt || '').removeClass('none');
							this.$dialog.find('img').attr('src', (data.pi || ''));
							this.$dialog.find('.q-name').addClass("none");
							this.$dialog.find('.q-mobile').addClass("none");
							this.$dialog.find('.q-address').addClass("none");
							this.$dialog.find('.award-tip').addClass("none");
							this.$dialog.addClass(this.LOTTERIED_CLS);
							this.$dialog.find('.award-win').removeClass('none');
							this.$dialog.find('.contact').removeClass('redbag');
							//this.$dialog.find('.btn-red').attr('href', data.rp);
							this.$dialog.find('.btn-award').attr('href', data.ru).css({"background":"url(./images/award-btn.png) 0 0 no-repeat","background-size":"100%"}).off();
							//this.$dialog.find('.btn-share').css({"background":"url(./images/try.png) 0 0 no-repeat","background-size":"100%"});
							$(".award-win").css("margin","auto");
							$(".award-img").css("margin","10% auto 3%");
							$(".award-win").css({"background": "url(./images/newaward-bg.jpg) no-repeat 100% 100%!important","background-size": "100% 100%!important"});
							$(".award-bg").css({"background": ""});
						} else if (data.pt === 7) { //卡券
                            //this.$dialog.addClass("award-bg");
							//this.$dialog.find('.awardwin-tips').html(data.tt || '');
							//this.$dialog.find('img').attr('src', (data.pi || ''));
							//this.$dialog.addClass(this.LOTTERIED_CLS);
                    	 	//recordUserPage(openid, "《我的团长我的团》红包领奖页", '');
							//this.$dialog.find('.award-win').removeClass('none');
							//this.$dialog.find('.contact').addClass('redbag');
							//this.$dialog.find('.award-img').css({
							//	'margin': '20% auto'd
							//});
							//this.$dialog.find('.award-win').css({
							//	'padding-top': '15%'
							//});
							//this.$dialog.find('.btn-red').attr('href', data.rp);
                            H.dialog.ci = data.ci;
                            H.dialog.ts = data.ts;
                            H.dialog.si = data.si;
                            this.$dialog.find(".lottery-dialog").addClass("award-bg");
                            this.$dialog.find('.awardwin-tips').html(data.tt || '');
                            this.$dialog.find('img').attr('src', (data.pi || ''));
                            this.$dialog.find('.q-name').addClass("none");
                            this.$dialog.find('.q-mobile').addClass("none");
                            this.$dialog.find('.q-address').addClass("none");
                            this.$dialog.find('.award-tip').addClass("none");
                            this.$dialog.find('.awardwin-tips').removeClass("none");
                            this.$dialog.addClass(this.LOTTERIED_CLS);
                            this.$dialog.find('.award-win').removeClass('none');
                            this.$dialog.find('.btn').css({"background":"url(./images/get-award.png) 0 0 no-repeat","background-size":"100%"});
                            this.$dialog.find('.contact').removeClass('redbag');
						}else if (data.pt === 4) { //红包
							H.dialog.lottery.redpack = data.rp;
							$(".red").css("top",(($(".back").height() - ($(window).width() * 0.86)) * 0.5) + "px").removeClass('none').on("click", function () {
								$(".red").addClass('none');
								var me = H.dialog.lottery;
								me.$dialog.find(".lottery-dialog").addClass("award-bg");
								me.$dialog.find('.awardwin-tips').html(data.tt || '');
								me.$dialog.find('img').attr('src', (data.pi || ''));
								me.$dialog.find('.q-name').addClass("none");
								me.$dialog.find('.q-mobile').addClass("none");
								me.$dialog.find('.q-address').addClass("none");
								me.$dialog.find('.award-tip').addClass("none");
								me.$dialog.addClass(me.LOTTERIED_CLS);
								me.$dialog.find('.award-win').removeClass('none');
								me.$dialog.find('.contact').removeClass('redbag');
								me.$dialog.find('.btn').css({"background":"url(./images/award-btn.png) 0 0 no-repeat","background-size":"100%"});
								me.$dialog.find('.btn-share').css({"background":"url(./images/try.png) 0 0 no-repeat","background-size":"100%"});
								$(".award-win").css("margin","15% auto");
								$(".award-img").css("margin","40% auto 3%");
								if(($(window).height()<520)){
									$(".award-img").css("margin","36% auto 3%");
								}
								if($(window).height()<440){
									$(".award-img").css("margin","26% auto 3%");
								}
								$(".award-bg").css({"background": "url(./images/award-bg.png) no-repeat 100% 100%!important","background-size": "100% 100% !important"})
								//var winH = $(window).height();
								//document.getElementById('aw').onload = function () {
								//	inheight = ($(".contact").height() + $(".award-img").height() + 100) + (winH * 0.1);
								//	if(inheight >= winH){
								//		//$(".award-img img").css("height","60px");
								//		//inheight = ($(".contact").height() + 95) + (winH * 0.12);
								//	}
                                //
								//	$(".lottery-dialog").css({
								//		'height': inheight+"px",
								//		'top': ((winH - inheight) * 0.35)+"px"
								//	});
								//};
							})
						} else {
							this.$dialog.find('.award-win').addClass('none');
							this.$dialog.addClass(this.LOTTERY_NONE_CLS);
						}
					} else {
						this.$dialog.find('.award-win').addClass('none');
						this.$dialog.addClass(this.LOTTERY_NONE_CLS);
					}
				} else {
					this.$dialog.find('.award-win').addClass('none');
					this.$dialog.addClass(this.LOTTERY_NONE_CLS);
				}
				this.$dialog.removeClass(this.REQUEST_CLS);
			},
			check: function() {
				if(H.dialog.lottery.pt == 4 || H.dialog.lottery.pt == 9){

				}else{
					var $mobile = $('.mobile'),
						mobile = $.trim($mobile.val()),
						$address = $('.address'),
						address = $.trim($address.val()),
						$name = $('.name'),
						name = $.trim($name.val());
					if (name.length > 20 || name.length == 0) {
						showTips('请输入您的姓名，不要超过20字哦!');
						return false;
					}else if (!/^\d{11}$/.test(mobile)) {
						showTips('这手机号，可打不通...');
						return false;
					}
					//else if(address.length < 5 || address.length > 30){
					//	showTips('请填写正确的地址');
					//	return false;
					//}
				}
				return true;
			},
			
			enable: function() {
				this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
			},
			disable: function() {
				this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
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
                showTips('领取成功');
				if(H.dialog.lottery.pt == 4){
					H.dialog.lottery.$dialog.find('.btn-close').trigger('click');
					H.dialog.lottery.reset();
					$('.modal').addClass('none');
				}else{
					var me = this, $qmobile = $('.dialog').find('.mobile'),
						qmobile = $qmobile.val(),
						$name = $('.dialog').find('.name'),
						qname = $name.val(),
						$address = $('.dialog').find('.address'),
						qaddress = $address.val();
					$qmobile.attr("disabled","disabled");
					$name.attr("disabled","disabled");
					$address.attr("disabled","disabled");
					this.$dialog.addClass(this.AWARDED_CLS);
					var qname = $('.name').val(),
						qmobile = $('.mobile').val(),
						qaddress = $('.address').val();
					$('.name').val(qname);
					$('.mobile').val(qmobile);
					$('.address').val(qaddress);
				}
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
					._('<div class="black"></div>>')

					// ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-yunnan-tianxia-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					._('<div class="dialog lottery-dialog">')
					._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="back">')
					._('<img class="red none" src="images/red-bg.png" />')

					._('<div class="award-win none">')
										._('<h5 class="awardwin-tips none"></h5>')
										._('<div class="award-img">')
										._('<img id="aw" src="" />')
										._('</div>')
										._('<div class="contact">')
											._('<h4 class="award-tip">请将本页面截图，使用方法参照活动规则</h4>')
											._('<h4 class="awarded-tip">以下是您的联系方式</h4>')
											._('<p class="q-name">姓名：<input type="text" class="name" placeholder="" /></p>')
											._('<p class="q-mobile">电话：<input type="tel" class="mobile" placeholder="" /></p>')
											._('<p class="q-address">地址：<input type="text" class="address" placeholder="" /></p>')
											._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮"></a>')
											._('<a href="#" class="btn btn-red" data-collect="true" data-collect-flag="lotterydialog-redbtn" data-collect-desc="抽奖弹层-领取现金按钮">领取</a>')
											._('<div class="share"><a href="#" class="btn btn-share"></a></div>')
										._('</div>')
									._('</div>')
									._('<div class="award-none none">')
										._('<img id="imgnone" src="./images/lottery-none.jpg">')
										._('<a href="#" class="outer" data-collect="true" data-collect-flag="tttj" data-collect-desc="天天淘金"></a>')
										._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="lotterydialog-backbtn" data-collect-desc="抽奖弹层-返回按钮"></a>')
									._('</div>')
								._('</div>')
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');

				return t.toString();
			}
		},
		success: {
			$dialog: null,
			open: function() {
				var me = this, $dialog = this.$dialog,
					winH = $(window).height(),
					winW = $(window).width();
				H.dialog.open.call(this);
				this.event();
				this.$dialog.find('.qrbox').css({
					'width': winW,
					'height': winH
				});
				this.$dialog.removeClass('qr');
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
				// this.$dialog && this.$dialog.remove();
				// this.$dialog = null;
			},
			event: function() {
				var me = this,
				$success = this.$dialog.find('.success');
				$successClose = this.$dialog.find('.btn-close');
				if (H.dialog.successFlag) {
					H.dialog.successFlag = false;
					$success.click(function(e) {
						e.preventDefault();
						me.$dialog.addClass('qr');
					});
					$successClose.click(function(e) {
						me.close();
					});
				} else {
					return;
				}
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="success-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="successdialog-closebtn" data-collect-desc="领奖成功弹层-关闭按钮"></a>')
					._('<div class="success" data-collect="true" data-collect-flag="successdialog-clickbtn" data-collect-desc="领奖成功弹层-点击按钮"><div class="success-round"></div><p>领取成功</p><i>关注微店公众号</i></div>')
					._('<div class="qrbox"><img src="./images/qrcode.png" border="0"></div>')
				._('</section>');
				return t.toString();
			}
		}
	};
	
	// 抽奖
	//W.callbackLotteryLuckHandler = function(data) {
	//	H.dialog.lottery.open(data);
	//};
	
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};
	
	W.callbackLotteryAwardHandler = function(data) {
		if (data.result) {
			H.dialog.lottery.succ();
			H.dialog.lottery.reset();
			H.yao.isCanShake = true;
			return;
		} else {
			showTips('亲，服务君繁忙！稍后再试哦！');
		}
	};
	
	W.callbackIntegralRankSelfRoundHandler = function(data) {
		if (data.result) {
			H.dialog.rank.selfupdate(data);
		};
	};
	
	W.callbackIntegralRankTop10RoundHandler = function(data) {
		if (data.result) {
			H.dialog.rank.update(data);
		};
	};
	//天天淘金的广告链接
	W.commonApiPromotionHandler = function(data){
		if(data.code == 0){
			jumpUrl = data.url;
			Desc = (data.desc).toString();
			$(".outer").attr("href",jumpUrl).html(Desc).removeClass("none");
		}else{
			$(".outer").addClass("none");
		}
	};
})(Zepto);

//查询主活动接口 
function fashionIndexNewHandler(data){
	if(data.code == 0){
		acttUID = data.tl[0].actUid;
		actTtle = data.tl[0].actTle;
	}
}

//需要取得的两条数据
var acttUID,actTtle="";

$(function() {
	H.dialog.init();
});