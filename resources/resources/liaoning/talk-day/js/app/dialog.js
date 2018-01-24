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
                    'width': width * 0.80, 
                    'height': height * 0.70, 
                    'left': width * 0.1,
                    'right': width * 0.1,
                    'top': height * 0.15,
                    'bottom': height * 0.15
            });
            $(".rule-dialog").css({
                    'width': width * 0.8, 
                    'height': height * 0.70, 
                    'left': width * 0.1,
                    'right': width * 0.1,
                    'top': height * 0.15,
                    'bottom': height * 0.15
            });
             $(".rule-box").css({
                  'height': height * 0.7, 
            });
            $(".rule-dialog .content").css({
                    'height': height*0.7-60, 
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
				var me = this;
				me.$dialog.find('.rule-dialog').addClass('bounceOutDown');
				setTimeout(function(){
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
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
				t._('<section class="modal modal-rul" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
					._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="tv-lntv-talkshow-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._('<div class="rule-box">')
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
		result: {
			$dialog: null,
			open: function(type) {
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				if(type == 1){
					this.$dialog.find(".wrong").addClass("none")
					this.$dialog.find(".right").removeClass("none")
				}else if(type == 2){
					this.$dialog.find(".right").addClass("none")
					this.$dialog.find(".wrong").removeClass("none")
				};
				this.event();
			},

			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				var sn = new Date().getTime()+'';
				$open = this.$dialog.find('.right-open');
					$open.click(function(e) {
						e.preventDefault();
						shownewLoading();
			             $.ajax({
			                type : 'GET',
			                async : false,
			                url : domain_url + 'api/lottery/luck',
			                data: { oi: openid ,sn : sn},
			                dataType : "jsonp",
			                jsonpCallback : 'callbackLotteryLuckHandler',
			                timeout: 11000,
			                complete: function() {
			                	 sn = new Date().getTime()+'';
			                    hidenewLoading();
			                },
			                success : function(data) {
			                    if(data.result){
			                        if(data.sn == sn){ 
			                            H.dialog.lottery.open(data);
			                    		me.close();
			                        }else{
			                            H.dialog.lottery.open(null);
			                            me.close();
			                        }
			                    }else{
			                       	H.dialog.lottery.open(null);
			                    	me.close();
			                    }
			                },
			                error : function() {
			                    H.dialog.lottery.open(null);
			                    me.close();
			                }
			            });
					});
					$(".wrong-close").click(function(e) {
						e.preventDefault();
						H.pass.change();
						$("#pass-crm").addClass("answered");
						me.close()
					});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal result-modal">')
				    ._('<div class="dialog result-dialog">')
						._('<div class="result-round wrong none">')
							._('<img class="fudai" src="images/wrong.png"/>')
							._('<h3>没有匹配成功哦！</h3>')
							._('<h3>是不是密码输错啦！</h3>')
							._('<a class="result-btn wrong-close" data-collect="true" data-collect-flag="tv-lntv-talkshow-wrong-close-btn" data-collect-desc="答错页面关闭按钮">继续加油</a>')
						._('</div>')
						._('<div class="result-round right none">')
							._('<img class="gift-box" src="images/right.png"/>')
							._('<h3>太棒啦，输入正确！</h3>')
							._('<h3>赶紧打开看看吧！</h3>')
							._('<a class="result-btn right-open" data-collect="true" data-collect-flag="tv-lntv-talkshow-right-open-lott-btn" data-collect-desc="答对页面抽奖按钮">拆开</a>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
        lottery: {
			$dialog: null,
			open: function(data) {
				var me =this,$dialog = this.tpl();
				H.dialog.open.call(this);
				H.dialog.lottery.update(data)
				this.event();
			},
			close: function() {
				var me = this;
				H.pass.change();
				$("#pass-crm").addClass("answered");
				me.$dialog.find('.lottery-dialog').addClass('bounceOutDown');
				setTimeout(function(){
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
            	}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('#openRed').click(function(e) {
					   e.preventDefault();
	                   $(this).addClass("none");
	            });
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.close();
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
					H.dialog.lottery.succ();
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal" >')
					._('<div class="dialog lottery-dialog">')
						//抽奖弹层
						//未中奖
						 ._('<div class="not-lott none" id="not-lott">')
						 ._('<a class="lottery-close" data-collect="true" data-collect-flag="tv-lntv-talkshow-lottery-close-btn" data-collect-desc="未中奖页面关闭按钮"></a>')
						      	._('<div class="gift-text">')
						       		._('<img class="showImg" src="images/not-lott.png" />')
						      	._('</div>')
						       ._('<h3>您与奖品的缘分就这么擦肩而过了</h3>')
								._('<h3> 没关系，继续加油！</h3>')
						       ._('<a class="btn back-index" data-collect="true" data-collect-flag="tv-lntv-talkshow-notlott-btn" data-collect-desc="未中奖返回按钮">确&nbsp&nbsp&nbsp定</a>')
						  ._('</div>')
						  //中奖
						._('<div class="lott none" id="lott">')
							._('<div class="lott-box">')
								._('<a class="lottery-close" data-collect="true" data-collect-flag="tv-lntv-talkshow-lottery-close-btn" data-collect-desc="中奖页面关闭按钮"></a>')
								._('<div class="all-goods">')
								    ._('<div class="gift-text">')
									    ._('<h1 class="tip"><img src="images/lott-title.png" /></h1>')
									    ._('<div class="gift"><img src="" /></div>')
										._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
										._('<h4 class="awarded-tip none">以下是您的联系方式</h4>')
										._('<input type="text" class="name" id="name" placeholder="姓名" />')
										._('<input type="number" class="phone" id="phone" placeholder="电话" />')
										._('<input type="text" class="address" id="address" placeholder="地址" />')
										 ._('<a class="btn good-btn-ok" id="yaoBtnGoodOK"  data-collect="true" data-collect-flag="tv-lntv-talkshow-good-ok" data-collect-desc="摇奖页-实物奖提交按钮">领&nbsp&nbsp&nbsp&nbsp取<a/>')
										 ._('<a class="btn good-btn-back none" id="yaoBtnGoodBack" data-collect="true" data-collect-flag="tv-lntv-talkshow-good-back" data-collect-desc="摇奖页-实物奖确认按钮">确&nbsp&nbsp&nbsp&nbsp认<a/>')
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
	            if(data&&data.result){
					if(data.pt == 2||data.pt == 1){//积分奖品和实物奖品
						$("#lott .all-goods .gift").find("img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
						$("#lott .all-goods").find('#name').val(data.rn || '');
						$("#lott .all-goods").find('#phone').val(data.ph || '');
						$("#lott .all-goods").find('#address').val(data.ad || '');
                    	$("#lott .all-goods").find("#yaoBtnGoodBack").addClass("none");
                    	$("#lott .all-goods").find("#yaoBtnGoodOK").removeClass("none");
                    	$("#lott .all-goods").find("input").removeAttr("disabled");
                    	$("#lott .all-goods").removeClass("none");
                    	this.$dialog.find("#not-lott").addClass("none");
						this.$dialog.find("#lott").removeClass("none");
					}else{
						this.$dialog.find("#not-lott").removeClass("none");
						this.$dialog.find("#lott").addClass("none");
					}
	            }else{
					this.$dialog.find("#not-lott").removeClass("none");
					this.$dialog.find("#lott").addClass("none");
	            }
					 
			},
			succ :function(){
				$('#yaoBtnGoodOK').removeClass("requesting");
				$('#yaoBtnGoodOK').addClass('none');
				$('#yaoBtnGoodBack').removeClass('none');
				$(".lott").find("input").attr("disabled","disabled");
				$('.award-tip').addClass('none');
				$(".awarded-tip").removeClass("none");
				showTips("信息提交成功");
			}
		},

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
