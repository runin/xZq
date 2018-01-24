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
            $(".lott").css({
                    'width': width * 0.9, 
                    'height': height * 0.80, 
                    'left': width * 0.05,
                    'right': width * 0.05,
                    'top': height * 0.08,
                    'bottom': height * 0.12
            });
            $(".rule-dialog").css({
                    'width': width * 0.9, 
                    'height': height * 0.7, 
                    'left': width * 0.05,
                    'right': width * 0.05,
                    'top': height * 0.15,
                    'bottom': height * 0.15
            });
         
            $(".rule-dialog .content").css({
                    'height': height*0.7-80, 
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
				me.$dialog.find('.rule-dialog').addClass('bounceOutDown');
				setTimeout(function(){
					$(".modal-rul").addClass("none");
					me.$dialog.find('.rule-dialog').removeClass('bounceOutDown');
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
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
				var t = simpleTpl();
				t._('<section class="modal modal-rul" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
					._('<div class="rule-box">')
						._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="sy-xiaoxia-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
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
        lottery: {
			$dialog: null,
			open: function(resultUuid) {
				var me =this,$dialog = this.tpl();
				H.dialog.open.call(this);
				this.event();
			},
			close: function() {
				var me = this;
				me.$dialog.find('.lottery-dialog').addClass('bounceOutDown');
				setTimeout(function(){
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
					if(H.lottery.type == 2){
						H.lottery.isCanShake = true;
					}else{
						H.lottery.isCanShake = false;
					}
					console.log(H.lottery.isCanShake);
            	}, 1000);
            	
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.close();
					return;
				});

				this.$dialog.find('.good-btn-back').click(function(e) {
					e.preventDefault();
					me.close();
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
	                	mobile = $.trim($('#phone').val());
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
					$('#yaoBtnGoodOK').removeClass("requesting");
					$('#yaoBtnGoodOK').addClass('none');
					$('#yaoBtnGoodBack').removeClass('none');
					$(".all-goods").find("#name").val(name);
					$(".all-goods").find("#phone").val("").attr("placeholder",mobile);
					$(".all-goods").find("input").attr("disabled","disabled");
					$('.award-tip').addClass('none');
					$(".awarded-tip").removeClass("none");
					showTips("信息提交成功");
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
						._('<div class="lott none" id="lott">')
							._('<a class="lottery-close" data-collect="true" data-collect-flag="sy-xiaoxia-lottery-close-btn" data-collect-desc="中奖页面关闭按钮"></a>')
							._('<div class="all-goods">')
								._('<div class="gift"><img src="" /></div>')
								._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
								._('<h4 class="awarded-tip none">以下是您的联系方式</h4>')
								._('<input type="text" class="name" id="name" placeholder="姓名" />')
								._('<input type="number" class="phone" id="phone" placeholder="手机号码" />')
								._('<a class="good-btn good-btn-ok" id="yaoBtnGoodOK"  data-collect="true" data-collect-flag="sy-xiaoxia-good-ok" data-collect-desc="摇奖页-实物奖提交按钮">立即领取</a>')
								._('<a class="good-btn good-btn-back none" id="yaoBtnGoodBack" data-collect="true" data-collect-flag="sy-xiaoxia-good-back" data-collect-desc="摇奖页-实物奖确认按钮">返&nbsp&nbsp回</a>')
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
					
					 if(data.pt == 1){//实物奖品
						$(".all-goods .gift").find("img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
						$(".all-goods").find('#name').val(data.rn || '');
						$(".all-goods").find('#phone').val(data.ph || '');
                    	$(".all-goods").find("#yaoBtnGoodBack").addClass("none");
                    	$(".all-goods").find("#yaoBtnGoodOK").removeClass("none");
                    	$(".all-goods").find("input").removeAttr("disabled");
                    	$(".all-goods").removeClass("none");
                    	$("#lott").removeClass("none");
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
    W.callbackLinesDiySaveHandler = function(data) {
		if (data.code == 0) {
            var ruid = data.ruid;
            $("#btn-send").addClass("none");
            $("#btn-close").removeClass("none");
            $("#send-tips").html("想送给谁？右上角单击试试。");
            var text = sharetext[getRandomArbitrary(0,sharetext.length)];
            window['shaketv'] && shaketv.wxShare(share_img, text[0], text[1], getnewUrl(openid,ruid));
		}else{
            if(data.message.length > 0){
                showtip(data.message,4);
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
