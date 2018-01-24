(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        iscroll: null,
        init: function() {
            var me = this;
            this.$container.delegate('.event-rules', 'click', function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            }).delegate('.btn-close', 'click', function(e) {
                e.preventDefault();
                $(this).closest('.modal').addClass('none');
            }).delegate('.btn-result', 'click', function(e) {
                e.preventDefault();
                H.dialog.result.open();
            }).delegate('.btn-receive', 'click', function(e) {
                e.preventDefault();
                H.dialog.receive.open();
            }).delegate('.closepop', 'click', function(e) {
                e.preventDefault();
                $(this).closest('.modal').addClass('none');
			}).delegate('.popbtn', 'click', function(e) {
                e.preventDefault();
                $(this).closest('.modal').addClass('none');
			})
			
			
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
                //top = $(window).scrollTop() + height * 0.06;
				top = height * 0.06;
				
            $('.modal').each(function() {
                //$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 - 30, 'top': top - 40})
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
                    'top': top,
                    'bottom': height * 0.06
                });
                var $box = $(this).find('.box');
                if ($box.length > 0) {
                    $box.css('height', height * 0.38);
                }
            });
        },
        
        
        // 规则
        rule: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();
                
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
                ._('<div class="dialog rule-dialog">')
				._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dn-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                ._("<h2></h2>")
                ._('<div class="content border">')
                ._('<div class="rule-con">')
				._("<h4>一、活动规则：</h4>")
                ._("<p>1.&nbsp;&nbsp;1. 股市开市日，收看甘肃卫视《交易日》</p>")
                ._("<p>2. 通过微信-摇一摇-电视，参与节目互动</p>")
                ._("<p>3. 参与调研互动，每参与一次，获一次抽奖机会</p>")
				._("<h4>二、活动奖品：</h4>")
				._("<p>1. 詹姆斯酿奢藏赤霞珠红酒</p>")
				._("<p>2. 达奇鸡尾酒</p>")
                ._("</div>")
                ._("</div>")
                ._('<p class="dialog-copyright">页面由甘肃卫视提供<br/>新掌趣科技制作 & Powered by holdfun.cn</p>')
                ._("</div>")
                ._("</section>");
                return t.toString();
            }
        },
        
       // 提示
        error: {
            $dialog: null,
            open: function (temp, openFn, closeFn, customTemp) {
                this.customTemp = null;
                this.innerText = temp;
                this.closeFn = closeFn;
                this.customTemp = customTemp;
                H.dialog.open.call(this);
                this.event();
                if (openFn) {
                    openFn(this.$dialog);
                }
                this.changeText();
            },
            event: function () {
                var b = this;
                this.$dialog.find("#showWin-sure").unbind("click").click(function (c) {
                    c.preventDefault();
                    b.close()
                })
            },
            close: function () {
                this.$dialog && this.$dialog.addClass("none");

                if (this.closeFn) {
                    this.closeFn(this.$dialog);
                }
            },
            getText: function () {
                return this.innerText;

            },
            changeText: function () {
                this.$dialog.find(".safety-text").html(this.getText());
            },
            tpl: function () {
                if (!this.customTemp) {
                    var b = simpleTpl();
                    b._('<section class="modal" id="guide-dialog">')
                    ._('<div class="receive pop-title">')
                    //._('<a href="#" class="closepop" data-collect="true" data-collect-flag="dn-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<p class="safety-text">' + this.getText())
                    ._('</p>')
					._('<a href="####" class="popbtn">嗯，我知道了</a>')
                    ._('</div>')
                    ._('</section>');
                    return b.toString()
                } else {
                    return this.customTemp(this);

                }

            }
        },
		
		// 层中提示
        poptips: {
            $dialog: null,
            open: function (temp, openFn, closeFn, customTemp) {
                this.customTemp = null;
                this.innerText = temp;
                this.closeFn = closeFn;
                this.customTemp = customTemp;
                H.dialog.open.call(this);
                this.event();
                if (openFn) {
                    openFn(this.$dialog);
                }
                this.changeText();
            },
            event: function () {
                var b = this;
                this.$dialog.find("#showWin-sure").unbind("click").click(function (c) {
                    c.preventDefault();
                    b.close()
                })
            },
            close: function () {
                this.$dialog && this.$dialog.addClass("none");

                if (this.closeFn) {
                    this.closeFn(this.$dialog);
                }
            },
            getText: function () {
                return this.innerText;

            },
            changeText: function () {
                this.$dialog.find(".safety-text").html(this.getText());
            },
            tpl: function () {
                if (!this.customTemp) {
                    var b = simpleTpl();
                    b._('<section class="modal popm" id="guide-dialog">')
                    ._('<div class="receive pop-title">')
                    //._('<a href="#" class="closepop" data-collect="true" data-collect-flag="dn-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<p class="safety-text">' + this.getText())
                    ._('</p>')
					._('<a href="####" class="popbtn">嗯，我知道了</a>')
                    ._('</div>')
                    ._('</section>');
                    return b.toString()
                } else {
                    return this.customTemp(this);

                }

            }
        },


        // 战绩榜
        record: {
            $dialog: null,
            open: function (temp, openFn, closeFn, customTemp) {
                this.customTemp = null;
                this.innerText = temp;
                this.closeFn = closeFn;
                this.customTemp = customTemp;
                H.dialog.open.call(this);
                this.event();
                if (openFn) {
                    openFn(this.$dialog);
                }
                this.changeText();
            },
            event: function () {
                var b = this;
                this.$dialog.find("#showWin-sure").unbind("click").click(function (c) {
                    c.preventDefault();
                    b.close()
                })
            },
            close: function () {
                this.$dialog && this.$dialog.addClass("none");

                if (this.closeFn) {
                    this.closeFn(this.$dialog);
                }
            },
            getText: function () {
                return this.innerText;

            },
            changeText: function () {
                this.$dialog.find(".safety-text").html(this.getText());
            },
            tpl: function () {
                if (!this.customTemp) {
                    var b = simpleTpl();
                    b._('<section class="modal" id="guide-dialog">')
                    ._('<div class="receive pop-title">')
                    ._('<a href="#" class="closepop" data-collect="true" data-collect-flag="dn-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
					._("<h3><span></span></h3>")
                    ._('<p class="safety-text">' + this.getText())
                    ._('</p>')
                    ._('</div>')
                    ._('</section>');
                    return b.toString()
                } else {
                    return this.customTemp(this);

                }

            }
        },

        
        // confirm
        confirm: {
            $dialog: null,
            $focus_obj: null,
            open: function($obj) {
                this.$focus_obj = $obj;
                if (this.$dialog) {
                    this.$dialog.removeClass('none');
                } else {
                    this.$dialog = $(this.tpl());
                    H.dialog.$container.append(this.$dialog);
                }
                H.dialog.relocate();
                this.event();
            },
            close: function() {
                this.$dialog && this.$dialog.addClass('none');
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-confirm').click(function(e) {
                    e.preventDefault();
                    //me.$focus_obj.focus();
                    me.close();
                });
            },
            tpl: function() {
                var t = simpleTpl();
                
                t._('<section class="modal" id="confirm-dialog">')
                    ._('<div class="dialog confirm-dialog relocated">')
                        ._('<div class="content">资料填写不全，将被视为自愿放弃奖品。</div>')
                        ._('<div class="ctrl">')
                            ._('<a href="#" class="btn btn-confirm">返回填写</a>')
                        ._('</div>')
                    ._('</div>')
                ._('</section>');
                
                return t.toString();
            }
        }
    };
    
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};
    
})(Zepto);

$(function() {
    H.dialog.init();
});
