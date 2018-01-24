(function($) {
	H.dialog = {
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		clickFlag: true,
		funnyFlag: true,
        outurl :null,
		successFlag: true,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			}).delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
			}).delegate('.btn-result', 'click', function(e) {
				e.preventDefault();
				H.dialog.result.open();
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

			H.dialog.relocate();
		},
		relocate: function() {
			var height = $(window).height(),
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.06;

			$('.modal').each(function() {
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 + 5, 'top': height * 0.06 + 5})
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
					'top': height * 0.06,
					'bottom': height * 0.06
				});
				var $box = $(this).find('.box');
				if ($box.length > 0) {
					$box.css('height', height * 0.38);
				}
			});
		},
		guide: {
			$dialog: null,
			open: function() {
				var me = this, guideFlyW, guideFlyH, guideFlyMT, guideTipsT,
					winW = $(window).width(),
					winH = $(window).height();
				guideFlyW = guideFlyH = winW * 1.2;
				guideFlyMT = winH * 0.1;
				H.dialog.open.call(this);
				$('#guide-dialog .tips').css('top', Math.round(guideFlyMT + (guideFlyH * 0.26)));
				this.event();
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
						._('<div class="content">')
							._('<img class="rollcity" src="./images/index-guide.png">')
							._('<div class="tips">')
								._('<p>1.锁定旅游卫视《超级旅行团》</p>')
								._('<p>2.打开微信，进入摇一摇(电视)</p>')
								._('<p>3.对着电视摇一摇</p>')
								._('<p>4.年假旅行现金红包等你来拿</p>')
							._('</div>')
						._('</div>')
						._('<a href="#" class="btn-try" data-collect="true" data-collect-flag="ly-tour-guide-trybtn" data-collect-desc="引导弹层-关闭按钮">')
							._('<img src="./images/index-guide-btn.png">')
						._('</a>')
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
					ruleDH = this.$dialog.height(),
					ruleW = $('.rule-dialog').width();
				var ruleH = Math.ceil(810 * ruleW / 523);
				var ruleTop = Math.ceil((ruleDH - ruleH) / 2);
				var ruleRight = Math.ceil((winW - ruleW) / 2);
				$('.rule-dialog').css({'height': ruleH, 'top': ruleTop});
				$('#rule-dialog .btn-close').css({'top': ruleTop,'right': ruleRight-10});
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
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ly-tour-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
						._('<div class="content border">')
							._('<div class="rule none"></div>')
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
                        ._('<p class="tip" id="send-tips">在明信片相应位置点击即可填写。</p>')
                        ._('<a href="#" class="btn-send" id="btn-send" data-collect="true" data-collect-flag="ly-tour-postcard-sendbtn" data-collect-desc="明信片弹层-发送按钮">发送</a>')
                        ._('<a href="#" class="btn-send none" id="btn-close" data-collect="true" data-collect-flag="ly-tour-postcard-closebtn" data-collect-desc="明信片弹层-关闭按钮">关闭</a>')
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
                this.$dialog.find("textarea").addClass("border-no");
            }
		},
		funny: {
			$dialog: null,
			open: function() {
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
                var height = $(window).height(),
                    width = $(window).width();
                $(".funny-dialog").css({
                    'width': width * 0.75,
                    'height': height * 0.70,
                    'left': width * 0.125,
                    'right': width * 0.125,
                    'top': height * 0.15,
                    'bottom': height * 0.15
                });
                $("#funny-dialog").find('.btn-close').css({'right': width * 0.07, 'top': height * 0.15-15});
				this.event();
                $("#audio").get(0).play();
                H.lottery.canJump = false;
			},
			close: function() {
                H.lottery.canJump = true;
                this.$dialog && this.$dialog.remove();
                this.$dialog = null;
			},
			event: function() {
				var me = this;
                $("#funny-dialog").find('.btn-close').click(function(){
                    $("#audio").get(0).pause();
                    H.lottery.isCanShake = true;
                    me.close();
                });
			},
			tpl: function() {
                var state = getRandomArbitrary(1, 5);
				var t = simpleTpl();
				t._('<section class="modal" id="funny-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ly-tour-funnydialog-closebtn" data-collect-desc="随机图片弹层-关闭按钮"></a>')
					._('<div class="dialog funny-dialog">')
                    ._('<i></i><img src="./images/voice/'+state+'.jpg">')
                    ._('<audio preload="auto" id="audio" src="images/voice/'+state+'.mp3"></audio>')
                    ._('</div>')
				._('</section>');
				return t.toString();
			}
		},
        card: {
            $dialog: null,
            data:null,
            ci:null,
            ts:null,
            si:null,
            sto:null,
            open: function(data) {
                var me = this;
                me.data = data;
                if(data.pt == 7){
                    me.ci = data.ci;
                    me.ts = data.ts;
                    me.si = data.si;
                }
                H.dialog.open.call(this);
                var height = $(window).height(),
                    width = $(window).width();
                $(".card-dialog").css({
                    'width': width * 0.80,
                    'height': height * 0.60,
                    'left': width * 0.10,
                    'right': width * 0.10,
                    'top': height * 0.20,
                    'bottom': height * 0.20
                });
                $("#card-dialog").find('.btn-close').css({'right': width * 0.05, 'top': height * 0.20-15});
                this.event();
                this.readyFunc();
            },
            close: function() {
                H.lottery.canJump = true;
                this.$dialog && this.$dialog.remove();
                this.$dialog = null;
            },
            event: function() {
            },
            readyFunc:function(){
                var me = this;
                $('#btn-card-award').click(function(e) {
                    e.preventDefault();
                    shownewLoading();
                    me.sto = setTimeout(function(){
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    },15000);
                    if(!$('#btn-card-award').hasClass("flag")){
                        $('#btn-card-award').text("领取中");
                        $('#btn-card-award').addClass("flag");
                        me.close();
                        H.lottery.isCanShake = false;
                        setTimeout(function(){
                            me.wx_card();
                        },1000);
                    }

                });
            },
            wx_card:function(){
                var me = this;
                //卡券
                wx.addCard({
                    cardList: [{
                        cardId: me.ci,
                        cardExt: "{\"timestamp\":\""+ me.ts +"\",\"signature\":\""+ me.si +"\"}"
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
                        recordUserOperate(openid, res.errMsg, "card-fail");
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    },
                    cancel:function(){
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    }
                });
            },
            tpl: function() {
                var me = this;
                var t = simpleTpl();
                t._('<section class="modal" id="card-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ly-tour-carddialog-closebtn" data-collect-desc="卡券弹层-关闭按钮"></a>')
                    ._('<div class="dialog card-dialog">')
                    ._('<img class="card-congra" src="./images/congra.png">')
                    ._('<img class="prize-img" src="'+me.data.pi+'">')
                    ._('<a href="#" id="btn-card-award" class="btn btn-card-award" data-collect="true" data-collect-flag="ly-tour-carddialog-OKbtn" data-collect-desc="卡券弹层-确定按钮">领取</a>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
        urlCard: {
            $dialog: null,
            data:null,
            url:null,
            open: function(data) {
                var me = this;
                me.data = data;
                if(data.pt == 1){
                    H.dialog.urlCard.url = data.ru;
                }
                H.dialog.open.call(this);
                var height = $(window).height(),
                    width = $(window).width();
                $(".card-dialog").css({
                    'width': width * 0.75,
                    'height': height * 0.65,
                    'left': width * 0.125,
                    'right': width * 0.125,
                    'top': height * 0.15,
                    'bottom': height * 0.15
                });
                $("#urlcard-dialog").find('.btn-close').css({'right': width * 0.07, 'top': height * 0.15-15});
                this.event();
            },
            close: function() {
                H.lottery.canJump = true;
                this.$dialog && this.$dialog.remove();
                this.$dialog = null;
            },
            event: function() {
                var me = this;
                $('#btn-urlcard-award,.card-dialog').click(function(e) {
                    e.preventDefault();
                    shownewLoading();
                    if(!$('#btn-urlcard-award').hasClass("flag")){
                        $('#btn-urlcard-award').text("领取中");
                        $('#btn-urlcard-award').addClass("flag");
                        H.lottery.isCanShake = false;
                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                        setTimeout(function(){
                            location.href = me.url;
                        },500);
                    }

                });
            },
            tpl: function() {
                var me = this;
                var t = simpleTpl();
                t._('<section class="modal" id="urlcard-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ly-tour-carddialog-closebtn" data-collect-desc="卡券弹层-关闭按钮"></a>')
                    ._('<div class="dialog card-dialog">')
                    ._('<p class="award-tip">恭喜您，中奖啦！</p>')
                    ._('<img class="prize-img" src="'+me.data.pi+'">')
                    ._('<img class="wx-piao" src="./images/wx-piao.png">')
                    ._('<a href="#" id="btn-urlcard-award" class="btn btn-card-award" data-collect="true" data-collect-flag="ly-tour-carddialog-OKbtn" data-collect-desc="卡券弹层-确定按钮">领取</a>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
		fudai: {
			$dialog: null,
            data:null,
			open: function(data) {
				var me = this;
				H.dialog.open.call(this);
                me.data = data;
                $("#preload").attr("src",data.pi);
                H.lottery.canJump = false;
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this,
				$fudai = this.$dialog.find('.fudai');
				if (H.dialog.clickFlag) {
					H.dialog.clickFlag = false;
					$fudai.click(function(e) {
						e.preventDefault();
                        if(me.data.pt == 7){
                            //微信卡券（卡券互通）
                            H.dialog.card.open(me.data);
                        }else if(me.data.pt == 1){
                            //微信卡券（链接卡券）
                            H.dialog.urlCard.open(me.data);
                        }else{
                            H.dialog.lottery.open(me.data);
                        }
						me.close();
					});
				} else {
					return;
				};
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="fudai-dialog">')
					._('<div class="fudai fly" data-collect="true" data-collect-flag="ly-tour-fudaidialog-clickbtn" data-collect-desc="福袋弹层-点击按钮"></div>')
				._('</section>');
				return t.toString();
			}
		},
		lottery: {
			iscroll: null,
			$dialog: null,
			LOTTERIED_CLS: 'lotteried',
			REQUEST_CLS: 'requesting',
			AWARDED_CLS: 'lottery-awarded',
			LOTTERY_NONE_CLS: 'lottery-none',
			open: function(data) {
				var me = this, $dialog = this.$dialog,
				winW = $(window).width(),
				winH = $(window).height();
				hideLoading($dialog);
				H.dialog.open.call(this);
				if (!$dialog) {
					this.event();
				}
				this.$dialog && this.$dialog.removeClass('none');

				$('.lottery-dialog').css({
					'width': Math.round(winW * 0.9),
					'height': Math.round(winH * 0.8),
					'top' : Math.round(winH * 0.1),
					'left' : Math.round(winW * 0.05)
				});
				H.dialog.lottery.update(data);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-award').click(function(e) {
					e.preventDefault();
                    if(!$(this).hasClass("clicked")){
                        $(this).addClass("clicked");
                        $(this).html("领取中");
                        shownewLoading();
                        $.ajax({
                            type : "get",
                            async : true,
                            url :H.dialog.outurl,
                            dataType : "jsonp",
                            jsonp : "callback",
                            jsonpCallback : "callbackTokenHandler",
                            data : {
                            }
                        });
                    }
				});
                var me = this;
                $("#lottery-dialog").find('.btn-close').click(function(){
                    H.lottery.isCanShake = true;
                    me.close();
                });
			},
			update: function(data) {
				if (data != null && data != '') {
					if (data.result) {
                        H.dialog.outurl = data.ru;
						if (data.pt == 9) { //实物奖品
							this.$dialog.find('.prize-img').attr('src', (data.pi || ''));
						}
					}
				}
			},
			reset: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			close: function() {
                H.lottery.canJump = true;
                this.$dialog && this.$dialog.remove();
                this.$dialog = null;
			},
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="lottery-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ly-tour-successdialog-closebtn" data-collect-desc="领奖成功弹层-关闭按钮"></a>')
					._('<div class="dialog lottery-dialog">')
                        ._('<div class="award-win">')
                            ._('<div class="award-img">')
                                ._('<img class="prize-img" src="images/prize.png" />')
                            ._('</div>')
                            ._('<div class="contact">')
                                ._('<h4 class="award-tip">识别二维码，下载APP，得千元红包</h4>')
                                ._('<img class="qrcode" src="./images/qrcode.png" border="0">')
                                ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="ly-tour-lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮">领取</a>')
                            ._('</div>')
                        ._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
        qiandao: {
            $dialog: null,
            open: function() {
                var height = $(window).height(),
                    width = $(window).width();
                H.dialog.open.call(this);
                $(".qiandao-dialog").css({
                    'width': width * 0.88,
                    'height': height * 0.40,
                    'left': width * 0.06,
                    'right': width * 0.06,
                    'top': height * 0.30,
                    'bottom': height * 0.30
                });
                this.event();

                $('html').bind("touchmove",function(e){
                    e.preventDefault();
                });
            },
            close: function() {
                this.$dialog && this.$dialog.addClass('none');
                $('html').unbind("touchmove");
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-go').click(function(e) {
                    me.close();
                    var week = new Date().getDay();
                    location.href = "#bg"+week;
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="qiandao-dialog">')
                    ._('<div class="dialog qiandao-dialog">')
                    ._('<p>礼拜一“偶像周一见”，与主持人畅聊；<br>周二至周日每天“签到”，旅行线路低价买；</p>')
                    ._('<a href="#" class="btn-go" data-collect="true" data-collect-flag="ly-tour-qiandaodialog-closebtn" data-collect-desc="签到弹层-关闭按钮">我知道了</a>')
                    ._('</div>')
                 ._('</section>');
                return t.toString();
            }
        },
        line: {
            $dialog: null,
            signNum:0,
            signPrice:0,
            open: function(sn,sp) {
                var height = $(window).height(),
                    width = $(window).width();
                H.dialog.line.signNum = sn;
                H.dialog.line.signPrice = sp;
                H.dialog.open.call(this);
                $(".line-dialog").css({
                    'width': width * 0.70,
                    'height': height * 0.50,
                    'left': width * 0.15,
                    'right': width * 0.15,
                    'top': height * 0.25,
                    'bottom': height * 0.25
                });
                this.event();
                $('html').bind("touchmove",function(e){
                    e.preventDefault();
                });
            },
            close: function() {
                this.$dialog && this.$dialog.addClass('none');
                $('html').unbind("touchmove");
            },
            event: function() {
                var me = this;
                this.$dialog.click(function(e) {
                    me.close();
                });
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="line-dialog">')
                    ._('<div class="dialog line-dialog">')
                    ._('<p>嗨，本期你一共签了<span>'+H.dialog.line.signNum+'</span>次到哦，<br>我们已经贴心的为您减少了<span>'+H.dialog.line.signPrice+'</span>元，<br>现在，带上钱包快去看世界吧！</p>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        }
	};

	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
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


    W.callbackTokenHandler = function(data){
        var serial = data.serial;
        var signature = data.signature;
        var uri ="http://ut2o.com/promotion/weChatShake/"+serial+".html?signature="+signature;
        var redirect_uri = encodeURIComponent(uri);
        getResult('api/lottery/award', {
            oi: openid,
            hi: headimgurl,
            nn: nickname
        }, 'callbackLotteryAwardHandler');
        toUrl("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1b0ff719d4a2ea76&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_base&state=super1#wechat_redirect");
    }

    W.callbackLotteryAwardHandler = function(data){

    }
})(Zepto);

$(function() {
	H.dialog.init();
});