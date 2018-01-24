(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        redpack : '',
        iscroll: null,
        isJump :true, 
        outurl :null,
        resultUuid : null,
        goodsType:0,
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
            $(".lott").css({
                    'width': width * 0.90, 
                    'height': height * 0.74, 
                    'left': width * 0.05,
                    'right': width * 0.05,
                    'top': height * 0.13,
                    'bottom': height * 0.13
            });
            $(".rule-dialog").css({
                    'width': width * 0.86, 
                    'height': height * 0.8, 
                    'left': width * 0.07,
                    'right': width * 0.07,
                    'top': height * 0.10,
                    'bottom': height * 0.10
            });
            $(".rule-dialog .content").css({
                    'height': $(".rule-dialog").height()*0.74, 
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
					    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="tv-yunnan-soldier-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2></h2>')
						._('<div class="content">')
							 ._('<div class="rule-con"></div>')
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
					//me.close();
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
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="tv-yunnan-soldier-guide-trybtn" data-collect-desc="引导弹层-关闭按钮"></a></div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
        lottery: {
			$dialog: null,
			 ci:null,
            ts:null,
            si:null,
            pt:null,
            url:null,
            sto:null,
			open: function(resultUuid) {
				var me =this,$dialog = this.tpl();
				H.dialog.open.call(this);
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
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
					$(".showImg").attr("src","");
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
				
				
				
				this.$dialog.find('#yaoBtnBoxa').click(function(e) {
					e.preventDefault();
					if($(this).hasClass("requesting")){
						return;
					}
					$(this).addClass("requesting");
                    showLoading();
					 me.sto = setTimeout(function(){
                        hideLoading();
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
                        toUrl($(this).attr("data-href"));                   
                    }

				});
				
				this.$dialog.find('#yaoBtnGoodOK').click(function(e) {
					e.preventDefault();
					if($(this).hasClass("requesting")){
						return;
					}
					$(this).addClass("requesting");
					if ($('#qname').val().trim() == "") {
	               		showTips("请填写姓名！");
	               		$(this).removeClass("requesting");
	                	return false;
		            };
		            if ($('#qphone').val().trim() == "") {
		               showTips("请填写手机号码！");
		               $(this).removeClass("requesting");
		                return false;
		            };
		            if (!/^\d{11}$/.test($('#qphone').val())) {
		                showTips("这手机号，可打不通...");
		                $(this).removeClass("requesting");
		                return false;
		            };
		            if(H.dialog.goodsType==1){
		            	 if ($('#qaddress').val().length < 5 || $('#qaddress').val().length > 60) {
		                    showTips("地址长度应在5到60个字！");
		                    $(this).removeClass("requesting");
		                    return false;
		                };
		            }
	                var qgname = $.trim($('#qname').val()),
	                	qgmobile = $.trim($('#qphone').val()),
						qgaddress = $.trim($('#qaddress').val());
						qgidcard = $.trim($('#qidcard').val());
					$('.q-name label').text(qgname);
					$('.q-phone label').text(qgmobile);
					$('.q-address label').text(qgaddress);
					$('.q-idcard label').text(qgidcard);
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						ic : qgidcard,
						rn: encodeURIComponent(qgname),
						ph: qgmobile,
						ad: encodeURIComponent(qgaddress)
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
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
                        if(!H.lottery.bCountDown&&!H.lottery.isTimeOver){
							H.lottery.isCanShake = true;
						}else{
							H.lottery.isCanShake = false;
						}
                    },
                    cancel:function(){
                        hideLoading();
                    }
                });
            },
			checkGood: function() {
				e.preventDefault();
			},

			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
				          ._('<div class="not-lott none" id="not-lott">')
						      ._('<div class="gift-text">')
						           ._('<div class="ui-audio" id="ui-audio">')
							            ._('<div id="coffee-flow" class="coffee-flow">')
							            ._('<a href="#" class="audio-icon"></a>')
							        ._(' </div>')
							       ._(' </div>')
						       		._('<img class="showImg" src="" />')
						      ._('</div>')
							._('<a class="back-index" data-collect="true" data-collect-flag="tv-yunnan-soldier-notlott-btn" data-collect-desc="士兵突击-未中奖返回按钮"></a>')
						  ._('</div>')
						
						//中奖
					._('<div class="dialog">')
						//未中奖
						._('<div class="lott none" id="lott">')
						._('<a class="lottery-close" data-collect="true" data-collect-flag="tv-yunnan-soldier-lottery-close-btn" data-collect-desc="士兵突击-中奖页面关闭按钮"></a>')
						    //中红包
							._('<div class="redhongbao none">')
						        ._('<div class="gift-hongbao">')
						      	    ._('<img class="award-title" src="images/award-title.png" />')
						      	    ._('<img class="award-info none" src="" />')
						        ._('</div>')
						        ._('<a name="" type="button" class="btn-a open" id="openRed" value="" data-collect="true" data-collect-flag="tv-yunnan-soldier-redpack-open" data-collect-desc="打开红包" /></a>')
						        ._('<a name="" type="button" class="btn-a get none" id="getRed" value="" data-collect="true" data-collect-flag="tv-yunnan-soldier-redpack-get" data-collect-desc="领取红包" /></a>')
   							._(' </div>')
							//中实物奖(变为外链奖品data.pt == 9)
							._('<div class="goods none">')
							 ._('<h1 class="tip"></h1>')
						      ._('<div class="gift"><img src="" /></div>')
						      ._('<div class="gift-text">')
							  ._('<a class="btn-a" id="yaoBtnBoxa"  data-collect="true" data-collect-flag="tv-yunnan-soldier-sbt" data-collect-desc="摇奖提交领奖"> <a/>')
						     ._(' </div>')
							._('</div>')
							//实物奖品(data.pt == 1)
							._('<div class="all-goods none">')
							 ._('<h1 class="tip"></h1>')
						      ._('<div class="gift"><img src="" /></div>')
						      ._('<div class="gift-text">')
								._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
								._('<h4 class="awarded-tip none">以下是您的联系方式</h4>')
								 ._('<div class="contact"><img src="" /></div>')
								._('<input type="text" class="qname" id="qname" placeholder="请填写您的真实姓名" />')
								._('<input type="number" class="qphone" id="qphone" placeholder="请填写您的真实电话号码" />')
								._('<input type="text" class="qaddress none" id="qaddress" placeholder="请填写您的真实收件地址" />')
								._('<input type="text" class="qidcard none" id="qidcard" placeholder="请填写您身份证（选填）" />')
							    ._('<p class="q-info q-name none">姓名:<label></label></p>')
							    ._('<p class="q-info q-phone none">电话:<label></label></p>')
							    ._('<p class="q-info q-address none">地址:<label></label></p>')
							    ._('<p class="q-info q-idcard none">身份证:<label></label></p>')
							    ._('<a class="good-btn good-btn-ok" id="yaoBtnGoodOK"  data-collect="true" data-collect-flag="tv-yunnan-soldier-good-ok" data-collect-desc="摇奖页-实物奖提交按钮"><img src="./images/btn.png"><a/>')
							    ._('<a class="good-btn good-btn-back none" id="yaoBtnGoodBack" data-collect="true" data-collect-flag="tv-yunnan-soldier-good-back" data-collect-desc="摇奖页-实物奖确认按钮"><img src="./images/return.png"><a/>')
						     ._(' </div>')
							._('</div>')
						
					  ._('</div>')
					._('</div>');
				return t.toString();
			},
			//摇一摇抽奖
			update: function(data) {
	            //接口回调成功且中奖
	            var me = this;
					this.$dialog.find("#not-lott").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
					me.pt = data.pt;
					if(data.pt == 1){//实物奖品
						if(data.aw == 1){
							H.dialog.goodsType = 1;
							$("#lott .all-goods").find('#qaddress').removeClass("none");
							$("#lott .all-goods").find('#qidcard').addClass("none")
						}else if(data.aw == 2){
							H.dialog.goodsType = 2;
							$("#lott .all-goods").find('#qaddress').addClass("none");
							$("#lott .all-goods").find('#qidcard').removeClass("none")
						}
						$("#lott .all-goods").find(".tip").html(data.tt);
						$("#lott .all-goods .gift").find("img").attr("src",data.pi);
						$("#lott .all-goods").find('#qname').val(data.rn || '');
						$("#lott .all-goods").find('#qphone').val(data.ph || '');
						$("#lott .all-goods").find('#qaddress').val(data.ad || '');
                    	$("#lott .all-goods").find("#yaoBtnGoodBack").addClass("none");
                    	$("#lott .all-goods").find("#yaoBtnGoodOK").removeClass("none");
                    	$("#lott .all-goods").find("input").removeAttr("disabled");
                    	$("#lott .redbao").addClass("none");
                    	$("#lott .goods").addClass("none");
                    	$("#lott .all-goods").removeClass("none");
                    	$(".dialog").removeClass("none");
					}else if(data.pt == 9||data.pt == 7){//外链奖品
						if(data.pt === 7){
   							me.ci = data.ci;
			                me.ts = data.ts;
			                me.si = data.si;
   						}
   						if(data.pt === 9){
   							this.$dialog.find('#yaoBtnBoxa').attr('data-href',data.ru);
   						}
						$("#lott .goods").find(".tip").html(data.tt);
						$("#lott .goods").find("img").attr("src",data.pi);
                    	$("#lott .all-goods").addClass("none");
                    	$("#lott .redbao").addClass("none");
                    	$("#lott .goods").removeClass("none");
                    	$(".dialog").removeClass("none");
					}else if(data.pt == 4){//现金红包
						$(".lott").css("background","none");
						$(".redhongbao").find(".award-info").attr("src",data.pi);
						$(".redhongbao").find("#getRed").attr("href",data.rp);
						$("#lott").find(".redhongbao").removeClass("none");
                    	$("#lott .all-goods").addClass("none");
                    	$("#lott .goods").addClass("none");
						$(".dialog").removeClass("none");
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
				this.$dialog.find(".dialog").addClass("none");
				this.$dialog.find("#not-lott").removeClass("none");
			    this.$dialog.find("#lott").addClass("none");
			},
			succ :function(){
				$("#yaoBtnBoxa").removeClass("requesting");
				$("#yaoBtnBoxa").addClass("none");
				$("#yaoBtnBoxb").removeClass("none");
				$('#yaoBtnGoodOK').addClass('none');
				$('#yaoBtnGoodBack').removeClass('none');
				$(".warm-tip").removeClass("none");
				$("input.textphone").addClass("none");
				$("p.textphone").removeClass("none");
				$(".title").html("以下是您的手机号码");
				$(".dialog").find("input").attr("disabled","disabled");
				$('.award-tip').addClass('none');
				$(".awarded-tip").removeClass("none");
				$('.q-info').removeClass('none');
				if(H.dialog.goodsType==1){
					$('.q-idcard').addClass("none");
				}else{
					$('.q-address').addClass("none");
				}
				$(".all-goods input").addClass('none');
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
			if(H.dialog.lottery.pt =1){
				H.dialog.lottery.succ();
			}
			return;
		}else{
			alert("系统繁忙，请稍候再试！");
			$('.loader').addClass('none');
		}
	};
    
})(Zepto);

$(function() {
    H.dialog.init();
});
