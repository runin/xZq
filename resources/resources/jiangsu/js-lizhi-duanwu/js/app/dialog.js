(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        redpack: '',
        iscroll: null,
        isJump: true,
        voiceFlag: true,
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
            $('.dialog').each(function() {
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
				}, 5000);
				var winW = $(window).width(),
					winH = $(window).height();
				var guideW = Math.round(winW * 0.7);
				var guideH = Math.round(guideW * 627 / 456);
				var guideT = Math.round((winH - guideH) / 2);
				$('#guide-dialog .dialog').css({
					'width': guideW,
					'height': guideH,
					'left': Math.round((winW - guideW) / 2),
					'top': guideT
				});
			},
			close: function () {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function () {
				var me = this;
				$('.guide-dialog').click(function (e) {
					e.preventDefault();
					me.close();
				});
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog">')
						._('<img src="./images/guide-bg.jpg">')
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
				this.$dialog.find('.btn-close').click(function(e) {
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
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="js-lizhi-duanwu-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<div class="rule-box">')
							._('<img src="./images/rule-tit.png">')
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
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
				   this.event();
				};
				var winW = $(window).width(),
					winH = $(window).height();
				var lotteryW = Math.round(winW * 0.94);
				var lotteryH = Math.round(lotteryW * 789 / 598);
				var lotteryT = Math.round((winH - lotteryH) / 2);
				$('#lottery-dialog .dialog').css({
					'width': lotteryW,
					'height': lotteryH,
					'left': Math.round((winW - lotteryW) / 2),
					'top': lotteryT
				});
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
				H.dialog.voiceFlag = true;
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			lotteryConfirm: function() {
				var me = this, lotteryConfirm = confirm('您的奖品还没有领取!');
				if(lotteryConfirm == true) {
					return;
				} else {
					me.close();
				};
			},
			event: function() {
				var me = this, closeFlag = 0, hostVoice = document.getElementById("host-voice");
				this.$dialog.find('.lotterys-close').click(function(e) {
					e.preventDefault();
					if (closeFlag == 0) {
						showTips("您的奖品还没有领取~检查下吧!");
						closeFlag++;
						return;
					} else {
						me.close();
						return;
					};
					// me.lotteryConfirm();
				});
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
		            if ($('#textaddress').val().length < 8 || $('#textaddress').val().length > 100) {
	                    showTips("地址长度应在8到100个字！");
	                    return false;
	                };
	                var name = $.trim($('#textname').val()),
	                	mobile = $.trim($('#textphone').val()),
						address = $.trim($('#textaddress').val());
					$('label.input-name span').text(name);
					$('label.input-phone span').text(mobile);
					$('label.input-address span').text(address);
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
                    if ($('#textphone-code').val().trim() == "") {
                        showTips("请填写手机号码！");
                        return false;
                    };
                    if (!/^\d{11}$/.test($('#textphone-code').val())) {
                        showTips("这手机号，可打不通...");
                        return false;
                    };
                    var mobile = $.trim($('#textphone-code').val());
                    getResult('api/lottery/award', {
                        nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        hi: headimgurl ? headimgurl : "",
                        oi: openid,
                        ph: mobile
                    }, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
                this.$dialog.find('#btn-back').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('.host-sound-click').click(function(e) {
					e.preventDefault();
					if (H.dialog.voiceFlag) {
						H.dialog.voiceFlag = false;
						hostVoice.addEventListener('ended', function () {
							$('.host-voice').removeClass('play');
							$('.host-voice').get(0).pause();
							$('.host-voice').get(0).currentTime = 0.0;
							$('.host-sound-icon').removeClass('ani-sound');
						}, false);
					};
					if ($('.host-voice').hasClass('play')) {
						$('.host-voice').removeClass('play');
						$('.host-voice').get(0).pause();
						$('.host-voice').get(0).currentTime = 0.0;
						$('.host-sound-icon').removeClass('ani-sound');
					} else {
						$('.host-voice').addClass('play');
						$('.host-voice').get(0).play();
						$('.host-sound-icon').addClass('ani-sound');
					};
				});
				this.$dialog.find('.host-sound-icon').click(function(e) {
					e.preventDefault();
					if (H.dialog.voiceFlag) {
						H.dialog.voiceFlag = false;
						hostVoice.addEventListener('ended', function () {
							$('.host-voice').removeClass('play');
							$('.host-voice').get(0).pause();
							$('.host-voice').get(0).currentTime = 0.0;
							$('.host-sound-icon').removeClass('ani-sound');
						}, false);
					};
					if ($('.host-voice').hasClass('play')) {
						$('.host-voice').removeClass('play');
						$('.host-voice').get(0).pause();
						$('.host-voice').get(0).currentTime = 0.0;
						$('.host-sound-icon').removeClass('ani-sound');
					} else {
						$('.host-voice').addClass('play');
						$('.host-voice').get(0).play();
						$('.host-sound-icon').addClass('ani-sound');
					};
				});
			},
			success: function() {
				$('#lott').addClass('success');
				$('.lott .win-info').addClass('none');
				$('.lott input').addClass('none');
				$('#btn-award').addClass('none');
				$('#btn-back').removeClass('none');
				$('.lott .win-care').removeClass('none');
                $("#lott-code").find(".win-tips").removeClass("none");
                $("#lott-code").find(".win-info").removeClass("none");
			},
			tpl: function() {
				var state = getRandomArbitrary(1, 4);
				switch(state) {
					case 1:
						var tpl = simpleTpl();
			            if(hostList.length >0){
			                var i = Math.floor((Math.random()*hostList.length));;
			                var host = hostList[i];
			            };
			            if (host == 'hh' || host == 'lh' || host == 'ly') {
			            	var hostaudio = '';
			            	var none = 'none';
			            	var notips = 'notips';
			            	var soundimg = '';
			            } else {
			            	var hostaudio = '<audio preload="auto" id="host-voice" class="host-voice host-' + host + '-voice" src="images/host-' + host + '-voice.mp3" class="preload"></audio><div class="host-sound-icon"></div>';
			            	var none = '';
			            	var notips = '';
			            	var soundimg = 'host-sound-click';
			            };
			            tpl._(hostaudio)
							._('<img class="host-img host-' + host + ' ' + soundimg + '" src="./images/host/' + host + '.jpg">')
							._('<p class="' + none + '"><img src="./images/lottery-tips.png"></p>')
							._('<a href="#" class="lottery-close" id="' + notips + '"><img src="./images/lottery-btn.png"></a>')
						var noneLottTPL = tpl.toString();
						break;
					case 2:
						var tpl = simpleTpl();
			            if(joyList.length >0){
			                var i = Math.floor((Math.random()*joyList.length));;
			                var joy = joyList[i];
			            };
			            tpl._('<div class="happyjs"><img src="./images/joy-bg.jpg"><p>' + joy + '</p></div>')
							._('<a href="#" class="lottery-close" id="notips"><img src="./images/lottery-btn.png"></a>')
						var noneLottTPL = tpl.toString();
						
						break;
					default:
						var tpl = simpleTpl();
			            if(helpList.length >0){
			                var i = Math.floor((Math.random()*helpList.length));;
			                var help = helpList[i];
			            };
			            tpl._('<div class="happyjs"><img src="./images/help-bg.jpg"><p>' + help + '</p></div>')
							._('<a href="#" class="lottery-close" id="notips"><img src="./images/lottery-btn.png"></a>')
						var noneLottTPL = tpl.toString();
				};
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog">')
					._('<a href="#" class="lotterys-close" data-collect="true" data-collect-flag="js-lizhi-duanwu-lott-dialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						._('<div class="not-lott" id="not-lott">')
							._(noneLottTPL)
						._('</div>')
						._('<div class="lott none" id="lott">')
							._('<img class="win-img" src="">')
							._('<p class="win-tips"></p>')
							._('<p class="win-info">请填写您的联系方式，以便顺利领奖</p>')
							._('<p class="win-care none"></p>')
							._('<div class="input-box"><label class="input-name"><img src="./images/icon-name.png"><i>姓名:</i><span></span></label>')
							._('<input name="" type="text" id="textname" class="text-a" /></div>')
							._('<div class="input-box"><label class="input-phone"><img src="./images/icon-phone.png"><i>电话:</i><span></span></label>')
							._('<input name="" type="number" id="textphone" class="text-a" /></div>')
							._('<div class="input-box input-box-address"><label class="input-address"><img src="./images/icon-address.png"><i>地址:</i><span></span></label>')
							._('<input name="" type="text" id="textaddress" class="text-a" /></div>')
							._('<a class="btn-award" id="btn-award" data-collect="true" data-collect-flag="js-lizhi-duanwu-combtn" data-collect-desc="抽奖弹层-确定按钮">确&nbsp;定</a>')
							._('<a class="btn-back none" id="btn-back" data-collect="true" data-collect-flag="js-lizhi-duanwu-combtn" data-collect-desc="抽奖弹层-确定按钮">返&nbsp;回</a>')
						._('</div>')
                        ._('<div class="lott none" id="lott-code">')
                            ._('<img class="win-img" src="">')
                            ._('<p class="win-tips"></p>')
                            ._('<p class="win-info">请填写您的联系方式，以便顺利领奖</p>')
                            ._('<p class="win-care none"></p>')
                            ._('<div class="input-box"><label class="input-phone"><img src="./images/icon-phone.png"><i>电话:</i><span></span></label>')
                            ._('<input name="" type="number" id="textphone-code" class="text-a" /></div>')
                            ._('<div class="code-box none">')
                                ._('<p class="tip-info">请截屏此页，需凭此码兑换票券</p>')
                                ._('<p class="code-info">兑奖码:<span id="d-code"></span></p>')
                            ._('</div>')
                            ._('<a class="btn-award" id="btn-cd-award" data-collect="true" data-collect-flag="js-lizhi-duanwu-cd-combtn" data-collect-desc="抽奖弹层-兑换码确定按钮">获&nbsp;取</a>')
                            ._('<a class="btn-back none" id="btn-use" data-collect="true" data-collect-flag="js-lizhi-duanwu-usebtn" data-collect-desc="抽奖弹层-兑换码使用">立即使用</a>')
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
					$("#lott-code").find('#textphone-code').val(data.ph || '');
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
            if(H.dialog.pt == 5){
                $("#lott-code").find(".win-tips").addClass("none");
                $("#lott-code").find(".win-info").addClass("none");
                $("#lott-code").find(".input-box").addClass("none");
                $("#lott-code").find(".code-box").removeClass("none");
                $("#btn-cd-award").addClass("none");
                $("#btn-use").removeClass("none");
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
