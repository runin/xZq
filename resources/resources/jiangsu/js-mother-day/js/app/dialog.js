(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        iscroll: null,
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
            $('.modal').each(function() {
                $(this).css({ 
                    'width': width, 
                    'height': height, 
                    'left': 0,
                    'top': 0
                });
            });
             $(".lottery-dialog").css({
                    'width': width * 0.82, 
                    'height': height * 0.56, 
                    'left': width * 0.09,
                    'right': width * 0.09,
                    'top': height * 0.22,
                    'bottom': height * 0.22
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
                    'height': $(".rule-dialog").height() - 100+"px", 
            });
            $(".guide-dialog").css({
                    'width': width * 0.9, 
                    'height': height * 0.66, 
                    'left': width * 0.05,
                    'right': width * 0.05,
                    'top': height * 0.17,
                    'bottom': height * 0.17,
                    'padding-top': height * 0.66*0.2 
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
					    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="js-mother-day-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2>优惠券使用规则</h2>')
						._('<div class="content">')
							 ._('<div class="rule-con"></div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
				//引导
		guide: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();

				var me = this;
				setTimeout(function () {
					me.close();
				}, 8000);
			},
			event: function () {
				var me = this;
				this.$dialog.find('.btn-try').click(function (e) {
					e.preventDefault();
					me.close();
				});
			},
			close: function () {
				this.$dialog && this.$dialog.addClass('none');
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog">')
					._('<p>1.锁定江苏靓妆《靓妆直播间》；</p>')
					._('<p>2.打开微信进入摇一摇（电视）；</p>')
					._('<p>3.对着电视摇一摇；</p>')
					._('<p>4.参与互动就有机会赢取优惠券。</p>')
					._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="js-mother-day-guide-trybtn" data-collect-desc="江苏靓妆引导弹层-关闭按钮">等下去试试</a>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
        lottery: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					H.lottery.current_time();
					me.close();		
				});
				this.$dialog.find('#btn-award').click(function(e) {
					e.preventDefault();
					H.lottery.current_time();
					me.close();
				});
				
			},
	
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="js-mother-day-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						//未中奖
						._('<div class="not-lott none" id="not-lott">')
						    ._('<h1>很遗憾，没中奖！</h1>')
							._('<img src="images/sad.png">')
							._('<h2>没关系，机会还有哦~~</h2>')
						._('</div>')
						//中奖
						._('<div class="lott none" id="lott">')
						    ._('<h1>恭喜您中奖啦</h1>')
						    ._('<h2></h2>')
							._('<img src="">')
							._('<a class="btn" id="btn-award" data-collect="true" data-collect-flag="js-mother-day-combtn" data-collect-desc="江苏靓妆-确定按钮">领取优惠券</a>')
							
						._('</div>')
					._('</div>')
					._('</section>');
				return t.toString();
			},
			update: function(data) {
				if(data&& data.code == 0&&data.pt == 6 ){
					    $("#lott").find(".lott img").attr("src",data.pi);
					    $("#lott").find("h2").html(data.ptt);
						this.$dialog.find("#not-lott").addClass("none");
						this.$dialog.find("#lott").removeClass("none");
					}else{
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
