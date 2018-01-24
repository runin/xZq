H.openjs = {
	localId: "",
	serverId: "",
	init: function() {
		window.callbackJsapiTicketHandler = function(data) {};
		$.ajax({
			type: 'GET',
			url: domain_url + 'mp/jsapiticket',
			data: {
				appId: shaketv_appid
			},
			async: true,
			dataType: 'jsonp',
			jsonpCallback: 'callbackJsapiTicketHandler',
			success: function(data){
				if (data.code !== 0) {
					return;
				}
				var nonceStr = 'da7d7ce1f499c4795d7181ff5d045760',
					timestamp = Math.round(new Date().getTime()/1000),
					url = window.location.href.split('#')[0],
					signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
					
				wx.config({
					debug: false,
					appId: shaketv_appid,
					timestamp: timestamp,
					nonceStr: nonceStr,
					signature: signature,
					jsApiList: [
						'addCard'
					]
				});
			},
			error: function(xhr, type){
				 alert('获取微信授权失败！');
			}
		});
	}     
};
H.openjs.init();

(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        redpack : '',
        iscroll: null,
        isJump :true, 
        outurl :null,
        resultUuid : null,
        init: function() {
            var me = this;
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
            $(".rule-dialog .content").css({
                    'height': height*0.7-140,
            });
        },
       	// 规则
		rule: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				hidenewLoading();
				this.event();
				
			},
			close: function () {
				var me = this;
				me.$dialog.find('.rule-dialog').addClass('bounceOutDown');
				setTimeout(function(){
					$(".modal-rul").addClass("none");
					$('.rule-dialog').removeClass('bounceOutDown');
					$("#btn-rule").removeClass('requesting');
					if(H.lottery.endType == 2){
						H.lottery.isCanRoll = true;
					}else{
						H.lottery.isCanRoll= false;
					}
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
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
				t._('<section class="modal modal-rul" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
					._('<div class="rule-box">')
						._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="tv-dongnan-haixianews-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2>活动规则</h2>')
						._('<div class="content">')
							 ._('<div class="rule-con"></div>')
						._('</div>')
					._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		erweima: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				var me = this;
			},
			event: function() {
				var me = this;
				this.$dialog.find('.close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			close: function() {
				var me = this;
				me.$dialog.find('.erweima-dialog').addClass('bounceOutDown');
				setTimeout(function(){
					$(".modal-erweima").addClass("none");
					$('.erweima-dialog').removeClass('bounceOutDown');
					$("#btn-er").removeClass('requesting');
            	}, 1000);
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-erweima" id="erweima-dialog">')
					._('<div class="dialog erweima-dialog">')
					    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="tv-dongnan-haixianews-haibo-dialog-closebtn" data-collect-desc="规则弹层-海波视频关闭按钮"></a>')
						._('<div>更多精彩节目尽在海博视频</div>')
						._('<div>长按扫码即可下载</div>')
						._('<div class="erweima-box"><img src="images/erweima.png"/></div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
        lottery: {
			$dialog: null,
            url:null,
            ci:null,
            ts:null,
            si:null,
            pt:null,
            sto:null,
            name:null,
            mobile:null,
			number:null,
			open: function(data) {
				var me =this,$dialog = this.tpl();
				H.dialog.open.call(this);
				 $("#btn-wheel").rotate({
	                angle : 0,
	                animateTo : 0
            	});
            	H.dialog.lottery.update(data);
				this.event();
			},
			close: function() {
				var me = this;
				me.$dialog.find('.lottery-dialog').addClass('bounceOutDown');
				setTimeout(function(){
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
					if(H.lottery.endType == 2){
						H.lottery.isCanRoll = true;
					}else{
						H.lottery.isCanRoll= false;
					}
            	}, 1000);
            	
			},
			event: function() {
				var me = this;
				this.$dialog.find('#openRed').click(function(e) {
					   e.preventDefault();
	                   $(this).addClass("none");
	                   $(".award-title").addClass("none");
	                   $("#getRed").removeClass("none");
	                   $(".award-info").removeClass("none");
	            });
	            this.$dialog.find('.erweima-close').click(function(e) {
					   e.preventDefault();
	                   $(".erweima-dialog").addClass("none");
	            });
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.close();
					$("#openRed").removeClass("none");
					$(".award-title").removeClass("none");
					$("#getRed").addClass("none");
					$(".award-info").addClass("none");
					//如果没有在倒计时且没有结束
					
					return;
				});
				
				this.$dialog.find('.back-index').click(function(e) {
					e.preventDefault();
					//如果没有在倒计时且没有结束
					me.close();
					
				});

				this.$dialog.find('.good-btn-back').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#yaoBtnQuanOK').click(function(e) {
					e.preventDefault();
					if($(this).hasClass("requesting")){
						return;
					}
					$(this).addClass("requesting");
                    shownewLoading();
					 me.sto = setTimeout(function(){
                         shownewLoading();
                    },15000);
                    me.close();
                    if(me.pt == 7){
                        H.lottery.wxCheck = false;
                      	setTimeout(function(){
                            me.wx_card();
                        },1000);
                     }else if(me.pt == 9){
                        getResult('api/lottery/award', {
                           	oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                        shownewLoading();
                        setTimeout(function(){
                        	hideNewLoading();
                        },1500)
                        window.location.href = $(this).attr("data-href");  
                    }

				});
				this.$dialog.find('#yaoBtnGoodOK').click(function(e) {
					e.preventDefault();
					if($(this).hasClass("requesting")){
						return;
					}
					$(this).addClass("requesting");
					if ($('#name').val().trim() == "") {
	               		showTips("请填写姓名！");
	               		$(this).removeClass("requesting");
	                	return false;
		            };
		            if ($('#phone').val().trim() == "") {
		               showTips("请填写手机号码！");
		               $(this).removeClass("requesting");
		                return false;
		            };
		            if (!/^\d{11}$/.test($('#phone').val())) {
		                showTips("这手机号，可打不通...");
		                $(this).removeClass("requesting");
		                return false;
		            };
	                var name = $.trim($('#name').val()),
	                	mobile = $.trim($('#phone').val()),
						address = $.trim($('#address').val());
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile,
						ad: encodeURIComponent(address)
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
					if(H.dialog.lottery.number != null) {
						$(".p-number").removeClass("none").html(me.number+"<em>(注：请截图保存兑换码)</em>");
					}
					$('#yaoBtnGoodOK').removeClass("requesting");
					$('#yaoBtnGoodOK').addClass('none');
					$('#yaoBtnGoodBack').removeClass('none');
					$(".all-goods").find(".p-name").html("姓名："+name);
					$(".all-goods").find(".p-phone").html("电话："+mobile);
					$(".all-goods").find(".p-address").html("地址："+address);
					$('.award-tip').addClass('none');
					$(".awarded-tip").removeClass("none");
					showTips("信息提交成功");
					$(".erweima-dialog").removeClass("none");
				});
			},
			tpl: function() {
				var t = simpleTpl();
				
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
						  //中奖
						._('<div class="lott none" id="lott">')
							._('<div class="lott-box">')
								._('<a class="lottery-close" data-collect="true" data-collect-flag="tv-dongnan-haixianews-lottery-close-btn" data-collect-desc="中奖页面关闭按钮"></a>')
								
								._('<div class="all-goods none">')//实物
								    ._('<div class="gift-text">')
								    	._('<h1 class="congra">恭喜您中奖了</h1>')
									    ._('<div class="gift"><img src="" /></div>')
										._('<p class="p-number none"></p>')
										._('<p class="p-name"><label>姓名</label><input type="text" class="name" id="name"/></p>')
										._('<p class="p-phone"><label>电话</label><input type="number" class="phone" id="phone" /></p>')
										._('<p class="p-address"><label>地址</label><input type="text" class="address" id="address" /></p>')
										._('<a class="good-btn good-btn-ok" id="yaoBtnGoodOK"  data-collect="true" data-collect-flag="tv-dongnan-haixianews-good-ok" data-collect-desc="摇奖页-实物奖提交按钮">领&nbsp&nbsp取<a/>')
										._('<a class="good-btn good-btn-back none" id="yaoBtnGoodBack" data-collect="true" data-collect-flag="tv-dongnan-haixianews-good-back" data-collect-desc="摇奖页-实物奖确认按钮">返&nbsp&nbsp回<a/>')
								 	._('</div>')
								._('</div>')
								
								._('<div class="quan none">')//卡劵
								    ._('<div class="gift-text">')
									    ._('<h1 class="tip"></h1>')
									    ._('<div class="gift"><img src="images/blank.png" /></div>')
									    ._('<div class="btn-style">')
											._('<div class="btn-box">')
												._('<a class="good-btn good-btn-ok" id="yaoBtnQuanOK"  data-collect="true" data-collect-flag="tv-dongnan-haixianews-quan-ok" data-collect-desc="摇奖页-卡券及外链领取按钮">领&nbsp&nbsp取<a/>')
										 	._('</div>')
										._('</div>')
								 	._('</div>')
								._('</div>')
								
								._('<div class="red-bao none">')//红包
								    ._('<div class="gift-text">')
									    ._('<h1 class="tip"></h1>')
									    ._('<div class="gift"><img src="images/blank.png" /></div>')
										 ._('<a class="good-btn good-btn-ok" id="getRed"  data-collect="true" data-collect-flag="tv-dongnan-haixianews-redbao-ok" data-collect-desc="摇奖页-红包领取按钮">领&nbsp&nbsp取<a/>')
								 	._('</div>')
								._('</div>')
							._('</div>')
						._('</div>')
						
						._('<div class="not-lott none" id="not-lott">')//没中奖
							._('<a class="lottery-close" data-collect="true" data-collect-flag="tv-dongnan-haixianews-lottery-close-btn" data-collect-desc="未中奖页面关闭按钮"></a>')
							._('<img class="title" src="images/notLott-title.png" />')
							._('<img class="sad" src="images/sad.png" />')
						._('</div>')
					  ._('</div>')
					._('</div>');
				return t.toString();
			},
			//摇一摇抽奖
			update: function(data) {
	            //接口回调成功且中奖
	            var me = this;
	            if(data&&data.result&&data.pt!=0){//谢谢参与
					this.$dialog.find("#not-lott").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
					me.pt = data.pt;
					
					 if(data.pt == 2||data.pt == 1||data.pt == 5){//积分奖品、实物奖品、兑换码奖品
					    if(data.pt == 5) { //兑换码
						    me.number = data.cc;
						}
						
						$(".all-goods .gift").find("img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
						$(".all-goods").find('#name').val(data.rn || '');
						$(".all-goods").find('#phone').val(data.ph || '');
						$(".all-goods").find('#address').val(data.ad || '');
						$(".erweima").attr("src",data.qc);
                    	$(".all-goods").find("#yaoBtnGoodBack").addClass("none");
                    	$(".all-goods").find("#yaoBtnGoodOK").removeClass("none");
                    	$(".all-goods").find("input").removeAttr("disabled");
                    	$(".all-goods").removeClass("none");
                    	$("#lott").removeClass("none");
						
					}else if(data.pt == 9||data.pt == 7){//卡劵及外链奖品
						if(data.pt === 7){
   							me.ci = data.ci;
			                me.ts = data.ts;
			                me.si = data.si;
   						}
   						if(data.pt === 9){
   							this.$dialog.find('#yaoBtnQuanOK').attr('data-href',data.ru);
   						}
						$(".quan").find(".tip").html(data.tt);
						$(".quan").find(".gift img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    	$(".quan").removeClass("none");
                    	$(".dialog").removeClass("none");
						
					}else if(data.pt == 4){//现金红包
						$(".red-bao").find(".gift img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
						$(".red-bao").find("#getRed").attr("href",data.rp);
						$("#lott").find(".red-bao").removeClass("none");
						$(".lottery-close").addClass("none");
						$(".dialog").removeClass("none");
						
					}
					
	            }else{
	            	this.$dialog.find("#not-lott").removeClass("none");
					this.$dialog.find("#lott").addClass("none");
	            }
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
                        H.lottery.wxCheck = true;
                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        recordUserOperate(openid, res.errMsg, "yunnan-solid-card-fail");
                        hideLoading();
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        hideLoading();
                       if(H.lottery.type == 2){
							H.lottery.isCanShake = true;
						}else{
							H.lottery.isCanShake = false;
						}
                    },
                    cancel:function(){
                        hideLoading();
						if(H.lottery.type == 2){
							H.lottery.isCanShake = true;
						}else{
							H.lottery.isCanShake = false;
						}
                    }
                });
            }

		}

    };
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};
	W.callbackLotteryAwardHandler = function(data) {
	
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
})(Zepto);

$(function() {
    H.dialog.init();
});
