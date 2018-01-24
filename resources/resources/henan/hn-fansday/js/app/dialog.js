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
            this.$dialog.find('.dialog').addClass('dispshow');
            setTimeout(function(){
            	me.$dialog.find('.dialog').removeClass('dispshow');
            }, 1000);
        },
        relocate : function(){
        	var height = $(window).height(),
        		width = $(window).width(),
        		top = $(window).scrollTop();
            $(".lott").css({
                    'width': width * 0.80, 
                    'height': height * 0.86,
                    'left': width * 0.1,
                    'right': width * 0.1,
                    'top': height * 0.07,
                    'bottom': height * 0.07
            });
            $(".rule-dialog .content").css({
                    'height': height*0.5-46, 
            });
        },
       	// 规则
		rule: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();
				
			},
			close: function () {
				var me = this;
				me.$dialog.find('.rule-dialog').addClass('disphide');
				setTimeout(function(){
					$(".modal-rul").addClass("none");
					$('.rule-dialog').removeClass('disphide');
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
						._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="tv-henantv-fans-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2><img src="images/rule-title.png"></h2>')
						._('<div class="content">')
							 ._('<div class="rule-con"></div>')
						._('</div>')
					._('</div>')
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
			rp:null,
			open: function(resultUuid) {
				var me =this,$dialog = this.tpl();
				H.dialog.open.call(this);
				this.event();
				H.lottery.canJump = false;
			},
			close: function() {
				var me = this;
				me.$dialog.find('.lottery-dialog').addClass('disphide');
				setTimeout(function(){
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
					H.lottery.canJump = true;
					if(H.lottery.type == 2){
						H.lottery.isCanShake = true;
					}else{
						H.lottery.isCanShake = false;
						
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
					if($(this).hasClass("request")){
						return;
					}
					$(this).addClass("request");
                    if(me.pt == 7){
						shownewLoading();
						me.sto = setTimeout(function(){
							hidenewLoading();
						},15000);
						me.close();
                      	setTimeout(function(){
                            me.wx_card();
                        },1000);
                     }else if(me.pt == 9){
						shownewLoading(null,"请稍候...");
						me.close();
                        getResult('api/lottery/award', {
                           	oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                        window.location.href = $(this).attr("data-href") ;                  
                    }

				});
				this.$dialog.find("#getRed").click(function(e){
					e.preventDefault();
					if($(this).hasClass("requesting")){
						return;
					}
					$(this).addClass("requesting");
					shownewLoading();
					$(this).text("领取中");
					setTimeout(function(){
						location.href = H.dialog.lottery.rp;
					},500);
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
		           	if ($('#address').val().length < 5 || $('#address').val().length > 60) {
		                showTips("地址长度应在5到60个字！");
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
					$('#yaoBtnGoodOK').removeClass("requesting");
					$('#yaoBtnGoodOK').addClass('none');
					$('#yaoBtnGoodBack').removeClass('none');
					$(".all-goods").find(".p-name").html("姓名："+name);
					$(".all-goods").find(".p-phone").html("电话："+mobile);
					$(".all-goods").find(".p-address").html("地址："+address);
					$('.award-tip').addClass('none');
					$(".awarded-tip").removeClass("none");
					showTips("信息提交成功");
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
						  //中奖
						._('<div class="lott none" id="lott">')
							._('<div class="lott-box">')
								._('<img class="red-logo none" src="./images/spon-logo.png">')
								._('<a class="lottery-close" data-collect="true" data-collect-flag="tv-henantv-fans-lottery-close-btn" data-collect-desc="中奖页面关闭按钮"></a>')
								._('<img class="congrate" src="./images/congrate.png">')
								._('<P class="tt"></P>')
								._('<div class="all-goods none">')
								    ._('<div class="gift-text">')
									    ._('<div class="gift"><img src="" /></div>')
										._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
										._('<h4 class="awarded-tip none">以下是您的联系方式</h4>')
										._('<p class="p-name"><label>姓名</label><input type="text" class="name" id="name"/></p>')
										._('<p class="p-phone"><label>电话</label><input type="number" class="phone" id="phone" /></p>')
										._('<p class="p-address"><label>地址</label><input type="text" class="address" id="address" /></p>')
										 ._('<a class="good-btn good-btn-ok" id="yaoBtnGoodOK"  data-collect="true" data-collect-flag="tv-henantv-fans-good-ok" data-collect-desc="摇奖页-实物奖提交按钮">领&nbsp&nbsp取<a/>')
										 ._('<a class="good-btn good-btn-back none" id="yaoBtnGoodBack" data-collect="true" data-collect-flag="tv-henantv-fans-good-back" data-collect-desc="摇奖页-继续摇奖按钮">继续摇奖<a/>')
								 	._('</div>')
								._('</div>')
								._('<div class="quan none">')
								    ._('<div class="gift-text">')
									    ._('<div class="gift"><img src="images/blank.png" /></div>')
									    ._('<div class="btn-style">')
											._('<div class="btn-box">')
												._('<a class="good-btn good-btn-ok" id="yaoBtnQuanOK"  data-collect="true" data-collect-flag="tv-henantv-fans-quan-ok" data-collect-desc="摇奖页-卡券领取按钮">领&nbsp&nbsp取<a/>')
										 	._('</div>')
										._('</div>')
								 	._('</div>')
								._('</div>')
								._('<div class="red-bao none">')
								    ._('<div class="gift-text">')
									    ._('<div class="gift"><img src="images/blank.png" /></div>')
										 ._('<a class="good-btn good-btn-ok" id="getRed"  data-collect="true" data-collect-flag="tv-henantv-fans-redbao-ok" data-collect-desc="摇奖页-红包领取按钮">领&nbsp&nbsp取<a/>')
								 	._('</div>')
								._('</div>')
						._('</div>')
					  ._('</div>')
					._('</div>');
				return t.toString();
			},
			//摇一摇抽奖
			update: function(data) {
	            //接口回调成功且中奖
	            var me = this;
					this.$dialog.find("#lott").removeClass("none");
					me.pt = data.pt;
					this.$dialog.find(".tt").text(data.tt);
					 if(data.pt == 1){//积分奖品和实物奖品
						$(".all-goods .gift").find("img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
						$(".all-goods").find('#name').val(data.rn || '');
						$(".all-goods").find('#phone').val(data.ph || '');
						$(".all-goods").find('#address').val(data.ad || '');
                    	$(".all-goods").find("#yaoBtnGoodBack").addClass("none");
                    	$(".all-goods").find("#yaoBtnGoodOK").removeClass("none");
                    	$(".all-goods").find("input").removeAttr("disabled");
                    	$(".all-goods").removeClass("none");
                    	$("#lott").removeClass("none");
					}else if(data.pt == 9||data.pt == 7){//外链奖品
						 var height = $(window).height(),
							 width = $(window).width(),
							 top = $(window).scrollTop();
						 $(".lott").css({
							 'width': width * 0.80+'px!important',
							 'height': height * 0.66+'px!important',
							 'left': width * 0.1+'px!important',
							 'right': width * 0.1+'px!important',
							 'top': height * 0.17+'px!important',
							 'bottom': height * 0.17+'px!important'
						 });
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
						 var height = $(window).height(),
							 width = $(window).width(),
							 top = $(window).scrollTop();
						 $(".lott").css({
							 'width': width * 0.80+'px!important',
							 'height': height * 0.7+'px!important',
							 'left': width * 0.1+'px!important',
							 'right': width * 0.1+'px!important',
							 'top': height * 0.15+'px!important',
							 'bottom': height * 0.15+'px!important',
							 'padding-top':'44%'
						 });
						 $(".tt").addClass("none")
						 $(".red-logo").removeClass("none");
						$(".red-bao").find(".gift img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
						 H.dialog.lottery.rp = data.rp;
						$("#lott").find(".red-bao").removeClass("none");
						$(".dialog").removeClass("none");
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
                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        recordUserOperate(openid, res.errMsg, "yunnan-solid-card-fail");
                        hidenewLoading();
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
						hidenewLoading();
                       if(H.lottery.type == 2){
							H.lottery.isCanShake = true;
						}else{
							H.lottery.isCanShake = false;
						}
                    },
                    cancel:function(){
						hidenewLoading();
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
})(Zepto);

$(function() {
    H.dialog.init();
});
