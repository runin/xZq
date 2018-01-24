(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        redpack : '',
        iscroll: null,
        isJump :true,   
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
            $(".rule-dialog").css({
                    'width': width * 0.82, 
                    'height': height * 0.7, 
                    'left': width * 0.09,
                    'right': width * 0.09,
                    'top': height * 0.15,
                    'bottom': height * 0.15
            });
            $(".rule-dialog .content").css({
                    'height': $(".rule-dialog").height() - 80, 
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
					    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="cctv7-food-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2>活动规则</h2>')
						._('<div class="content">')
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
                H.lottery.canJump = false;
				H.lottery.isCanShake = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
				   this.event();
				}
			},
			close: function() {
                H.lottery.canJump = true;
				this.$dialog && this.$dialog.addClass('none');
				H.lottery.isCanShake = true;
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.close();
					if(H.lottery.isJump){
						toUrl("enter.html");
					}else{
						H.lottery.leftActivityCount();
						$("#btn-lottery").rotate({
			                angle : 0,
			                animateTo : 0
			            });
					}
				});
				this.$dialog.find('#btn-award').click(function(e) {
					e.preventDefault();
					me.close();
					showLoading();
					location.href = H.dialog.redpack;

				});
				this.$dialog.find('.redBao img').click(function(e) {
					e.preventDefault();
					me.close();
					location.href = H.dialog.redpack;
				});
				
			},
	
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog">')
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="cctv7-food-lott-dialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						//未中奖
						._('<div class="not-lott" id="not-lott">')
							._('<h1>很遗憾您与红包失之交臂，别泄气  </h1>')
							._('<p class="ltp"></p>')
						._('</div>')
						//中奖
						._('<div class="lott none" id="lott">')
							._('<img src="">')
							._('<h1>恭喜您</h1>')
							._('<p class="ltp"></p>')		
							._('<span class="redBao">')
							    ._('<img src=""/>')
								._('<a class="btn-award" id="btn-award" data-collect="true" data-collect-flag="cctv7-food-combtn" data-collect-desc="食尚大转盘抽奖弹层-确定按钮"></a>')	
							._('</span>')
						._('</div>')
					  ._('</div>')
					._('</div>');
				return t.toString();
			},
			update: function(data) {
				if(data&& data.result == true&&data.pt == 4 ){
					    $("#lott").find(".redBao img").attr("src",data.pi);
					    $("#lott").find(".ltp").html(data.tt);
					    H.dialog.redpack = data.rp;
						this.$dialog.find("#not-lott").addClass("none");
						this.$dialog.find("#lott").removeClass("none");
					}else if(data&& data.result == true&&data.pt == 0){
						$("#not-lott").find(".ltp").html(data.tt);
						this.$dialog.find("#lott").addClass("none");
						this.$dialog.find("#not-lott").removeClass("none");
					}else{
						H.dialog.isJump = false;
						$("#not-lott").find(".ltp").html("<span>祝您好运</span>");
						this.$dialog.find("#lott").addClass("none");
						this.$dialog.find("#not-lott").removeClass("none");	
					}
			}
		},

    };
    
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};
	W.newseyeAwardHandler = function(data) {
		if (data.code == 0) {
			H.dialog.lottery.enable();
			H.dialog.lottery.succ();
			return;
		}else{
			alert("系统繁忙，请稍候再试！");
			$('.loader').addClass('none');
			$('#btn-award').removeClass('none');
		}
	}
    
})(Zepto);

$(function() {
    H.dialog.init();
});
