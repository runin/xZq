(function($) {
    H.dialog = {
        rollLotteryNum: 0,
        puid: 0,
        ci:null,
        ts:null,
        si:null,
        $container: $('body'),
        ruleData: null,
        init: function() {
            var me = this, height = $(window).height(), width = $(window).width();
            $('body').css({
                'width': width,
                'height': height
            });
            getResult('api/common/rule', {}, 'commonApiRuleHandler');
            $(".rule-btn").click(function(e){
                e.preventDefault();
                H.dialog.rule.open();
            });
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
            this.$dialog.animate({'opacity':'1'}, 500);
            this.$dialog.find('.dialog').addClass('bounceInDown');
            setTimeout(function(){
            	me.$dialog.find('.dialog').removeClass('bounceInDown');
            }, 1000);
        },
        relocate : function(){
        	var height = $(window).height(), width = $(window).width();
            $('.modal').each(function() {
                $(this).css({ 
                    'width': width, 
                    'height': height
                });
            });
        },
        rule: {
            $dialog: null,
            open: function () {
                H.dialog.open.call(this);
                this.event();
                this.pre_dom();
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutUp');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    $("#btn-rule").removeClass('requesting');
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                $(".dialog").css({
                    'width': "280px",
                    'height': "278px",
                    'left': Math.round((width-280)/2)+'px',
                    'top': Math.round((height-278)/2)+'px'
                });
            },
            event: function () {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function (e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function () {
                var t = simpleTpl();
                t._('<section class="modal modal-rule" id="rule-dialog">')
                    ._('<div class="dialog rule-dialog">')
                        ._('<a href="#" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-rule-btn-close" data-collect-desc="弹层(活动规则)-关闭按钮"></a>')
                        ._('<div class="dialog-content">')
                            ._('<h1>活动规则</h1>')
                            ._('<div class="rule-content">'+ H.dialog.ruleData +'</div>')
                        ._('</div>')
                    ._('</div>')
                ._('</section>');
                return t.toString();
            }
        },
        shiwuLottery: {
            $dialog: null,
            mobile: '',
            open: function(data) {
                var me =this, $dialog = this.$dialog;
                H.dialog.open.call(this);
                this.pre_dom();
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
            },
            pre_dom: function(){
                var width = $(window).width(),
                    height = $(window).height();
                $(".dialog").css({
                    'width': "280px",
                    'height': "278px",
                    'left': Math.round((width-280)/2)+'px',
                    'top': Math.round((height-278)/2)+'px'
                });
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceOutUp').addClass('bounceOutUp');
                this.$dialog.animate({'opacity':'0'}, 1000);
                setTimeout(function(){
                    H.index.clickFlag = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });

                this.$dialog.find('.back').click(function(e) {
                    e.preventDefault();
                    me.close();
                });

                this.$dialog.find('#btn-shiwuLottery').click(function(e) {
                    e.preventDefault();
                    if(!$('#btn-shiwuLottery').hasClass("flag")){
                        $('#btn-shiwuLottery').addClass("flag");
                        getResult('api/lottery/award', {
                            oi: openid
                        }, 'callbackLotteryAwardHandler');
                        $('.commint-before').addClass('none');
                        $('.commint-after').removeClass('none');
                    }
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    $("#shiwu-dialog").find(".tt").html(data.tt || '');
                    if(data.pt == 5){
                        $("#shiwu-dialog").find(".pi").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                        $("#shiwu-dialog").find(".cc").html(('兑换码：'+ data.cc) || '');
                        $("#shiwu-dialog").find(".aw").html(data.aw || '');
                        $(".award-div").removeClass('none');
                    }else if(data.pt == 0){
                        if(data.pi){
                            $("#shiwu-dialog").find(".pi").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                        }
                        $(".thank-div").removeClass('none');
                    }

                }else{
                    $(".thank-div").removeClass('none');
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-shiwu" id="shiwu-dialog">')
                    ._('<div class="dialog shiwu-dialog">')
                        ._('<a href="#" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-shiwu-btn-close" data-collect-desc="弹层-关闭按钮"></a>')

                        ._('<div class="award-div none">')
                            ._('<div class="dialog-content">')
                                ._('<img class="icon-congrats" src="./images/zhong-tlt.png">')
                                ._('<div class="commint-before ">')
                                    ._('<h2 class="tt"><!--恭喜您获得10元代金券1张--></h2>')
                                    ._('<img class="pi" src="">')
                                    ._('<a href="#" class="btn-items btn-shiwuLottery" id="btn-shiwuLottery" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery" data-collect-desc="弹层-领取按钮">点击领取</a>')
                                ._('</div>')

                                ._('<div class="commint-after none">')
                                    ._('<h2 class="tt"><!--恭喜您获得10元代金券1张--></h2>')
                                    ._('<img class="pi" src="">')
                                    ._('<h3 class="cc"><!--兑换码：21589546--></h3>')
                                    ._('<h4 class="aw"><!--特别提示：请您务必保存截图或记录兑 换码,否则将无法正常使用代金券。--></h4>')
                                    ._('<a href="#" class="btn-items back" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery" data-collect-desc="弹层-领取按钮">返 回</a>')
                                ._('</div>')
                            ._('</div>')
                        ._('</div>')

                        ._('<div class="thank-div none">')
                            ._('<div class="dialog-content">')
                                ._('<img class="icon-congrats" src="./images/not-tlt.png">')
                                ._('<div class="thank-after">')
                                    ._('<h2 class="tt">哎呀，你离奖券仅差0.1厘米！</h2>')
                                    ._('<img class="pi" src="images/not-jiang.png">')
                                    ._('<a href="#" class="btn-items back" data-collect="true" data-collect-flag="dialog-shiwu-btn-shiwuLottery" data-collect-desc="弹层-领取按钮">继续加油</a>')
                                ._('</div>')
                            ._('</div>')
                        ._('</div>')

                    ._('</div>')
                ._('</section>');
                return t.toString();
            }
        }
    };

    W.commonApiRuleHandler = function(data) {
		if(data.code == 0){
            H.dialog.ruleData = data.rule;
		}
	};

	W.callbackLotteryAwardHandler = function(data) {};
})(Zepto);

$(function() {
    H.dialog.init();
});
