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
                    'width': width * 0.8+20, 
                    'height': height * 0.6+20, 
                    'left': width * 0.1-10,
                    'right': width * 0.1-10,
                    'top': height * 0.2-10,
                    'bottom': height * 0.2-10
            });
              $(".rule-box").css({
                  'height': height * 0.6-10, 
            });
            $(".rule-dialog .content").css({
                    'height': height*0.6-60, 
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
					._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="tv-guangzhou-zhujiang-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
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
		guide: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
				var me = this;
				setTimeout(function() {
					me.close();
				}, 5000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-try').click(function(e) {
					e.preventDefault();
					
					me.close();
				});
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog relocated">')
						._('<img src="./images/small-sponsor.png">')
						._('<div class="guide-content"><p class="ellipsis"><label>1</label>打开电视，锁定云南卫视</p>')
						._('<p class="ellipsis"><label>2</label>打开微信，进入摇一摇(电视)</p>')
						._('<p class="ellipsis"><label>3</label>对着电视摇一摇</p>')
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="tv-guangzhou-zhujiang-guide-trybtn" data-collect-desc="引导弹层-关闭按钮"></a></div>')
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
				H.lottery.isCanShake = false;
				this.event();
				getResult('api/lottery/integral/rank/self', {
					oi: openid,pu : H.lottery.jifenUid
				}, 'callbackIntegralRankSelfRoundHandler', true, this.$dialog);
			},
			close: function() {
				var me = this;
				me.$dialog.find('.rank-dialog').addClass('bounceOutDown');
				setTimeout(function(){
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
            	}, 1000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					if(!H.lottery.bCountDown&&!H.lottery.isTimeOver){
						H.lottery.isCanShake = true;
					}else{
						H.lottery.isCanShake = false;
					}
					me.close();
				});
			},
			selfupdate: function(data) {
				this.$dialog.find('.jf').text(data.in || 0);
				this.$dialog.find('.pm').text(data.rk || '暂无排名');
				getResult('api/lottery/integral/rank/top10', {pu:H.lottery.jifenUid}, 'callbackIntegralRankTop10RoundHandler', true, this.$dialog);
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
						._('<div class="rank-content">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-guangzhou-zhujiang-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
							._('<div class="rank-title"><img src="images/rank-title.png"/>')
								._('<p>积分使用请参照活动规则</p>')
								._('<h3>我的积分：<span class="jf"></span>排名<span class="pm"></span></h3>')
							._('</div>')
							._('<div class="list border">')
								._('<div class="content">')
									._('<ul></ul>')		
								._('</div>')
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
					if(!H.lottery.bCountDown&&!H.lottery.isTimeOver){
						H.lottery.isCanShake = true;
					}else{
						H.lottery.isCanShake = false;
					}
					return;
				});
				
				this.$dialog.find('.back-index').click(function(e) {
					e.preventDefault();
					//如果没有在倒计时且没有结束
					if(!H.lottery.bCountDown&&!H.lottery.isTimeOver){
						H.lottery.isCanShake = true;
					}else{
						H.lottery.isCanShake = false;
					}
					me.close();
				});

				this.$dialog.find('.good-btn-back').click(function(e) {
					e.preventDefault();
					if(!H.lottery.bCountDown&&!H.lottery.isTimeOver){
						H.lottery.isCanShake = true;
					}else{
						H.lottery.isCanShake = false;
					}
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
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
						//未中奖
						 ._('<div class="not-lott none" id="not-lott">')
						      ._('<div class="gift-text">')
						       		._('<img class="showImg" src="" />')
						       		._('<a class="back-index" data-collect="true" data-collect-flag="tv-guangzhou-zhujiang-notlott-btn" data-collect-desc="未中奖返回按钮"></a>')
						      ._('</div>')
						  ._('</div>')
						  //中奖
						._('<div class="lott none" id="lott">')
							._('<div class="lott-box">')
								._('<a class="lottery-close" data-collect="true" data-collect-flag="tv-guangzhou-zhujiang-lottery-close-btn" data-collect-desc="中奖页面关闭按钮"></a>')
								._('<div class="all-goods none">')
								    ._('<div class="gift-text">')
									    ._('<h1 class="tip"><img src="images/lott-title.png" /></h1>')
									    ._('<div class="gift"><img src="" /></div>')
										._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
										._('<h4 class="awarded-tip none">以下是您的联系方式</h4>')
										._('<input type="text" class="name" id="name" placeholder="姓名" />')
										._('<input type="number" class="phone" id="phone" placeholder="电话" />')
										._('<input type="text" class="address" id="address" placeholder="地址" />')
										 ._('<a class="good-btn good-btn-ok" id="yaoBtnGoodOK"  data-collect="true" data-collect-flag="tv-guangzhou-zhujiang-good-ok" data-collect-desc="摇奖页-实物奖提交按钮">领&nbsp&nbsp&nbsp&nbsp取<a/>')
										 ._('<a class="good-btn good-btn-back none" id="yaoBtnGoodBack" data-collect="true" data-collect-flag="tv-guangzhou-zhujiang-good-back" data-collect-desc="摇奖页-实物奖确认按钮">确&nbsp&nbsp&nbsp&nbsp认<a/>')
								 ._('</div>')
							._('</div>')
						._('</div>')
						._('<footer class="warm-tip"><img src="images/warm-tip.png" /></footer>')
					  ._('</div>')
					._('</div>');
				return t.toString();
			},
			//摇一摇抽奖
			update: function(data) {
	            //接口回调成功且中奖
					this.$dialog.find("#not-lott").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
					 if(data.pt == 2||data.pt == 1){//积分奖品和实物奖品
						$("#lott .all-goods .gift").find("img").attr("src",data.pi);
						$("#lott .all-goods").find('#name').val(data.rn || '');
						$("#lott .all-goods").find('#phone').val(data.ph || '');
						$("#lott .all-goods").find('#address').val(data.ad || '');
                    	$("#lott .all-goods").find("#yaoBtnGoodBack").addClass("none");
                    	$("#lott .all-goods").find("#yaoBtnGoodOK").removeClass("none");
                    	$("#lott .all-goods").find("input").removeAttr("disabled");
                    	$("#lott .all-goods").removeClass("none");
                    	$("#lott").removeClass("none");
					}else if(data.pt == 4){//现金红包
						$(".lott").css("background","none");
						$(".redhongbao").find(".award-info").attr("src",data.pi);
						$(".redhongbao").find("#getRed").attr("href",data.rp);
						$("#lott").find(".redhongbao").removeClass("none");
                    	$("#lott .all-goods").addClass("none");
                    	$("#lott .goods").addClass("none");
						$("#lot").removeClass("none");
					}
			},
			thank :function(){
				var i =  getRandomArbitrary(0, H.lottery.thankshow.length) ;
				$(".showImg").attr("src",H.lottery.thankshow[i].is);
				if(!H.lottery.thankshow[i].mu){
					$(".ui-audio").addClass("none")	
				}else{
					var $audio = $('#ui-audio').audio({
						auto: false,			// 是否自动播放，默认是true
						stopMode: 'stop',	// 停止模式是stop还是pause，默认stop
						audioUrl: H.lottery.thankshow[i].mu,
						steams:[],
						steamHeight: 150,
						steamWidth: 44
					});
					setTimeout(function() {
					     $audio.pause();
					     //$audio.stop();
					}, 2000);
					$(".ui-audio").removeClass("none")
				}
				this.$dialog.find("#not-lott").removeClass("none");
			    this.$dialog.find("#lott").addClass("none");
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
		if (data.result) {
			H.dialog.lottery.succ();
			return;
		}else{
			alert("系统繁忙，请稍候再试！");
			$('.loader').addClass('none');
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
})(Zepto);

$(function() {
    H.dialog.init();
});
