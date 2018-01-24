(function($) {
	H.dialog = {
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		as: getQueryString('as'),
		iscroll: null,
		quan_link: null,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
			}).delegate('.btn-result', 'click', function(e) {
				e.preventDefault();
				H.dialog.result.open();
			}).delegate('.btn-lottery', 'click', function(e) {/** 抽奖事件**/
				e.preventDefault();
				H.dialog.lottery.open();
			}).delegate('.btn-comeon', 'click', function(e) {
				e.preventDefault();
				H.dialog.guide.open();
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
			$('.modal-guide').click(function(e){
				e.preventDefault();
				e.stopPropagation();
			});
			$('#rule-dialog').click(function(e){
				e.preventDefault();
				e.stopPropagation();
			});
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
					'height': height * 0.88, 
					'left': width * 0.06,
					'right': width * 0.06,
					'top': top,
					'bottom': height * 0.06
				});
				var $box = $(this).find('.box');
				if ($box.length > 0) {
					$box.css('height', height * 0.38);
				}
			});
			$(".rank-dialog").css("top",top+10+"px");
		},
		guide: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				var winW = $(window).width(),
					winH = $(window).height();
				var guideBgW = winW,
					guideBgH = Math.ceil(winW * 808 / 640);
				var guideBgT = (winH - guideBgH) / 2;
				$('.guide-dialog').css({
					'height': guideBgH,
					'top': guideBgT
				});
				var me = this;
				setTimeout(function() {
					me.close();
				}, 8000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-try').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			close: function() {
                setTimeout(function() {
                    $('.logo').addClass('rubberBand');
                    setTimeout(function() {
                        $('.logo').removeClass('rubberBand');
                    }, 2800);
                }, 50);
				this.$dialog && this.$dialog.addClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog relocated">')
						._('<h2><img src="./images/mini-logo.png"></h2>')
						._('<img class="tips-share" src="./images/tips-share.png">')
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="fjdn-fight-school-guide-trybtn" data-collect-desc="引导弹层-关闭按钮"><img src="./images/btn-try.png"></a>')
					._('</div>')
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
				var ruleBgW = winW,
					ruleBgH = Math.ceil(winW * 808 / 640);
				var ruleBgT = (winH - ruleBgH) / 2;
				$('.rule-dialog').css({
					'height': ruleBgH,
					'top': ruleBgT
				});
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
				$('body').removeClass('noscroll');
				this.$dialog && this.$dialog.addClass('none');
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
				this.$dialog.find('.rule').html(rule).removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="fjdn-fight-school-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2><img src="./images/tips-rule.png"></h2>')
						._('<div class="content border">')
							._('<div class="rule"></div>')
						._('</div>')
						._('<a href="#" class="btn-back" data-collect="true" data-collect-flag="fjdn-fight-school-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"><img src="./images/btn-back.png"></a>')
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
				H.lottery.canJump = false;
			},
			close: function() {
				H.lottery.isCanShake = true;
				H.lottery.canJump = true;
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
	                var name = $.trim($('#textname').val()),
	                	mobile = $.trim($('#textphone').val());
					$('label.okname').text(name);
					$('label.okphone').text(mobile);
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
				this.$dialog.find('#btn-cd-award').click(function(e) {
                    e.preventDefault();
		            if (!/^\d{11}$/.test($('#textphone-code').val())) {
		                showTips("这手机号，可打不通...");
		                return false;
		            };
	                var mobile = $.trim($('#textphone-code').val());
					$('label.okphone-code').text(mobile);
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						ph: mobile
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
				this.$dialog.find('#btn-cdc-award').click(function(e) {
                    e.preventDefault();
		            if (!/^\d{11}$/.test($('#textphone-codes').val())) {
		                showTips("这手机号，可打不通...");
		                return false;
		            };
	                var mobile = $.trim($('#textphone-codes').val());
					$('label.okphone-codes').text(mobile);
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						ph: mobile
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
				this.$dialog.find('#btn-quan-award').click(function(e) {
                    e.preventDefault();
		            if (!/^\d{11}$/.test($('#textphone-quan').val())) {
		                showTips("这手机号，可打不通...");
		                return false;
		            };
	                var mobile = $.trim($('#textphone-quan').val());
					$('label.okphone-quan').text(mobile);
					shownewLoading(null,'请稍后...');
                    $.ajax({
                        type: 'GET',
                        async: true,
                        url: H.dialog.quan_link + "?temp=" + new Date().getTime(),
                        dataType: "jsonp",
                        data: { country: 86, phone: mobile },
                        jsonpCallback: 'getCouponCallback',
                        complete: function() {hidenewLoading()},
                        success: function (data) {
                            if (data.result.status == 1) {
								getResult('api/lottery/award', {
									nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
									hi: headimgurl ? headimgurl : "",
									oi: openid,
									ph: mobile
								}, 'callbackLotteryAwardHandler');
                                showTips("恭喜您！领取成功~");
                            } else if (data.result.status == 0) {
                                showTips("该手机号已领取过哦~<br>换个手机试试吧！");
                                $("#lott-quan").find('#textphone-quan').val('');
                            } else {
                                showTips("很抱歉！领取失败了");
                            }
                        }
                    });
				});
                this.$dialog.find('#btn-back').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-code-back').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-quan-back').click(function(e) {
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
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="fjdn-fight-school-lott-dialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						._('<div class="lott none" id="lott">')
							._('<div class="win-img-box"><img class="win-img" src=""></div>')
							._('<p class="win-tips"></p>')
							._('<p class="win-info">请填写您的联系方式，以便顺利领奖</p>')
							._('<p class="win-care none"></p>')
							._('<div class="input-box"><span>姓名:</span><input name="" type="text" id="textname" class="text-a" /><label class="okname none"></label></div>')
							._('<div class="input-box"><span>电话:</span><input name="" type="tel" id="textphone" class="text-a" /><label class="okphone none"></label></div>')
							._('<div class="input-box none"><span>地址:</span><input name="" type="text" id="textaddress" class="text-a" /><label class="okaddress none"></label></div>')
							._('<a class="btn-award" id="btn-award" data-collect="true" data-collect-flag="fjdn-fight-school-submitbtn" data-collect-desc="抽奖弹层-实物奖提交按钮"><img src="./images/icon-submit.png"></a>')
							._('<a class="btn-back none" id="btn-back" data-collect="true" data-collect-flag="fjdn-fight-school-okbtn" data-collect-desc="抽奖弹层-实物奖确定按钮"><img src="./images/icon-ok.png"></a>')
						._('</div>')
                        ._('<div class="lott none" id="lott-code">')
                            ._('<div class="win-img-box"><img class="win-img" src=""></div>')
                            ._('<p class="win-tips"></p>')
                            ._('<p class="code-info none">兑奖码:<span id="d-code"></span></p>')
                            ._('<p class="win-info">请填写您的联系方式，以便顺利领奖</p>')
                            ._('<p class="win-care none"></p>')
							._('<div class="input-box"><span>电话:</span><input name="" type="tel" id="textphone-code" class="text-a" /><label class="okphone-code none"></label></div>')
                            ._('<a class="btn-award" id="btn-cd-award" data-collect="true" data-collect-flag="fjdn-fight-school-code-submitbtn" data-collect-desc="抽奖弹层-兑换码提交按钮"><img src="./images/icon-submit.png"></a>')
                            ._('<a class="btn-back none" id="btn-use" data-collect="true" data-collect-flag="fjdn-fight-school-code-linkbtn" data-collect-desc="抽奖弹层-兑换码外链按钮"><img src="./images/icon-use.png"></a>')
                            ._('<a class="btn-back none" id="btn-code-back" data-collect="true" data-collect-flag="fjdn-fight-school-code-okbtn" data-collect-desc="抽奖弹层-兑换码确定按钮"><img src="./images/icon-back.png"></a>')
                        ._('</div>')
                        ._('<div class="lott none" id="lott-code-complex">')
                            ._('<div class="win-img-box"><img class="win-img" src=""></div>')
                            ._('<p class="win-tips"></p>')
                            ._('<p class="code-info none">兑奖码:<span id="d-code-num"></span></p>')
                            ._('<p class="code-info none">密&nbsp;&nbsp;&nbsp;&nbsp;码:<span id="d-code-pwd"></span></p>')
                            ._('<p class="win-info">请填写您的联系方式，以便顺利领奖</p>')
                            ._('<p class="win-care none"></p>')
							._('<div class="input-box"><span>电话:</span><input name="" type="tel" id="textphone-codes" class="text-a" /><label class="okphone-codes none"></label></div>')
                            ._('<a class="btn-award" id="btn-cdc-award" data-collect="true" data-collect-flag="fjdn-fight-school-code-submitbtn" data-collect-desc="抽奖弹层-兑换码提交按钮"><img src="./images/icon-submit.png"></a>')
                            ._('<a class="btn-back none" id="btn-use" data-collect="true" data-collect-flag="fjdn-fight-school-code-linkbtn" data-collect-desc="抽奖弹层-兑换码外链按钮"><img src="./images/icon-use.png"></a>')
                            ._('<a class="btn-back none" id="btn-code-back" data-collect="true" data-collect-flag="fjdn-fight-school-code-okbtn" data-collect-desc="抽奖弹层-兑换码确定按钮"><img src="./images/icon-back.png"></a>')
                        ._('</div>')
                        ._('<div class="lott none" id="lott-quan">')
                            ._('<div class="win-img-box"><img class="win-img" src=""></div>')
                            ._('<p class="win-tips"></p>')
                            ._('<p class="win-info">请填写您的联系方式，以便顺利领奖</p>')
                            ._('<p class="win-care none"></p>')
							._('<div class="input-box"><span>电话:</span><input name="" type="tel" id="textphone-quan" class="text-a" /><label class="okphone-quan none"></label></div>')
                            ._('<a class="btn-award" id="btn-quan-award" data-collect="true" data-collect-flag="fjdn-fight-school-quan-submittn" data-collect-desc="抽奖弹层-口袋通提交按钮"><img src="./images/icon-submit.png"></a>')
                            ._('<a class="btn-back none" id="btn-quan-use" data-collect="true" data-collect-flag="fjdn-fight-school-quan-linkbtn" data-collect-desc="抽奖弹层-口袋通外链按钮"><img src="./images/icon-use.png"></a>')
                            ._('<a class="btn-back none" id="btn-quan-back" data-collect="true" data-collect-flag="fjdn-fight-school-quan-okbtn" data-collect-desc="抽奖弹层-口袋通确定按钮"><img src="./images/icon-back.png"></a>')
                        ._('</div>')
                        ._('<div class="lott none" id="lott-redbag">')
                        	._('<img class="redbag-tips" src="./images/icon-redbag.png">')
                            ._('<img class="win-img" src="">')
                            ._('<a class="btn-get-redbag" id="btn-get-redbag" data-collect="true" data-collect-flag="fjdn-fight-school-redbag-getbtn" data-collect-desc="抽奖弹层-红包领取按钮"><img src="./images/btn-redbag.png"></a>')
                        ._('</div>')
					  ._('</div>')
					._('</div>');
				return t.toString();
			},
			update: function(data) {
                H.dialog.pt = data.pt;
				if(data && data.result == true && data.pt == 1) {
                    $('#lottery-dialog').removeClass('lottery-no lottery-redbag');
				    $("#lott").find(".win-img").attr("src",data.pi);
				    $("#lott").find(".win-tips").html(data.tt);
				    $("#lott").find(".win-care").html(data.pd);
					$("#lott").find('#textname').val(data.rn || '');
					$("#lott").find('#textphone').val(data.ph || '');
					$("#lott").find('#textaddress').val(data.ad || '');
					this.$dialog.find("#not-lott").addClass("none");
                    this.$dialog.find("#lott-code").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
				}else if(data && data.result == true && data.pt == 0) {
                    H.lottery.thank_times++;
                    $('#lottery-dialog').addClass('lottery-no');
					$("#not-lott").find(".win-tips").html(data.tt);
					this.$dialog.find("#lott").addClass("none");
                    this.$dialog.find("#lott-code").addClass("none");
					this.$dialog.find("#not-lott").removeClass("none");
				}else if(data && data.result == true && data.pt == 4) {
                    $('#lottery-dialog').removeClass('lottery-no').addClass('lottery-redbag');
                    $("#lott-redbag").find(".win-img").attr("src",data.pi);
                    $('#lott-redbag').click(function(e) {
						e.preventDefault();
						shownewLoading();
						location.href = data.rp;
						recordUserPage(openid, "为母校而战领取红包", 'fjdn-fight-school-redbag-getbtn');
                    });
                    $('#btn-get-redbag').click(function(e) {
						e.preventDefault();
						shownewLoading();
						location.href = data.rp;
						recordUserPage(openid, "为母校而战领取红包", 'fjdn-fight-school-redbag-getbtn');
                    });
                    this.$dialog.find("#not-lott").addClass("none");
                    this.$dialog.find("#lott").addClass("none");
                    this.$dialog.find("#lott-redbag").removeClass("none");
                }else if(data && data.result == true && data.pt == 5) {
                	if ((data.cc).indexOf(',') < 0) {
	                    $('#lottery-dialog').removeClass('lottery-no lottery-redbag');
	                    $("#lott-code").find(".win-img").attr("src",data.pi);
	                    $("#lott-code").find(".win-tips").html(data.tt);
	                    $("#lott-code").find(".win-care").html(data.pd);
						$("#lott-code").find('#textphone-code').val(data.ph || '');
	                    $("#d-code").text(data.cc);
	                    $("#lott-code").find("#btn-use").attr("href", data.ru);
	                    $("#lott-code").find(".input-box").removeClass("none");
	                    $("#lott-code").find(".code-box").addClass("none");
	                    this.$dialog.find("#not-lott").addClass("none");
	                    this.$dialog.find("#lott").addClass("none");
	                    this.$dialog.find("#lott-code").removeClass("none");
                	} else {
	                    $('#lottery-dialog').removeClass('lottery-no lottery-redbag');
	                    $("#lott-code-complex").find(".win-img").attr("src",data.pi);
	                    $("#lott-code-complex").find(".win-tips").html(data.tt);
	                    $("#lott-code-complex").find(".win-care").html(data.pd);
						$("#lott-code-complex").find('#textphone-code').val(data.ph || '');
	                    $("#d-code-num").text(data.cc.split(',')[0]);
	                    $("#d-code-pwd").text(data.cc.split(',')[1]);
	                    $("#lott-code-complex").find("#btn-use").attr("href", data.ru);
	                    $("#lott-code-complex").find(".input-box").removeClass("none");
	                    $("#lott-code-complex").find(".code-box").addClass("none");
	                    this.$dialog.find("#not-lott").addClass("none");
	                    this.$dialog.find("#lott").addClass("none");
	                    this.$dialog.find("#lott-code-complex").removeClass("none");
                	}
                }else if(data && data.result == true && data.pt == 9) {
                	H.dialog.quan_link = data.aa;
                    $('#lottery-dialog').removeClass('lottery-no lottery-redbag');
                    $("#lott-quan").find(".win-img").attr("src",data.pi);
                    $("#lott-quan").find(".win-tips").html(data.tt);
                    $("#lott-quan").find(".win-care").html(data.pd);
					$("#lott-quan").find('#textphone-quan').val(data.ph || '');
                    $("#lott-quan").find("#btn-quan-use").attr("href", data.ru);
                    $("#lott-quan").find(".input-box").removeClass("none");
                    $("#lott-quan").find(".code-box").addClass("none");
                    this.$dialog.find("#not-lott").addClass("none");
                    this.$dialog.find("#lott").addClass("none");
                    this.$dialog.find("#lott-quan").removeClass("none");
                }else{
					H.dialog.isJump = false;
                    $('#lottery-dialog').addClass('lottery-no');
					$("#not-lott").find(".win-tips").html("<span></span>");
					this.$dialog.find("#lott").addClass("none");
					this.$dialog.find("#not-lott").removeClass("none");
				};
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
			$('#lott .input-box span').css({
				'line-height': '25px',
				'vertical-align': 'top'
			});
            if(H.dialog.pt == 5){
            	$('#lott-code input, #lott-code-complex input').addClass('none');
                $("#lott-code #btn-cd-award, #lott-code-complex #btn-cdc-award").addClass("none");
                $("#lott-code #btn-use, #lott-code-complex #btn-use").removeClass("none");
                $('#lott-code .input-box label, #lott-code-complex .input-box label').removeClass('none');
                $('#lott-code .win-info, #lott-code .win-tips, #lott-code-complex .win-info, #lott-code-complex .win-tips').addClass('none');
                $('#lott-code .input-box, #lott-code-complex .input-box').addClass('win');
                $('#lott-code .code-info, #lott-code-complex .code-info').removeClass('none');
                $('#lott-code #btn-code-back, #lott-code-complex #btn-code-back').removeClass('none');
                $('#lott-code .win-care, #lott-code-complex .win-care').removeClass('none');
            }else if(H.dialog.pt == 9){
            	$('#lott-quan input').addClass('none');
                $("#lott-quan #btn-quan-award").addClass("none");
                $("#lott-quan #btn-quan-use").removeClass("none");
                $('#lott-quan .input-box label').removeClass('none');
                $('#lott-quan .win-info').addClass('none');
                $('#lott-quan #btn-quan-back').removeClass('none');
                $('#lott-quan .win-care').removeClass('none');
                $('#lott-quan .input-box').addClass('win');
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