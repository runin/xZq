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
                    'width': width * 0.86, 
                    'height': height * 0.7, 
                    'left': width * 0.07,
                    'right': width * 0.07,
                    'top': height * 0.15,
                    'bottom': height * 0.15
            });
         
            $(".rule-dialog .content").css({
                    'height': height*0.7-90, 
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
					$('.rule-dialog').removeClass('bounceOutDown');
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
						._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="tv-hebeitv-world-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2><img src="images/rul-title.png"></h2>')
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
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="tv-hebeitv-world-guide-trybtn" data-collect-desc="引导弹层-关闭按钮"></a></div>')
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
				if(H.lottery.type == 2){
						H.lottery.isCanShake = true;
					}else{
						H.lottery.isCanShake = false;
					}
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
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-hebeitv-world-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
							._('<div class="rank-title"><img src="images/rank-title.png"/>')
								._('<p>每天累计积分前三名可获得三斤装十八酒坊一瓶</p>')
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
		postcard: {
			$dialog: null,
            img:null,
            uid:null,
			open: function(img,uid) {
                this.img = img;
                this.uid = uid;
				H.dialog.open.call(this);
				this.event();
                var height = $(window).height(),
                    width = $(window).width();
                $(".postcard-dialog").css({
                    'width': width * 0.95,
                    'height': height * 0.70,
                    'left': width * 0.025,
                    'right': width * 0.025,
                    'top': height * 0.15,
                    'bottom': height * 0.15
                });
                $('html').bind("touchmove",function(e){
                    e.preventDefault();
                });
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
                this.$dialog.remove();
                this.$dialog = null;
                $('html').unbind("touchmove");
			},
			event: function() {
				var me = this;
				this.$dialog.find('#btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
                this.$dialog.find('#btn-send').click(function(e) {
					e.preventDefault();
                    if(me.check()){
                        var cont = {
                            "to":$(".to-in").val(),
                            "con":$(".con-in").val(),
                            "from":$(".from-in").val()
                        };
                        getResult("api/linesdiy/save",{
                            yoi: openid,
                            tuid:me.uid,
                            wxnn:nickname,
                            wximg:headimgurl,
                            jsdt:JSON.stringify(cont)
                        },"callbackLinesDiySaveHandler",true);
                    }
				});

			},
            check: function(){
                var $to = $(".ron").find(".to-in"),
                    $con = $(".ron").find(".con-in"),
                    $from = $(".ron").find(".from-in");
                var to = $to.val(),
                    con = $con.val(),
                    from = $from.val();
                if(to.length == 0 || to.length > 10){
                    showTips('请填写您要发送的人，不超过10个字哦！',4);
                    $to.focus();
                    return false;
                }
                if(con.length == 0 || con.length > 50){
                    showTips('请填写您的祝福，不超过50个字哦！',4);
                    $con.focus();
                    return false;
                }
                if(from.length == 0 || from.length > 10){
                    showTips('请填写您的姓名，不超过10个字哦！',4);
                    $from.focus();
                    return false;
                }
                return true;
            },
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rank-dialog">')
					._('<div class="dialog postcard-dialog">')
					    ._('<p class="tip">我要给你寄张明信片，就躺在你家门口的信箱里。</p>')
					    ._('<div class="content">')
                            ._('<img class="fr" src="'+this.img+'">')
                            ._('<div class="ron">')
                                ._('<p class="to">To:<input class="to-in" type="text"></p>')
                                ._('<textarea class="con-in" type="text"></textarea>')
                                ._('<p class="from">From:<input class="from-in" type="text"></p>')
                            ._('</div>')
						._('</div>')
                        ._('<p class="tip" id="send-tips">点击明信片即可填写，<br />  想送给谁，右上角给你指引。 </p>')
                        ._('<a href="#" class="btn-send" id="btn-send" data-collect="true" data-collect-flag="tv-hebeitv-world-postcard-sendbtn" data-collect-desc="明信片弹层-发送按钮">发送</a>')
                        ._('<a href="#" class="btn-send none" id="btn-close" data-collect="true" data-collect-flag="tv-hebeitv-world-postcard-closebtn" data-collect-desc="明信片弹层-关闭按钮">关闭</a>')
                    ._('</div>')
				._('</section>');
				return t.toString();
			},
            update: function(data){
                var to = data.to,
                    con = data.con,
                    from = data.from;
                $(".to-in").val(to);
                $(".con-in").val(con);
                $(".from-in").val(from);
                $("#btn-send").addClass("none");
                $("#btn-close").html("我也要玩");
                $("#btn-close").removeClass("none");
                this.$dialog.find(".tip").addClass("none");
                this.$dialog.find("input").attr("disabled","disabled");
                this.$dialog.find("textarea").attr("disabled","disabled");
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
	            this.$dialog.find('.erweima-close').click(function(e) {
					   e.preventDefault();
	                   $(".erweima-dialog").addClass("none");
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
					if($(this).hasClass("requesting")){
						return;
					}
					$(this).addClass("requesting");
                    shownewLoading();
					 me.sto = setTimeout(function(){
                         shownewLoading();
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
                        shownewLoading();
                        setTimeout(function(){
                        	hideNewLoading();
                        },1500)
                        window.location.href = $(this).attr("data-href") ;                  
                    }

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
					$(".erweima-dialog").removeClass("none");
				});
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="erweima-dialog none">')
						._('<a class="erweima-close" data-collect="true" data-collect-flag="tv-hebeitv-world-erweima-close-btn" data-collect-desc="中奖页面关闭按钮"></a>')
						._('<div class="erweima-box">')
							._('<span>关注二维码查询获奖信息</span>')
							._('<img class="erweima" src="images/blank.png" />')
							._('<span>扫码有惊喜</span>')
						 ._('</div>')	
				    ._('</div>')
					._('<div class="dialog lottery-dialog">')
						  //中奖
						._('<div class="lott none" id="lott">')
							._('<div class="lott-box">')
								._('<a class="lottery-close" data-collect="true" data-collect-flag="tv-hebeitv-world-lottery-close-btn" data-collect-desc="中奖页面关闭按钮"></a>')
								._('<div class="all-goods none">')
								    ._('<div class="gift-text">')
									    ._('<div class="gift"><img src="" /></div>')
										._('<h4 class="award-tip">请填写您的联系方式以便顺利领奖</h4>')
										._('<h4 class="awarded-tip none">以下是您的联系方式</h4>')
										._('<p class="p-name"><label>姓名</label><input type="text" class="name" id="name"/></p>')
										._('<p class="p-phone"><label>电话</label><input type="number" class="phone" id="phone" /></p>')
										._('<p class="p-address"><label>地址</label><input type="text" class="address" id="address" /></p>')
										 ._('<a class="good-btn good-btn-ok" id="yaoBtnGoodOK"  data-collect="true" data-collect-flag="tv-hebeitv-world-good-ok" data-collect-desc="摇奖页-实物奖提交按钮">领&nbsp&nbsp取<a/>')
										 ._('<a class="good-btn good-btn-back none" id="yaoBtnGoodBack" data-collect="true" data-collect-flag="tv-hebeitv-world-good-back" data-collect-desc="摇奖页-实物奖确认按钮">返&nbsp&nbsp回<a/>')
								 	._('</div>')
								._('</div>')
								._('<div class="quan none">')
								    ._('<div class="gift-text">')
									    ._('<h1 class="tip"></h1>')
									    ._('<div class="gift"><img src="images/blank.png" /></div>')
									    ._('<div class="btn-style">')
									    	._('<img src="images/border-top.png" />')
											._('<div class="btn-box">')
												._('<a class="good-btn good-btn-ok" id="yaoBtnQuanOK"  data-collect="true" data-collect-flag="tv-hebeitv-world-quan-ok" data-collect-desc="摇奖页-卡券领取按钮">领&nbsp&nbsp取<a/>')
										 	._('</div>')
										._('</div>')
								 	._('</div>')
								._('</div>')
								._('<div class="red-bao none">')
									._('<img class="red-head" src="images/red-head.png" />')
								    ._('<div class="gift-text">')
									    ._('<h1 class="tip"></h1>')
									    ._('<div class="gift"><img src="images/blank.png" /></div>')
										 ._('<a class="good-btn good-btn-ok" id="getRed"  data-collect="true" data-collect-flag="tv-hebeitv-world-redbao-ok" data-collect-desc="摇奖页-红包领取按钮">领&nbsp&nbsp取<a/>')
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
					this.$dialog.find("#not-lott").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
					me.pt = data.pt;
					 if(data.pt == 2||data.pt == 1){//积分奖品和实物奖品
						$(".all-goods .gift").find("img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
						$(".all-goods").find('#name').val(data.rn || '');
						$(".all-goods").find('#phone').val(data.ph || '');
						$(".all-goods").find('#address').val(data.ad || '');
						$(".erweima").attr("src",data.qc);
                    	$(".all-goods").find("#yaoBtnGoodBack").addClass("none");
                    	$(".all-goods").find("#yaoBtnGoodOK").removeClass("none");
                    	$(".all-goods").find("input").removeAttr("disabled");
                    	$(".all-goods").removeClass("none");
                    	$("#lott").removeClass("none");
					}else if(data.pt == 9||data.pt == 7){//外链奖品
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
						$(".red-bao").find(".gift img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
						$(".red-bao").find("#getRed").attr("href",data.rp);
						$("#lott").find(".red-bao").removeClass("none");
						$(".lottery-close").addClass("none");
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
