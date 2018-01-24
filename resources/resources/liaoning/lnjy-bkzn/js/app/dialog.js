(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        redpack : '',
        iscroll: null,
        isJump :true,
        pt: null,
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
            $('.modal, .dialog').each(function() {
                $(this).css({ 
                    'width': width, 
                    'height': height, 
                    'left': 0,
                    'top': 0
                });
            });
        },
		guide: {
			$dialog: null,
			open: function () {
				var me = this;
				H.dialog.open.call(this);
				this.event();
				setTimeout(function() {
					me.close();
				}, 8000);
			},
			close: function () {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function () {
				var me = this;
				$('#guide-dialog').click(function (e) {
					e.preventDefault();
					me.close();
				});
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
				._('</section>');
				return t.toString();
			}
		},
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				var winW = $(window).width(),
					winH = $(window).height();
				var ruleW = Math.round(winW * 0.94);
				var ruleH = Math.round(ruleW * 789 / 598);
				var ruleT = Math.round((winH - ruleH) / 2);
				$('#rule-dialog .dialog').css({
					'width': ruleW,
					'height': ruleH,
					'left': Math.round((winW - ruleW) / 2),
					'top': ruleT
				});
				$('body').addClass('noscroll');
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
				$('body').removeClass('noscroll');
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.back').click(function(e) {
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
						._('<div class="rule-box">')
							._('<div class="rule-con"></div>')
							._('<a class="back"><img src="./images/back-coffee.png"></a>')
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
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
				   this.event();
				};
				$('#lott').removeClass('success');
				$('.lott .win-info').removeClass('none');
				$('.lott input').removeClass('none');
				$('#btn-award').removeClass('none');
				$('#btn-back').addClass('none');
				$('.lott .win-care').addClass('none');
				$('label.input-name span').text('');
				$('label.input-phone span').text('');
				$('label.input-address span').text('');
			},
			close: function() {
				H.lottery.isCanShake = true;
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-award').click(function(e) {
					e.preventDefault();
					if ($('#textname').val().trim() == "") {
	               		showTips("请填写姓名！");
	                	return false;
		            };
		            if ($('#textphone').val().trim() == "") {
		               showTips("请填写手机号码！");
		                return false;
		            };
		            if (!/^\d{11}$/.test($('#textphone').val())) {
		                showTips("这手机号，可打不通...");
		                return false;
		            };
		            if ($('#textaddress').val().length < 5 || $('#textaddress').val().length > 60) {
	                    showTips("地址长度应在5到60个字！");
	                    return false;
	                };
	                var name = $.trim($('#textname').val()),
	                	mobile = $.trim($('#textphone').val()),
						address = $.trim($('#textaddress').val());
					$('label.okname').text(name);
					$('label.okphone').text(mobile);
					$('label.okaddress').text(address);
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile,
						ad: encodeURIComponent(address)
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
				this.$dialog.find('#btn-cd-award').click(function(e) {
                    e.preventDefault();
					if ($('#textname-code').val().trim() == "") {
	               		showTips("请填写姓名！");
	                	return false;
		            };
		            if ($('#textphone-code').val().trim() == "") {
		               showTips("请填写手机号码！");
		                return false;
		            };
		            if (!/^\d{11}$/.test($('#textphone-code').val())) {
		                showTips("这手机号，可打不通...");
		                return false;
		            };
		            if ($('#textaddress-code').val().length < 5 || $('#textaddress-code').val().length > 60) {
	                    showTips("地址长度应在5到60个字！");
	                    return false;
	                };
	                var name = $.trim($('#textname-code').val()),
	                	mobile = $.trim($('#textphone-code').val()),
						address = $.trim($('#textaddress-code').val());
					$('label.okname-code').text(name);
					$('label.okphone-code').text(mobile);
					$('label.okaddress-code').text(address);
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile,
						ad: encodeURIComponent(address)
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
                this.$dialog.find('#btn-back').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			success: function() {
				$('#lott').addClass('success');
                $('#lott .input-box').addClass('win');
                $('.share-tips').removeClass('none');
				$('.lott .win-info').addClass('none');
				$('.lott input').addClass('none');
				$('#btn-award').addClass('none');
				$('#btn-back').removeClass('none');
				$('.lott .win-care').removeClass('none');
                $("#lott-code").find(".win-tips").removeClass("none");
                $("#lott-code").find(".win-info").removeClass("none");
                $('.input-box label').removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog">')
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="lnjy-bkzn-lott-dialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						._('<div class="not-lott" id="not-lott">')
						._('</div>')
						._('<div class="lott none" id="lott">')
							._('<img class="win-pen" src="./images/pen.png">')
							._('<div class="win-img-box"><img class="win-img" src=""><img class="load-img" src="./images/load.png"><img class="win-img-cover" src="./images/photo.png"></div>')
							._('<p class="win-tips"></p>')
							._('<p class="win-info">请填写您的联系方式，以便顺利领奖</p>')
							._('<p class="win-care none"></p>')
							._('<div class="input-box"><span>姓名:</span><input name="" type="text" id="textname" class="text-a" /><label class="okname none"></label></div>')
							._('<div class="input-box"><span>电话:</span><input name="" type="number" id="textphone" class="text-a" /><label class="okphone none"></label></div>')
							._('<div class="input-box"><span>地址:</span><input name="" type="text" id="textaddress" class="text-a" /><label class="okaddress none"></label></div>')
							._('<img class="share-img share-tips none" src="./images/share.png">')
							._('<a class="btn-award" id="btn-award" data-collect="true" data-collect-flag="lnjy-bkzn-combtn" data-collect-desc="抽奖弹层-确定按钮"><img src="./images/ok.png"></a>')
							._('<a class="btn-back none" id="btn-back" data-collect="true" data-collect-flag="lnjy-bkzn-combtn" data-collect-desc="抽奖弹层-确定按钮"><img src="./images/back-yellow.png"></a>')
						._('</div>')
                        ._('<div class="lott none" id="lott-code">')
							._('<img class="win-pen" src="./images/pen.png">')
                            ._('<div class="win-img-box"><img class="win-img" src=""><img class="load-img" src="./images/load.png"><img class="win-img-cover" src="./images/photo.png"></div>')
                            ._('<p class="win-tips"></p>')
                            ._('<p class="code-info">兑奖码:<span id="d-code"></span></p>')
                            ._('<p class="win-info">请填写您的联系方式，以便顺利领奖</p>')
                            ._('<p class="win-care none"></p>')
                            ._('<div class="input-box"><span>姓名:</span><input name="" type="text" id="textname-code" class="text-a" /><label class="okname-code none"></label></div>')
							._('<div class="input-box"><span>电话:</span><input name="" type="number" id="textphone-code" class="text-a" /><label class="okphone-code none"></label></div>')
							._('<div class="input-box"><span>地址:</span><input name="" type="text" id="textaddress-code" class="text-a" /><label class="okaddress-code none"></label></div>')
							._('<img class="share-img share-code-tips none" src="./images/share.png">')
                            ._('<a class="btn-award" id="btn-cd-award" data-collect="true" data-collect-flag="lnjy-bkzn-cd-combtn" data-collect-desc="抽奖弹层-兑换码确定按钮"><img src="./images/ok.png"></a>')
                            ._('<a class="btn-back none" id="btn-use" data-collect="true" data-collect-flag="lnjy-bkzn-usebtn" data-collect-desc="抽奖弹层-兑换码使用"><img src="./images/back-yellow.png"></a>')
                        ._('</div>')
					  ._('</div>')
					._('</div>');
				return t.toString();
			},
			update: function(data) {
                H.dialog.pt = data.pt;
				if(data && data.result == true && data.pt == 1 ){
                    $('#lottery-dialog').removeClass('lottery-no');
				    $("#lott").find(".win-img").attr("src",data.pi);
				    $("#lott").find(".win-tips").html(data.tt);
				    $("#lott").find(".win-care").html(data.pd);
					$("#lott").find('#textname').val(data.rn || '');
					$("#lott").find('#textphone').val(data.ph || '');
					$("#lott").find('#textaddress').val(data.ad || '');
					this.$dialog.find("#not-lott").addClass("none");
                    this.$dialog.find("#lott-code").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
				}else if(data && data.result == true && data.pt == 0){
                    H.lottery.thank_times++;
                    $('#lottery-dialog').addClass('lottery-no');
					$("#not-lott").find(".win-tips").html(data.tt);
					this.$dialog.find("#lott").addClass("none");
                    this.$dialog.find("#lott-code").addClass("none");
					this.$dialog.find("#not-lott").removeClass("none");
				}else if(data && data.result == true && data.pt == 5){
                    $('#lottery-dialog').removeClass('lottery-no');
                    $("#lott-code").find(".win-img").attr("src",data.pi);
                    $("#lott-code").find(".win-tips").html(data.tt);
                    $("#lott-code").find(".win-care").html(data.pd);
					$("#lott-code").find('#textname-code').val(data.rn || '');
					$("#lott-code").find('#textphone-code').val(data.ph || '');
					$("#lott-code").find('#textaddress-code').val(data.ad || '');
                    $("#d-code").text(data.cc);
                    $("#lott-code").find("#btn-use").attr("href", data.ru);
                    $("#lott-code").find(".input-box").removeClass("none");
                    $("#lott-code").find(".code-box").addClass("none");
                    this.$dialog.find("#not-lott").addClass("none");
                    this.$dialog.find("#lott").addClass("none");
                    this.$dialog.find("#lott-code").removeClass("none");
                }else{
					H.dialog.isJump = false;
                    $('#lottery-dialog').addClass('lottery-no');
					$("#not-lott").find(".win-tips").html("<span></span>");
					this.$dialog.find("#lott").addClass("none");
					this.$dialog.find("#not-lott").removeClass("none");
				};
			}
		},

    };
    
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};

	W.callbackLotteryAwardHandler = function(data) {
		if (data.result) {
			$('#lott .input-box span').css({
				'line-height': '25px',
				'vertical-align': 'top'
			});
            if(H.dialog.pt == 5){
            	$('#lott-code input').addClass('none');
                $("#lott-code #btn-cd-award").addClass("none");
                $("#lott-code #btn-use").removeClass("none");
                $('#lott-code .input-box label').removeClass('none');
                $('#lott-code .win-info').addClass('none');
                $('#lott-code .share-code-tips').removeClass('none');
                $('#lott-code .input-box').addClass('win');
            }else{
                H.dialog.lottery.success();
            }
			return;
		} else {
			showTips('亲，服务君繁忙~ 稍后再试哦!');
		}
	};
    
})(Zepto);

$(function() {
    H.dialog.init();
});
