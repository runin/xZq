(function($) {
	H.dialog = {
		puid: 0,
        rule_flag:true,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		prizeType:0,
		init: function() {
			
		},
		close: function() {
			// $('.modal').addClass('none');
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
				width = $(window).width();
			$('.modal').each(function() {
				$(this).css({ 'width': width, 'height': height });
			});
			$('.dialog').each(function() {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$('.rule-dialog').css(
				{
					"height":height*0.52,
					"width":width*0.9,
					"top":"30%",
					"left":"50%",
					"margin-left":-width*0.45
				});
				$('.record-dialog').css(
				{
					"height":height*0.52,
					"width":width*0.9,
					"top":"30%",
					"left":"50%",
					"margin-left":-width*0.45
				});
				
			});
		},
		rule: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();
                if(H.dialog.rule_flag==true)
                {
                    getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
                }
            },
            close: function() {
                var me = this;
				$('.rule-dialog').addClass('bounceOutDown');
                setTimeout(function()
                {
                    $('.rule-dialog').removeClass('bounceOutDown');
                    me.$dialog && me.$dialog.addClass('none');
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(rule) {
                this.$dialog.find('.rule-con').html(rule).removeClass('none');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="rule-dialog">')
                ._('<div class="dialog rule-dialog">')
                	._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-fj-sing-dialog-rule-close-btn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<div class="content">')
                    	._("<h1>活动规则</h1>")
                        ._('<div class="rule-con"></div>')
                    ._("</div>")
                ._("</div>")
                ._("</section>");
                return t.toString();
            }
        },
        record: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();
                getResult('api/lottery/record', {oi:openid}, 'callbackLotteryRecordHandler',true);
            },
            close: function() {
                 var me = this;
                $('.record-dialog').addClass('bounceOutDown');
                setTimeout(function()
                {
                    $('.record-dialog').removeClass('bounceOutDown');
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
            update: function(data) {
            	// var data=[{"time":"2014.8.5 10.24","infor":"2元红包"},
            	// {"time":"2014.8.5 10.24","infor":"3元红包"},
            	// {"time":"2014.8.5 10.24","infor":"4元红包"},
            	// {"time":"2014.8.5 10.24","infor":"5元红包"},
            	// {"time":"2014.8.5 10.24","infor":"6元红包2131231231231231231"}];
                var t = simpleTpl(),
					len = data.length;
				for (var i = 0; i < len; i ++) {
					t._('<li>')
						._('<span class="r-time">' + timeFormat(data[i].lt) + '</span>')
                        ._('<span class="r-infor">'+ data[i].pn +'</span>')
					._('</li>');
				}
				this.$dialog.find('ul').html(t.toString());
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="record-dialog">')
                ._('<div class="dialog record-dialog">')
                	._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-fj-sing-dialog-rule-close-btn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<div class="content">')
                    	._("<h1>中奖纪录</h1>")
                        ._('<div class="record-con">')
						._("<ul>")

						._("</ul>")
                        ._("</div>")
                    ._("</div>")
                ._("</div>")
                ._("</section>");
                return t.toString();
            }
        },
		lottery: {
			pt:null,
			$dialog: null,
			REQUEST_CLS: 'requesting',
			open: function(data) {
				H.lottery.isCanShake = false;
				H.dialog.lottery.pt = data.pt;
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				var winW = $(window).width(), winH = $(window).height();
                var lotteryW = winW * 0.9,
                    lotteryH = winH * 0.66,
                    lotteryT = (winH - lotteryH) / 2,
                    lotteryL = (winW - lotteryW) / 2;
                $('.lottery-dialog').css({
                    'width': lotteryW,
                    'height': lotteryH,
                    'top': "20%",
                    'left': lotteryL
                });
				me.update(data);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-dialog .btn-close,.lottery-dialog #btn-link').click(function(e) {
					e.preventDefault();
					H.lottery.isCanShake = true;
					me.close();
				});
				this.$dialog.find('#btn-award').click(function(e) {
					  e.preventDefault();
                    if(me.check()){
                        var $mobile = $('.phone'),
                            mobile = $.trim($mobile.val()),
                            $name = $('.name'),
                            name = $.trim($name.val()),
                            $address = $('.address'),
                            address = $.trim($address.val());
                        if(me.pt == 1){
                            $(".lottery-dialog").find(".na").text(name);
                            $(".lottery-dialog").find(".ph").text(mobile);
                            $(".lottery-dialog").find(".aa").text(address);
                        }
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid,
                            rn: name ? encodeURIComponent(name) : "",
                            ph: mobile ? mobile : "",
                            ad: address ? address : ""
                        }, 'callbackLotteryAwardHandler');

                        if(H.dialog.lottery.pt == 1){
                        	$('.lottery-dialog .award-tips').html("  ");
                            $("#ent-inp").addClass("none");
                            $("#ent-result").removeClass("none");
                        }
                    }
				});
			},
			update: function(data) {
				if (data && data.result) {
					if (data.pt == 1) {
						$('.lottery-dialog').removeClass('lottery-null');
						$('.lottery-dialog .award-tips').html(data.tt || '');
						$('.lottery-dialog .award-img').attr('src', data.pi).attr("onerror","$(this).addClass(\'none\')");
						$(".lottery-dialog").find(".name").val(data.rn?data.rn:"");
                    	$(".lottery-dialog").find(".phone").val(data.ph?data.ph:"");
                    	$(".lottery-dialog").find(".address").val(data.ad?data.ad:"");
					}
				} else {
					$('.lottery-dialog').addClass('lottery-null');
				}
			},
			close: function() {
                var me = this;
                $('.lottery-dialog').addClass('bounceOutDown');
                setTimeout(function()
                {
                    $('.lottery-dialog').removeClass('bounceOutDown');
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
				H.lottery.isCanShake = true;	
			},
			tpl: function() {
				var t = simpleTpl(), randomPic = Math.ceil(7*Math.random());
				 t._('<div class="modal modal-lottery" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                        ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dialog-task-lottery-close-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-关闭按钮"></a>')
                        ._('<div class="lott-box" id="ent-lott">')
                        	._('<p class="award-tips"></p>')
                            ._('<img class="award-img" src="./pre-ward.png" />')
                            ._('<div class="inp" id="ent-inp">')
                            ._('<p><span class="">姓名</span><input class="name" placeholder="请填写真实姓名"></p>')
                                ._('<p><span class="">电话</span><input class="phone" type="tel" placeholder="请填写真实电话号码"></p>')
                                ._('<p><span class="">地址</span><input class="address" type="text" placeholder="请如实填写收货地址"></p>')
                                ._('<a class="lottery-btn" id="btn-award" data-collect="true" data-collect-flag="dialog-task-lottery-award-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-提交信息按钮">领  取</a>')
                            ._('</div>')
                            ._('<div class="result none" id="ent-result">')
                                ._('<p class="ple">以下是您的联系方式!</p>')
                                ._('<p class="cd">姓名    ：<span class="na"></span></p>')
                                ._('<p class="cd">电话    ：<span class="ph"></span></p>')
                                ._('<p class="cd">地址    ：<span class="aa"></span></p>')
                                ._('<a class="lottery-btn" id="btn-link" data-collect="true" data-collect-flag="dialog-task-lottery-link-btn" data-collect-desc="中奖弹层业务类(实物-兑换码)-领取按钮">确 认</a>')
                            ._('</div>')
                        ._('</div>')
                    ._('</div>')
                    ._('</div>');
				return t.toString();
			},
			check:function(){
                var $mobile = $('.phone'),
                    mobile = $.trim($mobile.val()),
                    $name = $('.name'),
                    name = $.trim($name.val()),
                    $address = $('.address'),
                    address = $.trim($address.val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖!');
                    return false;
                }else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                }else if (address.length > 30) {
                    showTips('请填写正确地址，以便顺利领奖！');
                    return false;
                }
                return true;
            }
		}
	};

	//活动规则
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
            H.dialog.rule_flag = false;

			H.dialog.rule.update(data.rule);
		}
	};
	//中奖纪录
	W.callbackLotteryRecordHandler = function(data) {
		if(data.result)
		{
		  H.dialog.record.update(data.rl);
		}
        else
        {
            showTips('您还没有中奖纪录');
        }

	}
	W.callbackLotteryAwardHandler = function(data) {
        
	};
})(Zepto);

$(function() {
	H.dialog.init();
});