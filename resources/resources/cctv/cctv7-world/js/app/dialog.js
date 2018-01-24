(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        redpack : '',
        iscroll: null,
        isJump :true,   
        init: function() {
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
            $(".thanks-dialog").css({
                'width': width * 0.75,
                'height': height * 0.75,
                'left': width * 0.125,
                'right': width * 0.125,
                'top': height * 0.125,
                'bottom': height * 0.125
            });
            $(".lottery-dialog").css({
                'width': width * 0.75,
                'height': height * 0.75,
                'left': width * 0.125,
                'right': width * 0.125,
                'top': height * 0.125,
                'bottom': height * 0.125
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
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
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
					    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="cctv7-world-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2>活动规则</h2>')
						._('<div class="content">')
							 ._('<div class="rule-con"></div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
        // 规则
        thanks: {
            $dialog: null,
            open: function () {
                var me = this;
                H.dialog.open.call(this);
                this.event();
                setTimeout(function(){
                    me.close();
                },1500);
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                setTimeout(function(){
                    H.lottery.isCanShake = true;
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
                this.$dialog.find('.thanks-close').click(function (e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function () {
                var t = simpleTpl();
                t._('<section class="modal modal-rul" id="thanks-dialog">')
                    ._('<div class="dialog thanks-dialog">')
                    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="cctv7-world-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<p class="con">没中你就不摇了？还有老多老多啦！不要停，继续摇！</p>')
                    ._('<a class="thanks-close" data-collect="true" data-collect-flag="cctv7-world-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮">继续加油</a>')
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
			open: function(data) {
				H.lottery.isCanShake = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
                me.update(data);
               this.event();
               this.readyFunc();
			},
			close: function() {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                setTimeout(function(){
                    H.lottery.isCanShake = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
			},
			event: function() {
				var me = this;
                $('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
			},
            readyFunc:function(){
                var me = this;
                $('#btn-award').click(function(e) {
                    e.preventDefault();
                    shownewLoading();
                    me.sto = setTimeout(function(){
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    },15000);
                    if(!$('#btn-award').hasClass("flag")){
                        $('#btn-award').text("领取中");
                        $('#btn-award').addClass("flag");
                        me.close();
                        H.lottery.isCanShake = false;
                        if(me.pt == 7 || me.pt == 14){
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
                            setTimeout(function(){
                                location.href = me.url;
                            },500);
                        }
                    }

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
                        recordUserOperate(openid, res.errMsg, "cctv7-world-card-fail");
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
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="cctv7-world-lott-dialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						._('<div class="lott" id="lott">')
							._('<img src="">')
						    ._('<a class="btn-award" id="btn-award" data-collect="true" data-collect-flag="cctv7-world-combtn" data-collect-desc="抽奖弹层-确定按钮">领取</a>')
						._('</div>')
					  ._('</div>')
					._('</div>');
				return t.toString();
			},
			update: function(data) {
                var me = this;
                me.pt = data.pt;
                if(data.result && (data.pt == 7 || data.pt == 14)){
                    $("#lott").find("img").attr("src",data.pi);
                    me.ci = data.ci;
                    me.ts = data.ts;
                    me.si = data.si;
                }else if(data.result && data.pt == 9){
                    $("#lott").find("img").attr("src",data.pi);
                    me.url = data.ru;
                }
			}
		}

    };
    
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};
	W.callbackLotteryAwardHandler = function(data) {
	}
    
})(Zepto);

$(function() {
    H.dialog.init();
});
