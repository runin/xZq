(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        redpack : '',
        iscroll: null,
        isJump :true,  
        pt:"",
        init: function() {
            var me = this;
            this.$container.delegate('.btn-close', 'click', function(e) {
                e.preventDefault();
                me.close();
            })
        },
        close: function() {
            $('.modal').addClass('none');
        },
        open: function() {
        	H.lottery.istrue = false;
            if (this.$dialog) {
                this.$dialog.removeClass('none');
            } else {
                this.$dialog = $(this.tpl());
                H.dialog.$container.append(this.$dialog);
            }
            H.dialog.relocate();
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
            $(".rule-dialog .content").css({
                    'height': $(".rule-dialog").height() - 80, 
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
			},
			update: function (rule) {
				this.$dialog.find('.rule-con').html(rule).closest('.content').removeClass('none');
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-rul" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
					    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="cctv7-food-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2>活动规则</h2>')
						._('<div class="content">')
							 ._('<div class="rule-con"></div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
        lottery: {
			$dialog: null,
			open: function() {
				H.lottery.isCanShake = false;
				H.lottery.isCanJump = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
				   this.event();
				}
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
				H.lottery.isCanShake = true;
				H.lottery.istrue = true;
				H.lottery.isCanJump = true;
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-award').click(function(e) {
					e.preventDefault();
					if($(this).hasClass("awarded")){
						me.close();
						return;
					}
					if(H.dialog.pt == 9){
						toUrl($(this).attr("data-href"));
					}else if(H.dialog.pt == 5){
						var $mobile = $('.phone'),
							mobile = $.trim($mobile.val()),
							$name = $('.name'),
							name = $.trim($name.val());
						if (name.length > 20 || name.length == 0) {
							showTips('请填写您的姓名，以便顺利领奖！');
							return false;
						}else if (!/^\d{11}$/.test(mobile)) {
							showTips('请填写正确手机号，以便顺利领奖！');
							return false;
						}
						getResult('api/lottery/award', {
							nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
							hi: headimgurl ? headimgurl : "",
							oi: openid,
							rn:encodeURIComponent(name) ,
							ph: mobile 
						}, 'callbackLotteryAwardHandler');
					}
					
				});
			},
	
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog">')
						//中奖
						._('<div class="lott none" id="lott">')
							._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="cctv7-food-lott-dialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
							._('<h1>运气不错哦</h1>')
							._('<p class="ltp"></p>')		
							._('<span class="award-img">')
							    ._('<img src=""/>')
							._('</span>')
							._('<div class="contact none">')
								._('<span class="code"></span>')
								._('<p class="tip">请填写您的联系方式</p>')
								._('<input class="name" type="text" placeholder="姓名">')
								._('<input class="phone" type="tel" placeholder="手机号码">')
							._('</div>')
							._('<a class="btn-award" id="btn-award" data-collect="true" data-collect-flag="cctv7-food-combtn" data-collect-desc="食尚大转盘抽奖弹层-确定按钮">领&nbsp&nbsp&nbsp取</a>')	
						._('</div>')
					  ._('</div>')
					._('</div>');
				return t.toString();
			},
			update: function(data) {
				H.dialog .pt = data.pt
				if(data.pt == 9 ){
					$("#lott").addClass("outerQuan");
					$("#lott").find(".award-img img").attr("src",data.pi);
					$("#lott").find(".ltp").html(data.tt).removeClass("none");
					$("#lott").find(".contact").addClass("none");
					$("#lott").find("#btn-award").attr("data-href",data.ru);
					this.$dialog.find("#lott").removeClass("none");
				}else if(data.pt == 5) {
					$("#lott").removeClass("outerQuan");
					$("#lott").find(".award-img img").attr("src",data.pi);
					$("#lott").find(".name").val(data.rn || '');
					$("#lott").find('.phone').val(data.ph || '');
					$("#lott").find(".ltp").addClass("none");
					$("#lott").find(".code").html("兑换码："+data.cc);
					$("#lott").find("#btn-award").attr("data-href",data.ru);
					$("#lott").find(".contact").removeClass("none");
					this.$dialog.find("#lott").removeClass("none");
				}
			}
		},

    };
    
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};
	W.callbackLotteryAwardHandler = function(data) {
		if (data&&data.result) {
			showTips("信息提交成功");
			$(".contact").find("input").attr("disabled","disabled");
			$('#btn-award').html('确认').addClass("awarded");
			$(".tip").html("以下是您的联系方式")
			return;
		}else{
			showTips("信息未提交成功");
			$('.loader').addClass('none');
			$('#btn-award').removeClass('none');
		}
	}
    
})(Zepto);

$(function() {
    H.dialog.init();
});
